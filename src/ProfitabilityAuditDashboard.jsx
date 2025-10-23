'use client';

import React, { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, AlertCircle, CheckCircle, Target, BarChart3 } from 'lucide-react';

interface DashboardData {
  companyName: string;
  revenue: number;
  expenses: number;
  netProfit: number;
  currentMargin: number;
  targetMargin: number;
  potentialProfit: number;
  profitIncrease: number;
  costs: {
    materials: number;
    labor: number;
    marketing: number;
    software: number;
    rentUtilities: number;
    other: number;
  };
  services: Array<{
    name: string;
    revenue: number;
    cost: number;
    margin: number;
    status: 'excellent' | 'good' | 'warning';
  }>;
  actions: Array<{
    title: string;
    impact: number;
    description: string;
    timeline: string;
  }>;
  totalOpportunity: number;
  healthScore: number;
  findings: string[];
}

export default function ProfitDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const clientId = urlParams.get('client');
        const rowNumber = urlParams.get('row');
        
        let url = 'https://script.google.com/macros/s/AKfycbwyA-59kaSfqKqJq3SjQBPIW7y5xNDvI31FT-bXs_GU9GbTx0ZKPB1rBaZ1mnIJ0zMV/exec';
        
        if (clientId) {
          url += `?client=${clientId}`;
        } else if (rowNumber) {
          url += `?row=${rowNumber}`;
        }
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch data');
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
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
          <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">Unable to Load Data</h2>
          <p className="text-slate-600 text-center">{error || 'No data available'}</p>
        </div>
      </div>
    );
  }

  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Attention';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header with Flexpoint Branding */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="https://www.flexpointbookkeeping.com/wp-content/uploads/2021/10/logo-lines.png" 
                alt="Flexpoint Bookkeeping" 
                className="h-12"
              />
              <div className="border-l border-slate-300 pl-4">
                <h1 className="text-2xl font-bold text-slate-800">Profit Dashboard</h1>
                <p className="text-sm text-slate-600">Your Financial Roadmap</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Company Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">{data.companyName}</h2>
          <p className="text-slate-600">Comprehensive Profit Analysis & Action Plan</p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 font-medium">Annual Revenue</span>
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-slate-800">{formatCurrency(data.revenue)}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 font-medium">Total Expenses</span>
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-slate-800">{formatCurrency(data.expenses)}</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 font-medium">Current Profit</span>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-slate-800">{formatCurrency(data.netProfit)}</p>
            <p className="text-sm text-slate-600 mt-1">{formatPercent(data.currentMargin)} margin</p>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-medium">Potential Profit</span>
              <Target className="h-5 w-5 text-white" />
            </div>
            <p className="text-3xl font-bold text-white">{formatCurrency(data.potentialProfit)}</p>
            <p className="text-sm text-blue-100 mt-1">{formatPercent(data.targetMargin)} margin</p>
          </div>
        </div>

        {/* Profit Opportunity Banner */}
        {data.profitIncrease > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="bg-green-600 rounded-full p-3">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">
                  Increase Your Annual Profit by {formatCurrency(data.profitIncrease)}
                </h3>
                <p className="text-slate-700 text-lg">
                  We've identified opportunities to boost your profit margin from {formatPercent(data.currentMargin)} to {formatPercent(data.targetMargin)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Financial Health Check */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <h3 className="text-2xl font-bold text-slate-800">Financial Health Check</h3>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-semibold text-slate-700">Overall Health Score</span>
              <span className={`text-2xl font-bold ${getHealthColor(data.healthScore)}`}>
                {data.healthScore}/100 - {getHealthLabel(data.healthScore)}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-4">
              <div 
                className={`h-4 rounded-full transition-all duration-1000 ${
                  data.healthScore >= 80 ? 'bg-green-600' : 
                  data.healthScore >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                }`}
                style={{ width: `${data.healthScore}%` }}
              ></div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-slate-700 mb-3">Key Findings:</h4>
            {data.findings.map((finding, index) => (
              <div key={index} className="flex items-start gap-3 bg-slate-50 rounded-lg p-4">
                <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-slate-700">{finding}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">Where Your Money Goes</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(data.costs).map(([key, value]) => {
              const percentage = data.revenue > 0 ? (value / data.revenue) * 100 : 0;
              const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              
              return (
                <div key={key} className="bg-slate-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600 mb-1">{label}</p>
                  <p className="text-xl font-bold text-slate-800">{formatCurrency(value)}</p>
                  <p className="text-sm text-slate-500">{formatPercent(percentage)} of revenue</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Service Performance */}
        {data.services.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Service Profitability</h3>
            <div className="space-y-4">
              {data.services.map((service, index) => (
                <div key={index} className="border border-slate-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-semibold text-slate-800">{service.name}</h4>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      service.status === 'excellent' ? 'bg-green-100 text-green-800' :
                      service.status === 'good' ? 'bg-blue-100 text-blue-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {formatPercent(service.margin)} margin
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600">Revenue</p>
                      <p className="text-lg font-semibold text-slate-800">{formatCurrency(service.revenue)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">Cost</p>
                      <p className="text-lg font-semibold text-slate-800">{formatCurrency(service.cost)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Plan */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-2xl font-bold text-slate-800 mb-2">Your 3-Step Action Plan</h3>
          <p className="text-slate-600 mb-6">Start implementing these changes this month to unlock {formatCurrency(data.totalOpportunity)} in annual profit</p>
          
          <div className="space-y-6">
            {data.actions.map((action, index) => (
              <div key={index} className="border-l-4 border-blue-600 bg-blue-50 rounded-r-lg p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-800 mb-2">{action.title}</h4>
                      <p className="text-slate-700 mb-3">{action.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-slate-600">Timeline: <strong>{action.timeline}</strong></span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm text-slate-600 mb-1">Annual Impact</p>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(action.impact)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold mb-1">Total Annual Opportunity</p>
                <p className="text-sm opacity-90">Combined impact of all action steps</p>
              </div>
              <p className="text-4xl font-bold">{formatCurrency(data.totalOpportunity)}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-800 rounded-lg shadow-md p-8 text-center">
          <img 
            src="https://www.flexpointbookkeeping.com/wp-content/uploads/2021/10/logo-lines.png" 
            alt="Flexpoint Bookkeeping" 
            className="h-10 mx-auto mb-4 opacity-80"
          />
          <h3 className="text-xl font-bold text-white mb-2">Ready to Implement These Changes?</h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Partner with Flexpoint Bookkeeping to turn this analysis into action. We'll guide you through each step and keep you on track.
          </p>
          <a 
            href="https://www.flexpointbookkeeping.com/contact"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Schedule Your Consultation
          </a>
          <p className="text-slate-400 text-sm mt-6">
            © {new Date().getFullYear()} Flexpoint Bookkeeping. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}