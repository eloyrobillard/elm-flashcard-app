import http from "node:http";

import * as config from "./config.js";
import * as services from "./services.js";
import * as utils from "./utils.js";

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 */
export const handleRequest = async (req, res) => {
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
      const result = await services.handleGetReq(config.getFilePath());
      if (result.tag === "error") {
        console.log(utils.errorf(result.value));
        res.writeHead(400);
        res.end();
      } else {
        res.writeHead(200);
        res.end(result.value);
        console.log(utils.infof("Sent deck over"));
      }

      break;
    case "OPTIONS":
      // necessary to signal to client which non-simple methods are allowed
      // like PUT or PATCH (related to CORS)
      res.writeHead(204);
      res.end();
      break;
    case "PUT":
      let body = "";

      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", async () => {
        console.log(utils.infof("Received PUT data:", body));

        const { tag: status, value: message } =
          await services.handlePutReq(body);

        if (status === "error") {
          console.log(utils.errorf(message));
          res.writeHead(400);
          res.end(message);
        } else {
          console.log(utils.okf(message));
          res.writeHead(200);
          res.end(message);
        }
      });

      break;
    default:
      break;
  }
};
