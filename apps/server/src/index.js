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

const server = http.createServer();

server.on("request", (_req, res) => {
  const path = `${filepath}/${filename}`;

  fs.readFile(path, (err, data) => {
    if (err) {
      console.log(err.message);
      res.end("Could not read questions deck");
    } else res.end(data);
  });
});

server.listen(8001, "127.0.0.1", () => console.log("Listening on port 8001"));
