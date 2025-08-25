import fs from "node:fs";
import fsp from "node:fs/promises";

import * as repositories from "../repositories.js";

describe("repositories", () => {
  const src = "./test";
  const dest = "./dest";

  beforeEach(() => fs.writeFileSync(src, "Test contents"));

  afterEach(() => fs.rmSync(src));

  describe("saveDeck", () => {
    it("should create a deck", async () => {
      const { tag } = await repositories.saveDeck(dest, "Test body");

      expect(tag).toBe("ok");

      const body = await fsp.readFile(dest, { encoding: "utf8" });
      expect(body).toBe("Test body");

      fs.rmSync(dest);
    });

    it("should fail to create a deck when the path is invalid", async () => {
      const { tag } = await repositories.saveDeck(
        "./non/existent/path",
        "useless body",
      );

      expect(tag).toBe("error");
    });
  });

  describe("readDeck", () => {
    it("should read the contents of an existing deck", async () => {
      const data = "test message";

      await fsp.writeFile(src, data);

      const res = await repositories.readDeck(src);

      expect(res.tag).toBe("ok");
      expect(res.value).toBe(data);
    });

    it("should return an error if the deck does not exist", async () => {
      const res = await repositories.readDeck("./non/existent/path");

      expect(res.tag).toBe("error");
    });
  });

  describe("backupDeck", () => {
    it("should make an exact copy of the deck", async () => {
      const { tag } = await repositories.backupDeck(src, dest);

      expect(tag).toBe("ok");

      const cpContents = await fsp.readFile(dest, { encoding: "utf8" });
      expect(cpContents).toBe("Test contents");

      await fsp.rm(dest);
    });

    it("should return an error if the source does not exist", async () => {
      const { tag } = await repositories.backupDeck(
        "./non/existent/path",
        dest,
      );

      expect(tag).toBe("error");
    });

    it("should return an error if the destination does not exist", async () => {
      const { tag } = await repositories.backupDeck(src, "./non/existent/path");

      expect(tag).toBe("error");
    });
  });
});
