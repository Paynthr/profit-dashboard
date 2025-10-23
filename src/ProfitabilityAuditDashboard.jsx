import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Target, PieChart, BarChart3 } from 'lucide-react';

const ProfitabilityAuditReport = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [clientData, setClientData] = useState(null);
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
        
        // Transform API data to match original format
        setClientData({
          businessName: result.companyName,
          auditDate: new Date().toLocaleDateString(),
          revenue: result.revenue,
          cogs: result.costs.materials,
          operatingExpenses: result.expenses - result.costs.materials,
          netProfit: result.netProfit,
          profitMargin: result.currentMargin,
          totalOpportunity: result.totalOpportunity,
          expenses: result.expenses,
          costs: result.costs,
          services: result.services,
          actions: result.actions,
          findings: result.findings,
          healthScore: result.healthScore
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (error || !clientData) {
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

  const expenseBreakdown = [
    { 
      category: "Labor & Payroll", 
      amount: clientData.costs.labor, 
      percentage: (clientData.costs.labor / clientData.operatingExpenses) * 100,
      status: (clientData.costs.labor / clientData.operatingExpenses) > 0.45 ? "high" : "normal"
    },
    { 
      category: "Marketing & Advertising", 
      amount: clientData.costs.marketing, 
      percentage: (clientData.costs.marketing / clientData.operatingExpenses) * 100,
      status: "normal"
    },
    { 
      category: "Rent & Utilities", 
      amount: clientData.costs.rentUtilities, 
      percentage: (clientData.costs.rentUtilities / clientData.operatingExpenses) * 100,
      status: "normal"
    },
    { 
      category: "Software & Subscriptions", 
      amount: clientData.costs.software, 
      percentage: (clientData.costs.software / clientData.operatingExpenses) * 100,
      status: (clientData.costs.software / clientData.operatingExpenses) > 0.1 ? "warning" : "normal"
    },
    { 
      category: "Other Operating Costs", 
      amount: clientData.costs.other, 
      percentage: (clientData.costs.other / clientData.operatingExpenses) * 100,
      status: "normal"
    },
  ].filter(item => item.amount > 0);

  const serviceAnalysis = clientData.services || [];

  const actionSteps = clientData.actions.map((action, idx) => ({
    title: action.title,
    impact: "High",
    effort: idx === 0 ? "Low" : "Medium",
    savings: `$${action.impact.toLocaleString()}/year`,
    description: action.description,
    timeframe: action.timeline
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                Profitability Audit Report
              </h1>
              <p className="text-xl text-slate-600">{clientData.businessName}</p>
              <p className="text-sm text-slate-500 mt-2">Audit Date: {clientData.auditDate}</p>
            </div>
            <div className="text-right">
              <div className="bg-emerald-50 border-2 border-emerald-500 rounded-xl px-6 py-4">
                <p className="text-sm text-emerald-700 font-semibold">Net Profit Margin</p>
                <p className="text-4xl font-bold text-emerald-600">{clientData.profitMargin.toFixed(1)}%</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 border-b border-slate-200">
            {['overview', 'expenses', 'services', 'actions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-semibold transition-all ${
                  activeTab === tab
                    ? 'border-b-4 border-blue-600 text-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="bg-blue-50 rounded-xl p-6">
                  <p className="text-sm text-blue-700 font-semibold mb-2">Total Revenue</p>
                  <p className="text-3xl font-bold text-blue-900">
                    ${clientData.revenue.toLocaleString()}
                  </p>
                </div>
                <div className="bg-orange-50 rounded-xl p-6">
                  <p className="text-sm text-orange-700 font-semibold mb-2">Cost of Goods Sold</p>
                  <p className="text-3xl font-bold text-orange-900">
                    ${clientData.cogs.toLocaleString()}
                  </p>
                </div>
                <div className="bg-red-50 rounded-xl p-6">
                  <p className="text-sm text-red-700 font-semibold mb-2">Operating Expenses</p>
                  <p className="text-3xl font-bold text-red-900">
                    ${clientData.operatingExpenses.toLocaleString()}
                  </p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-6">
                  <p className="text-sm text-emerald-700 font-semibold mb-2">Net Profit</p>
                  <p className="text-3xl font-bold text-emerald-900">
                    ${clientData.netProfit.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Key Findings */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-amber-600" />
                Key Findings
              </h2>
              <div className="space-y-4">
                {clientData.findings.map((finding, index) => {
                  const isPositive = finding.toLowerCase().includes('excellent') || finding.toLowerCase().includes('strong');
                  const isWarning = finding.toLowerCase().includes('critical') || finding.toLowerCase().includes('need');
                  
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
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-2xl shadow-xl p-8 text-white">
              <h2 className="text-3xl font-bold mb-4">Bottom Line Up Front</h2>
              <p className="text-lg mb-2 opacity-90">
                You have <span className="font-bold text-2xl">${clientData.totalOpportunity.toLocaleString()}</span> in annual profit sitting on the table through {actionSteps.length} fixable issues.
              </p>
              <p className="text-lg opacity-90">
                With your {clientData.profitMargin >= 0 ? 'current' : 'challenged'} {Math.abs(clientData.profitMargin).toFixed(1)}% margin, these strategic optimizations will unlock significant profit potential.
              </p>
            </div>
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
                        ${expense.amount.toLocaleString()}
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
            <div className="space-y-4">
              {serviceAnalysis.map((service, idx) => (
                <div key={idx} className="border-2 border-slate-200 rounded-xl p-6 hover:border-blue-400 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{service.name}</h3>
                      <div className="flex gap-6 text-sm">
                        <span className="text-slate-600">
                          Revenue: <span className="font-bold text-slate-900">${service.revenue.toLocaleString()}</span>
                        </span>
                        <span className="text-slate-600">
                          Cost: <span className="font-bold text-slate-900">${service.cost.toLocaleString()}</span>
                        </span>
                        <span className="text-slate-600">
                          Profit: <span className="font-bold text-emerald-600">${(service.revenue - service.cost).toLocaleString()}</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`inline-block px-4 py-2 rounded-lg font-bold ${
                        service.status === 'excellent' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {service.margin.toFixed(1)}% Margin
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
          </div>
        )}

        {/* Actions Tab */}
        {activeTab === 'actions' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Target className="w-6 h-6 text-blue-600" />
                Your 3-Step Profit Action Plan
              </h2>
              <p className="text-slate-600 mb-6">Implement these steps in order for maximum impact</p>
              
              <div className="space-y-6">
                {actionSteps.map((step, idx) => (
                  <div key={idx} className="border-2 border-blue-200 rounded-xl p-6 bg-gradient-to-r from-blue-50 to-white">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                          <div className="flex gap-2">
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                              {step.impact} Impact
                            </span>
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                              {step.effort} Effort
                            </span>
                          </div>
                        </div>
                        <p className="text-slate-700 mb-3">{step.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">
                            ⏰ Timeframe: <span className="font-bold">{step.timeframe}</span>
                          </span>
                          <span className="text-lg font-bold text-emerald-600">
                            💰 {step.savings}
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
              <h2 className="text-2xl font-bold mb-4">Total Annual Impact</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg opacity-90 mb-2">By implementing all three action steps:</p>
                  <ul className="space-y-1 text-sm opacity-90">
                    {clientData.actions.map((action, idx) => (
                      <li key={idx}>✓ {action.title}</li>
                    ))}
                  </ul>
                </div>
                <div className="text-right">
                  <p className="text-lg opacity-90">Additional Annual Profit</p>
                  <p className="text-5xl font-bold">${clientData.totalOpportunity.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-slate-600">
          <p className="text-sm">
            Questions about your audit? Schedule your follow-up review call to dive deeper into these findings.
          </p>
          <p className="text-xs mt-2 text-slate-500">
            Prepared by Flexpoint Partnership | Confidential Business Analysis
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfitabilityAuditReport;