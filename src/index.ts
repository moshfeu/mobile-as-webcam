import { Server } from "./server";

const server = new Server();

server.listen((port, localNetworkIP) => {
  console.log(`Server is listening on https://localhost:${port},\nor on your network https://${localNetworkIP}:${port}`);
});
