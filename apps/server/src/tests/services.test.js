import fsp from "node:fs/promises";
import * as services from "../services.js";

describe("services", () => {
  describe("handleGetReq", () => {
    it("should read the specified deck", async () => {
      const src = "./test";
      await fsp.writeFile(src, "test body");

      const { status, message } = await services.handleGetReq(src);

      expect(status).toBe("ok");

      const body = await fsp.readFile(src, { encoding: "utf8" });
      expect(body).toBe("test body");

      await fsp.rm(src);
    });

    it("should return a message if the source does not exist", async () => {
      const { status } = await services.handleGetReq("./non/existent/path");

      expect(status).toBe("error");
    });
  });
});
