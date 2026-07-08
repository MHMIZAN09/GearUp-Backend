import { NextFunction, Request, Response } from 'express';
import status from 'http-status';

const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(status.NOT_FOUND).json({
    statusCode: status.NOT_FOUND,
    success: false,
    message: `Route not found - ${req.method} ${req.originalUrl}`,
    path: req.originalUrl,
    date: new Date().toISOString(),
  });
};

export default notFound;
