import { MenuPageHero } from '../components/sections/MenuPageHero.jsx';
import { MenuSection } from '../components/sections/MenuSection.jsx';
import { ReservationSection } from '../components/sections/ReservationSection.jsx';

export function MenuPage({
  bannerImage,
  menuHeroTitle,
  menuHeroSubtitle,
  view,
  currencyFormatter,
  onAddToCart,
  cartQuantities,
  cartCount,
  cartTotal,
  onUpdateCartQuantity,
  onGoToCart,
  reservationProps,
}) {
  return (
    <>
      <MenuPageHero
        imageUrl={bannerImage}
        title={menuHeroTitle}
        subtitle={menuHeroSubtitle}
      />

      <MenuSection
        menuSections={view.menuSections}
        items={view.items}
        currencyFormatter={currencyFormatter}
        onAddToCart={onAddToCart}
        cartQuantities={cartQuantities}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onUpdateCartQuantity={onUpdateCartQuantity}
        onGoToCart={onGoToCart}
      />

      <ReservationSection {...reservationProps} />
    </>
  );
}
