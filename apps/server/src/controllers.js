import util from "node:util";

import * as services from "./services.js";
import * as utils from "./utils.js";

const options = {
  filename: { type: "string", default: "deck" },
  filepath: { type: "string", default: process.cwd() },
};

const {
  values: { filename, filepath },
} = util.parseArgs({ args: process.argv.slice(2), options });

const path = `${filepath}/${filename}`;

export const handleRequest = (req, res) => {
  console.log(
    "HTTP",
    req.httpVersion,
    req.method,
    req.url,
    req.headers["user-agent"],
  );
  console.log("header: ", req.headers);

  // CORS全許可
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, HEAD, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "*");

  switch (req.method) {
    case "GET":
      fs.readFile(path, (err, data) => {
        if (err) {
          console.log(err.message);
          res.end("Could not read questions deck");
        } else res.end(data);
      });
      break;
    case "PUT":
      let body = "";

      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", async () => {
        console.log(utils.infof("Received PUT data:", body));

        const { status, message } = await services.handlePutReq(body);

        if (status === "error") {
          console.log(utils.errorf(message));
          res.writeHead(400);
          res.end(message);
        } else {
          console.log(okf(message));
          res.writeHead(200);
          res.end(message);
        }
      });

      break;
    default:
      break;
  }
};
