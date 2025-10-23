import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Target, PieChart, BarChart3, Calendar } from 'lucide-react';

const ProfitabilityAuditReport = () => {
  const [activeTab, setActiveTab] = useState('overview');
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

  // Convert API data to expense breakdown format
  const expenseBreakdown = [
    { 
      category: "Materials/COGS", 
      amount: data.costs.materials, 
      percentage: (data.costs.materials / data.expenses) * 100,
      status: (data.costs.materials / data.revenue) > 0.3 ? "high" : "normal"
    },
    { 
      category: "Labor & Payroll", 
      amount: data.costs.labor, 
      percentage: (data.costs.labor / data.expenses) * 100,
      status: (data.costs.labor / data.expenses) > 0.45 ? "high" : "normal"
    },
    { 
      category: "Marketing & Advertising", 
      amount: data.costs.marketing, 
      percentage: (data.costs.marketing / data.expenses) * 100,
      status: "normal"
    },
    { 
      category: "Software & Subscriptions", 
      amount: data.costs.software, 
      percentage: (data.costs.software / data.expenses) * 100,
      status: (data.costs.software / data.expenses) > 0.1 ? "warning" : "normal"
    },
    { 
      category: "Rent & Utilities", 
      amount: data.costs.rentUtilities, 
      percentage: (data.costs.rentUtilities / data.expenses) * 100,
      status: "normal"
    },
    { 
      category: "Other Operating Costs", 
      amount: data.costs.other, 
      percentage: (data.costs.other / data.expenses) * 100,
      status: "normal"
    },
  ].filter(item => item.amount > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <img 
                src="/flexpoint-logo.jpg" 
                alt="Flexpoint Bookkeeping" 
                className="h-16"
              />
              <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">
                  Profitability Audit
                </h1>
                <p className="text-xl text-slate-600">{data.companyName}</p>
                <p className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className={`border-2 rounded-xl px-6 py-4 ${
                data.currentMargin >= 30 ? 'bg-emerald-50 border-emerald-500' :
                data.currentMargin >= 15 ? 'bg-amber-50 border-amber-500' :
                'bg-red-50 border-red-500'
              }`}>
                <p className="text-sm font-semibold mb-1 uppercase tracking-wide ${
                  data.currentMargin >= 30 ? 'text-emerald-700' :
                  data.currentMargin >= 15 ? 'text-amber-700' :
                  'text-red-700'
                }">
                  TOTAL OPPORTUNITY
                </p>
                <p className="text-4xl font-bold ${
                  data.currentMargin >= 30 ? 'text-emerald-600' :
                  data.currentMargin >= 15 ? 'text-amber-600' :
                  'text-red-600'
                }">
                  {formatCurrency(data.totalOpportunity)}
                </p>
                <p className="text-sm font-medium mt-1 ${
                  data.currentMargin >= 30 ? 'text-emerald-600' :
                  data.currentMargin >= 15 ? 'text-amber-600' :
                  'text-red-600'
                }">
                  per year
                </p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 border-b border-slate-200">
            {[
              { id: 'overview', icon: BarChart3, label: 'Overview' },
              { id: 'expenses', icon: PieChart, label: 'Where Money Goes' },
              { id: 'services', icon: TrendingUp, label: 'Service Profitability' },
              { id: 'actions', icon: Target, label: 'Action Plan' }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-semibold transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-b-4 border-blue-600 text-blue-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Financial Snapshot */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <PieChart className="w-6 h-6 text-blue-600" />
                Financial Snapshot
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-blue-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-blue-700 font-semibold">Annual Revenue</p>
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-3xl font-bold text-blue-900">
                    {formatCurrency(data.revenue)}
                  </p>
                  <p className="text-xs text-blue-700 mt-1">Monthly</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-orange-700 font-semibold">Total Costs</p>
                    <TrendingDown className="w-5 h-5 text-orange-600" />
                  </div>
                  <p className="text-3xl font-bold text-orange-900">
                    {formatCurrency(data.expenses)}
                  </p>
                  <p className="text-xs text-orange-700 mt-1">Monthly</p>
                </div>
                <div className={`rounded-xl p-6 ${
                  data.netProfit >= 0 ? 'bg-emerald-50' : 'bg-red-50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className={`text-sm font-semibold ${
                      data.netProfit >= 0 ? 'text-emerald-700' : 'text-red-700'
                    }`}>
                      Current Profit
                    </p>
                    <CheckCircle className={`w-5 h-5 ${
                      data.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'
                    }`} />
                  </div>
                  <p className={`text-3xl font-bold ${
                    data.netProfit >= 0 ? 'text-emerald-900' : 'text-red-900'
                  }`}>
                    {formatCurrency(data.netProfit)}
                  </p>
                  <p className={`text-xs mt-1 ${
                    data.netProfit >= 0 ? 'text-emerald-700' : 'text-red-700'
                  }`}>
                    {formatPercent(data.currentMargin)} margin
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-white font-semibold">Potential Profit</p>
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-3xl font-bold text-white">
                    {formatCurrency(data.potentialProfit)}
                  </p>
                  <p className="text-xs text-blue-100 mt-1">{formatPercent(data.targetMargin)} margin</p>
                </div>
              </div>
            </div>

            {/* Key Findings */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-amber-600" />
                What We Found
              </h2>
              <div className="space-y-4">
                {data.findings.map((finding, index) => {
                  const isPositive = finding.toLowerCase().includes('excellent') || finding.toLowerCase().includes('strong') || finding.toLowerCase().includes('well');
                  const isWarning = finding.toLowerCase().includes('need') || finding.toLowerCase().includes('requires') || finding.toLowerCase().includes('attention');
                  
                  return (
                    <div key={index} className={`flex items-start gap-4 p-4 rounded-xl ${
                      isPositive ? 'bg-emerald-50' : isWarning ? 'bg-amber-50' : 'bg-blue-50'
                    }`}>
                      {isPositive ? (
                        <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                      ) : isWarning ? (
                        <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                      ) : (
                        <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      )}
                      <div>
                        <p className={`${
                          isPositive ? 'text-emerald-800' : isWarning ? 'text-amber-800' : 'text-blue-800'
                        }`}>
                          {finding}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Line Up Front */}
            {data.profitIncrease > 0 && (
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-2xl shadow-xl p-8 text-white">
                <h2 className="text-3xl font-bold mb-4">Bottom Line Up Front</h2>
                <p className="text-lg mb-6 opacity-90">
                  You have <span className="font-bold text-2xl">{formatCurrency(data.totalOpportunity)}</span> in annual profit sitting on the table through {data.actions.length} fixable issues. 
                  With your excellent {formatPercent(data.currentMargin)} margin, these strategic optimizations will unlock even more profit potential.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Expenses Tab */}
        {activeTab === 'expenses' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <PieChart className="w-6 h-6 text-blue-600" />
              Expense Breakdown
            </h2>
            <div className="space-y-6">
              {expenseBreakdown.map((expense, idx) => (
                <div key={idx} className="border-2 border-slate-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-slate-900">{expense.category}</h3>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-900">
                        {formatCurrency(expense.amount)}
                      </p>
                      <p className="text-sm text-slate-600">{expense.percentage.toFixed(1)}% of total</p>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        expense.status === 'high' ? 'bg-red-500' :
                        expense.status === 'warning' ? 'bg-amber-500' :
                        'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(expense.percentage, 100)}%` }}
                    />
                  </div>
                  {expense.status === 'high' && (
                    <p className="mt-3 text-sm text-red-700 font-semibold">
                      ⚠️ Above industry benchmark - optimization recommended
                    </p>
                  )}
                  {expense.status === 'warning' && (
                    <p className="mt-3 text-sm text-amber-700 font-semibold">
                      💡 Review for potential redundancy or consolidation
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
              Service Profitability Analysis
            </h2>
            {data.services.length > 0 ? (
              <div className="space-y-4">
                {data.services.map((service, idx) => (
                  <div key={idx} className="border-2 border-slate-200 rounded-xl p-6 hover:border-blue-400 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{service.name}</h3>
                        <div className="flex gap-6 text-sm">
                          <span className="text-slate-600">
                            Revenue: <span className="font-bold text-slate-900">{formatCurrency(service.revenue)}</span>
                          </span>
                          <span className="text-slate-600">
                            Cost: <span className="font-bold text-slate-900">{formatCurrency(service.cost)}</span>
                          </span>
                          <span className="text-slate-600">
                            Profit: <span className="font-bold text-emerald-600">{formatCurrency(service.revenue - service.cost)}</span>
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`inline-block px-4 py-2 rounded-lg font-bold ${
                          service.status === 'excellent' ? 'bg-emerald-100 text-emerald-700' :
                          service.status === 'good' ? 'bg-blue-100 text-blue-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {formatPercent(service.margin)} Margin
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
                        style={{ width: `${Math.min(service.margin, 100)}%` }}
                      />
                    </div>
                    {service.status === 'excellent' && (
                      <p className="mt-3 text-sm text-emerald-700 font-semibold">
                        ⭐ High-margin service - consider pricing increase or expansion
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-600">No service-level data available</p>
            )}
          </div>
        )}

        {/* Actions Tab */}
        {activeTab === 'actions' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Target className="w-6 h-6 text-blue-600" />
                Your Strategic Action Plan
              </h2>
              <p className="text-slate-600 mb-6">Implement these steps for maximum impact</p>
              
              <div className="space-y-6">
                {data.actions.map((step, idx) => (
                  <div key={idx} className="border-2 border-blue-200 rounded-xl p-6 bg-gradient-to-r from-blue-50 to-white">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                          <span className="text-lg font-bold text-emerald-600 flex-shrink-0 ml-4">
                            {formatCurrency(step.impact)}
                          </span>
                        </div>
                        <p className="text-slate-700 mb-3">{step.description}</p>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-slate-600">
                            ⏰ Timeline: <span className="font-bold">{step.timeline}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Impact */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-2xl shadow-xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Total Annual Opportunity</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg opacity-90 mb-2">By implementing all action steps:</p>
                  <ul className="space-y-1 text-sm opacity-90">
                    {data.actions.map((action, idx) => (
                      <li key={idx}>✓ {action.title}: {formatCurrency(action.impact)}/year</li>
                    ))}
                  </ul>
                </div>
                <div className="text-right">
                  <p className="text-lg opacity-90">Additional Annual Profit</p>
                  <p className="text-5xl font-bold">{formatCurrency(data.totalOpportunity)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-700 font-medium mb-2">
                Ready to implement these changes?
              </p>
              <p className="text-sm text-slate-600">
                Schedule your follow-up review call to discuss these findings in detail.
              </p>
            </div>
            <a 
              href="https://www.flexpointbookkeeping.com/contact"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-lg transition-all hover:scale-105 shadow-lg"
            >
              Schedule Consultation
            </a>
          </div>
          <div className="mt-6 pt-6 border-t border-slate-200 flex items-center justify-between">
            <img 
              src="/flexpoint-logo.jpg" 
              alt="Flexpoint Bookkeeping" 
              className="h-8 opacity-60"
            />
            <p className="text-xs text-slate-500">
              Prepared by Flexpoint Bookkeeping | Confidential Business Analysis | © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitabilityAuditReport;