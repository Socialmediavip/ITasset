export interface Asset {
  id: string;
  name: string;
  tag: string;
  category: AssetCategory;
  subcategory: string;
  model: string;
  manufacturer: string;
  serialNumber: string;
  status: AssetStatus;
  assignedTo?: string;
  assignedDepartment?: string;
  custodianHistory: CustodianRecord[];
  location: AssetLocation | string;
  purchaseDate: string;
  purchaseCost: number;
  warrantyExpiry?: string;
  warrantyStatus: WarrantyStatus;
  supportContract?: SupportContract;
  notes?: string;
  lifecycle: AssetLifecycle;
  barcode?: string;
  qrCode?: string;
  specifications: Record<string, any>;
  depreciation: DepreciationInfo;
  leaseInfo?: LeaseInfo;
  maintenanceRecords: MaintenanceRecord[];
  complianceStatus: ComplianceStatus;
  discoverySource?: string;
  lastAuditDate?: string;
  nextMaintenanceDate?: string;
}

export interface SoftwareAsset {
  id: string;
  name: string;
  version: string;
  category: SoftwareCategory;
  type: SoftwareType;
  manufacturer: string;
  licenseKey?: string;
  installationPath?: string;
  installedOn: string[]; // Asset IDs
  licenseType: LicenseType;
  seats: number;
  usedSeats: number;
  expiryDate?: string;
  supportExpiry?: string;
  complianceStatus: ComplianceStatus;
  cost: number;
  renewalDate?: string;
  vendor: VendorInfo;
  saasSubscription?: SaasSubscription;
  usageLogs: UsageLog[];
}

export interface AssetLocation {
  building: string;
  floor?: string;
  room?: string;
  rack?: string;
  position?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  address: string;
  isRemote: boolean;
}

export interface CustodianRecord {
  id: string;
  userId: string;
  userName: string;
  department: string;
  assignedDate: string;
  returnedDate?: string;
  reason: string;
  approvedBy: string;
}

export interface AssetLifecycle {
  procurementDate: string;
  deploymentDate?: string;
  lastMaintenanceDate?: string;
  decommissionDate?: string;
  disposalDate?: string;
  stage: LifecycleStage;
  nextStageDate?: string;
}

export interface DepreciationInfo {
  method: DepreciationMethod;
  usefulLife: number; // in years
  salvageValue: number;
  currentValue: number;
  depreciationRate: number;
  lastCalculated: string;
}

export interface LeaseInfo {
  lessor: string;
  leaseStart: string;
  leaseEnd: string;
  monthlyPayment: number;
  totalLeaseValue: number;
  buyoutOption?: number;
  autoRenewal: boolean;
}

export interface MaintenanceRecord {
  id: string;
  date: string;
  type: MaintenanceType;
  description: string;
  cost: number;
  vendor: string;
  technician: string;
  status: MaintenanceStatus;
  scheduledDate?: string;
  completedDate?: string;
  nextMaintenanceDate?: string;
  partsUsed: string[];
  incidentId?: string;
}

export interface SupportContract {
  id: string;
  vendor: string;
  contractNumber: string;
  startDate: string;
  endDate: string;
  supportLevel: SupportLevel;
  responseTime: string;
  cost: number;
  renewalDate?: string;
  autoRenewal: boolean;
  contactInfo: ContactInfo;
}

export interface VendorInfo {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  supportPortal?: string;
  accountManager?: string;
}

export interface SaasSubscription {
  subscriptionId: string;
  billingCycle: BillingCycle;
  pricePerSeat: number;
  totalCost: number;
  renewalDate: string;
  autoRenewal: boolean;
  paymentMethod: string;
  adminContact: string;
}

export interface UsageLog {
  id: string;
  userId: string;
  assetId: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  activity: string;
  ipAddress?: string;
  location?: string;
}

export interface ComplianceCheck {
  id: string;
  type: ComplianceType;
  status: ComplianceStatus;
  lastChecked: string;
  nextCheck: string;
  violations: PolicyViolation[];
  auditor: string;
  notes?: string;
}

export interface PolicyViolation {
  id: string;
  type: ViolationType;
  severity: ViolationSeverity;
  description: string;
  detectedDate: string;
  resolvedDate?: string;
  assignedTo: string;
  status: ViolationStatus;
}

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  assetId?: string;
  userId?: string;
  createdDate: string;
  dueDate?: string;
  acknowledgedDate?: string;
  resolvedDate?: string;
  status: AlertStatus;
  actions: AlertAction[];
}

export interface AlertAction {
  id: string;
  action: string;
  performedBy?: string;
  performedDate?: string;
  notes?: string;
}

export interface InventoryCheck {
  id: string;
  type: InventoryType;
  scheduledDate: string;
  completedDate?: string;
  location: string;
  assignedTo: string;
  status: InventoryStatus;
  assetsChecked: string[];
  discrepancies: InventoryDiscrepancy[];
  notes?: string;
}

