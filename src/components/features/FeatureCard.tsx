import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Feature } from '@/data/features';

interface FeatureCardProps {
  feature: Feature;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
  return (
    <a href={`/features/${feature.id}`} className="block group">
      <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer border-gray-200 hover:border-blue-300">
        <CardHeader className="text-center pb-4">
          <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <img 
              src={feature.iconPath} 
              alt={feature.altText}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {feature.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm text-gray-600 leading-relaxed">
            {feature.description}
          </CardDescription>
        </CardContent>
      </Card>
    </a>
  );
};