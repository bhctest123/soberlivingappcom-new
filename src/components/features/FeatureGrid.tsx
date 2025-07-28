import React from 'react';
import { FeatureCard } from './FeatureCard';
import { features } from '@/data/features';
import type { Feature } from '@/data/features';

// Categorize features by department
const categorizeFeatures = (features: Feature[]) => {
  const categories = {
    'Core Management': [
      'dashboard',
      'residents',
      'properties',
      'bed-management',
      'employees',
      'schedule',
      'tasks',
      'mobile'
    ],
    'Departments': [
      'admissions',
      'housing',
      'operations',
      'billing',
      'invoices'
    ],
    'Communication & Documentation': [
      'communication-logs',
      'housing-notes',
      'files',
      'general-info',
      'contacts'
    ],
    'Organizations & Relationships': [
      'organizations',
      'organizations-providers',
      'organizations-resources',
      'organizations-vendors',
      'connections',
      'alumni',
      'leads'
    ],
    'Testing & Compliance': [
      'drug-test',
      'test-results',
      'permissions'
    ]
  };

  const categorizedFeatures: Record<string, Feature[]> = {};

  Object.entries(categories).forEach(([category, featureIds]) => {
    categorizedFeatures[category] = features.filter(feature => 
      featureIds.includes(feature.id)
    );
  });

  return categorizedFeatures;
};

export const FeatureGrid: React.FC = () => {
  const categorizedFeatures = categorizeFeatures(features);

  return (
    <div className="space-y-12">
      {Object.entries(categorizedFeatures).map(([category, categoryFeatures]) => (
        <div key={category} className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
            {category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryFeatures.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};