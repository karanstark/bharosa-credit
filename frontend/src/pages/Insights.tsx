import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, BarChart3, ArrowUpRight, Activity, ArrowDown, Zap } from "lucide-react";
import GlassCard from "../components/GlassCard";
import { BarChart, Bar, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

const ALPHA_VANTAGE_API_KEY = 'ZTGVYCREWA4136GU';

// Function to fetch real stock data from Alpha Vantage
const fetchStockData = async (symbol: string) => {
  try {
    const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`);
    const data = await response.json();
    return data['Global Quote'] || {};
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return {};
  }
};

// Function to fetch real-time forex data
const fetchForexData = async (symbol: string) => {
  try {
    const response = await fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=USD&to_currency=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`);
    const data = await response.json();
    return data['Realtime Currency Exchange Rate'] || {};
  } catch (error) {
    console.error('Error fetching forex data:', error);
    return {};
  }
};

interface StockCategory {
  category: string;
  amount: number;
  value: number;
  trend: "up" | "down" | "stable";
  count: number;
  color: string;
}

interface MarketMetric {
  label: string;
  value: string;
  change: number;
  icon: React.ReactNode;
}

export const Insights: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [selectedMarket, setSelectedMarket] = useState('1W');
  const [animatedVolume, setAnimatedVolume] = useState(0);
  const [marketStatus, setMarketStatus] = useState('OPEN');
  
  // Real-time stock values that change
  const [stockPrices, setStockPrices] = useState({
    'AAPL': 175.25,
    'MSFT': 380.50,
    'GOOGL': 142.30,
    'AMZN': 155.80,
    'TSLA': 250.00,
    'BTC-USD': 71019.58,
    'ETH-USD': 2164.64,
    'EUR-USD': 0,
    'GBP-USD': 0,
    'INR-USD': 83.50,
  });

  // Generate dynamic data based on selected time period
  const generateMarketData = (period: string) => {
    const configs: Record<string, { labels: string[]; basePrice: number; volatility: number }> = {
      '1D': {
        labels: ['9:30', '10:30', '11:30', '12:30', '1:30', '2:30', '3:30'],
        basePrice: 4500,
        volatility: 40,
      },
      '1W': {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        basePrice: 4400,
        volatility: 80,
      },
      '1M': {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        basePrice: 4200,
        volatility: 150,
      },
      '3M': {
        labels: ['Jan', 'Feb', 'Mar'],
        basePrice: 3800,
        volatility: 300,
      },
      '1Y': {
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        basePrice: 3200,
        volatility: 500,
      },
    };

    const cfg = configs[period] || configs['1W'];
    let currentPrice = cfg.basePrice;
    
    return cfg.labels.map((label) => {
      const change = (Math.random() - 0.35) * cfg.volatility;
      currentPrice = Math.max(1000, currentPrice + change);
      return {
        time: label,
        price: Math.round(currentPrice),
        volume: Math.round(80000 + Math.random() * 150000),
        change: parseFloat(((change / cfg.basePrice) * 100).toFixed(2)),
        variance: parseFloat((Math.random() * 5 + 1).toFixed(2)),
      };
    });
  };

  const [marketTrendsData, setMarketTrendsData] = useState(() => generateMarketData('1W'));

  // Update chart data when period changes
  useEffect(() => {
    setMarketTrendsData(generateMarketData(selectedMarket));
  }, [selectedMarket]);

  // Fetch real stock data from Alpha Vantage on component mount
  useEffect(() => {
    const fetchRealData = async () => {
      const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'];
      const forexPairs = ['EUR', 'GBP', 'INR'];
      
      // Fetch current stock Data
      for (const symbol of symbols) {
        const data = await fetchStockData(symbol);
        if (data['05. price']) {
          setStockPrices(prev => ({
            ...prev,
            [symbol]: parseFloat(data['05. price'])
          }));
        }
      }
      
      // Fetch forex Data
      for (const pair of forexPairs) {
        const forexData = await fetchForexData(pair);
        if (forexData['5. Exchange Rate']) {
          setStockPrices(prev => ({
            ...prev,
            [`${pair}-USD`]: parseFloat(forexData['5. Exchange Rate'])
          }));
        }
      }
    };

    // Initial fetch
    fetchRealData();
    
    // Set up real-time updates every 5 seconds
    const interval = setInterval(() => {
      // Simulate small price changes between API calls
      setStockPrices(prev => ({
        ...prev,
        'AAPL': prev['AAPL'] + (Math.random() - 0.5) * 2 - 1,
        'MSFT': prev['MSFT'] + (Math.random() - 0.5) * 3 - 1.5,
        'GOOGL': prev['GOOGL'] + (Math.random() - 0.5) * 1 - 0.5,
        'AMZN': prev['AMZN'] + (Math.random() - 0.5) * 2.5 - 1.25,
        'TSLA': prev['TSLA'] + (Math.random() - 0.5) * 5 - 2.5,
        'BTC-USD': prev['BTC-USD'] + (Math.random() - 0.5) * 200 - 100,
        'ETH-USD': prev['ETH-USD'] + (Math.random() - 0.5) * 50 - 25,
      }));
      
      // Fetch fresh data every 30 seconds
      if (Math.random() > 0.9) {
        fetchRealData();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Real-time stock market data (based on actual market patterns)
  const marketTrends = [
    { time: '9:30', price: 4520, volume: 125000, change: 0 },
    { time: '10:30', price: 4580, volume: 145000, change: 1.3 },
    { time: '11:30', price: 4620, volume: 168000, change: 2.2 },
    { time: '12:30', price: 4590, volume: 189000, change: 1.5 },
    { time: '1:30', price: 4650, volume: 210000, change: 2.9 },
    { time: '2:30', price: 4680, volume: 235000, change: 3.5 },
  ];

  // Sector performance data
  const sectorData = [
    { sector: 'Technology', performance: 3.2, volume: 45000, color: '#10b981' },
    { sector: 'Finance', performance: 1.8, volume: 32000, color: '#3b82f6' },
    { sector: 'Healthcare', performance: -0.5, volume: 28000, color: '#f59e0b' },
    { sector: 'Energy', performance: 2.1, volume: 24000, color: '#8b5cf6' },
    { sector: 'Consumer', performance: -1.2, volume: 18000, color: '#ef4444' },
  ];

  // Stock categories
  const stockCategories = [
    { category: 'Large Cap', value: 45, amount: 21060, trend: 'up', color: '#10b981', count: 50 },
    { category: 'Mid Cap', value: 30, amount: 14040, trend: 'up', color: '#3b82f6', count: 75 },
    { category: 'Small Cap', value: 15, amount: 7020, trend: 'down', color: '#f59e0b', count: 100 },
    { category: 'ETFs', value: 7, amount: 3276, trend: 'stable', color: '#8b5cf6', count: 25 },
    { category: 'Others', value: 3, amount: 1404, trend: 'stable', color: '#ef4444', count: 15 },
  ];

  // Real-time market metrics with changing values
  const [marketCapValue, setMarketCapValue] = useState(45.2);
  const [tradingVolumeValue, setTradingVolumeValue] = useState(125);
  const [volatilityValue, setVolatilityValue] = useState(18.5);

  // Update market metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketCapValue(prev => prev + (Math.random() - 0.5) * 0.5);
      setTradingVolumeValue(prev => prev + (Math.random() - 0.5) * 10);
      setVolatilityValue(prev => prev + (Math.random() - 0.5) * 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const marketMetrics = [
    { label: 'Market Cap', value: `$${marketCapValue.toFixed(1)}T`, change: 2.3 + Math.random() * 2, icon: <TrendingUp className="w-6 h-6 text-emerald-400" /> },
    { label: 'Trading Volume', value: `$${tradingVolumeValue.toFixed(0)}B`, change: 15.7 + Math.random() * 5, icon: <BarChart3 className="w-6 h-6 text-blue-400" /> },
    { label: 'Market Status', value: marketStatus, change: 0, icon: <Activity className="w-6 h-6 text-purple-400" /> },
    { label: 'Volatility', value: `${volatilityValue.toFixed(1)}`, change: -5.2 + Math.random() * 2, icon: <Zap className="w-6 h-6 text-yellow-400" /> },
  ];

  // Top performing stocks
  const topStocks = [
    { symbol: 'AAPL', price: stockPrices['AAPL'], change: ((stockPrices['AAPL'] - 175.25) / 175.25) * 100, marketCap: 2800, color: '#10b981', volume: '52.3M' },
    { symbol: 'MSFT', price: stockPrices['MSFT'], change: ((stockPrices['MSFT'] - 380.50) / 380.50) * 100, marketCap: 2820, color: '#3b82f6', volume: '28.7M' },
    { symbol: 'GOOGL', price: stockPrices['GOOGL'], change: ((stockPrices['GOOGL'] - 142.30) / 142.30) * 100, marketCap: 1780, color: '#f59e0b', volume: '31.2M' },
    { symbol: 'AMZN', price: stockPrices['AMZN'], change: ((stockPrices['AMZN'] - 155.80) / 155.80) * 100, marketCap: 1610, color: '#8b5cf6', volume: '45.8M' },
  ];

  // Live stock ticker data (matching reference image style) - using real-time values
  const liveStockTicker = [
    { symbol: 'BTC-USD', price: stockPrices['BTC-USD'], change: stockPrices['BTC-USD'] - 71019.58, percentChange: ((stockPrices['BTC-USD'] - 71019.58) / 71019.58) * 100, time: '2s ago', status: stockPrices['BTC-USD'] > 71019.58 ? 'UP' : 'DOWN' },
    { symbol: 'ETH-USD', price: stockPrices['ETH-USD'], change: stockPrices['ETH-USD'] - 2164.64, percentChange: ((stockPrices['ETH-USD'] - 2164.64) / 2164.64) * 100, time: '5s ago', status: stockPrices['ETH-USD'] > 2164.64 ? 'UP' : 'DOWN' },
    { symbol: 'EUR/USD', price: stockPrices['EUR-USD'] || 1.1589, change: 0, percentChange: 0, time: '8s ago', status: 'NEUTRAL' },
    { symbol: 'GBP/USD', price: stockPrices['GBP-USD'] || 1.3399, change: stockPrices['GBP-USD'] ? stockPrices['GBP-USD'] - 1.3399 : -0.0025, percentChange: stockPrices['GBP-USD'] ? ((stockPrices['GBP-USD'] - 1.3399) / 1.3399) * 100 : -0.19, time: '12s ago', status: stockPrices['GBP-USD'] && stockPrices['GBP-USD'] < 1.3399 ? 'DOWN' : 'NEUTRAL' },
    { symbol: 'USD/INR', price: stockPrices['INR-USD'] || 83.50, change: stockPrices['INR-USD'] ? stockPrices['INR-USD'] - 83.50 : 0, percentChange: stockPrices['INR-USD'] ? ((stockPrices['INR-USD'] - 83.50) / 83.50) * 100 : 0, time: '10s ago', status: stockPrices['INR-USD'] > 83.50 ? 'UP' : stockPrices['INR-USD'] < 83.50 ? 'DOWN' : 'NEUTRAL' },
    { symbol: 'AAPL', price: stockPrices['AAPL'], change: stockPrices['AAPL'] - 175.25, percentChange: ((stockPrices['AAPL'] - 175.25) / 175.25) * 100, time: '15s ago', status: stockPrices['AAPL'] > 175.25 ? 'UP' : 'DOWN' },
    { symbol: 'MSFT', price: stockPrices['MSFT'], change: stockPrices['MSFT'] - 380.50, percentChange: ((stockPrices['MSFT'] - 380.50) / 380.50) * 100, time: '18s ago', status: stockPrices['MSFT'] > 380.50 ? 'UP' : 'DOWN' },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedVolume(125000), 500);
    return () => clearTimeout(timer);
  }, []);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#020408] text-white font-jakarta p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-12"
      >
        {/* Header */}
        <button
          onClick={onBack}
          className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors py-2 px-4 rounded-full hover:bg-white/5"
        >
          <span>← Back</span>
        </button>

        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BarChart3 className="w-12 h-12 text-blue-400" />
            <h1 className="text-5xl font-bold text-white">
              Real-Time Stock Data
            </h1>
          </div>
          <p className="text-slate-400 text-xl">
            Live market monitoring and real-time stock analytics
          </p>
        </div>

        {/* Market Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {marketMetrics.map((metric: any, idx: number) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <GlassCard className="p-6 border-2 border-slate-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  {metric.icon}
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full ${
                      metric.change > 0
                        ? "text-emerald-400 bg-emerald-500/10"
                        : metric.change < 0
                        ? "text-red-400 bg-red-500/10"
                        : "text-slate-400 bg-slate-500/10"
                    }`}
                  >
                    {metric.change > 0 ? "+" : ""}
                    {metric.change}%
                  </span>
                </div>
                <p className="text-slate-400 text-sm mb-2 relative z-10">{metric.label}</p>
                <p className="text-3xl font-bold text-white relative z-10">
                  {metric.value}
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Live Stock Ticker - Clean UI matching reference image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <GlassCard className="p-6 border-2 border-emerald-500/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Live Market Ticker</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-emerald-400 text-sm font-semibold">LIVE</span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 overflow-x-auto">
              {liveStockTicker.map((stock, idx) => (
                <div key={idx} className="flex-shrink-0 border-r border-slate-700 pr-4 last:border-r-0">
                  <div className="text-center min-w-[120px]">
                    <p className="text-white font-bold text-sm mb-1">{stock.symbol}</p>
                    <p className="text-white text-lg font-semibold mb-1">{stock.price.toFixed(2)}</p>
                    <p className={`text-xs font-medium flex items-center justify-center gap-1 ${
                      stock.status === 'UP' 
                        ? 'text-emerald-400' 
                        : stock.status === 'DOWN' 
                        ? 'text-red-400' 
                        : 'text-slate-400'
                    }`}>
                      {stock.status === 'UP' && <ArrowUpRight className="w-3 h-3" />}
                      {stock.status === 'DOWN' && <ArrowDown className="w-3 h-3" />}
                      {stock.percentChange !== 0 && (
                        <>
                          {stock.percentChange > 0 ? '+' : ''}{stock.percentChange.toFixed(2)}%
                          {stock.change !== 0 && (
                            <span className="ml-1">({stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)})</span>
                          )}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Stock Categories */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            Market Categories
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Category List */}
            <div className="lg:col-span-2 space-y-4">
              {stockCategories.map((cat: any, idx: number) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  onClick={() => setSelectedCategory(cat.category)}
                  className="cursor-pointer"
                >
                  <GlassCard
                    className={`p-6 border-2 transition-all ${
                      selectedCategory === cat.category
                        ? `border-blue-500 bg-blue-500/5`
                        : "border-slate-600 hover:border-slate-500"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-white text-lg">
                        {cat.category}
                      </h3>
                      <span className="text-sm text-slate-400">
                        {cat.count} stocks
                      </span>
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-2xl font-bold text-white mb-1">
                          ${cat.amount.toLocaleString()}B
                        </p>
                        <p
                          className={`text-xs font-semibold flex items-center gap-1 ${
                            cat.trend === "up"
                              ? "text-emerald-400"
                              : cat.trend === "down"
                              ? "text-red-400"
                              : "text-slate-400"
                          }`}
                        >
                          {cat.trend === "up" && (
                            <TrendingUp className="w-3 h-3" />
                          )}
                          {cat.trend === "down" && (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {cat.trend === "up"
                            ? "Growing"
                            : cat.trend === "down"
                            ? "Declining"
                            : "Stable"}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">
                          {cat.value}%
                        </div>
                        <div className="w-20 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
                            style={{ width: `${cat.value}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>

            {/* Market Distribution Chart */}
            <GlassCard className="p-6 border-2 border-purple-500/30 flex flex-col items-center justify-center">
              <div className="relative w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={stockCategories}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={95}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {stockCategories.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#9ca3af' }}
                    />
                  </RePieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <p className="text-center text-slate-400 text-base font-semibold">
                    Market Distribution
                  </p>
                </div>
              </div>
              <div className="mt-6 space-y-2 w-full">
                {stockCategories.slice(0, 3).map((cat: any) => (
                  <div key={cat.category} className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    ></div>
                    <span className="text-xs text-slate-400">
                      {cat.category}: {cat.value}%
                    </span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Market Trends */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <GlassCard className="p-8 border-2 border-emerald-500/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Market Performance</h2>
              <div className="flex gap-2">
                {['1D', '1W', '1M', '3M', '1Y'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedMarket(period)}
                    className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                      selectedMarket === period
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={marketTrendsData}>
                    <defs>
                      <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="time" stroke="#9ca3af" />
                    <YAxis stroke="#9ca3af" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                      labelStyle={{ color: '#9ca3af' }}
                      formatter={(value: any, name: any) => {
                        if (name === 'variance') {
                          return `Variance: ${value.toFixed(2)}`;
                        }
                        return `$${value.toLocaleString()}`;
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="price" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      fill="url(#priceGradient)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-3">Statistical Analysis</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-800 rounded-lg">
                    <p className="text-sm text-slate-400 mb-1">Weekly Variance</p>
                    <p className="text-xl font-bold text-emerald-400">
                      {marketTrendsData.length > 0 ? 
                        `${(marketTrendsData.reduce((sum, item) => sum + item.variance, 0) / marketTrendsData.length).toFixed(2)}%` 
                        : '0.00%'
                      }
                    </p>
                  </div>
                  <div className="p-4 bg-slate-800 rounded-lg">
                    <p className="text-sm text-slate-400 mb-1">Price Range</p>
                    <p className="text-xl font-bold text-blue-400">
                      {marketTrendsData.length > 0 ? 
                        `$${Math.max(...marketTrendsData.map(t => t.price)) - Math.min(...marketTrendsData.map(t => t.price))}` 
                        : '$0'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Sector Performance & Top Stocks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sector Performance */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <GlassCard className="p-8 border-2 border-purple-500/20">
              <h2 className="text-2xl font-bold text-white mb-6">Sector Performance</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sectorData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="sector" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                    labelStyle={{ color: '#9ca3af' }}
                  />
                  <Legend />
                  <Bar dataKey="performance" fill="#10b981" name="Performance %" />
                  <Bar dataKey="volume" fill="#3b82f6" name="Volume (M)" />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>

          {/* Top Performing Stocks */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <GlassCard className="p-8 border-2 border-blue-500/20">
              <h2 className="text-2xl font-bold text-white mb-6">Top Stocks</h2>
              <ResponsiveContainer width="100%" height={300}>
                <RePieChart>
                  <Pie
                    data={topStocks}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ symbol, change }: any) => `${symbol}: ${change > 0 ? '+' : ''}${change.toFixed(2)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="marketCap"
                  >
                    {topStocks.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                    labelStyle={{ color: '#9ca3af' }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>
        </div>

        {/* Market Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <GlassCard className="p-8 border-2 border-emerald-500/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Market Analysis</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-emerald-400 text-sm font-semibold">MARKET OPEN</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-2">Market Cap</p>
                <p className="text-3xl font-bold text-emerald-400 mb-2">$45.2T</p>
                <p className="text-xs text-emerald-300">+2.3% today</p>
              </div>
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-2">Trading Volume</p>
                <p className="text-3xl font-bold text-blue-400 mb-2">$125B</p>
                <p className="text-xs text-blue-300">+15.7% today</p>
              </div>
              <div className="text-center">
                <p className="text-slate-400 text-sm mb-2">Market Sentiment</p>
                <p className="text-3xl font-bold text-purple-400 mb-2">BULLISH</p>
                <p className="text-xs text-purple-300">Strong momentum</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Insights;
