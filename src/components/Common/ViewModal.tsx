import React from 'react';
import { X, Calendar, DollarSign, MapPin, User, Tag, Package } from 'lucide-react';

interface ViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  type: string;
}

export default function ViewModal({ isOpen, onClose, item, type }: ViewModalProps) {
  if (!isOpen || !item) return null;

  const renderAssetView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Asset Name</label>
            <p className="text-lg font-semibold text-gray-900">{item.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Asset Tag</label>
            <p className="text-gray-900 font-mono">{item.tag}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Category</label>
            <p className="text-gray-900">{item.category}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Manufacturer</label>
            <p className="text-gray-900">{item.manufacturer}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Model</label>
            <p className="text-gray-900">{item.model}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Serial Number</label>
            <p className="text-gray-900 font-mono">{item.serialNumber}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Status</label>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
              item.status === 'Active' ? 'bg-green-100 text-green-800' :
              item.status === 'Assigned' ? 'bg-blue-100 text-blue-800' :
              item.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {item.status}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Assigned To</label>
            <p className="text-gray-900">{item.assignedTo || 'Unassigned'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Location</label>
            <p className="text-gray-900">{item.location}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Purchase Date</label>
            <p className="text-gray-900">{item.purchaseDate ? new Date(item.purchaseDate).toLocaleDateString() : 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Purchase Cost</label>
            <p className="text-gray-900">${item.purchaseCost?.toLocaleString() || '0'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Warranty Expiry</label>
            <p className="text-gray-900">{item.warrantyExpiry ? new Date(item.warrantyExpiry).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>
      </div>
      
      {item.notes && (
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">Notes</label>
          <p className="text-gray-900 bg-gray-50 p-3 rounded-md">{item.notes}</p>
        </div>
      )}
    </div>
  );

  const renderLicenseView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">License Name</label>
            <p className="text-lg font-semibold text-gray-900">{item.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Product Key</label>
            <p className="text-gray-900 font-mono">{item.productKey || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Manufacturer</label>
            <p className="text-gray-900">{item.manufacturer}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Category</label>
            <p className="text-gray-900">{item.category}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Total Seats</label>
            <p className="text-gray-900">{item.seats}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Available Seats</label>
            <p className="text-gray-900">{item.availableSeats}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Used Seats</label>
            <p className="text-gray-900">{item.seats - item.availableSeats}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Expiry Date</label>
            <p className="text-gray-900">{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'No expiry'}</p>
          </div>
        </div>
      </div>
      
      {item.notes && (
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-2">Notes</label>
          <p className="text-gray-900 bg-gray-50 p-3 rounded-md">{item.notes}</p>
        </div>
      )}
    </div>
  );

  const renderUserView = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white text-xl font-medium">
            {item.firstName?.[0]}{item.lastName?.[0]}
          </span>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{item.firstName} {item.lastName}</h3>
          <p className="text-gray-600">{item.jobTitle}</p>
          <p className="text-sm text-gray-500">{item.department}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Username</label>
            <p className="text-gray-900">{item.username}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Email</label>
            <p className="text-gray-900">{item.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Phone</label>
            <p className="text-gray-900">{item.phone || 'Not provided'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Employee Number</label>
            <p className="text-gray-900">{item.employeeNumber || 'Not assigned'}</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500">Department</label>
            <p className="text-gray-900">{item.department}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Location</label>
            <p className="text-gray-900">{item.location}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Manager</label>
            <p className="text-gray-900">{item.manager || 'Not assigned'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Account Status</label>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
              item.activated ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {item.activated ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500">Last Login</label>
            <p className="text-gray-900">{item.lastLogin ? new Date(item.lastLogin).toLocaleDateString() : 'Never'}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderGenericView = () => (
    <div className="space-y-4">
      {Object.entries(item).map(([key, value]) => {
        if (key === 'id') return null;
        return (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-500 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <p className="text-gray-900">
              {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value || 'N/A')}
            </p>
          </div>
        );
      })}
    </div>
  );

  const getTitle = () => {
    switch (type) {
      case 'asset': return `Asset: ${item.name}`;
      case 'license': return `License: ${item.name}`;
      case 'user': return `User: ${item.firstName} ${item.lastName}`;
      case 'accessory': return `Accessory: ${item.name}`;
      case 'consumable': return `Consumable: ${item.name}`;
      case 'component': return `Component: ${item.name}`;
      case 'kit': return `Kit: ${item.name}`;
      case 'requestable': return `Item: ${item.name}`;
      default: return 'View Details';
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'asset': return renderAssetView();
      case 'license': return renderLicenseView();
      case 'user': return renderUserView();
      default: return renderGenericView();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{getTitle()}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {renderContent()}
        </div>

        <div className="flex items-center justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}