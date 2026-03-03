import { http } from './httpClient.js';
import { endpoints } from './endpoints.js';

const cache = new Map();

function cacheKey(url, params) {
  if (!params) {
    return url;
  }

  const entries = Object.entries(params)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => [String(key), value == null ? '' : String(value)]);

  entries.sort((a, b) => a[0].localeCompare(b[0]));
  return (
    `${url}?` +
    entries.map(([key, value]) => `${key}=${encodeURIComponent(value)}`).join('&')
  );
}

function cacheGet(key) {
  const entry = cache.get(key);
  if (!entry) {
    return null;
  }

  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }

  return entry.value;
}

function cacheSet(key, value, ttlMs) {
  cache.set(key, { value, expiresAt: Date.now() + ttlMs });
}

function invalidate(...prefixes) {
  for (const prefix of prefixes) {
    for (const key of cache.keys()) {
      if (key.startsWith(prefix)) {
        cache.delete(key);
      }
    }
  }
}

async function cachedGet(url, { params, ttlMs = 60_000 } = {}) {
  const key = cacheKey(url, params);
  const hit = cacheGet(key);

  if (hit !== null) {
    return hit;
  }

  const response = await http.get(url, params ? { params } : undefined);
  cacheSet(key, response.data, ttlMs);
  return response.data;
}

