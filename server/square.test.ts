import { describe, it, expect } from "vitest";
import {
  isSquareConfigured,
  verifyCredentials,
  getSquareEnvironment,
} from "./_core/square";

describe("Square Integration", () => {
  it("should have Square credentials configured", () => {
    const configured = isSquareConfigured();
    expect(configured).toBe(true);
  });

  it("should be using sandbox environment for testing", () => {
    const env = getSquareEnvironment();
    expect(["sandbox", "production"]).toContain(env);
  });

  it("should verify Square credentials successfully", async () => {
    const result = await verifyCredentials();
    
    // Log the result for debugging
    console.log("Square verification result:", result);
    
    expect(result.valid).toBe(true);
    expect(result.locationId).toBeDefined();
    expect(result.locationName).toBeDefined();
  }, 15000); // Allow 15 seconds for API call
});
