import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { paymentService } from './payment.service';

const verifyPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { orderId, transactionId, status } = req.query;
  // console.log('Payment verification request received:', { orderId, transactionId, status });
  if (!orderId || !transactionId || !status) {
    throw new Error('Order id, transaction id and payment status are required');
  }

  const payload = req.body;

  const response = await paymentService.validatePayment(
    orderId as string,
    transactionId as string,
    status as string,
    payload,
  );
});

export const paymentController = {
  verifyPayment,
};
