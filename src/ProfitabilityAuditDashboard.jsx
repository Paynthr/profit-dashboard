import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Calendar,
  PieChart,
  BarChart3,
  ListChecks,
  Printer
} from 'lucide-react';

const API_URL = 'https://script.google.com/macros/s/AKfycbxO6lmAQfW8hLvxYqCY_9HSBIHmlNkvCykLRVDk-DbVbBX4AmGzVwP1_hPWXw6cMjc/exec';

const getUrlParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    row: params.get('row') // Don't default to '2' - return null if not provided
  };
};

const ProfitabilityAuditDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [auditData, setAuditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const { row } = getUrlParams();
        // Only add ?row= if row parameter exists in URL
        const url = row ? `${API_URL}?row=${row}` : API_URL;
        const response = await fetch(url);
        const data = await response.json();
        console.log('Fetched data:', data);
        setAuditData(data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const beforePrint = () => setIsPrinting(true);
    const afterPrint = () => setIsPrinting(false);
    
    window.addEventListener('beforeprint', beforePrint);
    window.addEventListener('afterprint', afterPrint);
    
    return () => {
      window.removeEventListener('beforeprint', beforePrint);
      window.removeEventListener('afterprint', afterPrint);
    };
  }, []);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your audit data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-lg font-semibold mb-2">Error loading data</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!auditData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  const data = auditData;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: PieChart },
    { id: 'expenses', label: 'Where Money Goes', icon: BarChart3 },
    { id: 'services', label: 'Service Profitability', icon: TrendingUp },
    { id: 'actions', label: 'Action Plan', icon: ListChecks }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-start gap-3 mb-6">
          <Target className="h-8 w-8 mt-1" />
          <div>
            <h2 className="text-2xl font-bold mb-2">Bottom Line Up Front</h2>
            <p className="text-blue-100 text-lg">
              You have <span className="font-bold text-white">${data.totalImpact.toLocaleString()} in annual profit</span> sitting 
              on the table through {data.findings.length} fixable issues. With the right moves, we can increase your profit 
              margin from <span className="font-bold text-white">{data.profitMargin.toFixed(1)}%</span> to{' '}
              <span className="font-bold text-white">{data.targetMargin}%</span> in 90 days.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.actions.slice(0, 3).map((action, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-sm text-blue-100 mb-1">Action {action.step}</div>
              <div className="text-xl font-bold mb-2">{action.savings}</div>
              <div className="text-sm text-blue-100">{action.title}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <DollarSign className="h-5 w-5" />
            <span className="text-sm font-medium">Current Revenue</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">${(data.revenue / 1000).toFixed(1)}K</div>
          <div className="text-sm text-gray-500 mt-1">Monthly</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center gap-2 text-gray-600 mb-2">
            <TrendingDown className="h-5 w-5" />
            <span className="text-sm font-medium">Total Costs</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">${(data.totalCosts / 1000).toFixed(1)}K</div>
          <div className="text-sm text-gray-500 mt-1">Monthly</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center gap-2 text-green-600 mb-2">
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm font-medium">Current Profit</span>
          </div>
          <div className="text-3xl font-bold text-green-600">${(data.netProfit / 1000).toFixed(1)}K</div>
          <div className="text-sm text-green-600 mt-1">{data.profitMargin.toFixed(1)}% margin</div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-center gap-2 text-orange-600 mb-2">
            <Target className="h-5 w-5" />
            <span className="text-sm font-medium">Potential Profit</span>
          </div>
          <div className="text-3xl font-bold text-orange-600">
            ${((data.netProfit + data.totalImpact / 12) / 1000).toFixed(1)}K
          </div>
          <div className="text-sm text-orange-600 mt-1">{data.targetMargin}% margin</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <AlertCircle className="h-6 w-6 text-orange-500" />
          <h3 className="text-xl font-bold text-gray-900">What We Found</h3>
        </div>
        
        <div className="space-y-3">
          {data.findings.map((finding, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                finding.type === 'warning'
                  ? 'bg-yellow-50 border-yellow-400'
                  : 'bg-green-50 border-green-400'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{finding.title}</h4>
                  <p className="text-sm text-gray-600">{finding.description}</p>
                </div>
                {finding.type === 'warning' ? (
                  <AlertCircle className="h-5 w-5 text-yellow-500 ml-2 flex-shrink-0" />
                ) : (
                  <CheckCircle className="h-5 w-5 text-green-500 ml-2 flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">{finding.impact}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderExpenses = () => {
    const expenseCategories = [
      { name: 'Materials/COGS', value: data.costs.materials, color: 'bg-blue-500' },
      { name: 'Labor & Payroll', value: data.costs.labor, color: 'bg-purple-500' },
      { name: 'Marketing', value: data.costs.marketing, color: 'bg-pink-500' },
      { name: 'Software', value: data.costs.software, color: 'bg-green-500' },
      { name: 'Rent & Utilities', value: data.costs.rentUtilities, color: 'bg-yellow-500' },
      { name: 'Other Expenses', value: data.costs.other, color: 'bg-gray-500' }
    ];

    const totalExpenses = expenseCategories.reduce((sum, cat) => sum + cat.value, 0);

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Monthly Expense Breakdown</h3>
          
          <div className="space-y-4">
            {expenseCategories.map((category, index) => {
              const percentage = totalExpenses > 0 ? (category.value / totalExpenses) * 100 : 0;
              return (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-700">{category.name}</span>
                    <div className="text-right">
                      <span className="font-bold text-gray-900">${category.value.toLocaleString()}</span>
                      <span className="text-sm text-gray-500 ml-2">({percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`${category.color} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">Total Monthly Expenses</span>
              <span className="text-2xl font-bold text-gray-900">${totalExpenses.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderServices = () => (
    <div className="space-y-6">
      {data.services.map((service, index) => (
        <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
            <div
              className={`px-4 py-2 rounded-full font-semibold ${
                service.status === 'excellent'
                  ? 'bg-green-100 text-green-800'
                  : service.status === 'good'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              {service.margin.toFixed(1)}% Margin
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Revenue</div>
              <div className="text-2xl font-bold text-gray-900">${service.revenue.toLocaleString()}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Cost</div>
              <div className="text-2xl font-bold text-gray-900">${service.cost.toLocaleString()}</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-sm text-green-600 mb-1">Profit</div>
              <div className="text-2xl font-bold text-green-600">
                ${(service.revenue - service.cost).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderActions = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Total Opportunity</h2>
            <p className="text-green-100">Combined annual impact of all recommended actions</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">${data.totalImpact.toLocaleString()}</div>
            <div className="text-green-100">per year</div>
          </div>
        </div>
      </div>

      {data.actions.map((action, index) => (
        <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0">
                {action.step}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-gray-600">{action.description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">{action.savings}</div>
              <div className="text-sm text-gray-500">{action.timeframe}</div>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                action.effort === 'Low'
                  ? 'bg-green-100 text-green-800'
                  : action.effort === 'Medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {action.effort} Effort
            </span>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Implementation Steps:</h4>
            <ul className="space-y-2">
              {action.implementation.map((step, stepIndex) => (
                <li key={stepIndex} className="flex items-start gap-2">
                  <ChevronRight className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Profitability Audit</h1>
              <p className="text-xl text-gray-600">{data.businessName}</p>
              <div className="flex items-center gap-2 mt-2 text-gray-500">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">
                  {new Date(data.auditDate).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="text-right bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
                <div className="text-sm font-medium mb-1">TOTAL OPPORTUNITY</div>
                <div className="text-4xl font-bold">${(data.totalImpact / 1000).toFixed(1)}K</div>
                <div className="text-sm opacity-90">per year</div>
              </div>
              
              <button
                onClick={handlePrint}
                className="no-print flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
              >
                <Printer className="h-5 w-5" />
                Download PDF
              </button>
            </div>
          </div>
        </div>

        <div className="no-print bg-white rounded-2xl shadow-lg mb-8 border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-200">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {!isPrinting ? (
          <div>
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'expenses' && renderExpenses()}
            {activeTab === 'services' && renderServices()}
            {activeTab === 'actions' && renderActions()}
          </div>
        ) : (
          <div className="print-all-tabs">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-blue-600">Overview</h2>
              {renderOverview()}
            </div>
            
            <div className="page-break"></div>
            
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-blue-600">Where Money Goes</h2>
              {renderExpenses()}
            </div>
            
            <div className="page-break"></div>
            
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-blue-600">Service Profitability</h2>
              {renderServices()}
            </div>
            
            <div className="page-break"></div>
            
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-blue-600">Action Plan</h2>
              {renderActions()}
            </div>
          </div>
        )}

        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8 text-center border border-gray-100">
          <p className="text-gray-600 mb-2">
            This audit was prepared by <span className="font-bold text-gray-900">Flexpoint Bookkeeping</span>
          </p>
          <p className="text-sm text-gray-500">
            For questions or to schedule a follow-up consultation, visit book.flexpointbookkeeping.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfitabilityAuditDashboard;