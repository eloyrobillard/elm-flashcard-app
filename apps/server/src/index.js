import http from "node:http";

import * as controllers from "./controllers.js";

const server = http.createServer();

server.on("request", controllers.handleRequest);

server.listen(8001, "127.0.0.1", () => console.log("Listening on port 8001"));
