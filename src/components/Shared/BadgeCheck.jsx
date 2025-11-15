import React from 'react';
import { Check } from 'lucide-react';

/**
 * BadgeCheck - Konsekvent checkmark badge med brand colors
 * 
 * Användning:
 * <BadgeCheck variant="success" /> - Ljusgrön med vit checkmark
 * <BadgeCheck variant="brand" /> - Brand color (default)
 * <BadgeCheck variant="warning" /> - Gul för varningar
 */
export default function BadgeCheck({ 
  variant = 'brand', 
  size = 'md',
  className = '' 
}) {
  const variants = {
    brand: 'bg-brand-600 text-white',
    success: 'bg-green-600 text-white',
    warning: 'bg-yellow-600 text-white',
    light: 'bg-brand-100 text-brand-700',
  };

  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <span 
      className={`inline-flex items-center justify-center rounded-full flex-shrink-0 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      <Check className={iconSizes[size]} strokeWidth={3} />
    </span>
  );
}
