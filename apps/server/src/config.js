import util from "node:util";

/** @type {{[key: string]: { type: "string", default: string}}}  */
const options = {
  filename: { type: "string", default: "deck" },
  filepath: { type: "string", default: process.cwd() },
};

const {
  values: { filename, filepath },
} = util.parseArgs({ args: process.argv.slice(2), options });

export const getFilename = () => filename;

export const getFilePath = () => filepath;

export const getFullPath = () => `${filepath}/${filename}`;
