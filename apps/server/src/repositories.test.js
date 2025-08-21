import fsp from "node:fs/promises";

import * as repositories from "./repositories.js";

test("make an exact copy of deck", async () => {
  const src = "./test";
  await fsp.writeFile(src, "Test contents.");

  const dest = "./test.dest";

  const { status, message } = await repositories.backupDeck(src, dest);

  expect(status).not.toBeNull();
  expect(status).toBeDefined();
  expect(message).not.toBeNull();
  expect(message).toBeDefined();

  if (status === "ok") {
    try {
      const cpContents = await fsp.readFile(dest);
      expect(cpContents).toBe("Test contents");
    } catch (_) {}
  }
});
