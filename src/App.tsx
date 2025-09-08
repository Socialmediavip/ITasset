import React, { useState, useEffect } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/EnhancedDashboard';
import AssetsList from './components/Assets/AssetsList';
import LicensesList from './components/Licenses/LicensesList';
import AccessoriesList from './components/Accessories/AccessoriesList';
import ConsumablesList from './components/Consumables/ConsumablesList';
import ComponentsList from './components/Components/ComponentsList';
import PeopleList from './components/People/PeopleList';
import PredefinedKitsList from './components/PredefinedKits/PredefinedKitsList';
import RequestableItemsList from './components/RequestableItems/RequestableItemsList';
import AlertsManager from './components/Alerts/AlertsManager';
import ComplianceManager from './components/Compliance/ComplianceManager';
import MaintenanceManager from './components/Maintenance/MaintenanceManager';
import FinancialManager from './components/Financial/FinancialManager';
import AnalyticsManager from './components/Analytics/AnalyticsManager';
import IntegrationsManager from './components/Integrations/IntegrationsManager';
import ReportsManager from './components/Reports/ReportsManager';
import ImportManager from './components/Import/ImportManager';
import SettingsManager from './components/Settings/SettingsManager';

// Common components
import ViewModal from './components/Common/ViewModal';

// Forms
import AssetForm from './components/Assets/AssetForm';
import EnhancedAssetForm from './components/Assets/EnhancedAssetForm';
import LicenseForm from './components/Licenses/LicenseForm';
import AccessoryForm from './components/Accessories/AccessoryForm';
import ConsumableForm from './components/Consumables/ConsumableForm';
import ComponentForm from './components/Components/ComponentForm';
import UserForm from './components/People/UserForm';
import PredefinedKitForm from './components/PredefinedKits/PredefinedKitForm';
import RequestableItemForm from './components/RequestableItems/RequestableItemForm';

