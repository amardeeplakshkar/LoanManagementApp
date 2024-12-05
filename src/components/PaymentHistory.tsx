import React from 'react';
import { format } from 'date-fns';
import { Payment } from '../types/loan';
import { IndianRupee, Edit, Trash2 } from 'lucide-react';

interface PaymentHistoryProps {
  payments: Payment[];
  onEditPayment: (payment: Payment) => void;
  onDeletePayment: (paymentId: string) => void;
}

export const PaymentHistory: React.FC<PaymentHistoryProps> = ({ 
  payments,
  onEditPayment,
  onDeletePayment
}) => {
  if (payments.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        <p className="text-lg">No payments recorded yet</p>
        <p className="text-sm">Add a payment to start tracking</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {payments
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .map((payment) => (
          <div
            key={payment.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-full">
                <IndianRupee className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  ₹{payment.amount.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  Paid on {format(payment.date, 'dd MMM yyyy')}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEditPayment(payment)}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                title="Edit payment"
              >
                <Edit className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => onDeletePayment(payment.id)}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                title="Delete payment"
              >
                <Trash2 className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};