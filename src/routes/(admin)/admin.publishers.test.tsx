import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";

import { renderRoute } from "../../test-utils";
import { server } from "../../mocks/server";
import { BASE_URL } from "../../api/client";
import { envelope } from "../../mocks/handlers";

import type { Publisher } from "../../api/types";

import { useAuth, useUser } from "@clerk/react";
import {
  adminUser,
  buyerUser,
  AUTH_SIGNED_OUT,
  AUTH_SIGNED_IN,
  USER_SIGNED_OUT,
  userCtx,
} from "../../mocks/fixtures";

const mockUseAuth = vi.mocked(useAuth);
const mockUseUser = vi.mocked(useUser);

const twoPublishers: Publisher[] = [
  { id: "riot", slug: "riot", name: "Riot Games", accentColor: "#d13639", games: [] },
  { id: "valve", slug: "valve", name: "Valve", accentColor: "#1a9fff", games: [] },
];

beforeEach(() => {
  vi.clearAllMocks();
});

describe("/admin/publishers", () => {
  it("redirects unauthenticated user to /sign-in", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_OUT);
    mockUseUser.mockReturnValue(USER_SIGNED_OUT);
    const { router } = renderRoute("/admin/publishers");
    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/sign-in");
    });
  });

  it("redirects signed-in non-admin to /", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
    mockUseUser.mockReturnValue(userCtx(buyerUser));
    const { router } = renderRoute("/admin/publishers");
    await waitFor(() => {
      expect(router.state.location.pathname).toBe("/");
    });
  });

  it("renders publisher rows for admin user", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
    mockUseUser.mockReturnValue(userCtx(adminUser));
    server.use(
      http.get(`${BASE_URL}/publishers`, () => HttpResponse.json(envelope(twoPublishers)))
    );

    renderRoute("/admin/publishers");

    expect(await screen.findByText("Riot Games")).toBeInTheDocument();
    expect(screen.getByText("valve")).toBeInTheDocument();
  });

  it("shows empty state when no publishers", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
    mockUseUser.mockReturnValue(userCtx(adminUser));
    server.use(http.get(`${BASE_URL}/publishers`, () => HttpResponse.json(envelope([]))));

    renderRoute("/admin/publishers");

    expect(await screen.findByText(/no publishers yet/i)).toBeInTheDocument();
  });

  it("create form fires POST /publishers", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
    mockUseUser.mockReturnValue(userCtx(adminUser));
    server.use(http.get(`${BASE_URL}/publishers`, () => HttpResponse.json(envelope([]))));

    let posted = false;
    server.use(
      http.post(`${BASE_URL}/publishers`, async () => {
        posted = true;
        const created: Publisher = {
          id: "new",
          slug: "new-pub",
          name: "New Publisher",
          accentColor: "#000",
          games: [],
        };
        return HttpResponse.json(envelope(created), { status: 201 });
      })
    );

    renderRoute("/admin/publishers");

    const user = userEvent.setup();
    await user.click(await screen.findByRole("button", { name: /\+ new publisher/i }));
    await user.type(screen.getByPlaceholderText("Name"), "New Publisher");
    await user.type(screen.getByPlaceholderText("Slug (e.g. riot-games)"), "new-pub");
    await user.click(screen.getByRole("button", { name: /^save$/i }));

    await waitFor(() => expect(posted).toBe(true));
  });

  it("edit form fires PATCH /publishers/:id", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
    mockUseUser.mockReturnValue(userCtx(adminUser));
    server.use(
      http.get(`${BASE_URL}/publishers`, () => HttpResponse.json(envelope(twoPublishers)))
    );

    let patched = false;
    server.use(
      http.patch(`${BASE_URL}/publishers/:id`, async () => {
        patched = true;
        return HttpResponse.json(envelope(twoPublishers[0]));
      })
    );

    renderRoute("/admin/publishers");

    const user = userEvent.setup();
    const editBtns = await screen.findAllByRole("button", { name: /^edit$/i });
    await user.click(editBtns[0]);
    const nameInput = screen.getByDisplayValue("Riot Games");
    await user.clear(nameInput);
    await user.type(nameInput, "Riot Games Updated");
    await user.click(screen.getByRole("button", { name: /^save$/i }));

    await waitFor(() => expect(patched).toBe(true));
  });

  it("delete fires DELETE /publishers/:id", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
    mockUseUser.mockReturnValue(userCtx(adminUser));
    server.use(
      http.get(`${BASE_URL}/publishers`, () => HttpResponse.json(envelope(twoPublishers)))
    );

    let deleted = false;
    server.use(
      http.delete(`${BASE_URL}/publishers/:id`, () => {
        deleted = true;
        return HttpResponse.json({ ok: true });
      })
    );

    renderRoute("/admin/publishers");

    const user = userEvent.setup();
    const deleteBtns = await screen.findAllByRole("button", { name: /^delete$/i });
    await user.click(deleteBtns[0]);
    await user.click(screen.getByRole("button", { name: /^confirm$/i }));

    await waitFor(() => expect(deleted).toBe(true));
  });
});
