import React, { useState, useEffect } from 'react';
import { Wrench, Calendar, AlertTriangle, CheckCircle, Clock, Plus, Edit, Trash2, User, DollarSign } from 'lucide-react';
import { MaintenanceRecord, MaintenanceType, MaintenanceStatus } from '../../types';
import apiService from '../../services/api';

interface MaintenanceManagerProps {
  assets: any[];
}

export default function MaintenanceManager({ assets }: MaintenanceManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState('');
  const [filterStatus, setFilterStatus] = useState<MaintenanceStatus | 'all'>('all');
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadMaintenanceData();
    
    // Set up real-time refresh every 45 seconds
    const interval = setInterval(() => {
      loadMaintenanceData();
    }, 45000);
    
    setRefreshInterval(interval);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  const loadMaintenanceData = async () => {
    setLoading(true);
    try {
      const maintenanceData = await supabaseService.getMaintenanceRecords();
      if (maintenanceData) {
        const transformedRecords = maintenanceData.map(record => ({
          id: record.id,
          date: record.date || new Date().toISOString(),
          type: record.type as MaintenanceType,
          description: record.description,
          cost: record.cost,
          vendor: record.vendor,
          technician: record.technician,
          status: record.status as MaintenanceStatus,
          scheduledDate: record.scheduled_date,
          completedDate: record.completed_date,
          nextMaintenanceDate: record.next_maintenance_date,
          partsUsed: record.parts_used,
          incidentId: record.incident_id,
          assetId: record.asset_id
        }));
        setMaintenanceRecords(transformedRecords);
      } else {
        generateSampleMaintenanceData();
      }
    } catch (error) {
      console.warn('Failed to load maintenance data, using sample data');
      generateSampleMaintenanceData();
    } finally {
      setLoading(false);
    }
  };

  const generateSampleMaintenanceData = () => {
    const sampleRecords: MaintenanceRecord[] = [
      {
        id: '1',
        date: new Date().toISOString(),
        type: 'Preventive',
        description: 'Quarterly server maintenance',
        cost: 500,
        vendor: 'TechCorp Solutions',
        technician: 'John Smith',
        status: 'Scheduled',
        scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        nextMaintenanceDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        partsUsed: ['Server RAM', 'Cooling Fan'],
        assetId: assets[0]?.id || '1'
      },
      {
        id: '2',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'Corrective',
        description: 'Laptop screen replacement',
        cost: 250,
        vendor: 'Laptop Repair Co',
        technician: 'Sarah Johnson',
        status: 'Completed',
        completedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        partsUsed: ['LCD Screen', 'Screen Cable'],
        assetId: assets[1]?.id || '2'
      },
      {
        id: '3',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'Emergency',
        description: 'Network switch failure repair',
        cost: 800,
        vendor: 'Network Solutions Inc',
        technician: 'Mike Wilson',
        status: 'Overdue',
        scheduledDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        partsUsed: ['Network Switch', 'Ethernet Cables'],
        assetId: assets[2]?.id || '3'
      }
    ];
    setMaintenanceRecords(sampleRecords);
  };

  const handleCreateMaintenance = async (maintenanceData: Omit<MaintenanceRecord, 'id'>) => {
    try {
      const response = await supabaseService.createMaintenanceRecord({
        asset_id: maintenanceData.assetId || null,
        date: maintenanceData.date,
        type: maintenanceData.type,
        description: maintenanceData.description,
        cost: maintenanceData.cost,
        vendor: maintenanceData.vendor,
        technician: maintenanceData.technician,
        status: maintenanceData.status,
        scheduled_date: maintenanceData.scheduledDate || null,
        completed_date: maintenanceData.completedDate || null,
        next_maintenance_date: maintenanceData.nextMaintenanceDate || null,
        parts_used: maintenanceData.partsUsed,
        incident_id: maintenanceData.incidentId || ''
      });
      
      if (response) {
        const transformedRecord: MaintenanceRecord = {
          id: response.id,
          date: response.date || new Date().toISOString(),
          type: response.type as MaintenanceType,
          description: response.description,
          cost: response.cost,
          vendor: response.vendor,
          technician: response.technician,
          status: response.status as MaintenanceStatus,
          scheduledDate: response.scheduled_date,
          completedDate: response.completed_date,
          nextMaintenanceDate: response.next_maintenance_date,
          partsUsed: response.parts_used,
          incidentId: response.incident_id,
          assetId: response.asset_id
        };
        setMaintenanceRecords(prev => [...prev, transformedRecord]);
      } else {
        const newRecord: MaintenanceRecord = {
          ...maintenanceData,
          id: Date.now().toString()
        };
        setMaintenanceRecords(prev => [...prev, newRecord]);
      }
    } catch (error) {
      console.warn('Failed to create maintenance record, using local state');
      const newRecord: MaintenanceRecord = {
        ...maintenanceData,
        id: Date.now().toString()
      };
      setMaintenanceRecords(prev => [...prev, newRecord]);
    }
    setShowForm(false);
  };

  const handleUpdateMaintenance = async (id: string, updates: Partial<MaintenanceRecord>) => {
    try {
      const supabaseUpdates: any = {};
      if (updates.status) supabaseUpdates.status = updates.status;
      if (updates.completedDate) supabaseUpdates.completed_date = updates.completedDate;
      if (updates.scheduledDate) supabaseUpdates.scheduled_date = updates.scheduledDate;
      
      await supabaseService.updateMaintenanceRecord(id, supabaseUpdates);
      
      setMaintenanceRecords(prev => prev.map(record => 
        record.id === id ? { ...record, ...updates } : record
      ));
    } catch (error) {
      console.warn('Failed to update maintenance record via Supabase, updating locally');
      setMaintenanceRecords(prev => prev.map(record => 
        record.id === id ? { ...record, ...updates } : record
      ));
    }
  };

  const handleDeleteMaintenance = async (id: string) => {
    if (!confirm('Are you sure you want to delete this maintenance record?')) return;
    
    try {
      await supabaseService.deleteMaintenanceRecord(id);
      
      setMaintenanceRecords(prev => prev.filter(record => record.id !== id));
    } catch (error) {
      console.warn('Failed to delete maintenance record via Supabase, updating locally');
      setMaintenanceRecords(prev => prev.filter(record => record.id !== id));
    }
  };


  const getStatusColor = (status: MaintenanceStatus) => {
    switch (status) {
      case 'Scheduled': return 'text-blue-600 bg-blue-100';
      case 'In Progress': return 'text-yellow-600 bg-yellow-100';
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'Cancelled': return 'text-gray-600 bg-gray-100';
      case 'Overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: MaintenanceStatus) => {
    switch (status) {
      case 'Scheduled': return <Calendar className="w-4 h-4" />;
      case 'In Progress': return <Clock className="w-4 h-4" />;
      case 'Completed': return <CheckCircle className="w-4 h-4" />;
      case 'Cancelled': return <AlertTriangle className="w-4 h-4" />;
      case 'Overdue': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredRecords = maintenanceRecords.filter(record => {
    const matchesAsset = !selectedAsset || record.assetId === selectedAsset;
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
    return matchesAsset && matchesStatus;
  });

  const upcomingMaintenance = maintenanceRecords.filter(record => 
    record.status === 'Scheduled' && 
    new Date(record.scheduledDate || record.date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );

  const overdueMaintenance = maintenanceRecords.filter(record => 
    record.status === 'Scheduled' && 
    new Date(record.scheduledDate || record.date) < new Date()
  );

  const totalMaintenanceCost = maintenanceRecords.reduce((sum, record) => sum + record.cost, 0);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maintenance & Repairs</h1>
          <p className="text-gray-600">Manage asset maintenance schedules and repair records</p>
          <p className="text-xs text-gray-500">Auto-refresh: 45s</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Maintenance</span>
        </button>
      </div>

      {/* Maintenance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {maintenanceRecords.filter(r => r.status === 'Scheduled').length}
              </div>
              <div className="text-sm font-medium text-blue-700">Scheduled</div>
            </div>
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-yellow-600">{upcomingMaintenance.length}</div>
              <div className="text-sm font-medium text-yellow-700">Due This Week</div>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-600">{overdueMaintenance.length}</div>
              <div className="text-sm font-medium text-red-700">Overdue</div>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">${totalMaintenanceCost.toLocaleString()}</div>
              <div className="text-sm font-medium text-green-700">Total Cost</div>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <select
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Assets</option>
              {assets.map(asset => (
                <option key={asset.id} value={asset.id}>{asset.name} ({asset.tag})</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as MaintenanceStatus | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>

        {/* Maintenance Records */}
        <div className="divide-y divide-gray-200">
          {filteredRecords.length === 0 ? (
            <div className="p-12 text-center">
              <Wrench className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No maintenance records found</h3>
              <p className="text-gray-500 mb-6">Schedule maintenance to keep your assets in optimal condition.</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Schedule First Maintenance
              </button>
            </div>
          ) : (
            filteredRecords.map((record) => {
              const asset = assets.find(a => a.id === record.assetId);
              return (
                <div key={record.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-md ${getStatusColor(record.status)}`}>
                        {getStatusIcon(record.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{record.description}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.status)}`}>
                            {record.status}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <p className="font-medium text-gray-700">Asset</p>
                            <p>{asset?.name} ({asset?.tag})</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">Type</p>
                            <p>{record.type}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">Vendor</p>
                            <p>{record.vendor}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">Cost</p>
                            <p>${record.cost.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-700">Technician</p>
                            <p>{record.technician}</p>
                          </div>
                          {record.scheduledDate && (
                            <div>
                              <p className="font-medium text-gray-700">Scheduled</p>
                              <p>{new Date(record.scheduledDate).toLocaleDateString()}</p>
                            </div>
                          )}
                          {record.completedDate && (
                            <div>
                              <p className="font-medium text-gray-700">Completed</p>
                              <p>{new Date(record.completedDate).toLocaleDateString()}</p>
                            </div>
                          )}
                          {record.nextMaintenanceDate && (
                            <div>
                              <p className="font-medium text-gray-700">Next Maintenance</p>
                              <p>{new Date(record.nextMaintenanceDate).toLocaleDateString()}</p>
                            </div>
                          )}
                        </div>
                        {record.partsUsed.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium text-gray-700">Parts Used:</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {record.partsUsed.map((part, index) => (
                                <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                  {part}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {record.status === 'Scheduled' && (
                        <button
                          onClick={() => handleUpdateMaintenance(record.id, { status: 'In Progress' })}
                          className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                        >
                          Start
                        </button>
                      )}
                      {record.status === 'In Progress' && (
                        <button
                          onClick={() => handleUpdateMaintenance(record.id, { 
                            status: 'Completed', 
                            completedDate: new Date().toISOString() 
                          })}
                          className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                        >
                          Complete
                        </button>
                      )}
                      <button
                        onClick={() => console.log('Edit maintenance:', record.id)}
                        className="text-blue-600 hover:text-blue-500 p-2"
                        title="Edit Maintenance"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMaintenance(record.id)}
                        className="text-red-600 hover:text-red-500 p-2"
                        title="Delete Maintenance"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Quick Schedule Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Schedule Maintenance</h2>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleCreateMaintenance({
                date: new Date().toISOString(),
                type: formData.get('type') as MaintenanceType,
                description: formData.get('description') as string,
                cost: parseFloat(formData.get('cost') as string) || 0,
                vendor: formData.get('vendor') as string,
                technician: formData.get('technician') as string,
                status: 'Scheduled',
                scheduledDate: formData.get('scheduledDate') as string,
                partsUsed: [],
                assetId: formData.get('assetId') as string
              });
            }} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asset</label>
                  <select name="assetId" required className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="">Select Asset</option>
                    {assets.map(asset => (
                      <option key={asset.id} value={asset.id}>{asset.name} ({asset.tag})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select name="type" required className="w-full px-3 py-2 border border-gray-300 rounded-md">
                    <option value="Preventive">Preventive</option>
                    <option value="Corrective">Corrective</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Upgrade">Upgrade</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date</label>
                  <input type="date" name="scheduledDate" required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
                  <input type="number" name="cost" step="0.01" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
                  <input type="text" name="vendor" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Technician</label>
                  <input type="text" name="technician" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" required rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
              </div>
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}