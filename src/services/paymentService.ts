import { prisma } from '../lib/prisma';
import { Payment } from '../types/loan';

export const paymentService = {
  // Create a new payment
  createPayment: async (loanId: string, paymentData: Omit<Payment, 'id'>) => {
    return prisma.payment.create({
      data: {
        loanId,
        amount: paymentData.amount,
        date: paymentData.date,
      },
    });
  },

  // Update a payment
  updatePayment: async (id: string, paymentData: Partial<Payment>) => {
    return prisma.payment.update({
      where: { id },
      data: paymentData,
    });
  },

  // Delete a payment
  deletePayment: async (id: string) => {
    return prisma.payment.delete({
      where: { id },
    });
  },

  // Get all payments for a loan
  getLoanPayments: async (loanId: string) => {
    return prisma.payment.findMany({
      where: { loanId },
      orderBy: {
        date: 'desc',
      },
    });
  },
};