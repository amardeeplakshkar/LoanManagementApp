export interface Payment {
  id: string;
  amount: number;
  date: Date;
}

export interface Loan {
  id: string;
  borrowerName: string;
  principalAmount: number;
  interestRate: number;
  interestType: 'monthly' | 'quarterly' | 'yearly';
  startDate: Date;
  endDate: Date;
  payments: Payment[];
}