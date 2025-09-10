import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, Clock, Plus, Search, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import { supabaseService } from '../../services/supabaseService';

interface ComplianceCheck {
  id: string;
  type: string;
  status: string;
  last_checked: string;
  next_check: string;
  auditor: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

interface PolicyViolation {
  id: string;
  type: string;
  severity: string;
  description: string;
  detected_date: string;
  resolved_date: string | null;
  assigned_to: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const ComplianceManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'checks' | 'violations'>('checks');
  const [complianceChecks, setComplianceChecks] = useState<ComplianceCheck[]>([]);
  const [policyViolations, setPolicyViolations] = useState<PolicyViolation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'check' | 'violation'>('check');
  const [editingItem, setEditingItem] = useState<ComplianceCheck | PolicyViolation | null>(null);

  const [formData, setFormData] = useState({
    type: '',
    status: '',
    auditor: '',
    notes: '',
    severity: '',
    description: '',
    assigned_to: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [checksData, violationsData] = await Promise.all([
        supabaseService.getComplianceChecks(),
        supabaseService.getPolicyViolations()
      ]);

      setComplianceChecks(checksData || []);
      setPolicyViolations(violationsData || []);
    } catch (err) {
      console.error('Error fetching compliance data:', err);
      setError('Failed to load compliance data');
      setComplianceChecks([]);
      setPolicyViolations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCheck = async () => {
    try {
      const checkData = {
        type: formData.type || 'License Compliance',
        status: formData.status || 'Under Review',
        auditor: formData.auditor,
        notes: formData.notes,
        next_check: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      };

      await supabaseService.createComplianceCheck(checkData);
      await fetchData();
      resetForm();
    } catch (err) {
      console.error('Error creating compliance check:', err);
      setError('Failed to create compliance check');
    }
  };

  const handleCreateViolation = async () => {
    try {
      const violationData = {
        type: formData.type || 'License Overuse',
        severity: formData.severity || 'Medium',
        description: formData.description,
        assigned_to: formData.assigned_to,
        status: 'Open'
      };

      await supabaseService.createPolicyViolation(violationData);
      await fetchData();
      resetForm();
    } catch (err) {
      console.error('Error creating policy violation:', err);
      setError('Failed to create policy violation');
    }
  };

  const handleUpdateCheck = async (id: string, updates: Partial<ComplianceCheck>) => {
    try {
      await supabaseService.updateComplianceCheck(id, updates);
      await fetchData();
    } catch (err) {
      console.error('Error updating compliance check:', err);
      setError('Failed to update compliance check');
    }
  };

  const handleUpdateViolation = async (id: string, updates: Partial<PolicyViolation>) => {
    try {
      await supabaseService.updatePolicyViolation(id, updates);
      await fetchData();
    } catch (err) {
      console.error('Error updating policy violation:', err);
      setError('Failed to update policy violation');
    }
  };

  const handleDeleteCheck = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this compliance check?')) {
      try {
        await supabaseService.deleteComplianceCheck(id);
        await fetchData();
      } catch (err) {
        console.error('Error deleting compliance check:', err);
        setError('Failed to delete compliance check');
      }
    }
  };

