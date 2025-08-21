import fs from "node:fs";
import fsp from "node:fs/promises";

import * as repositories from "../repositories.js";

describe("repositories", () => {
  const src = "./test";
  const dest = "./dest";

  beforeEach(() => fs.writeFileSync(src, ""));

  afterEach(() => fs.rmSync(src));

  it("should create a deck", async () => {
    const { status, message } = await repositories.saveDeck(dest, "Test body");

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

  it("should read the contents of a deck", async () => {
    const data = "test message";

    try {
      await fsp.writeFile(src, data);
    } catch (_) {}

    const res = await repositories.readDeck(src);

    expect(res.status).not.toBeNull();
    expect(res.status).toBeDefined();

    if (res.status === "ok") {
      expect(res.data).toBe(data);
    } else {
      expect(res.message).not.toBeNull();
      expect(res.message).toBeDefined();
    }
  });

  it("should make an exact copy of deck", async () => {
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
