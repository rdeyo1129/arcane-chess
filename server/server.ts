import bodyParser from 'body-parser';
import fs from 'fs';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import users from './api/users.js';
import games from './api/games.js';
import campaign from './api/campaign.js';
import templates from './api/templates.js';
import puzzles from './api/puzzles.js';
import express, { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import path from 'path';
import { createServer } from 'http';
import favicon from 'serve-favicon';
import helmet from 'helmet'; // For setting security headers
import rateLimit from 'express-rate-limit'; // For rate limiting
import xss from 'xss'; // For XSS protection

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
  .connect(process.env.MONGODB_URI || dbURI)
  .then(() => console.log('MongoDB successfully connected'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Express app setup
const app = express();
const server = createServer(app);

// Security Middleware: Helmet for setting various HTTP headers
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'nonce-random-value'", "'unsafe-inline'"],
    },
  })
);

// Rate limiting middleware: limit the number of requests to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
});
app.use(limiter);

// Helper function to sanitize input (using XSS library)
const sanitizeInput = (req: Request, _res: Response, next: NextFunction) => {
  const sanitizeObject = (obj: Record<string, any>) => {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = xss(obj[key]); // Sanitize strings
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitizeObject(obj[key]); // Recursively sanitize objects
      }
    }
  };

  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.headers) sanitizeObject(req.headers);

  next();
};

// Apply the XSS protection middleware globally
app.use(sanitizeInput);

// Use body parser with a request body size limit to prevent large payload attacks
app.use(bodyParser.urlencoded({ extended: true, limit: '10kb' }));
app.use(bodyParser.json({ limit: '10kb' }));

// Serve static files
app.use(express.static('dist/frontend'));
if (process.env.NODE_ENV === 'production') {
  app.use(favicon(path.join(__dirname, '..', '..', 'favicon.ico')));
}

// Routes
app.use('/api/users', users);
app.use('/api/games', games);
app.use('/api/campaign', campaign);
app.use('/api/templates', templates);
app.use('/api/puzzles', puzzles);

// Helper to generate nonce for CSP (Content Security Policy)
const generateNonce = () => crypto.randomBytes(16).toString('base64');

// Middleware to inject CSP nonce
app.use((_req, res, next) => {
  res.locals.nonce = generateNonce();
  next();
});

const staticPath = path.join(__dirname, '..', 'frontend');
const indexPath = path.join(staticPath, 'index.html');

// Middleware to generate and inject nonce into CSP header
const cspMiddleware = (_req: Request, res: Response, next: NextFunction) => {
  const nonce = crypto.randomBytes(16).toString('base64');
  res.locals.nonce = nonce;
  res.setHeader(
    'Content-Security-Policy',
    `script-src 'self' 'nonce-${nonce}'; object-src 'none'; base-uri 'self';`
  );
  res.setHeader('Cache-Control', 'no-store');
  next();
};

app.use(cspMiddleware);

// Modify the HTML serving route to inject nonce into script tags
app.get('*', (_req, res) => {
  fs.readFile(indexPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading index.html:', err);
      return res.status(500).send('Error serving the application');
    }
    // Replace script tags with nonce
    const updatedData = data.replace(
      /<script.*?src="(.*?)".*?<\/script>/g,
      `<script src="$1" nonce="${res.locals.nonce}"></script>`
    );
    res.send(updatedData);
  });
});

// Start server and listen globally (0.0.0.0) to allow access from any IP
const port = Number(process.env.PORT) || 8080;
const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
server.listen(port, host, () => {
  console.log(`Server is listening on ${host}:${port}`);
});
