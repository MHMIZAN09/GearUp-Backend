import { NextFunction, Request, Response } from 'express';

import status from 'http-status';
import { Prisma } from '../../generated/prisma/client';

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.log('Error : ', err);

  let statusCode;
  let errorMessage = err.message || 'Internal Server Error';
  let errorName = err.name || 'Internal Server Error';
  // let errorDetails = err.stack

  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = status.BAD_REQUEST;
    errorMessage = 'You have provided incorrect field type or missing fields';
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      ((statusCode = status.BAD_REQUEST), (errorMessage = 'Duplicate Key Error'));
    } else if (err.code === 'P2003') {
      ((statusCode = status.BAD_REQUEST), (errorMessage = 'Foreign key constraint failed'));
    } else if (err.code === 'P2025') {
      ((statusCode = status.BAD_REQUEST),
        (errorMessage =
          'An operation failed because it depends on one or more records that were required but not found.'));
    }
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    if (err.errorCode === 'P1000') {
      statusCode = status.UNAUTHORIZED;
      errorMessage = 'Authentication failed against database server. Please Check Your Credentials';
    } else if (err.errorCode === 'P1001') {
      statusCode = status.BAD_REQUEST;
      errorMessage = "Can't reach database server";
    }
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = status.INTERNAL_SERVER_ERROR;
    errorMessage = 'Error occurred during query execution';
  }

  res.status(status.INTERNAL_SERVER_ERROR).json({
    success: false,
    statusCode: statusCode || status.INTERNAL_SERVER_ERROR,
    name: errorName,
    message: errorMessage,
    error: err.stack,
  });
};
