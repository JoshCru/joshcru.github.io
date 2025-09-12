// Portfolio Storage Management
// Handles local storage and portfolio data persistence

const STORAGE_KEYS = {
  PORTFOLIOS: 'asx_portfolios',
  CURRENT_PORTFOLIO: 'current_portfolio_id',
  SETTINGS: 'rebalance_settings',
  PRICE_HISTORY: 'price_history'
};

// Default settings
const DEFAULT_SETTINGS = {
  autoRefresh: true,
  refreshInterval: 300000, // 5 minutes
  currency: 'AUD',
  theme: 'light',
  notifications: {
    rebalanceAlerts: true,
    priceAlerts: false,
    dailySummary: false
  },
  rebalanceThreshold: 5, // Percent deviation before suggesting rebalance
  dividendTracking: true
};

// Portfolio Management
export const createPortfolio = (name, description = '') => {
  const portfolio = {
    id: generateId(),
    name,
    description,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    holdings: [],
    targetAllocations: {},
    totalInvested: 0,
    performance: {
      totalValue: 0,
      totalGainLoss: 0,
      totalGainLossPercent: 0,
      dayChange: 0,
      dayChangePercent: 0
    },
    history: []
  };

  const portfolios = getPortfolios();
  portfolios.push(portfolio);
  savePortfolios(portfolios);
  setCurrentPortfolio(portfolio.id);
  
  return portfolio;
};

export const getPortfolios = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PORTFOLIOS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading portfolios:', error);
    return [];
  }
};

export const savePortfolios = (portfolios) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PORTFOLIOS, JSON.stringify(portfolios));
    return true;
  } catch (error) {
    console.error('Error saving portfolios:', error);
    return false;
  }
};

export const getPortfolio = (id) => {
  const portfolios = getPortfolios();
  return portfolios.find(p => p.id === id);
};

export const updatePortfolio = (portfolioId, updates) => {
  const portfolios = getPortfolios();
  const index = portfolios.findIndex(p => p.id === portfolioId);
  
  if (index !== -1) {
    portfolios[index] = {
      ...portfolios[index],
      ...updates,
      updatedAt: Date.now()
    };
    savePortfolios(portfolios);
    return portfolios[index];
  }
  return null;
};

export const deletePortfolio = (portfolioId) => {
  const portfolios = getPortfolios();
  const filtered = portfolios.filter(p => p.id !== portfolioId);
  savePortfolios(filtered);
  
  // If deleted portfolio was current, set first available as current
  if (getCurrentPortfolioId() === portfolioId) {
    const newCurrent = filtered.length > 0 ? filtered[0].id : null;
    setCurrentPortfolio(newCurrent);
  }
  
  return true;
};

// Current Portfolio Management
export const getCurrentPortfolioId = () => {
  return localStorage.getItem(STORAGE_KEYS.CURRENT_PORTFOLIO);
};

export const setCurrentPortfolio = (portfolioId) => {
  if (portfolioId) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_PORTFOLIO, portfolioId);
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_PORTFOLIO);
  }
};

export const getCurrentPortfolio = () => {
  const currentId = getCurrentPortfolioId();
  return currentId ? getPortfolio(currentId) : null;
};

// Holdings Management
export const addHolding = (portfolioId, holding) => {
  const portfolio = getPortfolio(portfolioId);
  if (!portfolio) return null;

  const newHolding = {
    id: generateId(),
    symbol: holding.symbol,
    name: holding.name,
    shares: holding.shares,
    averagePrice: holding.averagePrice,
    currentPrice: holding.currentPrice || holding.averagePrice,
    sector: holding.sector || 'Unknown',
    addedAt: Date.now(),
    totalInvested: holding.shares * holding.averagePrice,
    currentValue: holding.shares * (holding.currentPrice || holding.averagePrice)
  };

  portfolio.holdings.push(newHolding);
  portfolio.totalInvested += newHolding.totalInvested;
  
  return updatePortfolio(portfolioId, portfolio);
};

export const updateHolding = (portfolioId, holdingId, updates) => {
  const portfolio = getPortfolio(portfolioId);
  if (!portfolio) return null;

  const holdingIndex = portfolio.holdings.findIndex(h => h.id === holdingId);
  if (holdingIndex === -1) return null;

  const oldHolding = portfolio.holdings[holdingIndex];
  const updatedHolding = { ...oldHolding, ...updates };
  
  // Recalculate values
  updatedHolding.totalInvested = updatedHolding.shares * updatedHolding.averagePrice;
  updatedHolding.currentValue = updatedHolding.shares * updatedHolding.currentPrice;
  
  portfolio.holdings[holdingIndex] = updatedHolding;
  
  // Recalculate portfolio total invested
  portfolio.totalInvested = portfolio.holdings.reduce(
    (total, h) => total + h.totalInvested, 0
  );
  
  return updatePortfolio(portfolioId, portfolio);
};

export const removeHolding = (portfolioId, holdingId) => {
  const portfolio = getPortfolio(portfolioId);
  if (!portfolio) return null;

  const holding = portfolio.holdings.find(h => h.id === holdingId);
  if (holding) {
    portfolio.holdings = portfolio.holdings.filter(h => h.id !== holdingId);
    portfolio.totalInvested -= holding.totalInvested;
    
    // Remove from target allocations if exists
    delete portfolio.targetAllocations[holding.symbol];
  }
  
  return updatePortfolio(portfolioId, portfolio);
};

