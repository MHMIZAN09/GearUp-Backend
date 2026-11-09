import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';


import config from './config';
import { globalErrorHandler } from './middlewares/globalErrorHandler';
import { logger } from './middlewares/logger';
import notFound from './middlewares/notFound';
import { indexRoutes } from './routes';

const app = express();

app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(logger);


app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to the Gearup API',
  });
});
app.use(logger)

app.use('/api', indexRoutes);

app.use(notFound);
app.use(globalErrorHandler);
export default app;
