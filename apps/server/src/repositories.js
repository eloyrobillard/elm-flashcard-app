import fsp from "node:fs/promises";

export const readDeck = async (path) => {
  try {
    const deck = await fsp.readFile(path);
    return { status: "ok", data: deck.toString() };
  } catch (err) {
    return { status: "error", message: "Could not read deck: " + err.message };
  }
};

/**
 * @param {string} path
 * @param {string} newPath
 */
export const backupDeck = async (path, newPath) => {
  try {
    await fsp.copyFile(path, newPath);
    return { status: "ok", message: "Backed up current deck to:", newPath };
  } catch (err) {
    return {
      status: "error",
      message: "Failed to back up current deck: " + err.message,
    };
  }
};

/**
 * @param {string} body
 * @param {string} path
 */
export const saveDeck = async (body, path) => {
  try {
    await fsp.writeFile(path, body);
    return { status: "ok", message: "Saved new deck to: " + path };
  } catch (err) {
    return {
      status: "error",
      message: "Failed to save new deck: " + err.message,
    };
  }
};
