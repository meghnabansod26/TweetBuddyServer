import { createRequire } from "module";
const require = createRequire(import.meta.url);
import express, { application } from "express";
import mongoose from "mongoose";
import cors from "cors";
import { readdirSync } from "fs";

const morgan = require("morgan");
require("dotenv").config();

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  path:"/socket.io",
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-type"],
  },
});
// db
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log("DB CONNECTION ERROR=>", err));

//middlewares
app.use(
  express.json({
    limit: "5mb",
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
  })
);

// tweetbuddy.com
// tweetbuddy.com/api 
// tweetbuddy.com/socket.io

//autoload routes
// readdirSync("./routes").map((r)=>app.use("/api", require(`./routes/${r}`)));

readdirSync("./routes").map(async (r) => {
  const { default: route } = await import(`./routes/${r}`);
  app.use("/api", route);
});

// //socketio
// io.on("connect", (socket)=>{
//     // console.log("SOCKET>IO", socket.id);

//     socket.on("send-message", (message)=>{
//         // console.log("new message received =>", message);
//         socket.broadcast.emit("receive-message", message);
//     });

// });

io.on("connect", (socket) => {
  // console.log("SOCKET>IO", socket.id);

  socket.on("new-post", (newPost) => {
    // console.log("socketio new post =>", newPost);
    socket.broadcast.emit("new-post", newPost);
  });
});

const port = process.env.PORT || 8000;

http.listen(port, () => console.log(`Server running on port ${port}`));
