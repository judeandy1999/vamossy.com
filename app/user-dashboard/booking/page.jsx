// 'use client';

// import { useState, useEffect } from 'react';
// import { useAuthWithRedirect } from '@/hooks/useAuthWithRedirect';
// import { useBooking } from '@/hooks/useBooking';
// import PaymentGateway from '@/components/payment/payment-gateway';
// import InvoiceGenerator from '@/components/payment/invoice-generator';
// import CalendlyModal from '@/components/ui/calendly-modal';
// import Spinner from '@/components/ui/spinner';
// import { Calendar, Package, Clock, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';

// const SINGLE_CONSULTATION_PRICE = 149.99;

// export default function BookingPage() {
//   const { session, status } = useAuthWithRedirect();
//   const { 
//     userCredits, 
//     scheduledBookings, 
//     loading: bookingLoading, 
//     error: bookingError,
//     refreshData 
//   } = useBooking();
  
//   const [bookingMethod, setBookingMethod] = useState('single');
//   const [selectedCredits, setSelectedCredits] = useState(4);
//   const [paymentMethod, setPaymentMethod] = useState('instant');
//   const [showCalendly, setShowCalendly] = useState(false);
//   const [bookingStep, setBookingStep] = useState('select');
//   const [loading, setLoading] = useState(true);

//   const canBook = userCredits >= 0.5;

//   useEffect(() => {
//     if (session?.user) {
//       refreshData(session.user.email).finally(() => setLoading(false));
//     }
//   }, [session, refreshData]);

//   const handleSingleBooking = () => {
//     if (canBook) {
//       setBookingStep('calendar');
//       setShowCalendly(true);
//     } else {
//       setBookingStep('payment');
//     }
//   };

//   const handleMultipleBooking = () => {
//     setBookingStep('payment');
//   };

//   const handlePurchaseAdditionalCredits = () => {
//     setBookingMethod('multiple');
//     setBookingStep('credit-selection');
//   };

//   const handleCreditSelectionComplete = () => {
//     setBookingStep('payment');
//   };

//   const handleCalendlyClose = () => {
//     setShowCalendly(false);
//     setBookingStep('select');
//     refreshData(session?.user?.email);
//   };

//   const handlePaymentSuccess = () => {
//     refreshData(session?.user?.email);
//     setShowCalendly(true);
//   };

//   const handleBackToSelect = () => {
//     setBookingStep('select');
//   };

//   const handleBackToCreditSelection = () => {
//     setBookingStep('credit-selection');
//   };

//   const handleBookingSuccess = async (eventData) => {
//     await refreshData(session?.user?.email);
//     setShowCalendly(false);
//     setBookingStep('select');
//   };

//   const calculateTotal = () => {
//     if (bookingMethod === 'single') {
//       return SINGLE_CONSULTATION_PRICE;
//     }
//     return selectedCredits * SINGLE_CONSULTATION_PRICE;
//   };

//   const calculateSavings = () => {
//     if (bookingMethod === 'single' || selectedCredits <= 1) return 0;
//     const discount = selectedCredits >= 5 ? 0.15 : selectedCredits >= 3 ? 0.10 : 0.05;
//     const originalPrice = selectedCredits * SINGLE_CONSULTATION_PRICE;
//     return originalPrice * discount;
//   };

//   const getFinalPrice = () => {
//     return calculateTotal() - calculateSavings();
//   };

//   if (status === 'loading' || loading || bookingLoading) {
//     return <Spinner />;
//   }

//   // Show error if there's a booking error
//   if (bookingError) {
//     return (
//       <div className="container mx-auto px-4 py-8">
//         <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-6 text-center">
//           <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-4" />
//           <h2 className="text-lg font-semibold text-red-900 mb-2">Error Loading Booking Data</h2>
//           <p className="text-red-700 mb-4">{bookingError}</p>
//           <button 
//             onClick={() => refreshData(session?.user?.email)}
//             className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-8 text-center">Consultation Booking</h1>
      
//       {/* Credits and Bookings Summary */}
//       <div className="max-w-4xl mx-auto mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className={`p-4 rounded-lg border ${canBook ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               {canBook ? (
//                 <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
//               ) : (
//                 <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
//               )}
//               <span className="font-medium">Available Credits: {userCredits}</span>
//             </div>
//           </div>
//         </div>

//         <div className="p-4 rounded-lg border bg-blue-50 border-blue-200">
//           <div className="flex items-center">
//             <Calendar className="w-5 h-5 text-blue-600 mr-2" />
//             <span className="font-medium">Scheduled Bookings: {scheduledBookings.length}</span>
//           </div>
//         </div>
//       </div>
      
//       {bookingStep === 'select' && (
//         <div className="max-w-4xl mx-auto">
//           {/* Show simplified booking interface if user has credits */}
//           {canBook ? (
//             <div className="max-w-lg mx-auto text-center">
//               <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
//                 <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                   <Calendar className="w-8 h-8 text-green-600" />
//                 </div>
//                 <h2 className="text-2xl font-semibold text-gray-900 mb-4">Ready to Book Your Consultation</h2>
//                 <p className="text-gray-600 mb-6">
//                   You have {userCredits} consultation {userCredits === 1 ? 'credit' : 'credits'} available. 
//                   Book your 90-minute consultation session now.
//                 </p>
                
//                 <button
//                   onClick={handleSingleBooking}
//                   className="cursor-pointer w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold text-lg"
//                 >
//                   Book Now
//                 </button>
                
//                 <div className="mt-6 pt-6 border-t border-gray-200">
//                   <p className="text-sm text-gray-500 mb-3">Need more consultation credits?</p>
//                   <button
//                     onClick={handlePurchaseAdditionalCredits}
//                     className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium text-sm"
//                   >
//                     Purchase Additional Credits
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             /* Original booking method selection for users without credits */
//             <>
//               <div className="text-center mb-8">
//                 <h2 className="text-2xl font-semibold text-gray-900 mb-6">Choose Your Booking Method</h2>
//                 <div className="flex justify-center space-x-4 mb-8">
//                   <button
//                     onClick={() => setBookingMethod('single')}
//                     className={`cursor-pointer flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
//                       bookingMethod === 'single'
//                         ? 'bg-blue-600 text-white'
//                         : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                     }`}
//                   >
//                     <Calendar className="w-5 h-5 mr-2" />
//                     Single Booking
//                   </button>
//                   <button
//                     onClick={() => setBookingMethod('multiple')}
//                     className={`cursor-pointer flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
//                       bookingMethod === 'multiple'
//                         ? 'bg-blue-600 text-white'
//                         : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//                     }`}
//                   >
//                     <Package className="w-5 h-5 mr-2" />
//                     Multiple Bookings
//                   </button>
//                 </div>
//               </div>

//               {bookingMethod === 'single' ? (
//                 /* Single Booking Section */
//                 <div className="max-w-2xl mx-auto">
//                   <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
//                     <div className="text-center mb-6">
//                       <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                         <Calendar className="w-8 h-8 text-blue-600" />
//                       </div>
//                       <h3 className="text-2xl font-semibold text-gray-900 mb-2">Single Consultation</h3>
//                       <p className="text-gray-600 mb-4">Book one consultation session</p>
//                       <div className="text-3xl font-bold text-gray-900 mb-4">
//                         ${SINGLE_CONSULTATION_PRICE}
//                       </div>
//                     </div>
                    
//                     <div className="space-y-3 mb-6">
//                       <div className="flex items-center text-gray-700">
//                         <Clock className="w-5 h-5 text-green-500 mr-3" />
//                         90-minute consultation session
//                       </div>
//                       <div className="flex items-center text-gray-700">
//                         <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
//                         Personalized action plan
//                       </div>
//                       <div className="flex items-center text-gray-700">
//                         <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
//                         Follow-up email summary
//                       </div>
//                       <div className="flex items-center text-gray-700">
//                         <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
//                         Resource recommendations
//                       </div>
//                     </div>
                    
//                     <button
//                       onClick={handleSingleBooking}
//                       className="cursor-pointer w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
//                     >
//                       Purchase & Book
//                     </button>
//                   </div>
//                 </div>
//               ) : (
//                 /* Multiple Bookings Section */
//                 <div className="max-w-2xl mx-auto">
//                   <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
//                     <div className="text-center mb-6">
//                       <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                         <Package className="w-8 h-8 text-green-600" />
//                       </div>
//                       <h3 className="text-2xl font-semibold text-gray-900 mb-2">Multiple Consultations</h3>
//                       <p className="text-gray-600 mb-4">Purchase consultation credits and book when you need them</p>
//                     </div>
                    
//                     {/* Credit Selection */}
//                     <div className="mb-6">
//                       <label className="block text-sm font-medium text-gray-700 mb-3">
//                         Select Number of Consultations
//                       </label>
//                       <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//                         {[2, 3, 4, 5, 6, 8, 10].map((credits) => (
//                           <button
//                             key={credits}
//                             onClick={() => setSelectedCredits(credits)}
//                             className={`p-3 rounded-lg border-2 transition-colors ${
//                               selectedCredits === credits
//                                 ? 'border-blue-500 bg-blue-50 text-blue-700'
//                                 : 'border-gray-200 hover:border-gray-300'
//                             }`}
//                           >
//                             <div className="font-semibold">{credits}</div>
//                             <div className="text-xs text-gray-500">sessions</div>
//                           </button>
//                         ))}
//                       </div>
//                     </div>

//                     {/* Pricing Display */}
//                     <div className="bg-gray-50 rounded-lg p-4 mb-6">
//                       <div className="flex justify-between items-center mb-2">
//                         <span className="text-gray-600">
//                           {selectedCredits} consultations × ${SINGLE_CONSULTATION_PRICE}
//                         </span>
//                         <span className="text-gray-900">
//                           ${calculateTotal().toFixed(2)}
//                         </span>
//                       </div>
                      
//                       {calculateSavings() > 0 && (
//                         <div className="flex justify-between items-center mb-2">
//                           <span className="text-green-600">
//                             Bulk discount ({selectedCredits >= 5 ? '15%' : selectedCredits >= 3 ? '10%' : '5%'})
//                           </span>
//                           <span className="text-green-600">
//                             -${calculateSavings().toFixed(2)}
//                           </span>
//                         </div>
//                       )}
                      
//                       <div className="flex justify-between items-center font-semibold text-lg border-t pt-2">
//                         <span>Total</span>
//                         <span>${getFinalPrice().toFixed(2)}</span>
//                       </div>
                      
//                       <div className="text-sm text-gray-500 mt-2">
//                         ${(getFinalPrice() / selectedCredits).toFixed(2)} per consultation
//                       </div>
//                     </div>

//                     {/* Benefits */}
//                     <div className="space-y-3 mb-6">
//                       <div className="flex items-center text-gray-700">
//                         <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
//                         Credits never expire
//                       </div>
//                       <div className="flex items-center text-gray-700">
//                         <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
//                         Book consultations anytime
//                       </div>
//                       <div className="flex items-center text-gray-700">
//                         <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
//                         Same 90-minute sessions
//                       </div>
//                       {calculateSavings() > 0 && (
//                         <div className="flex items-center text-gray-700">
//                           <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
//                           Save ${calculateSavings().toFixed(2)} with bulk pricing
//                         </div>
//                       )}
//                     </div>
                    
//                     <button
//                       onClick={handleMultipleBooking}
//                       className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
//                     >
//                       Purchase {selectedCredits} Consultation Credits
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       )}

//       {/* Credit Selection Step - for users with credits who want to buy more */}
//       {bookingStep === 'credit-selection' && (
//         <div className="max-w-2xl mx-auto">
//           <div className="mb-6">
//             <button
//               onClick={handleBackToSelect}
//               className="cursor-pointer flex items-center text-blue-600 hover:text-blue-800 font-medium"
//             >
//               <ArrowLeft className="w-4 h-4 mr-1" />
//               Back
//             </button>
//           </div>
          
//           <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
//             <div className="text-center mb-6">
//               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Package className="w-8 h-8 text-green-600" />
//               </div>
//               <h3 className="text-2xl font-semibold text-gray-900 mb-2">Purchase Additional Credits</h3>
//               <p className="text-gray-600 mb-4">Select how many consultation credits you'd like to purchase</p>
//             </div>
            
//             {/* Credit Selection */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-3">
//                 Select Number of Consultations
//               </label>
//               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//                 {[1, 2, 3, 4, 5, 6, 8, 10].map((credits) => (
//                   <button
//                     key={credits}
//                     onClick={() => setSelectedCredits(credits)}
//                     className={`cursor-pointer p-3 rounded-lg border-2 transition-colors ${
//                       selectedCredits === credits
//                         ? 'border-blue-500 bg-blue-50 text-blue-700'
//                         : 'border-gray-200 hover:border-gray-300'
//                     }`}
//                   >
//                     <div className="font-semibold">{credits}</div>
//                     <div className="text-xs text-gray-500">{credits === 1 ? 'session' : 'sessions'}</div>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Pricing Display */}
//             <div className="bg-gray-50 rounded-lg p-4 mb-6">
//               <div className="flex justify-between items-center mb-2">
//                 <span className="text-gray-600">
//                   {selectedCredits} consultation{selectedCredits === 1 ? '' : 's'} × ${SINGLE_CONSULTATION_PRICE}
//                 </span>
//                 <span className="text-gray-900">
//                   ${calculateTotal().toFixed(2)}
//                 </span>
//               </div>
              
