import React, { useState } from 'react';
import { X, Save, Upload, MapPin, Calendar, DollarSign, Shield, Wrench } from 'lucide-react';
import { Asset, AssetCategory, AssetStatus, LifecycleStage, DepreciationMethod, WarrantyStatus } from '../../types';

interface EnhancedAssetFormProps {
  asset?: Asset;
  onSave: (asset: Omit<Asset, 'id'>) => void;
  onCancel: () => void;
  availableUsers?: Array<{ id: string; firstName: string; lastName: string; }>;
}

export default function EnhancedAssetForm({ asset, onSave, onCancel, availableUsers = [] }: EnhancedAssetFormProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    name: asset?.name || '',
    tag: asset?.tag || '',
    category: asset?.category || 'Desktop' as AssetCategory,
    subcategory: asset?.subcategory || '',
    model: asset?.model || '',
    manufacturer: asset?.manufacturer || '',
    serialNumber: asset?.serialNumber || '',
    status: asset?.status || 'Active' as AssetStatus,
    assignedTo: asset?.assignedTo || '',
    assignedDepartment: asset?.assignedDepartment || '',
    location: {
      building: asset?.location?.building || '',
      floor: asset?.location?.floor || '',
      room: asset?.location?.room || '',
      rack: asset?.location?.rack || '',
      position: asset?.location?.position || '',
      address: asset?.location?.address || '',
      isRemote: asset?.location?.isRemote || false
    },
    purchaseDate: asset?.purchaseDate || '',
    purchaseCost: asset?.purchaseCost || 0,
    warrantyExpiry: asset?.warrantyExpiry || '',
    warrantyStatus: asset?.warrantyStatus || 'Active' as WarrantyStatus,
    notes: asset?.notes || '',
    lifecycle: {
      procurementDate: asset?.lifecycle?.procurementDate || '',
      deploymentDate: asset?.lifecycle?.deploymentDate || '',
      stage: asset?.lifecycle?.stage || 'Procurement' as LifecycleStage,
      nextStageDate: asset?.lifecycle?.nextStageDate || ''
    },
    barcode: asset?.barcode || '',
    qrCode: asset?.qrCode || '',
    specifications: asset?.specifications || {},
    depreciation: {
      method: asset?.depreciation?.method || 'Straight Line' as DepreciationMethod,
      usefulLife: asset?.depreciation?.usefulLife || 5,
      salvageValue: asset?.depreciation?.salvageValue || 0,
      currentValue: asset?.depreciation?.currentValue || 0,
      depreciationRate: asset?.depreciation?.depreciationRate || 20,
      lastCalculated: asset?.depreciation?.lastCalculated || new Date().toISOString()
    },
    leaseInfo: asset?.leaseInfo ? {
      lessor: asset.leaseInfo.lessor,
      leaseStart: asset.leaseInfo.leaseStart,
      leaseEnd: asset.leaseInfo.leaseEnd,
      monthlyPayment: asset.leaseInfo.monthlyPayment,
      totalLeaseValue: asset.leaseInfo.totalLeaseValue,
      buyoutOption: asset.leaseInfo.buyoutOption,
      autoRenewal: asset.leaseInfo.autoRenewal
    } : undefined,
    supportContract: asset?.supportContract ? {
      id: asset.supportContract.id,
      vendor: asset.supportContract.vendor,
      contractNumber: asset.supportContract.contractNumber,
      startDate: asset.supportContract.startDate,
      endDate: asset.supportContract.endDate,
      supportLevel: asset.supportContract.supportLevel,
      responseTime: asset.supportContract.responseTime,
      cost: asset.supportContract.cost,
      renewalDate: asset.supportContract.renewalDate,
      autoRenewal: asset.supportContract.autoRenewal,
      contactInfo: asset.supportContract.contactInfo
    } : undefined,
    custodianHistory: asset?.custodianHistory || [],
    maintenanceRecords: asset?.maintenanceRecords || [],
    complianceStatus: asset?.complianceStatus || 'Compliant',
    discoverySource: asset?.discoverySource || '',
    lastAuditDate: asset?.lastAuditDate || '',
    nextMaintenanceDate: asset?.nextMaintenanceDate || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
                   type === 'number' ? parseFloat(value) || 0 : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
                type === 'number' ? parseFloat(value) || 0 : value
      }));
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: <Shield className="w-4 h-4" /> },
    { id: 'location', label: 'Location', icon: <MapPin className="w-4 h-4" /> },
    { id: 'lifecycle', label: 'Lifecycle', icon: <Calendar className="w-4 h-4" /> },
    { id: 'financial', label: 'Financial', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'maintenance', label: 'Maintenance', icon: <Wrench className="w-4 h-4" /> }
  ];

  const assetCategories: AssetCategory[] = [
    'Desktop', 'Laptop', 'Server', 'Mobile Device', 'Printer', 'Peripheral', 'Network Equipment'
  ];

  const assetStatuses: AssetStatus[] = [
    'Active', 'In Repair', 'In Stock', 'Retired', 'Disposed', 'Lost', 'Stolen'
  ];

  const lifecycleStages: LifecycleStage[] = [
    'Procurement', 'Deployment', 'Active', 'Maintenance', 'Decommissioning', 'Disposal'
  ];

  const depreciationMethods: DepreciationMethod[] = [
    'Straight Line', 'Declining Balance', 'Sum of Years', 'Units of Production'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {asset ? 'Edit Asset' : 'Create New Asset'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex">
          <div className="w-64 bg-gray-50 border-r border-gray-200">
            <nav className="p-4 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <form onSubmit={handleSubmit}>
              {activeTab === 'basic' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Asset Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Asset Tag *
                      </label>
                      <input
                        type="text"
                        name="tag"
                        value={formData.tag}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {assetCategories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subcategory
                      </label>
                      <input
                        type="text"
                        name="subcategory"
                        value={formData.subcategory}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Manufacturer
                      </label>
                      <input
                        type="text"
                        name="manufacturer"
                        value={formData.manufacturer}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Model
                      </label>
                      <input
                        type="text"
                        name="model"
                        value={formData.model}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Serial Number
                      </label>
                      <input
                        type="text"
                        name="serialNumber"
                        value={formData.serialNumber}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {assetStatuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assigned To
                      </label>
                      <select
                        name="assignedTo"
                        value={formData.assignedTo}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select a user...</option>
                        {availableUsers.map(user => (
                          <option key={user.id} value={user.id}>
                            {user.firstName} {user.lastName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assigned Department
                      </label>
                      <input
                        type="text"
                        name="assignedDepartment"
                        value={formData.assignedDepartment}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Barcode
                      </label>
                      <input
                        type="text"
                        name="barcode"
                        value={formData.barcode}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        QR Code
                      </label>
                      <input
                        type="text"
                        name="qrCode"
                        value={formData.qrCode}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'location' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Location Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Building *
                      </label>
                      <input
                        type="text"
                        name="location.building"
                        value={formData.location.building}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Floor
                      </label>
                      <input
                        type="text"
                        name="location.floor"
                        value={formData.location.floor}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Room
                      </label>
                      <input
                        type="text"
                        name="location.room"
                        value={formData.location.room}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rack
                      </label>
                      <input
                        type="text"
                        name="location.rack"
                        value={formData.location.rack}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Position
                      </label>
                      <input
                        type="text"
                        name="location.position"
                        value={formData.location.position}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <textarea
                        name="location.address"
                        value={formData.location.address}
                        onChange={handleChange}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          name="location.isRemote"
                          checked={formData.location.isRemote}
                          onChange={handleChange}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Remote Location</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'lifecycle' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Lifecycle Management</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Procurement Date
                      </label>
                      <input
                        type="date"
                        name="lifecycle.procurementDate"
                        value={formData.lifecycle.procurementDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deployment Date
                      </label>
                      <input
                        type="date"
                        name="lifecycle.deploymentDate"
                        value={formData.lifecycle.deploymentDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Stage
                      </label>
                      <select
                        name="lifecycle.stage"
                        value={formData.lifecycle.stage}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {lifecycleStages.map(stage => (
                          <option key={stage} value={stage}>{stage}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Next Stage Date
                      </label>
                      <input
                        type="date"
                        name="lifecycle.nextStageDate"
                        value={formData.lifecycle.nextStageDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Audit Date
                      </label>
                      <input
                        type="date"
                        name="lastAuditDate"
                        value={formData.lastAuditDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Next Maintenance Date
                      </label>
                      <input
                        type="date"
                        name="nextMaintenanceDate"
                        value={formData.nextMaintenanceDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'financial' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Financial Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Purchase Date
                      </label>
                      <input
                        type="date"
                        name="purchaseDate"
                        value={formData.purchaseDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Purchase Cost
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        name="purchaseCost"
                        value={formData.purchaseCost}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Depreciation Method
                      </label>
                      <select
                        name="depreciation.method"
                        value={formData.depreciation.method}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {depreciationMethods.map(method => (
                          <option key={method} value={method}>{method}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Useful Life (Years)
                      </label>
                      <input
                        type="number"
                        name="depreciation.usefulLife"
                        value={formData.depreciation.usefulLife}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Salvage Value
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        name="depreciation.salvageValue"
                        value={formData.depreciation.salvageValue}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Value
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        name="depreciation.currentValue"
                        value={formData.depreciation.currentValue}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'maintenance' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Warranty & Support</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Warranty Expiry
                      </label>
                      <input
                        type="date"
                        name="warrantyExpiry"
                        value={formData.warrantyExpiry}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Warranty Status
                      </label>
                      <select
                        name="warrantyStatus"
                        value={formData.warrantyStatus}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Active">Active</option>
                        <option value="Expired">Expired</option>
                        <option value="Expiring Soon">Expiring Soon</option>
                        <option value="Not Applicable">Not Applicable</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discovery Source
                      </label>
                      <input
                        type="text"
                        name="discoverySource"
                        value={formData.discoverySource}
                        onChange={handleChange}
                        placeholder="e.g., SCCM, Lansweeper, Manual"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Compliance Status
                      </label>
                      <select
                        name="complianceStatus"
                        value={formData.complianceStatus}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Compliant">Compliant</option>
                        <option value="Non-Compliant">Non-Compliant</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Remediation Required">Remediation Required</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 mt-6">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{asset ? 'Update' : 'Create'} Asset</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}