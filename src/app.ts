import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import status from 'http-status';

import fs from 'fs';
import path from 'path';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yaml';
import config from './config';
import { globalErrorHandler } from './middlewares/globalErrorHandler';
import notFound from './middlewares/notFound';
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
// app.use(logger);

// Swagger YAML file read
const swaggerFilePath = path.join(process.cwd(), 'src', 'docs', 'swagger.yml');
const swaggerFile = fs.readFileSync(swaggerFilePath, 'utf8');
const swaggerDocument = YAML.parse(swaggerFile);

// Swagger route
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.get('/', (req: Request, res: Response) => {
  res.status(status.OK).json({
    success: true,
    statusCode: status.OK,
    message: 'Welcome to the Gearbox API Server!',
  });
});

app.use('/api', indexRoutes);

app.use(notFound);
app.use(globalErrorHandler);
export default app;
