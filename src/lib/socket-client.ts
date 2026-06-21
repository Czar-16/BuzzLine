// import { io } from "socket.io-client";
// export const socket = io("http://localhost:3001");


import { io } from "socket.io-client";

export const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!);