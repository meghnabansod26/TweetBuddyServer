// Importing necessary modules
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { readdirSync } from 'fs';
import morgan from 'morgan';
import dotenv from 'dotenv';
import http from 'http';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Configuring environment variables
dotenv.config();

// Creating Express app and HTTP server
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-type'],
  },
});

// Connecting to the database
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('DB connected'))
  .catch((err) => console.log('DB CONNECTION ERROR => ', err));

// Middleware setup
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [process.env.CLIENT_URL],
  })
);

// Autoload routes
readdirSync('./routes').map((r) => app.use('/api', require(`./routes/${r}`).default));

// Socket.io setup
io.on('connect', (socket) => {
  socket.on('new-post', (newPost) => {
    socket.broadcast.emit('new-post', newPost);
  });
});

// Setting up port
const port = process.env.PORT || 8000;

// Starting the server
server.listen(port, () => console.log(`Server running on port ${port}`));
