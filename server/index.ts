import express, { Express, Request, Response } from 'express';
import { connectDB } from './config/db';
import * as Sentry from "@sentry/node";
import dotenv from 'dotenv';
import csv from "csv-parser"
import fs from "fs";
import cors from 'cors';
import { ArtistRoutes } from './routes/artists';
import { limiter } from './middlewares/rate-limit';

dotenv.config();

const port = process.env.PORT;

const app: Express = express();

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app }),
    // Automatically instrument Node.js libraries and frameworks
    ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context, so that all
// transactions/spans/breadcrumbs are isolated across requests
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.use(express.json());
app.use(cors());

connectDB();

type ArtistLookup = {
  [key: string]: number;
}

export let artistLookup: ArtistLookup = {};

fs.createReadStream('artist-genre-decade.csv')
  .pipe(csv(['Artist', 'Genre', 'Decade']))
  .on('data', (data) => artistLookup[data.Artist] = data.Decade)
  .on('end', () => {
    console.log('CSV file successfully processed');
  });

app.get('/health', (_: Request, res: Response) => {
  res.send('OK');
});

app.use('/api', limiter);
app.use('/api/artists', ArtistRoutes);

// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});