import { authenticate } from '@/lib/authMiddleware';
import { verifySupabaseAuth } from '@/utils/verifySupabaseAuth';

export default async function handler(req, res) {
  if (!authenticate(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user, error: authError } = await verifySupabaseAuth(req);
  if (authError) {
    return res.status(401).json({ error: authError });
  }

  const { invoiceId } = req.query;

  if (!invoiceId) {
    return res.status(400).json({ error: 'Invoice ID is required' });
  }

  try {
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

    const detailsResponse = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v2/invoicing/invoices/${invoiceId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
          'Accept': 'application/json',
        },
      }
    );

    if (!detailsResponse.ok) {
      throw new Error('Failed to fetch invoice details');
    }

    const invoiceDetails = await detailsResponse.json();

    const exchangeRate = await getHUFExchangeRate(invoiceDetails.detail.invoice_date);

    const hungarianInvoice = await generateHungarianCompliantInvoice(invoiceDetails, exchangeRate);

    return res.status(200).json({
      success: true,
      invoiceDetails: hungarianInvoice,
      originalPayPalInvoice: invoiceDetails,
      exchangeRate,
      downloadUrl: null
    });

  } catch (error) {
    console.error('PayPal invoice download error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Invoice download failed' 
    });
  }
}

async function getHUFExchangeRate(invoiceDate) {
  try {
    const date = new Date(invoiceDate).toISOString().split('T')[0];
    const response = await fetch(`https://api.mnb.hu/CurrencyExchangeRates/GetExchangeRates?startDate=${date}&endDate=${date}&currencyNames=USD`);
    
    if (response.ok) {
      const data = await response.text();
      const rateMatch = data.match(/<Rate unit="1" curr="USD">([\d.]+)<\/Rate>/);
      if (rateMatch) {
        return parseFloat(rateMatch[1]);
      }
    }
  } catch (error) {
    console.error('Failed to fetch MNB exchange rate:', error);
  }
  
  return 380;
}

async function generateHungarianCompliantInvoice(paypalInvoice, exchangeRate) {
  const usdAmount = parseFloat(paypalInvoice.amount?.breakdown?.item_total?.value || 0);
  const hufAmount = Math.round(usdAmount * exchangeRate);

  return {
    invoiceNumber: paypalInvoice.detail.invoice_number,
    issueDate: paypalInvoice.detail.invoice_date,
    performanceDate: paypalInvoice.detail.invoice_date,
    dueDate: paypalInvoice.detail.payment_term?.due_date,
    
    issuer: {
      name: process.env.BUSINESS_NAME,
      address: {
        street: process.env.BUSINESS_ADDRESS,
        city: process.env.BUSINESS_CITY,
        state: process.env.BUSINESS_STATE,
        postalCode: process.env.BUSINESS_ZIP,
        country: process.env.BUSINESS_COUNTRY
      },
      taxNumber: process.env.BUSINESS_TAX_NUMBER,
      email: process.env.PAYPAL_BUSINESS_EMAIL,
      vatRegistration: process.env.BUSINESS_VAT_NUMBER || 'Not VAT registered'
    },
    
    client: {
      name: `${paypalInvoice.primary_recipients?.[0]?.billing_info?.name?.given_name || ''} ${paypalInvoice.primary_recipients?.[0]?.billing_info?.name?.surname || ''}`.trim(),
      email: paypalInvoice.primary_recipients?.[0]?.billing_info?.email_address,
      address: paypalInvoice.primary_recipients?.[0]?.billing_info?.address || 'Address not provided',
      taxNumber: 'Not provided'
    },
    
    items: paypalInvoice.items?.map(item => ({
      description: item.name,
      quantity: parseInt(item.quantity),
      unitPrice: {
        usd: parseFloat(item.unit_amount?.value || 0),
        huf: Math.round(parseFloat(item.unit_amount?.value || 0) * exchangeRate)
      },
      totalPrice: {
        usd: parseFloat(item.unit_amount?.value || 0) * parseInt(item.quantity),
        huf: Math.round(parseFloat(item.unit_amount?.value || 0) * parseInt(item.quantity) * exchangeRate)
      },
      vatRate: 0,
      vatAmount: {
        usd: 0,
        huf: 0
      }
    })) || [],
    
    totals: {
      subtotal: {
        usd: usdAmount,
        huf: hufAmount
      },
      vat: {
        usd: 0,
        huf: 0
      },
      total: {
        usd: usdAmount,
        huf: hufAmount
      }
    },
    
    exchangeRate: {
      rate: exchangeRate,
      date: paypalInvoice.detail.invoice_date,
      source: 'Magyar Nemzeti Bank (MNB)'
    },
    
    vatInfo: {
      vatExempt: true,
      exemptionReason: 'International service - reverse charge applies (Hungarian VAT Act Section 142)',
      note: 'A szolgáltatás teljesítése helye Magyarország, fordított adózás alkalmazandó'
    },
    
    paypalDetails: {
      transactionId: paypalInvoice.id,
      paypalInvoiceNumber: paypalInvoice.detail.invoice_number,
      status: paypalInvoice.status,
      links: paypalInvoice.links
    }
  };
}