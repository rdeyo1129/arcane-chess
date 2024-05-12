// test 27488a30-1ff3-4f9a-b127-b63f68aabf76

// import _ from 'lodash';
import bodyParser from 'body-parser';

// import passport from "passport";
// import passportConfig from "./config/passport.mjs";

// import { v4 } from 'uuid';

// Load Game and User model
// import { Game } from "./src/models/Game.mjs";
// import User from "./src/models/User.mjs";

// import { keys } from './config/keys.js';

// { ConnectOptions } from "mongoose";
import mongoose from 'mongoose';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import dotenv from 'dotenv';

const envPath = path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`);
dotenv.config({ path: envPath });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// db config
const dbURI = process.env.DB_URI as string;

mongoose.set('strictQuery', false);

// Connect to MongoDB
mongoose
  .connect(dbURI as string)
  .then(() => console.log('MongoDB successfully connected'))
  .catch((err) => console.log(err));

import users from './api/users.js';
import games from './api/games.js';
import campaign from './api/campaign.js';
import templates from './api/templates.js';
import puzzles from './api/puzzles.js';

import express from 'express';
import path from 'path';
import { createServer } from 'http';
// import { Server } from 'socket.io';

// import favicon from 'serve-favicon';

const app = express();
const server = createServer(app);
// const io = new Server(server);

const port = process.env.PORT || 8080;

// todo
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  // app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
}
// if (process.env.NODE_ENV === 'development') { include separate DB/cluster here? }

// use body parser
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// Passport middleware
// app.use(passport.initialize());

// Passport config
// passportConfig(passport);

// Routes
app.use('/api/users', users);
app.use('/api/games', games);
app.use('/api/campaign', campaign);
app.use('/api/templates', templates);
app.use('/api/puzzles', puzzles);

app.get('*', (_req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
});

server.listen(port, () => console.log(`Listening on port ${port}`));
