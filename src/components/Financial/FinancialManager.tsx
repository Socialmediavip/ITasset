import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calculator, FileText, Calendar, CreditCard, PieChart } from 'lucide-react';
import apiService from '../../services/api';

interface FinancialManagerProps {
  assets: any[];
  licenses: any[];
  accessories: any[];
  consumables: any[];
  components: any[];
}

export default function FinancialManager({
  assets,
  licenses,
  accessories,
  consumables,
  components
}: FinancialManagerProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [viewType, setViewType] = useState('overview');
  const [financialData, setFinancialData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadFinancialData();
    
    // Set up real-time refresh every 5 minutes for financial data
    const interval = setInterval(() => {
      loadFinancialData();
    }, 300000);
    
    setRefreshInterval(interval);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedPeriod]);

  const loadFinancialData = async () => {
    setLoading(true);
    try {
      const response = await apiService.getFinancialOverview({ period: selectedPeriod });
      if (response.data) {
        setFinancialData(response.data);
      } else {
        calculateFinancialMetrics();
      }
    } catch (error) {
      console.warn('Failed to load financial data, calculating locally');
      calculateFinancialMetrics();
    } finally {
      setLoading(false);
    }
  };

  const calculateFinancialMetrics = () => {
    // Calculate financial metrics
    const totalAssetValue = assets.reduce((sum, asset) => sum + (asset.purchaseCost || 0), 0);
    const totalLicenseValue = licenses.reduce((sum, license) => sum + (license.cost || 0), 0);
    const totalAccessoryValue = accessories.reduce((sum, acc) => sum + (acc.purchaseCost || 0), 0);
    const totalComponentValue = components.reduce((sum, comp) => sum + (comp.purchaseCost || 0), 0);
    
    const totalValue = totalAssetValue + totalLicenseValue + totalAccessoryValue + totalComponentValue;

    // Calculate depreciation
    const currentDepreciatedValue = assets.reduce((sum, asset) => {
      if (asset.depreciation) {
        return sum + (asset.depreciation.currentValue || 0);
      }
      return sum + (asset.purchaseCost || 0);
    }, 0);

    const totalDepreciation = totalAssetValue - currentDepreciatedValue;

    // Monthly costs (licenses + leases)
    const monthlyLicenseCosts = licenses.reduce((sum, license) => {
      if (license.saasSubscription) {
        const monthly = license.saasSubscription.billingCycle === 'Monthly' ? license.saasSubscription.totalCost :
                       license.saasSubscription.billingCycle === 'Quarterly' ? license.saasSubscription.totalCost / 3 :
                       license.saasSubscription.billingCycle === 'Annually' ? license.saasSubscription.totalCost / 12 : 0;
        return sum + monthly;
      }
      return sum;
    }, 0);

    const monthlyLeaseCosts = assets.reduce((sum, asset) => {
      if (asset.leaseInfo) {
        return sum + (asset.leaseInfo.monthlyPayment || 0);
      }
      return sum;
    }, 0);

    const totalMonthlyCosts = monthlyLicenseCosts + monthlyLeaseCosts;

    setFinancialData({
      totalValue,
      currentDepreciatedValue,
      totalDepreciation,
      totalMonthlyCosts,
      totalAssetValue,
      totalLicenseValue,
      totalAccessoryValue,
      totalComponentValue,
      monthlyLicenseCosts,
      monthlyLeaseCosts
    });
  };

  if (!financialData) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Management</h1>
          <p className="text-gray-600">Track costs, depreciation, and financial metrics for IT assets</p>
          <p className="text-xs text-gray-500 mt-1">Auto-refresh: 5min</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="current">Current Period</option>
            <option value="ytd">Year to Date</option>
            <option value="last-year">Last Year</option>
            <option value="quarterly">Quarterly</option>
          </select>
          <select
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="overview">Overview</option>
            <option value="depreciation">Depreciation</option>
            <option value="tco">Total Cost of Ownership</option>
            <option value="budgets">Budget Analysis</option>
          </select>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">${financialData.totalValue.toLocaleString()}</div>
              <div className="text-green-100">Total Asset Value</div>
            </div>
            <DollarSign className="w-8 h-8 text-green-200" />
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-sm">+8% from last quarter</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">${financialData.currentDepreciatedValue.toLocaleString()}</div>
              <div className="text-blue-100">Current Value</div>
            </div>
            <Calculator className="w-8 h-8 text-blue-200" />
          </div>
          <div className="mt-4 flex items-center">
            <TrendingDown className="w-4 h-4 mr-1" />
            <span className="text-sm">${financialData.totalDepreciation.toLocaleString()} depreciated</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">${financialData.totalMonthlyCosts.toLocaleString()}</div>
              <div className="text-purple-100">Monthly Costs</div>
            </div>
            <Calendar className="w-8 h-8 text-purple-200" />
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm">Licenses + Leases</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">${(financialData.totalMonthlyCosts * 12).toLocaleString()}</div>
              <div className="text-orange-100">Annual Recurring</div>
            </div>
            <FileText className="w-8 h-8 text-orange-200" />
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm">Projected yearly cost</span>
          </div>
        </div>
      </div>

      {/* Detailed Financial Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Cost Breakdown by Category */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Cost Breakdown by Category</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Hardware Assets</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-teal-600 h-2 rounded-full" 
                      style={{ width: `${(financialData.totalAssetValue / financialData.totalValue) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-20">${financialData.totalAssetValue.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700">Software Licenses</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-pink-600 h-2 rounded-full" 
                      style={{ width: `${(financialData.totalLicenseValue / financialData.totalValue) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-20">${financialData.totalLicenseValue.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700">Accessories</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-600 h-2 rounded-full" 
                      style={{ width: `${(financialData.totalAccessoryValue / financialData.totalValue) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-20">${financialData.totalAccessoryValue.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700">Components</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-600 h-2 rounded-full" 
                      style={{ width: `${(financialData.totalComponentValue / financialData.totalValue) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-20">${financialData.totalComponentValue.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Recurring Costs */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Recurring Costs</h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  ${financialData.totalMonthlyCosts.toLocaleString()}
                </div>
                <div className="text-gray-600">Total Monthly Costs</div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Software Licenses</span>
                  </div>
                  <span className="font-bold text-blue-600">${financialData.monthlyLicenseCosts.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-900">Equipment Leases</span>
                  </div>
                  <span className="font-bold text-green-600">${financialData.monthlyLeaseCosts.toLocaleString()}</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">Annual Projection</span>
                    <span className="text-xl font-bold text-gray-900">
                      ${(financialData.totalMonthlyCosts * 12).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Depreciation Analysis */}
      {viewType === 'depreciation' && (
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Depreciation Analysis</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {((financialData.totalDepreciation / financialData.totalAssetValue) * 100).toFixed(1)}%
                </div>
                <div className="text-gray-600">Average Depreciation Rate</div>
              </div>

              <div className="space-y-4">
                {assets
                  .filter(asset => asset.depreciation)
                  .slice(0, 5)
                  .map((asset) => {
                    const depreciationRate = asset.depreciation ? 
                      ((asset.purchaseCost - asset.depreciation.currentValue) / asset.purchaseCost) * 100 : 0;
                    
                    return (
                      <div key={asset.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">{asset.name}</span>
                          <span className="text-sm text-gray-500">{depreciationRate.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-600 h-2 rounded-full"
                            style={{ width: `${depreciationRate}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Financial Reports Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Asset Financial Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Depreciation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TCO</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assets.slice(0, 10).map((asset) => {
                const currentValue = asset.depreciation?.currentValue || asset.purchaseCost || 0;
                const depreciation = (asset.purchaseCost || 0) - currentValue;
                const monthlyLease = asset.leaseInfo?.monthlyPayment || 0;
                const tco = (asset.purchaseCost || 0) + (monthlyLease * 36); // 3-year TCO estimate

                return (
                  <tr key={asset.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                        <div className="text-sm text-gray-500">{asset.tag}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${(asset.purchaseCost || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${currentValue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                      -${depreciation.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${monthlyLease.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${tco.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}