import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// --- Middlewares ---
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Health Check Route ---
app.get('/', (req: Request, res: Response) => {
    res.send('Farm-Secure Backend is running!');
});

// TODO: Add API routes here
// Example: app.use('/api/v1/auth', authRoutes);


// --- Server Initialization ---
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;