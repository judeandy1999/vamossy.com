import { authenticate } from '@/lib/authMiddleware';

export default async function handler(req, res) {
  if (!authenticate(req, res)) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { currency = 'USD' } = req.query;

  try {
    const today = new Date().toISOString().split('T')[0];
    
    // MNB API endpoint
    const url = `https://www.mnb.hu/arfolyamok.asmx/GetExchangeRates?startDate=${today}&endDate=${today}&currencyNames=${currency}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/xml,application/xml,application/xhtml+xml,text/html;q=0.9,text/plain;q=0.8,image/png,*/*;q=0.5',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const xmlText = await response.text();
    
    // Parse XML to extract the rate
    const rateMatch = xmlText.match(/<Rate unit="1" curr="USD">([\d.,]+)<\/Rate>/);
    const rate = rateMatch ? parseFloat(rateMatch[1].replace(',', '.')) : null;
    
    if (!rate) {
      // Try previous day
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      const fallbackUrl = `https://www.mnb.hu/arfolyamok.asmx/GetExchangeRates?startDate=${yesterdayStr}&endDate=${yesterdayStr}&currencyNames=${currency}`;
      const fallbackResponse = await fetch(fallbackUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        }
      });

      if (fallbackResponse.ok) {
        const fallbackXmlText = await fallbackResponse.text();
        const fallbackRateMatch = fallbackXmlText.match(/<Rate unit="1" curr="USD">([\d.,]+)<\/Rate>/);
        const fallbackRate = fallbackRateMatch ? parseFloat(fallbackRateMatch[1].replace(',', '.')) : 380;
        
        return res.status(200).json({
          success: true,
          data: {
            rate: fallbackRate,
            date: yesterdayStr,
            source: 'MNB (previous day)',
            isFallback: true
          }
        });
      }
      
      // Ultimate fallback
      return res.status(200).json({
        success: true,
        data: {
          rate: 380,
          date: today,
          source: 'Default fallback rate',
          isFallback: true,
          error: 'No rate available from MNB'
        }
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        rate,
        date: today,
        source: 'MNB (Magyar Nemzeti Bank)',
        isFallback: false
      }
    });

  } catch (error) {
    console.error('Error fetching MNB exchange rate:', error);
    
    // Return fallback rate on error
    res.status(200).json({
      success: true,
      data: {
        rate: 380,
        date: new Date().toISOString().split('T')[0],
        source: 'Default fallback rate',
        isFallback: true,
        error: error.message
      }
    });
  }
}