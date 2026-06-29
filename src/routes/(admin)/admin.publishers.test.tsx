import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import { http, HttpResponse } from "msw";

import { renderRoute } from "../../test-utils";
import { server } from "../../mocks/server";
import { BASE_URL } from "../../api/client";

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
    server.use(http.get(`${BASE_URL}/publishers`, () => HttpResponse.json(twoPublishers)));

    renderRoute("/admin/publishers");

    expect(await screen.findByText("Riot Games")).toBeInTheDocument();
    expect(screen.getByText("valve")).toBeInTheDocument();
  });

  it("shows empty state when no publishers", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
    mockUseUser.mockReturnValue(userCtx(adminUser));
    server.use(http.get(`${BASE_URL}/publishers`, () => HttpResponse.json([])));

    renderRoute("/admin/publishers");

    expect(await screen.findByText(/no publishers yet/i)).toBeInTheDocument();
  });

  it("create form fires POST /publishers", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
    mockUseUser.mockReturnValue(userCtx(adminUser));
    server.use(http.get(`${BASE_URL}/publishers`, () => HttpResponse.json([])));

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
        return HttpResponse.json(created, { status: 201 });
      })
    );

    renderRoute("/admin/publishers");

    fireEvent.click(await screen.findByText("+ New Publisher"));
    fireEvent.change(screen.getByPlaceholderText("Name"), { target: { value: "New Publisher" } });
    fireEvent.change(screen.getByPlaceholderText("Slug (e.g. riot-games)"), {
      target: { value: "new-pub" },
    });
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => expect(posted).toBe(true));
  });

  it("edit form fires PATCH /publishers/:id", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
    mockUseUser.mockReturnValue(userCtx(adminUser));
    server.use(http.get(`${BASE_URL}/publishers`, () => HttpResponse.json(twoPublishers)));

    let patched = false;
    server.use(
      http.patch(`${BASE_URL}/publishers/:id`, async () => {
        patched = true;
        return HttpResponse.json(twoPublishers[0]);
      })
    );

    renderRoute("/admin/publishers");

    const editBtns = await screen.findAllByText("Edit");
    fireEvent.click(editBtns[0]);
    fireEvent.change(screen.getByDisplayValue("Riot Games"), {
      target: { value: "Riot Games Updated" },
    });
    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => expect(patched).toBe(true));
  });

  it("delete fires DELETE /publishers/:id", async () => {
    mockUseAuth.mockReturnValue(AUTH_SIGNED_IN);
    mockUseUser.mockReturnValue(userCtx(adminUser));
    server.use(http.get(`${BASE_URL}/publishers`, () => HttpResponse.json(twoPublishers)));

    let deleted = false;
    server.use(
      http.delete(`${BASE_URL}/publishers/:id`, () => {
        deleted = true;
        return HttpResponse.json({ ok: true });
      })
    );

    renderRoute("/admin/publishers");

    const deleteBtns = await screen.findAllByText("Delete");
    fireEvent.click(deleteBtns[0]);
    fireEvent.click(screen.getByText("Confirm"));

    await waitFor(() => expect(deleted).toBe(true));
  });
});