export const api = {
  listTenants: async (type) =>
    cachedGet(endpoints.tenants(), {
      params: type ? { type } : undefined,
      ttlMs: 5 * 60_000,
    }),

  getTenant: async (tenantId) =>
    cachedGet(endpoints.tenantById(tenantId), { ttlMs: 5 * 60_000 }),

  getTenantBySlug: async (slug) =>
    cachedGet(endpoints.tenantBySlug(slug), { ttlMs: 5 * 60_000 }),

  createTenant: async (body) => {
    const data = (await http.post(endpoints.tenants(), body)).data;
    invalidate(endpoints.tenants());
    return data;
  },

  updateTenant: async (tenantId, body) => {
    const data = (await http.patch(endpoints.tenantById(tenantId), body)).data;
    invalidate(endpoints.tenants(), endpoints.tenantById(tenantId));
    return data;
  },

  deleteTenant: async (tenantId) => {
    const data = (await http.delete(endpoints.tenantById(tenantId))).data;
    invalidate(endpoints.tenants(), endpoints.tenantById(tenantId));
    return data;
  },

  listLocations: async (tenantId) =>
    cachedGet(endpoints.locations(tenantId), { ttlMs: 5 * 60_000 }),

  getLocation: async (tenantId, locationId) =>
    cachedGet(endpoints.locationById(tenantId, locationId), {
      ttlMs: 5 * 60_000,
    }),

  createLocation: async (tenantId, body) => {
    const data = (await http.post(endpoints.locations(tenantId), body)).data;
    invalidate(endpoints.locations(tenantId));
    return data;
  },

  updateLocation: async (tenantId, locationId, body) => {
    const data = (
      await http.patch(endpoints.locationById(tenantId, locationId), body)
    ).data;
    invalidate(
      endpoints.locations(tenantId),
      endpoints.locationById(tenantId, locationId)
    );
    return data;
  },

  deleteLocation: async (tenantId, locationId) => {
    const data = (
      await http.delete(endpoints.locationById(tenantId, locationId))
    ).data;
    invalidate(
      endpoints.locations(tenantId),
      endpoints.locationById(tenantId, locationId)
    );
    return data;
  },

  listMenus: async (tenantId, locationId) =>
    cachedGet(endpoints.menus(tenantId), {
      params: locationId ? { locationId } : undefined,
      ttlMs: 2 * 60_000,
    }),

  listAvailableMenus: async (tenantId, locationId) =>
    cachedGet(endpoints.menusAvailable(tenantId), {
      params: locationId ? { locationId } : undefined,
      ttlMs: 60_000,
    }),

  getMenu: async (tenantId, menuId) =>
    cachedGet(endpoints.menuById(tenantId, menuId), { ttlMs: 2 * 60_000 }),

  getMenuTree: async (tenantId, menuId) =>
    cachedGet(endpoints.menuTree(tenantId, menuId), { ttlMs: 2 * 60_000 }),

  createMenu: async (tenantId, body) => {
    const data = (await http.post(endpoints.menus(tenantId), body)).data;
    invalidate(endpoints.menus(tenantId));
    return data;
  },

  updateMenu: async (tenantId, menuId, body) => {
    const data = (await http.patch(endpoints.menuById(tenantId, menuId), body))
      .data;
    invalidate(endpoints.menus(tenantId), endpoints.menuById(tenantId, menuId));
    return data;
  },

  deleteMenu: async (tenantId, menuId) => {
    const data = (await http.delete(endpoints.menuById(tenantId, menuId))).data;
    invalidate(endpoints.menus(tenantId), endpoints.menuById(tenantId, menuId));
    return data;
  },

  listCategories: async (menuId) =>
    cachedGet(endpoints.categories(menuId), { ttlMs: 2 * 60_000 }),

  getCategory: async (menuId, categoryId) =>
    cachedGet(endpoints.categoryById(menuId, categoryId), {
      ttlMs: 2 * 60_000,
    }),

  getCategoryWithItems: async (menuId, categoryId) =>
    cachedGet(endpoints.categoryItems(menuId, categoryId), { ttlMs: 60_000 }),

  createCategory: async (menuId, body) => {
    const data = (await http.post(endpoints.categories(menuId), body)).data;
    invalidate(endpoints.categories(menuId));
    return data;
  },

  reorderCategories: async (menuId, body) => {
    const data = (await http.patch(endpoints.categoriesReorder(menuId), body))
      .data;
    invalidate(endpoints.categories(menuId));
    return data;
  },

  updateCategory: async (menuId, categoryId, body) => {
    const data = (
      await http.patch(endpoints.categoryById(menuId, categoryId), body)
    ).data;
    invalidate(endpoints.categories(menuId), endpoints.categoryById(menuId, categoryId));
    return data;
  },

  deleteCategory: async (menuId, categoryId) => {
    const data = (await http.delete(endpoints.categoryById(menuId, categoryId)))
      .data;
    invalidate(endpoints.categories(menuId), endpoints.categoryById(menuId, categoryId));
    return data;
  },

  listItems: async (tenantId, categoryId) =>
    cachedGet(endpoints.items(tenantId), {
      params: categoryId ? { categoryId } : undefined,
      ttlMs: 2 * 60_000,
    }),

  searchItems: async (tenantId, q) =>
    (await http.get(endpoints.itemsSearch(tenantId), { params: { q } })).data,

  listFeaturedItems: async (tenantId) =>
    cachedGet(endpoints.itemsFeatured(tenantId), { ttlMs: 5 * 60_000 }),

  getItem: async (tenantId, itemId) =>
    cachedGet(endpoints.itemById(tenantId, itemId), { ttlMs: 2 * 60_000 }),

  getItemWithModifiers: async (tenantId, itemId) =>
    cachedGet(endpoints.itemModifiers(tenantId, itemId), { ttlMs: 2 * 60_000 }),

  createItem: async (tenantId, body) => {
    const data = (await http.post(endpoints.items(tenantId), body)).data;
    invalidate(endpoints.items(tenantId));
    return data;
  },

  updateItem: async (tenantId, itemId, body) => {
    const data = (await http.patch(endpoints.itemById(tenantId, itemId), body))
      .data;
    invalidate(endpoints.items(tenantId), endpoints.itemById(tenantId, itemId));
    return data;
  },

  syncItemModifierGroups: async (tenantId, itemId, modifierGroupIds) => {
    const data = (
      await http.put(endpoints.itemModifierGroups(tenantId, itemId), {
        modifierGroupIds,
      })
    ).data;
    invalidate(
      endpoints.items(tenantId),
      endpoints.itemById(tenantId, itemId),
      endpoints.itemModifiers(tenantId, itemId)
    );
    return data;
  },

  deleteItem: async (tenantId, itemId) => {
    const data = (await http.delete(endpoints.itemById(tenantId, itemId))).data;
    invalidate(endpoints.items(tenantId), endpoints.itemById(tenantId, itemId));
    return data;
  },

  listModifierGroups: async (tenantId) =>
    cachedGet(endpoints.modifierGroups(tenantId), { ttlMs: 5 * 60_000 }),

  getModifierGroup: async (tenantId, groupId) =>
    cachedGet(endpoints.modifierGroupById(tenantId, groupId), {
      ttlMs: 5 * 60_000,
    }),

  getModifierGroupWithOptions: async (tenantId, groupId) =>
    cachedGet(endpoints.modifierGroupOptions(tenantId, groupId), {
      ttlMs: 5 * 60_000,
    }),

  createModifierGroup: async (tenantId, body) => {
    const data = (await http.post(endpoints.modifierGroups(tenantId), body))
      .data;
    invalidate(endpoints.modifierGroups(tenantId));
    return data;
  },

  updateModifierGroup: async (tenantId, groupId, body) => {
    const data = (
      await http.patch(endpoints.modifierGroupById(tenantId, groupId), body)
    ).data;
    invalidate(
      endpoints.modifierGroups(tenantId),
      endpoints.modifierGroupById(tenantId, groupId)
    );
    return data;
  },

  deleteModifierGroup: async (tenantId, groupId) => {
    const data = (
      await http.delete(endpoints.modifierGroupById(tenantId, groupId))
    ).data;
    invalidate(
      endpoints.modifierGroups(tenantId),
      endpoints.modifierGroupById(tenantId, groupId)
    );
    return data;
  },

  listModifierOptions: async (groupId) =>
    cachedGet(endpoints.modifierOptions(groupId), { ttlMs: 5 * 60_000 }),

  getModifierOption: async (groupId, optionId) =>
    cachedGet(endpoints.modifierOptionById(groupId, optionId), {
      ttlMs: 5 * 60_000,
    }),

  createModifierOption: async (groupId, body) => {
    const data = (await http.post(endpoints.modifierOptions(groupId), body))
      .data;
    invalidate(endpoints.modifierOptions(groupId));
    return data;
  },

  reorderModifierOptions: async (groupId, body) => {
    const data = (
      await http.patch(endpoints.modifierOptionsReorder(groupId), body)
    ).data;
    invalidate(endpoints.modifierOptions(groupId));
    return data;
  },

  updateModifierOption: async (groupId, optionId, body) => {
    const data = (
      await http.patch(endpoints.modifierOptionById(groupId, optionId), body)
    ).data;
    invalidate(
      endpoints.modifierOptions(groupId),
      endpoints.modifierOptionById(groupId, optionId)
    );
    return data;
  },

  deleteModifierOption: async (groupId, optionId) => {
    const data = (
      await http.delete(endpoints.modifierOptionById(groupId, optionId))
    ).data;
    invalidate(
      endpoints.modifierOptions(groupId),
      endpoints.modifierOptionById(groupId, optionId)
    );
    return data;
  },

  listInventory: async (tenantId, params) =>
    cachedGet(endpoints.inventory(tenantId), { params, ttlMs: 30_000 }),

  listLowStock: async (tenantId) =>
    cachedGet(endpoints.inventoryLowStock(tenantId), { ttlMs: 30_000 }),

  getInventoryItem: async (tenantId, inventoryId) =>
    cachedGet(endpoints.inventoryById(tenantId, inventoryId), {
      ttlMs: 30_000,
    }),

  createInventoryItem: async (tenantId, body) => {
    const data = (await http.post(endpoints.inventory(tenantId), body)).data;
    invalidate(endpoints.inventory(tenantId));
    return data;
  },

  updateInventoryItem: async (tenantId, inventoryId, body) => {
    const data = (
      await http.patch(endpoints.inventoryById(tenantId, inventoryId), body)
    ).data;
    invalidate(
      endpoints.inventory(tenantId),
      endpoints.inventoryById(tenantId, inventoryId)
    );
    return data;
  },

  adjustInventory: async (tenantId, inventoryId, delta) => {
    const data = (
      await http.patch(endpoints.inventoryAdjust(tenantId, inventoryId), {
        delta,
      })
    ).data;
    invalidate(
      endpoints.inventory(tenantId),
      endpoints.inventoryById(tenantId, inventoryId),
      endpoints.inventoryLowStock(tenantId)
    );
    return data;
  },

  deleteInventoryItem: async (tenantId, inventoryId) => {
    const data = (
      await http.delete(endpoints.inventoryById(tenantId, inventoryId))
    ).data;
    invalidate(
      endpoints.inventory(tenantId),
      endpoints.inventoryById(tenantId, inventoryId)
    );
    return data;
  },

  listCustomers: async (tenantId, params) =>
    cachedGet(endpoints.customers(tenantId), { params, ttlMs: 60_000 }),

  searchCustomers: async (tenantId, q) =>
    (await http.get(endpoints.customersSearch(tenantId), { params: { q } })).data,

  getCustomer: async (tenantId, customerId) =>
    cachedGet(endpoints.customerById(tenantId, customerId), {
      ttlMs: 2 * 60_000,
    }),

  createCustomer: async (tenantId, body) => {
    const data = (await http.post(endpoints.customers(tenantId), body)).data;
    invalidate(endpoints.customers(tenantId));
    return data;
  },

  findOrCreateCustomer: async (tenantId, body) =>
    (await http.post(endpoints.customerFindOrCreate(tenantId), body)).data,

  updateCustomer: async (tenantId, customerId, body) => {
    const data = (
      await http.patch(endpoints.customerById(tenantId, customerId), body)
    ).data;
    invalidate(
      endpoints.customers(tenantId),
      endpoints.customerById(tenantId, customerId)
    );
    return data;
  },

  deleteCustomer: async (tenantId, customerId) => {
    const data = (
      await http.delete(endpoints.customerById(tenantId, customerId))
    ).data;
    invalidate(
      endpoints.customers(tenantId),
      endpoints.customerById(tenantId, customerId)
    );
    return data;
  },

  listOrders: async (tenantId, params) =>
    cachedGet(endpoints.orders(tenantId), { params, ttlMs: 15_000 }),

  listOrdersFresh: async (tenantId, params) =>
    (await http.get(endpoints.orders(tenantId), { params })).data,

  listActiveOrders: async (tenantId, locationId) =>
    (
      await http.get(endpoints.ordersActive(tenantId), {
        params: { locationId },
      })
    ).data,

  getRevenueSummary: async (tenantId, from, to) =>
    cachedGet(endpoints.ordersRevenue(tenantId), {
      params: { from, to },
      ttlMs: 5 * 60_000,
    }),

  getOrder: async (tenantId, orderId) =>
    cachedGet(endpoints.orderById(tenantId, orderId), { ttlMs: 30_000 }),

  createOrder: async (tenantId, body) => {
    const data = (await http.post(endpoints.orders(tenantId), body)).data;
    invalidate(endpoints.orders(tenantId));
    return data;
  },

  updateOrder: async (tenantId, orderId, body) => {
    const data = (
      await http.patch(endpoints.orderById(tenantId, orderId), body)
    ).data;
    invalidate(endpoints.orders(tenantId), endpoints.orderById(tenantId, orderId));
    return data;
  },

  updateOrderStatus: async (tenantId, orderId, status) => {
    const data = (
      await http.patch(endpoints.orderStatus(tenantId, orderId), { status })
    ).data;
    invalidate(endpoints.orders(tenantId), endpoints.orderById(tenantId, orderId));
    return data;
  },

  deleteOrder: async (tenantId, orderId) => {
    const data = (await http.delete(endpoints.orderById(tenantId, orderId)))
      .data;
    invalidate(endpoints.orders(tenantId), endpoints.orderById(tenantId, orderId));
    return data;
  },

  listPayments: async (tenantId, orderId) =>
    cachedGet(endpoints.payments(tenantId, orderId), { ttlMs: 30_000 }),

  getPaymentsBalance: async (tenantId, orderId) =>
    (await http.get(endpoints.paymentsBalance(tenantId, orderId))).data,

  getPayment: async (tenantId, orderId, paymentId) =>
    cachedGet(endpoints.paymentById(tenantId, orderId, paymentId), {
      ttlMs: 30_000,
    }),

  createPayment: async (tenantId, orderId, body) => {
    const data = (await http.post(endpoints.payments(tenantId, orderId), body))
      .data;
    invalidate(
      endpoints.payments(tenantId, orderId),
      endpoints.orderById(tenantId, orderId)
    );
    return data;
  },

  markPaymentPaid: async (tenantId, orderId, paymentId, reference) => {
    const data = (
      await http.patch(endpoints.paymentPay(tenantId, orderId, paymentId), {
        reference,
      })
    ).data;
    invalidate(
      endpoints.payments(tenantId, orderId),
      endpoints.paymentById(tenantId, orderId, paymentId),
      endpoints.orderById(tenantId, orderId)
    );
    return data;
  },

  markPaymentRefunded: async (tenantId, orderId, paymentId) => {
    const data = (
      await http.patch(endpoints.paymentRefund(tenantId, orderId, paymentId), {})
    ).data;
    invalidate(
      endpoints.payments(tenantId, orderId),
      endpoints.paymentById(tenantId, orderId, paymentId),
      endpoints.orderById(tenantId, orderId)
    );
    return data;
  },
};
