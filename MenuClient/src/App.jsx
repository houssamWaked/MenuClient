import { useCallback, useEffect, useMemo, useState } from 'react';
import './App.css';
import {
  archiveCategory,
  archiveItem,
  archiveMenu,
  clearAdminSession,
  createCategory,
  createItem,
  createMenu,
  fetchAdminSession,
  fetchMyDashboard,
  fetchTenantAdmins,
  restoreAdminToken,
  tenantAdminLogin,
  updateCategory,
  updateItem,
  updateMenu,
  updateSiteContent,
  updateTenantAdmin,
} from './api/adminApi.js';

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

function LoginScreen({ onLogin, isLoading, error }) {
  const [tenantSlug, setTenantSlug] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    await onLogin(tenantSlug, email, password);
  };

  return (
    <div className="admin-login">
      <div className="admin-login__bg-shape" />
      <form className="admin-login__card" onSubmit={submit}>
        <p className="admin-login__eyebrow">Tenant Portal</p>
        <h1>Dashboard Login</h1>
        <p className="admin-login__text">
          Sign in with your tenant slug, email, and password. Each tenant has a separate account and
          dashboard.
        </p>
        <label>
          Tenant Slug
          <input
            autoComplete="organization"
            onChange={(event) => setTenantSlug(event.target.value)}
            placeholder="pizza-palazzo"
            required
            value={tenantSlug}
          />
        </label>
        <label>
          Email
          <input
            autoComplete="username"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="owner@pizzapalazzo.com"
            required
            type="email"
            value={email}
          />
        </label>
        <label>
          Password
          <input
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter password"
            required
            type="password"
            value={password}
          />
        </label>
        <button disabled={isLoading} type="submit">
          {isLoading ? 'Logging in...' : 'Open Dashboard'}
        </button>
        {error ? <p className="admin-login__error">{error}</p> : null}
      </form>
    </div>
  );
}

