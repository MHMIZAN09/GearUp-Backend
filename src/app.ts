import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import status from 'http-status';
import config from './config';
import { indexRoutes } from './routes';

const app = express();

app.use(
  cors({
    origin: config.appUrl,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.status(status.OK).json({
    success: true,
    statusCode: status.OK,
    message: 'Welcome to the Gearbox API Server!',
  });
});

app.use('/api', indexRoutes);

export default app;
