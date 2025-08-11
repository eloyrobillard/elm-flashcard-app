import fsp from "node:fs/promises";

import * as utils from "./utils.js";
import * as checkers from "./checkers.js";

/**
 * @param {string} body
 */
export const handlePutReq = async (body) => {
  if (!body) {
    return { status: "error", message: "Got an empty body!" };
  }

  if (!checkers.isValidFormat(body)) {
    return {
      status: "error",
      message: "Request body is of invalid format!",
    };
  }

  // いきなりdeckを上書きするのはちょっと怖いので
  // ひとまずバックアップを作る
  const now = new Date().toISOString();
  const new_path = path + now;

  try {
    await fsp.copyFile(path, new_path);
    console.log(utils.okf("Backed up current deck to:", new_path));
  } catch (_) {
    return {
      status: "error",
      message: "Failed to back up current deck: " + err.message,
    };
  }

  try {
    await fsp.writeFile(path, body);
  } catch (_) {
    return {
      status: "error",
      message: "Failed to save new deck: " + err.message,
    };
  }

  return { status: "ok", message: "Saved new deck to: " + path };
};