function DashboardScreen({ user, onLogout }) {
  const [dashboard, setDashboard] = useState(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [tenantAdmins, setTenantAdmins] = useState([]);
  const [accountDraft, setAccountDraft] = useState({
    fullName: user.fullName ?? '',
    email: user.email ?? '',
    password: '',
  });

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

  const tenantId = dashboard?.tenant?.id ?? user?.tenant?.id ?? '';
  const tenantName = dashboard?.tenant?.name ?? user?.tenant?.name ?? 'Tenant';
  const tenantSlug = dashboard?.tenant?.slug ?? user?.tenant?.slug ?? '';

  const menus = useMemo(() => {
    const entries = dashboard?.menus ?? [];
    return [...entries].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [dashboard?.menus]);

  const categories = useMemo(() => {
    const entries = dashboard?.categories ?? [];
    return [...entries].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [dashboard?.categories]);

  const items = useMemo(() => {
    const entries = dashboard?.items ?? [];
    return [...entries].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }, [dashboard?.items]);

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
    [categories.length, items, menus.length]
  );

  const initDrafts = useCallback((payload) => {
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

    setNewCategory((state) => ({
      ...state,
      menuId: payload?.menus?.[0]?.id ?? '',
    }));
    setNewItem((state) => ({
      ...state,
      categoryId: payload?.categories?.[0]?.id ?? '',
    }));
  }, []);

  const loadDashboard = useCallback(async () => {
    setIsLoadingDashboard(true);
    setError('');
    try {
      const payload = await fetchMyDashboard();
      setDashboard(payload);
      initDrafts(payload);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ?? requestError?.message ?? 'Could not load dashboard.'
      );
    } finally {
      setIsLoadingDashboard(false);
    }
  }, [initDrafts]);

  const loadTenantAdmins = useCallback(async () => {
    if (!tenantId) {
      return;
    }

    try {
      const data = await fetchTenantAdmins(tenantId);
      setTenantAdmins(data);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ??
          requestError?.message ??
          'Could not load tenant users.'
      );
    }
  }, [tenantId]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    loadTenantAdmins();
  }, [loadTenantAdmins]);

  const runAction = async (action, message) => {
    if (!tenantId) {
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccess('');
    try {
      await action();
      await loadDashboard();
      await loadTenantAdmins();
      if (message) {
        setSuccess(message);
      }
    } catch (requestError) {
      setError(requestError?.response?.data?.message ?? requestError?.message ?? 'Action failed.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateMenu = async (event) => {
    event.preventDefault();
    if (!newMenu.name.trim()) {
      return;
    }

    await runAction(async () => {
      await createMenu(tenantId, {
        name: newMenu.name.trim(),
        description: newMenu.description.trim() || null,
      });
      setNewMenu({ name: '', description: '' });
    }, 'Menu created.');
  };

  const handleCreateCategory = async (event) => {
    event.preventDefault();
    if (!newCategory.menuId || !newCategory.name.trim()) {
      return;
    }

    await runAction(async () => {
      await createCategory(tenantId, {
        menuId: newCategory.menuId,
        name: newCategory.name.trim(),
        description: newCategory.description.trim() || null,
      });
      setNewCategory((state) => ({ ...state, name: '', description: '' }));
    }, 'Category created.');
  };

  const handleCreateItem = async (event) => {
    event.preventDefault();
    if (!newItem.categoryId || !newItem.name.trim()) {
      return;
    }

    await runAction(async () => {
      await createItem(tenantId, {
        categoryId: newItem.categoryId,
        name: newItem.name.trim(),
        description: newItem.description.trim() || null,
        imageUrl: newItem.imageUrl.trim() || null,
        basePrice: Number(newItem.basePrice) || 0,
        isFeatured: newItem.isFeatured,
      });
      setNewItem((state) => ({
        ...state,
        name: '',
        description: '',
        imageUrl: '',
        basePrice: '',
        isFeatured: false,
      }));
    }, 'Item created.');
  };

  const saveSiteContent = async () => {
    await runAction(async () => {
      await updateSiteContent(tenantId, {
        theme: {
          menuTitle: contentDraft.menuTitle,
          menuEyebrow: contentDraft.menuEyebrow,
        },
        about: {
          title: contentDraft.aboutTitle,
        },
        hero: {
          titleTop: contentDraft.heroTitleTop,
          titleMiddle: contentDraft.heroTitleMiddle,
        },
      });
    }, 'Site content updated.');
  };

  const saveMyAccount = async (event) => {
    event.preventDefault();
    if (!user.id || !tenantId) {
      return;
    }

    const payload = {
      fullName: accountDraft.fullName.trim() || null,
      email: accountDraft.email.trim(),
    };
    if (accountDraft.password.trim()) {
      payload.password = accountDraft.password.trim();
    }

    await runAction(async () => {
      await updateTenantAdmin(tenantId, user.id, payload);
      setAccountDraft((state) => ({ ...state, password: '' }));
    }, 'Account updated.');
  };

  if (isLoadingDashboard && !dashboard) {
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
          <h2>{tenantName}</h2>
          <p>{tenantSlug}</p>
          <p>{user.email}</p>
        </div>

        <button className="admin-sidebar__reload" onClick={loadDashboard} type="button">
          Refresh
        </button>

        <button className="admin-sidebar__logout" onClick={onLogout} type="button">
          Logout
        </button>
      </aside>

      <section className="admin-main">
        <header className="admin-main__header">
          <div>
            <p className="admin-main__eyebrow">Tenant Dashboard</p>
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

        <section className="admin-grid">
          <article className="admin-panel">
            <h2>Create Menu</h2>
            <form className="admin-form" onSubmit={handleCreateMenu}>
              <input
                onChange={(event) => setNewMenu((state) => ({ ...state, name: event.target.value }))}
                placeholder="Menu name"
                required
                value={newMenu.name}
              />
              <textarea
                onChange={(event) =>
                  setNewMenu((state) => ({ ...state, description: event.target.value }))
                }
                placeholder="Description"
                rows={2}
                value={newMenu.description}
              />
              <button disabled={isSaving} type="submit">
                Add Menu
              </button>
            </form>
          </article>

          <article className="admin-panel">
            <h2>Create Category</h2>
            <form className="admin-form" onSubmit={handleCreateCategory}>
              <select
                onChange={(event) => setNewCategory((state) => ({ ...state, menuId: event.target.value }))}
                required
                value={newCategory.menuId}
              >
                <option value="">Select menu</option>
                {menus.map((menu) => (
                  <option key={menu.id} value={menu.id}>
                    {menu.name}
                  </option>
                ))}
              </select>
              <input
                onChange={(event) => setNewCategory((state) => ({ ...state, name: event.target.value }))}
                placeholder="Category name"
                required
                value={newCategory.name}
              />
              <textarea
                onChange={(event) =>
                  setNewCategory((state) => ({ ...state, description: event.target.value }))
                }
                placeholder="Description"
                rows={2}
                value={newCategory.description}
              />
              <button disabled={isSaving} type="submit">
                Add Category
              </button>
            </form>
          </article>

          <article className="admin-panel">
            <h2>Create Item</h2>
            <form className="admin-form" onSubmit={handleCreateItem}>
              <select
                onChange={(event) => setNewItem((state) => ({ ...state, categoryId: event.target.value }))}
                required
                value={newItem.categoryId}
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <input
                onChange={(event) => setNewItem((state) => ({ ...state, name: event.target.value }))}
                placeholder="Item name"
                required
                value={newItem.name}
              />
              <input
                onChange={(event) => setNewItem((state) => ({ ...state, basePrice: event.target.value }))}
                placeholder="Price"
                required
                step="0.01"
                type="number"
                value={newItem.basePrice}
              />
              <input
                onChange={(event) => setNewItem((state) => ({ ...state, imageUrl: event.target.value }))}
                placeholder="Image URL"
                value={newItem.imageUrl}
              />
              <textarea
                onChange={(event) =>
                  setNewItem((state) => ({ ...state, description: event.target.value }))
                }
                placeholder="Description"
                rows={2}
                value={newItem.description}
              />
              <label className="admin-form__inline">
                <input
                  checked={newItem.isFeatured}
                  onChange={(event) =>
                    setNewItem((state) => ({ ...state, isFeatured: event.target.checked }))
                  }
                  type="checkbox"
                />
                Featured item
              </label>
              <button disabled={isSaving} type="submit">
                Add Item
              </button>
            </form>
          </article>
        </section>

        <section className="admin-panel">
          <h2>Menus</h2>
          <div className="admin-list">
            {menus.map((menu) => {
              const draft = menuDrafts[menu.id] ?? {};
              return (
                <div className="admin-row" key={menu.id}>
                  <input
                    onChange={(event) =>
                      setMenuDrafts((state) => ({
                        ...state,
                        [menu.id]: { ...draft, name: event.target.value },
                      }))
                    }
                    value={draft.name ?? ''}
                  />
                  <input
                    onChange={(event) =>
                      setMenuDrafts((state) => ({
                        ...state,
                        [menu.id]: { ...draft, description: event.target.value },
                      }))
                    }
                    value={draft.description ?? ''}
                  />
                  <input
                    onChange={(event) =>
                      setMenuDrafts((state) => ({
                        ...state,
                        [menu.id]: { ...draft, sortOrder: Number(event.target.value) || 0 },
                      }))
                    }
                    type="number"
                    value={draft.sortOrder ?? 0}
                  />
                  <label>
                    <input
                      checked={Boolean(draft.isActive)}
                      onChange={(event) =>
                        setMenuDrafts((state) => ({
                          ...state,
                          [menu.id]: { ...draft, isActive: event.target.checked },
                        }))
                      }
                      type="checkbox"
                    />
                    Active
                  </label>
                  <button
                    disabled={isSaving}
                    onClick={() =>
                      runAction(() => updateMenu(tenantId, menu.id, menuDrafts[menu.id]), 'Menu updated.')
                    }
                    type="button"
                  >
                    Save
                  </button>
                  <button
                    className="danger"
                    disabled={isSaving}
                    onClick={() => runAction(() => archiveMenu(tenantId, menu.id), 'Menu archived.')}
                    type="button"
                  >
                    Archive
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <section className="admin-panel">
          <h2>Categories</h2>
          <div className="admin-list">
            {categories.map((category) => {
              const draft = categoryDrafts[category.id] ?? {};
              return (
                <div className="admin-row" key={category.id}>
                  <select
                    onChange={(event) =>
                      setCategoryDrafts((state) => ({
                        ...state,
                        [category.id]: { ...draft, menuId: event.target.value },
                      }))
                    }
                    value={draft.menuId ?? ''}
                  >
                    {menus.map((menu) => (
                      <option key={menu.id} value={menu.id}>
                        {menu.name}
                      </option>
                    ))}
                  </select>
                  <input
                    onChange={(event) =>
                      setCategoryDrafts((state) => ({
                        ...state,
                        [category.id]: { ...draft, name: event.target.value },
                      }))
                    }
                    value={draft.name ?? ''}
                  />
                  <input
                    onChange={(event) =>
                      setCategoryDrafts((state) => ({
                        ...state,
                        [category.id]: { ...draft, description: event.target.value },
                      }))
                    }
                    value={draft.description ?? ''}
                  />
                  <button
                    disabled={isSaving}
                    onClick={() =>
                      runAction(
                        () => updateCategory(tenantId, category.id, categoryDrafts[category.id]),
                        'Category updated.'
                      )
                    }
                    type="button"
                  >
                    Save
                  </button>
                  <button
                    className="danger"
                    disabled={isSaving}
                    onClick={() => runAction(() => archiveCategory(tenantId, category.id), 'Category archived.')}
                    type="button"
                  >
                    Archive
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <section className="admin-panel">
          <h2>Items</h2>
          <div className="admin-list">
            {items.map((item) => {
              const draft = itemDrafts[item.id] ?? {};
              return (
                <div className="admin-row admin-row--item" key={item.id}>
                  <select
                    onChange={(event) =>
                      setItemDrafts((state) => ({
                        ...state,
                        [item.id]: { ...draft, categoryId: event.target.value },
                      }))
                    }
                    value={draft.categoryId ?? ''}
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <input
                    onChange={(event) =>
                      setItemDrafts((state) => ({
                        ...state,
                        [item.id]: { ...draft, name: event.target.value },
                      }))
                    }
                    value={draft.name ?? ''}
                  />
                  <input
                    onChange={(event) =>
                      setItemDrafts((state) => ({
                        ...state,
                        [item.id]: { ...draft, basePrice: Number(event.target.value) || 0 },
                      }))
                    }
                    step="0.01"
                    type="number"
                    value={draft.basePrice ?? 0}
                  />
                  <input
                    onChange={(event) =>
                      setItemDrafts((state) => ({
                        ...state,
                        [item.id]: { ...draft, imageUrl: event.target.value },
                      }))
                    }
                    value={draft.imageUrl ?? ''}
                  />
                  <label>
                    <input
                      checked={Boolean(draft.isFeatured)}
                      onChange={(event) =>
                        setItemDrafts((state) => ({
                          ...state,
                          [item.id]: { ...draft, isFeatured: event.target.checked },
                        }))
                      }
                      type="checkbox"
                    />
                    Featured
                  </label>
                  <label>
                    <input
                      checked={Boolean(draft.isAvailable)}
                      onChange={(event) =>
                        setItemDrafts((state) => ({
                          ...state,
                          [item.id]: { ...draft, isAvailable: event.target.checked },
                        }))
                      }
                      type="checkbox"
                    />
                    Available
                  </label>
                  <button
                    disabled={isSaving}
                    onClick={() =>
                      runAction(() => updateItem(tenantId, item.id, itemDrafts[item.id]), 'Item updated.')
                    }
                    type="button"
                  >
                    Save
                  </button>
                  <button
                    className="danger"
                    disabled={isSaving}
                    onClick={() => runAction(() => archiveItem(tenantId, item.id), 'Item archived.')}
                    type="button"
                  >
                    Archive
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <section className="admin-panel">
          <h2>Quick Site Content</h2>
          <div className="admin-content-editor">
            <input
              onChange={(event) => setContentDraft((state) => ({ ...state, menuTitle: event.target.value }))}
              placeholder="Menu title"
              value={contentDraft.menuTitle}
            />
            <input
              onChange={(event) =>
                setContentDraft((state) => ({ ...state, menuEyebrow: event.target.value }))
              }
              placeholder="Menu eyebrow"
              value={contentDraft.menuEyebrow}
            />
            <input
              onChange={(event) => setContentDraft((state) => ({ ...state, aboutTitle: event.target.value }))}
              placeholder="About title"
              value={contentDraft.aboutTitle}
            />
            <input
              onChange={(event) =>
                setContentDraft((state) => ({ ...state, heroTitleTop: event.target.value }))
              }
              placeholder="Hero title top"
              value={contentDraft.heroTitleTop}
            />
            <input
              onChange={(event) =>
                setContentDraft((state) => ({ ...state, heroTitleMiddle: event.target.value }))
              }
              placeholder="Hero title middle"
              value={contentDraft.heroTitleMiddle}
            />
            <button disabled={isSaving} onClick={saveSiteContent} type="button">
              Save Site Content
            </button>
          </div>
        </section>

        <section className="admin-panel">
          <h2>Team Access</h2>
          <div className="admin-team-list">
            {tenantAdmins.map((adminUser) => (
              <article className="admin-team-card" key={adminUser.id}>
                <strong>{adminUser.fullName || adminUser.email}</strong>
                <span>{adminUser.email}</span>
                <span>{adminUser.role}</span>
                <span>Last login: {formatDate(adminUser.lastLoginAt)}</span>
              </article>
            ))}
          </div>

          <form className="admin-form admin-form--account" onSubmit={saveMyAccount}>
            <h3>My Account</h3>
            <input
              onChange={(event) => setAccountDraft((state) => ({ ...state, fullName: event.target.value }))}
              placeholder="Full name"
              value={accountDraft.fullName}
            />
            <input
              onChange={(event) => setAccountDraft((state) => ({ ...state, email: event.target.value }))}
              placeholder="Email"
              required
              type="email"
              value={accountDraft.email}
            />
            <input
              onChange={(event) => setAccountDraft((state) => ({ ...state, password: event.target.value }))}
              placeholder="New password (optional)"
              type="password"
              value={accountDraft.password}
            />
            <button disabled={isSaving} type="submit">
              Save My Account
            </button>
          </form>
        </section>
      </section>
    </main>
  );
}

function App() {
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    const restore = async () => {
      const token = restoreAdminToken();
      if (!token) {
        setIsCheckingSession(false);
        return;
      }

      try {
        const session = await fetchAdminSession();
        if (session?.user?.role !== 'tenant_admin') {
          clearAdminSession();
          setAdminUser(null);
          setLoginError('Please login with tenant credentials.');
        } else {
          setAdminUser(session?.user ?? null);
        }
      } catch {
        clearAdminSession();
        setAdminUser(null);
      } finally {
        setIsCheckingSession(false);
      }
    };

    restore();
  }, []);

  const handleLogin = async (tenantSlug, email, password) => {
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const data = await tenantAdminLogin(tenantSlug, email, password);
      setAdminUser(data?.user ?? null);
    } catch (error) {
      setLoginError(error?.response?.data?.message ?? error?.message ?? 'Login failed.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    clearAdminSession();
    setAdminUser(null);
    setLoginError('');
  };

  if (isCheckingSession) {
    return (
      <main className="admin-loader">
        <div className="admin-loader__spinner" />
        <p>Checking session...</p>
      </main>
    );
  }

  if (!adminUser) {
    return <LoginScreen error={loginError} isLoading={isLoggingIn} onLogin={handleLogin} />;
  }

  return <DashboardScreen onLogout={handleLogout} user={adminUser} />;
}

export default App;
