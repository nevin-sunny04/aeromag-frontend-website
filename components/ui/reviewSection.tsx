'use client';
import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ReviewSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function ReviewSection({ title, children, icon }: ReviewSectionProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex pb-0 items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}

interface ReviewItemProps {
  label: string;
  value: string | React.ReactNode;
  className?: string;
}

export function ReviewItem({ label, value, className = '' }: ReviewItemProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <dt className="text-sm font-medium text-gray-600 dark:text-white">{label}</dt>
      <dd className="text-sm text-gray-900 dark:text-gray-300">{value || 'Not provided'}</dd>
    </div>
  );
}

interface ReviewGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3;
}

export function ReviewGrid({ children, columns = 2 }: ReviewGridProps) {
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  };

  return <dl className={`grid ${gridClass[columns]} gap-4`}>{children}</dl>;
}
