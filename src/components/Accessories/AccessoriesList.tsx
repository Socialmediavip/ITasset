import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Headphones } from 'lucide-react';
import { Accessory } from '../../types';

interface AccessoriesListProps {
  accessories: Accessory[];
  onCreateNew: () => void;
  onEdit: (accessory: Accessory) => void;
  onDelete: (accessoryId: string) => void;
  onView: (accessory: Accessory) => void;
}

export default function AccessoriesList({ accessories, onCreateNew, onEdit, onDelete, onView }: AccessoriesListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAccessories = accessories.filter(accessory =>
    accessory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    accessory.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    accessory.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getQuantityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Accessories</h1>
        <button
          onClick={() => onCreateNew('accessory')}
          className="bg-orange-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-orange-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Accessory</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search accessories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAccessories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <Headphones className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p>No accessories found. <button onClick={() => onCreateNew('accessory')} className="text-orange-600 hover:text-orange-500">Create your first accessory</button></p>
                  </td>
                </tr>
              ) : (
                filteredAccessories.map((accessory) => (
                  <tr key={accessory.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{accessory.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{accessory.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{accessory.manufacturer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={getQuantityColor(accessory.availableQuantity, accessory.quantity)}>
                        {accessory.availableQuantity}/{accessory.quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{accessory.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onView(accessory)}
                          className="text-blue-600 hover:text-blue-500"
                          title="View Accessory"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit(accessory)}
                          className="text-green-600 hover:text-green-500"
                          title="Edit Accessory"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(accessory.id)}
                          className="text-red-600 hover:text-red-500"
                          title="Delete Accessory"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}