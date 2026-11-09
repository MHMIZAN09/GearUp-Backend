import type { Request, Response } from 'express';

import app from '../src/app';
import { redisClient } from '../src/lib/redis';

export default async function handler(req: Request, res: Response) {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    return app(req, res);
  } catch (error) {
    console.error('Failed to initialize the serverless API:', error);
    return res.status(503).json({
      message: 'Service temporarily unavailable',
    });
  }
}
