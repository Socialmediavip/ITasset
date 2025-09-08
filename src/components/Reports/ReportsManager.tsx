import React, { useState } from 'react';
import { FileText, Play, Download, Calendar, Filter, BarChart3, FileSpreadsheet } from 'lucide-react';
import { Report } from '../../types';
import { 
  exportToCSV, 
  exportToJSON, 
  exportToExcel,
  generateAssetReport,
  generateLicenseReport,
  generateAccessoryReport,
  generateConsumableReport,
  generateComponentReport,
  generateUserReport,
  generatePredefinedKitReport,
  generateRequestableItemReport
} from '../../utils/exportUtils';

interface ReportsManagerProps {
  reports: Report[];
  onRunReport: (reportId: string) => void;
  onCreateReport: () => void;
  assets: any[];
  licenses: any[];
  accessories: any[];
  consumables: any[];
  components: any[];
  users: any[];
  predefinedKits: any[];
  requestableItems: any[];
}

export default function ReportsManager({ 
  reports, 
  onRunReport, 
  onCreateReport,
  assets,
  licenses,
  accessories,
  consumables,
  components,
  users,
  predefinedKits,
  requestableItems
}: ReportsManagerProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [exportFormat, setExportFormat] = useState('csv');

  const filteredReports = reports.filter(report => 
    selectedCategory === 'all' || report.type === selectedCategory
  );

  const reportCategories = [
    { id: 'all', label: 'All Reports' },
    { id: 'asset', label: 'Asset Reports' },
    { id: 'license', label: 'License Reports' },
    { id: 'maintenance', label: 'Maintenance Reports' },
    { id: 'depreciation', label: 'Depreciation Reports' },
    { id: 'audit', label: 'Audit Reports' }
  ];

  const predefinedReports = [
    {
      id: 'asset-summary',
      name: 'Asset Summary Report',
      description: 'Overview of all assets by category and status',
      type: 'asset',
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      id: 'license-expiry',
      name: 'License Expiry Report',
      description: 'Licenses expiring in the next 90 days',
      type: 'license',
      icon: <Calendar className="w-5 h-5" />
    },
    {
      id: 'asset-audit',
      name: 'Asset Audit Report',
      description: 'Complete asset inventory for audit purposes',
      type: 'audit',
      icon: <FileText className="w-5 h-5" />
    },
    {
      id: 'maintenance-due',
      name: 'Maintenance Due Report',
      description: 'Assets requiring maintenance or warranty expiring',
      type: 'maintenance',
      icon: <Calendar className="w-5 h-5" />
    }
  ];

  const handleExportData = (type: string) => {
    const timestamp = new Date().toISOString().split('T')[0];
    
    switch (type) {
      case 'assets':
        const assetData = generateAssetReport(assets);
        if (exportFormat === 'csv') exportToCSV(assetData, `assets-${timestamp}.csv`);
        else if (exportFormat === 'json') exportToJSON(assetData, `assets-${timestamp}.json`);
        else exportToExcel(assetData, `assets-${timestamp}.xlsx`);
        break;
      case 'licenses':
        const licenseData = generateLicenseReport(licenses);
        if (exportFormat === 'csv') exportToCSV(licenseData, `licenses-${timestamp}.csv`);
        else if (exportFormat === 'json') exportToJSON(licenseData, `licenses-${timestamp}.json`);
        else exportToExcel(licenseData, `licenses-${timestamp}.xlsx`);
        break;
      case 'accessories':
        const accessoryData = generateAccessoryReport(accessories);
        if (exportFormat === 'csv') exportToCSV(accessoryData, `accessories-${timestamp}.csv`);
        else if (exportFormat === 'json') exportToJSON(accessoryData, `accessories-${timestamp}.json`);
        else exportToExcel(accessoryData, `accessories-${timestamp}.xlsx`);
        break;
      case 'consumables':
        const consumableData = generateConsumableReport(consumables);
        if (exportFormat === 'csv') exportToCSV(consumableData, `consumables-${timestamp}.csv`);
        else if (exportFormat === 'json') exportToJSON(consumableData, `consumables-${timestamp}.json`);
        else exportToExcel(consumableData, `consumables-${timestamp}.xlsx`);
        break;
      case 'components':
        const componentData = generateComponentReport(components);
        if (exportFormat === 'csv') exportToCSV(componentData, `components-${timestamp}.csv`);
        else if (exportFormat === 'json') exportToJSON(componentData, `components-${timestamp}.json`);
        else exportToExcel(componentData, `components-${timestamp}.xlsx`);
        break;
      case 'users':
        const userData = generateUserReport(users);
        if (exportFormat === 'csv') exportToCSV(userData, `users-${timestamp}.csv`);
        else if (exportFormat === 'json') exportToJSON(userData, `users-${timestamp}.json`);
        else exportToExcel(userData, `users-${timestamp}.xlsx`);
        break;
      case 'kits':
        const kitData = generatePredefinedKitReport(predefinedKits, assets, accessories, licenses, consumables);
        if (exportFormat === 'csv') exportToCSV(kitData, `predefined-kits-${timestamp}.csv`);
        else if (exportFormat === 'json') exportToJSON(kitData, `predefined-kits-${timestamp}.json`);
        else exportToExcel(kitData, `predefined-kits-${timestamp}.xlsx`);
        break;
      case 'requestable':
        const requestableData = generateRequestableItemReport(requestableItems);
        if (exportFormat === 'csv') exportToCSV(requestableData, `requestable-items-${timestamp}.csv`);
        else if (exportFormat === 'json') exportToJSON(requestableData, `requestable-items-${timestamp}.json`);
        else exportToExcel(requestableData, `requestable-items-${timestamp}.xlsx`);
        break;
      case 'all':
        // Export all data in separate files
        handleExportData('assets');
        handleExportData('licenses');
        handleExportData('accessories');
        handleExportData('consumables');
        handleExportData('components');
        handleExportData('users');
        handleExportData('kits');
        handleExportData('requestable');
        break;
    }
  };

  const handleDownloadTemplates = () => {
    const templates = {
      assets: [
        {
          name: 'Dell OptiPlex 7090',
          tag: 'ASSET-001',
          category: 'Desktop',
          manufacturer: 'Dell',
          model: 'OptiPlex 7090',
          serialNumber: 'DL123456789',
          status: 'Active',
          assignedTo: 'John Doe',
          location: 'Office Floor 1',
          purchaseDate: '2023-01-15',
          purchaseCost: 1200.00,
          warrantyExpiry: '2026-01-15'
        }
      ],
      licenses: [
        {
          name: 'Microsoft Office 365',
          productKey: 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX',
          seats: 100,
          availableSeats: 85,
          manufacturer: 'Microsoft',
          category: 'Productivity Suite',
          expiryDate: '2024-12-31'
        }
      ],
      accessories: [
        {
          name: 'Wireless Mouse',
          category: 'Mouse',
          manufacturer: 'Logitech',
          model: 'MX Master 3',
          quantity: 50,
          availableQuantity: 35,
          location: 'IT Storage',
          purchaseDate: '2023-06-01',
          purchaseCost: 99.99
        }
      ]
    };

    Object.entries(templates).forEach(([type, data]) => {
      const csvContent = [
        Object.keys(data[0]).join(','),
        ...data.map(item => 
          Object.values(item).map(value => 
            typeof value === 'string' && value.includes(',') ? `"${value}"` : value
          ).join(',')
        )
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${type}_template.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
        <button
          onClick={onCreateReport}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Create Custom Report
        </button>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {reportCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="csv">CSV Format</option>
              <option value="excel">Excel Format</option>
              <option value="json">JSON Format</option>
            </select>
            
            <button
              onClick={() => handleExportData('all')}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export All Data</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {[
          { type: 'assets', label: 'Assets', count: assets.length, color: 'bg-teal-600' },
          { type: 'licenses', label: 'Licenses', count: licenses.length, color: 'bg-pink-600' },
          { type: 'accessories', label: 'Accessories', count: accessories.length, color: 'bg-orange-600' },
          { type: 'consumables', label: 'Consumables', count: consumables.length, color: 'bg-purple-600' },
          { type: 'components', label: 'Components', count: components.length, color: 'bg-yellow-600' },
          { type: 'users', label: 'Users', count: users.length, color: 'bg-blue-600' },
          { type: 'kits', label: 'Predefined Kits', count: predefinedKits.length, color: 'bg-indigo-600' },
          { type: 'requestable', label: 'Requestable Items', count: requestableItems.length, color: 'bg-green-600' }
        ].map((item) => (
          <div key={item.type} className={`${item.color} rounded-lg p-4 text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{item.count}</div>
                <div className="text-sm opacity-90">{item.label}</div>
              </div>
              <button
                onClick={() => handleExportData(item.type)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-md transition-colors"
                title={`Export ${item.label}`}
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Quick Reports</h2>
          </div>
          <div className="p-6 space-y-4">
            {predefinedReports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="text-blue-600">
                    {report.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{report.name}</h3>
                    <p className="text-sm text-gray-500">{report.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onRunReport(report.id)}
                    className="text-blue-600 hover:text-blue-500"
                    title="Generate Report"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleExportData('assets')}
                    className="text-green-600 hover:text-green-500"
                    title="Run Report"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    className="text-gray-600 hover:text-gray-500"
                    title="Download"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Reports</h2>
          </div>
          <div className="p-6">
            {reports.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No custom reports created yet.</p>
                <button
                  onClick={onCreateReport}
                  className="mt-2 text-blue-600 hover:text-blue-500"
                >
                  Create your first report
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReports.slice(0, 5).map((report) => (
                  <div key={report.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{report.name}</h3>
                      <p className="text-sm text-gray-500">{report.description}</p>
                      {report.lastRun && (
                        <p className="text-xs text-gray-400">
                          Last run: {new Date(report.lastRun).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => onRunReport(report.id)}
                        className="text-blue-600 hover:text-blue-500"
                        title="Run Report"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleExportData('assets')}
                        className="text-gray-600 hover:text-gray-500"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Reports</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Run</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No reports found for the selected category.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{report.name}</div>
                        <div className="text-sm text-gray-500">{report.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {report.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.createdBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.lastRun ? new Date(report.lastRun).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onRunReport(report.id)}
                          className="text-blue-600 hover:text-blue-500"
                          title="Run Report"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                        <button
                          className="text-gray-600 hover:text-gray-500"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
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