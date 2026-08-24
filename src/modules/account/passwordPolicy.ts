/**
 * The minimum a password has to be, in one place.
 *
 * Both the sign-up and reset-password schemas enforce it, and the copy that tells a visitor
 * about it interpolates this number rather than spelling it out — so raising the minimum
 * can't leave three locales quietly promising the old one.
 */
export const PASSWORD_MIN_LENGTH = 12;
