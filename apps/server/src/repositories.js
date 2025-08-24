import assert from "node:assert";
import fsp from "node:fs/promises";

import * as errors from "./errors.js";

export const readDeck = async (path) => {
  try {
    const deck = await fsp.readFile(path);
    return { status: "ok", data: deck.toString() };
  } catch (e) {
    return {
      status: "error",
      error: errors.translateError(e),
      message: "Could not read deck: " + e.message,
    };
  }
};

/**
 * @param {string} src - Path to source.
 * @param {string} dest - Path to copy.
 */
export const backupDeck = async (src, dest) => {
  try {
    await fsp.copyFile(src, dest);
    return { status: "ok", message: "Backed up current deck to: " + dest };
  } catch (e) {
    return {
      status: "error",
      error: errors.translateError(e),
      message: "Failed to back up current deck: " + e.message,
    };
  }
};

/**
 * @param {string} path
 * @param {string} body
 */
export const saveDeck = async (path, body) => {
  assert(typeof body === "string", "Deck body must be a string");
  try {
    await fsp.writeFile(path, body);
    return { status: "ok", message: "Saved new deck to: " + path };
  } catch (e) {
    return {
      status: "error",
      error: errors.translateError(e),
      message: "Failed to save new deck: " + e.message,
    };
  }
};
