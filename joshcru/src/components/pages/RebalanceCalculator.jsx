import { useState, useEffect, useCallback } from 'react';
import { 
  searchASXStock, 
  getStockPrice, 
  getBatchStockPrices, 
  calculateRebalanceActions
} from '../../utils/asxAPI';
import {
  createPortfolio,
  getPortfolios,
  getCurrentPortfolio,
  setCurrentPortfolio,
  addHolding,
  removeHolding,
  setTargetAllocations,
  calculatePortfolioPerformance,
  savePriceHistory,
  createDemoPortfolio,
  getSettings
} from '../../utils/portfolioStorage';

const RebalanceCalculator = () => {
  // Portfolio State
  const [portfolios, setPortfolios] = useState([]);
  const [currentPortfolio, setCurrentPortfolioState] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [targetAllocations, setTargetAllocationsState] = useState({});
  const [rebalanceActions, setRebalanceActions] = useState([]);
  
  // UI State
  const [activeTab, setActiveTab] = useState('portfolio');
  const [showAddHolding, setShowAddHolding] = useState(false);
  const [showCreatePortfolio, setShowCreatePortfolio] = useState(false);
  const [isLoadingPrices, setIsLoadingPrices] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Form State
  const [stockSearch, setStockSearch] = useState('');
  const [stockResults, setStockResults] = useState([]);
  const [newHolding, setNewHolding] = useState({
    symbol: '',
    name: '',
    shares: '',
    averagePrice: ''
  });
  const [newPortfolioName, setNewPortfolioName] = useState('');
  
  // Performance State
  const [performance, setPerformance] = useState({
    totalValue: 0,
    totalGainLoss: 0,
    totalGainLossPercent: 0,
    dayChange: 0,
    dayChangePercent: 0
  });

  const refreshPrices = useCallback(async (holdingsToUpdate = holdings) => {
    if (!holdingsToUpdate.length) return;
    
    setIsLoadingPrices(true);
    try {
      const symbols = holdingsToUpdate.map(h => h.symbol);
      const prices = await getBatchStockPrices(symbols);
      
      const priceMap = {};
      prices.forEach(price => {
        priceMap[price.symbol] = price.price;
        savePriceHistory(price.symbol, price.price);
      });
      
      // Update holdings with new prices
      const updatedHoldings = holdingsToUpdate.map(holding => ({
        ...holding,
        currentPrice: priceMap[holding.symbol] || holding.currentPrice,
        currentValue: holding.shares * (priceMap[holding.symbol] || holding.currentPrice)
      }));
      
      setHoldings(updatedHoldings);
      
      // Calculate performance
      const perf = calculatePortfolioPerformance(
        { ...currentPortfolio, holdings: updatedHoldings },
        priceMap
      );
      setPerformance(perf);
      
      // Calculate rebalance actions
      if (Object.keys(targetAllocations).length > 0) {
        const actions = calculateRebalanceActions(updatedHoldings, targetAllocations);
        setRebalanceActions(actions);
      }
      
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error refreshing prices:', error);
    } finally {
      setIsLoadingPrices(false);
    }
  }, [holdings, targetAllocations, currentPortfolio]);

  const loadPortfolio = useCallback((portfolio) => {
    setCurrentPortfolioState(portfolio);
    setCurrentPortfolio(portfolio.id);
    setHoldings(portfolio.holdings || []);
    setTargetAllocationsState(portfolio.targetAllocations || {});
    
    if (portfolio.holdings && portfolio.holdings.length > 0) {
      refreshPrices(portfolio.holdings);
    }
  }, [refreshPrices]);

  const loadPortfolios = useCallback(() => {
    const portfolioList = getPortfolios();
    setPortfolios(portfolioList);
    
    if (portfolioList.length === 0) {
      setShowCreatePortfolio(true);
    } else {
      const current = getCurrentPortfolio();
      if (current) {
        loadPortfolio(current);
      } else {
        loadPortfolio(portfolioList[0]);
      }
    }
  }, [loadPortfolio]);

  // Load portfolios on mount
  useEffect(() => {
    loadPortfolios();
  }, [loadPortfolios]);

  // Auto-refresh prices
  useEffect(() => {
    const settings = getSettings();
    if (settings.autoRefresh && currentPortfolio) {
      const interval = setInterval(() => {
        refreshPrices();
      }, settings.refreshInterval);
      return () => clearInterval(interval);
    }
  }, [currentPortfolio, refreshPrices]);

  const handleCreatePortfolio = () => {
    if (!newPortfolioName.trim()) return;
    
    createPortfolio(newPortfolioName);
    setNewPortfolioName('');
    setShowCreatePortfolio(false);
    loadPortfolios();
  };

  const handleCreateDemoPortfolio = () => {
    createDemoPortfolio();
    loadPortfolios();
    setShowCreatePortfolio(false);
  };

  const handleStockSearch = async (query) => {
    setStockSearch(query);
    if (query.length > 0) {
      try {
        const results = await searchASXStock(query);
        setStockResults(results);
      } catch (error) {
        console.error('Search error:', error);
        setStockResults([]);
      }
    } else {
      setStockResults([]);
    }
  };

  const selectStock = (stock) => {
    setNewHolding({
      ...newHolding,
      symbol: stock.code,
      name: stock.name
    });
    setStockSearch('');
    setStockResults([]);
  };

  const handleAddHolding = async () => {
    if (!newHolding.symbol || !newHolding.shares || !newHolding.averagePrice) return;
    
    try {
      // Get current price
      const priceData = await getStockPrice(newHolding.symbol);
      
      const holding = {
        ...newHolding,
        shares: parseInt(newHolding.shares),
        averagePrice: parseFloat(newHolding.averagePrice),
        currentPrice: priceData.price
      };
      
      addHolding(currentPortfolio.id, holding);
      
      setNewHolding({
        symbol: '',
        name: '',
        shares: '',
        averagePrice: ''
      });
      setShowAddHolding(false);
      loadPortfolios();
    } catch (error) {
      console.error('Error adding holding:', error);
    }
  };

  const handleRemoveHolding = (holdingId) => {
    removeHolding(currentPortfolio.id, holdingId);
    loadPortfolios();
  };

  const handleUpdateTargetAllocation = (symbol, percentage) => {
    const newAllocations = {
      ...targetAllocations,
      [symbol]: parseFloat(percentage) || 0
    };
    setTargetAllocationsState(newAllocations);
    setTargetAllocations(currentPortfolio.id, newAllocations);
    
    // Recalculate rebalance actions
    if (holdings.length > 0) {
      const actions = calculateRebalanceActions(holdings, newAllocations);
      setRebalanceActions(actions);
    }
  };

  const getTotalAllocation = () => {
    return Object.values(targetAllocations).reduce((sum, val) => sum + (val || 0), 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD'
    }).format(amount);
  };

  const formatPercent = (percent) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  const getSectorBreakdown = () => {
    const sectors = holdings.reduce((acc, holding) => {
      const sector = holding.sector || 'Unknown';
      const value = holding.shares * holding.currentPrice;
      acc[sector] = (acc[sector] || 0) + value;
      return acc;
    }, {});

    return Object.entries(sectors).map(([sector, value]) => ({
      sector,
      value,
      percentage: performance.totalValue > 0 ? (value / performance.totalValue) * 100 : 0
    }));
  };

  const getLargestHolding = () => {
    if (holdings.length === 0) return null;
    
    return holdings.reduce((max, holding) => {
      const value = holding.shares * holding.currentPrice;
      const maxValue = max.shares * max.currentPrice;
      return value > maxValue ? holding : max;
    });
  };

  if (portfolios.length === 0 && !showCreatePortfolio) {
    return (
      <div className="rebalance-container">
        <div className="empty-state">
          <div className="empty-state-content">
            <div className="empty-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>
            <h2>Welcome to ASX Portfolio Rebalancer</h2>
            <p>Create your first portfolio to start tracking and rebalancing your ASX investments</p>
            <div className="empty-actions">
              <button className="primary-button" onClick={() => setShowCreatePortfolio(true)}>
                Create Portfolio
              </button>
              <button className="secondary-button" onClick={handleCreateDemoPortfolio}>
                Try Demo Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rebalance-container">
      {/* Header */}
      <div className="rebalance-header">
        <div className="header-content">
          <h1>ASX Portfolio Rebalancer</h1>
          <p>Manage and rebalance your Australian stock investments</p>
        </div>
        
        <div className="header-actions">
          <select 
            value={currentPortfolio?.id || ''} 
            onChange={(e) => {
              const portfolio = portfolios.find(p => p.id === e.target.value);
              if (portfolio) loadPortfolio(portfolio);
            }}
            className="portfolio-selector"
          >
            {portfolios.map(portfolio => (
              <option key={portfolio.id} value={portfolio.id}>
                {portfolio.name}
              </option>
            ))}
          </select>
          
          <button 
            className="refresh-button"
            onClick={() => refreshPrices()}
            disabled={isLoadingPrices}
          >
            {isLoadingPrices ? 'Updating...' : 'Refresh Prices'}
          </button>
          
          <button 
            className="create-button"
            onClick={() => setShowCreatePortfolio(true)}
          >
            New Portfolio
          </button>
        </div>
      </div>

      {/* Performance Summary */}
      {currentPortfolio && (
        <div className="performance-summary">
          <div className="performance-card">
            <h3>Total Value</h3>
            <div className="performance-value">{formatCurrency(performance.totalValue)}</div>
          </div>
          <div className="performance-card">
            <h3>Total Gain/Loss</h3>
            <div className={`performance-value ${performance.totalGainLoss >= 0 ? 'positive' : 'negative'}`}>
              {formatCurrency(performance.totalGainLoss)}
              <span className="performance-percent">
                ({formatPercent(performance.totalGainLossPercent)})
              </span>
            </div>
          </div>
          <div className="performance-card">
            <h3>Day Change</h3>
            <div className={`performance-value ${performance.dayChange >= 0 ? 'positive' : 'negative'}`}>
              {formatCurrency(performance.dayChange)}
              <span className="performance-percent">
                ({formatPercent(performance.dayChangePercent)})
              </span>
            </div>
          </div>
          <div className="performance-card">
            <h3>Last Updated</h3>
            <div className="performance-value small">
              {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="tab-navigation">
        <button 
          className={`tab ${activeTab === 'portfolio' ? 'active' : ''}`}
          onClick={() => setActiveTab('portfolio')}
        >
          Portfolio
        </button>
        <button 
          className={`tab ${activeTab === 'allocations' ? 'active' : ''}`}
          onClick={() => setActiveTab('allocations')}
        >
          Target Allocations
        </button>
        <button 
          className={`tab ${activeTab === 'rebalance' ? 'active' : ''}`}
          onClick={() => setActiveTab('rebalance')}
        >
          Rebalance Actions
        </button>
        <button 
          className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'portfolio' && (
          <div className="portfolio-tab">
            <div className="section-header">
              <h2>Holdings</h2>
              <button 
                className="add-button"
                onClick={() => setShowAddHolding(true)}
              >
                Add Holding
              </button>
            </div>
            
            {holdings.length === 0 ? (
              <div className="empty-holdings">
                <p>No holdings yet. Add your first ASX stock to get started.</p>
              </div>
            ) : (
              <div className="holdings-table">
                <div className="table-header">
                  <div>Symbol</div>
                  <div>Name</div>
                  <div>Shares</div>
                  <div>Avg Price</div>
                  <div>Current Price</div>
                  <div>Current Value</div>
                  <div>Gain/Loss</div>
                  <div>Allocation</div>
                  <div>Actions</div>
                </div>
                
                {holdings.map(holding => {
                  const currentValue = holding.shares * holding.currentPrice;
                  const investedValue = holding.shares * holding.averagePrice;
                  const gainLoss = currentValue - investedValue;
                  const gainLossPercent = (gainLoss / investedValue) * 100;
                  const allocation = performance.totalValue > 0 ? (currentValue / performance.totalValue) * 100 : 0;
                  
                  return (
                    <div key={holding.id} className="table-row">
                      <div className="symbol">{holding.symbol}</div>
                      <div className="name">{holding.name}</div>
                      <div>{holding.shares.toLocaleString()}</div>
                      <div>{formatCurrency(holding.averagePrice)}</div>
                      <div>{formatCurrency(holding.currentPrice)}</div>
                      <div>{formatCurrency(currentValue)}</div>
                      <div className={gainLoss >= 0 ? 'positive' : 'negative'}>
                        {formatCurrency(gainLoss)}
                        <br />
                        <small>({formatPercent(gainLossPercent)})</small>
                      </div>
                      <div>{allocation.toFixed(1)}%</div>
                      <div>
                        <button 
                          className="remove-button"
                          onClick={() => handleRemoveHolding(holding.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'allocations' && (
          <div className="allocations-tab">
            <div className="section-header">
              <h2>Target Allocations</h2>
              <div className="allocation-summary">
                Total: {getTotalAllocation().toFixed(1)}%
                {getTotalAllocation() !== 100 && (
                  <span className="allocation-warning">
                    (Should equal 100%)
                  </span>
                )}
              </div>
            </div>
            
            {holdings.length === 0 ? (
              <div className="empty-allocations">
                <p>Add holdings first to set target allocations.</p>
              </div>
            ) : (
              <div className="allocations-grid">
                {holdings.map(holding => (
                  <div key={holding.id} className="allocation-card">
                    <div className="allocation-header">
                      <h3>{holding.symbol}</h3>
                      <span className="allocation-name">{holding.name}</span>
                    </div>
                    <div className="allocation-input-group">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={targetAllocations[holding.symbol] || ''}
                        onChange={(e) => handleUpdateTargetAllocation(holding.symbol, e.target.value)}
                        placeholder="0.0"
                        className="allocation-input"
                      />
                      <span className="allocation-unit">%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'rebalance' && (
          <div className="rebalance-tab">
            <div className="section-header">
              <h2>Rebalance Actions</h2>
              {rebalanceActions.length > 0 && (
                <div className="rebalance-summary">
                  {rebalanceActions.length} action{rebalanceActions.length !== 1 ? 's' : ''} needed
                </div>
              )}
            </div>
            
            {rebalanceActions.length === 0 ? (
              <div className="no-rebalance">
                {getTotalAllocation() === 100 ? (
                  <p>Your portfolio is balanced! No actions needed.</p>
                ) : (
                  <p>Set target allocations to see rebalancing recommendations.</p>
                )}
              </div>
            ) : (
              <div className="rebalance-actions">
                {rebalanceActions.map(action => (
                  <div key={action.symbol} className={`action-card ${action.action.toLowerCase()}`}>
                    <div className="action-header">
                      <h3>{action.symbol}</h3>
                      <div className={`action-badge ${action.action.toLowerCase()}`}>
                        {action.action}
                      </div>
                    </div>
                    <div className="action-details">
                      <div className="action-amount">
                        {action.shares.toLocaleString()} shares
                        <span className="action-value">({formatCurrency(action.value)})</span>
                      </div>
                      <div className="action-allocations">
                        <span className="current">Current: {action.currentAllocation}%</span>
                        <span className="arrow">→</span>
                        <span className="target">Target: {action.targetAllocation}%</span>
                      </div>
                      <div className="action-price">
                        @ {formatCurrency(action.price)} per share
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-tab">
            <div className="section-header">
              <h2>Portfolio Analytics</h2>
            </div>
            
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>Sector Allocation</h3>
                <div className="sector-breakdown">
                  {getSectorBreakdown().map(({sector, value, percentage}) => (
                    <div key={sector} className="sector-item">
                      <span className="sector-name">{sector}</span>
                      <span className="sector-value">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="analytics-card">
                <h3>Portfolio Metrics</h3>
                <div className="metrics-list">
                  <div className="metric">
                    <span>Number of Holdings</span>
                    <span>{holdings.length}</span>
                  </div>
                  <div className="metric">
                    <span>Largest Holding</span>
                    <span>
                      {(() => {
                        const largest = getLargestHolding();
                        if (!largest) return 'N/A';
                        const allocation = ((largest.shares * largest.currentPrice) / performance.totalValue) * 100;
                        return `${largest.symbol} (${allocation.toFixed(1)}%)`;
                      })()}
                    </span>
                  </div>
                  <div className="metric">
                    <span>Cash Balance</span>
                    <span>{formatCurrency(0)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreatePortfolio && (
        <div className="modal-overlay" onClick={() => setShowCreatePortfolio(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Portfolio</h2>
              <button className="close-button" onClick={() => setShowCreatePortfolio(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Portfolio Name</label>
                <input
                  type="text"
                  value={newPortfolioName}
                  onChange={(e) => setNewPortfolioName(e.target.value)}
                  placeholder="My ASX Portfolio"
                  className="form-input"
                />
              </div>
            </div>
            <div className="modal-actions">
              <button className="secondary-button" onClick={handleCreateDemoPortfolio}>
                Create Demo Portfolio
              </button>
              <button className="primary-button" onClick={handleCreatePortfolio}>
                Create Portfolio
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddHolding && (
        <div className="modal-overlay" onClick={() => setShowAddHolding(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Holding</h2>
              <button className="close-button" onClick={() => setShowAddHolding(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>ASX Stock</label>
                <div className="stock-search">
                  <input
                    type="text"
                    value={stockSearch}
                    onChange={(e) => handleStockSearch(e.target.value)}
                    placeholder="Search ASX stocks (e.g., CBA, BHP)"
                    className="form-input"
                  />
                  {stockResults.length > 0 && (
                    <div className="search-results">
                      {stockResults.map(stock => (
                        <div 
                          key={stock.code} 
                          className="search-result"
                          onClick={() => selectStock(stock)}
                        >
                          <span className="result-symbol">{stock.code}</span>
                          <span className="result-name">{stock.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {newHolding.symbol && (
                  <div className="selected-stock">
                    Selected: {newHolding.symbol} - {newHolding.name}
                  </div>
                )}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Shares</label>
                  <input
                    type="number"
                    value={newHolding.shares}
                    onChange={(e) => setNewHolding({...newHolding, shares: e.target.value})}
                    placeholder="100"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Average Price (AUD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newHolding.averagePrice}
                    onChange={(e) => setNewHolding({...newHolding, averagePrice: e.target.value})}
                    placeholder="25.50"
                    className="form-input"
                  />
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="secondary-button" onClick={() => setShowAddHolding(false)}>
                Cancel
              </button>
              <button className="primary-button" onClick={handleAddHolding}>
                Add Holding
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RebalanceCalculator;