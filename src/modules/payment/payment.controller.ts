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
    return res.redirect(
      `http://localhost:3000/payments/success?orderId=${orderId}&transactionId=${transactionId}`,
    );
  } else if (response === 'fail') {
    return res.redirect(`http://localhost:3000/payments/fail?orderId=${orderId}`);
  } else {
    return res.redirect(`http://localhost:3000/payments/cancel?orderId=${orderId}`);
  }
});

const getAllPayments = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const customerId = req.user?.id;
  const query = req.query;
  const result = await paymentService.getAllPayments(customerId as string, query);

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
