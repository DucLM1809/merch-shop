import { describe, it, expect } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "@/test-utils";
import { buildOptimizedImageUrl, OptimizedImage } from "./OptimizedImage";

describe("buildOptimizedImageUrl", () => {
  it("builds a Vercel image optimization URL with width and default quality", () => {
    const url = buildOptimizedImageUrl("https://cdn.example.com/jersey.png", 400);
    expect(url).toBe("/_vercel/image?url=https%3A%2F%2Fcdn.example.com%2Fjersey.png&w=400&q=75");
  });

  it("accepts a custom quality", () => {
    const url = buildOptimizedImageUrl("https://cdn.example.com/jersey.png", 400, 50);
    expect(url).toContain("q=50");
  });
});

describe("OptimizedImage", () => {
  it("renders with a lazy loading transformed src by default", () => {
    renderWithProviders(
      <OptimizedImage src="https://cdn.example.com/jersey.png" width={400} alt="Faker Jersey" />
    );
    const img = screen.getByRole("img", { name: "Faker Jersey" });
    expect(img).toHaveAttribute(
      "src",
      buildOptimizedImageUrl("https://cdn.example.com/jersey.png", 400)
    );
    expect(img).toHaveAttribute("loading", "lazy");
  });

  it("loads eagerly when marked above-the-fold", () => {
    renderWithProviders(
      <OptimizedImage src="https://cdn.example.com/jersey.png" width={800} alt="Hero" eager />
    );
    expect(screen.getByRole("img", { name: "Hero" })).toHaveAttribute("loading", "eager");
  });

  it("falls back to a labeled placeholder when the image fails to load", () => {
    renderWithProviders(
      <OptimizedImage
        src="https://cdn.example.com/dead-link.png"
        width={400}
        alt="Faker Jersey"
        fallbackLabel="No image"
      />
    );

    fireEvent.error(screen.getByRole("img", { name: "Faker Jersey" }));

    expect(screen.queryByRole("img", { name: "Faker Jersey" })).not.toBeInTheDocument();
    expect(screen.getByText("No image")).toBeInTheDocument();
  });

  it("falls back to an unlabeled icon when the image fails to load with no fallbackLabel", () => {
    renderWithProviders(
      <OptimizedImage src="https://cdn.example.com/dead-link.png" width={400} alt="Faker Jersey" />
    );

    fireEvent.error(screen.getByRole("img", { name: "Faker Jersey" }));

    expect(screen.getByRole("img", { name: "Faker Jersey" })).toBeInTheDocument();
  });
});
