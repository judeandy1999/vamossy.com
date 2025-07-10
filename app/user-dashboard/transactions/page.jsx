'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/client';
import { getUserRole } from '@/utils/getUserRole';
import { DollarSign, Calendar, User, CreditCard, FileText, Receipt } from 'lucide-react';
import Spinner from '@/components/ui/spinner';
import InvoiceGenerator from '@/components/payment/invoice-generator';

export default function TransactionsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState('worker');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showInvoiceGenerator, setShowInvoiceGenerator] = useState(false);
  const [selectedPaymentForInvoice, setSelectedPaymentForInvoice] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created_at');

  useEffect(() => {
    fetchUserAndPayments();
  }, [filter, sortBy]);

  const fetchUserAndPayments = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      
      if (!session?.user) {
        setError('Please log in to view transactions');
        return;
      }

      setUser(session.user);
      
      // Get user role
      const role = await getUserRole(session.user.email);
      setUserRole(role);

      // Fetch payments
      const response = await fetch('/api/payments/history', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch payment history');
      }

      setPayments(data.payments || []);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleGenerateInvoiceForPayment = (payment) => {
    setSelectedPaymentForInvoice(payment);
    setShowInvoiceGenerator(true);
  };

  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true;
    
    const now = new Date();
    const paymentDate = new Date(payment.created_at);
    
    switch (filter) {
      case 'today':
        return paymentDate.toDateString() === now.toDateString();
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return paymentDate >= weekAgo;
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return paymentDate >= monthAgo;
      default:
        return true;
    }
  });

  const sortedPayments = [...filteredPayments].sort((a, b) => {
    if (sortBy === 'created_at') {
      return new Date(b.created_at) - new Date(a.created_at);
    } else if (sortBy === 'amount') {
      return parseFloat(b.amount) - parseFloat(a.amount);
    }
    return 0;
  });

  if (loading) {
    return (
      <Spinner />
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }
console.log(selectedPaymentForInvoice)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {userRole === 'admin' ? 'All Transactions' : 'My Transactions'}
            </h1>
            <p className="text-gray-600">
              {userRole === 'admin' 
                ? 'View and manage all payment transactions' 
                : 'View your payment history and generate invoices'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Filter:</span>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="created_at">Date</option>
            <option value="amount">Amount</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {userRole === 'admin' && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedPayments.length === 0 ? (
                <tr>
                  <td 
                    colSpan={userRole === 'admin' ? 7 : 6} 
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No transactions found
                  </td>
                </tr>
              ) : (
                sortedPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    {userRole === 'admin' && (
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {payment.users?.name || 'Unknown User'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {payment.users?.email || 'No email'}
                            </div>
                          </div>
                        </div>
                      </td>
                    )}
                    
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {payment.description || 'Payment'}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {payment.paypal_order_id || payment.id}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm font-medium text-gray-900">
                          ${parseFloat(payment.amount).toFixed(2)}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">
                          {payment.currency || 'USD'}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">
                          {payment.credits_purchased || 0}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(payment.created_at)}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {payment.status === 'completed' && (
                          <button
                            onClick={() => handleGenerateInvoiceForPayment(payment)}
                            className="cursor-pointer text-green-600 hover:text-green-800 transition-colors text-xs flex items-center"
                            title="View Invoice"
                          >
                            <Receipt className="h-4 w-4" /> View Invoice
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Generator Modal */}
      {showInvoiceGenerator && (
        <InvoiceGenerator 
          paymentData={selectedPaymentForInvoice} 
          onClose={() => {
            setShowInvoiceGenerator(false);
            setSelectedPaymentForInvoice(null);
          }}
        />
      )}

      {/* Payment Details Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Transaction Details</h2>
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
                  <p className="text-sm text-gray-900">{selectedPayment.paypal_order_id || selectedPayment.id}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Amount</label>
                  <p className="text-sm text-gray-900">
                    ${parseFloat(selectedPayment.amount).toFixed(2)} {selectedPayment.currency || 'USD'}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="text-sm text-gray-900">{selectedPayment.description || 'N/A'}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedPayment.status)}`}>
                    {selectedPayment.status}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Credits Purchased</label>
                  <p className="text-sm text-gray-900">{selectedPayment.credits_purchased || 0}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <p className="text-sm text-gray-900">{formatDate(selectedPayment.created_at)}</p>
                </div>
                
                {userRole === 'admin' && selectedPayment.users && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">User</label>
                    <p className="text-sm text-gray-900">
                      {selectedPayment.users.name} ({selectedPayment.users.email})
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-between">
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
                {selectedPayment.status === 'completed' && (
                  <button
                    onClick={() => {
                      setSelectedPayment(null);
                      handleGenerateInvoiceForPayment(selectedPayment);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <Receipt className="h-4 w-4 mr-2" />
                    Generate Invoice
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}