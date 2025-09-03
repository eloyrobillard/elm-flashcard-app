import assert from "node:assert";
import fsp from "node:fs/promises";

import * as R from "./result.ts";
import * as TUtils from "./type-utils.ts";

/**
 * @param {string} src - Path to the source file
 * @returns {Promise<import("./result.ts").Result<string, string>>}
 */
export const readDeck = async (src) => {
  try {
    const deck = await fsp.readFile(src);
    return R.ok(deck.toString());
  } catch (e) {
    assert(TUtils.assertSimpleError(e));
    return R.err("Could not read deck: " + e.message);
  }
};

/**
 * @param {string} src - Path to source.
 * @param {string} dest - Path to copy.
 * @returns {Promise<import("./result.ts").Result<string, string>>}
 */
export const backupDeck = async (src, dest) => {
  try {
    await fsp.copyFile(src, dest);
    return R.ok("Backed up current deck to: " + dest);
  } catch (e) {
    assert(TUtils.assertSimpleError(e));
    return R.err("Failed to back up current deck: " + e.message);
  }
};

/**
 * @param {string} path
 * @param {string} body
 * @returns {Promise<import("./result.ts").Result<string, string>>}
 */
export const saveDeck = async (path, body) => {
  try {
    await fsp.writeFile(path, body);
    return R.ok("Saved new deck to: " + path);
  } catch (e) {
    assert(TUtils.assertSimpleError(e));
    return R.err("Failed to save new deck: " + e.message);
  }
};
