import React from 'react';
import { ArrowRight } from 'lucide-react';

interface MetricCardProps {
  title: string;
  count: number;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
  onViewAll: () => void;
}

export default function MetricCard({ title, count, color, bgColor, icon, onViewAll }: MetricCardProps) {
  return (
    <div className={`${bgColor} rounded-lg p-6 text-white relative overflow-hidden`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-3xl font-bold mb-2">{count}</div>
          <div className="text-lg font-medium">{title}</div>
        </div>
        <div className="text-white/20 text-5xl">
          {icon}
        </div>
      </div>
      
      <button
        onClick={onViewAll}
        className="absolute bottom-4 right-4 flex items-center space-x-1 text-white/80 hover:text-white transition-colors"
      >
        <span className="text-sm">view all</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}