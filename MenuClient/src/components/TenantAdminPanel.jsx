import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  archiveCategory,
  archiveItem,
  archiveMenu,
  createCategory,
  createItem,
  createMenu,
  fetchMyDashboard,
  updateCategory,
  updateItem,
  updateMenu,
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

async function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
}

async function fileToOptimizedImage(file) {
  const rawDataUrl = await fileToDataUrl(file);

  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to decode image.'));
    img.src = rawDataUrl;
  });

  const maxWidth = 1400;
  const maxHeight = 1400;
  let width = image.width;
  let height = image.height;

  if (width > maxWidth || height > maxHeight) {
    const ratio = Math.min(maxWidth / width, maxHeight / height);
    width = Math.max(1, Math.round(width * ratio));
    height = Math.max(1, Math.round(height * ratio));
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) {
    return rawDataUrl;
  }

  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL('image/jpeg', 0.84);
}

export function TenantAdminPanel({ user, onLogout }) {
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeSection, setActiveSection] = useState('build');
  const [manageType, setManageType] = useState('items');
  const [manageSearch, setManageSearch] = useState('');
  const [editingEntity, setEditingEntity] = useState(null);
  const [uploadingField, setUploadingField] = useState('');

  const [newMenu, setNewMenu] = useState({ name: '', description: '' });
  const [newCategory, setNewCategory] = useState({
    menuId: '',
    name: '',
    description: '',
    imageUrl: '',
  });
  const [newItem, setNewItem] = useState({
    categoryId: '',
    name: '',
    description: '',
    imageUrl: '',
    basePrice: '',
    isFeatured: false,
  });
  const [accountDraft, setAccountDraft] = useState({
    fullName: user.fullName ?? '',
    email: user.email ?? '',
    password: '',
  });
  const [menuDrafts, setMenuDrafts] = useState({});
  const [categoryDrafts, setCategoryDrafts] = useState({});
  const [itemDrafts, setItemDrafts] = useState({});

  const tenantId = dashboard?.tenant?.id ?? user?.tenant?.id ?? '';
  const tenantName = dashboard?.tenant?.name ?? user?.tenant?.name ?? 'Tenant';
  const tenantSlug = dashboard?.tenant?.slug ?? user?.tenant?.slug ?? '';

  const menus = useMemo(
    () =>
      [...(dashboard?.menus ?? [])]
        .filter((menu) => menu.isActive !== false)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [dashboard?.menus]
  );
  const categories = useMemo(
    () =>
      [...(dashboard?.categories ?? [])]
        .filter((category) => category.isActive !== false)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [dashboard?.categories]
  );
  const items = useMemo(
    () =>
      [...(dashboard?.items ?? [])]
        .filter((item) => item.isAvailable !== false)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [dashboard?.items]
  );
  const menuMap = useMemo(
    () => Object.fromEntries(menus.map((menu) => [menu.id, menu])),
    [menus]
  );
  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map((category) => [category.id, category])),
    [categories]
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

  const initDrafts = useCallback((payload) => {
    const nextMenuDrafts = {};
    for (const menu of payload?.menus ?? []) {
      nextMenuDrafts[menu.id] = {
        name: menu.name ?? '',
        description: menu.description ?? '',
      };
    }
    setMenuDrafts(nextMenuDrafts);

    const nextCategoryDrafts = {};
    for (const category of payload?.categories ?? []) {
      nextCategoryDrafts[category.id] = {
        name: category.name ?? '',
        description: category.description ?? '',
        imageUrl: category.imageUrl ?? '',
      };
    }
    setCategoryDrafts(nextCategoryDrafts);

    const nextItemDrafts = {};
    for (const item of payload?.items ?? []) {
      nextItemDrafts[item.id] = {
        name: item.name ?? '',
        description: item.description ?? '',
        imageUrl: item.imageUrl ?? '',
        basePrice: Number(item.basePrice) || 0,
        isFeatured: Boolean(item.isFeatured),
      };
    }
    setItemDrafts(nextItemDrafts);

    setNewCategory((state) => ({ ...state, menuId: payload?.menus?.[0]?.id ?? '' }));
    setNewItem((state) => ({ ...state, categoryId: payload?.categories?.[0]?.id ?? '' }));
  }, []);

  const loadDashboard = useCallback(async () => {
    const payload = await fetchMyDashboard();
    setDashboard(payload);
    initDrafts(payload);
  }, [initDrafts]);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError('');
      try {
        await loadDashboard();
      } catch (requestError) {
        setError(requestError?.response?.data?.message ?? requestError?.message ?? 'Failed to load dashboard.');
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [loadDashboard]);

  const runAction = async (action, successMessage) => {
    if (!tenantId) {
      return;
    }

    setIsSaving(true);
    setError('');
    setSuccess('');
    try {
      await action();
      await loadDashboard();
      setSuccess(successMessage);
    } catch (requestError) {
      setError(requestError?.response?.data?.message ?? requestError?.message ?? 'Action failed.');
    } finally {
      setIsSaving(false);
    }
  };

  const uploadImage = useCallback(
    async (file, fieldKey, applyResult) => {
      if (!file) {
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }

      const maxBytes = 8 * 1024 * 1024;
      if (file.size > maxBytes) {
        setError('Image is too large. Max size is 8MB.');
        return;
      }

      setUploadingField(fieldKey);
      setError('');
      try {
        const dataUrl = await fileToOptimizedImage(file);
        applyResult(dataUrl);
        setSuccess('Image uploaded.');
      } catch {
        setError('Failed to process image.');
      } finally {
        setUploadingField('');
      }
    },
    []
  );

  const searchValue = manageSearch.trim().toLowerCase();
  const filteredMenus = useMemo(
    () =>
      menus.filter((entry) => {
        if (!searchValue) {
          return true;
        }
        const haystack = `${entry.name || ''} ${entry.description || ''}`.toLowerCase();
        return haystack.includes(searchValue);
      }),
    [menus, searchValue]
  );
  const filteredCategories = useMemo(
    () =>
      categories.filter((entry) => {
        if (!searchValue) {
          return true;
        }
        const menuName = menuMap[entry.menuId]?.name || '';
        const haystack = `${entry.name || ''} ${entry.description || ''} ${menuName}`.toLowerCase();
        return haystack.includes(searchValue);
      }),
    [categories, menuMap, searchValue]
  );
  const filteredItems = useMemo(
    () =>
      items.filter((entry) => {
        if (!searchValue) {
          return true;
        }
        const categoryName = categoryMap[entry.categoryId]?.name || '';
        const haystack = `${entry.name || ''} ${entry.description || ''} ${categoryName}`.toLowerCase();
        return haystack.includes(searchValue);
      }),
    [items, categoryMap, searchValue]
  );

  if (isLoading) {
    return (
      <main className="admin-loader">
        <div className="admin-loader__spinner" />
        <p>Loading tenant dashboard...</p>
      </main>
    );
  }

  return (
    <main className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <h2>{tenantName}</h2>
          <p>{tenantSlug}</p>
          <p>{user.fullName || user.email}</p>
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
            <p className="admin-main__eyebrow">Tenant Admin</p>
            <h1>{tenantName}</h1>
            <p className="admin-main__subtext">Manage menu data for {tenantSlug || 'your tenant'}.</p>
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

        <section className="admin-tabs">
          <button
            className={activeSection === 'build' ? 'is-active' : ''}
            onClick={() => setActiveSection('build')}
            type="button"
          >
            Add New
          </button>
          <button
            className={activeSection === 'manage' ? 'is-active' : ''}
            onClick={() => setActiveSection('manage')}
            type="button"
          >
            Manage Existing
          </button>
          <button
            className={activeSection === 'account' ? 'is-active' : ''}
            onClick={() => setActiveSection('account')}
            type="button"
          >
            My Account
          </button>
        </section>

        {activeSection === 'build' ? (
          <section className="admin-grid">
            <article className="admin-panel">
              <h2>Add Menu</h2>
              <form
                className="admin-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!newMenu.name.trim()) {
                    return;
                  }

                  runAction(async () => {
                    await createMenu(tenantId, {
                      name: newMenu.name.trim(),
                      description: newMenu.description.trim() || null,
                    });
                    setNewMenu({ name: '', description: '' });
                  }, 'Menu created.');
                }}
              >
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
              <h2>Add Category</h2>
              <form
                className="admin-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!newCategory.menuId || !newCategory.name.trim()) {
                    return;
                  }

                  runAction(async () => {
                    await createCategory(tenantId, {
                      menuId: newCategory.menuId,
                      name: newCategory.name.trim(),
                      description: newCategory.description.trim() || null,
                      imageUrl: newCategory.imageUrl.trim() || null,
                    });
                    setNewCategory((state) => ({
                      ...state,
                      name: '',
                      description: '',
                      imageUrl: '',
                    }));
                  }, 'Category created.');
                }}
              >
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
                  placeholder="Category description"
                  rows={2}
                  value={newCategory.description}
                />
                <div className="admin-upload">
                  <label className="admin-form__group">
                    Category image
                    <input
                      accept="image/*"
                      onChange={(event) =>
                        uploadImage(
                          event.target.files?.[0],
                          'new-category-image',
                          (dataUrl) =>
                            setNewCategory((state) => ({ ...state, imageUrl: dataUrl }))
                        )
                      }
                      type="file"
                    />
                  </label>
                  {uploadingField === 'new-category-image' ? (
                    <span className="admin-upload__status">Processing image...</span>
                  ) : null}
                  {newCategory.imageUrl ? (
                    <>
                      <img
                        alt="Category preview"
                        className="admin-manage-card__thumb"
                        src={newCategory.imageUrl}
                      />
                      <button
                        className="admin-upload__clear"
                        onClick={() =>
                          setNewCategory((state) => ({ ...state, imageUrl: '' }))
                        }
                        type="button"
                      >
                        Remove Image
                      </button>
                    </>
                  ) : null}
                </div>
                <button disabled={isSaving} type="submit">
                  Add Category
                </button>
              </form>
            </article>

            <article className="admin-panel">
              <h2>Add Item</h2>
              <form
                className="admin-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!newItem.categoryId || !newItem.name.trim()) {
                    return;
                  }

                  runAction(async () => {
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
                }}
              >
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
                <textarea
                  onChange={(event) => setNewItem((state) => ({ ...state, description: event.target.value }))}
                  placeholder="Item description"
                  rows={2}
                  value={newItem.description}
                />
                <div className="admin-upload">
                  <label className="admin-form__group">
                    Item image
                    <input
                      accept="image/*"
                      onChange={(event) =>
                        uploadImage(
                          event.target.files?.[0],
                          'new-item-image',
                          (dataUrl) =>
                            setNewItem((state) => ({ ...state, imageUrl: dataUrl }))
                        )
                      }
                      type="file"
                    />
                  </label>
                  {uploadingField === 'new-item-image' ? (
                    <span className="admin-upload__status">Processing image...</span>
                  ) : null}
                  {newItem.imageUrl ? (
                    <>
                      <img alt="Item preview" className="admin-manage-card__thumb" src={newItem.imageUrl} />
                      <button
                        className="admin-upload__clear"
                        onClick={() =>
                          setNewItem((state) => ({ ...state, imageUrl: '' }))
                        }
                        type="button"
                      >
                        Remove Image
                      </button>
                    </>
                  ) : null}
                </div>
                <input
                  onChange={(event) => setNewItem((state) => ({ ...state, basePrice: event.target.value }))}
                  placeholder="Price"
                  required
                  step="0.01"
                  type="number"
                  value={newItem.basePrice}
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
        ) : null}

        {activeSection === 'manage' ? (
          <section className="admin-panel">
            <div className="admin-manage__top">
              <h2>Manage Existing Data</h2>
              <p>Edit one card at a time. Search, open, save.</p>
            </div>

            <div className="admin-manage__controls">
              <div className="admin-manage__types">
                <button
                  className={manageType === 'menus' ? 'is-active' : ''}
                  onClick={() => {
                    setManageType('menus');
                    setEditingEntity(null);
                  }}
                  type="button"
                >
                  Menus
                </button>
                <button
                  className={manageType === 'categories' ? 'is-active' : ''}
                  onClick={() => {
                    setManageType('categories');
                    setEditingEntity(null);
                  }}
                  type="button"
                >
                  Categories
                </button>
                <button
                  className={manageType === 'items' ? 'is-active' : ''}
                  onClick={() => {
                    setManageType('items');
                    setEditingEntity(null);
                  }}
                  type="button"
                >
                  Items
                </button>
              </div>
              <input
                onChange={(event) => setManageSearch(event.target.value)}
                placeholder="Search by name..."
                value={manageSearch}
              />
            </div>

            {manageType === 'menus' ? (
              <div className="admin-manage__list">
                {filteredMenus.map((menu) => {
                  const draft = menuDrafts[menu.id] ?? {};
                  const isEditing =
                    editingEntity?.type === 'menu' && editingEntity?.id === menu.id;
                  return (
                    <article className="admin-manage-card" key={menu.id}>
                      <div className="admin-manage-card__head">
                        <div>
                          <h3>{menu.name}</h3>
                          <p>{menu.description || 'No description'}</p>
                        </div>
                        <div className="admin-manage-card__actions">
                          <button
                            onClick={() =>
                              setEditingEntity(isEditing ? null : { type: 'menu', id: menu.id })
                            }
                            type="button"
                          >
                            {isEditing ? 'Close' : 'Edit'}
                          </button>
                          <button
                            className="danger"
                            disabled={isSaving}
                            onClick={() => {
                              if (!window.confirm(`Remove "${menu.name}"?`)) {
                                return;
                              }
                              runAction(() => archiveMenu(tenantId, menu.id), 'Menu removed.');
                            }}
                            type="button"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      {isEditing ? (
                        <div className="admin-manage-card__editor">
                          <label className="admin-form__group">
                            Name
                            <input
                              onChange={(event) =>
                                setMenuDrafts((state) => ({
                                  ...state,
                                  [menu.id]: { ...draft, name: event.target.value },
                                }))
                              }
                              value={draft.name ?? ''}
                            />
                          </label>
                          <label className="admin-form__group">
                            Description
                            <input
                              onChange={(event) =>
                                setMenuDrafts((state) => ({
                                  ...state,
                                  [menu.id]: { ...draft, description: event.target.value },
                                }))
                              }
                              value={draft.description ?? ''}
                            />
                          </label>
                          <button
                            disabled={isSaving}
                            onClick={() =>
                              runAction(
                                async () => {
                                  await updateMenu(tenantId, menu.id, draft);
                                  setEditingEntity(null);
                                },
                                'Menu updated.'
                              )
                            }
                            type="button"
                          >
                            Save Changes
                          </button>
                        </div>
                      ) : null}
                    </article>
                  );
                })}

                {!filteredMenus.length ? <p className="admin-simple__hint">No menus found.</p> : null}
              </div>
            ) : null}

            {manageType === 'categories' ? (
              <div className="admin-manage__list">
                {filteredCategories.map((category) => {
                  const draft = categoryDrafts[category.id] ?? {};
                  const isEditing =
                    editingEntity?.type === 'category' && editingEntity?.id === category.id;
                  return (
                    <article className="admin-manage-card" key={category.id}>
                      <div className="admin-manage-card__head">
                        <div>
                          <h3>{category.name}</h3>
                          <p>{category.description || 'No description'}</p>
                          <span>Menu: {menuMap[category.menuId]?.name || 'Unknown'}</span>
                          {category.imageUrl ? (
                            <img
                              alt={category.name}
                              className="admin-manage-card__thumb"
                              src={category.imageUrl}
                            />
                          ) : null}
                        </div>
                        <div className="admin-manage-card__actions">
                          <button
                            onClick={() =>
                              setEditingEntity(isEditing ? null : { type: 'category', id: category.id })
                            }
                            type="button"
                          >
                            {isEditing ? 'Close' : 'Edit'}
                          </button>
                          <button
                            className="danger"
                            disabled={isSaving}
                            onClick={() => {
                              if (!window.confirm(`Remove "${category.name}"?`)) {
                                return;
                              }
                              runAction(
                                () => archiveCategory(tenantId, category.id),
                                'Category removed.'
                              );
                            }}
                            type="button"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      {isEditing ? (
                        <div className="admin-manage-card__editor">
                          <label className="admin-form__group">
                            Name
                            <input
                              onChange={(event) =>
                                setCategoryDrafts((state) => ({
                                  ...state,
                                  [category.id]: { ...draft, name: event.target.value },
                                }))
                              }
                              value={draft.name ?? ''}
                            />
                          </label>
                          <label className="admin-form__group">
                            Description
                            <input
                              onChange={(event) =>
                                setCategoryDrafts((state) => ({
                                  ...state,
                                  [category.id]: { ...draft, description: event.target.value },
                                }))
                              }
                              value={draft.description ?? ''}
                            />
                          </label>
                          <label className="admin-form__group">
                            Image
                            <input
                              accept="image/*"
                              onChange={(event) =>
                                uploadImage(
                                  event.target.files?.[0],
                                  `category-${category.id}-image`,
                                  (dataUrl) =>
                                    setCategoryDrafts((state) => ({
                                      ...state,
                                      [category.id]: { ...draft, imageUrl: dataUrl },
                                    }))
                                )
                              }
                              type="file"
                            />
                          </label>
                          {uploadingField === `category-${category.id}-image` ? (
                            <span className="admin-upload__status">Processing image...</span>
                          ) : null}
                          {draft.imageUrl ? (
                            <>
                              <img
                                alt={`${category.name} preview`}
                                className="admin-manage-card__thumb"
                                src={draft.imageUrl}
                              />
                              <button
                                className="admin-upload__clear"
                                onClick={() =>
                                  setCategoryDrafts((state) => ({
                                    ...state,
                                    [category.id]: { ...draft, imageUrl: '' },
                                  }))
                                }
                                type="button"
                              >
                                Remove Image
                              </button>
                            </>
                          ) : null}
                          <button
                            disabled={isSaving}
                            onClick={() =>
                              runAction(
                                async () => {
                                  await updateCategory(tenantId, category.id, draft);
                                  setEditingEntity(null);
                                },
                                'Category updated.'
                              )
                            }
                            type="button"
                          >
                            Save Changes
                          </button>
                        </div>
                      ) : null}
                    </article>
                  );
                })}

                {!filteredCategories.length ? (
                  <p className="admin-simple__hint">No categories found.</p>
                ) : null}
              </div>
            ) : null}

            {manageType === 'items' ? (
              <div className="admin-manage__list">
                {filteredItems.map((item) => {
                  const draft = itemDrafts[item.id] ?? {};
                  const isEditing =
                    editingEntity?.type === 'item' && editingEntity?.id === item.id;
                  return (
                    <article className="admin-manage-card" key={item.id}>
                      <div className="admin-manage-card__head">
                        <div>
                          <h3>{item.name}</h3>
                          <p>{item.description || 'No description'}</p>
                          <span>
                            {categoryMap[item.categoryId]?.name || 'Unknown category'} | {formatMoney(item.basePrice)}
                          </span>
                          <span>{item.isFeatured ? 'Featured' : 'Regular'}</span>
                          {item.imageUrl ? (
                            <img
                              alt={item.name}
                              className="admin-manage-card__thumb"
                              src={item.imageUrl}
                            />
                          ) : null}
                        </div>
                        <div className="admin-manage-card__actions">
                          <button
                            onClick={() =>
                              setEditingEntity(isEditing ? null : { type: 'item', id: item.id })
                            }
                            type="button"
                          >
                            {isEditing ? 'Close' : 'Edit'}
                          </button>
                          <button
                            className="danger"
                            disabled={isSaving}
                            onClick={() => {
                              if (!window.confirm(`Remove "${item.name}"?`)) {
                                return;
                              }
                              runAction(() => archiveItem(tenantId, item.id), 'Item removed.');
                            }}
                            type="button"
                          >
                            Remove
                          </button>
                        </div>
                      </div>

                      {isEditing ? (
                        <div className="admin-manage-card__editor admin-manage-card__editor--item">
                          <label className="admin-form__group">
                            Name
                            <input
                              onChange={(event) =>
                                setItemDrafts((state) => ({
                                  ...state,
                                  [item.id]: { ...draft, name: event.target.value },
                                }))
                              }
                              value={draft.name ?? ''}
                            />
                          </label>
                          <label className="admin-form__group">
                            Description
                            <input
                              onChange={(event) =>
                                setItemDrafts((state) => ({
                                  ...state,
                                  [item.id]: { ...draft, description: event.target.value },
                                }))
                              }
                              value={draft.description ?? ''}
                            />
                          </label>
                          <label className="admin-form__group">
                            Image
                            <input
                              accept="image/*"
                              onChange={(event) =>
                                uploadImage(
                                  event.target.files?.[0],
                                  `item-${item.id}-image`,
                                  (dataUrl) =>
                                    setItemDrafts((state) => ({
                                      ...state,
                                      [item.id]: { ...draft, imageUrl: dataUrl },
                                    }))
                                )
                              }
                              type="file"
                            />
                          </label>
                          {uploadingField === `item-${item.id}-image` ? (
                            <span className="admin-upload__status">Processing image...</span>
                          ) : null}
                          {draft.imageUrl ? (
                            <>
                              <img
                                alt={`${item.name} preview`}
                                className="admin-manage-card__thumb"
                                src={draft.imageUrl}
                              />
                              <button
                                className="admin-upload__clear"
                                onClick={() =>
                                  setItemDrafts((state) => ({
                                    ...state,
                                    [item.id]: { ...draft, imageUrl: '' },
                                  }))
                                }
                                type="button"
                              >
                                Remove Image
                              </button>
                            </>
                          ) : null}
                          <label className="admin-form__group">
                            Price
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
                          </label>
                          <label className="admin-form__inline">
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
                            Featured item
                          </label>
                          <button
                            disabled={isSaving}
                            onClick={() =>
                              runAction(
                                async () => {
                                  await updateItem(tenantId, item.id, draft);
                                  setEditingEntity(null);
                                },
                                'Item updated.'
                              )
                            }
                            type="button"
                          >
                            Save Changes
                          </button>
                        </div>
                      ) : null}
                    </article>
                  );
                })}

                {!filteredItems.length ? <p className="admin-simple__hint">No items found.</p> : null}
              </div>
            ) : null}
          </section>
        ) : null}

        {activeSection === 'account' ? (
          <section className="admin-panel">
            <h2>My Account</h2>
            <form
              className="admin-form admin-form--account"
              onSubmit={(event) => {
                event.preventDefault();
                runAction(
                  () =>
                    updateTenantAdmin(tenantId, user.id, {
                      fullName: accountDraft.fullName.trim() || null,
                      email: accountDraft.email.trim(),
                      ...(accountDraft.password.trim() ? { password: accountDraft.password.trim() } : {}),
                    }),
                  'Account updated.'
                );
                setAccountDraft((state) => ({ ...state, password: '' }));
              }}
            >
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
        ) : null}
      </section>
    </main>
  );
}
