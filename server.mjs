
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { readdirSync } from 'fs';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

dotenv.config();

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

mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('DB connected'))
  .catch((err) => console.log('DB CONNECTION ERROR => ', err));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
  })
);

// Autoload routes using dynamic imports
readdirSync('./routes').map(async (route) => {
  const routeModule = await import(`./routes/${route}`);
  app.use('/api', routeModule.default);
});

io.on('connect', (socket) => {
  socket.on('new-post', (newPost) => {
    socket.broadcast.emit('new-post', newPost);
  });
});

const port = process.env.PORT || 8000;

server.listen(port, () => console.log(`Server running on port ${port}`));
