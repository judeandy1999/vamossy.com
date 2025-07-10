'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/utils/client';
import Spinner from '@/components/ui/spinner';
import { Download, X } from 'lucide-react';
import { getMNBExchangeRate, convertUSDToHUF } from '@/utils/mnbExchangeRate';

export default function InvoiceGenerator({ paymentData = null, onClose = null }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    recipientEmail: '',
    recipientName: '',
    dueDate: ''
  });
  const invoiceRef = useRef(null);

  // Auto-populate form and generate invoice when payment data is provided
  useEffect(() => {
    if (paymentData) {
      const populatedFormData = {
        amount: parseFloat(paymentData.amount).toFixed(2),
        description: paymentData.description || 'Payment for services',
        recipientEmail: paymentData.users?.email || '',
        recipientName: paymentData.users?.name || '',
        dueDate: ''
      };
      setFormData(populatedFormData);
      
      // Auto-generate invoice from payment data
      generateInvoiceFromPayment(populatedFormData);
    }
  }, [paymentData]);

  // Fetch exchange rate when component mounts or amount changes
  const fetchExchangeRate = async () => {
    if (formData.amount) {
      try {
        const rate = await getMNBExchangeRate('USD');
        setExchangeRate(rate);
      } catch (err) {
        console.error('Failed to fetch exchange rate:', err);
      }
    }
  };

  useEffect(() => {
    if (formData.amount && !paymentData) {
      fetchExchangeRate();
    }
  }, [formData.amount, paymentData]);

  const handleInputChange = (e) => {
    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value
    };
    setFormData(newFormData);
  };

  const generateInvoiceFromPayment = async (formDataToUse = formData) => {
    if (!paymentData) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Get current exchange rate
      let currentExchangeRate = exchangeRate;
      if (!currentExchangeRate) {
        currentExchangeRate = await getMNBExchangeRate('USD');
        setExchangeRate(currentExchangeRate);
      }

      // Create invoice data structure from payment data
      const generatedInvoiceData = {
        invoiceNumber: `PAY-${paymentData.id.slice(0, 8).toUpperCase()}`,
        issueDate: new Date().toISOString().split('T')[0],
        performanceDate: new Date(paymentData.created_at).toISOString().split('T')[0],
        dueDate: formDataToUse.dueDate || 'Paid',
        
        issuer: {
          name: process.env.NEXT_PUBLIC_BUSINESS_NAME || 'Vamossy',
          address: {
            street: process.env.NEXT_PUBLIC_BUSINESS_ADDRESS || '123 Business Street',
            city: process.env.NEXT_PUBLIC_BUSINESS_CITY || 'Your City',
            state: process.env.NEXT_PUBLIC_BUSINESS_STATE || 'Your State',
            postalCode: process.env.NEXT_PUBLIC_BUSINESS_ZIP || '12345',
            country: 'Hungary'
          },
          taxNumber: process.env.NEXT_PUBLIC_BUSINESS_TAX_NUMBER || 'HU-TAX-123456789',
          email: process.env.NEXT_PUBLIC_PAYPAL_BUSINESS_EMAIL || 'business@example.com',
          vatRegistration: process.env.NEXT_PUBLIC_BUSINESS_VAT_NUMBER || 'Not VAT registered'
        },
        
        client: {
          name: formDataToUse.recipientName || paymentData.users?.name || 'Customer',
          email: formDataToUse.recipientEmail || paymentData.users?.email || '',
          address: 'Address not provided',
          taxNumber: 'Not provided'
        },
        
        exchangeRate: currentExchangeRate,
        
        items: [{
          description: formDataToUse.description || paymentData.description || 'Payment for services',
          quantity: 1,
          unitPrice: {
            usd: parseFloat(paymentData.amount),
            huf: convertUSDToHUF(parseFloat(paymentData.amount), currentExchangeRate.rate)
          },
          totalPrice: {
            usd: parseFloat(paymentData.amount),
            huf: convertUSDToHUF(parseFloat(paymentData.amount), currentExchangeRate.rate)
          },
          vatRate: 0
        }],
        
        totals: {
          subtotal: {
            usd: parseFloat(paymentData.amount),
            huf: convertUSDToHUF(parseFloat(paymentData.amount), currentExchangeRate.rate)
          },
          vat: { usd: 0, huf: 0 },
          total: {
            usd: parseFloat(paymentData.amount),
            huf: convertUSDToHUF(parseFloat(paymentData.amount), currentExchangeRate.rate)
          }
        },
        
        vatInfo: {
          exemptionReason: 'Áfa mentes szolgáltatás / VAT exempt service',
          note: 'This service is exempt from VAT according to Hungarian VAT law.'
        },
        
        paypalDetails: {
          transactionId: paymentData.paypal_order_id || paymentData.id,
          status: paymentData.status,
          originalPaymentDate: paymentData.created_at
        }
      };

      // Store the invoice data and show preview
      setInvoiceData(generatedInvoiceData);
      setShowInvoicePreview(true);
      
      setResult({
        success: true,
        invoice: {
          id: generatedInvoiceData.invoiceNumber,
          detail: {
            invoice_number: generatedInvoiceData.invoiceNumber
          },
          status: 'GENERATED'
        },
        exchangeRate: currentExchangeRate
      });

    } catch (err) {
      console.error('Error generating invoice from payment:', err);
      setError('Failed to generate invoice from payment data');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // If we have payment data, generate invoice from payment
    if (paymentData) {
      await generateInvoiceFromPayment();
      return;
    }

    // Otherwise, use the original PayPal invoice creation
    setIsGenerating(true);
    setError(null);

    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;

    try {
      const response = await fetch('/api/payments/paypal/create-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
        setFormData({
          amount: '',
          description: '',
          recipientEmail: '',
          recipientName: '',
          dueDate: ''
        });
      } else {
        setError(data.error || 'Failed to create invoice');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Generate PDF from HTML using html2pdf.js with color fix
  const generatePDF = async () => {
    setIsDownloading(true);
    
    try {
      // Dynamically import html2pdf to reduce bundle size
      const html2pdf = (await import('html2pdf.js')).default;
      
      const element = invoiceRef.current;
      
      // Clone the element to avoid modifying the original
      const clonedElement = element.cloneNode(true);
      
      // Function to replace Tailwind classes with inline styles
      const replaceTailwindWithInlineStyles = (el) => {
        if (el.classList) {
          // Background colors
          if (el.classList.contains('bg-green-50')) {
            el.style.backgroundColor = '#f0fdf4';
            el.classList.remove('bg-green-50');
          }
          if (el.classList.contains('bg-yellow-50')) {
            el.style.backgroundColor = '#fefce8';
            el.classList.remove('bg-yellow-50');
          }
          if (el.classList.contains('bg-blue-50')) {
            el.style.backgroundColor = '#eff6ff';
            el.classList.remove('bg-blue-50');
          }
          if (el.classList.contains('bg-gray-50')) {
            el.style.backgroundColor = '#f9fafb';
            el.classList.remove('bg-gray-50');
          }
          if (el.classList.contains('bg-gray-100')) {
            el.style.backgroundColor = '#f3f4f6';
            el.classList.remove('bg-gray-100');
          }
          if (el.classList.contains('bg-white')) {
            el.style.backgroundColor = '#ffffff';
            el.classList.remove('bg-white');
          }

          // Text colors
          if (el.classList.contains('text-green-900')) {
            el.style.color = '#14532d';
            el.classList.remove('text-green-900');
          }
          if (el.classList.contains('text-green-800')) {
            el.style.color = '#166534';
            el.classList.remove('text-green-800');
          }
          if (el.classList.contains('text-yellow-900')) {
            el.style.color = '#713f12';
            el.classList.remove('text-yellow-900');
          }
          if (el.classList.contains('text-yellow-800')) {
            el.style.color = '#92400e';
            el.classList.remove('text-yellow-800');
          }
          if (el.classList.contains('text-blue-900')) {
            el.style.color = '#1e3a8a';
            el.classList.remove('text-blue-900');
          }
          if (el.classList.contains('text-blue-800')) {
            el.style.color = '#1e40af';
            el.classList.remove('text-blue-800');
          }
          if (el.classList.contains('text-gray-900')) {
            el.style.color = '#111827';
            el.classList.remove('text-gray-900');
          }
          if (el.classList.contains('text-gray-600')) {
            el.style.color = '#4b5563';
            el.classList.remove('text-gray-600');
          }

          // Border colors
          if (el.classList.contains('border-green-200')) {
            el.style.borderColor = '#bbf7d0';
            el.classList.remove('border-green-200');
          }
          if (el.classList.contains('border-yellow-200')) {
            el.style.borderColor = '#fef3c7';
            el.classList.remove('border-yellow-200');
          }
          if (el.classList.contains('border-blue-500')) {
            el.style.borderColor = '#3b82f6';
            el.classList.remove('border-blue-500');
          }
          if (el.classList.contains('border-gray-300')) {
            el.style.borderColor = '#d1d5db';
            el.classList.remove('border-gray-300');
          }
          if (el.classList.contains('border-gray-900')) {
            el.style.borderColor = '#111827';
            el.classList.remove('border-gray-900');
          }

          // Border styles
          if (el.classList.contains('border')) {
            el.style.border = '1px solid';
            el.classList.remove('border');
          }
          if (el.classList.contains('border-b-2')) {
            el.style.borderBottom = '2px solid';
            el.classList.remove('border-b-2');
          }
          if (el.classList.contains('border-t-2')) {
            el.style.borderTop = '2px solid';
            el.classList.remove('border-t-2');
          }
          if (el.classList.contains('border-l-4')) {
            el.style.borderLeft = '4px solid';
            el.classList.remove('border-l-4');
          }
          if (el.classList.contains('border-t')) {
            el.style.borderTop = '1px solid';
            el.classList.remove('border-t');
          }
          if (el.classList.contains('border-b')) {
            el.style.borderBottom = '1px solid';
            el.classList.remove('border-b');
          }
        }
        
        // Process child elements recursively
        for (let child of el.children) {
          replaceTailwindWithInlineStyles(child);
        }
      };
      
      // Apply the conversion
      replaceTailwindWithInlineStyles(clonedElement);
      
      // Add a comprehensive style override
      const style = document.createElement('style');
      style.textContent = `
        * {
          color: inherit !important;
          background-color: inherit !important;
          border-color: inherit !important;
        }
        
        .bg-green-50, [class*="bg-green-50"] { background-color: #f0fdf4 !important; }
        .bg-yellow-50, [class*="bg-yellow-50"] { background-color: #fefce8 !important; }
        .bg-blue-50, [class*="bg-blue-50"] { background-color: #eff6ff !important; }
        .bg-gray-100, [class*="bg-gray-100"] { background-color: #f3f4f6 !important; }
        .bg-white, [class*="bg-white"] { background-color: #ffffff !important; }
        
        .text-green-900, [class*="text-green-900"] { color: #14532d !important; }
        .text-green-800, [class*="text-green-800"] { color: #166534 !important; }
        .text-yellow-900, [class*="text-yellow-900"] { color: #713f12 !important; }
        .text-yellow-800, [class*="text-yellow-800"] { color: #92400e !important; }
        .text-blue-900, [class*="text-blue-900"] { color: #1e3a8a !important; }
        .text-blue-800, [class*="text-blue-800"] { color: #1e40af !important; }
        .text-gray-900, [class*="text-gray-900"] { color: #111827 !important; }
        .text-gray-600, [class*="text-gray-600"] { color: #4b5563 !important; }
        
        .border-green-200, [class*="border-green-200"] { border-color: #bbf7d0 !important; }
        .border-yellow-200, [class*="border-yellow-200"] { border-color: #fef3c7 !important; }
        .border-blue-500, [class*="border-blue-500"] { border-color: #3b82f6 !important; }
        .border-gray-300, [class*="border-gray-300"] { border-color: #d1d5db !important; }
        .border-gray-900, [class*="border-gray-900"] { border-color: #111827 !important; }
      `;
      clonedElement.appendChild(style);
      
      const opt = {
        margin: 0.5,
        filename: `invoice-${invoiceData.invoiceNumber}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true,
          backgroundColor: '#ffffff',
          logging: false
        },
        jsPDF: { 
          unit: 'in', 
          format: 'letter', 
          orientation: 'portrait' 
        }
      };

      await html2pdf().set(opt).from(clonedElement).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to generate PDF. Trying alternative method...');
      // Fallback to the original jsPDF method if html2pdf fails
      await generatePDFWithJsPDF();
    } finally {
      setIsDownloading(false);
    }
  };

  // Fallback PDF generation using jsPDF (original method)
  const generatePDFWithJsPDF = async () => {
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      
      // Set up the document
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const margin = 20;
      let yPosition = margin;

      // Header
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('INVOICE', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;

      // Invoice details
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Invoice #: ${paymentData.id}`, margin, yPosition);
      yPosition += 10;
      doc.text(`Date: ${formatDate(paymentData.created_at)}`, margin, yPosition);
      yPosition += 10;
      doc.text(`Status: ${paymentData.status}`, margin, yPosition);
      yPosition += 20;

      // Bill to section
      doc.setFont('helvetica', 'bold');
      doc.text('Bill To:', margin, yPosition);
      yPosition += 10;
      doc.setFont('helvetica', 'normal');
      doc.text(paymentData.users?.name || 'N/A', margin, yPosition);
      yPosition += 8;
      doc.text(paymentData.users?.email || 'N/A', margin, yPosition);
      yPosition += 20;

      // Services table
      doc.setFont('helvetica', 'bold');
      doc.text('Description', margin, yPosition);
      doc.text('Amount', pageWidth - margin - 30, yPosition);
      yPosition += 5;
      
      // Table line
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;
      
      doc.setFont('helvetica', 'normal');
      doc.text(paymentData.description || 'Service Payment', margin, yPosition);
      doc.text(formatCurrency(paymentData.amount), pageWidth - margin - 30, yPosition);
      yPosition += 20;

      // Total
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 10;
      doc.setFont('helvetica', 'bold');
      doc.text('Total:', pageWidth - margin - 60, yPosition);
      doc.text(formatCurrency(paymentData.amount), pageWidth - margin - 30, yPosition);

      // Save the PDF
      doc.save(`invoice-${paymentData.id}.pdf`);
    } catch (error) {
      console.error('Error generating PDF with jsPDF:', error);
    }
  };

  // Show loading state when generating from payment data
  if (paymentData && isGenerating && !showInvoicePreview) {
    return (
      <Spinner />
    );
  }

  // Show invoice preview modal
  if (showInvoicePreview && invoiceData) {
    return (
      <div className="fixed inset-0 bg-black/20 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-screen overflow-hidden flex flex-col">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Invoice Preview</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={generatePDF}
                disabled={isDownloading}
                className="cursor-pointer flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </button>
              <button
                onClick={() => {
                  setShowInvoicePreview(false);
                  if (onClose) onClose();
                }}
                className="cursor-pointer text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Invoice Content */}
          <div className="flex-1 overflow-auto p-6 bg-gray-50">
            <div className="bg-white p-8 shadow-sm max-w-4xl mx-auto" style={{ minHeight: '11in' }} ref={invoiceRef}>
              {/* Invoice Header */}
              <div className="flex justify-between items-start mb-8 pb-4 border-b-2 border-gray-900">
                <div>
                  <h1 className="text-3xl font-bold uppercase text-gray-900">Számla / Invoice</h1>
                  <p className="text-gray-600 mt-1">#{invoiceData.invoiceNumber}</p>
                </div>
                <div className="text-right text-sm">
                  <div><strong>Kiállítás dátuma / Issue Date:</strong> {invoiceData.issueDate}</div>
                  <div><strong>Teljesítés dátuma / Performance Date:</strong> {invoiceData.performanceDate}</div>
                  <div><strong>Fizetési határidő / Due Date:</strong> {invoiceData.dueDate}</div>
                </div>
              </div>

              {/* Company and Client Info */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="font-bold text-gray-900 border-b border-gray-300 pb-2 mb-3">Eladó / Seller</h3>
                  <div className="text-sm space-y-1">
                    <div className="font-semibold">{invoiceData.issuer.name}</div>
                    <div>{invoiceData.issuer.address.street}</div>
                    <div>{invoiceData.issuer.address.city}, {invoiceData.issuer.address.state} {invoiceData.issuer.address.postalCode}</div>
                    <div>{invoiceData.issuer.address.country}</div>
                    <div><strong>Adószám / Tax Number:</strong> {invoiceData.issuer.taxNumber}</div>
                    <div><strong>Email:</strong> {invoiceData.issuer.email}</div>
                    <div><strong>ÁFA status:</strong> {invoiceData.issuer.vatRegistration}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-bold text-gray-900 border-b border-gray-300 pb-2 mb-3">Vevő / Buyer</h3>
                  <div className="text-sm space-y-1">
                    <div className="font-semibold">{invoiceData.client.name}</div>
                    <div>{invoiceData.client.address}</div>
                    <div><strong>Email:</strong> {invoiceData.client.email}</div>
                    <div><strong>Adószám / Tax Number:</strong> {invoiceData.client.taxNumber}</div>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              {paymentData && (
                <div className="bg-green-50 p-4 rounded-lg mb-6 border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2">Fizetési információ / Payment Information</h4>
                  <div className="text-sm text-green-800 space-y-1">
                    <div>Eredeti fizetés dátuma / Original Payment Date: {new Date(invoiceData.paypalDetails.originalPaymentDate).toLocaleDateString('hu-HU')}</div>
                    <div>Fizetési státusz / Payment Status: {invoiceData.paypalDetails.status}</div>
                    <div>PayPal tranzakció ID / PayPal Transaction ID: {invoiceData.paypalDetails.transactionId}</div>
                  </div>
                </div>
              )}

              {/* Exchange Rate */}
              <div className="bg-yellow-50 p-4 rounded-lg mb-6 border border-yellow-200">
                <h4 className="font-semibold text-yellow-900 mb-2">Árfolyam információ / Exchange Rate Information</h4>
                <div className="text-sm text-yellow-800 space-y-1">
                  <div>1 USD = {invoiceData.exchangeRate.rate} HUF</div>
                  <div>Árfolyam dátuma / Rate Date: {invoiceData.exchangeRate.date}</div>
                  <div>Forrás / Source: {invoiceData.exchangeRate.source}</div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-6">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 p-2 text-left text-xs font-medium">Megnevezés / Description</th>
                      <th className="border border-gray-300 p-2 text-center text-xs font-medium">Mennyiség / Qty</th>
                      <th className="border border-gray-300 p-2 text-right text-xs font-medium">Egységár USD</th>
                      <th className="border border-gray-300 p-2 text-right text-xs font-medium">Egységár HUF</th>
                      <th className="border border-gray-300 p-2 text-right text-xs font-medium">Összesen USD</th>
                      <th className="border border-gray-300 p-2 text-right text-xs font-medium">Összesen HUF</th>
                      <th className="border border-gray-300 p-2 text-center text-xs font-medium">ÁFA %</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoiceData.items.map((item, index) => (
                      <tr key={index}>
                        <td className="border border-gray-300 p-2 text-sm">{item.description}</td>
                        <td className="border border-gray-300 p-2 text-center text-sm">{item.quantity}</td>
                        <td className="border border-gray-300 p-2 text-right text-sm">${item.unitPrice.usd.toFixed(2)}</td>
                        <td className="border border-gray-300 p-2 text-right text-sm">{item.unitPrice.huf.toLocaleString()} Ft</td>
                        <td className="border border-gray-300 p-2 text-right text-sm">${item.totalPrice.usd.toFixed(2)}</td>
                        <td className="border border-gray-300 p-2 text-right text-sm">{item.totalPrice.huf.toLocaleString()} Ft</td>
                        <td className="border border-gray-300 p-2 text-center text-sm">{item.vatRate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="text-right mb-6">
                <div className="text-sm space-y-1 mb-2">
                  <div>Nettó összeg / Subtotal: ${invoiceData.totals.subtotal.usd.toFixed(2)} ({invoiceData.totals.subtotal.huf.toLocaleString()} Ft)</div>
                  <div>ÁFA / VAT: ${invoiceData.totals.vat.usd.toFixed(2)} ({invoiceData.totals.vat.huf.toLocaleString()} Ft)</div>
                </div>
                <div className="text-lg font-bold border-t-2 border-gray-900 pt-2">
                  Végösszeg / Total: ${invoiceData.totals.total.usd.toFixed(2)} ({invoiceData.totals.total.huf.toLocaleString()} Ft)
                </div>
              </div>

              {/* VAT Info */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6 border-l-4 border-blue-500">
                <h4 className="font-semibold text-blue-900 mb-2">ÁFA információ / VAT Information</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <div>{invoiceData.vatInfo.exemptionReason}</div>
                  <div className="italic">{invoiceData.vatInfo.note}</div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-300 pt-4 text-xs text-gray-600">
                <div className="space-y-1">
                  <div><strong>PayPal tranzakció részletek / PayPal Transaction Details:</strong></div>
                  <div>PayPal Invoice ID: {invoiceData.paypalDetails.transactionId}</div>
                  <div>Status: {invoiceData.paypalDetails.status}</div>
                  <div className="mt-2">Ez a számla megfelel a magyar számviteli előírásoknak. / This invoice complies with Hungarian accounting regulations.</div>
                  <div>Köszönjük üzletét! / Thank you for your business!</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
          <p className="text-red-600 mb-4 text-sm">{error}</p>
          
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => {
                setError(null);
                if (paymentData) {
                  generateInvoiceFromPayment();
                }
              }}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Try Again
            </button>
            
            <button
              onClick={() => setError(null)}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Only show the form if no payment data is provided (for manual invoice creation)
  if (!paymentData) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Generate PayPal Invoice</h2>
        
        {/* Exchange Rate Display */}
        {exchangeRate && formData.amount && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-700 text-sm">
              <strong>Current Exchange Rate:</strong> 1 USD = {exchangeRate.rate} HUF<br/>
              <strong>Approximate HUF Amount:</strong> {convertUSDToHUF(parseFloat(formData.amount), exchangeRate.rate).toLocaleString('hu-HU')} Ft<br/>
              <span className="text-xs">Source: {exchangeRate.source} ({exchangeRate.date})</span>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount (USD)
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="99.99"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Service description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Email
            </label>
            <input
              type="email"
              name="recipientEmail"
              value={formData.recipientEmail}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="customer@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Recipient Name
            </label>
            <input
              type="text"
              name="recipientName"
              value={formData.recipientName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Due Date (Optional)
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <div className="flex items-center justify-center">
                <Spinner size="sm" />
                <span className="ml-2">Creating Invoice...</span>
              </div>
            ) : (
              'Generate Invoice'
            )}
          </button>
        </form>
      </div>
    );
  }
}