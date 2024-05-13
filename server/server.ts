// test 27488a30-1ff3-4f9a-b127-b63f68aabf76

// import _ from 'lodash';
import bodyParser from 'body-parser';
import fs from 'fs';

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
import crypto from 'crypto';
import path from 'path';
import { createServer } from 'http';
// import { Server } from 'socket.io';

import favicon from 'serve-favicon';

const app = express();
const server = createServer(app);
// const io = new Server(server);

const port = process.env.PORT || 8080;

if (process.env.NODE_ENV === 'production') {
  console.log(
    'Serving CSS from:',
    path.join(__dirname, '..', '..', 'static', 'main.css')
  );
  const staticPath = path.join(__dirname, '..', '..', 'static');
  app.use(express.static(staticPath));
  app.use(favicon(path.join(__dirname, '..', '..', 'favicon.ico')));
}

// use body parser
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// Routes
app.use('/api/users', users);
app.use('/api/games', games);
app.use('/api/campaign', campaign);
app.use('/api/templates', templates);
app.use('/api/puzzles', puzzles);

const frontendPath = path.join(__dirname, 'dist', 'frontend');

app.use(express.static(frontendPath));

// Helper to generate nonce
const generateNonce = () => crypto.randomBytes(16).toString('base64');

// Middleware to inject CSP nonce
app.use((_req, res, next) => {
  res.locals.nonce = generateNonce();
  next();
});

// Serve static files from the correct directory
app.use(express.static('dist/frontend'));

// Serve HTML with nonce
app.get('*', (_req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'frontend', 'index.html');
  fs.readFile(indexPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading the index.html file:', err);
      return res.status(500).send('Error serving the application');
    }
    // Inject nonce in meta tag
    data = data.replace(
      /<head>/,
      `<head><meta http-equiv="Content-Security-Policy" content="script-src 'nonce-${res.locals.nonce}'">`
    );
    res.send(data);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
