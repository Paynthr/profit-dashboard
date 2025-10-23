import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, AlertCircle, CheckCircle, Target, BarChart3 } from 'lucide-react';

export default function ProfitabilityAuditDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const rowNumber = urlParams.get('row');
        
        let url = 'https://script.google.com/macros/s/AKfycbxO6lmAQfW8hLvxYqCY_9HSBIHmlNkvCykLRVDk-DbVbBX4AmGzVwP1_hPWXw6cMjc/exec';
        
        if (rowNumber) {
          url += `?row=${rowNumber}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch data');
        
        const result = await response.json();
        
        if (result.error) {
          throw new Error(result.message || result.error);
        }
        
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value) => {
    return `${value.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading your profit analysis...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">Error loading data</h2>
          <p className="text-slate-600 text-center mb-4">{error || 'No data available'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const getHealthColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthBgColor = (score) => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const getHealthLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Attention';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header with Full Flexpoint Logo */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <img 
              src="/flexpoint-logo.jpg" 
              alt="Flexpoint Bookkeeping" 
              className="h-16"
            />
            <div>
              <h1 className="text-2xl font-bold text-slate-800 text-right">Profitability Audit</h1>
              <p className="text-sm text-slate-600 text-right">Comprehensive Financial Analysis</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Company Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-6">
          <h2 className="text-4xl font-bold text-slate-900 mb-2">{data.companyName}</h2>
          <p className="text-slate-600 text-lg">Your path to {formatCurrency(data.totalOpportunity)} in additional annual profit</p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-600 font-semibold text-sm uppercase tracking-wide">Annual Revenue</span>
              <div className="bg-blue-100 rounded-lg p-2">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">{formatCurrency(data.revenue)}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-600 font-semibold text-sm uppercase tracking-wide">Total Expenses</span>
              <div className="bg-orange-100 rounded-lg p-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">{formatCurrency(data.expenses)}</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-600 font-semibold text-sm uppercase tracking-wide">Current Profit</span>
              <div className="bg-green-100 rounded-lg p-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">{formatCurrency(data.netProfit)}</p>
            <p className="text-sm text-slate-600 mt-2 font-medium">{formatPercent(data.currentMargin)} margin</p>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-semibold text-sm uppercase tracking-wide">Potential Profit</span>
              <div className="bg-white/20 rounded-lg p-2">
                <Target className="h-5 w-5 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-white">{formatCurrency(data.potentialProfit)}</p>
            <p className="text-sm text-blue-100 mt-2 font-medium">{formatPercent(data.targetMargin)} target margin</p>
          </div>
        </div>

        {/* Profit Opportunity Banner */}
        {data.profitIncrease > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-8 mb-8 shadow-sm">
            <div className="flex items-start gap-6">
              <div className="bg-green-600 rounded-full p-4 flex-shrink-0">
                <TrendingUp className="h-10 w-10 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-slate-900 mb-3">
                  Unlock {formatCurrency(data.profitIncrease)} in Additional Annual Profit
                </h3>
                <p className="text-slate-700 text-lg leading-relaxed">
                  We've identified strategic opportunities to increase your profit margin from {formatPercent(data.currentMargin)} to {formatPercent(data.targetMargin)}. These improvements are achievable within 90 days.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Financial Health Check */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 rounded-lg p-2">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Financial Health Check</h3>
          </div>
          
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-semibold text-slate-700">Overall Health Score</span>
              <span className={`text-3xl font-bold ${getHealthColor(data.healthScore)}`}>
                {data.healthScore}/100
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-6">
              <div 
                className={`h-6 rounded-full transition-all duration-1000 ${getHealthBgColor(data.healthScore)}`}
                style={{ width: `${data.healthScore}%` }}
              ></div>
            </div>
            <p className="text-sm text-slate-600 mt-2">{getHealthLabel(data.healthScore)} financial performance</p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900 text-lg mb-4">Key Findings:</h4>
            {data.findings.map((finding, index) => (
              <div key={index} className="flex items-start gap-4 bg-slate-50 rounded-lg p-5 border border-slate-100">
                <CheckCircle className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-slate-700 leading-relaxed">{finding}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Where Your Money Goes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(data.costs).map(([key, value]) => {
              const percentage = data.revenue > 0 ? (value / data.revenue) * 100 : 0;
              const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              
              return (
                <div key={key} className="bg-slate-50 rounded-lg p-5 border border-slate-100">
                  <p className="text-sm text-slate-600 font-semibold mb-2 uppercase tracking-wide">{label}</p>
                  <p className="text-2xl font-bold text-slate-900 mb-1">{formatCurrency(value)}</p>
                  <p className="text-sm text-slate-500">{formatPercent(percentage)} of revenue</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Service Performance */}
        {data.services.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">Service Profitability Analysis</h3>
            <div className="space-y-5">
              {data.services.map((service, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-bold text-slate-900">{service.name}</h4>
                    <span className={`px-4 py-2 rounded-lg text-sm font-bold ${
                      service.status === 'excellent' ? 'bg-green-100 text-green-800' :
                      service.status === 'good' ? 'bg-blue-100 text-blue-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {formatPercent(service.margin)} margin
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-slate-600 font-semibold mb-1">Revenue</p>
                      <p className="text-xl font-bold text-slate-900">{formatCurrency(service.revenue)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 font-semibold mb-1">Cost</p>
                      <p className="text-xl font-bold text-slate-900">{formatCurrency(service.cost)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Plan */}
        {data.actions.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Your Strategic Action Plan</h3>
            <p className="text-slate-600 mb-8 text-lg">Implement these changes to unlock {formatCurrency(data.totalOpportunity)} in annual profit</p>
            
            <div className="space-y-6">
              {data.actions.map((action, index) => (
                <div key={index} className="border-l-4 border-blue-600 bg-blue-50 rounded-r-xl p-8 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex items-start gap-5 flex-1">
                      <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-slate-900 mb-3">{action.title}</h4>
                        <p className="text-slate-700 mb-4 leading-relaxed">{action.description}</p>
                        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-slate-200">
                          <span className="text-slate-600 text-sm">Timeline:</span>
                          <strong className="text-slate-900 text-sm">{action.timeline}</strong>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm text-slate-600 font-semibold mb-2">Annual Impact</p>
                      <p className="text-3xl font-bold text-green-600">{formatCurrency(action.impact)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-8 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-bold mb-2">Total Annual Opportunity</p>
                  <p className="text-sm opacity-90">Combined impact of all strategic actions</p>
                </div>
                <p className="text-5xl font-bold">{formatCurrency(data.totalOpportunity)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-lg p-10 text-center">
          <img 
            src="/flexpoint-logo.jpg" 
            alt="Flexpoint Bookkeeping" 
            className="h-12 mx-auto mb-6 brightness-0 invert opacity-90"
          />
          <h3 className="text-2xl font-bold text-white mb-3">Ready to Unlock Your Profit Potential?</h3>
          <p className="text-slate-300 mb-8 max-w-2xl mx-auto text-lg leading-relaxed">
            Partner with Flexpoint Bookkeeping to implement these strategic recommendations. We'll guide you through each step and ensure measurable results.
          </p>
          <a 
            href="https://www.flexpointbookkeeping.com/contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-lg transition-all hover:scale-105 shadow-lg text-lg"
          >
            Schedule Your Consultation
          </a>
          <p className="text-slate-400 text-sm mt-8">
            © {new Date().getFullYear()} Flexpoint Bookkeeping. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}