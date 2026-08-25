import { act } from "react";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithProviders } from "@/test-utils";
import { Toaster, toaster } from "./Toaster";

describe("Toaster", () => {
  it("renders a toast's title once created", async () => {
    renderWithProviders(<Toaster />);

    act(() => {
      toaster.create({ title: "Added to cart" });
    });

    expect(await screen.findByText("Added to cart")).toBeInTheDocument();
  });
});
