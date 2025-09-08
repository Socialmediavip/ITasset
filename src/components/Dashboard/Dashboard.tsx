import React from 'react';
import { HardDrive, KeyRound, Headphones, Beaker, Cpu, Users } from 'lucide-react';
import MetricCard from './MetricCard';
import QuickActions from './QuickActions';
import { DashboardMetrics } from '../../types';

interface DashboardProps {
  metrics: DashboardMetrics;
  onSectionChange: (section: string) => void;
  onCreateNew: (type: string) => void;
}

export default function Dashboard({ metrics, onSectionChange, onCreateNew }: DashboardProps) {
  const metricCards = [
    {
      title: 'Assets',
      count: metrics.assets,
      color: 'text-teal-600',
      bgColor: 'bg-gradient-to-br from-teal-500 to-teal-600',
      icon: <HardDrive />,
      section: 'assets'
    },
    {
      title: 'Licenses',
      count: metrics.licenses,
      color: 'text-pink-600',
      bgColor: 'bg-gradient-to-br from-pink-500 to-pink-600',
      icon: <KeyRound />,
      section: 'licenses'
    },
    {
      title: 'Accessories',
      count: metrics.accessories,
      color: 'text-orange-600',
      bgColor: 'bg-gradient-to-br from-orange-500 to-orange-600',
      icon: <Headphones />,
      section: 'accessories'
    },
    {
      title: 'Consumables',
      count: metrics.consumables,
      color: 'text-purple-600',
      bgColor: 'bg-gradient-to-br from-purple-500 to-purple-600',
      icon: <Beaker />,
      section: 'consumables'
    },
    {
      title: 'Components',
      count: metrics.components,
      color: 'text-yellow-600',
      bgColor: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
      icon: <Cpu />,
      section: 'components'
    },
    {
      title: 'People',
      count: metrics.people,
      color: 'text-blue-600',
      bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
      icon: <Users />,
      section: 'people'
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {metricCards.map((card) => (
          <MetricCard
            key={card.title}
            title={card.title}
            count={card.count}
            color={card.color}
            bgColor={card.bgColor}
            icon={card.icon}
            onViewAll={() => onSectionChange(card.section)}
          />
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <p className="text-gray-700 mb-4">
          This is your dashboard. There are many like it, but this one is yours.
        </p>
        
        <div className="bg-orange-100 border-l-4 border-orange-500 p-4 mb-6">
          <p className="text-orange-700">
            It looks like you have not added anything yet, so we do not have anything awesome to display. 
            Get started by adding some assets, accessories, consumables, or licenses now!
          </p>
        </div>

        <QuickActions onCreateNew={onCreateNew} />
      </div>
    </div>
  );
}