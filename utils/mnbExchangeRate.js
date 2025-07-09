export async function getMNBExchangeRate(currency = 'USD') {
  try {
    // Call our API endpoint instead of MNB directly
    const response = await fetch(`/api/mnb-exchange-rate?currency=${currency}`, {
      headers: {
        'x-internal-request': process.env.NEXT_PUBLIC_INTERNAL_API_KEY,
      },
    });
    
    if (!response.ok) {
      throw new Error(`API error! status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error || 'Failed to fetch exchange rate');
    }
  } catch (error) {
    console.error('Error fetching MNB exchange rate:', error);
    
    // Return default rate as fallback
    return {
      rate: 380,
      date: new Date().toISOString().split('T')[0],
      source: 'Default fallback rate',
      isFallback: true,
      error: error.message
    };
  }
}

export function convertUSDToHUF(usdAmount, exchangeRate) {
  return Math.round(usdAmount * exchangeRate);
}

export function formatHungarianCurrency(amount) {
  return new Intl.NumberFormat('hu-HU').format(amount);
}

// Alternative: Simpler exchange rate fetcher with known good rates
export function getEstimatedExchangeRate() {
  // You can update this periodically with current rates
  const estimatedRates = {
    '2025-07-07': 380,
    '2025-07-06': 379,
    '2025-07-05': 381,
  };
  
  const today = new Date().toISOString().split('T')[0];
  const rate = estimatedRates[today] || 380;
  
  return {
    rate,
    date: today,
    source: 'Estimated rate',
    isFallback: true
  };
}