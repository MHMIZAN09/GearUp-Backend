import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { paymentService } from './payment.service';

const verifyPayment = catchAsync(async (req, res) => {
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
  // console.log('Payment verification response:', response);
  if (response === 'success') {
    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: {
        orderId,
        transactionId,
        status,
      },
    });
  } else if (response === 'fail') {
    res.status(400).json({
      success: false,
      message: 'Payment verification failed',
      data: {
        orderId,
        transactionId,
        status,
      },
    });
  } else if (response === 'cancel') {
    res.status(400).json({
      success: false,
      message: 'Invalid payment status',
      data: {
        orderId,
        transactionId,
        status,
      },
    });
  }
});

const getAllPayments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const customerId = req.user?.id;
  const result = await paymentService.getAllPayments(customerId as string);

  res.status(200).json({
    success: true,
    message: 'All payments retrieved successfully',
    data: result,
  });
});

const createPayment = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const customerId = req.user?.id;
  const { rentalOrderId } = req.body;
  const result = await paymentService.createPayment(customerId as string, rentalOrderId as string);

  res.status(200).json({
    success: true,
    message: 'Payment created successfully',
    data: result,
  });
});

const getPaymentById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const customerId = req.user?.id;
  const { id } = req.params;
  const result = await paymentService.getPaymentById(customerId as string, id as string);

  res.status(200).json({
    success: true,
    message: 'Payment retrieved successfully',
    data: result,
  });
});

export const paymentController = {
  verifyPayment,
  getAllPayments,
  getPaymentById,
  createPayment,
};
