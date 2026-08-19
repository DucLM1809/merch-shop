import { expect, test } from "../fixtures";

function parsePublisherAndGameSlug(productHref: string): {
  publisherSlug: string;
  gameSlug: string;
} {
  const [, , publisherSlug, gameSlug] = productHref.split("/");
  return { publisherSlug, gameSlug };
}

test("browsing the catalog and adding an item to the cart", async ({
  page,
  nav,
  catalog,
  productDetail,
  cart,
}) => {
  // This is a multi-step journey, so each leg below is its own Act/Assert pair,
  // chained off the state the previous leg's Assert just confirmed.

  // Arrange: homepage renders the catalog without errors.
  await page.goto("/en-US/");
  const homepageProductLink = catalog.firstProductLink();
  await expect(homepageProductLink).toBeVisible();

  const productHref = await homepageProductLink.getAttribute("href");
  if (!productHref) throw new Error("Homepage product card has no link.");
  const { publisherSlug, gameSlug } = parsePublisherAndGameSlug(productHref);

  // Act: publisher page → game page, via the sidebar nav (real clicks, not deep-linking).
  await page.goto(`/en-US/${publisherSlug}`);
  const gameLink = catalog.gameNavLink(publisherSlug, gameSlug);
  await expect(gameLink).toBeVisible();
  await gameLink.click();

  // Assert
  await expect(page).toHaveURL(new RegExp(`/${publisherSlug}/${gameSlug}/?$`));

  // Act: game page → product detail page.
  const gameProductLink = catalog.firstProductLink();
  await expect(gameProductLink).toBeVisible();
  const product = await productDetail.open(() => gameProductLink.click());
  const availableSku = product.skus?.find((sku) => sku.available);
  if (!availableSku) {
    throw new Error(
      `Product "${product.name}" has no in-stock SKU to add to cart — check the staging catalog seed data.`
    );
  }

  // Assert
  await expect(productDetail.heading(product.name)).toBeVisible();
  await expect(productDetail.price).toBeVisible();

  // Act: add the selected SKU to the cart.
  await productDetail.selectSku(availableSku);
  await productDetail.addToCart(() => expect(nav.cartBadgeCount("1")).toBeVisible());

  // Assert: the nav cart badge count updated (checked inline above as part of the action).

  // Act: navigate to /cart.
  await nav.cartLink.click();

  // Assert: the added item shows with the correct name and price.
  await expect(page).toHaveURL(/\/cart$/);
  await expect(cart.itemName(product.name)).toBeVisible();

  // Unit price and line total render as identical strings while quantity is 1.
  await expect(cart.priceText(availableSku.price)).toHaveCount(2);
  await expect(cart.subtotal).toHaveText(`$${availableSku.price.toFixed(2)}`);

  // Act: increment quantity.
  const doubled = availableSku.price * 2;
  await cart.increaseQuantity(() => expect(cart.subtotal).toHaveText(`$${doubled.toFixed(2)}`));

  // Assert: the line total (and subtotal, the only item in cart) updated.
  await expect(cart.priceText(availableSku.price)).toHaveCount(1);
  await expect(cart.priceText(doubled)).toBeVisible();

  // Act: decrement quantity.
  await cart.decreaseQuantity(() =>
    expect(cart.subtotal).toHaveText(`$${availableSku.price.toFixed(2)}`)
  );

  // Assert: the increment above is reversed.
  await expect(cart.priceText(availableSku.price)).toHaveCount(2);
});
