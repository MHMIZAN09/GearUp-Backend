import { InputJsonValue } from '@prisma/client/runtime/client';
import axios from 'axios';
import { RentalOrder } from '../../../generated/prisma/client';
import config from '../../config';
import { prisma } from '../../lib/prisma';

type PaymentUser = {
  id: string;
  name: string;
  email: string;
  contactNumber: string | null;
  address: string | null;
};
const initiatePayment = async (user: PaymentUser, rentalOrder: RentalOrder) => {
  const transactionId = `TRNX-${Date.now()}`;
  const paymentData = {
    store_id: config.ssl_commerz_store_id,
    store_passwd: config.ssl_commerz_store_pass,
    total_amount: rentalOrder.totalAmount,
    currency: 'BDT',
    tran_id: transactionId,
    success_url: `${config.appUrl}/api/payment?orderId=${rentalOrder.id}&transactionId=${transactionId}&status=success`,
    fail_url: `${config.appUrl}/api/payment?orderId=${rentalOrder.id}&transactionId=${transactionId}&status=fail`,
    cancel_url: `${config.appUrl}/api/payment?orderId=${rentalOrder.id}&transactionId=${transactionId}&status=cancel`,
    cus_name: user.name,
    cus_email: user.email,
    cus_add1: user.address,
    cus_add2: user.address,
    cus_city: 'N/A',
    cus_state: 'N/A',
    cus_postcode: 1000,
    cus_country: 'Bangladesh',
    cus_phone: user.contactNumber,
    cus_fax: user.contactNumber,
  };

  const response = await axios.post(
    'https://sandbox.sslcommerz.com/gwprocess/v4/api.php',
    paymentData,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );

  const data = await response.data;
  // console.log('Payment initiation response:', data);
  // Check existing payment
  const existingPayment = await prisma.payment.findFirst({
    where: {
      rentalOrderId: rentalOrder.id,
    },
  });

  if (existingPayment) {
    await prisma.payment.update({
      where: {
        id: existingPayment.id,
      },
      data: {
        transactionId,
        status: 'PENDING',
      },
    });
  } else {
    await prisma.payment.create({
      data: {
        rentalOrderId: rentalOrder.id,
        transactionId,
        amount: rentalOrder.totalAmount,
        status: 'PENDING',
      },
    });
  }
  const GetWayURL = data.GatewayPageURL;

  return { GetWayURL };
};

const validatePayment = async (
  orderId: string,
  transactionId: string,
  status: string,
  payload: Record<string, unknown>,
) => {
  const response = await axios.post(
    `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${payload.val_id}&store_id=${config.ssl_commerz_store_id}&store_passwd=${config.ssl_commerz_store_pass}&format=json`,
    {
      Headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );

  // console.log('Payment validation response:', response.data);

  const data = response.data;
  if (data.status === 'VALID') {
    await prisma.$transaction(async (tx) => {
      await tx.rentalOrder.update({
        where: {
          id: orderId,
        },
        data: {
          status: 'CONFIRMED',
        },
      });
      const rentalOrder = await tx.rentalOrder.findUnique({
        where: {
          id: orderId,
        },
        include: {
          rentalItems: true,
        },
      });

      if (!rentalOrder) {
        throw new Error(`Rental order not found: ${orderId}`);
      }

      for (const item of rentalOrder.rentalItems) {
        await tx.gearItem.update({
          where: {
            id: item.gearItemId,
          },
          data: {
            quantityAvailable: {
              decrement: item.quantity,
            },
          },
        });
      }

      await tx.payment.update({
        where: {
          transactionId,
        },
        data: {
          status: 'PAID',
          paidAt: new Date(),
          meta: payload as InputJsonValue,
        },
      });
    });
  } else if (data.status === 'FAILED') {
    await prisma.$transaction(async (tx) => {
      await tx.rentalOrder.update({
        where: {
          id: orderId,
        },
        data: {
          status: 'PENDING',
        },
      });

      await tx.payment.update({
        where: {
          transactionId,
        },
        data: {
          status: 'FAILED',
          meta: payload as InputJsonValue,
        },
      });
    });
  }

  return status;
};

const getAllPayments = async () => {
  const result = await prisma.payment.findMany();

  return result;
};

const getPaymentById = async (id: string) => {
  const payment = await prisma.payment.findUnique({
    where: {
      id,
    },
  });

  if (!payment) {
    throw new Error(`Payment not found: ${id}`);
  }

  return payment;
};

export const paymentService = {
  initiatePayment,
  validatePayment,
  getAllPayments,
  getPaymentById,
};
