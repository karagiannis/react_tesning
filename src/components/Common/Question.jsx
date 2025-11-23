/**
 * CREATED: 2025-11-23
 * PURPOSE: Generic reusable question component for all questionnaire slides
 * FEATURES: Single-choice, multi-choice, expansion fields, validation
 * REF: CHANGELOG_2025-11-23.md - Problem 5
 */

import React, { useState, useEffect } from 'react';
import './Question.css';

/**
 * Generic Question Component
 * @param {Object} config - Question config from QUESTIONNAIRE_CONFIG
 * @param {Object} value - Current value: { selected: string, expansion: Object }
 * @param {Function} onChange - Callback: (selected, expansion) => void
 * @param {string} error - Validation error message
 */
const Question = ({ config, value, onChange, error }) => {
  const [showExpansion, setShowExpansion] = useState(false);

  // Show expansion field if current selection has expansion
  useEffect(() => {
    if (value?.selected) {
      const option = config.options.find(opt => opt.value === value.selected);
      setShowExpansion(option?.hasExpansion || false);
    } else {
      setShowExpansion(false);
    }
  }, [value?.selected, config.options]);

  const handleOptionChange = (optionValue) => {
    const option = config.options.find(opt => opt.value === optionValue);
    
    if (option?.hasExpansion) {
      // Behåll befintlig expansion-data om användaren byter mellan expansion-options
      onChange(optionValue, value?.expansion || null);
    } else {
      // Clear expansion data om användaren väljer icke-expansion option
      onChange(optionValue, null);
    }
  };

  const handleExpansionChange = (expansionData) => {
    onChange(value.selected, expansionData);
  };

  const selectedOption = config.options.find(opt => opt.value === value?.selected);

  return (
    <div className={`question ${error ? 'has-error' : ''}`}>
      <label className="question-label">
        {config.text}
        {config.required && <span className="required">*</span>}
      </label>
      
      {config.helpText && (
        <p className="help-text">{config.helpText}</p>
      )}

      <div className="options">
        {config.type === 'single-choice' && config.options.map(option => (
          <label key={option.value} className="option radio-option">
            <input
              type="radio"
              name={config.id}
              value={option.value}
              checked={value?.selected === option.value}
              onChange={() => handleOptionChange(option.value)}
            />
            <span className="option-label">{option.label}</span>
          </label>
        ))}
        
        {config.type === 'checkbox' && config.options.map(option => (
          <label key={option.value} className="option checkbox-option">
            <input
              type="checkbox"
              value={option.value}
              checked={value?.selected === option.value}
              onChange={(e) => handleOptionChange(e.target.checked ? option.value : null)}
            />
            <span className="option-label">{option.label}</span>
          </label>
        ))}
      </div>

      {/* Visa expansion field om valt alternativ har hasExpansion */}
      {showExpansion && selectedOption?.hasExpansion && selectedOption.expansionConfig && (
        <div className="expansion-field">
          <label className="expansion-label">
            {selectedOption.expansionConfig.label}
            {selectedOption.expansionConfig.required && <span className="required">*</span>}
          </label>
          
          {selectedOption.expansionConfig.type === 'multi-select' && (
            <div className="multi-select-container">
              {selectedOption.expansionConfig.options.map(opt => (
                <label key={opt} className="multi-select-option">
                  <input
                    type="checkbox"
                    value={opt}
                    checked={value?.expansion?.[selectedOption.expansionConfig.key]?.includes(opt) || false}
                    onChange={(e) => {
                      const currentList = value?.expansion?.[selectedOption.expansionConfig.key] || [];
                      const newList = e.target.checked
                        ? [...currentList, opt]
                        : currentList.filter(item => item !== opt);
                      
                      handleExpansionChange({
                        [selectedOption.expansionConfig.key]: newList
                      });
                    }}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          )}
          
          {selectedOption.expansionConfig.type === 'text' && (
            <input
              type="text"
              className="expansion-text-input"
              placeholder={selectedOption.expansionConfig.placeholder}
              value={value?.expansion?.[selectedOption.expansionConfig.key] || ''}
              onChange={(e) => {
                handleExpansionChange({
                  [selectedOption.expansionConfig.key]: e.target.value
                });
              }}
            />
          )}
          
          {selectedOption.expansionConfig.type === 'textarea' && (
            <textarea
              className="expansion-textarea"
              placeholder={selectedOption.expansionConfig.placeholder}
              rows={selectedOption.expansionConfig.rows || 3}
              value={value?.expansion?.[selectedOption.expansionConfig.key] || ''}
              onChange={(e) => {
                handleExpansionChange({
                  [selectedOption.expansionConfig.key]: e.target.value
                });
              }}
            />
          )}
        </div>
      )}

      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default Question;
