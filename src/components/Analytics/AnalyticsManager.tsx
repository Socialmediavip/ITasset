import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, PieChart, Activity, Calendar, DollarSign, Users, Monitor } from 'lucide-react';
import apiService from '../../services/api';

interface AnalyticsManagerProps {
  assets: any[];
  licenses: any[];
  accessories: any[];
  consumables: any[];
  components: any[];
  users: any[];
}

export default function AnalyticsManager({
  assets,
  licenses,
  accessories,
  consumables,
  components,
  users
}: AnalyticsManagerProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('assets');
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadAnalyticsData();
    
    // Set up real-time refresh every 2 minutes
    const interval = setInterval(() => {
      loadAnalyticsData();
    }, 120000);
    
    setRefreshInterval(interval);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedPeriod, selectedMetric]);

  const loadAnalyticsData = async () => {
    setLoading(true);
    try {
      const response = await apiService.getAnalyticsOverview({ period: selectedPeriod, metric: selectedMetric });
      if (response.data) {
        setAnalyticsData(response.data);
      } else {
        calculateAnalyticsMetrics();
      }
    } catch (error) {
      console.warn('Failed to load analytics data, calculating locally');
      calculateAnalyticsMetrics();
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalyticsMetrics = () => {
    const totalAssetValue = assets.reduce((sum, asset) => sum + (asset.purchaseCost || 0), 0);
    const averageAssetAge = assets.length > 0 ? 
      assets.reduce((sum, asset) => {
        const purchaseDate = new Date(asset.purchaseDate || Date.now());
        const ageInDays = (Date.now() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24);
        return sum + ageInDays;
      }, 0) / assets.length : 0;

    const assetsByCategory = assets.reduce((acc, asset) => {
      acc[asset.category] = (acc[asset.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const assetsByStatus = assets.reduce((acc, asset) => {
      acc[asset.status] = (acc[asset.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const utilizationRate = assets.length > 0 ? 
      (assets.filter(a => a.status === 'Active' || a.status === 'Assigned').length / assets.length) * 100 : 0;

    const licenseUtilization = licenses.map(license => ({
      name: license.name,
      total: license.seats,
      used: license.seats - license.availableSeats,
      utilization: ((license.seats - license.availableSeats) / license.seats) * 100
    }));

    const costByCategory = {
      assets: totalAssetValue,
      licenses: licenses.reduce((sum, l) => sum + (l.cost || 0), 0),
      accessories: accessories.reduce((sum, a) => sum + (a.purchaseCost || 0), 0),
      components: components.reduce((sum, c) => sum + (c.purchaseCost || 0), 0)
    };

    setAnalyticsData({
      totalAssetValue,
      averageAssetAge,
      assetsByCategory,
      assetsByStatus,
      utilizationRate,
      licenseUtilization,
      costByCategory,
      totalAssets: assets.length,
      totalLicenses: licenses.length,
      totalUsers: users.length
    });
  };

  if (!analyticsData) {
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
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Insights</h1>
          <p className="text-gray-600">Comprehensive analytics and reporting for IT asset management</p>
          <p className="text-xs text-gray-500 mt-1">Auto-refresh: 2min</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="assets">Assets</option>
            <option value="licenses">Licenses</option>
            <option value="financial">Financial</option>
            <option value="utilization">Utilization</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">${analyticsData.totalAssetValue.toLocaleString()}</div>
              <div className="text-blue-100">Total Asset Value</div>
            </div>
            <DollarSign className="w-8 h-8 text-blue-200" />
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-sm">+12% from last month</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{analyticsData.utilizationRate.toFixed(1)}%</div>
              <div className="text-green-100">Asset Utilization</div>
            </div>
            <Activity className="w-8 h-8 text-green-200" />
          </div>
          <div className="mt-4 flex items-center">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span className="text-sm">+5% from last month</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{Math.round(analyticsData.averageAssetAge)}</div>
              <div className="text-purple-100">Avg Asset Age (days)</div>
            </div>
            <Calendar className="w-8 h-8 text-purple-200" />
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm">Across all categories</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl font-bold">{licenses.reduce((sum, l) => sum + l.seats, 0)}</div>
              <div className="text-orange-100">Total License Seats</div>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-200" />
          </div>
          <div className="mt-4 flex items-center">
            <span className="text-sm">{licenses.reduce((sum, l) => sum + l.availableSeats, 0)} available</span>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Asset Distribution by Category */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Assets by Category</h3>
          <div className="space-y-4">
            {Object.entries(analyticsData.assetsByCategory).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-gray-700">{category}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(count / analyticsData.totalAssets) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Asset Status Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Assets by Status</h3>
          <div className="space-y-4">
            {Object.entries(analyticsData.assetsByStatus).map(([status, count]) => {
              const percentage = (count / analyticsData.totalAssets) * 100;
              const getStatusColor = (status: string) => {
                switch (status) {
                  case 'Active': return 'bg-green-600';
                  case 'Assigned': return 'bg-blue-600';
                  case 'In Repair': return 'bg-yellow-600';
                  case 'Retired': return 'bg-red-600';
                  default: return 'bg-gray-600';
                }
              };

              return (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-gray-700">{status}</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getStatusColor(status)}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cost Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Distribution</h3>
          <div className="space-y-4">
            {Object.entries(analyticsData.costByCategory).map(([category, cost]) => {
              const totalCost = Object.values(analyticsData.costByCategory).reduce((sum: number, val: any) => sum + val, 0);
              const percentage = (cost / totalCost) * 100;
              
              return (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-700 capitalize">{category}</span>
                    <span className="text-sm text-gray-500">${cost.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* License Utilization */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">License Utilization</h3>
          <div className="space-y-4">
            {analyticsData.licenseUtilization.slice(0, 5).map((license: any) => (
              <div key={license.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">{license.name}</span>
                  <span className="text-sm text-gray-500">
                    {license.used}/{license.total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      license.utilization > 90 ? 'bg-red-600' : 
                      license.utilization > 75 ? 'bg-yellow-600' : 'bg-green-600'
                    }`}
                    style={{ width: `${license.utilization}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Analytics Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Asset Categories by Value */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Categories by Value</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {Object.entries(
                assets.reduce((acc, asset) => {
                  const category = asset.category;
                  acc[category] = (acc[category] || 0) + (asset.purchaseCost || 0);
                  return acc;
                }, {} as Record<string, number>)
              )
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([category, value]) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-gray-700">{category}</span>
                    <span className="text-lg font-semibold text-gray-900">${value.toLocaleString()}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Usage Trends */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Usage Trends</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Monitor className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">Active Assets</span>
                </div>
                <span className="font-bold text-blue-600">
                  {assets.filter(a => a.status === 'Active').length}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-900">Assigned Assets</span>
                </div>
                <span className="font-bold text-green-600">
                  {assets.filter(a => a.assignedTo).length}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-900">In Maintenance</span>
                </div>
                <span className="font-bold text-yellow-600">
                  {assets.filter(a => a.status === 'In Repair').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}