import assert from "node:assert";
import fsp from "node:fs/promises";

/**
 * @param {string} src
 * @returns {Promise<{tag: string, value: string}>}
 */
export const readDeck = async (src) => {
  try {
    const deck = await fsp.readFile(src);
    return { tag: "ok", value: deck.toString() };
  } catch (e) {
    assert(e instanceof Error);
    return {
      tag: "error",
      value: "Could not read deck: " + e.message,
    };
  }
};

/**
 * @param {string} src - Path to source.
 * @param {string} dest - Path to copy.
 * @returns {Promise<{tag: string, value: string}>}
 */
export const backupDeck = async (src, dest) => {
  try {
    await fsp.copyFile(src, dest);
    return { tag: "ok", value: "Backed up current deck to: " + dest };
  } catch (e) {
    assert(e instanceof Error);
    return {
      tag: "error",
      value: "Failed to back up current deck: " + e.message,
    };
  }
};

/**
 * @param {string} path
 * @param {string} body
 * @returns {Promise<{tag: string, value: string}>}
 */
export const saveDeck = async (path, body) => {
  try {
    await fsp.writeFile(path, body);
    return { tag: "ok", value: "Saved new deck to: " + path };
  } catch (e) {
    assert(e instanceof Error);
    return {
      tag: "error",
      value: "Failed to save new deck: " + e.message,
    };
  }
};
