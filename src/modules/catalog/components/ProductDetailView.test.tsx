import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, afterEach } from "vitest";
import catalogCopy from "@/i18n/locales/en-US/catalog.json";
import { formatPrice } from "@/i18n/formatPrice";
import { renderWithProviders } from "@/test-utils";
import { toaster } from "@/components/Toaster";
import { ProductDetailView } from "./ProductDetailView";

const unavailable = (option: string) =>
  catalogCopy.product.optionUnavailable.replace("{{option}}", option);

const product = {
  id: "1",
  slug: "faker-jersey",
  name: "Faker Jersey",
  description: "Official T1 Faker jersey.",
  price: 59.99,
  publisherId: "riot",
  publisherSlug: "riot",
  gameId: "lol",
  gameSlug: "league-of-legends",
  accentColor: "#d13639",
  skus: [
    { id: "fj-s-black", size: "S", color: "Black", price: 59.99, available: true },
    { id: "fj-m-black", size: "M", color: "Black", price: 59.99, available: true },
    { id: "fj-l-black", size: "L", color: "Black", price: 59.99, available: false },
  ],
};

const renderBreadcrumbLink = (
  to: string,
  _params: Record<string, string> | undefined,
  label: string
) => <a href={to}>{label}</a>;

const breadcrumbItems = [
  { label: "Riot Games", to: "/riot" },
  { label: "League of Legends", to: "/riot/league-of-legends" },
  { label: "Faker Jersey" },
];

