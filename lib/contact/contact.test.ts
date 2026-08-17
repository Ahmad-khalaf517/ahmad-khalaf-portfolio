import { describe, expect, it } from "vitest";
import { createRateLimiter } from "./rate-limit";
import { contactFormInputSchema } from "./schemas";

describe("contact form input", () => {
  it("normalizes valid input", () => {
    const result = contactFormInputSchema.parse({
      name: "  Ahmad  ",
      email: "  AHMAD@example.com ",
      message: "  Hello  ",
      website: "",
    });

    expect(result).toEqual({
      name: "Ahmad",
      email: "ahmad@example.com",
      message: "Hello",
      website: "",
    });
  });

  it("rejects malformed and oversized direct-call input", () => {
    expect(
      contactFormInputSchema.safeParse({
        name: "",
        email: "not-an-email",
        message: "x".repeat(5001),
        website: "",
      }).success,
    ).toBe(false);
  });
});

describe("contact rate limiter", () => {
  it("blocks attempts beyond the limit until the window resets", () => {
    const limiter = createRateLimiter({ limit: 2, windowMs: 1000 });

    expect(limiter.check("visitor", 0).allowed).toBe(true);
    expect(limiter.check("visitor", 100).allowed).toBe(true);
    expect(limiter.check("visitor", 200)).toEqual({
      allowed: false,
      retryAfterSeconds: 1,
    });
    expect(limiter.check("visitor", 1000).allowed).toBe(true);
  });
});
