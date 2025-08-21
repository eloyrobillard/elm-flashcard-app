import util from "node:util";

import * as checkers from "./checkers.js";
import * as repositories from "./repositories.js";
import * as utils from "./utils.js";

const options = {
  filename: { type: "string", default: "deck" },
  filepath: { type: "string", default: process.cwd() },
};

const {
  values: { filename, filepath },
} = util.parseArgs({ args: process.argv.slice(2), options });

const path = `${filepath}/${filename}`;

const fullPath = `${filepath}/${filename}`;

export const handleGetReq = async () => repositories.readDeck(fullPath);

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
  const newPath = fullPath + now;

  const backupStatus = await repositories.backupDeck(fullPath, newPath);

  if (backupStatus.status === "error") return backupStatus;
  else console.log(utils.okf(backupStatus.message));

  return repositories.saveDeck(fullPath, body);
};
