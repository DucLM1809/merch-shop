import { render, screen } from "@testing-library/react";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { describe, it, expect } from "vitest";

import { AuthPageView } from "./AuthPageView";

function renderView(children: React.ReactNode) {
  return render(
    <ChakraProvider value={defaultSystem}>
      <AuthPageView>{children}</AuthPageView>
    </ChakraProvider>
  );
}

describe("AuthPageView", () => {
  it("renders children", () => {
    renderView(<div data-testid="child">Sign In</div>);
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("renders multiple children", () => {
    renderView(
      <>
        <div data-testid="a">A</div>
        <div data-testid="b">B</div>
      </>
    );
    expect(screen.getByTestId("a")).toBeInTheDocument();
    expect(screen.getByTestId("b")).toBeInTheDocument();
  });
});
