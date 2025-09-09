import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, CheckCircle, X, Filter, Search, MoreVertical } from 'lucide-react';
import supabaseService from '../../services/supabaseService';

interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  status: 'active' | 'acknowledged' | 'resolved' | 'dismissed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  updatedAt: string;
  category: string;
  assetId?: string;
  assetName?: string;
}

const AlertsManager: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([]);

  useEffect(() => {
    loadAlerts();
  }, [filter]);

  const loadAlerts = async () => {
    setLoading(true);
    try {
      const alertsData = await supabaseService.getAlerts();
      if (alertsData) {
        const transformedAlerts = alertsData.map(alert => ({
          id: alert.id,
          title: alert.title,
          message: alert.message,
          type: alert.type as Alert['type'],
          status: alert.status as Alert['status'],
          priority: alert.priority as Alert['priority'],
          createdAt: alert.created_at,
          updatedAt: alert.updated_at,
          category: alert.category,
          assetId: alert.asset_id,
          assetName: alert.asset_name
        }));
        setAlerts(transformedAlerts);
      } else {
        setAlerts([]);
      }
    } catch (error) {
      console.error('Failed to load alerts:', error);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAlertAction = async (alertId: string, action: 'acknowledge' | 'resolve' | 'dismiss') => {
    try {
      switch (action) {
        case 'acknowledge':
          await supabaseService.acknowledgeAlert(alertId);
          break;
        case 'resolve':
          await supabaseService.resolveAlert(alertId);
          break;
        case 'dismiss':
          await supabaseService.dismissAlert(alertId);
          break;
      }

      setAlerts(prev => prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: action === 'acknowledge' ? 'acknowledged' : action === 'resolve' ? 'resolved' : 'dismissed' }
          : alert
      ));
    } catch (error) {
      console.error(`Failed to ${action} alert:`, error);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedAlerts.length === 0) return;

    try {
      // Update each alert individually since we don't have bulk update in supabaseService
      for (const alertId of selectedAlerts) {
        if (action === 'acknowledge') {
          await supabaseService.acknowledgeAlert(alertId);
        } else if (action === 'resolve') {
          await supabaseService.resolveAlert(alertId);
        } else if (action === 'dismiss') {
          await supabaseService.dismissAlert(alertId);
        }
      }
      
      loadAlerts();
      setSelectedAlerts([]);
    } catch (error) {
      console.error('Failed to perform bulk action:', error);
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchesFilter = filter === 'all' || alert.status === filter;
    const matchesSearch = searchTerm === '' || 
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: Alert['priority']) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: Alert['status']) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'acknowledged':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'dismissed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Alerts & Notifications</h1>
            <p className="text-gray-600">Monitor and manage system alerts</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Filter:</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Alerts</option>
                <option value="active">Active</option>
                <option value="acknowledged">Acknowledged</option>
                <option value="resolved">Resolved</option>
                <option value="dismissed">Dismissed</option>
              </select>
            </div>

            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {selectedAlerts.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">{selectedAlerts.length} selected</span>
                <button
                  onClick={() => handleBulkAction('acknowledge')}
                  className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Acknowledge
                </button>
                <button
                  onClick={() => handleBulkAction('resolve')}
                  className="px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Resolve
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-3 mb-6">
          {filteredAlerts.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
              <p className="text-gray-600">
                {filter === 'all' ? 'No alerts to display' : `No ${filter} alerts found`}
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedAlerts.includes(alert.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAlerts(prev => [...prev, alert.id]);
                        } else {
                          setSelectedAlerts(prev => prev.filter(id => id !== alert.id));
                        }
                      }}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    
                    <div className="flex-shrink-0 mt-1">
                      {getAlertIcon(alert.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {alert.title}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(alert.priority)}`}>
                          {alert.priority}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(alert.status)}`}>
                          {alert.status}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                      
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Category: {alert.category}</span>
                        {alert.assetName && <span>Asset: {alert.assetName}</span>}
                        <span>Created: {new Date(alert.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {alert.status === 'active' && (
                      <>
                        <button
                          onClick={() => handleAlertAction(alert.id, 'acknowledge')}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Acknowledge"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleAlertAction(alert.id, 'resolve')}
                          className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Resolve"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={() => handleAlertAction(alert.id, 'dismiss')}
                      className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                      title="Dismiss"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    
                    <button className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Bell className="w-8 h-8 text-blue-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Total Alerts</p>
                <p className="text-2xl font-semibold text-gray-900">{alerts.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Active</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {alerts.filter(a => a.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Resolved</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {alerts.filter(a => a.status === 'resolved').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="w-8 h-8 text-yellow-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-500">Critical</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {alerts.filter(a => a.priority === 'critical').length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsManager;