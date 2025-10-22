import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingDown, TrendingUp, Target, AlertCircle, CheckCircle2, Printer, Download } from 'lucide-react';

const API_URL = 'https://script.google.com/macros/s/AKfycbxO6lmAQfW8hLvxYqCY_9HSBIHmlNkvCykLRVDk-DbVbBX4AmGzVwP1_hPWXw6cMjc/exec';


const ProfitabilityAuditDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const row = urlParams.get('row');
        const client = urlParams.get('client');
        
        let fetchUrl = API_URL;
        if (client) {
          fetchUrl += `?client=${client}`;
        } else if (row) {
          fetchUrl += `?row=${row}`;
        }
        
        const response = await fetch(fetchUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.error) {
          throw new Error(result.error);
        }
        
        setData(result);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert('PDF download functionality coming soon!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your audit...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error loading data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const formatCurrency = (value) => {
    if (!value && value !== 0) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return 'N/A';
    const date = new Date(dateValue);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Profitability Audit
              </h1>
              <p className="text-lg text-gray-600">{data.businessName}</p>
              <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                <span>📅</span>
                {formatDate(data.auditDate)}
              </p>
            </div>
            <div className="flex gap-3">
              <div className="text-right bg-green-50 px-6 py-4 rounded-xl border-2 border-green-200">
                <p className="text-sm font-medium text-green-700 uppercase tracking-wide mb-1">
                  Total Opportunity
                </p>
                <p className="text-3xl font-bold text-green-700">
                  {formatCurrency(data.totalImpact)}
                </p>
                <p className="text-xs text-green-600 mt-1">per year</p>
              </div>
              <button
                onClick={handlePrint}
                className="bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 transition-colors print:hidden h-fit"
                title="Download PDF"
              >
                <Printer className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Line Up Front */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-6 sm:p-8 mb-6 text-white">
          <div className="flex items-start gap-4">
            <div className="bg-white/20 p-3 rounded-xl">
              <Target className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">Bottom Line Up Front</h2>
              <p className="text-lg leading-relaxed">
                You have <span className="font-bold text-white">{formatCurrency(data.totalImpact)}</span> in annual profit sitting on the table. 
                {data.profitMargin > 50 ? (
                  <span> With your excellent {data.profitMargin.toFixed(1)}% margin, these strategic optimizations will unlock even more profit potential.</span>
                ) : (
                  <span> With the right moves, we can increase your profit margin from{' '}
                  <span className="font-bold text-white">{data.profitMargin.toFixed(1)}%</span> to{' '}
                  <span className="font-bold text-white">{data.targetMargin}%</span> in 90 days.</span>
                )}
              </p>
              
              {data.actions && data.actions.length > 0 && (
                <div className="mt-6 space-y-3">
                  {data.actions.slice(0, 1).map((action, idx) => (
                    <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-100 mb-1">Action {action.step}</p>
                          <p className="text-xl font-semibold">{action.savings}</p>
                          <p className="text-blue-100 mt-1">{action.title}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Financial Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Current Revenue</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(data.revenue)}</p>
            <p className="text-xs text-gray-500 mt-1">Monthly</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-red-100 p-2 rounded-lg">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Total Costs</p>
            </div>
            <p className="text-3xl font-bold text-gray-900">{formatCurrency(data.totalCosts)}</p>
            <p className="text-xs text-gray-500 mt-1">Monthly</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Current Profit</p>
            </div>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(data.netProfit)}</p>
            <p className="text-sm font-semibold text-green-600 mt-1">{data.profitMargin.toFixed(1)}% margin</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <Target className="w-5 h-5 text-orange-600" />
              </div>
              <p className="text-sm font-medium text-gray-600">Potential Profit</p>
            </div>
            <p className="text-3xl font-bold text-orange-600">{formatCurrency(data.netProfit + (data.totalImpact / 12))}</p>
            <p className="text-sm font-semibold text-orange-600 mt-1">{data.targetMargin}% margin</p>
          </div>
        </div>

        {/* What We Found */}
        {data.findings && data.findings.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900">What We Found</h2>
            </div>
            
            <div className="space-y-4">
              {data.findings.map((finding, idx) => (
                <div 
                  key={idx}
                  className={`border-l-4 p-5 rounded-r-xl ${
                    finding.type === 'success' 
                      ? 'bg-green-50 border-green-500' 
                      : finding.type === 'warning'
                      ? 'bg-yellow-50 border-yellow-500'
                      : 'bg-red-50 border-red-500'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 ${
                      finding.type === 'success' ? 'text-green-600' : 
                      finding.type === 'warning' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {finding.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{finding.title}</h3>
                      <p className="text-gray-700 mb-2">{finding.description}</p>
                      <p className="text-sm text-gray-600">{finding.impact}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {['overview', 'costs', 'services', 'actions'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Financial Overview</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.revenue)}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Monthly Costs</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.totalCosts)}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-700 mb-1">Net Profit</p>
                      <p className="text-2xl font-bold text-green-700">{formatCurrency(data.netProfit)}</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-700 mb-1">Profit Margin</p>
                      <p className="text-2xl font-bold text-blue-700">{data.profitMargin.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'costs' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Where Money Goes</h3>
                <div className="space-y-3">
                  {Object.entries(data.costs).map(([key, value]) => {
                    const percentage = data.revenue > 0 ? (value / data.revenue * 100).toFixed(1) : 0;
                    return (
                      <div key={key} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-700 capitalize">
                            {key === 'rentUtilities' ? 'Rent & Utilities' : key}
                          </span>
                          <span className="font-bold text-gray-900">{formatCurrency(value)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{percentage}% of revenue</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Service Profitability</h3>
                <div className="space-y-4">
                  {data.services.map((service, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-xl p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 mb-1">{service.name}</h4>
                          <p className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            service.status === 'excellent' ? 'bg-green-100 text-green-700' :
                            service.status === 'good' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {service.margin.toFixed(1)}% margin
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">{formatCurrency(service.revenue)}</p>
                          <p className="text-sm text-gray-500">monthly revenue</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Cost</p>
                          <p className="text-lg font-bold text-gray-900">{formatCurrency(service.cost)}</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-xs text-green-700 mb-1">Profit</p>
                          <p className="text-lg font-bold text-green-700">{formatCurrency(service.revenue - service.cost)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'actions' && (
              <div>
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-green-900 mb-1">Total Opportunity</h3>
                      <p className="text-sm text-green-700">Combined annual impact of all recommended actions</p>
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-bold text-green-700">{formatCurrency(data.totalImpact)}</p>
                      <p className="text-sm text-green-600 mt-1">per year</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {data.actions && data.actions.length > 0 ? (
                    data.actions.map((action, idx) => (
                      <div key={idx} className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                            {action.step}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-gray-900 mb-2">{action.title}</h4>
                            <p className="text-gray-600 mb-3">{action.description}</p>
                            <div className="flex flex-wrap gap-3 mb-4">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                action.effort === 'Low' ? 'bg-green-100 text-green-700' :
                                action.effort === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {action.effort} Effort
                              </span>
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                                {action.timeframe}
                              </span>
                              <span className="px-4 py-1 bg-green-600 text-white rounded-full text-sm font-bold">
                                {action.savings}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {action.implementation && action.implementation.length > 0 && (
                          <div className="bg-gray-50 rounded-lg p-4 mt-4">
                            <p className="font-semibold text-gray-900 mb-3">Implementation Steps:</p>
                            <div className="space-y-2">
                              {action.implementation.map((step, stepIdx) => (
                                <div key={stepIdx} className="flex items-start gap-3">
                                  <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                    {stepIdx + 1}
                                  </div>
                                  <p className="text-gray-700 flex-1">{step}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <p>No action items available. Run the AI recommendation generator to create personalized actions.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
          <p className="text-gray-600">
            This audit was prepared by <span className="font-bold text-gray-900">Flexpoint Bookkeeping</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            For questions or to schedule a follow-up consultation, visit book.flexpointbookkeeping.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfitabilityAuditDashboard;