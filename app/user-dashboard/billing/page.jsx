'use client';

import { useState } from 'react';
import { useAuthWithRedirect } from '@/hooks/useAuthWithRedirect';
import PaymentGateway from '@/components/payment/payment-gateway';
import Spinner from '@/components/ui/spinner';

const pricingPlans = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 29.99,
    description: 'Perfect for getting started',
    features: [
      'Basic analytics',
      'Up to 5 projects',
      'Email support',
      'Basic templates'
    ]
  },
  {
    id: 'pro',
    name: 'Professional Plan',
    price: 79.99,
    description: 'For growing businesses',
    features: [
      'Advanced analytics',
      'Unlimited projects',
      'Priority support',
      'Custom templates',
      'Team collaboration'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise Plan',
    price: 199.99,
    description: 'For large organizations',
    features: [
      'Enterprise analytics',
      'Unlimited everything',
      '24/7 phone support',
      'Custom integrations',
      'Dedicated account manager'
    ]
  }
];

export default function BillingPage() {
  const { session, status } = useAuthWithRedirect();
  const [selectedPlan, setSelectedPlan] = useState(null);

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Billing & Payments</h1>
      
      {!selectedPlan ? (
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Choose Your Plan</h2>
            <p className="text-gray-600">Select the perfect plan for your needs</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {pricingPlans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow"
              >
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  <div className="text-3xl font-bold text-gray-900">
                    ${plan.price}
                    <span className="text-base font-normal text-gray-500">/month</span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => setSelectedPlan(plan)}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Select Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => setSelectedPlan(null)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Plans
            </button>
          </div>
          
          <PaymentGateway
            amount={selectedPlan.price}
            description={`${selectedPlan.name} - Monthly Subscription`}
          />
        </div>
      )}
    </div>
  );
}