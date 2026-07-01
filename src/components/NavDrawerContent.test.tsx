import { describe, it, expect, vi } from "vitest";
import { screen, within, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../test-utils";
import { NavDrawerContent } from "./NavDrawerContent";

describe("NavDrawerContent", () => {
  it("has dialog semantics", () => {
    renderWithProviders(
      <NavDrawerContent
        itemCount={0}
        isLoaded={true}
        isSignedIn={false}
        onClose={vi.fn()}
        onSignOut={vi.fn()}
      />
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleName();
  });

  it("closes on Escape", () => {
    const onClose = vi.fn();
    renderWithProviders(
      <NavDrawerContent
        itemCount={0}
        isLoaded={true}
        isSignedIn={false}
        onClose={onClose}
        onSignOut={vi.fn()}
      />
    );

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });

  it("returns focus to the previously focused element on unmount", () => {
    const trigger = document.createElement("button");
    document.body.appendChild(trigger);
    trigger.focus();

    const { unmount } = renderWithProviders(
      <NavDrawerContent
        itemCount={0}
        isLoaded={true}
        isSignedIn={false}
        onClose={vi.fn()}
        onSignOut={vi.fn()}
      />
    );

    expect(document.activeElement).not.toBe(trigger);
    unmount();
    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });
  it("shows guest sign-in/sign-up links when not signed in", () => {
    renderWithProviders(
      <NavDrawerContent
        itemCount={0}
        isLoaded={true}
        isSignedIn={false}
        onClose={vi.fn()}
        onSignOut={vi.fn()}
      />
    );

    const guestLinks = screen.getByTestId("drawer-guest-links");
    expect(within(guestLinks).getByText("Sign in")).toBeInTheDocument();
    expect(within(guestLinks).getByText("Sign up")).toBeInTheDocument();
    expect(screen.queryByTestId("drawer-username")).not.toBeInTheDocument();
  });

  it("shows username and sign-out when signed in", () => {
    renderWithProviders(
      <NavDrawerContent
        itemCount={0}
        isLoaded={true}
        isSignedIn={true}
        userDisplayName="Faker"
        onClose={vi.fn()}
        onSignOut={vi.fn()}
      />
    );

    expect(screen.getByTestId("drawer-username")).toHaveTextContent("Faker");
    expect(screen.getByTestId("drawer-sign-out")).toBeInTheDocument();
    expect(screen.queryByTestId("drawer-guest-links")).not.toBeInTheDocument();
  });

  it("renders neither auth block while auth is loading", () => {
    renderWithProviders(
      <NavDrawerContent
        itemCount={0}
        isLoaded={false}
        isSignedIn={undefined}
        onClose={vi.fn()}
        onSignOut={vi.fn()}
      />
    );

    expect(screen.queryByTestId("drawer-guest-links")).not.toBeInTheDocument();
    expect(screen.queryByTestId("drawer-username")).not.toBeInTheDocument();
  });

  it("always renders the cart link", () => {
    renderWithProviders(
      <NavDrawerContent
        itemCount={3}
        isLoaded={true}
        isSignedIn={false}
        onClose={vi.fn()}
        onSignOut={vi.fn()}
      />
    );

    expect(screen.getByTestId("drawer-cart-link")).toBeInTheDocument();
  });

  it("hides the cart badge when itemCount is zero", () => {
    renderWithProviders(
      <NavDrawerContent
        itemCount={0}
        isLoaded={true}
        isSignedIn={false}
        onClose={vi.fn()}
        onSignOut={vi.fn()}
      />
    );
    expect(within(screen.getByTestId("drawer-cart-link")).queryByText("2")).not.toBeInTheDocument();
  });

  it("shows the cart badge with the item count when itemCount is greater than zero", () => {
    renderWithProviders(
      <NavDrawerContent
        itemCount={2}
        isLoaded={true}
        isSignedIn={false}
        onClose={vi.fn()}
        onSignOut={vi.fn()}
      />
    );
    expect(within(screen.getByTestId("drawer-cart-link")).getByText("2")).toBeInTheDocument();
  });
});
