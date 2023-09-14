import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import { app } from "../app";

describe("Test Enedis API", () => {
  it.skip("returns 200", async () => {
    const res = await request(app).get("/api/enedis/district/352380301");

    expect(res.statusCode).toEqual(200);
    expect(res.body).not.toBeNull();

    // Test content here
  });

  it("returns 400 for non alpha numeric", async () => {
    const res = await request(app).get("/api/enedis/district/!@!@#!#!");
    expect(res.statusCode).toEqual(400);
    expect(res.body.errors[0].msg).toEqual(
      "CodeIris can only contain alphanumeric characters"
    );
  });
});
