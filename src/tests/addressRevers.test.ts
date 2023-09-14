import { describe, expect, it } from "@jest/globals";
import request from "supertest";
import { app } from "../app";

describe("Test Address Reverse API", () => {
  it("returns 200", async () => {
    const res = await request(app).get(
      "/api/address-reverse/48.109084953055884/-1.692617319569419",
    );

    expect(res.statusCode).toEqual(200);
    expect(res.body).not.toBeNull();

    // Test content here
    expect(res.body).toBe("60 Mail François Mitterrand 35000 Rennes");
  });

  it("returns 400 when invalid lat long", async () => {
    const res = await request(app).get("/api/address-reverse/1000/abc");

    expect(res.statusCode).toEqual(400);
    expect(res.body.errors.length).toEqual(2);

    // Test content here
    expect(res.body.errors[0].path).toBe("lat");
    expect(res.body.errors[0].msg).toBe("Invalid latitude");
    expect(res.body.errors[0].value).toBe("1000");
    expect(res.body.errors[1].path).toBe("lon");
    expect(res.body.errors[1].msg).toBe("Invalid longitude");
    expect(res.body.errors[1].value).toBe("abc");
  });
});
