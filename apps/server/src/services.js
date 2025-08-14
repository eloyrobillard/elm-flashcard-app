import * as checkers from "./checkers.js";
import * as models from "./models.js";
import * as utils from "./utils.js";

/**
 * @param {string} body
 */
export const handlePutReq = async (body) => {
  if (!body) {
    return { status: "error", message: "Got an empty body!" };
  }

  const isBodyValid = checkers.isValidFormat(body);
  if (!isBodyValid.succeeded) {
    return {
      status: "error",
      message: "Request body is of invalid format: " + isBodyValid.errorOn,
    };
  }

  // いきなりdeckを上書きするのはちょっと怖いので
  // ひとまずバックアップを作る
  const now = new Date().toISOString();
  const newPath = path + now;

  const backupStatus = await models.backupDeck(path, newPath);

  if (backupStatus.status === "error") return backupStatus;
  else console.log(utils.okf(backupStatus.message));

  return models.saveDeck(body, path);
};