// Target Allocations
export const setTargetAllocation = (portfolioId, symbol, percentage) => {
  const portfolio = getPortfolio(portfolioId);
  if (!portfolio) return null;

  portfolio.targetAllocations[symbol] = percentage;
  return updatePortfolio(portfolioId, portfolio);
};

export const setTargetAllocations = (portfolioId, allocations) => {
  const portfolio = getPortfolio(portfolioId);
  if (!portfolio) return null;

  portfolio.targetAllocations = { ...allocations };
  return updatePortfolio(portfolioId, portfolio);
};

// Settings Management
export const getSettings = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Error loading settings:', error);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings) => {
  try {
    const mergedSettings = { ...getSettings(), ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(mergedSettings));
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};

// Price History
export const savePriceHistory = (symbol, price, timestamp = Date.now()) => {
  try {
    const history = getPriceHistory();
    if (!history[symbol]) {
      history[symbol] = [];
    }
    
    history[symbol].push({ price, timestamp });
    
    // Keep only last 100 data points per symbol
    if (history[symbol].length > 100) {
      history[symbol] = history[symbol].slice(-100);
    }
    
    localStorage.setItem(STORAGE_KEYS.PRICE_HISTORY, JSON.stringify(history));
    return true;
  } catch (error) {
    console.error('Error saving price history:', error);
    return false;
  }
};

export const getPriceHistory = (symbol = null) => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PRICE_HISTORY);
    const history = stored ? JSON.parse(stored) : {};
    return symbol ? (history[symbol] || []) : history;
  } catch (error) {
    console.error('Error loading price history:', error);
    return symbol ? [] : {};
  }
};

// Portfolio Analytics
export const calculatePortfolioPerformance = (portfolio, currentPrices) => {
  if (!portfolio.holdings.length) {
    return {
      totalValue: 0,
      totalGainLoss: 0,
      totalGainLossPercent: 0,
      dayChange: 0,
      dayChangePercent: 0
    };
  }

  let totalCurrentValue = 0;
  let totalInvested = 0;
  let dayChange = 0;

  portfolio.holdings.forEach(holding => {
    const currentPrice = currentPrices[holding.symbol] || holding.currentPrice;
    const currentValue = holding.shares * currentPrice;
    const investedValue = holding.shares * holding.averagePrice;
    
    totalCurrentValue += currentValue;
    totalInvested += investedValue;
    
    // Day change calculation (simplified - would need previous day prices)
    const priceHistory = getPriceHistory(holding.symbol);
    if (priceHistory.length > 1) {
      const yesterdayPrice = priceHistory[priceHistory.length - 2].price;
      dayChange += holding.shares * (currentPrice - yesterdayPrice);
    }
  });

  const totalGainLoss = totalCurrentValue - totalInvested;
  const totalGainLossPercent = totalInvested > 0 ? (totalGainLoss / totalInvested) * 100 : 0;
  const dayChangePercent = totalCurrentValue > 0 ? (dayChange / totalCurrentValue) * 100 : 0;

  return {
    totalValue: totalCurrentValue,
    totalGainLoss,
    totalGainLossPercent,
    dayChange,
    dayChangePercent
  };
};

// Export/Import Functions
export const exportPortfolio = (portfolioId) => {
  const portfolio = getPortfolio(portfolioId);
  if (!portfolio) return null;

  const exportData = {
    portfolio,
    exportedAt: Date.now(),
    version: '1.0'
  };

  return JSON.stringify(exportData, null, 2);
};

export const importPortfolio = (jsonData) => {
  try {
    const data = JSON.parse(jsonData);
    const portfolio = data.portfolio;
    
    // Generate new ID to avoid conflicts
    portfolio.id = generateId();
    portfolio.name = `${portfolio.name} (Imported)`;
    portfolio.createdAt = Date.now();
    portfolio.updatedAt = Date.now();
    
    const portfolios = getPortfolios();
    portfolios.push(portfolio);
    savePortfolios(portfolios);
    
    return portfolio;
  } catch (error) {
    console.error('Error importing portfolio:', error);
    throw new Error('Invalid portfolio data');
  }
};

// Utility Functions
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Demo Data Creation
export const createDemoPortfolio = () => {
  const demoPortfolio = createPortfolio(
    'Demo ASX Portfolio',
    'A sample portfolio showing common ASX stocks'
  );

  // Add some demo holdings
  const demoHoldings = [
    { symbol: 'CBA.AX', name: 'Commonwealth Bank', shares: 100, averagePrice: 98.50, currentPrice: 105.50, sector: 'Financials' },
    { symbol: 'BHP.AX', name: 'BHP Group', shares: 200, averagePrice: 42.30, currentPrice: 45.20, sector: 'Materials' },
    { symbol: 'CSL.AX', name: 'CSL Limited', shares: 50, averagePrice: 275.00, currentPrice: 280.75, sector: 'Healthcare' },
    { symbol: 'WBC.AX', name: 'Westpac Banking', shares: 300, averagePrice: 21.80, currentPrice: 22.85, sector: 'Financials' },
    { symbol: 'TLS.AX', name: 'Telstra Corporation', shares: 500, averagePrice: 3.90, currentPrice: 4.05, sector: 'Telecommunications' }
  ];

  demoHoldings.forEach(holding => {
    addHolding(demoPortfolio.id, holding);
  });

  // Set target allocations
  setTargetAllocations(demoPortfolio.id, {
    'CBA.AX': 25,
    'BHP.AX': 20,
    'CSL.AX': 20,
    'WBC.AX': 20,
    'TLS.AX': 15
  });

  return demoPortfolio;
};