import assert from "node:assert";

import * as checkers from "./checkers.js";
import * as config from "./config.js";
import * as repositories from "./repositories.js";
import * as R from "./result.js";
import * as utils from "./utils.js";

/**
 * @param {string} src - Path to the source file
 */
export const handleGetReq = async (src) => repositories.readDeck(src);

/**
 * @param {string} body
 * @returns {Promise<import("./result.ts").Result<string, string>>}
 */
export const handlePutReq = async (body) => {
  assert(!!body, "Got an empty body");

  const isBodyValid = checkers.isValidFormat(body);
  if (!isBodyValid.succeeded) {
    return R.err("Request body is of invalid format: " + isBodyValid.errorOn);
  }

  // いきなりdeckを上書きするのはちょっと怖いので
  // ひとまずバックアップを作る
  const now = new Date().toISOString();
  const fullPath = config.getFullPath();
  const newPath = fullPath + now;

  const backupStatus = await repositories.backupDeck(fullPath, newPath);

  return R.reduce(
    (_err) => backupStatus,
    (value) => {
      console.log(utils.okf(value));
      return repositories.saveDeck(fullPath, body);
    },
    backupStatus,
  );
};
