// import { io, Socket } from "socket.io-client";

// let socket: Socket;

// if (typeof window !== "undefined") {
//   socket = io("http://localhost:3001");
// }

// export { socket };

// eliminate multiple socket connection everytime component re-renders || useEffect runs.
// HMR = Hot Module Replacement

import { io } from "socket.io-client";
export const socket = io("http://localhost:3001");
