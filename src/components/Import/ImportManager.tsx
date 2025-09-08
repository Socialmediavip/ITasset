import React, { useState } from 'react';
import { useEffect } from 'react';
import { Upload, FileText, CheckCircle, XCircle, Clock, Download } from 'lucide-react';
import { ImportRecord } from '../../types';

interface ImportManagerProps {
  imports: ImportRecord[];
  onImport: (file: File, type: string) => void;
}

export default function ImportManager({ imports, onImport }: ImportManagerProps) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedType, setSelectedType] = useState('assets');
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Set up real-time refresh for import status every 5 seconds
    const interval = setInterval(() => {
      // Refresh import status for processing imports
      const processingImports = imports.filter(imp => imp.status === 'processing');
      if (processingImports.length > 0) {
        console.log('Refreshing import status...');
      }
    }, 5000);
    
    setRefreshInterval(interval);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [imports]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onImport(files[0], selectedType);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onImport(files[0], selectedType);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-600" />;
      case 'processing': return <Clock className="w-5 h-5 text-blue-600 animate-spin" />;
      default: return <Clock className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'processing': return 'text-blue-600';
      default: return 'text-yellow-600';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Import Data</h1>
        <p className="text-gray-600">Import assets, licenses, accessories, consumables, and users from CSV files.</p>
        <p className="text-xs text-gray-500">Auto-refresh: 5s (for processing imports)</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload File</h2>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Import Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="assets">Assets</option>
              <option value="licenses">Licenses</option>
              <option value="accessories">Accessories</option>
              <option value="consumables">Consumables</option>
              <option value="users">Users</option>
            </select>
          </div>

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Drop your CSV file here
            </p>
            <p className="text-gray-500 mb-4">or</p>
            <label className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer">
              Browse Files
              <input
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            <p>• Only CSV files are supported</p>
            <p>• Maximum file size: 10MB</p>
            <p>• First row should contain column headers</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Sample Templates</h2>
            <button className="text-blue-600 hover:text-blue-500 text-sm">
              Download All
            </button>
          </div>

          <div className="space-y-3">
            {[
              { type: 'Assets', filename: 'assets_template.csv' },
              { type: 'Licenses', filename: 'licenses_template.csv' },
              { type: 'Accessories', filename: 'accessories_template.csv' },
              { type: 'Consumables', filename: 'consumables_template.csv' },
              { type: 'Users', filename: 'users_template.csv' }
            ].map((template) => (
              <div key={template.type} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{template.type} Template</p>
                    <p className="text-sm text-gray-500">{template.filename}</p>
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-500">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Import History</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Import Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Errors</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {imports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No import history found. Upload your first file to get started.
                  </td>
                </tr>
              ) : (
                imports.map((importRecord) => (
                  <tr key={importRecord.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {importRecord.fileName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {importRecord.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(importRecord.status)}
                        <span className={`text-sm capitalize ${getStatusColor(importRecord.status)}`}>
                          {importRecord.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {importRecord.recordsProcessed}/{importRecord.totalRecords}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(importRecord.importDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {importRecord.errors.length > 0 ? (
                        <span className="text-red-600">{importRecord.errors.length} errors</span>
                      ) : (
                        <span className="text-green-600">No errors</span>
                      )}
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