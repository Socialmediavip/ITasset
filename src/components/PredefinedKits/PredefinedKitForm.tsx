import React, { useState } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { PredefinedKit, Asset, Accessory, License, Consumable } from '../../types';

interface PredefinedKitFormProps {
  kit?: PredefinedKit;
  onSave: (kit: Omit<PredefinedKit, 'id'>) => void;
  onCancel: () => void;
  availableAssets: Asset[];
  availableAccessories: Accessory[];
  availableLicenses: License[];
  availableConsumables: Consumable[];
}

export default function PredefinedKitForm({ 
  kit, 
  onSave, 
  onCancel, 
  availableAssets,
  availableAccessories,
  availableLicenses,
  availableConsumables
}: PredefinedKitFormProps) {
  const [formData, setFormData] = useState({
    name: kit?.name || '',
    description: kit?.description || '',
    category: kit?.category || '',
    assets: kit?.assets || [],
    accessories: kit?.accessories || [],
    licenses: kit?.licenses || [],
    consumables: kit?.consumables || [],
    createdDate: kit?.createdDate || new Date().toISOString()
  });

  const [activeTab, setActiveTab] = useState('details');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addItem = (type: 'assets' | 'accessories' | 'licenses' | 'consumables', itemId: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], itemId]
    }));
  };

  const removeItem = (type: 'assets' | 'accessories' | 'licenses' | 'consumables', itemId: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter(id => id !== itemId)
    }));
  };

  const getItemName = (type: 'assets' | 'accessories' | 'licenses' | 'consumables', itemId: string) => {
    switch (type) {
      case 'assets':
        return availableAssets.find(item => item.id === itemId)?.name || 'Unknown Asset';
      case 'accessories':
        return availableAccessories.find(item => item.id === itemId)?.name || 'Unknown Accessory';
      case 'licenses':
        return availableLicenses.find(item => item.id === itemId)?.name || 'Unknown License';
      case 'consumables':
        return availableConsumables.find(item => item.id === itemId)?.name || 'Unknown Consumable';
      default:
        return 'Unknown Item';
    }
  };

  const tabs = [
    { id: 'details', label: 'Kit Details' },
    { id: 'assets', label: 'Assets' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'licenses', label: 'Licenses' },
    { id: 'consumables', label: 'Consumables' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {kit ? 'Edit Predefined Kit' : 'Create New Predefined Kit'}
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
                  className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <form onSubmit={handleSubmit}>
              {activeTab === 'details' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kit Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      <option value="New Employee">New Employee</option>
                      <option value="Developer">Developer</option>
                      <option value="Designer">Designer</option>
                      <option value="Manager">Manager</option>
                      <option value="Remote Worker">Remote Worker</option>
                      <option value="Temporary">Temporary</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'assets' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Selected Assets</h3>
                    <span className="text-sm text-gray-500">{formData.assets.length} selected</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Available Assets</h4>
                      <div className="border border-gray-300 rounded-md max-h-64 overflow-y-auto">
                        {availableAssets.filter(asset => !formData.assets.includes(asset.id)).map(asset => (
                          <div key={asset.id} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{asset.name}</p>
                              <p className="text-xs text-gray-500">{asset.tag} - {asset.category}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => addItem('assets', asset.id)}
                              className="text-indigo-600 hover:text-indigo-500"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Assets</h4>
                      <div className="border border-gray-300 rounded-md max-h-64 overflow-y-auto">
                        {formData.assets.map(assetId => (
                          <div key={assetId} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0">
                            <span className="text-sm text-gray-900">{getItemName('assets', assetId)}</span>
                            <button
                              type="button"
                              onClick={() => removeItem('assets', assetId)}
                              className="text-red-600 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'accessories' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Selected Accessories</h3>
                    <span className="text-sm text-gray-500">{formData.accessories.length} selected</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Available Accessories</h4>
                      <div className="border border-gray-300 rounded-md max-h-64 overflow-y-auto">
                        {availableAccessories.filter(accessory => !formData.accessories.includes(accessory.id)).map(accessory => (
                          <div key={accessory.id} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{accessory.name}</p>
                              <p className="text-xs text-gray-500">{accessory.category} - {accessory.manufacturer}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => addItem('accessories', accessory.id)}
                              className="text-indigo-600 hover:text-indigo-500"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Accessories</h4>
                      <div className="border border-gray-300 rounded-md max-h-64 overflow-y-auto">
                        {formData.accessories.map(accessoryId => (
                          <div key={accessoryId} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0">
                            <span className="text-sm text-gray-900">{getItemName('accessories', accessoryId)}</span>
                            <button
                              type="button"
                              onClick={() => removeItem('accessories', accessoryId)}
                              className="text-red-600 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'licenses' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Selected Licenses</h3>
                    <span className="text-sm text-gray-500">{formData.licenses.length} selected</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Available Licenses</h4>
                      <div className="border border-gray-300 rounded-md max-h-64 overflow-y-auto">
                        {availableLicenses.filter(license => !formData.licenses.includes(license.id)).map(license => (
                          <div key={license.id} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{license.name}</p>
                              <p className="text-xs text-gray-500">{license.manufacturer} - {license.availableSeats}/{license.seats} seats</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => addItem('licenses', license.id)}
                              className="text-indigo-600 hover:text-indigo-500"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Licenses</h4>
                      <div className="border border-gray-300 rounded-md max-h-64 overflow-y-auto">
                        {formData.licenses.map(licenseId => (
                          <div key={licenseId} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0">
                            <span className="text-sm text-gray-900">{getItemName('licenses', licenseId)}</span>
                            <button
                              type="button"
                              onClick={() => removeItem('licenses', licenseId)}
                              className="text-red-600 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'consumables' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Selected Consumables</h3>
                    <span className="text-sm text-gray-500">{formData.consumables.length} selected</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Available Consumables</h4>
                      <div className="border border-gray-300 rounded-md max-h-64 overflow-y-auto">
                        {availableConsumables.filter(consumable => !formData.consumables.includes(consumable.id)).map(consumable => (
                          <div key={consumable.id} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0">
                            <div>
                              <p className="text-sm font-medium text-gray-900">{consumable.name}</p>
                              <p className="text-xs text-gray-500">{consumable.category} - Qty: {consumable.quantity}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => addItem('consumables', consumable.id)}
                              className="text-indigo-600 hover:text-indigo-500"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Consumables</h4>
                      <div className="border border-gray-300 rounded-md max-h-64 overflow-y-auto">
                        {formData.consumables.map(consumableId => (
                          <div key={consumableId} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0">
                            <span className="text-sm text-gray-900">{getItemName('consumables', consumableId)}</span>
                            <button
                              type="button"
                              onClick={() => removeItem('consumables', consumableId)}
                              className="text-red-600 hover:text-red-500"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
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
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{kit ? 'Update' : 'Create'} Kit</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}