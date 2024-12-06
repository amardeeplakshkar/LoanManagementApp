import { prisma } from '../lib/prisma';
import { Loan, Payment } from '../types/loan';

export const loanService = {
  // Create a new loan
  createLoan: async (userId: string, loanData: Omit<Loan, 'id' | 'payments'>) => {
    return prisma.loan.create({
      data: {
        userId,
        borrowerName: loanData.borrowerName,
        principalAmount: loanData.principalAmount,
        interestRate: loanData.interestRate,
        interestType: loanData.interestType,
        startDate: loanData.startDate,
        endDate: loanData.endDate,
      },
      include: {
        payments: true,
      },
    });
  },

  // Get all loans for a user
  getUserLoans: async (userId: string) => {
    return prisma.loan.findMany({
      where: { userId },
      include: {
        payments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  // Update a loan
  updateLoan: async (id: string, userId: string, loanData: Partial<Loan>) => {
    return prisma.loan.update({
      where: { id, userId },
      data: loanData,
      include: {
        payments: true,
      },
    });
  },

  // Delete a loan
  deleteLoan: async (id: string, userId: string) => {
    return prisma.loan.delete({
      where: { id, userId },
    });
  },
};