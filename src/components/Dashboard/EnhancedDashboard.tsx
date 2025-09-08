import React from 'react';
import { 
  HardDrive, 
  KeyRound, 
  Headphones, 
  Beaker, 
  Cpu, 
  Users, 
  AlertTriangle,
  Shield,
  Calendar,
  DollarSign,
  TrendingUp,
  Activity
} from 'lucide-react';
import MetricCard from './MetricCard';
import QuickActions from './QuickActions';
import { DashboardMetrics } from '../../types';

interface EnhancedDashboardProps {
  metrics: DashboardMetrics;
  onSectionChange: (section: string) => void;
  onCreateNew: (type: string) => void;
}

export default function EnhancedDashboard({ metrics, onSectionChange, onCreateNew }: EnhancedDashboardProps) {
  const primaryMetrics = [
    {
      title: 'Total Assets',
      count: metrics.assets,
      color: 'text-teal-600',
      bgColor: 'bg-gradient-to-br from-teal-500 to-teal-600',
      icon: <HardDrive />,
      section: 'assets',
      change: '',
      trend: 'up'
    },
    {
      title: 'Software Licenses',
      count: metrics.licenses,
      color: 'text-pink-600',
      bgColor: 'bg-gradient-to-br from-pink-500 to-pink-600',
      icon: <KeyRound />,
      section: 'licenses',
      change: '',
      trend: 'up'
    },
    {
      title: 'Active Alerts',
      count: metrics.alerts || 0,
      color: 'text-red-600',
      bgColor: 'bg-gradient-to-br from-red-500 to-red-600',
      icon: <AlertTriangle />,
      section: 'alerts',
      change: '',
      trend: 'down'
    },
    {
      title: 'Total Value',
      count: `$${(metrics.totalValue || 0).toLocaleString()}`,
      color: 'text-green-600',
      bgColor: 'bg-gradient-to-br from-green-500 to-green-600',
      icon: <DollarSign />,
      section: 'financial',
      change: '',
      trend: 'up'
    }
  ];

  const secondaryMetrics = [
    {
      title: 'Accessories',
      count: metrics.accessories,
      color: 'text-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-500 to-orange-600',
      icon: <Headphones />,
      section: 'accessories'
    },
    {
      title: 'Consumables',
      count: metrics.consumables,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-500 to-purple-600',
      icon: <Beaker />,
      section: 'consumables'
    },
    {
      title: 'Components',
      count: metrics.components,
      color: 'text-yellow-600',
      bgColor: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
      icon: <Cpu />,
      section: 'components'
    },
    {
      title: 'People',
      count: metrics.people,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
      icon: <Users />,
      section: 'people'
    }
  ];

  const alertMetrics = [
    {
      title: 'Expiring Warranties',
      count: metrics.expiringWarranties || 0,
      icon: <Shield className="w-5 h-5" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Expiring Licenses',
      count: metrics.expiringLicenses || 0,
      icon: <KeyRound className="w-5 h-5" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Maintenance Due',
      count: metrics.maintenanceDue || 0,
      icon: <Calendar className="w-5 h-5" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Compliance Issues',
      count: metrics.complianceIssues || 0,
      icon: <AlertTriangle className="w-5 h-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">IT Asset Management Dashboard</h1>
            <p className="text-gray-600">Comprehensive overview of your IT assets and operations</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Real-time data</p>
          </div>
        </div>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {primaryMetrics.map((card) => (
          <div key={card.title} className={`${card.bgColor} rounded-lg p-6 text-white relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow`}
               onClick={() => onSectionChange(card.section)}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold mb-2">{card.count}</div>
                <div className="text-lg font-medium">{card.title}</div>
                {card.change && (
                  <div className="flex items-center mt-2">
                    <TrendingUp className={`w-4 h-4 mr-1 ${card.trend === 'up' ? 'text-green-200' : 'text-red-200'}`} />
                    <span className="text-sm opacity-90">{card.change} from last month</span>
                  </div>
                )}
              </div>
              <div className="text-white/20 text-5xl">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alert Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {alertMetrics.map((alert) => (
          <div key={alert.title} className={`${alert.bgColor} rounded-lg p-4 border border-gray-200`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-2xl font-bold ${alert.color} mb-1`}>{alert.count}</div>
                <div className="text-sm font-medium text-gray-700">{alert.title}</div>
              </div>
              <div className={alert.color}>
                {alert.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {secondaryMetrics.map((card) => (
          <MetricCard
            key={card.title}
            title={card.title}
            count={card.count}
            color={card.color}
            bgColor={card.bgColor}
            icon={card.icon}
            onViewAll={() => onSectionChange(card.section)}
          />
        ))}
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <QuickActions onCreateNew={onCreateNew} />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
              <Activity className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">New laptop deployed</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Warranty expiring soon</p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
              <Shield className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Security scan completed</p>
                <p className="text-xs text-gray-500">6 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Getting Started Guide */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Getting Started</h2>
        <p className="text-gray-700 mb-4">
          Welcome to your comprehensive IT Asset Management system. Here's what you can do:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-md">
            <h3 className="font-medium text-gray-900 mb-2">Hardware Assets</h3>
            <p className="text-sm text-gray-600 mb-3">Manage desktops, laptops, servers, mobile devices, and networking equipment.</p>
            <button 
              onClick={() => onCreateNew('asset')}
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              Add Hardware Asset →
            </button>
          </div>
          
          <div className="bg-white p-4 rounded-md">
            <h3 className="font-medium text-gray-900 mb-2">Software Licenses</h3>
            <p className="text-sm text-gray-600 mb-3">Track installed software, licenses, and SaaS subscriptions.</p>
            <button 
              onClick={() => onCreateNew('license')}
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              Add Software License →
            </button>
          </div>
          
          <div className="bg-white p-4 rounded-md">
            <h3 className="font-medium text-gray-900 mb-2">Asset Lifecycle</h3>
            <p className="text-sm text-gray-600 mb-3">Monitor procurement, deployment, maintenance, and disposal.</p>
            <button 
              onClick={() => onSectionChange('reports')}
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              View Lifecycle Reports →
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-orange-100 border-l-4 border-orange-500 rounded-md">
          <p className="text-orange-700">
            <strong>Pro Tip:</strong> Start by importing your existing assets using the Import feature, 
            or create predefined kits for common deployment scenarios.
          </p>
        </div>
      </div>
    </div>
  );
}