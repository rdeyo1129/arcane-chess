import bodyParser from 'body-parser';
import fs from 'fs';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import path from 'path';
import { createServer } from 'http';
import favicon from 'serve-favicon';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import xss from 'xss';

import users from './api/users.js';
import games from './api/games.js';
import campaign from './api/campaign.js';
import templates from './api/templates.js';
import puzzles from './api/puzzles.js';
import threads from './api/threads.js';
import posts from './api/posts.js';
import categories from './api/categories.js';

import { Server } from 'socket.io';
import registerSockets from './sockets/index.js';

// Load environment variables
const nodeEnv = process.env.NODE_ENV || 'development';
const envPath = path.resolve(process.cwd(), `.env.${nodeEnv}`);
dotenv.config({ path: envPath });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

mongoose.set('strictQuery', false);

const dbURI = process.env.MONGO_URI;

if (!dbURI) {
  console.error(
    'MongoDB URI is missing. Please check your environment variables.'
  );
  process.exit(1);
}

// Connect to MongoDB
mongoose
  .connect(dbURI)
  .then(() => console.log('MongoDB successfully connected'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Express app setup
const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

registerSockets(io);

// Security Middleware (Helmet CSP simplified for readability)
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'nonce-random-value'", "'unsafe-inline'"],
    },
  })
);

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'Too many requests from this IP, please try again later',
});
app.use(limiter);

// Input Sanitization middleware
const sanitizeInput = (req: Request, _res: Response, next: NextFunction) => {
  const sanitizeObject = (obj: Record<string, any>) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string') obj[key] = xss(obj[key]);
      else if (typeof obj[key] === 'object' && obj[key] !== null)
        sanitizeObject(obj[key]);
    }
  };

  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.headers) sanitizeObject(req.headers);

  next();
};

app.use(sanitizeInput);
app.use(bodyParser.urlencoded({ extended: true, limit: '10kb' }));
app.use(bodyParser.json({ limit: '10kb' }));

app.use(express.static('dist/frontend'));

if (nodeEnv === 'production') {
  app.use(favicon(path.join(__dirname, '..', '..', 'favicon.ico')));
}

// EXISTING Routes
app.use('/api/users', users);
app.use('/api/games', games);
app.use('/api/campaign', campaign);
app.use('/api/templates', templates);
app.use('/api/puzzles', puzzles);

// NEW FORUM Routes
app.use('/api/threads', threads);
app.use('/api/posts', posts);
app.use('/api/categories', categories);

// CSP Nonce Middleware
const generateNonce = () => crypto.randomBytes(16).toString('base64');

app.use((_req, res, next) => {
  res.locals.nonce = generateNonce();
  next();
});

const staticPath = path.join(__dirname, '..', 'frontend');
const indexPath = path.join(staticPath, 'index.html');

const cspMiddleware = (_req: Request, res: Response, next: NextFunction) => {
  const nonce = generateNonce();
  res.locals.nonce = nonce;
  res.setHeader(
    'Content-Security-Policy',
    `script-src 'self' 'nonce-${nonce}'; object-src 'none'; base-uri 'self';`
  );
  res.setHeader('Cache-Control', 'no-store');
  next();
};

app.use(cspMiddleware);

app.get('*', (_req, res) => {
  fs.readFile(indexPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading index.html:', err);
      return res.status(500).send('Error serving the application');
    }
    const updatedData = data.replace(
      /<script.*?src="(.*?)".*?<\/script>/g,
      `<script src="$1" nonce="${res.locals.nonce}"></script>`
    );
    res.send(updatedData);
  });
});

// Start Server
const port = Number(process.env.PORT) || 8080;
const host = nodeEnv === 'production' ? '0.0.0.0' : 'localhost';
server.listen(port, host, () => {
  console.log(`Server is listening on ${host}:${port}`);
});
