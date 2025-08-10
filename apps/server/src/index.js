import fs from "node:fs";
import http from "node:http";
import util from "node:util";

const options = {
  filename: { type: "string", default: "deck" },
  filepath: { type: "string", default: process.cwd() },
};

const {
  values: { filename, filepath },
} = util.parseArgs({ args: process.argv.slice(2), options });

const path = `${filepath}/${filename}`;

const server = http.createServer();

server.on("request", (req, res) => {
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

      req.on("end", () => {
        console.log("Received PUT data:", body);
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("PUT data received");

        if (!body) return;

        // いきなりdeckを上書きするのはちょっと怖いので
        // ひとまずバックアップを作る
        const now = new Date().toISOString();
        const new_path = path + now;

        fs.copyFile(path, new_path, (err) => {
          if (err) {
            console.log("Failed to back up current deck to:", new_path);
            console.log("Reason:", err.message);
            return;
          }

          console.log("Backed up current deck to:", new_path);

          fs.writeFile(path, body, (err) => {
            if (err) {
              console.log("Failed to save new deck:", err.message);
              return;
            }

            console.log("Saved new deck to:", path);
          });
        });
      });

      break;
    default:
      break;
  }
});

server.listen(8001, "127.0.0.1", () => console.log("Listening on port 8001"));
