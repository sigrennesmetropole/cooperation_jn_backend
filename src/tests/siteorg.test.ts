import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import { app } from "../app";

describe("Test Site Org API", () => {
  it("returns 200", async () => {
    const res = await request(app).get("/api/siteorg/site/1");

    expect(res.statusCode).toEqual(200);
    expect(res.body).not.toBeNull();

    const data = res.body;
    const keys = Object.keys(data);
    const expectedKeys = ["type", "crs", "features"];
    expectedKeys.forEach((key) => {
      expect(keys).toContain(key);
    });
    expect(data["type"]).toBe("FeatureCollection");
    expect(data["features"].length).toBeGreaterThan(1);
  });
});
