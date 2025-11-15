import React from 'react';
import { Check, AlertTriangle, X } from 'lucide-react';

// Custom Info icon without circle (just 'i')
const InfoIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M11 17h2v-6h-2v6zm1-15C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zM11 9h2V7h-2v2z"/>
  </svg>
);

// Simple 'i' without outer circle - thicker for better visibility
const SimpleInfoIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    {/* Vertical line (body) - wider */}
    <rect x="10.5" y="11" width="3" height="9" rx="1.5"/>
    {/* Dot - larger */}
    <circle cx="12" cy="7" r="2"/>
  </svg>
);

/**
 * BadgeIcon - Flexibel badge med olika ikoner, färger och former
 * 
 * Användning:
 * <BadgeIcon icon="check" variant="success" shape="circle" />
 * <BadgeIcon icon="info" variant="brand" shape="square" />
 * <BadgeIcon icon="warning" variant="warning" shape="rounded" />
 */
export default function BadgeIcon({ 
  icon = 'check', // 'check' | 'info' | 'warning' | 'error'
  variant = 'brand', // 'brand' | 'success' | 'warning' | 'error' | 'info'
  shape = 'circle', // 'circle' | 'square' | 'rounded'
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '' 
}) {
  const icons = {
    check: Check,
    info: SimpleInfoIcon,
    warning: AlertTriangle,
    error: X,
  };

  const variants = {
    brand: 'bg-brand-600 text-white',
    success: 'bg-green-600 text-white',
    warning: 'bg-yellow-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-blue-600 text-white',
  };

  const shapes = {
    circle: 'rounded-full',
    square: 'rounded-none',
    rounded: 'rounded-md',
  };

  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const IconComponent = icons[icon];

  return (
    <span 
      className={`inline-flex items-center justify-center flex-shrink-0 ${variants[variant]} ${shapes[shape]} ${sizes[size]} ${className}`}
    >
      <IconComponent className={iconSizes[size]} strokeWidth={2.5} />
    </span>
  );
}
