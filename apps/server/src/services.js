import assert from "node:assert";

import * as checkers from "./checkers.js";
import * as config from "./config.js";
import * as errors from "./errors.js";
import * as repositories from "./repositories.js";
import * as R from "./result.ts";
import * as utils from "./utils.js";

/**
 * @param {string} src - Path to the source file
 */
export const handleGetReq = async (src) => repositories.readDeck(src);

/**
 * @param {string} body
 * @param {string} path
 * @returns {Promise<import("./result.ts").Result<string, string>>}
 */
export const handlePutReq = async (body, path) => {
  assert(!!body, "Got an empty body");

  const isBodyValid = checkers.isValidFormat(body);
  if (!isBodyValid.succeeded) {
    return R.err(errors.invalidFormatError + isBodyValid.errorOn);
  }

  // いきなりdeckを上書きするのはちょっと怖いので
  // ひとまずバックアップを作る
  const now = new Date().toISOString();
  const newPath = path + now;

  const backupStatus = await repositories.backupDeck(path, newPath);

  return R.reduce(
    (_err) => backupStatus,
    (value) => {
      console.log(utils.okf(value));
      return repositories.saveDeck(path, body);
    },
    backupStatus,
  );
};
