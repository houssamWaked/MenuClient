/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api/api.js';
import { useSiteDataContext } from './SiteDataContext.jsx';

const CartContext = createContext(null);

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function CartProvider({ children }) {
  const { data, tenantSlug } = useSiteDataContext();
  const storageKey = `cart:${tenantSlug}`;

  const [cartItemsById, setCartItemsById] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        setCartItemsById(parsed);
      }
    } catch {
      // Ignore cache parse errors.
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(cartItemsById));
    } catch {
      // Ignore storage failures.
    }
  }, [cartItemsById, storageKey]);

  useEffect(() => {
    if (!data?.items?.length) {
      return;
    }

    setCartItemsById((current) => {
      const updated = {};
      const dataItemMap = new Map(data.items.map((item) => [item.id, item]));

      for (const [itemId, cartItem] of Object.entries(current)) {
        const source = dataItemMap.get(itemId);
        if (!source) {
          continue;
        }

        updated[itemId] = {
          ...cartItem,
          name: source.name,
          imageUrl: source.imageUrl,
          basePrice: source.basePrice,
        };
      }

      return updated;
    });
  }, [data?.items]);

  const setQuantity = (item, quantity) => {
    const nextQuantity = Math.max(0, Number(quantity) || 0);

    setCartItemsById((current) => {
      const next = { ...current };
      if (nextQuantity === 0) {
        delete next[item.id];
        return next;
      }

      const existing = next[item.id];
      next[item.id] = {
        id: item.id,
        name: item.name,
        imageUrl: item.imageUrl,
        basePrice: item.basePrice,
        quantity: nextQuantity,
        ...(existing ?? {}),
      };
      return next;
    });
  };

  const increment = (item) => {
    setCartItemsById((current) => {
      const next = { ...current };
      const currentQuantity = next[item.id]?.quantity ?? 0;
      next[item.id] = {
        id: item.id,
        name: item.name,
        imageUrl: item.imageUrl,
        basePrice: item.basePrice,
        quantity: currentQuantity + 1,
      };
      return next;
    });
  };

  const decrement = (item) => {
    setCartItemsById((current) => {
      const next = { ...current };
      const currentQuantity = next[item.id]?.quantity ?? 0;
      const nextQuantity = currentQuantity - 1;
      if (nextQuantity <= 0) {
        delete next[item.id];
        return next;
      }

      next[item.id] = {
        ...next[item.id],
        quantity: nextQuantity,
      };
      return next;
    });
  };

  const clearCart = () => {
    setCartItemsById({});
  };

  const cartItems = Object.values(cartItemsById).sort((a, b) => a.name.localeCompare(b.name));
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + toNumber(item.basePrice) * item.quantity, 0);

  const getQuantity = (itemId) => cartItemsById[itemId]?.quantity ?? 0;

  const submitOrder = async ({ name, email, phone, notes }) => {
    if (!cartItems.length) {
      throw new Error('Cart is empty.');
    }

    setIsSubmittingOrder(true);
    try {
      const payload = {
        type: 'online',
        notes: notes?.trim() || undefined,
        customer: {
          name: name.trim(),
          email: email.trim(),
          phone: phone?.trim() || undefined,
        },
        items: cartItems.map((item) => ({
          itemId: item.id,
          quantity: item.quantity,
        })),
      };

      const order = await api.createPublicOrder(tenantSlug, payload);
      clearCart();
      return order;
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const value = {
    isCartOpen,
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),
    toggleCart: () => setIsCartOpen((current) => !current),
    cartItems,
    totalItems,
    totalPrice,
    getQuantity,
    setQuantity,
    increment,
    decrement,
    clearCart,
    submitOrder,
    isSubmittingOrder,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }

  return context;
}
