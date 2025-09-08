import React, { useState } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Key } from 'lucide-react';
import { License } from '../../types';

interface LicensesListProps {
  licenses: License[];
  onCreateNew: () => void;
  onEdit: (license: License) => void;
  onDelete: (licenseId: string) => void;
  onView: (license: License) => void;
}

export default function LicensesList({ licenses, onCreateNew, onEdit, onDelete, onView }: LicensesListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLicenses = licenses.filter(license =>
    license.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    license.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    license.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSeatsColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return 'text-green-600';
    if (percentage > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Software Licenses</h1>
        <button
          onClick={() => onCreateNew('license')}
          className="bg-pink-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-pink-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create License</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search licenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manufacturer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seats</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLicenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <Key className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p>No licenses found. <button onClick={() => onCreateNew('license')} className="text-pink-600 hover:text-pink-500">Create your first license</button></p>
                  </td>
                </tr>
              ) : (
                filteredLicenses.map((license) => (
                  <tr key={license.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{license.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{license.manufacturer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{license.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={getSeatsColor(license.availableSeats, license.seats)}>
                        {license.availableSeats}/{license.seats}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {license.expiryDate ? new Date(license.expiryDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onView(license)}
                          className="text-blue-600 hover:text-blue-500"
                          title="View License"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit(license)}
                          className="text-green-600 hover:text-green-500"
                          title="Edit License"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(license.id)}
                          className="text-red-600 hover:text-red-500"
                          title="Delete License"
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