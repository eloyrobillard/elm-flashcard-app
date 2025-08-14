import * as services from "./services.js";
import * as utils from "./utils.js";

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
      const result = await services.handleGetReq();
      if (result.status === "error") {
        console.log(utils.errorf(result.message));
      } else {
        res.writeHead(200);
        res.end(result.data);
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

        const { status, message } = await services.handlePutReq(body);

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
