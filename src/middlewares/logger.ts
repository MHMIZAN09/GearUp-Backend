import chalk, { ChalkInstance } from 'chalk';
import { NextFunction, Request, Response } from 'express';

const methodColor: Record<string, ChalkInstance> = {
  GET: chalk.green.bold,
  POST: chalk.blue.bold,
  PUT: chalk.yellow.bold,
  PATCH: chalk.magenta.bold,
  DELETE: chalk.red.bold,
};

const statusColor = (code: number): ChalkInstance => {
  if (code < 300) return chalk.green.bold;
  if (code < 400) return chalk.cyan.bold;
  if (code < 500) return chalk.yellow.bold;
  return chalk.red.bold;
};

export const logger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  const { method, originalUrl } = req;

  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = chalk.dim(`[${new Date().toISOString()}]`);
    const coloredMethod = (methodColor[method] ?? chalk.white.bold)(method.padEnd(7));
    const coloredStatus = statusColor(res.statusCode)(String(res.statusCode));
    const coloredDuration = chalk.dim(`- ${duration}ms`);

    console.log(`${timestamp} ${coloredMethod} ${originalUrl} ${coloredStatus} ${coloredDuration}`);
  });

  next();
};
