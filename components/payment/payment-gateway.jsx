'use client';

import { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { Shield } from 'lucide-react';
import Spinner from '@/components/ui/spinner';
import { supabase } from '@/utils/client';

const paypalOptions = {
  'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
  currency: 'USD',
  intent: 'capture',
};

export default function PaymentGateway({ amount = 99.99, description = 'Service Payment' }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);

  const handlePayPalApprove = async (data, actions) => {
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;

    try {
      setIsProcessing(true);
      
      const response = await fetch('/api/payments/paypal/capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        },
        body: JSON.stringify({
          orderID: data.orderID,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setPaymentStatus('success');
        setError(null);
      } else {
        setError(result.error || 'Payment failed');
        setPaymentStatus('failed');
      }
    } catch (err) {
      setError('Payment processing failed');
      setPaymentStatus('failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayPalError = (err) => {
    setError('PayPal payment failed');
    setPaymentStatus('failed');
  };

  if (paymentStatus === 'success') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Successful!</h3>
          <p className="text-gray-600">Thank you for your payment. Your transaction has been processed successfully.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Details</h2>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">{description}</span>
            <span className="text-lg font-semibold text-gray-900">${amount}</span>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <PayPalScriptProvider options={paypalOptions}>
        <div className="mt-4">
          {isProcessing && (
            <div className="flex items-center justify-center py-8">
              <Spinner />
              <span className="ml-2 text-gray-600">Processing payment...</span>
            </div>
          )}
          <PayPalButtons
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: amount.toString(),
                    },
                    description: description,
                  },
                ],
              });
            }}
            onApprove={handlePayPalApprove}
            onError={handlePayPalError}
            style={{
              layout: 'vertical',
              color: 'blue',
              shape: 'rect',
              label: 'paypal',
            }}
          />
        </div>
      </PayPalScriptProvider>
    </div>
  );
}