'use client';

import { useState } from 'react';
import { supabase } from '@/utils/client';
import Spinner from '@/components/ui/spinner';
import { Download } from 'lucide-react';
import { getMNBExchangeRate, convertUSDToHUF } from '@/utils/mnbExchangeRate';

export default function InvoiceGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(null);
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    recipientEmail: '',
    recipientName: '',
    dueDate: ''
  });

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

  const handleInputChange = (e) => {
    const newFormData = {
      ...formData,
      [e.target.name]: e.target.value
    };
    setFormData(newFormData);
    
    // Fetch exchange rate when amount changes
    if (e.target.name === 'amount' && e.target.value) {
      fetchExchangeRate();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

  const downloadInvoice = async (invoiceId) => {
    setIsDownloading(true);
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;

    try {
      const response = await fetch(`/api/payments/paypal/download-invoice?invoiceId=${invoiceId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
        },
      });

      if (response.headers.get('content-type')?.includes('application/pdf')) {
        // Direct PDF download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `invoice-${invoiceId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        // JSON response with invoice details
        const data = await response.json();
        if (data.success && data.invoiceDetails) {
          // Generate PDF on client side using invoice details
          generateHungarianCompliantPDF(data.invoiceDetails);
        } else {
          throw new Error(data.error || 'Download failed');
        }
      }
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download invoice');
    } finally {
      setIsDownloading(false);
    }
  };

  const generateHungarianCompliantPDF = (invoiceData) => {
    console.log('Invoice data received:', invoiceData); // Debug log
    
    // Handle different data structures
    let actualInvoiceData;
    
    if (invoiceData.detail) {
      // Original PayPal format
      actualInvoiceData = invoiceData;
    } else if (invoiceData.originalPayPalInvoice) {
      // Our Hungarian format with original PayPal data
      actualInvoiceData = invoiceData.originalPayPalInvoice;
    } else if (invoiceData.invoiceNumber) {
      // Already processed Hungarian format
      generateProcessedHungarianPDF(invoiceData);
      return;
    } else {
      console.error('Unknown invoice data format:', invoiceData);
      alert('Error: Invalid invoice data format');
      return;
    }

    // Create structured Hungarian invoice data from PayPal format
    const processedInvoiceData = {
      invoiceNumber: actualInvoiceData.detail?.invoice_number || 'N/A',
      issueDate: actualInvoiceData.detail?.invoice_date || new Date().toISOString().split('T')[0],
      performanceDate: actualInvoiceData.detail?.invoice_date || new Date().toISOString().split('T')[0],
      dueDate: actualInvoiceData.detail?.payment_term?.due_date || null,
      
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
        name: actualInvoiceData.primary_recipients?.[0]?.billing_info?.name ? 
          `${actualInvoiceData.primary_recipients[0].billing_info.name.given_name || ''} ${actualInvoiceData.primary_recipients[0].billing_info.name.surname || ''}`.trim() : 
          'Customer',
        email: actualInvoiceData.primary_recipients?.[0]?.billing_info?.email_address || '',
        address: 'Address not provided',
        taxNumber: 'Not provided'
      },
      
      exchangeRate: result?.exchangeRate || invoiceData.exchangeRate || {
        rate: 380,
        date: new Date().toISOString().split('T')[0],
        source: 'Default rate'
      },
      
      items: actualInvoiceData.items?.map(item => {
        const usdAmount = parseFloat(item.unit_amount?.value || 0);
        const exchangeRateValue = result?.exchangeRate?.rate || invoiceData.exchangeRate?.rate || 380;
        const hufAmount = convertUSDToHUF(usdAmount, exchangeRateValue);
        return {
          description: item.name || 'Service',
          quantity: parseInt(item.quantity) || 1,
          unitPrice: {
            usd: usdAmount,
            huf: hufAmount
          },
          totalPrice: {
            usd: usdAmount * (parseInt(item.quantity) || 1),
            huf: hufAmount * (parseInt(item.quantity) || 1)
          },
          vatRate: 0
        };
      }) || [],
      
      totals: {
        subtotal: {
          usd: parseFloat(actualInvoiceData.amount?.breakdown?.item_total?.value || 0),
          huf: convertUSDToHUF(parseFloat(actualInvoiceData.amount?.breakdown?.item_total?.value || 0), result?.exchangeRate?.rate || invoiceData.exchangeRate?.rate || 380)
        },
        vat: { usd: 0, huf: 0 },
        total: {
          usd: parseFloat(actualInvoiceData.amount?.breakdown?.item_total?.value || 0),
          huf: convertUSDToHUF(parseFloat(actualInvoiceData.amount?.breakdown?.item_total?.value || 0), result?.exchangeRate?.rate || invoiceData.exchangeRate?.rate || 380)
        }
      },
      
      vatInfo: {
        exemptionReason: 'Áfa mentes szolgáltatás / VAT exempt service',
        note: 'This service is exempt from VAT according to Hungarian VAT law.'
      },
      
      paypalDetails: {
        transactionId: actualInvoiceData.id || 'N/A',
        status: actualInvoiceData.status || 'N/A'
      }
    };

    generateProcessedHungarianPDF(processedInvoiceData);
  };

  const generateProcessedHungarianPDF = (invoiceData) => {
    // Generate the PDF using the processed invoice data
    const printWindow = window.open('', '_blank');
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="hu">
        <head>
          <meta charset="UTF-8">
          <title>Számla ${invoiceData.invoiceNumber}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              font-size: 12px;
              line-height: 1.4;
            }
            .header { 
              border-bottom: 2px solid #333; 
              padding-bottom: 20px; 
              margin-bottom: 20px; 
              display: flex;
              justify-content: space-between;
            }
            .invoice-title { 
              font-size: 24px; 
              font-weight: bold; 
              text-transform: uppercase;
            }
            .invoice-number { color: #666; margin-top: 5px; }
            .company-info, .client-info {
              width: 45%;
            }
            .section-title {
              font-weight: bold;
              margin-bottom: 10px;
              border-bottom: 1px solid #ccc;
              padding-bottom: 5px;
            }
            .details { margin: 20px 0; }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            .items-table th, .items-table td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            .items-table th {
              background-color: #f5f5f5;
              font-weight: bold;
            }
            .amount { 
              font-size: 16px; 
              font-weight: bold; 
              text-align: right;
              margin-top: 20px;
            }
            .footer { 
              margin-top: 40px; 
              border-top: 1px solid #ccc; 
              padding-top: 20px; 
              font-size: 11px;
              color: #666;
            }
            .vat-info {
              background-color: #f9f9f9;
              padding: 10px;
              margin: 20px 0;
              border-left: 4px solid #007cba;
            }
            .exchange-rate {
              background-color: #fff3cd;
              padding: 10px;
              margin: 20px 0;
              border: 1px solid #ffeaa7;
              border-radius: 4px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="invoice-title">Számla / Invoice</div>
              <div class="invoice-number">#${invoiceData.invoiceNumber}</div>
            </div>
            <div style="text-align: right;">
              <div><strong>Kiállítás dátuma / Issue Date:</strong> ${invoiceData.issueDate}</div>
              <div><strong>Teljesítés dátuma / Performance Date:</strong> ${invoiceData.performanceDate}</div>
              <div><strong>Fizetési határidő / Due Date:</strong> ${invoiceData.dueDate || 'N/A'}</div>
            </div>
          </div>
          
          <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
            <div class="company-info">
              <div class="section-title">Eladó / Seller</div>
              <div><strong>${invoiceData.issuer.name}</strong></div>
              <div>${invoiceData.issuer.address.street}</div>
              <div>${invoiceData.issuer.address.city}, ${invoiceData.issuer.address.state} ${invoiceData.issuer.address.postalCode}</div>
              <div>${invoiceData.issuer.address.country}</div>
              <div><strong>Adószám / Tax Number:</strong> ${invoiceData.issuer.taxNumber}</div>
              <div><strong>Email:</strong> ${invoiceData.issuer.email}</div>
              <div><strong>ÁFA status:</strong> ${invoiceData.issuer.vatRegistration}</div>
            </div>
            
            <div class="client-info">
              <div class="section-title">Vevő / Buyer</div>
              <div><strong>${invoiceData.client.name}</strong></div>
              <div>${invoiceData.client.address}</div>
              <div><strong>Email:</strong> ${invoiceData.client.email}</div>
              <div><strong>Adószám / Tax Number:</strong> ${invoiceData.client.taxNumber}</div>
            </div>
          </div>

          <div class="exchange-rate">
            <strong>Árfolyam információ / Exchange Rate Information:</strong><br>
            1 USD = ${invoiceData.exchangeRate.rate} HUF<br>
            Árfolyam dátuma / Rate Date: ${invoiceData.exchangeRate.date}<br>
            Forrás / Source: ${invoiceData.exchangeRate.source}
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>Megnevezés / Description</th>
                <th>Mennyiség / Qty</th>
                <th>Egységár USD / Unit Price USD</th>
                <th>Egységár HUF / Unit Price HUF</th>
                <th>Összesen USD / Total USD</th>
                <th>Összesen HUF / Total HUF</th>
                <th>ÁFA % / VAT %</th>
              </tr>
            </thead>
            <tbody>
              ${invoiceData.items.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>$${item.unitPrice.usd.toFixed(2)}</td>
                  <td>${item.unitPrice.huf.toLocaleString()} Ft</td>
                  <td>$${item.totalPrice.usd.toFixed(2)}</td>
                  <td>${item.totalPrice.huf.toLocaleString()} Ft</td>
                  <td>${item.vatRate}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="amount">
            <div>Nettó összeg / Subtotal: $${invoiceData.totals.subtotal.usd.toFixed(2)} (${invoiceData.totals.subtotal.huf.toLocaleString()} Ft)</div>
            <div>ÁFA / VAT: $${invoiceData.totals.vat.usd.toFixed(2)} (${invoiceData.totals.vat.huf.toLocaleString()} Ft)</div>
            <div style="border-top: 2px solid #333; padding-top: 10px; margin-top: 10px;">
              <strong>Végösszeg / Total: $${invoiceData.totals.total.usd.toFixed(2)} (${invoiceData.totals.total.huf.toLocaleString()} Ft)</strong>
            </div>
          </div>

          <div class="vat-info">
            <strong>ÁFA információ / VAT Information:</strong><br>
            ${invoiceData.vatInfo.exemptionReason}<br>
            <em>${invoiceData.vatInfo.note}</em>
          </div>

          <div class="footer">
            <p><strong>PayPal tranzakció részletek / PayPal Transaction Details:</strong></p>
            <p>PayPal Invoice ID: ${invoiceData.paypalDetails.transactionId}</p>
            <p>Status: ${invoiceData.paypalDetails.status}</p>
            <p>Ez a számla megfelel a magyar számviteli előírásoknak. / This invoice complies with Hungarian accounting regulations.</p>
            <p>Köszönjük üzletét! / Thank you for your business!</p>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 1000);
  };

  if (result) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Invoice Created!</h3>
          <p className="text-gray-600 mb-4">
            Invoice #{result.invoice.detail.invoice_number} has been created
            {result.sent ? ' and sent successfully.' : ' but could not be sent automatically.'}
          </p>
          <div className="text-sm text-gray-500 mb-4">
            <p>Invoice ID: {result.invoice.id}</p>
            <p>Status: {result.invoice.status}</p>
          </div>
          
          <div className="flex flex-col space-y-2">
            <button
              onClick={() => downloadInvoice(result.invoice.id)}
              disabled={isDownloading}
              className="flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isDownloading ? (
                <>
                  <Spinner size="sm" />
                  <span className="ml-2">Downloading...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download Invoice
                </>
              )}
            </button>
            
            <button
              onClick={() => setResult(null)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Create Another Invoice
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Generate PayPal Invoice</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

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