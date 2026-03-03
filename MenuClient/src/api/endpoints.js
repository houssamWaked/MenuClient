/**
 * Menu API endpoint helpers (paths only).
 *
 * Keep this file "dumb": no HTTP calls here—just route builders.
 */

export const endpoints = {
  // ─── Tenants ────────────────────────────────────────────────────────────────
  tenants: () => '/api/v1/tenants',
  tenantById: (tenantId) => `/api/v1/tenants/${tenantId}`,
  tenantBySlug: (slug) => `/api/v1/tenants/slug/${slug}`,

  // ─── Locations ──────────────────────────────────────────────────────────────
  locations: (tenantId) => `/api/v1/tenants/${tenantId}/locations`,
  locationById: (tenantId, locationId) =>
    `/api/v1/tenants/${tenantId}/locations/${locationId}`,

  // ─── Menus ──────────────────────────────────────────────────────────────────
  menus: (tenantId) => `/api/v1/tenants/${tenantId}/menus`,
  menusAvailable: (tenantId) => `/api/v1/tenants/${tenantId}/menus/available`,
  menuById: (tenantId, menuId) => `/api/v1/tenants/${tenantId}/menus/${menuId}`,
  menuTree: (tenantId, menuId) =>
    `/api/v1/tenants/${tenantId}/menus/${menuId}/tree`,

  // ─── Categories ─────────────────────────────────────────────────────────────
  categories: (menuId) => `/api/v1/menus/${menuId}/categories`,
  categoryById: (menuId, categoryId) =>
    `/api/v1/menus/${menuId}/categories/${categoryId}`,
  categoryItems: (menuId, categoryId) =>
    `/api/v1/menus/${menuId}/categories/${categoryId}/items`,
  categoriesReorder: (menuId) => `/api/v1/menus/${menuId}/categories/reorder`,

  // ─── Menu Items ─────────────────────────────────────────────────────────────
  items: (tenantId) => `/api/v1/tenants/${tenantId}/items`,
  itemsSearch: (tenantId) => `/api/v1/tenants/${tenantId}/items/search`,
  itemsFeatured: (tenantId) => `/api/v1/tenants/${tenantId}/items/featured`,
  itemById: (tenantId, itemId) => `/api/v1/tenants/${tenantId}/items/${itemId}`,
  itemModifiers: (tenantId, itemId) =>
    `/api/v1/tenants/${tenantId}/items/${itemId}/modifiers`,
  itemModifierGroups: (tenantId, itemId) =>
    `/api/v1/tenants/${tenantId}/items/${itemId}/modifier-groups`,

  // ─── Modifier Groups ────────────────────────────────────────────────────────
  modifierGroups: (tenantId) => `/api/v1/tenants/${tenantId}/modifier-groups`,
  modifierGroupById: (tenantId, groupId) =>
    `/api/v1/tenants/${tenantId}/modifier-groups/${groupId}`,
  modifierGroupOptions: (tenantId, groupId) =>
    `/api/v1/tenants/${tenantId}/modifier-groups/${groupId}/options`,

  // ─── Modifier Options ───────────────────────────────────────────────────────
  modifierOptions: (groupId) => `/api/v1/modifier-groups/${groupId}/options`,
  modifierOptionById: (groupId, optionId) =>
    `/api/v1/modifier-groups/${groupId}/options/${optionId}`,
  modifierOptionsReorder: (groupId) =>
    `/api/v1/modifier-groups/${groupId}/options/reorder`,

  // ─── Inventory ──────────────────────────────────────────────────────────────
  inventory: (tenantId) => `/api/v1/tenants/${tenantId}/inventory`,
  inventoryLowStock: (tenantId) =>
    `/api/v1/tenants/${tenantId}/inventory/low-stock`,
  inventoryById: (tenantId, inventoryId) =>
    `/api/v1/tenants/${tenantId}/inventory/${inventoryId}`,
  inventoryAdjust: (tenantId, inventoryId) =>
    `/api/v1/tenants/${tenantId}/inventory/${inventoryId}/adjust`,

  // ─── Customers ──────────────────────────────────────────────────────────────
  customers: (tenantId) => `/api/v1/tenants/${tenantId}/customers`,
  customersSearch: (tenantId) => `/api/v1/tenants/${tenantId}/customers/search`,
  customerFindOrCreate: (tenantId) =>
    `/api/v1/tenants/${tenantId}/customers/find-or-create`,
  customerById: (tenantId, customerId) =>
    `/api/v1/tenants/${tenantId}/customers/${customerId}`,

  // ─── Orders ─────────────────────────────────────────────────────────────────
  orders: (tenantId) => `/api/v1/tenants/${tenantId}/orders`,
  ordersActive: (tenantId) => `/api/v1/tenants/${tenantId}/orders/active`,
  ordersRevenue: (tenantId) => `/api/v1/tenants/${tenantId}/orders/revenue`,
  orderById: (tenantId, orderId) =>
    `/api/v1/tenants/${tenantId}/orders/${orderId}`,
  orderStatus: (tenantId, orderId) =>
    `/api/v1/tenants/${tenantId}/orders/${orderId}/status`,

  // ─── Payments ───────────────────────────────────────────────────────────────
  payments: (tenantId, orderId) =>
    `/api/v1/tenants/${tenantId}/orders/${orderId}/payments`,
  paymentsBalance: (tenantId, orderId) =>
    `/api/v1/tenants/${tenantId}/orders/${orderId}/payments/balance`,
  paymentById: (tenantId, orderId, paymentId) =>
    `/api/v1/tenants/${tenantId}/orders/${orderId}/payments/${paymentId}`,
  paymentPay: (tenantId, orderId, paymentId) =>
    `/api/v1/tenants/${tenantId}/orders/${orderId}/payments/${paymentId}/pay`,
  paymentRefund: (tenantId, orderId, paymentId) =>
    `/api/v1/tenants/${tenantId}/orders/${orderId}/payments/${paymentId}/refund`,
};
