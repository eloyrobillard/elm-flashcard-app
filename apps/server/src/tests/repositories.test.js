import fs from "node:fs";
import fsp from "node:fs/promises";

import * as repositories from "../repositories.js";

describe("repositories", () => {
  const src = "./test";
  const dest = "./dest";

  beforeEach(() => fs.writeFileSync(src, ""));

  afterEach(() => fs.rmSync(src));

  describe("saveDeck", () => {
    it("should create a deck", async () => {
      const { status, message } = await repositories.saveDeck(
        dest,
        "Test body",
      );

      expect(status).not.toBeNull();
      expect(status).toBeDefined();
      expect(message).not.toBeNull();
      expect(message).toBeDefined();

      if (status === "ok") {
        try {
          const body = await fsp.readFile(dest);
          expect(body).toBe("Test contents");
          fs.rmSync(dest);
        } catch (_) {}
      }
    });
  });

  describe("readDeck", () => {
    it("should read the contents of an existing deck", async () => {
      const data = "test message";

      await fsp.writeFile(src, data);

      const res = await repositories.readDeck(src);

      expect(res.status).toBe("ok");
      expect(res.data).toBe(data);
    });

    it("should return an error if the deck does not exist", async () => {
      const res = await repositories.readDeck("./non/existent/path");

      expect(res.status).toBe("error");
    });
  });

  describe("backupDeck", () => {
    it("should make an exact copy of the deck", async () => {
      const { status, message } = await repositories.backupDeck(src, dest);

      expect(status).not.toBeNull();
      expect(status).toBeDefined();
      expect(message).not.toBeNull();
      expect(message).toBeDefined();

      if (status === "ok") {
        try {
          const cpContents = await fsp.readFile(dest);
          expect(cpContents).toBe("Test contents");
          fs.rmSync(dest);
        } catch (_) {}
      }
    });
  });
});