//               {calculateSavings() > 0 && (
//                 <div className="flex justify-between items-center mb-2">
//                   <span className="text-green-600">
//                     Bulk discount ({selectedCredits >= 5 ? '15%' : selectedCredits >= 3 ? '10%' : '5%'})
//                   </span>
//                   <span className="text-green-600">
//                     -${calculateSavings().toFixed(2)}
//                   </span>
//                 </div>
//               )}
              
//               <div className="flex justify-between items-center font-semibold text-lg border-t pt-2">
//                 <span>Total</span>
//                 <span>${getFinalPrice().toFixed(2)}</span>
//               </div>
              
//               <div className="text-sm text-gray-500 mt-2">
//                 ${(getFinalPrice() / selectedCredits).toFixed(2)} per consultation
//               </div>
//             </div>

//             {/* Benefits */}
//             <div className="space-y-3 mb-6">
//               <div className="flex items-center text-gray-700">
//                 <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
//                 Credits never expire
//               </div>
//               <div className="flex items-center text-gray-700">
//                 <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
//                 Book consultations anytime
//               </div>
//               <div className="flex items-center text-gray-700">
//                 <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
//                 Same 90-minute sessions
//               </div>
//               {calculateSavings() > 0 && (
//                 <div className="flex items-center text-gray-700">
//                   <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
//                   Save ${calculateSavings().toFixed(2)} with bulk pricing
//                 </div>
//               )}
//             </div>
            
//             <button
//               onClick={handleCreditSelectionComplete}
//               className="cursor-pointer w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
//             >
//               Continue to Payment
//             </button>
//           </div>
//         </div>
//       )}

//       {bookingStep === 'payment' && (
//         <div className="max-w-4xl mx-auto">
//           <div className="mb-6">
//             <button
//               onClick={canBook ? handleBackToCreditSelection : handleBackToSelect}
//               className="cursor-pointer flex items-center text-blue-600 hover:text-blue-800 font-medium"
//             >
//               <ArrowLeft className="w-4 h-4 mr-1" />
//               Back to {canBook ? 'Credit Selection' : 'Selection'}
//             </button>
//           </div>
          
//           {/* Order Summary */}
//           <div className="bg-gray-50 rounded-lg p-6 mb-6">
//             <div className="flex justify-between items-center mb-4">
//               <div>
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   {bookingMethod === 'single' ? 'Single Consultation' : `${selectedCredits} Consultation Credits`}
//                 </h3>
//                 <p className="text-sm text-gray-600">
//                   {bookingMethod === 'single' 
//                     ? 'One 90-minute consultation session'
//                     : `${selectedCredits} consultation session${selectedCredits === 1 ? '' : 's'} you can book anytime`
//                   }
//                 </p>
//               </div>
//               <div className="text-right">
//                 <p className="text-2xl font-bold text-gray-900">${getFinalPrice().toFixed(2)}</p>
//                 {calculateSavings() > 0 && (
//                   <p className="text-sm text-green-600">
//                     Save ${calculateSavings().toFixed(2)}
//                   </p>
//                 )}
//               </div>
//             </div>
            
//             {bookingMethod === 'multiple' && (
//               <div className="mt-4 pt-4 border-t border-gray-200">
//                 <p className="text-sm text-gray-600 mb-2">
//                   <strong>Next step:</strong> After payment, you'll receive {selectedCredits} consultation credit{selectedCredits === 1 ? '' : 's'} and can book your sessions.
//                 </p>
//               </div>
//             )}
//           </div>

//           {paymentMethod === 'instant' ? (
//             <PaymentGateway
//               amount={Number(getFinalPrice().toFixed(2))}
//               description={
//                 bookingMethod === 'single' 
//                   ? 'Single Consultation Session'
//                   : `${selectedCredits} Consultation Credits`
//               }
//               onSuccess={handlePaymentSuccess}
//               credits_purchased={bookingMethod === 'single' ? 1 : selectedCredits}
//             />
//           ) : (
//             <InvoiceGenerator />
//           )}
//         </div>
//       )}

//       {/* Calendly Modal */}
//       <CalendlyModal
//         isOpen={showCalendly}
//         onClose={handleCalendlyClose}
//         user={session?.user}
//         onBookingSuccess={handleBookingSuccess}
//       />
//     </div>
//   );
// }