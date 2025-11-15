import React from 'react';
import { Upload } from 'lucide-react';

/**
 * FileDropZone - Centraliserad dropzon-komponent för filuppladdning
 * 
 * Standardiserad höjd, text, storlekar och färger för konsekvent UI
 */
export default function FileDropZone({
  accept = '.pdf',
  maxSize = '10 MB',
  isDragging = false,
  onDragOver,
  onDragLeave,
  onDrop,
  onChange,
  inputId,
  children,
  variant = 'compact', // 'compact' | 'default' (compact rekommenderas för slides)
}) {
  const variants = {
    compact: {
      container: 'min-h-[110px]',
      padding: 'p-6',
      iconSize: 'w-8 h-8',
      iconMargin: 'mb-2',
      mainTextSize: 'text-sm',
      mainTextMargin: 'mb-1',
      subTextSize: 'text-xs',
      infoTextSize: 'text-xs',
      infoTextMargin: 'mt-1',
    },
    default: {
      container: 'min-h-[160px]',
      padding: 'p-10',
      iconSize: 'w-10 h-10',
      iconMargin: 'mb-3',
      mainTextSize: 'text-base',
      mainTextMargin: 'mb-2',
      subTextSize: 'text-sm',
      infoTextSize: 'text-xs',
      infoTextMargin: 'mt-2',
    },
  };

  const style = variants[variant];

  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`relative border-2 border-dashed rounded-box ${style.container} ${style.padding} text-center transition-all ${
        isDragging
          ? 'border-brand-500 bg-brand-50'
          : 'border-gray-300 bg-white hover:border-brand-400 hover:bg-brand-50/50'
      }`}
    >
      <input
        type="file"
        accept={accept}
        onChange={onChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        id={inputId}
      />
      <div className="pointer-events-none flex flex-col items-center justify-center">
        <Upload className={`${style.iconSize} text-brand-400 ${style.iconMargin}`} />
        <p className={`${style.mainTextSize} font-medium text-brand-700 ${style.mainTextMargin}`}>
          Dra och släpp PDF här
        </p>
        <p className={`${style.subTextSize} text-brand-600`}>
          eller klicka för att välja fil
        </p>
        {maxSize && (
          <p className={`${style.infoTextSize} text-brand-500 ${style.infoTextMargin}`}>
            Max {maxSize} • {accept.replace(/\./g, '').toUpperCase()}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}
