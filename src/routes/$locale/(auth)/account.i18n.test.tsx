import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";

import enUSAccount from "@/i18n/locales/en-US/account.json";
import enGBAccount from "@/i18n/locales/en-GB/account.json";
import frFRAccount from "@/i18n/locales/fr-FR/account.json";
import { PASSWORD_MIN_LENGTH } from "@/modules/account/passwordPolicy";
import { renderRoute } from "@/test-utils";
import { server } from "@/mocks/server";
import { BASE_URL } from "@/api/client";
import { VALID_TOKEN } from "@/mocks/handlers";

// The auth flows are the first thing a visitor from another market sees, and they are all
// form chrome — there is no API-supplied content here to leave untranslated. What these
// tests hold is that every one of the five flows follows the locale, including the messages
// that only appear when something goes wrong.

function passwordMin(copy: string): string {
  return copy.replace("{{min}}", String(PASSWORD_MIN_LENGTH));
}

describe("Sign-in across locales", () => {
  it("renders the form in French under the fr-FR prefix", async () => {
    renderRoute("/fr-FR/sign-in");

    expect(
      await screen.findByRole("heading", { name: frFRAccount.signIn.title })
    ).toBeInTheDocument();

    expect(screen.getByLabelText(frFRAccount.fields.email)).toBeInTheDocument();
    expect(screen.getByLabelText(frFRAccount.fields.password)).toBeInTheDocument();
    expect(screen.getByText(frFRAccount.signIn.forgotPassword)).toBeInTheDocument();
    expect(screen.queryByText(enUSAccount.signIn.forgotPassword)).not.toBeInTheDocument();
  });

  it("reports a rejected sign-in in the active locale", async () => {
    server.use(http.post(`${BASE_URL}/auth/login`, () => new HttpResponse(null, { status: 401 })));
    const user = userEvent.setup();

    renderRoute("/fr-FR/sign-in");

    await screen.findByRole("heading", { name: frFRAccount.signIn.title });
    await user.type(screen.getByLabelText(frFRAccount.fields.email), "buyer@test.com");
    await user.type(screen.getByLabelText(frFRAccount.fields.password), "wrong-password");
    await user.click(screen.getByRole("button", { name: frFRAccount.signIn.submit }));

    expect(await screen.findByTestId("sign-in-error")).toHaveTextContent(frFRAccount.signIn.failed);
  });

  it("translates the required-field messages", async () => {
    const user = userEvent.setup();

    renderRoute("/fr-FR/sign-in");

    await screen.findByRole("heading", { name: frFRAccount.signIn.title });
    await user.click(screen.getByRole("button", { name: frFRAccount.signIn.submit }));

    expect(await screen.findByText(frFRAccount.validation.email)).toBeInTheDocument();
    expect(screen.getByText(frFRAccount.validation.password)).toBeInTheDocument();
    // The key the schema actually reports must never reach the page.
    expect(screen.queryByText("validation.email")).not.toBeInTheDocument();
  });

  it("uses en-GB's own wording for the forgotten-password link", async () => {
    renderRoute("/en-GB/sign-in");

    await screen.findByRole("heading", { name: enGBAccount.signIn.title });

    expect(screen.getByText(enGBAccount.signIn.forgotPassword)).toBeInTheDocument();
    // The word that separates the two English locales.
    expect(enGBAccount.signIn.forgotPassword).not.toBe(enUSAccount.signIn.forgotPassword);
  });
});

