import { UploadApiResponse } from 'cloudinary';
import { cloudinary } from '../../lib/cloudinary';
import { prisma } from '../../lib/prisma';
import { IUserUpdatePayload } from './user.interface';

const updateMyProfile = async (userId: string, payload: IUserUpdatePayload) => {
  const { name, contactNumber, address } = payload;
  const updateUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name,
      contactNumber,
      address,
    },
    omit: {
      password: true,
    },
  });

  return updateUser;
};

const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    omit: {
      password: true,
    },
  });

  return user;
};

const getMyAnalytics = async (userId: string) => {
  const customerAnalytics = await prisma.$transaction(async (tx) => {
    const [
      totalRentals,
      totalPendingRentals,
      totalConfirmedRentals,
      totalPickedUpRentals,
      totalReturnedRentals,
      totalCancelledRentals,
      totalPayments,
      totalPendingPayments,
      totalPaidPayments,
      totalReviews,
      totalSpent,
    ] = await Promise.all([
      await tx.rentalOrder.count({
        where: { customerId: userId },
      }),
      await tx.rentalOrder.count({
        where: { customerId: userId, status: 'PENDING' },
      }),
      await tx.rentalOrder.count({
        where: { customerId: userId, status: 'CONFIRMED' },
      }),
      await tx.rentalOrder.count({
        where: { customerId: userId, status: 'PICKED_UP' },
      }),
      await tx.rentalOrder.count({
        where: { customerId: userId, status: 'RETURNED' },
      }),
      await tx.rentalOrder.count({
        where: { customerId: userId, status: 'CANCELLED' },
      }),

      await tx.payment.count({
        where: {
          rentalOrder: {
            customerId: userId,
          },
        },
      }),
      await tx.payment.count({
        where: {
          rentalOrder: {
            customerId: userId,
          },
          status: 'PENDING',
        },
      }),
      await tx.payment.count({
        where: {
          rentalOrder: {
            customerId: userId,
          },
          status: 'PAID',
        },
      }),
      await tx.review.count({
        where: {
          customerId: userId,
        },
      }),
      await tx.payment.aggregate({
        where: {
          rentalOrder: {
            customerId: userId,
          },
          status: 'PAID',
        },
        _sum: {
          amount: true,
        },
      }),
    ]);
    return {
      totalRentals,
      totalPendingRentals,
      totalConfirmedRentals,
      totalPickedUpRentals,
      totalReturnedRentals,
      totalCancelledRentals,
      totalPayments,
      totalPendingPayments,
      totalPaidPayments,
      totalReviews,
      totalSpent: totalSpent._sum.amount || 0,
    };
  });
  return customerAnalytics;
};



const uploadProfileImage = async (userId: string, buffer: Buffer) => { 
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: {
      imagePublicId: true,
      imageUrl: true,
    },
  });

  const cloudinaryResult = await new Promise<UploadApiResponse>(
		(resolve, reject) => {
			cloudinary.uploader
				.upload_stream(
					{
						resource_type: "auto",
					},

					async (error, result) => {
						if (error) {
							return reject(error);
						}

						if (!result) {
							return reject(new Error("No result returned from Cloudinary"));
						}

						resolve(result);
					},
				)
				.end(buffer);
		},
	);

	const updatedUser = await prisma.user.update({
		where: {
			id: userId,
		},

		data: {
			imageUrl: cloudinaryResult.secure_url,
			imagePublicId: cloudinaryResult.public_id,
		},

		omit: {
			password: true,
		},
	});

	if (user?.imagePublicId && user.imageUrl) {
		await cloudinary.uploader.destroy(user.imagePublicId);
  }
  
  return updatedUser;

}




export const userService = {
  updateMyProfile,
  getMyProfile,
  getMyAnalytics,
  uploadProfileImage,
};
