/**
 * Environment switches. Kept tiny and server-only in spirit: nothing here is a
 * secret, but the fixture flag must never be honoured in production.
 */
export const siteEnv = (process.env.SITE_ENV || "development") as
  | "development"
  | "test"
  | "staging"
  | "production";

/**
 * Development fixtures (fake casinos and offers on example.com) let us exercise
 * the affiliate pipeline end-to-end. They are hard-disabled when SITE_ENV is
 * "production", whatever the other flag says.
 */
export function fixturesEnabled(): boolean {
  if (siteEnv === "production") return false;
  return process.env.AFFILIATE_TEST_FIXTURES === "1";
}
