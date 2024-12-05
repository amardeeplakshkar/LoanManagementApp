import React from 'react';
import { Calendar, IndianRupee, Percent, Clock, TrendingUp, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Loan, Payment } from '../types/loan';
import { 
  calculateRemainingAmount, 
  calculateDaysRemaining, 
  calculateTotalInterest,
  calculateProgress,
  calculateTotalAmount
} from '../utils/calculations';
import { Accordion } from './Accordion';
import { PaymentHistory } from './PaymentHistory';
import { ProgressRing } from './ProgressRing';
import { MonthlyPaymentChart } from './MonthlyPaymentChart';

interface LoanCardProps {
  loan: Loan;
  onAddPayment: (loanId: string) => void;
  onEdit: (loan: Loan) => void;
  onDelete: (loanId: string) => void;
  onEditPayment: (payment: Payment) => void;
  onDeletePayment: (paymentId: string) => void;
}

export const LoanCard: React.FC<LoanCardProps> = ({ 
  loan, 
  onAddPayment, 
  onEdit, 
  onDelete,
  onEditPayment,
  onDeletePayment 
}) => {
  const remainingAmount = calculateRemainingAmount(loan);
  const daysRemaining = calculateDaysRemaining(loan);
  const totalInterest = calculateTotalInterest(loan);
  const totalAmount = calculateTotalAmount(loan);
  const progress = calculateProgress(loan);
  const totalPaid = loan.payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 max-sm:p-4 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="w-full">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl flex justify-center items-center font-bold text-white mb-2">
                  {loan.borrowerName}
                  <span className={`mx-1 px-3 py-1 rounded-full text-xs ${
                    daysRemaining > 30 ? 'bg-green-400 text-white' : 
                    daysRemaining > 0 ? 'bg-yellow-400 text-gray-800' : 
                    'bg-red-400 text-white'
                  }`}>
                    {daysRemaining > 0 ? `${daysRemaining} days left` : 'Overdue'}
                  </span>
                </h3>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onEdit(loan)}
                  className="p-2 rounded-full hover:bg-blue-400 transition-colors"
                  title="Edit loan"
                >
                  <Edit className="w-5 h-5 text-white" />
                </button>
                <button
                  onClick={() => onDelete(loan.id)}
                  className="p-2 rounded-full hover:bg-blue-400 transition-colors"
                  title="Delete loan"
                >
                  <Trash2 className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
          <ProgressRing progress={progress} className="hidden md:block" />
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <IndianRupee className="w-8 h-8 text-blue-500 mr-4" />
            <div>
              <p className="text-sm text-gray-600">Principal Amount</p>
              <p className="text-lg font-bold">₹{loan.principalAmount.toLocaleString()}</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <TrendingUp className="w-8 h-8 text-green-500 mr-4" />
            <div>
              <p className="text-sm text-gray-600">Total Interest</p>
              <p className="text-lg font-bold">₹{totalInterest.toLocaleString()}</p>
              <p className="text-sm text-gray-500">
                {loan.interestRate}% {loan.interestType}
              </p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <Calendar className="w-8 h-8 text-orange-500 mr-4" />
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="text-lg font-bold">
                {format(loan.startDate, 'dd MMM yyyy')}
              </p>
              <p className="text-sm text-gray-500">
                to {format(loan.endDate, 'dd MMM yyyy')}
              </p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <Clock className="w-8 h-8 text-purple-500 mr-4" />
            <div>
              <p className="text-sm text-gray-600">Payment Progress</p>
              <p className="text-lg font-bold">₹{totalPaid.toLocaleString()}</p>
              <p className="text-sm text-gray-500">
                of ₹{totalAmount.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Remaining Amount and Actions */}
        <div className="border-t pt-6 space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-sm text-gray-600">Remaining Amount</p>
              <p className="text-2xl font-bold text-gray-800">₹{remainingAmount.toLocaleString()}</p>
              <p className="text-sm text-gray-500">
                {progress.toFixed(1)}% paid
              </p>
            </div>
            <button
              onClick={() => onAddPayment(loan.id)}
              className="w-full md:w-auto bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <IndianRupee className="w-4 h-4" />
              Add Payment
            </button>
          </div>

          <Accordion title={`Payment History (${loan.payments.length})`}>
            <PaymentHistory 
              payments={loan.payments}
              onEditPayment={onEditPayment}
              onDeletePayment={onDeletePayment}
            />
          </Accordion>
        </div>
      </div>
    </div>
  );
};