// Generated from src/i18n/locales/en-US by `pnpm i18n:types`. Do not edit by hand.

/** The default locale's resources, as literal types — the shape every locale must match. */
export interface GeneratedResources {
  cart: {
    title: "Cart";
    itemCount_one: "{{count}} item";
    itemCount_other: "{{count}} items";
    empty: {
      title: "Your cart is empty";
      hint: "Add some gear to get started";
      continueShopping: "Continue Shopping";
    };
    item: {
      decreaseQuantity: "Decrease quantity";
      increaseQuantity: "Increase quantity";
      remove: "Remove";
    };
    subtotal: "Subtotal";
    checkout: "Proceed to Checkout";
  };
  catalog: {
    home: {
      title: "All Products";
      eyebrow: "Official Merch";
      subtitle: "Gear from your favorite games and teams";
    };
    filters: {
      game: "Game";
      team: "Team";
      character: "Character";
    };
    product: {
      noImage: "No image";
      size: "Size";
      color: "Color";
      edition: "Edition";
      optionUnavailable: "{{option}} (unavailable)";
      addToCart: "Add to Cart";
    };
    empty: {
      title: "No products found.";
      hint: "Check back soon for new merch.";
    };
    publisher: {
      gameCount_one: "{{count}} game";
      gameCount_other: "{{count}} games";
    };
    errors: {
      products: "Failed to load products.";
      product: "Failed to load product.";
      game: "Failed to load game.";
      publisher: "Failed to load publisher.";
    };
  };
  common: {
    brand: "Merch Shop";
    nav: {
      openMenu: "Open navigation";
      menuLabel: "Navigation menu";
      cart: "Cart";
      cartItems_one: "Cart, {{count}} item";
      cartItems_other: "Cart, {{count}} items";
      signIn: "Sign in";
      signUp: "Sign up";
      signOut: "Sign out";
    };
    localeSwitcher: {
      label: "Language";
      options: {
        "en-US": "English (US)";
        "en-GB": "English (UK)";
        "fr-FR": "French";
      };
    };
    cartSync: {
      failed: "Cart sync failed — your items have been preserved.";
    };
    queryError: {
      message: "Something went wrong.";
      retry: "Try again";
    };
  };
}
