import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
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
});