  const handleDeleteViolation = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this policy violation?')) {
      try {
        await supabaseService.deletePolicyViolation(id);
        await fetchData();
      } catch (err) {
        console.error('Error deleting policy violation:', err);
        setError('Failed to delete policy violation');
      }
    }
  };

  const handleResolveViolation = async (id: string) => {
    try {
      await handleUpdateViolation(id, {
        status: 'Resolved',
        resolved_date: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error resolving violation:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      type: '',
      status: '',
      auditor: '',
      notes: '',
      severity: '',
      description: '',
      assigned_to: ''
    });
    setShowModal(false);
    setEditingItem(null);
  };

  const openModal = (type: 'check' | 'violation', item?: ComplianceCheck | PolicyViolation) => {
    setModalType(type);
    setEditingItem(item || null);
    if (item) {
      if (type === 'check') {
        const check = item as ComplianceCheck;
        setFormData({
          type: check.type,
          status: check.status,
          auditor: check.auditor,
          notes: check.notes,
          severity: '',
          description: '',
          assigned_to: ''
        });
      } else {
        const violation = item as PolicyViolation;
        setFormData({
          type: violation.type,
          status: violation.status,
          auditor: '',
          notes: '',
          severity: violation.severity,
          description: violation.description,
          assigned_to: violation.assigned_to
        });
      }
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      if (modalType === 'check') {
        await handleUpdateCheck(editingItem.id, formData);
      } else {
        await handleUpdateViolation(editingItem.id, formData);
      }
    } else {
      if (modalType === 'check') {
        await handleCreateCheck();
      } else {
        await handleCreateViolation();
      }
    }
  };

  const filteredChecks = complianceChecks.filter(check => {
    const matchesSearch = check.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         check.auditor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || check.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const filteredViolations = policyViolations.filter(violation => {
    const matchesSearch = violation.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         violation.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || violation.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'compliant':
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'non-compliant':
      case 'open':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Shield className="w-8 h-8 mr-3 text-blue-600" />
            Compliance & Audits
          </h1>
          <p className="text-gray-600 mt-1">Monitor compliance status and manage policy violations</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('checks')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'checks'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Compliance Checks ({complianceChecks.length})
            </button>
            <button
              onClick={() => setActiveTab('violations')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'violations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Policy Violations ({policyViolations.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              {activeTab === 'checks' ? (
                <>
                  <option value="compliant">Compliant</option>
                  <option value="non-compliant">Non-Compliant</option>
                  <option value="under review">Under Review</option>
                </>
              ) : (
                <>
                  <option value="open">Open</option>
                  <option value="resolved">Resolved</option>
                  <option value="in progress">In Progress</option>
                </>
              )}
            </select>
          </div>
          <button
            onClick={() => openModal(activeTab)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add {activeTab === 'checks' ? 'Check' : 'Violation'}
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'checks' ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredChecks.length === 0 ? (
            <div className="p-8 text-center">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No compliance checks found</h3>
              <p className="text-gray-500 mb-4">Get started by creating your first compliance check.</p>
              <button
                onClick={() => openModal('check')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Compliance Check
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Auditor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Checked
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Next Check
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredChecks.map((check) => (
                    <tr key={check.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{check.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(check.status)}
                          <span className="ml-2 text-sm text-gray-900">{check.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {check.auditor || 'Unassigned'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(check.last_checked).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {check.next_check ? new Date(check.next_check).toLocaleDateString() : 'Not scheduled'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => openModal('check', check)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteCheck(check.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredViolations.length === 0 ? (
            <div className="p-8 text-center">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No policy violations found</h3>
              <p className="text-gray-500 mb-4">This is good news! No violations have been detected.</p>
              <button
                onClick={() => openModal('violation')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Report Violation
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Severity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Detected
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredViolations.map((violation) => (
                    <tr key={violation.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{violation.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(violation.severity)}`}>
                          {violation.severity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">{violation.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(violation.status)}
                          <span className="ml-2 text-sm text-gray-900">{violation.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {violation.assigned_to || 'Unassigned'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(violation.detected_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          {violation.status !== 'Resolved' && (
                            <button
                              onClick={() => handleResolveViolation(violation.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Resolve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => openModal('violation', violation)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteViolation(violation.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingItem ? 'Edit' : 'Create'} {modalType === 'check' ? 'Compliance Check' : 'Policy Violation'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <input
                    type="text"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={modalType === 'check' ? 'License Compliance' : 'License Overuse'}
                    required
                  />
                </div>

                {modalType === 'check' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Status</option>
                        <option value="Compliant">Compliant</option>
                        <option value="Non-Compliant">Non-Compliant</option>
                        <option value="Under Review">Under Review</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Auditor
                      </label>
                      <input
                        type="text"
                        value={formData.auditor}
                        onChange={(e) => setFormData({ ...formData, auditor: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Auditor name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder="Additional notes..."
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Severity
                      </label>
                      <select
                        value={formData.severity}
                        onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select Severity</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={3}
                        placeholder="Describe the violation..."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Assigned To
                      </label>
                      <input
                        type="text"
                        value={formData.assigned_to}
                        onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Assign to user"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplianceManager;