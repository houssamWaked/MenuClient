import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  archiveCategory,
  archiveItem,
  archiveMenu,
  createCategory,
  createItem,
  createMenu,
  createTenant,
  createTenantAdmin,
  fetchMyDashboard,
  fetchTenantAdmins,
  fetchTenantDashboard,
  fetchTenants,
  updateCategory,
  updateItem,
  updateMenu,
  updateSiteContent,
  updateTenantAdmin,
} from '../api/adminApi.js';

function formatMoney(value) {
  const amount = Number(value) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(value) {
  if (!value) {
    return 'Never';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Never';
  }

  return date.toLocaleString();
}

export function AdminDashboard({ user, onLogout }) {
  const isSuperAdmin = user?.role === 'super_admin';
  const [tenants, setTenants] = useState([]);
  const [selectedTenantId, setSelectedTenantId] = useState(user?.tenant?.id ?? '');
  const [dashboard, setDashboard] = useState(null);
  const [tenantAdmins, setTenantAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [newTenant, setNewTenant] = useState({
    name: '',
    slug: '',
    type: 'restaurant',
    currency: 'USD',
    timezone: 'UTC',
  });
  const [newTenantAdmin, setNewTenantAdmin] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'owner',
  });
  const [accountDraft, setAccountDraft] = useState({
    fullName: user.fullName ?? '',
    email: user.email ?? '',
    password: '',
  });
  const [adminDrafts, setAdminDrafts] = useState({});

  const [newMenu, setNewMenu] = useState({ name: '', description: '' });
  const [newCategory, setNewCategory] = useState({ menuId: '', name: '', description: '' });
  const [newItem, setNewItem] = useState({
    categoryId: '',
    name: '',
    description: '',
    imageUrl: '',
    basePrice: '',
    isFeatured: false,
  });
  const [menuDrafts, setMenuDrafts] = useState({});
  const [categoryDrafts, setCategoryDrafts] = useState({});
  const [itemDrafts, setItemDrafts] = useState({});
  const [contentDraft, setContentDraft] = useState({
    menuTitle: '',
    menuEyebrow: '',
    aboutTitle: '',
    heroTitleTop: '',
    heroTitleMiddle: '',
  });

  const activeTenantId = isSuperAdmin
    ? selectedTenantId
    : dashboard?.tenant?.id ?? user?.tenant?.id ?? '';
  const tenantName = dashboard?.tenant?.name ?? user?.tenant?.name ?? 'Tenant';
  const tenantSlug = dashboard?.tenant?.slug ?? user?.tenant?.slug ?? '';

  const menus = useMemo(
    () => [...(dashboard?.menus ?? [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [dashboard?.menus]
  );
  const categories = useMemo(
    () =>
      [...(dashboard?.categories ?? [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [dashboard?.categories]
  );
  const items = useMemo(
    () => [...(dashboard?.items ?? [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [dashboard?.items]
  );

  const stats = useMemo(
    () => [
      { label: 'Menus', value: menus.length },
      { label: 'Categories', value: categories.length },
      { label: 'Items', value: items.length },
      {
        label: 'Avg Item Price',
        value: items.length
          ? formatMoney(
              items.reduce((sum, item) => sum + (Number(item.basePrice) || 0), 0) / items.length
            )
          : '$0.00',
      },
    ],
    [menus.length, categories.length, items]
  );

  const initDashboardDrafts = useCallback((payload) => {
    const nextMenuDrafts = {};
    for (const menu of payload?.menus ?? []) {
      nextMenuDrafts[menu.id] = {
        name: menu.name ?? '',
        description: menu.description ?? '',
        sortOrder: menu.sortOrder ?? 0,
        isActive: Boolean(menu.isActive),
      };
    }
    setMenuDrafts(nextMenuDrafts);

    const nextCategoryDrafts = {};
    for (const category of payload?.categories ?? []) {
      nextCategoryDrafts[category.id] = {
        menuId: category.menuId ?? '',
        name: category.name ?? '',
        description: category.description ?? '',
        sortOrder: category.sortOrder ?? 0,
        isActive: Boolean(category.isActive),
      };
    }
    setCategoryDrafts(nextCategoryDrafts);

    const nextItemDrafts = {};
    for (const item of payload?.items ?? []) {
      nextItemDrafts[item.id] = {
        categoryId: item.categoryId ?? '',
        name: item.name ?? '',
        description: item.description ?? '',
        imageUrl: item.imageUrl ?? '',
        basePrice: Number(item.basePrice) || 0,
        sortOrder: item.sortOrder ?? 0,
        isFeatured: Boolean(item.isFeatured),
        isAvailable: Boolean(item.isAvailable),
      };
    }
    setItemDrafts(nextItemDrafts);

    const siteContent = payload?.siteContent ?? {};
    setContentDraft({
      menuTitle: siteContent.theme?.menuTitle ?? '',
      menuEyebrow: siteContent.theme?.menuEyebrow ?? '',
      aboutTitle: siteContent.about?.title ?? '',
      heroTitleTop: siteContent.hero?.titleTop ?? '',
      heroTitleMiddle: siteContent.hero?.titleMiddle ?? '',
    });

    setNewCategory((state) => ({ ...state, menuId: payload?.menus?.[0]?.id ?? '' }));
    setNewItem((state) => ({ ...state, categoryId: payload?.categories?.[0]?.id ?? '' }));
  }, []);

  const initAdminDrafts = useCallback((users) => {
    const nextDrafts = {};
    for (const admin of users) {
      nextDrafts[admin.id] = {
        fullName: admin.fullName ?? '',
        email: admin.email ?? '',
        role: admin.role ?? 'owner',
        isActive: Boolean(admin.isActive),
        password: '',
      };
    }
    setAdminDrafts(nextDrafts);
  }, []);

  const loadTenants = useCallback(async () => {
    if (!isSuperAdmin) {
      return [];
    }

    const data = await fetchTenants();
    setTenants(data);
    setSelectedTenantId((current) => {
      if (current && data.some((tenant) => tenant.id === current)) {
        return current;
      }
      return data[0]?.id ?? '';
    });
    return data;
  }, [isSuperAdmin]);

  const loadDashboard = useCallback(
    async (tenantIdOverride = null) => {
      const tenantIdForLoad = tenantIdOverride ?? activeTenantId;

      if (isSuperAdmin && !tenantIdForLoad) {
        setDashboard(null);
        setTenantAdmins([]);
        return;
      }

      const payload = isSuperAdmin
        ? await fetchTenantDashboard(tenantIdForLoad)
        : await fetchMyDashboard();

      setDashboard(payload);
      initDashboardDrafts(payload);
      if (!isSuperAdmin && payload?.tenant?.id) {
        setSelectedTenantId(payload.tenant.id);
      }

      const admins = await fetchTenantAdmins(payload.tenant.id);
      setTenantAdmins(admins);
      initAdminDrafts(admins);
    },
    [activeTenantId, initAdminDrafts, initDashboardDrafts, isSuperAdmin]
  );

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError('');
      try {
        if (isSuperAdmin) {
          const allTenants = await loadTenants();
          const firstTenantId = allTenants[0]?.id ?? '';
          if (firstTenantId) {
            await loadDashboard(firstTenantId);
          }
        } else {
          await loadDashboard();
        }
      } catch (requestError) {
        setError(requestError?.response?.data?.message ?? requestError?.message ?? 'Failed to load dashboard.');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [isSuperAdmin, loadDashboard, loadTenants]);

  useEffect(() => {
    if (!isSuperAdmin || !selectedTenantId) {
      return;
    }

    const refreshSelectedTenant = async () => {
      setError('');
      try {
        await loadDashboard(selectedTenantId);
      } catch (requestError) {
        setError(
          requestError?.response?.data?.message ??
            requestError?.message ??
            'Failed to load tenant dashboard.'
        );
      }
    };

    refreshSelectedTenant();
  }, [isSuperAdmin, loadDashboard, selectedTenantId]);

  const runAction = async (action, successMessage) => {
    if (!activeTenantId) {
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccess('');
    try {
      await action(activeTenantId);
      await loadDashboard(activeTenantId);
      if (isSuperAdmin) {
        await loadTenants();
      }
      setSuccess(successMessage);
    } catch (requestError) {
      setError(requestError?.response?.data?.message ?? requestError?.message ?? 'Action failed.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <main className="admin-loader">
        <div className="admin-loader__spinner" />
        <p>Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <h2>Admin Dashboard</h2>
          <p>{user.fullName || user.email || user.username}</p>
          {tenantSlug ? <p>{tenantSlug}</p> : null}
        </div>

        <button className="admin-sidebar__reload" onClick={() => loadDashboard()} type="button">
          Refresh
        </button>

        {isSuperAdmin ? (
          <div className="admin-sidebar__tenant-list">
            {tenants.map((tenant) => (
              <button
                className={tenant.id === selectedTenantId ? 'is-active' : ''}
                key={tenant.id}
                onClick={() => setSelectedTenantId(tenant.id)}
                type="button"
              >
                <strong>{tenant.name}</strong>
                <span>{tenant.slug}</span>
              </button>
            ))}
          </div>
        ) : null}

        <button className="admin-sidebar__logout" onClick={onLogout} type="button">
          Logout
        </button>
      </aside>

      <section className="admin-main">
        <header className="admin-main__header">
          <div>
            <p className="admin-main__eyebrow">{isSuperAdmin ? 'Super Admin' : 'Tenant Admin'}</p>
            <h1>{tenantName}</h1>
          </div>
          {isSaving ? <span className="admin-main__saving">Saving...</span> : null}
        </header>

        {error ? <div className="admin-alert admin-alert--error">{error}</div> : null}
        {success ? <div className="admin-alert admin-alert--success">{success}</div> : null}

        <section className="admin-stats">
          {stats.map((entry) => (
            <article key={entry.label}>
              <h3>{entry.label}</h3>
              <p>{entry.value}</p>
            </article>
          ))}
        </section>

        {isSuperAdmin ? (
          <section className="admin-grid">
            <article className="admin-panel">
              <h2>Create Tenant</h2>
              <form
                className="admin-form"
                onSubmit={async (event) => {
                  event.preventDefault();
                  if (!newTenant.name.trim() || !newTenant.slug.trim()) return;
                  setIsSaving(true);
                  setError('');
                  setSuccess('');
                  try {
                    const created = await createTenant({
                      name: newTenant.name.trim(),
                      slug: newTenant.slug.trim().toLowerCase(),
                      type: newTenant.type,
                      currency: newTenant.currency.trim().toUpperCase(),
                      timezone: newTenant.timezone.trim() || 'UTC',
                    });
                    await loadTenants();
                    setSelectedTenantId(created?.id ?? '');
                    setSuccess('Tenant created.');
                    setNewTenant({
                      name: '',
                      slug: '',
                      type: 'restaurant',
                      currency: 'USD',
                      timezone: 'UTC',
                    });
                  } catch (requestError) {
                    setError(requestError?.response?.data?.message ?? requestError?.message ?? 'Action failed.');
                  } finally {
                    setIsSaving(false);
                  }
                }}
              >
                <input value={newTenant.name} onChange={(e) => setNewTenant((s) => ({ ...s, name: e.target.value }))} placeholder="Tenant name" required />
                <input value={newTenant.slug} onChange={(e) => setNewTenant((s) => ({ ...s, slug: e.target.value }))} placeholder="tenant-slug" required />
                <select value={newTenant.type} onChange={(e) => setNewTenant((s) => ({ ...s, type: e.target.value }))}>
                  <option value="restaurant">restaurant</option>
                  <option value="coffee_shop">coffee_shop</option>
                  <option value="bakery">bakery</option>
                  <option value="food_truck">food_truck</option>
                  <option value="bar">bar</option>
                  <option value="other">other</option>
                </select>
                <button disabled={isSaving} type="submit">Create Tenant</button>
              </form>
            </article>

            <article className="admin-panel">
              <h2>Create Tenant Admin</h2>
              <form
                className="admin-form"
                onSubmit={async (event) => {
                  event.preventDefault();
                  if (!activeTenantId || !newTenantAdmin.email.trim() || !newTenantAdmin.password.trim()) return;
                  await runAction(async (tenantId) => {
                    await createTenantAdmin(tenantId, {
                      fullName: newTenantAdmin.fullName.trim() || null,
                      email: newTenantAdmin.email.trim(),
                      password: newTenantAdmin.password.trim(),
                      role: newTenantAdmin.role,
                    });
                    setNewTenantAdmin({ fullName: '', email: '', password: '', role: 'owner' });
                  }, 'Tenant admin account created.');
                }}
              >
                <input value={newTenantAdmin.fullName} onChange={(e) => setNewTenantAdmin((s) => ({ ...s, fullName: e.target.value }))} placeholder="Full name (optional)" />
                <input value={newTenantAdmin.email} onChange={(e) => setNewTenantAdmin((s) => ({ ...s, email: e.target.value }))} placeholder="Email" type="email" required />
                <input value={newTenantAdmin.password} onChange={(e) => setNewTenantAdmin((s) => ({ ...s, password: e.target.value }))} placeholder="Password" type="password" minLength={6} required />
                <select value={newTenantAdmin.role} onChange={(e) => setNewTenantAdmin((s) => ({ ...s, role: e.target.value }))}>
                  <option value="owner">owner</option>
                  <option value="manager">manager</option>
                  <option value="editor">editor</option>
                </select>
                <button disabled={isSaving || !activeTenantId} type="submit">Create Account</button>
              </form>
            </article>
          </section>
        ) : null}

        <section className="admin-panel">
          <h2>Tenant Admin Accounts</h2>
          <div className="admin-list">
            {tenantAdmins.map((adminUser) => {
              const draft = adminDrafts[adminUser.id] ?? {};
              const canEdit = isSuperAdmin || adminUser.id === user.id;
              return (
                <div className="admin-row admin-row--admin" key={adminUser.id}>
                  <input value={draft.fullName ?? ''} onChange={(e) => setAdminDrafts((s) => ({ ...s, [adminUser.id]: { ...draft, fullName: e.target.value } }))} disabled={!canEdit} />
                  <input value={draft.email ?? ''} type="email" onChange={(e) => setAdminDrafts((s) => ({ ...s, [adminUser.id]: { ...draft, email: e.target.value } }))} disabled={!canEdit} />
                  <select value={draft.role ?? 'owner'} onChange={(e) => setAdminDrafts((s) => ({ ...s, [adminUser.id]: { ...draft, role: e.target.value } }))} disabled={!isSuperAdmin}>
                    <option value="owner">owner</option>
                    <option value="manager">manager</option>
                    <option value="editor">editor</option>
                  </select>
                  <label><input type="checkbox" checked={Boolean(draft.isActive)} onChange={(e) => setAdminDrafts((s) => ({ ...s, [adminUser.id]: { ...draft, isActive: e.target.checked } }))} disabled={!isSuperAdmin} />Active</label>
                  <input value={draft.password ?? ''} type="password" minLength={6} placeholder="New password" onChange={(e) => setAdminDrafts((s) => ({ ...s, [adminUser.id]: { ...draft, password: e.target.value } }))} disabled={!canEdit} />
                  <span className="admin-row__hint">Last login: {formatDate(adminUser.lastLoginAt)}</span>
                  <button disabled={isSaving || !canEdit} onClick={() => runAction(async (tenantId) => {
                    const payload = {
                      fullName: draft.fullName?.trim() || null,
                      email: draft.email?.trim(),
                      role: draft.role,
                      isActive: Boolean(draft.isActive),
                    };
                    if (draft.password?.trim()) payload.password = draft.password.trim();
                    await updateTenantAdmin(tenantId, adminUser.id, payload);
                  }, 'Account updated.')} type="button">Save</button>
                </div>
              );
            })}
          </div>
        </section>

        <section className="admin-grid">
          <article className="admin-panel">
            <h2>Create Menu</h2>
            <form className="admin-form" onSubmit={async (e) => {
              e.preventDefault();
              if (!newMenu.name.trim()) return;
              await runAction((tenantId) => createMenu(tenantId, { name: newMenu.name.trim(), description: newMenu.description.trim() || null }), 'Menu created.');
              setNewMenu({ name: '', description: '' });
            }}>
              <input value={newMenu.name} onChange={(e) => setNewMenu((s) => ({ ...s, name: e.target.value }))} placeholder="Menu name" required />
              <textarea value={newMenu.description} rows={2} onChange={(e) => setNewMenu((s) => ({ ...s, description: e.target.value }))} placeholder="Description" />
              <button disabled={isSaving} type="submit">Add Menu</button>
            </form>
          </article>

          <article className="admin-panel">
            <h2>Create Category</h2>
            <form className="admin-form" onSubmit={async (e) => {
              e.preventDefault();
              if (!newCategory.menuId || !newCategory.name.trim()) return;
              await runAction((tenantId) => createCategory(tenantId, { menuId: newCategory.menuId, name: newCategory.name.trim(), description: newCategory.description.trim() || null }), 'Category created.');
              setNewCategory((s) => ({ ...s, name: '', description: '' }));
            }}>
              <select value={newCategory.menuId} onChange={(e) => setNewCategory((s) => ({ ...s, menuId: e.target.value }))} required>
                <option value="">Select menu</option>
                {menus.map((menu) => <option key={menu.id} value={menu.id}>{menu.name}</option>)}
              </select>
              <input value={newCategory.name} onChange={(e) => setNewCategory((s) => ({ ...s, name: e.target.value }))} placeholder="Category name" required />
              <textarea value={newCategory.description} rows={2} onChange={(e) => setNewCategory((s) => ({ ...s, description: e.target.value }))} placeholder="Description" />
              <button disabled={isSaving} type="submit">Add Category</button>
            </form>
          </article>

          <article className="admin-panel">
            <h2>Create Item</h2>
            <form className="admin-form" onSubmit={async (e) => {
              e.preventDefault();
              if (!newItem.categoryId || !newItem.name.trim()) return;
              await runAction((tenantId) => createItem(tenantId, {
                categoryId: newItem.categoryId,
                name: newItem.name.trim(),
                description: newItem.description.trim() || null,
                imageUrl: newItem.imageUrl.trim() || null,
                basePrice: Number(newItem.basePrice) || 0,
                isFeatured: newItem.isFeatured,
              }), 'Item created.');
              setNewItem((s) => ({ ...s, name: '', description: '', imageUrl: '', basePrice: '', isFeatured: false }));
            }}>
              <select value={newItem.categoryId} onChange={(e) => setNewItem((s) => ({ ...s, categoryId: e.target.value }))} required>
                <option value="">Select category</option>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
              <input value={newItem.name} onChange={(e) => setNewItem((s) => ({ ...s, name: e.target.value }))} placeholder="Item name" required />
              <input value={newItem.basePrice} onChange={(e) => setNewItem((s) => ({ ...s, basePrice: e.target.value }))} placeholder="Price" type="number" step="0.01" required />
              <input value={newItem.imageUrl} onChange={(e) => setNewItem((s) => ({ ...s, imageUrl: e.target.value }))} placeholder="Image URL" />
              <button disabled={isSaving} type="submit">Add Item</button>
            </form>
          </article>
        </section>

        <section className="admin-panel">
          <h2>Manage Existing Data</h2>
          <div className="admin-list">
            {menus.map((menu) => {
              const draft = menuDrafts[menu.id] ?? {};
              return (
                <div className="admin-row" key={menu.id}>
                  <input value={draft.name ?? ''} onChange={(e) => setMenuDrafts((s) => ({ ...s, [menu.id]: { ...draft, name: e.target.value } }))} />
                  <input value={draft.description ?? ''} onChange={(e) => setMenuDrafts((s) => ({ ...s, [menu.id]: { ...draft, description: e.target.value } }))} />
                  <button disabled={isSaving} onClick={() => runAction((tenantId) => updateMenu(tenantId, menu.id, menuDrafts[menu.id]), 'Menu updated.')} type="button">Save</button>
                  <button className="danger" disabled={isSaving} onClick={() => runAction((tenantId) => archiveMenu(tenantId, menu.id), 'Menu archived.')} type="button">Archive</button>
                </div>
              );
            })}
            {categories.map((category) => {
              const draft = categoryDrafts[category.id] ?? {};
              return (
                <div className="admin-row" key={category.id}>
                  <input value={draft.name ?? ''} onChange={(e) => setCategoryDrafts((s) => ({ ...s, [category.id]: { ...draft, name: e.target.value } }))} />
                  <input value={draft.description ?? ''} onChange={(e) => setCategoryDrafts((s) => ({ ...s, [category.id]: { ...draft, description: e.target.value } }))} />
                  <button disabled={isSaving} onClick={() => runAction((tenantId) => updateCategory(tenantId, category.id, categoryDrafts[category.id]), 'Category updated.')} type="button">Save</button>
                  <button className="danger" disabled={isSaving} onClick={() => runAction((tenantId) => archiveCategory(tenantId, category.id), 'Category archived.')} type="button">Archive</button>
                </div>
              );
            })}
            {items.map((item) => {
              const draft = itemDrafts[item.id] ?? {};
              return (
                <div className="admin-row admin-row--item" key={item.id}>
                  <input value={draft.name ?? ''} onChange={(e) => setItemDrafts((s) => ({ ...s, [item.id]: { ...draft, name: e.target.value } }))} />
                  <input type="number" step="0.01" value={draft.basePrice ?? 0} onChange={(e) => setItemDrafts((s) => ({ ...s, [item.id]: { ...draft, basePrice: Number(e.target.value) || 0 } }))} />
                  <button disabled={isSaving} onClick={() => runAction((tenantId) => updateItem(tenantId, item.id, itemDrafts[item.id]), 'Item updated.')} type="button">Save</button>
                  <button className="danger" disabled={isSaving} onClick={() => runAction((tenantId) => archiveItem(tenantId, item.id), 'Item archived.')} type="button">Archive</button>
                </div>
              );
            })}
          </div>
        </section>

        <section className="admin-panel">
          <h2>Quick Site Content</h2>
          <div className="admin-content-editor">
            <input value={contentDraft.menuTitle} onChange={(e) => setContentDraft((s) => ({ ...s, menuTitle: e.target.value }))} placeholder="Menu title" />
            <input value={contentDraft.menuEyebrow} onChange={(e) => setContentDraft((s) => ({ ...s, menuEyebrow: e.target.value }))} placeholder="Menu eyebrow" />
            <input value={contentDraft.aboutTitle} onChange={(e) => setContentDraft((s) => ({ ...s, aboutTitle: e.target.value }))} placeholder="About title" />
            <input value={contentDraft.heroTitleTop} onChange={(e) => setContentDraft((s) => ({ ...s, heroTitleTop: e.target.value }))} placeholder="Hero title top" />
            <input value={contentDraft.heroTitleMiddle} onChange={(e) => setContentDraft((s) => ({ ...s, heroTitleMiddle: e.target.value }))} placeholder="Hero title middle" />
            <button disabled={isSaving} onClick={() => runAction((tenantId) => updateSiteContent(tenantId, {
              theme: { menuTitle: contentDraft.menuTitle, menuEyebrow: contentDraft.menuEyebrow },
              about: { title: contentDraft.aboutTitle },
              hero: { titleTop: contentDraft.heroTitleTop, titleMiddle: contentDraft.heroTitleMiddle },
            }), 'Site content updated.')} type="button">Save Site Content</button>
          </div>
        </section>

        {!isSuperAdmin ? (
          <section className="admin-panel">
            <h2>My Account</h2>
            <form className="admin-form admin-form--account" onSubmit={async (event) => {
              event.preventDefault();
              await runAction((tenantId) => updateTenantAdmin(tenantId, user.id, {
                fullName: accountDraft.fullName.trim() || null,
                email: accountDraft.email.trim(),
                ...(accountDraft.password.trim() ? { password: accountDraft.password.trim() } : {}),
              }), 'Account updated.');
              setAccountDraft((s) => ({ ...s, password: '' }));
            }}>
              <input value={accountDraft.fullName} onChange={(e) => setAccountDraft((s) => ({ ...s, fullName: e.target.value }))} placeholder="Full name" />
              <input value={accountDraft.email} onChange={(e) => setAccountDraft((s) => ({ ...s, email: e.target.value }))} type="email" placeholder="Email" required />
              <input value={accountDraft.password} onChange={(e) => setAccountDraft((s) => ({ ...s, password: e.target.value }))} type="password" placeholder="New password (optional)" />
              <button disabled={isSaving} type="submit">Save My Account</button>
            </form>
          </section>
        ) : null}
      </section>
    </main>
  );
}
