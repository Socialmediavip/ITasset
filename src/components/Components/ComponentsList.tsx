import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Cpu } from 'lucide-react';
import { Component } from '../../types';

interface ComponentsListProps {
  components: Component[];
  onCreateNew: () => void;
  onEdit: (component: Component) => void;
  onDelete: (componentId: string) => void;
  onView: (component: Component) => void;
}

export default function ComponentsList({ components, onCreateNew, onEdit, onDelete, onView }: ComponentsListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredComponents = components.filter(component =>
    component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    component.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    component.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Components</h1>
        <button
          onClick={() => onCreateNew('component')}
          className="bg-yellow-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-yellow-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create Component</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredComponents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <Cpu className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p>No components found. <button onClick={() => onCreateNew('component')} className="text-yellow-600 hover:text-yellow-500">Create your first component</button></p>
                  </td>
                </tr>
              ) : (
                filteredComponents.map((component) => (
                  <tr key={component.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{component.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{component.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{component.manufacturer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{component.serialNumber || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{component.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{component.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onView(component)}
                          className="text-blue-600 hover:text-blue-500"
                          title="View Component"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit(component)}
                          className="text-green-600 hover:text-green-500"
                          title="Edit Component"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(component.id)}
                          className="text-red-600 hover:text-red-500"
                          title="Delete Component"
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