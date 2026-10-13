
import { io } from "socket.io-client";

const SOCKET_URL = "https://decisionhub-api.vercel.app";

const socket = io(SOCKET_URL, {
  autoConnect: true,
  withCredentials: true,
});

export default socket;
