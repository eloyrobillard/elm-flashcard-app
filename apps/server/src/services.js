import assert from "node:assert";

import * as checkers from "./checkers.js";
import * as config from "./config.js";
import * as repositories from "./repositories.js";
import * as utils from "./utils.js";

/**
 * @param {string} src
 */
export const handleGetReq = async (src) => repositories.readDeck(src);

/**
 * @param {string} body
 * @returns {Promise<{tag: string, value: string}>}
 */
export const handlePutReq = async (body) => {
  assert(!!body, "Got an empty body");

  const isBodyValid = checkers.isValidFormat(body);
  if (!isBodyValid.succeeded) {
    return {
      tag: "error",
      value: "Request body is of invalid format: " + isBodyValid.errorOn,
    };
  }

  // いきなりdeckを上書きするのはちょっと怖いので
  // ひとまずバックアップを作る
  const now = new Date().toISOString();
  const fullPath = config.getFullPath();
  const newPath = fullPath + now;

  const backupStatus = await repositories.backupDeck(fullPath, newPath);

  if (backupStatus.tag === "error") return backupStatus;
  else console.log(utils.okf(backupStatus.value));

  return repositories.saveDeck(fullPath, body);
};
