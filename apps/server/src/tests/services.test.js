import fsp from "node:fs/promises";

import * as errors from "../errors.js";
import * as R from "../result.ts";
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
      const { tag, value } = await services.handleGetReq("./non/existent/path");

      expect(tag).toBe("error");
      expect(value.startsWith(errors.readDeckError)).toBe(true);
    });
  });

  describe("handlePutReq", () => {
    it("should save a new deck file", async () => {
      const validBody = '"valid","body"\n"valid","body"';
      const validPath = "./tests/deck";

      const res = await services.handlePutReq(validBody, validPath);

      expect(R.isOk(res)).toBe(true);
    });

    it("should return an error if the input is of invalid format", async () => {
      const invalidBody = '"invalid"\n"body"';
      const validPath = "./tests/deck";

      const { tag, value } = await services.handlePutReq(
        invalidBody,
        validPath,
      );

      expect(tag).toBe("error");
      expect(value.startsWith(errors.invalidFormatError)).toBe(true);
    });

    it("should fail if the path is invalid", async () => {
      const validBody = '"valid","body"\n"valid","body"';
      const invalidPath = "./invalid/path/deck";

      const { tag, value } = await services.handlePutReq(
        validBody,
        invalidPath,
      );

      expect(tag).toBe("error");
      expect(value.startsWith(errors.backupDeckError)).toBe(true);
    });
  });
});
