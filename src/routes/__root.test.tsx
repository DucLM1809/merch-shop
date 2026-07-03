import { screen, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { renderRoute } from "@/test-utils";

describe("Root route", () => {
  it("mounts Speed Insights alongside the rest of the shell without error", async () => {
    renderRoute("/");
    await waitFor(() => {
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });
  });
});