describe("Sign-up across locales", () => {
  it("renders the form and its password hint in French", async () => {
    renderRoute("/fr-FR/sign-up");

    expect(
      await screen.findByRole("heading", { name: frFRAccount.signUp.title })
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(passwordMin(frFRAccount.fields.passwordPlaceholder))
    ).toBeInTheDocument();
  });

  it("states the password minimum in the active locale, with the policy's own number", async () => {
    const user = userEvent.setup();

    renderRoute("/fr-FR/sign-up");

    await screen.findByRole("heading", { name: frFRAccount.signUp.title });
    await user.type(screen.getByLabelText(frFRAccount.fields.email), "short@test.com");
    await user.type(screen.getByLabelText(frFRAccount.fields.password), "short");
    await user.click(screen.getByRole("button", { name: frFRAccount.signUp.submit }));

    const expected = passwordMin(frFRAccount.validation.passwordMin);

    expect(await screen.findByText(expected)).toBeInTheDocument();
    // The number comes from the schema's own constant, not from the copy.
    expect(expected).toContain(String(PASSWORD_MIN_LENGTH));
  });
});

describe("Forgot-password across locales", () => {
  it("renders the form and its confirmation in French", async () => {
    const user = userEvent.setup();

    renderRoute("/fr-FR/forgot-password");

    await screen.findByRole("heading", { name: frFRAccount.forgotPassword.title });
    await user.type(screen.getByLabelText(frFRAccount.fields.email), "buyer@test.com");
    await user.click(screen.getByRole("button", { name: frFRAccount.forgotPassword.submit }));

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: frFRAccount.forgotPassword.sentTitle })
      ).toBeInTheDocument();
    });

    expect(screen.getByTestId("forgot-password-success")).toHaveTextContent(
      frFRAccount.forgotPassword.sentBody
    );
  });
});

describe("Reset-password across locales", () => {
  it("renders the form in French", async () => {
    renderRoute(`/fr-FR/reset-password?token=${VALID_TOKEN}`);

    expect(
      await screen.findByRole("heading", { name: frFRAccount.resetPassword.title })
    ).toBeInTheDocument();

    expect(screen.getByLabelText(frFRAccount.resetPassword.newPassword)).toBeInTheDocument();
  });

  it("confirms a completed reset in French", async () => {
    const user = userEvent.setup();

    renderRoute(`/fr-FR/reset-password?token=${VALID_TOKEN}`);

    await screen.findByRole("heading", { name: frFRAccount.resetPassword.title });
    await user.type(
      screen.getByLabelText(frFRAccount.resetPassword.newPassword),
      "correct-horse-battery-staple"
    );
    await user.click(screen.getByRole("button", { name: frFRAccount.resetPassword.submit }));

    expect(await screen.findByTestId("reset-password-success")).toHaveTextContent(
      frFRAccount.resetPassword.doneBody
    );
    expect(
      screen.getByRole("button", { name: frFRAccount.resetPassword.goToSignIn })
    ).toBeInTheDocument();
  });

  it("reports an expired link in French", async () => {
    const user = userEvent.setup();

    renderRoute("/fr-FR/reset-password?token=bad-token");

    await screen.findByRole("heading", { name: frFRAccount.resetPassword.title });
    await user.type(
      screen.getByLabelText(frFRAccount.resetPassword.newPassword),
      "correct-horse-battery-staple"
    );
    await user.click(screen.getByRole("button", { name: frFRAccount.resetPassword.submit }));

    expect(await screen.findByTestId("reset-password-error")).toHaveTextContent(
      frFRAccount.resetPassword.failed
    );
  });
});

describe("Verify-email across locales", () => {
  it("confirms a verified email in French", async () => {
    renderRoute(`/fr-FR/verify-email?token=${VALID_TOKEN}`);

    expect(await screen.findByTestId("verify-email-success")).toHaveTextContent(
      frFRAccount.verifyEmail.successBody
    );
    expect(
      screen.getByRole("heading", { name: frFRAccount.verifyEmail.successTitle })
    ).toBeInTheDocument();
  });

  it("reports an invalid verification link in French", async () => {
    renderRoute("/fr-FR/verify-email?token=bad-token");

    expect(await screen.findByTestId("verify-email-error")).toHaveTextContent(
      frFRAccount.verifyEmail.failedBody
    );
    expect(screen.queryByText(enUSAccount.verifyEmail.failedBody)).not.toBeInTheDocument();
  });
});
