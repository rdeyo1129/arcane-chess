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

const nodeEnv = process.env.NODE_ENV || 'development';
const envPath = path.resolve(process.cwd(), `.env.${nodeEnv}`);
dotenv.config({ path: envPath });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

mongoose.set('strictQuery', false);

const dbURI = process.env.MONGO_URI;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || (dbURI as string))
  .then(() => console.log('MongoDB successfully connected'))
  .catch((err) => console.log(err, 'mongo uri:', process.env.MONGO_URI));

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
  console.log('dir:', __dirname);
  app.use(express.static(__dirname));
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

// Set Content Security Policy headers
app.use((_req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'none'; font-src <URL>; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; frame-src 'self'; object-src 'none';"
  );
  next();
});

app.get('*', (_req, res) => {
  console.log('dir:', __dirname);
  res.sendFile(path.resolve('/dist/frontend/', 'index.html'));
});

server.listen(port, () => console.log(`Listening on port ${port}`));