import { useLocalStorage } from './hooks/useLocalStorage';
import apiService from './services/api';
import supabaseService from './services/supabaseService';
import { 
  Asset, 
  License, 
  Accessory, 
  Consumable, 
  Component, 
  User, 
  PredefinedKit, 
  RequestableItem,
  DashboardMetrics,
  UserProfile,
  ImportRecord,
  Report
} from './types';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<string>('');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingItem, setViewingItem] = useState<any>(null);
  const [viewType, setViewType] = useState<string>('');

  // Data states
  const [assets, setAssets] = useLocalStorage<Asset[]>('assets', []);
  const [licenses, setLicenses] = useLocalStorage<License[]>('licenses', []);
  const [accessories, setAccessories] = useLocalStorage<Accessory[]>('accessories', []);
  const [consumables, setConsumables] = useLocalStorage<Consumable[]>('consumables', []);
  const [components, setComponents] = useLocalStorage<Component[]>('components', []);
  const [users, setUsers] = useLocalStorage<User[]>('users', []);
  const [predefinedKits, setPredefinedKits] = useLocalStorage<PredefinedKit[]>('predefinedKits', []);
  const [requestableItems, setRequestableItems] = useLocalStorage<RequestableItem[]>('requestableItems', []);
  const [imports, setImports] = useLocalStorage<ImportRecord[]>('imports', []);
  const [reports, setReports] = useLocalStorage<Report[]>('reports', []);

  // Load data from Supabase on component mount
  useEffect(() => {
    loadDataFromSupabase();
  }, []);

  const loadDataFromSupabase = async () => {
    try {
      const [
        assetsData,
        licensesData,
        accessoriesData,
        consumablesData,
        componentsData,
        usersData,
        kitsData,
        requestableData,
        alertsData,
        reportsData
      ] = await Promise.all([
        supabaseService.getAssets().catch(() => null),
        supabaseService.getLicenses().catch(() => null),
        supabaseService.getAccessories().catch(() => null),
        supabaseService.getConsumables().catch(() => null),
        supabaseService.getComponents().catch(() => null),
        supabaseService.getUsers().catch(() => null),
        supabaseService.getPredefinedKits().catch(() => null),
        supabaseService.getRequestableItems().catch(() => null),
        supabaseService.getAlerts().catch(() => null),
        supabaseService.getReports().catch(() => null)
      ]);

      // Transform Supabase data to match local types
      if (assetsData) {
        const transformedAssets = assetsData.map(asset => ({
          ...asset,
          assignedTo: asset.assigned_to,
          assignedDepartment: asset.assigned_department,
          purchaseDate: asset.purchase_date,
          purchaseCost: asset.purchase_cost,
          warrantyExpiry: asset.warranty_expiry,
          warrantyStatus: asset.warranty_status,
          serialNumber: asset.serial_number,
          custodianHistory: [],
          lifecycle: {
            procurementDate: asset.purchase_date || '',
            deploymentDate: '',
            stage: asset.lifecycle_stage,
            nextStageDate: ''
          },
          depreciation: {
            method: 'Straight Line',
            usefulLife: 5,
            salvageValue: 0,
            currentValue: asset.purchase_cost || 0,
            depreciationRate: 20,
            lastCalculated: new Date().toISOString()
          },
          maintenanceRecords: [],
          complianceStatus: asset.compliance_status,
          lastAuditDate: asset.last_audit_date,
          nextMaintenanceDate: asset.next_maintenance_date
        }));
        setAssets(transformedAssets);
      }

      if (licensesData) {
        const transformedLicenses = licensesData.map(license => ({
          ...license,
          productKey: license.product_key,
          availableSeats: license.available_seats,
          expiryDate: license.expiry_date
        }));
        setLicenses(transformedLicenses);
      }

      if (accessoriesData) {
        const transformedAccessories = accessoriesData.map(accessory => ({
          ...accessory,
          availableQuantity: accessory.available_quantity,
          purchaseDate: accessory.purchase_date,
          purchaseCost: accessory.purchase_cost
        }));
        setAccessories(transformedAccessories);
      }

      if (consumablesData) {
        const transformedConsumables = consumablesData.map(consumable => ({
          ...consumable,
          minQuantity: consumable.min_quantity,
          itemNumber: consumable.item_number
        }));
        setConsumables(transformedConsumables);
      }

      if (componentsData) {
        const transformedComponents = componentsData.map(component => ({
          ...component,
          serialNumber: component.serial_number,
          purchaseDate: component.purchase_date,
          purchaseCost: component.purchase_cost
        }));
        setComponents(transformedComponents);
      }

      if (usersData) {
        const transformedUsers = usersData.map(user => ({
          ...user,
          firstName: user.first_name,
          lastName: user.last_name,
          jobTitle: user.job_title,
          employeeNumber: user.employee_number,
          lastLogin: user.last_login
        }));
        setUsers(transformedUsers);
      }

      if (kitsData) {
        const transformedKits = kitsData.map(kit => ({
          ...kit,
          createdDate: kit.created_at
        }));
        setPredefinedKits(transformedKits);
      }

      if (requestableData) {
        setRequestableItems(requestableData);
      }

      if (reportsData) {
        const transformedReports = reportsData.map(report => ({
          ...report,
          lastRun: report.last_run,
          createdBy: report.created_by
        }));
        setReports(transformedReports);
      }

    } catch (error) {
      console.warn('Failed to load data from Supabase, using local storage:', error);
    }
  };

  const [userProfile, setUserProfile] = useLocalStorage<UserProfile>('userProfile', {
    id: '1',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@company.com',
    username: 'admin',
    department: 'IT',
    jobTitle: 'System Administrator',
    location: 'Main Office',
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    permissions: ['admin'],
    preferences: {
      theme: 'light',
      language: 'en',
      timezone: 'UTC',
      notifications: true
    }
  });

  const metrics: DashboardMetrics = {
    assets: assets.length,
    licenses: licenses.length,
    accessories: accessories.length,
    consumables: consumables.length,
    components: components.length,
    people: users.length,
    predefinedKits: predefinedKits.length,
    requestableItems: requestableItems.length,
    alerts: 3,
    expiringWarranties: assets.filter(a => a.warrantyExpiry && new Date(a.warrantyExpiry) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length,
    expiringLicenses: licenses.filter(l => l.expiryDate && new Date(l.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length,
    maintenanceDue: 2,
    complianceIssues: 1,
    totalValue: assets.reduce((sum, asset) => sum + (asset.purchaseCost || 0), 0) +
                licenses.reduce((sum, license) => sum + (license.cost || 0), 0) +
                accessories.reduce((sum, acc) => sum + (acc.purchaseCost || 0), 0) +
                components.reduce((sum, comp) => sum + (comp.purchaseCost || 0), 0)
  };

  const handleCreateNew = (type: string) => {
    setFormType(type);
    setEditingItem(null);
    setShowForm(true);
  };

  const handleEdit = (item: any, type: string) => {
    setFormType(type);
    setEditingItem(item);
    setShowForm(true);
  };

  const handleSave = async (data: any) => {
    try {
      let response: any;
      
      switch (formType) {
        case 'asset':
          if (editingItem) {
            response = await supabaseService.updateAsset(editingItem.id, {
              name: data.name,
              tag: data.tag,
              category: data.category,
              subcategory: data.subcategory,
              model: data.model,
              manufacturer: data.manufacturer,
              status: data.status,
              location: data.location,
              purchase_cost: data.purchaseCost,
              warranty_status: data.warrantyStatus,
              notes: data.notes,
              barcode: data.barcode,
              qr_code: data.qr_code,
              specifications: data.specifications,
              discovery_source: data.discoverySource,
              assigned_to: data.assignedTo || null,
              assigned_department: data.assignedDepartment,
              purchase_date: data.purchaseDate || null,
              warranty_expiry: data.warrantyExpiry || null,
              serial_number: data.serialNumber,
              lifecycle_stage: data.lifecycle?.stage,
              compliance_status: data.complianceStatus,
              last_audit_date: data.lastAuditDate || null,
              next_maintenance_date: data.nextMaintenanceDate || null
            });
            setAssets(prev => prev.map(item => item.id === editingItem.id ? { ...item, ...data } : item));
          } else {
            response = await supabaseService.createAsset({
              name: data.name,
              tag: data.tag,
              category: data.category,
              subcategory: data.subcategory,
              model: data.model,
              manufacturer: data.manufacturer,
              status: data.status,
              location: data.location,
              purchase_cost: data.purchaseCost,
              warranty_status: data.warrantyStatus,
              notes: data.notes,
              barcode: data.barcode,
              qr_code: data.qr_code,
              specifications: data.specifications,
              discovery_source: data.discoverySource,
              assigned_to: data.assignedTo || null,
              assigned_department: data.assignedDepartment,
              purchase_date: data.purchaseDate || null,
              warranty_expiry: data.warrantyExpiry || null,
              serial_number: data.serialNumber,
              lifecycle_stage: data.lifecycle?.stage || 'Active',
              compliance_status: data.complianceStatus || 'Compliant',
              last_audit_date: data.lastAuditDate || null,
              next_maintenance_date: data.nextMaintenanceDate || null
            });
            const newAsset = { ...data, id: response.id };
            setAssets(prev => [...prev, newAsset]);
          }
          break;
        case 'license':
          if (editingItem) {
            response = await supabaseService.updateLicense(editingItem.id, {
              ...data,
              product_key: data.productKey,
              available_seats: data.availableSeats,
              expiry_date: data.expiryDate || null
            });
            setLicenses(prev => prev.map(item => item.id === editingItem.id ? { ...item, ...data } : item));
          } else {
            response = await supabaseService.createLicense({
              ...data,
              product_key: data.productKey,
              available_seats: data.availableSeats,
              expiry_date: data.expiryDate || null
            });
            const newLicense = { ...data, id: response.id };
            setLicenses(prev => [...prev, newLicense]);
          }
          break;
        case 'accessory':
          if (editingItem) {
            response = await supabaseService.updateAccessory(editingItem.id, {
              ...data,
              available_quantity: data.availableQuantity,
              purchase_date: data.purchaseDate || null,
              purchase_cost: data.purchaseCost
            });
            setAccessories(prev => prev.map(item => item.id === editingItem.id ? { ...item, ...data } : item));
          } else {
            response = await supabaseService.createAccessory({
              ...data,
              available_quantity: data.availableQuantity,
              purchase_date: data.purchaseDate || null,
              purchase_cost: data.purchaseCost
            });
            const newAccessory = { ...data, id: response.id };
            setAccessories(prev => [...prev, newAccessory]);
          }
          break;
        case 'consumable':
          if (editingItem) {
            response = await supabaseService.updateConsumable(editingItem.id, {
              ...data,
              min_quantity: data.minQuantity,
              item_number: data.itemNumber
            });
            setConsumables(prev => prev.map(item => item.id === editingItem.id ? { ...item, ...data } : item));
          } else {
            response = await supabaseService.createConsumable({
              ...data,
              min_quantity: data.minQuantity,
              item_number: data.itemNumber
            });
            const newConsumable = { ...data, id: response.id };
            setConsumables(prev => [...prev, newConsumable]);
          }
          break;
        case 'component':
          if (editingItem) {
            response = await supabaseService.updateComponent(editingItem.id, {
              ...data,
              serial_number: data.serialNumber,
              purchase_date: data.purchaseDate || null,
              purchase_cost: data.purchaseCost
            });
            setComponents(prev => prev.map(item => item.id === editingItem.id ? { ...item, ...data } : item));
          } else {
            response = await supabaseService.createComponent({
              ...data,
              serial_number: data.serialNumber,
              purchase_date: data.purchaseDate || null,
              purchase_cost: data.purchaseCost
            });
            const newComponent = { ...data, id: response.id };
            setComponents(prev => [...prev, newComponent]);
          }
          break;
        case 'user':
          if (editingItem) {
            response = await supabaseService.updateUser(editingItem.id, {
              ...data,
              first_name: data.firstName,
              last_name: data.lastName,
              job_title: data.jobTitle,
              employee_number: data.employeeNumber,
              last_login: data.lastLogin || null
            });
            setUsers(prev => prev.map(item => item.id === editingItem.id ? { ...item, ...data } : item));
          } else {
            response = await supabaseService.createUser({
              ...data,
              first_name: data.firstName,
              last_name: data.lastName,
              job_title: data.jobTitle,
              employee_number: data.employeeNumber,
              last_login: data.lastLogin || null
            });
            const newUser = { ...data, id: response.id };
            setUsers(prev => [...prev, newUser]);
          }
          break;
        case 'kit':
          if (editingItem) {
            response = await supabaseService.updatePredefinedKit(editingItem.id, data);
            setPredefinedKits(prev => prev.map(item => item.id === editingItem.id ? { ...item, ...data } : item));
          } else {
            response = await supabaseService.createPredefinedKit(data);
            const newKit = { ...data, id: response.id, createdDate: response.created_at };
            setPredefinedKits(prev => [...prev, newKit]);
          }
          break;
        case 'requestable':
          if (editingItem) {
            response = await supabaseService.updateRequestableItem(editingItem.id, data);
            setRequestableItems(prev => prev.map(item => item.id === editingItem.id ? { ...item, ...data } : item));
          } else {
            response = await supabaseService.createRequestableItem(data);
            const newRequestable = { ...data, id: response.id };
            setRequestableItems(prev => [...prev, newRequestable]);
          }
          break;
      }
    } catch (error) {
      console.error('Error saving item:', error);
    }
    
    setShowForm(false);
    setEditingItem(null);
  };

  const handleDelete = async (id: string, type: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      switch (type) {
        case 'asset':
          await supabaseService.deleteAsset(id);
          setAssets(prev => prev.filter(item => item.id !== id));
          break;
        case 'license':
          await supabaseService.deleteLicense(id);
          setLicenses(prev => prev.filter(item => item.id !== id));
          break;
        case 'accessory':
          await supabaseService.deleteAccessory(id);
          setAccessories(prev => prev.filter(item => item.id !== id));
          break;
        case 'consumable':
          await supabaseService.deleteConsumable(id);
          setConsumables(prev => prev.filter(item => item.id !== id));
          break;
        case 'component':
          await supabaseService.deleteComponent(id);
          setComponents(prev => prev.filter(item => item.id !== id));
          break;
        case 'user':
          await supabaseService.deleteUser(id);
          setUsers(prev => prev.filter(item => item.id !== id));
          break;
        case 'kit':
          await supabaseService.deletePredefinedKit(id);
          setPredefinedKits(prev => prev.filter(item => item.id !== id));
          break;
        case 'requestable':
          await supabaseService.deleteRequestableItem(id);
          setRequestableItems(prev => prev.filter(item => item.id !== id));
          break;
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleView = (item: any, type?: string) => {
    setViewingItem(item);
    setViewType(type || formType);
    setShowViewModal(true);
  };

  const handleImport = async (file: File, type: string) => {
    try {
      const importRecord = await supabaseService.createImportRecord({
        file_name: file.name,
        type: type as any,
        status: 'processing',
        records_processed: 0,
        total_records: 0,
        errors: [],
        import_date: new Date().toISOString()
      });

      const transformedRecord = {
        ...importRecord,
        fileName: importRecord.file_name,
        recordsProcessed: importRecord.records_processed,
        totalRecords: importRecord.total_records,
        importDate: importRecord.import_date
      };

      setImports(prev => [...prev, transformedRecord]);

      // Simulate import processing
      setTimeout(async () => {
        try {
          await supabaseService.updateImportRecord(importRecord.id, {
            status: 'completed',
            records_processed: 10,
            total_records: 10
          });
          setImports(prev => prev.map(imp => 
            imp.id === importRecord.id 
              ? { ...imp, status: 'completed', recordsProcessed: 10, totalRecords: 10 }
              : imp
          ));
        } catch (error) {
          console.error('Failed to update import record:', error);
        }
      }, 3000);
    } catch (error) {
      console.error('Failed to create import record:', error);
    }
  };

  const handleRunReport = (reportId: string) => {
    console.log('Running report:', reportId);
  };

  const handleCreateReport = () => {
    console.log('Creating new report');
  };

  const handleSaveSettings = (settings: any) => {
    console.log('Saving settings:', settings);
  };

  const handleProfileUpdate = (profile: UserProfile) => {
    setUserProfile(profile);
  };

  const handleDeploy = (kit: PredefinedKit) => {
    console.log('Deploying kit:', kit);
  };

  const handleRequest = (item: RequestableItem) => {
    console.log('Requesting item:', item);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <Dashboard 
            metrics={metrics} 
            onSectionChange={setActiveSection}
            onCreateNew={handleCreateNew}
          />
        );
      case 'assets':
        return (
          <AssetsList
            assets={assets}
            onCreateNew={() => handleCreateNew('asset')}
            onEdit={(asset) => handleEdit(asset, 'asset')}
            onDelete={(id) => handleDelete(id, 'asset')}
            onView={(asset) => handleView(asset, 'asset')}
          />
        );
      case 'licenses':
        return (
          <LicensesList
            licenses={licenses}
            onCreateNew={() => handleCreateNew('license')}
            onEdit={(license) => handleEdit(license, 'license')}
            onDelete={(id) => handleDelete(id, 'license')}
            onView={(license) => handleView(license, 'license')}
          />
        );
      case 'accessories':
        return (
          <AccessoriesList
            accessories={accessories}
            onCreateNew={() => handleCreateNew('accessory')}
            onEdit={(accessory) => handleEdit(accessory, 'accessory')}
            onDelete={(id) => handleDelete(id, 'accessory')}
            onView={(accessory) => handleView(accessory, 'accessory')}
          />
        );
      case 'consumables':
        return (
          <ConsumablesList
            consumables={consumables}
            onCreateNew={() => handleCreateNew('consumable')}
            onEdit={(consumable) => handleEdit(consumable, 'consumable')}
            onDelete={(id) => handleDelete(id, 'consumable')}
            onView={(consumable) => handleView(consumable, 'consumable')}
          />
        );
      case 'components':
        return (
          <ComponentsList
            components={components}
            onCreateNew={() => handleCreateNew('component')}
            onEdit={(component) => handleEdit(component, 'component')}
            onDelete={(id) => handleDelete(id, 'component')}
            onView={(component) => handleView(component, 'component')}
          />
        );
      case 'people':
        return (
          <PeopleList
            users={users}
            onCreateNew={() => handleCreateNew('user')}
            onEdit={(user) => handleEdit(user, 'user')}
            onDelete={(id) => handleDelete(id, 'user')}
            onView={(user) => handleView(user, 'user')}
          />
        );
      case 'predefined-kits':
        return (
          <PredefinedKitsList
            kits={predefinedKits}
            onCreateNew={() => handleCreateNew('kit')}
            onEdit={(kit) => handleEdit(kit, 'kit')}
            onDelete={(id) => handleDelete(id, 'kit')}
            onView={(kit) => handleView(kit, 'kit')}
            onDeploy={handleDeploy}
          />
        );
      case 'requestable-items':
        return (
          <RequestableItemsList
            items={requestableItems}
            onCreateNew={() => handleCreateNew('requestable')}
            onEdit={(item) => handleEdit(item, 'requestable')}
            onDelete={(id) => handleDelete(id, 'requestable')}
            onView={(item) => handleView(item, 'requestable')}
            onRequest={handleRequest}
          />
        );
      case 'alerts':
        return <AlertsManager />;
      case 'compliance':
        return <ComplianceManager assets={assets} licenses={licenses} />;
      case 'maintenance':
        return <MaintenanceManager assets={assets} />;
      case 'financial':
        return (
          <FinancialManager 
            assets={assets}
            licenses={licenses}
            accessories={accessories}
            consumables={consumables}
            components={components}
          />
        );
      case 'analytics':
        return (
          <AnalyticsManager
            assets={assets}
            licenses={licenses}
            accessories={accessories}
            consumables={consumables}
            components={components}
            users={users}
          />
        );
      case 'integrations':
        return <IntegrationsManager />;
      case 'reports':
        return (
          <ReportsManager
            reports={reports}
            onRunReport={handleRunReport}
            onCreateReport={handleCreateReport}
            assets={assets}
            licenses={licenses}
            accessories={accessories}
            consumables={consumables}
            components={components}
            users={users}
            predefinedKits={predefinedKits}
            requestableItems={requestableItems}
          />
        );
      case 'import':
        return <ImportManager imports={imports} onImport={handleImport} />;
      case 'settings':
        return <SettingsManager onSave={handleSaveSettings} />;
      default:
        return (
          <Dashboard 
            metrics={metrics} 
            onSectionChange={setActiveSection}
            onCreateNew={handleCreateNew}
          />
        );
    }
  };

  const renderForm = () => {
    if (!showForm) return null;

    const commonProps = {
      onSave: handleSave,
      onCancel: () => {
        setShowForm(false);
        setEditingItem(null);
      }
    };

    switch (formType) {
      case 'asset':
        return (
          <EnhancedAssetForm
            asset={editingItem}
            availableUsers={users}
            {...commonProps}
          />
        );
      case 'license':
        return (
          <LicenseForm
            license={editingItem}
            {...commonProps}
          />
        );
      case 'accessory':
        return (
          <AccessoryForm
            accessory={editingItem}
            {...commonProps}
          />
        );
      case 'consumable':
        return (
          <ConsumableForm
            consumable={editingItem}
            {...commonProps}
          />
        );
      case 'component':
        return (
          <ComponentForm
            component={editingItem}
            {...commonProps}
          />
        );
      case 'user':
        return (
          <UserForm
            user={editingItem}
            {...commonProps}
          />
        );
      case 'kit':
        return (
          <PredefinedKitForm
            kit={editingItem}
            availableAssets={assets}
            availableAccessories={accessories}
            availableLicenses={licenses}
            availableConsumables={consumables}
            {...commonProps}
          />
        );
      case 'requestable':
        return (
          <RequestableItemForm
            item={editingItem}
            {...commonProps}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        <Header
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
          userProfile={userProfile}
          onProfileUpdate={handleProfileUpdate}
        />
        
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>

      {renderForm()}
      
      <ViewModal
        isOpen={showViewModal}
        onClose={() => {
          setShowViewModal(false);
          setViewingItem(null);
        }}
        item={viewingItem}
        type={viewType}
      />
    </div>
  );
}

export default App;