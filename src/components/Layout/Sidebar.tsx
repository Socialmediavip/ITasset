import React from 'react';
import { 
  LayoutDashboard, 
  HardDrive, 
  KeyRound, 
  Headphones, 
  Beaker, 
  Cpu, 
  Package, 
  Users, 
  Upload, 
  Settings, 
  FileText, 
  ShoppingCart,
  ChevronLeft,
  AlertTriangle,
  Shield,
  Calendar,
  DollarSign,
  BarChart3,
  Database,
  Link
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'assets', label: 'Assets', icon: HardDrive },
  { id: 'licenses', label: 'Licenses', icon: KeyRound },
  { id: 'accessories', label: 'Accessories', icon: Headphones },
  { id: 'consumables', label: 'Consumables', icon: Beaker },
  { id: 'components', label: 'Components', icon: Cpu },
  { id: 'people', label: 'People', icon: Users },
  { id: 'requestable-items', label: 'Requestable Items', icon: ShoppingCart },
  { id: 'predefined-kits', label: 'Predefined Kits', icon: Package },
  { id: 'alerts', label: 'Alerts & Notifications', icon: AlertTriangle },
  { id: 'compliance', label: 'Compliance & Audits', icon: Shield },
  { id: 'maintenance', label: 'Maintenance & Repairs', icon: Calendar },
  { id: 'financial', label: 'Financial Management', icon: DollarSign },
  { id: 'analytics', label: 'Analytics & Insights', icon: BarChart3 },
  { id: 'integrations', label: 'Integrations', icon: Link },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'import', label: 'Import', icon: Upload },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeSection, onSectionChange, isOpen, onToggle }: SidebarProps) {
  return (
    <div className={`bg-slate-800 text-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'} min-h-screen flex flex-col fixed left-0 top-0 z-40`}>
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        {isOpen && <h1 className="text-xl font-bold">AssetFlow</h1>}
        <button
          onClick={onToggle}
          className="p-2 hover:bg-slate-700 rounded transition-colors"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${isOpen ? '' : 'rotate-180'}`} />
        </button>
      </div>
      
      <nav className="flex-1 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center px-4 py-3 text-left hover:bg-slate-700 transition-colors ${
                isActive ? 'bg-slate-700 border-r-2 border-blue-500' : ''
              }`}
              title={isOpen ? '' : item.label}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && <span className="ml-3">{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
}