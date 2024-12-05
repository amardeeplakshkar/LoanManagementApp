import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { Payment } from '../types/loan';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlyPaymentChartProps {
  payments: Payment[];
  startDate: Date;
  endDate: Date;
}

export const MonthlyPaymentChart: React.FC<MonthlyPaymentChartProps> = ({
  payments,
  startDate,
  endDate,
}) => {
  // Get all unique payment dates
  const paymentDates = payments.map(payment => 
    startOfMonth(new Date(payment.date)).getTime()
  );

  // Get unique months where payments were made
  const uniquePaymentMonths = Array.from(new Set(paymentDates)).sort();

  // Calculate totals for each month with payments
  const monthlyData = uniquePaymentMonths.map(monthTimestamp => {
    const monthStart = startOfMonth(new Date(monthTimestamp));
    const monthEnd = endOfMonth(new Date(monthTimestamp));
    
    const total = payments
      .filter(payment => {
        const paymentDate = new Date(payment.date);
        return paymentDate >= monthStart && paymentDate <= monthEnd;
      })
      .reduce((sum, payment) => sum + payment.amount, 0);

    return {
      month: monthStart,
      total
    };
  });

  const data = {
    labels: monthlyData.map(data => format(data.month, 'MMM yyyy')),
    datasets: [
      {
        label: 'Monthly Payments',
        data: monthlyData.map(data => data.total),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `₹${context.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => `₹${value.toLocaleString()}`,
        },
      },
    },
  };

  if (monthlyData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        No payments recorded yet
      </div>
    );
  }

  return <Bar data={data} options={options} />;
};