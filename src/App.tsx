import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Loan, Payment } from './types/loan';
import { LoanCard } from './components/LoanCard';
import { AddLoanForm } from './components/AddLoanForm';
import { AddPaymentForm } from './components/AddPaymentForm';
import { EditLoanForm } from './components/EditLoanForm';
import { EditPaymentForm } from './components/EditPaymentForm';
import { OverallPaymentsChart } from './components/OverallPaymentsChart';
import { Accordion } from './components/Accordion';
import { AuthProvider } from './contexts/AuthContext';
import { AuthenticatedRoute } from './components/auth/AuthenticatedRoute';

function App() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [showAddLoan, setShowAddLoan] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [editingPayment, setEditingPayment] = useState<{ loanId: string; payment: Payment } | null>(null);

  const handleAddLoan = (loanData: Omit<Loan, 'id' | 'payments'>) => {
    const newLoan: Loan = {
      ...loanData,
      id: Date.now().toString(),
      payments: [],
    };
    setLoans([...loans, newLoan]);
    setShowAddLoan(false);
  };

  const handleEditLoan = (updatedLoan: Loan) => {
    setLoans(loans.map(loan => 
      loan.id === updatedLoan.id ? updatedLoan : loan
    ));
    setEditingLoan(null);
  };

  const handleDeleteLoan = (loanId: string) => {
    if (window.confirm('Are you sure you want to delete this loan?')) {
      setLoans(loans.filter(loan => loan.id !== loanId));
    }
  };

  const handleAddPayment = (loanId: string, paymentData: Omit<Payment, 'id'>) => {
    const newPayment: Payment = {
      ...paymentData,
      id: Date.now().toString(),
    };
    
    setLoans(loans.map(loan => 
      loan.id === loanId 
        ? { ...loan, payments: [...loan.payments, newPayment] }
        : loan
    ));
    setSelectedLoanId(null);
  };

  const handleEditPayment = (loanId: string, updatedPayment: Payment) => {
    setLoans(loans.map(loan => 
      loan.id === loanId 
        ? { 
            ...loan, 
            payments: loan.payments.map(payment => 
              payment.id === updatedPayment.id ? updatedPayment : payment
            )
          }
        : loan
    ));
    setEditingPayment(null);
  };

  const handleDeletePayment = (loanId: string, paymentId: string) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      setLoans(loans.map(loan => 
        loan.id === loanId 
          ? { ...loan, payments: loan.payments.filter(payment => payment.id !== paymentId) }
          : loan
      ));
    }
  };

  const MainContent = () => (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="max-sm:text-[1.2rem] text-3xl font-bold text-gray-900">Loan Manager</h1>
          <button
            onClick={() => setShowAddLoan(true)}
            className="flex items-center gap-2 max-sm:text-[.8rem] bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            Add New Loan
          </button>
        </div>

        {loans.length > 0 && (
          <div className="mb-8">
            <Accordion title="Overall Payment Distribution" defaultOpen={false}>
              <OverallPaymentsChart loans={loans} />
            </Accordion>
          </div>
        )}

        {loans.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No loans added yet. Click the button above to add your first loan.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {loans.map(loan => (
              <LoanCard
                key={loan.id}
                loan={loan}
                onAddPayment={(loanId) => setSelectedLoanId(loanId)}
                onEdit={(loan) => setEditingLoan(loan)}
                onDelete={(loanId) => handleDeleteLoan(loanId)}
                onEditPayment={(payment) => setEditingPayment({ loanId: loan.id, payment })}
                onDeletePayment={(paymentId) => handleDeletePayment(loan.id, paymentId)}
              />
            ))}
          </div>
        )}

        {showAddLoan && (
          <AddLoanForm
            onSubmit={handleAddLoan}
            onClose={() => setShowAddLoan(false)}
          />
        )}

        {selectedLoanId && (
          <AddPaymentForm
            loanId={selectedLoanId}
            onSubmit={handleAddPayment}
            onClose={() => setSelectedLoanId(null)}
          />
        )}

        {editingLoan && (
          <EditLoanForm
            loan={editingLoan}
            onSubmit={handleEditLoan}
            onClose={() => setEditingLoan(null)}
          />
        )}

        {editingPayment && (
          <EditPaymentForm
            payment={editingPayment.payment}
            onSubmit={(updatedPayment) => handleEditPayment(editingPayment.loanId, updatedPayment)}
            onClose={() => setEditingPayment(null)}
          />
        )}
      </div>
    </div>
  );

  return (
    <AuthProvider>
      <AuthenticatedRoute>
        <MainContent />
      </AuthenticatedRoute>
    </AuthProvider>
  );
}

export default App;