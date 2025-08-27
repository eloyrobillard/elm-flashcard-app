import fsp from "node:fs/promises";

import * as R from "../result.js";
import * as services from "../services.js";

describe("services", () => {
  describe("handleGetReq", () => {
    it("should read the specified deck", async () => {
      const src = "./test";
      await fsp.writeFile(src, "test body");

      const { tag } = await services.handleGetReq(src);

      expect(tag).toBe("ok");

      const body = await fsp.readFile(src, { encoding: "utf8" });
      expect(body).toBe("test body");

      await fsp.rm(src);
    });

    it("should return an error if the source does not exist", async () => {
      const { tag } = await services.handleGetReq("./non/existent/path");

      expect(tag).toBe("error");
    });
  });

  describe("handlePutReq", () => {
    it("should save a new deck file", async () => {
      const validBody = '"valid","body"\n"valid","body"';

      const res = await services.handlePutReq(validBody);

      expect(R.isOk(res)).toBe(true);
    });

    it("should return an error if the input is of invalid format", async () => {
      const invalidBody = '"invalid"\n"body"';

      const res = await services.handlePutReq(invalidBody);

      expect(R.isErr(res)).toBe(true);
    });
  });
});
