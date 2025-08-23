import * as checkers from "./checkers.js";
import * as config from "./config.js";
import * as errors from "./errors.js";
import * as repositories from "./repositories.js";
import * as utils from "./utils.js";

export const handleGetReq = async (src) => repositories.readDeck(src);

/**
 * @param {string} body
 */
export const handlePutReq = async (body) => {
  if (!body) {
    return {
      status: "error",
      error: errors.emptyBody,
      message: "Got an empty body!",
    };
  }

  const isBodyValid = checkers.isValidFormat(body);
  if (!isBodyValid.succeeded) {
    return {
      status: "error",
      error: errors.invalidBody,
      message: "Request body is of invalid format: " + isBodyValid.errorOn,
    };
  }

  // いきなりdeckを上書きするのはちょっと怖いので
  // ひとまずバックアップを作る
  const now = new Date().toISOString();
  const fullPath = config.getFullPath();
  const newPath = fullPath + now;

  const backupStatus = await repositories.backupDeck(fullPath, newPath);

  if (backupStatus.status === "error") return backupStatus;
  else console.log(utils.okf(backupStatus.message));

  return repositories.saveDeck(fullPath, body);
};
