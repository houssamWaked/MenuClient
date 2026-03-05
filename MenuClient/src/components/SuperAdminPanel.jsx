import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createTenant,
  createTenantAdmin,
  deleteTenantAdmin,
  fetchTenantAdmins,
  fetchTenants,
} from '../api/adminApi.js';

function formatDate(value) {
  if (!value) {
    return 'Never logged in';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Never logged in';
  }

  return date.toLocaleString();
}

function slugify(value) {
  return String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function SuperAdminPanel({ user, onLogout }) {
  const [tenants, setTenants] = useState([]);
  const [selectedTenantId, setSelectedTenantId] = useState('');
  const [adminUsers, setAdminUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newTenant, setNewTenant] = useState({ name: '', slug: '' });
  const [newAccount, setNewAccount] = useState({ fullName: '', email: '', password: '' });

  const selectedTenant = useMemo(
    () => tenants.find((tenant) => tenant.id === selectedTenantId) ?? null,
    [tenants, selectedTenantId]
  );

  const loadTenants = useCallback(async () => {
    const data = await fetchTenants();
    setTenants(data);
    setSelectedTenantId((current) => {
      if (current && data.some((tenant) => tenant.id === current)) {
        return current;
      }
      return data[0]?.id ?? '';
    });
  }, []);

  const loadTenantUsers = useCallback(async (tenantId) => {
    if (!tenantId) {
      setAdminUsers([]);
      return;
    }

    const users = await fetchTenantAdmins(tenantId);
    setAdminUsers(users);
  }, []);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError('');
      try {
        await loadTenants();
      } catch (requestError) {
        setError(requestError?.response?.data?.message ?? requestError?.message ?? 'Failed to load data.');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [loadTenants]);

  useEffect(() => {
    const load = async () => {
      setError('');
      try {
        await loadTenantUsers(selectedTenantId);
      } catch (requestError) {
        setError(requestError?.response?.data?.message ?? requestError?.message ?? 'Failed to load accounts.');
      }
    };

    load();
  }, [loadTenantUsers, selectedTenantId]);

  const handleCreateTenant = async (event) => {
    event.preventDefault();
    const name = newTenant.name.trim();
    const slug = slugify(newTenant.slug || name);
    if (!name || !slug) {
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccess('');
    try {
      const created = await createTenant({
        name,
        slug,
        type: 'restaurant',
        currency: 'USD',
        timezone: 'UTC',
      });
      await loadTenants();
      if (created?.id) {
        setSelectedTenantId(created.id);
      }
      setNewTenant({ name: '', slug: '' });
      setSuccess('Business created.');
    } catch (requestError) {
      setError(requestError?.response?.data?.message ?? requestError?.message ?? 'Failed to create business.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateAccount = async (event) => {
    event.preventDefault();
    if (!selectedTenantId) {
      setError('Select a business first.');
      return;
    }

    const email = newAccount.email.trim();
    const password = newAccount.password.trim();
    if (!email || !password) {
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccess('');
    try {
      await createTenantAdmin(selectedTenantId, {
        fullName: newAccount.fullName.trim() || null,
        email,
        password,
        role: 'owner',
      });
      await loadTenantUsers(selectedTenantId);
      setNewAccount({ fullName: '', email: '', password: '' });
      setSuccess('Admin account created.');
    } catch (requestError) {
      setError(requestError?.response?.data?.message ?? requestError?.message ?? 'Failed to create account.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async (adminUser) => {
    if (!selectedTenantId) {
      return;
    }

    const ok = window.confirm(`Remove ${adminUser.fullName || adminUser.email} from this business?`);
    if (!ok) {
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccess('');
    try {
      await deleteTenantAdmin(selectedTenantId, adminUser.id);
      await loadTenantUsers(selectedTenantId);
      setSuccess('Admin account removed.');
    } catch (requestError) {
      setError(requestError?.response?.data?.message ?? requestError?.message ?? 'Failed to remove account.');
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
    <main className="admin-simple">
      <header className="admin-simple__header">
        <div>
          <p className="admin-main__eyebrow">Super Admin</p>
          <h1>Tenant Setup</h1>
          <p className="admin-simple__subtitle">Signed in as {user.fullName || user.email}</p>
        </div>
        <div className="admin-simple__header-actions">
          <button disabled={isSaving} onClick={loadTenants} type="button">
            Refresh
          </button>
          <button className="admin-simple__logout" onClick={onLogout} type="button">
            Logout
          </button>
        </div>
      </header>

      {error ? <div className="admin-alert admin-alert--error">{error}</div> : null}
      {success ? <div className="admin-alert admin-alert--success">{success}</div> : null}

      <section className="admin-kpis">
        <article>
          <span>Total Businesses</span>
          <strong>{tenants.length}</strong>
        </article>
        <article>
          <span>Accounts in Selected Business</span>
          <strong>{adminUsers.length}</strong>
        </article>
      </section>

      <section className="admin-simple__grid">
        <article className="admin-panel">
          <h2>1. Create New Business</h2>
          <form className="admin-form" onSubmit={handleCreateTenant}>
            <label className="admin-form__group">
              Business name
              <input
                onChange={(event) => {
                  const name = event.target.value;
                  setNewTenant((state) => ({
                    ...state,
                    name,
                    slug: state.slug ? state.slug : slugify(name),
                  }));
                }}
                placeholder="Pizza Palazzo"
                required
                value={newTenant.name}
              />
            </label>

            <label className="admin-form__group">
              Website slug
              <input
                onChange={(event) => setNewTenant((state) => ({ ...state, slug: slugify(event.target.value) }))}
                placeholder="pizza-palazzo"
                required
                value={newTenant.slug}
              />
            </label>

            <button disabled={isSaving} type="submit">
              Create Business
            </button>
          </form>
        </article>

        <article className="admin-panel">
          <h2>2. Select Business</h2>
          <label className="admin-form__group">
            Business
            <select
              onChange={(event) => setSelectedTenantId(event.target.value)}
              value={selectedTenantId}
            >
              {tenants.length ? null : <option value="">No business yet</option>}
              {tenants.map((tenant) => (
                <option key={tenant.id} value={tenant.id}>
                  {tenant.name} ({tenant.slug})
                </option>
              ))}
            </select>
          </label>
          <p className="admin-simple__hint">
            Selected: <strong>{selectedTenant?.name ?? 'None'}</strong>
          </p>
        </article>

        <article className="admin-panel">
          <h2>3. Create Admin Login</h2>
          <form className="admin-form" onSubmit={handleCreateAccount}>
            <label className="admin-form__group">
              Full name
              <input
                onChange={(event) => setNewAccount((state) => ({ ...state, fullName: event.target.value }))}
                placeholder="Owner name"
                value={newAccount.fullName}
              />
            </label>

            <label className="admin-form__group">
              Email
              <input
                onChange={(event) => setNewAccount((state) => ({ ...state, email: event.target.value }))}
                placeholder="owner@business.com"
                required
                type="email"
                value={newAccount.email}
              />
            </label>

            <label className="admin-form__group">
              Password
              <input
                minLength={6}
                onChange={(event) => setNewAccount((state) => ({ ...state, password: event.target.value }))}
                placeholder="At least 6 characters"
                required
                type="password"
                value={newAccount.password}
              />
            </label>

            <button disabled={isSaving || !selectedTenantId} type="submit">
              Create Login
            </button>
          </form>
        </article>
      </section>

      <section className="admin-panel">
        <h2>Admin Accounts</h2>
        {!selectedTenantId ? (
          <p className="admin-simple__hint">Select a business to manage accounts.</p>
        ) : null}
        {selectedTenantId && !adminUsers.length ? (
          <p className="admin-simple__hint">No admin accounts yet for this business.</p>
        ) : null}
        <div className="admin-account-list">
          {adminUsers.map((adminUser) => (
            <article className="admin-account-item" key={adminUser.id}>
              <div>
                <strong>{adminUser.fullName || adminUser.email}</strong>
                <p>{adminUser.email}</p>
                <span>{formatDate(adminUser.lastLoginAt)}</span>
              </div>
              <button
                className="danger"
                disabled={isSaving}
                onClick={() => handleDeleteAccount(adminUser)}
                type="button"
              >
                Remove
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
