import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Package, Box, Download, Play, Users } from 'lucide-react';
import { PredefinedKit } from '../../types';

interface PredefinedKitsListProps {
  kits: PredefinedKit[];
  onCreateNew: () => void;
  onEdit: (kit: PredefinedKit) => void;
  onDelete: (kitId: string) => void;
  onView: (kit: PredefinedKit) => void;
  onDeploy: (kit: PredefinedKit) => void;
}

export default function PredefinedKitsList({ 
  kits, 
  onCreateNew, 
  onEdit, 
  onDelete, 
  onView, 
  onDeploy 
}: PredefinedKitsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredKits = kits.filter(kit =>
    kit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kit.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    kit.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(kits.map(kit => kit.category))];

  const handleDownloadTemplate = () => {
    const template = [
      {
        name: 'New Employee Kit',
        category: 'New Employee',
        description: 'Complete setup for new employees including laptop, accessories, and software',
        assets: 'Laptop,Monitor,Keyboard,Mouse',
        accessories: 'Headset,Webcam,Docking Station',
        licenses: 'Microsoft Office,Antivirus Software',
        consumables: 'Notebook,Pens'
      },
      {
        name: 'Developer Kit',
        category: 'Developer',
        description: 'Specialized kit for software developers',
        assets: 'High-Performance Laptop,Dual Monitors',
        accessories: 'Mechanical Keyboard,Gaming Mouse',
        licenses: 'Visual Studio,GitHub Enterprise',
        consumables: 'Whiteboard Markers'
      }
    ];

    const csvContent = [
      'name,category,description,assets,accessories,licenses,consumables',
      ...template.map(kit => 
        `"${kit.name}","${kit.category}","${kit.description}","${kit.assets}","${kit.accessories}","${kit.licenses}","${kit.consumables}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'predefined_kits_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Predefined Kits</h1>
          <p className="text-gray-600">Manage predefined asset kits for quick deployment</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownloadTemplate}
            className="bg-gray-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-gray-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download Template</span>
          </button>
          <button
            onClick={() => onCreateNew('kit')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Kit</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-indigo-600">{kits.length}</div>
              <div className="text-sm font-medium text-indigo-700">Total Kits</div>
            </div>
            <Package className="w-8 h-8 text-indigo-600" />
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">{kits.filter(k => k.category === 'New Employee').length}</div>
              <div className="text-sm font-medium text-green-700">New Employee</div>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">{kits.filter(k => k.category === 'Developer').length}</div>
              <div className="text-sm font-medium text-blue-700">Developer Kits</div>
            </div>
            <Box className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {kits.reduce((sum, kit) => sum + kit.assets.length + kit.accessories.length + kit.licenses.length + kit.consumables.length, 0)}
              </div>
              <div className="text-sm font-medium text-purple-700">Total Items</div>
            </div>
            <Package className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search kits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredKits.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No predefined kits found</h3>
            <p className="text-gray-500 mb-6">Create predefined kits to group assets, accessories, and licenses together for easy deployment.</p>
            <button
              onClick={() => onCreateNew('kit')}
              className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors font-medium"
            >
              Create Your First Kit
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredKits.map((kit) => (
              <div key={kit.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <Box className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{kit.name}</h3>
                      <p className="text-sm text-gray-500">{kit.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onView(kit)}
                      className="text-blue-600 hover:text-blue-500 p-1"
                      title="View Kit"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(kit)}
                      className="text-green-600 hover:text-green-500 p-1"
                      title="Edit Kit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(kit.id)}
                      className="text-red-600 hover:text-red-500 p-1"
                      title="Delete Kit"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{kit.description}</p>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Assets:</span>
                    <span className="font-medium text-teal-600">{kit.assets.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Accessories:</span>
                    <span className="font-medium text-orange-600">{kit.accessories.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Licenses:</span>
                    <span className="font-medium text-pink-600">{kit.licenses.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Consumables:</span>
                    <span className="font-medium text-purple-600">{kit.consumables.length}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-700 font-medium">Total Items:</span>
                    <span className="font-bold text-indigo-600">
                      {kit.assets.length + kit.accessories.length + kit.licenses.length + kit.consumables.length}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs text-gray-400 mb-3">
                    Created: {new Date(kit.createdDate).toLocaleDateString()}
                  </p>
                  <button 
                    onClick={() => onDeploy(kit)}
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center justify-center space-x-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>Deploy Kit</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}