describe("ProductDetailView", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows no heading when loading", () => {
    renderWithProviders(<ProductDetailView product={undefined} isLoading={true} isError={false} />);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("shows error message when isError", () => {
    renderWithProviders(<ProductDetailView product={undefined} isLoading={false} isError={true} />);
    expect(screen.getByText(catalogCopy.errors.product)).toBeInTheDocument();
  });

  it("renders product name as heading", () => {
    renderWithProviders(<ProductDetailView product={product} isLoading={false} isError={false} />);
    expect(screen.getByRole("heading", { name: "Faker Jersey" })).toBeInTheDocument();
  });

  it("renders the price formatted for the rendering locale", () => {
    renderWithProviders(<ProductDetailView product={product} isLoading={false} isError={false} />);
    expect(screen.getByTestId("product-price")).toHaveTextContent(formatPrice(59.99, "en-US"));
  });

  it("renders all size options, naming the sold-out one as unavailable", () => {
    renderWithProviders(<ProductDetailView product={product} isLoading={false} isError={false} />);
    expect(screen.getByRole("button", { name: "S" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "M" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: unavailable("L") })).toBeInTheDocument();
  });

  it("Add to Cart is disabled when no SKU fully selected", () => {
    renderWithProviders(<ProductDetailView product={product} isLoading={false} isError={false} />);
    expect(screen.getByRole("button", { name: catalogCopy.product.addToCart })).toBeDisabled();
  });

  it("enables Add to Cart and calls onAddToCart with the selected SKU and quantity", async () => {
    const user = userEvent.setup();
    const onAddToCart = vi.fn();
    renderWithProviders(
      <ProductDetailView
        product={product}
        isLoading={false}
        isError={false}
        onAddToCart={onAddToCart}
      />
    );
    await user.click(screen.getByRole("button", { name: "S" }));
    await user.click(screen.getByRole("button", { name: "Black" }));
    const addBtn = screen.getByRole("button", { name: catalogCopy.product.addToCart });
    expect(addBtn).not.toBeDisabled();
    await user.click(addBtn);
    await waitFor(() => {
      expect(onAddToCart).toHaveBeenCalledWith(
        expect.objectContaining({ id: "fj-s-black", available: true }),
        1
      );
    });
  });

  it("unavailable SKU keeps Add to Cart disabled", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductDetailView product={product} isLoading={false} isError={false} />);
    await user.click(screen.getByRole("button", { name: unavailable("L") }));
    await user.click(screen.getByRole("button", { name: "Black" }));
    expect(screen.getByRole("button", { name: catalogCopy.product.addToCart })).toBeDisabled();
  });

  it("renders description when provided", () => {
    renderWithProviders(<ProductDetailView product={product} isLoading={false} isError={false} />);
    expect(screen.getByText("Official T1 Faker jersey.")).toBeInTheDocument();
  });

  it("renders a navigable Publisher → Game → Product breadcrumb", () => {
    renderWithProviders(
      <ProductDetailView
        product={product}
        isLoading={false}
        isError={false}
        breadcrumbItems={breadcrumbItems}
        renderBreadcrumbLink={renderBreadcrumbLink}
      />
    );
    expect(screen.getByRole("link", { name: "Riot Games" })).toHaveAttribute("href", "/riot");
    expect(screen.getByRole("link", { name: "League of Legends" })).toHaveAttribute(
      "href",
      "/riot/league-of-legends"
    );
    expect(screen.queryByRole("link", { name: "Faker Jersey" })).not.toBeInTheDocument();
  });

  it("renders no breadcrumb when no items are supplied", () => {
    renderWithProviders(<ProductDetailView product={product} isLoading={false} isError={false} />);
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("falls back to the single-image treatment when the product has no images array", () => {
    const productWithSingleImage = { ...product, imageUrl: "https://example.com/front.jpg" };
    renderWithProviders(
      <ProductDetailView product={productWithSingleImage} isLoading={false} isError={false} />
    );
    expect(screen.getByRole("img", { name: "Faker Jersey" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /view image/i })).not.toBeInTheDocument();
  });

  it("renders a thumbnail rail and switches the hero image when the product has multiple images", async () => {
    const user = userEvent.setup();
    const productWithGallery = {
      ...product,
      images: ["https://example.com/front.jpg", "https://example.com/back.jpg"],
    };
    renderWithProviders(
      <ProductDetailView product={productWithGallery} isLoading={false} isError={false} />
    );

    const thumbnails = screen.getAllByRole("button", { name: /view image/i });
    expect(thumbnails).toHaveLength(2);
    expect(thumbnails[0]).toHaveAttribute("aria-pressed", "true");

    await user.click(thumbnails[1]);
    expect(thumbnails[1]).toHaveAttribute("aria-pressed", "true");
    expect(thumbnails[0]).toHaveAttribute("aria-pressed", "false");
  });

  it("shows the no-image empty state when the product has neither images nor an imageUrl", () => {
    renderWithProviders(<ProductDetailView product={product} isLoading={false} isError={false} />);
    expect(screen.getByText(catalogCopy.product.noImage)).toBeInTheDocument();
  });

  it("a quantity stepper adjusts the quantity passed to onAddToCart", async () => {
    const user = userEvent.setup();
    const onAddToCart = vi.fn();
    renderWithProviders(
      <ProductDetailView
        product={product}
        isLoading={false}
        isError={false}
        onAddToCart={onAddToCart}
      />
    );
    await user.click(screen.getByRole("button", { name: "S" }));
    await user.click(screen.getByRole("button", { name: "Black" }));

    await user.click(screen.getByRole("button", { name: catalogCopy.product.increaseQuantity }));
    await user.click(screen.getByRole("button", { name: catalogCopy.product.increaseQuantity }));
    expect(screen.getByTestId("product-quantity-value")).toHaveTextContent("3");

    await user.click(screen.getByRole("button", { name: catalogCopy.product.addToCart }));
    await waitFor(() => {
      expect(onAddToCart).toHaveBeenCalledWith(expect.objectContaining({ id: "fj-s-black" }), 3);
    });
  });

  it("the quantity stepper never goes below 1", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductDetailView product={product} isLoading={false} isError={false} />);
    const decreaseBtn = screen.getByRole("button", { name: catalogCopy.product.decreaseQuantity });
    expect(decreaseBtn).toBeDisabled();
    await user.click(decreaseBtn);
    expect(screen.getByTestId("product-quantity-value")).toHaveTextContent("1");
  });

  it("shows a loading state on Add to Cart and a success toast once the SKU is added", async () => {
    const user = userEvent.setup();
    const createSpy = vi.spyOn(toaster, "create");
    let resolveAdd: () => void = () => {};
    const onAddToCart = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveAdd = resolve;
        })
    );
    renderWithProviders(
      <ProductDetailView
        product={product}
        isLoading={false}
        isError={false}
        onAddToCart={onAddToCart}
      />
    );
    await user.click(screen.getByRole("button", { name: "S" }));
    await user.click(screen.getByRole("button", { name: "Black" }));
    await user.click(screen.getByRole("button", { name: catalogCopy.product.addToCart }));

    expect(await screen.findByText(catalogCopy.product.addingToCart)).toBeInTheDocument();
    expect(createSpy).not.toHaveBeenCalled();

    resolveAdd();

    await waitFor(() => {
      expect(createSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: "success", title: catalogCopy.product.addedToCart })
      );
    });
  });
});
