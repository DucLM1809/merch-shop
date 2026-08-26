// Generated from src/i18n/locales/en-US by `pnpm i18n:types`. Do not edit by hand.

/** The default locale's resources, as literal types — the shape every locale must match. */
export interface GeneratedResources {
  account: {
    fields: {
      email: "Email";
      password: "Password";
      passwordPlaceholder: "Password (min. {{min}} characters)";
    };
    signIn: {
      title: "Sign in";
      submit: "Sign in";
      forgotPassword: "Forgot password?";
      failed: "Invalid email or password";
    };
    signUp: {
      title: "Sign up";
      submit: "Sign up";
      failed: "Could not create account. The email may already be in use.";
    };
    forgotPassword: {
      title: "Forgot password";
      submit: "Send reset link";
      sentTitle: "Check your email";
      sentBody: "If an account exists for that email, we've sent a link to reset your password.";
    };
    resetPassword: {
      title: "Reset password";
      submit: "Reset password";
      newPassword: "New password";
      newPasswordPlaceholder: "New password (min. {{min}} characters)";
      doneTitle: "Password reset";
      doneBody: "Your password has been reset. You can now sign in.";
      goToSignIn: "Go to sign in";
      failed: "This reset link is invalid or has expired.";
    };
    verifyEmail: {
      failedTitle: "Verification failed";
      failedBody: "This verification link is invalid or has expired.";
      successTitle: "Email verified";
      successBody: "Your email has been verified.";
      continue: "Continue";
    };
    validation: {
      email: "Email is required";
      password: "Password is required";
      passwordMin: "Password must be at least {{min}} characters";
    };
  };
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
      title: "Filters";
    };
    product: {
      noImage: "No image";
      size: "Size";
      color: "Color";
      edition: "Edition";
      optionUnavailable: "{{option}} (unavailable)";
      addToCart: "Add to Cart";
      addingToCart: "Adding…";
      addedToCart: "Added to cart";
      addedToCartDetail: "{{quantity}} × {{name}}";
      quantity: "Quantity";
      decreaseQuantity: "Decrease quantity";
      increaseQuantity: "Increase quantity";
      viewImage: "View image {{index}}";
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
  checkout: {
    title: "Checkout";
    steps: {
      label: "Checkout steps";
    };
    shipping: {
      heading: "Shipping";
      fullName: "Full Name";
      email: "Email";
      address: "Address";
      addressPlaceholder: "Street address";
      line2Placeholder: "Apartment, suite, etc. (optional)";
      city: "City";
      state: "State";
      postalCode: "Postal Code";
      postalCodePlaceholder: "Postal code";
      country: "Country";
    };
    payment: {
      heading: "Payment";
      pay: "Pay {{total}}";
      declined: "Payment failed";
      unexpected: "Something went wrong. Please try again.";
    };
    validation: {
      fullName: "Full name is required";
      email: "Enter a valid email address";
      line1: "Address is required";
      city: "City is required";
      state: "State is required";
      postalCode: "Postal code is required";
      country: "Country is required";
    };
    confirmation: {
      title: "Order Confirmed";
      orderId: "Order ID:";
      resolving: "Confirming your order…";
      emailSoon: "We'll email your order confirmation shortly.";
      itemsPurchased: "Items Purchased";
      total: "Total";
      continueShopping: "Continue Shopping";
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
  orders: {
    history: {
      title: "Order History";
      empty: "No orders yet.";
    };
    orderNumber: "Order #{{id}}";
    backToHistory: "Back to Order History";
    placed: "Placed {{date}}";
    loading: "Loading order…";
    notFound: "Order not found.";
    items: "Items";
    shipping: "Shipping";
    noShipping: "No shipping details available.";
    total: "Total";
    totalWithAmount: "Total: {{amount}}";
    status: {
      PENDING: "Pending";
      CONFIRMED: "Confirmed";
      FORWARDED: "Forwarded";
      CANCELLED: "Cancelled";
    };
  };
}
