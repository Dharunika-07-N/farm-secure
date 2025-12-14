import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// --- Middlewares ---
app.use(cors({
    origin: [process.env.FRONTEND_URL || "http://localhost:5173", "http://localhost:5173", "http://localhost:8080", "http://127.0.0.1:5173"],
    credentials: true,
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Health Check Route ---
app.get('/', (req: Request, res: Response) => {
    res.send('Farm-Secure Backend is running!');
});

import v1Routes from './routes/v1';

app.use('/api/v1', v1Routes);

import { errorHandler } from './middleware/error.middleware';
app.use(errorHandler);

// Initialize cron jobs for automated tasks
import { initializeCronJobs } from './utils/cronJobs';
initializeCronJobs();

// --- Server Initialization ---
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;