import { http, HttpResponse } from "msw";
import { screen, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { server } from "@/mocks/server";
import { BASE_URL } from "@/api/client";
import { renderRoute } from "@/test-utils";

describe("Catalog route loading/error states", () => {
  describe("home / product catalog", () => {
    it("shows skeleton while products are loading", () => {
      server.use(http.get(`${BASE_URL}/products`, () => new Promise(() => {})));
      renderRoute("/");
      expect(screen.queryByText("Faker Jersey")).not.toBeInTheDocument();
    });

    it("shows retry button when products API returns 500", async () => {
      server.use(http.get(`${BASE_URL}/products`, () => new HttpResponse(null, { status: 500 })));
      renderRoute("/");
      await waitFor(() =>
        expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument()
      );
    });
  });

  describe("publisher page", () => {
    it("shows skeleton while publisher is loading", () => {
      server.use(http.get(`${BASE_URL}/publishers/:slug`, () => new Promise(() => {})));
      renderRoute("/riot/");
      expect(screen.queryByText("Riot Games")).not.toBeInTheDocument();
    });

    it("shows retry button when publisher API returns 500", async () => {
      server.use(
        http.get(`${BASE_URL}/publishers/:slug`, () => new HttpResponse(null, { status: 500 }))
      );
      renderRoute("/riot/");
      await waitFor(() =>
        expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument()
      );
    });
  });

  describe("game page", () => {
    it("shows skeleton while game/publisher data is loading", () => {
      server.use(http.get(`${BASE_URL}/publishers/:slug`, () => new Promise(() => {})));
      renderRoute("/riot/league-of-legends/");
      expect(screen.queryByText("League of Legends")).not.toBeInTheDocument();
    });

    it("shows retry button when publisher API returns 500 on game page", async () => {
      server.use(
        http.get(`${BASE_URL}/publishers/:slug`, () => new HttpResponse(null, { status: 500 }))
      );
      renderRoute("/riot/league-of-legends/");
      await waitFor(() =>
        expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument()
      );
    });
  });

  describe("product detail page", () => {
    it("shows skeleton while product is loading", () => {
      server.use(http.get(`${BASE_URL}/products/:id`, () => new Promise(() => {})));
      renderRoute("/riot/league-of-legends/products/faker-jersey");
      expect(screen.queryByText("Faker Jersey")).not.toBeInTheDocument();
    });

    it("shows retry button when product API returns 500", async () => {
      server.use(
        http.get(`${BASE_URL}/products/:id`, () => new HttpResponse(null, { status: 500 }))
      );
      renderRoute("/riot/league-of-legends/products/faker-jersey");
      await waitFor(() =>
        expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument()
      );
    });
  });
});
