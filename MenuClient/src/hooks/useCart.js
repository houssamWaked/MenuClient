import { useEffect, useMemo, useState } from 'react';

const CART_STORAGE_KEY = 'menu_client_cart_v1';

function getInitialCart() {
  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return {};
    const parsed = JSON.parse(stored);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return Object.entries(parsed).reduce((accumulator, [itemId, quantity]) => {
      const normalizedQuantity = Number(quantity);
      if (normalizedQuantity > 0) accumulator[itemId] = Math.floor(normalizedQuantity);
      return accumulator;
    }, {});
  } catch {
    return {};
  }
}

export function useCart(items) {
  const [cart, setCart] = useState(getInitialCart);

  const itemMap = useMemo(() => {
    const map = new Map();
    items.forEach((item) => map.set(item.id, item));
    return map;
  }, [items]);

  const cartItems = useMemo(
    () =>
      Object.entries(cart)
        .map(([itemId, quantity]) => ({ item: itemMap.get(itemId), quantity }))
        .filter((entry) => entry.item && entry.quantity > 0),
    [cart, itemMap]
  );

  const cartTotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, entry) => sum + Number(entry.item.basePrice || 0) * Number(entry.quantity || 0),
        0
      ),
    [cartItems]
  );

  const cartCount = useMemo(
    () => cartItems.reduce((sum, entry) => sum + Number(entry.quantity || 0), 0),
    [cartItems]
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Persisting cart is best-effort only.
    }
  }, [cart]);

  const addToCart = (itemId) => {
    setCart((previous) => ({ ...previous, [itemId]: (previous[itemId] || 0) + 1 }));
  };

  const updateCartQuantity = (itemId, nextQuantity) => {
    setCart((previous) => {
      const quantity = Math.max(0, Number(nextQuantity) || 0);
      if (!quantity) {
        const updated = { ...previous };
        delete updated[itemId];
        return updated;
      }
      return { ...previous, [itemId]: quantity };
    });
  };

  const clearCart = () => setCart({});

  return {
    cartItems,
    cartTotal,
    cartCount,
    cart,
    addToCart,
    updateCartQuantity,
    clearCart,
  };
}
