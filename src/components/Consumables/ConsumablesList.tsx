import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Beaker, AlertTriangle } from 'lucide-react';
import { Consumable } from '../../types';

interface ConsumablesListProps {
  consumables: Consumable[];
  onCreateNew: () => void;
  onEdit: (consumable: Consumable) => void;
  onDelete: (consumableId: string) => void;
  onView: (consumable: Consumable) => void;
}

export default function ConsumablesList({ consumables, onCreateNew, onEdit, onDelete, onView }: ConsumablesListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConsumables = consumables.filter(consumable =>
    consumable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consumable.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    consumable.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getQuantityStatus = (quantity: number, minQuantity: number) => {
    if (quantity <= minQuantity) {
      return { color: 'text-red-600', status: 'Low Stock', icon: <AlertTriangle className="w-4 h-4" /> };
    }
    if (quantity <= minQuantity * 2) {
      return { color: 'text-yellow-600', status: 'Medium', icon: null };
    }
    return { color: 'text-green-600', status: 'Good', icon: null };
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Consumables</h1>
        <button
          onClick={() => onCreateNew('consumable')}
          className="bg-purple-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Consumable</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search consumables..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manufacturer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Qty</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredConsumables.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <Beaker className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p>No consumables found. <button onClick={() => onCreateNew('consumable')} className="text-purple-600 hover:text-purple-500">Create your first consumable</button></p>
                  </td>
                </tr>
              ) : (
                filteredConsumables.map((consumable) => {
                  const status = getQuantityStatus(consumable.quantity, consumable.minQuantity);
                  return (
                    <tr key={consumable.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{consumable.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{consumable.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{consumable.manufacturer}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{consumable.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{consumable.minQuantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className={`flex items-center space-x-1 ${status.color}`}>
                          {status.icon}
                          <span>{status.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => onView(consumable)}
                            className="text-blue-600 hover:text-blue-500"
                            title="View Consumable"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onEdit(consumable)}
                            className="text-green-600 hover:text-green-500"
                            title="Edit Consumable"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(consumable.id)}
                            className="text-red-600 hover:text-red-500"
                            title="Delete Consumable"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}