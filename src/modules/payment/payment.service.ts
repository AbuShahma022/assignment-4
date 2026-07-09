import { Request } from "express";
import config from "../../config";
import { stripe } from "../../config/stripe";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { ICreateCheckoutSession } from "./payment.interface";
import httpStatus  from "http-status";
import { formatBookingAvailability } from "../../utils/formatBooking";
import Stripe from "stripe";


const createCheckoutSession = async (
  userId: string,
  payload: ICreateCheckoutSession
) => {
  
  const booking = await prisma.booking.findFirst({
    where: {
      id: payload.bookingId,
      customerId: userId,
    },
    include: {
      technicianService: {
        include: {
          service: true,
        },
      },
      payment: true,
    },
  });

  if (!booking) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Booking not found."
    );
  }

  // Check booking payment status
  if (
    booking.payment &&
    booking.payment.status === "SUCCESS"
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This booking has already been paid."
    );
  }

  // Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    mode: "payment",

    payment_method_types: ["card"],

    line_items: [
      {
        price_data: {
          currency: "usd",

          product_data: {
            name: booking.technicianService.service.name,
            description:
              booking.problemDescription ??
              "Home service booking",
          },

          // Stripe expects cents
          unit_amount: Math.round(
            Number(booking.agreedPrice) * 100
          ),
        },

        quantity: 1,
      },
    ],

    success_url: `${config.appUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,

    cancel_url: `${config.appUrl}/payment-cancel`,
  });

  // Save payment
  await prisma.payment.create({
    data: {
      bookingId: booking.id,

      stripeSessionId: session.id,

      amount: booking.agreedPrice,

      provider: "STRIPE",

      status: "PENDING",
    },
  });

  return {
    checkoutUrl: session.url,
  };
};

const stripeWebhook = async (req: Request) => {
  const signature = req.headers["stripe-signature"] as string;

  const event = stripe.webhooks.constructEvent(
    req.body,
    signature,
    config.stripe.webhookSecret
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: {
          stripeSessionId: session.id,
        },
        data: {
          status: "SUCCESS",
          transactionId: session.payment_intent as string,
          paidAt: new Date(),
        },
      });
    });
  }
};

const getMyPayments = async (userId: string) => {
  const result = await prisma.payment.findMany({
    where: {
      booking: {
        customerId: userId,
      },
    },
    include: {
      booking: {
        include: {
          technicianService: {
            include: {
              service: {
                include: {
                  category: true,
                },
              },
              technicianProfile: {
                include: {
                  user: {
                    omit: {
                      password: true,
                    },
                  },
                  location: true,
                },
              },
            },
          },
          availability: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result.map((payment) => ({
  ...payment,
  booking: formatBookingAvailability(payment.booking),
}));
};

export const paymentService = {
    createCheckoutSession,
    stripeWebhook,
    getMyPayments
 };