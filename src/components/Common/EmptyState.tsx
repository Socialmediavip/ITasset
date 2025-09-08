import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
  icon: React.ReactNode;
}

export default function EmptyState({ title, description, actionLabel, onAction, icon }: EmptyStateProps) {
  return (
    <div className="p-6">
      <div className="text-center py-12">
        <div className="text-gray-300 mb-4 flex justify-center">
          <div className="text-6xl">
            {icon}
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
        <button
          onClick={onAction}
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}