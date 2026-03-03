import { useEffect, useState } from 'react';
import { CartContext } from './cart-context.js';
import { resolveMenuItemId } from '../utils/landing.js';

const CART_STORAGE_KEY = 'menuclient-cart-v1';

function normalizeCartItem(item, index = 0) {
  if (!item || typeof item !== 'object') {
    return null;
  }

  return {
    id: resolveMenuItemId(item, index),
    name: item.name ?? 'Menu Item',
    description: item.description ?? '',
    imageUrl: item.imageUrl ?? '',
    price: Number(item.price) || 0,
    currency: item.currency ?? 'USD',
    badge: item.badge ?? null,
    categoryName: item.categoryName ?? null,
    quantity: Math.max(1, Number(item.quantity) || 1),
  };
}

function readStoredCart() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(CART_STORAGE_KEY);
    const parsedValue = rawValue ? JSON.parse(rawValue) : [];
    return Array.isArray(parsedValue)
      ? parsedValue
        .map((item, index) => normalizeCartItem(item, index))
        .filter(Boolean)
      : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (item, quantity = 1) => {
    const nextQuantity = Math.max(1, Number(quantity) || 1);
    const itemId = resolveMenuItemId(item, items.length);

    setItems((currentItems) => {
      const existingItem = currentItems.find((entry) => entry.id === itemId);

      if (existingItem) {
        return currentItems.map((entry) =>
          entry.id === itemId
            ? { ...entry, quantity: entry.quantity + nextQuantity }
            : entry
        );
      }

      return [
        ...currentItems,
        normalizeCartItem({ ...item, id: itemId, quantity: nextQuantity }, currentItems.length),
      ];
    });
  };

  const updateQuantity = (itemId, quantity) => {
    const nextQuantity = Number(quantity) || 0;

    setItems((currentItems) => {
      if (nextQuantity <= 0) {
        return currentItems.filter((item) => item.id !== itemId);
      }

      return currentItems.map((item) =>
        item.id === itemId ? { ...item, quantity: nextQuantity } : item
      );
    });
  };

  const removeItem = (itemId) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  const toggleCart = () => {
    setIsCartOpen((currentValue) => !currentValue);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const currency = items[0]?.currency ?? 'USD';

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        currency,
        isCartOpen,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
