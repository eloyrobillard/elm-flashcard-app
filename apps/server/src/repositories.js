import assert from "node:assert";
import fsp from "node:fs/promises";

import * as errors from "./errors.js";

export const readDeck = async (path) => {
  try {
    const deck = await fsp.readFile(path);
    return { status: "ok", data: deck.toString() };
  } catch (err) {
    return {
      status: "error",
      error: errors.deckReadFailure,
      message: "Could not read deck: " + err.message,
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
  } catch (err) {
    return {
      status: "error",
      error: errors.deckBackupFailure,
      message: "Failed to back up current deck: " + err.message,
    };
  }
};

/**
 * @param {string} path
 * @param {string} body
 */
export const saveDeck = async (path, body) => {
  try {
    await fsp.writeFile(path, body);
    return { status: "ok", message: "Saved new deck to: " + path };
  } catch (e) {
    let error = errors.unknownError;
    if (e.name === "Error" && e.message.startsWith("ENOENT"))
      error = errors.invalidPath;

    return {
      status: "error",
      error,
      message: "Failed to save new deck: " + e.message,
    };
  }
};