export interface InventoryDiscrepancy {
  assetId: string;
  expectedLocation: string;
  actualLocation?: string;
  status: DiscrepancyStatus;
  resolvedDate?: string;
  resolvedBy?: string;
  notes?: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendor: string;
  orderDate: string;
  expectedDelivery: string;
  actualDelivery?: string;
  totalAmount: number;
  status: POStatus;
  items: POItem[];
  approvedBy: string;
  receivedBy?: string;
  invoiceNumber?: string;
}

export interface POItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  assetCategory: string;
  specifications?: Record<string, any>;
}

export interface ServiceAgreement {
  id: string;
  vendor: string;
  serviceType: ServiceType;
  startDate: string;
  endDate: string;
  sla: ServiceLevelAgreement;
  cost: number;
  renewalTerms: string;
  terminationClause: string;
  keyContacts: ContactInfo[];
}

export interface ServiceLevelAgreement {
  responseTime: string;
  resolutionTime: string;
  availability: number; // percentage
  penalties: SLAPenalty[];
  escalationMatrix: EscalationLevel[];
}

export interface SLAPenalty {
  condition: string;
  penalty: number;
  type: 'percentage' | 'fixed';
}

export interface EscalationLevel {
  level: number;
  timeframe: string;
  contact: string;
  role: string;
}

export interface ContactInfo {
  name: string;
  role: string;
  email: string;
  phone: string;
  alternatePhone?: string;
}

export interface Integration {
  id: string;
  name: string;
  type: IntegrationType;
  endpoint: string;
  apiKey?: string;
  lastSync: string;
  syncFrequency: string;
  status: IntegrationStatus;
  mappings: FieldMapping[];
  errorLog: IntegrationError[];
}

export interface FieldMapping {
  sourceField: string;
  targetField: string;
  transformation?: string;
}

export interface IntegrationError {
  timestamp: string;
  error: string;
  details: string;
  resolved: boolean;
}

// Enums
export type AssetCategory = 
  | 'Desktop' 
  | 'Laptop' 
  | 'Server' 
  | 'Mobile Device' 
  | 'Printer' 
  | 'Peripheral' 
  | 'Network Equipment'
  | 'Storage Device'
  | 'Security Device';

export type SoftwareCategory = 
  | 'Operating System'
  | 'Productivity Suite'
  | 'Development Tools'
  | 'Security Software'
  | 'Database'
  | 'Middleware'
  | 'Utilities'
  | 'Design Software';

export type SoftwareType = 
  | 'Installed Software'
  | 'Licensed Software'
  | 'Open Source Software'
  | 'SaaS Subscription';

export type LicenseType = 
  | 'Per Device'
  | 'Per User'
  | 'Concurrent'
  | 'Site License'
  | 'Enterprise'
  | 'Subscription';

export type AssetStatus = 
  | 'Active'
  | 'In Repair'
  | 'In Stock'
  | 'Retired'
  | 'Disposed'
  | 'Lost'
  | 'Stolen';

export type WarrantyStatus = 
  | 'Active'
  | 'Expired'
  | 'Expiring Soon'
  | 'Not Applicable';

export type LifecycleStage = 
  | 'Procurement'
  | 'Deployment'
  | 'Active'
  | 'Maintenance'
  | 'Decommissioning'
  | 'Disposal';

export type DepreciationMethod = 
  | 'Straight Line'
  | 'Declining Balance'
  | 'Sum of Years'
  | 'Units of Production';

export type MaintenanceType = 
  | 'Preventive'
  | 'Corrective'
  | 'Emergency'
  | 'Upgrade'
  | 'Inspection';

export type MaintenanceStatus = 
  | 'Scheduled'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled'
  | 'Overdue';

export type SupportLevel = 
  | 'Basic'
  | 'Standard'
  | 'Premium'
  | 'Enterprise'
  | 'Mission Critical';

export type BillingCycle = 
  | 'Monthly'
  | 'Quarterly'
  | 'Annually'
  | 'One-time';

export type ComplianceType = 
  | 'License Compliance'
  | 'Security Compliance'
  | 'Regulatory Compliance'
  | 'Policy Compliance';

export type ComplianceStatus = 
  | 'Compliant'
  | 'Non-Compliant'
  | 'Under Review'
  | 'Remediation Required';

export type ViolationType = 
  | 'License Overuse'
  | 'Unauthorized Software'
  | 'Security Policy'
  | 'Data Retention'
  | 'Access Control';

export type ViolationSeverity = 
  | 'Low'
  | 'Medium'
  | 'High'
  | 'Critical';

export type ViolationStatus = 
  | 'Open'
  | 'In Progress'
  | 'Resolved'
  | 'Closed';

export type AlertType = 
  | 'Warranty Expiry'
  | 'License Expiry'
  | 'Maintenance Due'
  | 'Compliance Warning'
  | 'Security Alert'
  | 'Cost Threshold';

export type AlertSeverity = 
  | 'Info'
  | 'Warning'
  | 'Error'
  | 'Critical';

export type AlertStatus = 
  | 'Active'
  | 'Acknowledged'
  | 'Resolved'
  | 'Dismissed';

export type InventoryType = 
  | 'Physical Count'
  | 'Barcode Scan'
  | 'RFID Scan'
  | 'Spot Check'
  | 'Full Audit';

export type InventoryStatus = 
  | 'Scheduled'
  | 'In Progress'
  | 'Completed'
  | 'Cancelled';

export type DiscrepancyStatus = 
  | 'Found'
  | 'Missing'
  | 'Misplaced'
  | 'Resolved';

export type POStatus = 
  | 'Draft'
  | 'Pending Approval'
  | 'Approved'
  | 'Ordered'
  | 'Partially Received'
  | 'Received'
  | 'Cancelled';

export type ServiceType = 
  | 'Maintenance'
  | 'Support'
  | 'Consulting'
  | 'Training'
  | 'Implementation';

export type IntegrationType = 
  | 'Discovery Tool'
  | 'CMDB'
  | 'ITSM'
  | 'Procurement'
  | 'Financial'
  | 'HR System';

export type IntegrationStatus = 
  | 'Active'
  | 'Inactive'
  | 'Error'
  | 'Syncing';

// Existing interfaces (keeping for backward compatibility)
export interface License {
  id: string;
  name: string;
  productKey: string;
  seats: number;
  availableSeats: number;
  manufacturer: string;
  expiryDate?: string;
  category: string;
  notes?: string;
}

export interface Accessory {
  id: string;
  name: string;
  category: string;
  manufacturer: string;
  model: string;
  quantity: number;
  availableQuantity: number;
  location: string;
  purchaseDate: string;
  purchaseCost: number;
}

export interface Consumable {
  id: string;
  name: string;
  category: string;
  manufacturer: string;
  model: string;
  quantity: number;
  minQuantity: number;
  location: string;
  itemNumber?: string;
}

export interface Component {
  id: string;
  name: string;
  category: string;
  manufacturer: string;
  model: string;
  serialNumber?: string;
  quantity: number;
  location: string;
  purchaseDate: string;
  purchaseCost: number;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  department: string;
  location: string;
  jobTitle: string;
  manager?: string;
  employeeNumber?: string;
  phone?: string;
  activated: boolean;
  lastLogin?: string;
}

export interface PredefinedKit {
  id: string;
  name: string;
  description: string;
  assets: string[];
  accessories: string[];
  consumables: string[];
  licenses: string[];
  category: string;
  createdDate: string;
}

export interface ImportRecord {
  id: string;
  fileName: string;
  type: 'assets' | 'licenses' | 'accessories' | 'consumables' | 'users';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  recordsProcessed: number;
  totalRecords: number;
  errors: string[];
  importDate: string;
}

export interface Report {
  id: string;
  name: string;
  type: 'asset' | 'license' | 'maintenance' | 'depreciation' | 'audit';
  description: string;
  parameters: Record<string, any>;
  lastRun?: string;
  createdBy: string;
}

export interface RequestableItem {
  id: string;
  name: string;
  category: string;
  description: string;
  image?: string;
  requestable: boolean;
  quantity: number;
  location: string;
  notes?: string;
}

export interface DashboardMetrics {
  assets: number;
  licenses: number;
  accessories: number;
  consumables: number;
  components: number;
  people: number;
  predefinedKits: number;
  requestableItems: number;
  alerts: number;
  expiringWarranties: number;
  expiringLicenses: number;
  maintenanceDue: number;
  complianceIssues: number;
  totalValue: number;
}

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  avatar?: string;
  department: string;
  jobTitle: string;
  phone?: string;
  location: string;
  lastLogin?: string;
  createdAt: string;
  permissions: string[];
  preferences: {
    theme: 'light' | 'dark';
    language: string;
    timezone: string;
    notifications: boolean;
  };
}

export interface SystemSettings {
  general: {
    siteName: string;
    siteUrl: string;
    timezone: string;
    dateFormat: string;
    currency: string;
    logo?: string;
  };
  notifications: {
    emailNotifications: boolean;
    warrantyAlerts: boolean;
    licenseExpiry: boolean;
    maintenanceReminders: boolean;
    lowStockAlerts: boolean;
    alertDays: number;
  };
  security: {
    passwordMinLength: number;
    requireSpecialChars: boolean;
    sessionTimeout: number;
    twoFactorAuth: boolean;
    loginAttempts: number;
    passwordExpiry: number;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUsername: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
    encryption: 'none' | 'tls' | 'ssl';
  };
  backup: {
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    retention: number;
    location: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}