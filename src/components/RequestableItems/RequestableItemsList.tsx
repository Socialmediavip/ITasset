import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, ShoppingCart, Package, Download } from 'lucide-react';
import { RequestableItem } from '../../types';

interface RequestableItemsListProps {
  items: RequestableItem[];
  onCreateNew: () => void;
  onEdit: (item: RequestableItem) => void;
  onDelete: (itemId: string) => void;
  onView: (item: RequestableItem) => void;
  onRequest: (item: RequestableItem) => void;
}

export default function RequestableItemsList({ 
  items, 
  onCreateNew, 
  onEdit, 
  onDelete, 
  onView, 
  onRequest 
}: RequestableItemsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'available' && item.requestable && item.quantity > 0) ||
                         (statusFilter === 'unavailable' && (!item.requestable || item.quantity === 0));
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [...new Set(items.map(item => item.category))];

  const handleDownloadTemplate = () => {
    const template = [
      {
        name: 'Sample Laptop',
        category: 'Laptops',
        description: 'High-performance laptop for development work',
        requestable: true,
        quantity: 5,
        location: 'IT Storage Room',
        notes: 'Includes charger and carrying case'
      },
      {
        name: 'Wireless Mouse',
        category: 'Peripherals',
        description: 'Ergonomic wireless mouse',
        requestable: true,
        quantity: 20,
        location: 'Supply Closet',
        notes: 'Batteries included'
      }
    ];

    const csvContent = [
      'name,category,description,requestable,quantity,location,notes',
      ...template.map(item => 
        `"${item.name}","${item.category}","${item.description}",${item.requestable},${item.quantity},"${item.location}","${item.notes}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'requestable_items_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Requestable Items</h1>
          <p className="text-gray-600">Manage items that users can request through the system</p>
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
            onClick={() => onCreateNew('requestable')}
            className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Item</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">{items.filter(i => i.requestable && i.quantity > 0).length}</div>
              <div className="text-sm font-medium text-green-700">Available Items</div>
            </div>
            <ShoppingCart className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-600">{items.reduce((sum, item) => sum + item.quantity, 0)}</div>
              <div className="text-sm font-medium text-blue-700">Total Quantity</div>
            </div>
            <Package className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-yellow-600">{items.filter(i => i.quantity <= 5).length}</div>
              <div className="text-sm font-medium text-yellow-700">Low Stock</div>
            </div>
            <Package className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-red-600">{items.filter(i => !i.requestable || i.quantity === 0).length}</div>
              <div className="text-sm font-medium text-red-700">Unavailable</div>
            </div>
            <Package className="w-8 h-8 text-red-600" />
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
                placeholder="Search requestable items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No requestable items found</h3>
            <p className="text-gray-500 mb-6">Set up items that users can request through the system.</p>
            <button
              onClick={() => onCreateNew('requestable')}
              className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors font-medium"
            >
              Create Your First Requestable Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                {item.image && (
                  <div className="h-48 bg-gray-200">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onView(item)}
                        className="text-blue-600 hover:text-blue-500 p-1"
                        title="View Item"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(item)}
                        className="text-green-600 hover:text-green-500 p-1"
                        title="Edit Item"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="text-red-600 hover:text-red-500 p-1"
                        title="Delete Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Available:</span>
                      <span className={`font-medium ${item.quantity > 5 ? 'text-green-600' : item.quantity > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Location:</span>
                      <span className="font-medium">{item.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className={`font-medium ${item.requestable && item.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.requestable && item.quantity > 0 ? 'Available' : 'Unavailable'}
                      </span>
                    </div>
                  </div>

                  {item.requestable && item.quantity > 0 ? (
                    <button 
                      onClick={() => onRequest(item)}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      Request Item
                    </button>
                  ) : (
                    <button 
                      disabled
                      className="w-full bg-gray-300 text-gray-500 py-2 px-4 rounded-md text-sm font-medium cursor-not-allowed"
                    >
                      Not Available
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}