import React, { useState, useEffect } from 'react';
import { Plus, Settings, Trash2, Edit, RefreshCw, Database, Cloud, Server, Users, DollarSign, Shield } from 'lucide-react';
import supabaseService from '../../services/supabaseService';

interface Integration {
  id: string;
  name: string;
  type: string;
  endpoint: string;
  apiKey: string;
  lastSync: string;
  syncFrequency: string;
  status: string;
  mappings: any[];
  errorLog: any[];
  createdAt: string;
  updatedAt: string;
}

const IntegrationsManager: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState<Integration | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Discovery Tool',
    endpoint: '',
    apiKey: '',
    syncFrequency: 'Daily',
    status: 'Active',
    mappings: [],
    errorLog: []
  });

  const integrationTypes = [
    { value: 'Discovery Tool', label: 'Discovery Tool', icon: Database, description: 'Network discovery and asset scanning tools (e.g., Lansweeper, ManageEngine AssetExplorer)' },
    { value: 'ITSM', label: 'IT Service Management', icon: Settings, description: 'Service management platforms (e.g., ServiceNow, Remedy, Jira Service Management)' },
    { value: 'Cloud Provider', label: 'Cloud Provider', icon: Cloud, description: 'Cloud infrastructure providers (e.g., AWS, Azure, Google Cloud)' },
    { value: 'Directory Service', label: 'Directory Service', icon: Users, description: 'Identity and directory services (e.g., Active Directory, LDAP, Okta)' },
    { value: 'Financial System', label: 'Financial System', icon: DollarSign, description: 'Financial and procurement systems (e.g., SAP, Oracle Financials, Workday)' },
    { value: 'Security Tool', label: 'Security Tool', icon: Shield, description: 'Security and vulnerability management tools (e.g., Qualys, Nessus, Rapid7)' },
    { value: 'Monitoring Tool', label: 'Monitoring Tool', icon: Server, description: 'Infrastructure monitoring and management tools (e.g., SCCM, Nagios, SolarWinds)' }
  ];

  const syncFrequencies = ['Real-time', 'Hourly', 'Daily', 'Weekly', 'Monthly'];

  useEffect(() => {
    loadIntegrations();
  }, []);

  const loadIntegrations = async () => {
    try {
      setLoading(true);
      const data = await supabaseService.getIntegrations();
      if (data) {
        const transformedData = data.map(integration => ({
          ...integration,
          lastSync: integration.last_sync,
          syncFrequency: integration.sync_frequency,
          errorLog: integration.error_log,
          createdAt: integration.created_at,
          updatedAt: integration.updated_at
        }));
        setIntegrations(transformedData);
      }
    } catch (error) {
      console.error('Failed to load integrations:', error);
      setIntegrations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateIntegration = async (data: any) => {
    try {
      const response = await supabaseService.createIntegration({
        name: data.name,
        type: data.type,
        endpoint: data.endpoint,
        api_key: data.apiKey,
        sync_frequency: data.syncFrequency,
        status: data.status,
        mappings: data.mappings,
        error_log: data.errorLog
      });
      
      if (response) {
        const newIntegration = {
          ...response,
          lastSync: response.last_sync,
          syncFrequency: response.sync_frequency,
          errorLog: response.error_log,
          createdAt: response.created_at,
          updatedAt: response.updated_at
        };
        setIntegrations(prev => [...prev, newIntegration]);
      }
    } catch (error) {
      console.error('Failed to create integration:', error);
    }
  };

  const handleUpdateIntegration = async (id: string, updates: Partial<Integration>) => {
    try {
      const response = await supabaseService.updateIntegration(id, {
        name: updates.name,
        type: updates.type,
        endpoint: updates.endpoint,
        api_key: updates.apiKey,
        sync_frequency: updates.syncFrequency,
        status: updates.status,
        mappings: updates.mappings,
        error_log: updates.errorLog
      });
      
      if (response) {
        setIntegrations(prev => prev.map(integration => 
          integration.id === id ? { ...integration, ...updates } : integration
        ));
      }
    } catch (error) {
      console.error('Failed to update integration:', error);
    }
  };

  const handleDeleteIntegration = async (id: string) => {
    if (!confirm('Are you sure you want to delete this integration?')) return;
    
    try {
      await supabaseService.deleteIntegration(id);
      setIntegrations(prev => prev.filter(integration => integration.id !== id));
    } catch (error) {
      console.error('Failed to delete integration:', error);
    }
  };

  const handleSyncIntegration = async (id: string) => {
    try {
      await supabaseService.updateIntegration(id, {
        last_sync: new Date().toISOString()
      });
      setIntegrations(prev => prev.map(integration => 
        integration.id === id 
          ? { ...integration, lastSync: new Date().toISOString() }
          : integration
      ));
    } catch (error) {
      console.error('Failed to sync integration:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingIntegration) {
      await handleUpdateIntegration(editingIntegration.id, formData);
    } else {
      await handleCreateIntegration(formData);
    }
    
    setShowForm(false);
    setEditingIntegration(null);
    setFormData({
      name: '',
      type: 'Discovery Tool',
      endpoint: '',
      apiKey: '',
      syncFrequency: 'Daily',
      status: 'Active',
      mappings: [],
      errorLog: []
    });
  };

  const handleEdit = (integration: Integration) => {
    setEditingIntegration(integration);
    setFormData({
      name: integration.name,
      type: integration.type,
      endpoint: integration.endpoint,
      apiKey: integration.apiKey,
      syncFrequency: integration.syncFrequency,
      status: integration.status,
      mappings: integration.mappings,
      errorLog: integration.errorLog
    });
    setShowForm(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'Error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    const typeConfig = integrationTypes.find(t => t.value === type);
    return typeConfig ? typeConfig.icon : Database;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
          <p className="text-gray-600 mt-1">Connect and manage external systems and data sources</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">Auto-refresh: 5 min</span>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Integration</span>
          </button>
        </div>
      </div>

      {integrations.length === 0 ? (
        <div className="text-center py-12">
          <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No integrations configured</h3>
          <p className="text-gray-500 mb-4">Connect external systems to automatically sync asset data</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add Your First Integration
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => {
            const IconComponent = getTypeIcon(integration.type);
            return (
              <div key={integration.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <IconComponent className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{integration.name}</h3>
                      <p className="text-sm text-gray-500">{integration.type}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                    {integration.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Last Sync:</span>
                    <span className="text-gray-900">
                      {integration.lastSync ? new Date(integration.lastSync).toLocaleDateString() : 'Never'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Frequency:</span>
                    <span className="text-gray-900">{integration.syncFrequency}</span>
                  </div>
                  {integration.errorLog && integration.errorLog.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Errors:</span>
                      <span className="text-red-600">{integration.errorLog.length}</span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSyncIntegration(integration.id)}
                    className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 flex items-center justify-center space-x-1"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Sync</span>
                  </button>
                  <button
                    onClick={() => handleEdit(integration)}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteIntegration(integration.id)}
                    className="p-2 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {editingIntegration ? 'Edit Integration' : 'Add Integration'}
              </h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingIntegration(null);
                  setFormData({
                    name: '',
                    type: 'Discovery Tool',
                    endpoint: '',
                    apiKey: '',
                    syncFrequency: 'Daily',
                    status: 'Active',
                    mappings: [],
                    errorLog: []
                  });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Integration Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., SCCM Production, ServiceNow ITSM"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Integration Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {integrationTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {formData.type && (
                  <p className="text-xs text-gray-500 mt-1">
                    {integrationTypes.find(t => t.value === formData.type)?.description}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Endpoint *
                </label>
                <input
                  type="url"
                  value={formData.endpoint}
                  onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://api.example.com/v1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  API Key / Token *
                </label>
                <input
                  type="password"
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter API key or authentication token"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sync Frequency
                </label>
                <select
                  value={formData.syncFrequency}
                  onChange={(e) => setFormData({ ...formData, syncFrequency: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {syncFrequencies.map(freq => (
                    <option key={freq} value={freq}>{freq}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingIntegration(null);
                    setFormData({
                      name: '',
                      type: 'Discovery Tool',
                      endpoint: '',
                      apiKey: '',
                      syncFrequency: 'Daily',
                      status: 'Active',
                      mappings: [],
                      errorLog: []
                    });
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingIntegration ? 'Update' : 'Create'} Integration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationsManager;