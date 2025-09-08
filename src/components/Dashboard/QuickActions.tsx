import React from 'react';

interface QuickActionsProps {
  onCreateNew: (type: string) => void;
}

export default function QuickActions({ onCreateNew }: QuickActionsProps) {
  const actions = [
    { type: 'asset', label: 'New Asset', bgColor: 'bg-teal-600 hover:bg-teal-700' },
    { type: 'license', label: 'New License', bgColor: 'bg-pink-600 hover:bg-pink-700' },
    { type: 'accessory', label: 'New Accessory', bgColor: 'bg-orange-600 hover:bg-orange-700' },
    { type: 'consumable', label: 'New Consumable', bgColor: 'bg-purple-600 hover:bg-purple-700' },
    { type: 'component', label: 'New Component', bgColor: 'bg-yellow-600 hover:bg-yellow-700' },
    { type: 'user', label: 'New User', bgColor: 'bg-blue-600 hover:bg-blue-700' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {actions.map((action) => (
        <button
          key={action.type}
          onClick={() => onCreateNew(action.type)}
          className={`${action.bgColor} text-white py-3 px-4 rounded-md font-medium transition-colors text-center`}
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}