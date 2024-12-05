import { differenceInMonths, differenceInDays } from 'date-fns';
import { Loan, Payment } from '../types/loan';

export const calculateTotalInterest = (loan: Loan): number => {
  const totalMonths = differenceInMonths(loan.endDate, loan.startDate);
  const monthlyRate = getMonthlyInterestRate(loan);
  return (loan.principalAmount * monthlyRate * totalMonths) / 100;
};

export const getMonthlyInterestRate = (loan: Loan): number => {
  return loan.interestType === 'monthly' 
    ? loan.interestRate 
    : loan.interestType === 'quarterly' 
      ? loan.interestRate / 3 
      : loan.interestRate / 12;
};

export const calculateTotalAmount = (loan: Loan): number => {
  return loan.principalAmount + calculateTotalInterest(loan);
};

export const calculateRemainingAmount = (loan: Loan): number => {
  const totalPaid = loan.payments.reduce((sum, payment) => sum + payment.amount, 0);
  return calculateTotalAmount(loan) - totalPaid;
};

export const calculateDaysRemaining = (loan: Loan): number => {
  return differenceInDays(loan.endDate, new Date());
};

export const calculateProgress = (loan: Loan): number => {
  const totalPaid = loan.payments.reduce((sum, payment) => sum + payment.amount, 0);
  const totalAmount = calculateTotalAmount(loan);
  return (totalPaid / totalAmount) * 100;
};