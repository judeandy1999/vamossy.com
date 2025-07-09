import { authenticate } from '@/lib/authMiddleware';
import { verifySupabaseAuth } from '@/utils/verifySupabaseAuth';
import { getMNBExchangeRate, convertUSDToHUF } from '@/utils/mnbExchangeRate';

export default async function handler(req, res) {
  if (!authenticate(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user, error: authError } = await verifySupabaseAuth(req);
  if (authError) {
    return res.status(401).json({ error: authError });
  }

  const { 
    amount, 
    description, 
    recipientEmail, 
    recipientName,
    invoiceNumber,
    dueDate 
  } = req.body;

  if (!amount || !description || !recipientEmail) {
    return res.status(400).json({ 
      error: 'Amount, description, and recipient email are required' 
    });
  }

  try {
    // Fetch current MNB exchange rate
    const exchangeRateInfo = await getMNBExchangeRate('USD');
    const hufAmount = convertUSDToHUF(amount, exchangeRateInfo.rate);

    // Get PayPal access token
    const authString = Buffer.from(
      `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString('base64');

    const tokenResponse = await fetch(`${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${authString}`,
        'Accept': 'application/json',
        'Accept-Language': 'en_US',
      },
      body: 'grant_type=client_credentials',
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      throw new Error(`PayPal token error: ${tokenData.error_description || tokenData.error || 'Unknown error'}`);
    }

    // Create invoice payload with Hungarian compliance
    const invoicePayload = {
      detail: {
        invoice_number: invoiceNumber || `INV-${Date.now()}`,
        invoice_date: new Date().toISOString().split('T')[0],
        currency_code: 'USD',
        reference: `HUF-${hufAmount.toLocaleString('hu-HU')}`,
        note: `Exchange rate (USD to HUF): ${exchangeRateInfo.rate} HUF (${exchangeRateInfo.source} on ${exchangeRateInfo.date})\nApproximate amount in HUF: ${hufAmount.toLocaleString('hu-HU')} Ft\n\nThis invoice complies with Hungarian accounting regulations.`,
        payment_term: {
          term_type: 'DUE_ON_DATE_SPECIFIED',
          due_date: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      },
      invoicer: {
        name: {
          given_name: process.env.BUSINESS_NAME || 'Your',
          surname: 'Company'
        },
        address: {
          address_line_1: process.env.BUSINESS_ADDRESS || '123 Business Street',
          admin_area_2: process.env.BUSINESS_CITY || 'Your City',
          admin_area_1: process.env.BUSINESS_STATE || 'Your State',
          postal_code: process.env.BUSINESS_ZIP || '12345',
          country_code: 'HU'
        },
        email_address: process.env.PAYPAL_BUSINESS_EMAIL || 'your-business@example.com',
        phones: [{
          country_code: '36',
          national_number: process.env.BUSINESS_PHONE || '1234567890',
          phone_type: 'MOBILE'
        }],
        tax_id: process.env.BUSINESS_TAX_NUMBER || 'HU-TAX-123456789',
        additional_notes: process.env.BUSINESS_VAT_NUMBER || 'Not VAT registered'
      },
      primary_recipients: [
        {
          billing_info: {
            name: {
              given_name: recipientName?.split(' ')[0] || 'Customer',
              surname: recipientName?.split(' ').slice(1).join(' ') || ''
            },
            email_address: recipientEmail
          }
        }
      ],
      items: [
        {
          name: description,
          description: `${description}\nHUF equivalent: ${hufAmount.toLocaleString('hu-HU')} Ft (Rate: ${exchangeRateInfo.rate})`,
          quantity: '1',
          unit_amount: {
            currency_code: 'USD',
            value: amount.toString()
          },
          tax: {
            name: 'VAT/ÁFA',
            percent: '0'
          }
        }
      ],
      configuration: {
        partial_payment: {
          allow_partial_payment: false
        },
        allow_tip: false,
        tax_calculated_after_discount: true,
        tax_inclusive: false
      },
      amount: {
        breakdown: {
          item_total: {
            currency_code: 'USD',
            value: amount.toString()
          }
        }
      }
    };

    // Create the invoice
    const invoiceResponse = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v2/invoicing/invoices`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Accept': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify(invoicePayload)
      }
    );

    const invoiceData = await invoiceResponse.json();

    if (!invoiceResponse.ok) {
      throw new Error(invoiceData.message || 'Invoice creation failed');
    }

    // Send the invoice
    const sendResponse = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v2/invoicing/invoices/${invoiceData.id}/send`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          send_to_recipient: true,
          send_to_invoicer: true
        })
      }
    );

    if (!sendResponse.ok) {
      const sendError = await sendResponse.json();
      console.warn('Invoice created but failed to send:', sendError);
    }

    res.status(200).json({
      success: true,
      invoice: invoiceData,
      sent: sendResponse.ok,
      exchangeRate: exchangeRateInfo,
      hufAmount: hufAmount
    });

  } catch (error) {
    console.error('PayPal invoice error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Invoice creation failed' 
    });
  }
}