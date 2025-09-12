// ASX Stock Data API Integration
// Using Alpha Vantage API for real-time stock data

const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY || 'demo';
const BASE_URL = 'https://www.alphavantage.co/query';

// Common ASX stocks for quick reference
export const POPULAR_ASX_STOCKS = [
  { code: 'CBA.AX', name: 'Commonwealth Bank of Australia', sector: 'Financials' },
  { code: 'BHP.AX', name: 'BHP Group Limited', sector: 'Materials' },
  { code: 'CSL.AX', name: 'CSL Limited', sector: 'Healthcare' },
  { code: 'WBC.AX', name: 'Westpac Banking Corporation', sector: 'Financials' },
  { code: 'ANZ.AX', name: 'Australia and New Zealand Banking Group', sector: 'Financials' },
  { code: 'NAB.AX', name: 'National Australia Bank Limited', sector: 'Financials' },
  { code: 'WES.AX', name: 'Wesfarmers Limited', sector: 'Consumer Discretionary' },
  { code: 'MQG.AX', name: 'Macquarie Group Limited', sector: 'Financials' },
  { code: 'TLS.AX', name: 'Telstra Corporation Limited', sector: 'Telecommunications' },
  { code: 'WOW.AX', name: 'Woolworths Group Limited', sector: 'Consumer Staples' },
  { code: 'FMG.AX', name: 'Fortescue Metals Group Ltd', sector: 'Materials' },
  { code: 'RIO.AX', name: 'Rio Tinto Limited', sector: 'Materials' },
  { code: 'TCL.AX', name: 'Transurban Group', sector: 'Industrials' },
  { code: 'COL.AX', name: 'Coles Group Limited', sector: 'Consumer Staples' },
  { code: 'GMG.AX', name: 'Goodman Group', sector: 'Real Estate' }
];

// Cache for stock data
const stockCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const searchASXStock = async (query) => {
  try {
    // First check popular stocks for quick matches
    const popularMatches = POPULAR_ASX_STOCKS.filter(stock => 
      stock.code.toLowerCase().includes(query.toLowerCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase())
    );

    if (popularMatches.length > 0 && query.length < 4) {
      return popularMatches.slice(0, 5);
    }

    // For demo purposes, return popular stocks if no API key
    if (API_KEY === 'demo') {
      return popularMatches.slice(0, 5);
    }

    // Use Alpha Vantage search endpoint
    const response = await fetch(
      `${BASE_URL}?function=SYMBOL_SEARCH&keywords=${query}&apikey=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to search stocks');
    }

    const data = await response.json();
    
    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }

    // Filter for ASX stocks only
    const asxStocks = data.bestMatches?.filter(stock => 
      stock['1. symbol'].includes('.AX')
    ).map(stock => ({
      code: stock['1. symbol'],
      name: stock['2. name'],
      type: stock['3. type'],
      region: stock['4. region']
    })) || [];

    return asxStocks.slice(0, 10);
  } catch (error) {
    console.error('Stock search error:', error);
    // Fallback to popular stocks
    return POPULAR_ASX_STOCKS.filter(stock => 
      stock.code.toLowerCase().includes(query.toLowerCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
  }
};

export const getStockPrice = async (symbol) => {
  try {
    // Check cache first
    const cacheKey = symbol;
    const cached = stockCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    // For demo purposes, return mock data if no API key
    if (API_KEY === 'demo') {
      const mockPrice = generateMockPrice(symbol);
      const result = {
        symbol,
        price: mockPrice,
        change: (Math.random() - 0.5) * 10,
        changePercent: (Math.random() - 0.5) * 5,
        timestamp: Date.now(),
        currency: 'AUD'
      };
      
      stockCache.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;
    }

    const response = await fetch(
      `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch stock price');
    }

    const data = await response.json();
    
    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }

    const quote = data['Global Quote'];
    if (!quote) {
      throw new Error('No quote data available');
    }

    const result = {
      symbol,
      price: parseFloat(quote['05. price']),
      change: parseFloat(quote['09. change']),
      changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
      timestamp: Date.now(),
      currency: 'AUD'
    };

    stockCache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  } catch (error) {
    console.error('Stock price error:', error);
    // Return mock data as fallback
    const mockPrice = generateMockPrice(symbol);
    return {
      symbol,
      price: mockPrice,
      change: (Math.random() - 0.5) * 10,
      changePercent: (Math.random() - 0.5) * 5,
      timestamp: Date.now(),
      currency: 'AUD',
      isDemo: true
    };
  }
};

export const getBatchStockPrices = async (symbols) => {
  try {
    const prices = await Promise.all(
      symbols.map(symbol => getStockPrice(symbol))
    );
    return prices;
  } catch (error) {
    console.error('Batch price fetch error:', error);
    throw error;
  }
};

// Generate realistic mock prices for demo
const generateMockPrice = (symbol) => {
  const basePrice = {
    'CBA.AX': 105.50,
    'BHP.AX': 45.20,
    'CSL.AX': 280.75,
    'WBC.AX': 22.85,
    'ANZ.AX': 26.40,
    'NAB.AX': 32.10,
    'WES.AX': 55.90,
    'MQG.AX': 175.30,
    'TLS.AX': 4.05,
    'WOW.AX': 37.80,
    'FMG.AX': 22.15,
    'RIO.AX': 118.90,
    'TCL.AX': 14.55,
    'COL.AX': 18.25,
    'GMG.AX': 21.70
  };

  const base = basePrice[symbol] || 50 + Math.random() * 100;
  const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
  return parseFloat((base * (1 + variation)).toFixed(2));
};

// Portfolio analysis utilities
export const calculatePortfolioValue = (holdings) => {
  return holdings.reduce((total, holding) => {
    return total + (holding.shares * holding.currentPrice);
  }, 0);
};

export const calculateTargetShares = (holding, targetAllocation, totalValue) => {
  const targetValue = totalValue * (targetAllocation / 100);
  return Math.floor(targetValue / holding.currentPrice);
};

export const calculateRebalanceActions = (portfolio, targetAllocations) => {
  const totalValue = calculatePortfolioValue(portfolio);
  const actions = [];

  portfolio.forEach(holding => {
    const currentValue = holding.shares * holding.currentPrice;
    const currentAllocation = (currentValue / totalValue) * 100;
    const targetAllocation = targetAllocations[holding.symbol] || 0;
    const targetValue = totalValue * (targetAllocation / 100);
    const targetShares = Math.floor(targetValue / holding.currentPrice);
    const shareDifference = targetShares - holding.shares;
    const valueDifference = shareDifference * holding.currentPrice;

    if (Math.abs(shareDifference) > 0) {
      actions.push({
        symbol: holding.symbol,
        name: holding.name,
        action: shareDifference > 0 ? 'BUY' : 'SELL',
        shares: Math.abs(shareDifference),
        value: Math.abs(valueDifference),
        currentShares: holding.shares,
        targetShares,
        currentAllocation: currentAllocation.toFixed(2),
        targetAllocation: targetAllocation.toFixed(2),
        price: holding.currentPrice
      });
    }
  });

  return actions.sort((a, b) => b.value - a.value);
};