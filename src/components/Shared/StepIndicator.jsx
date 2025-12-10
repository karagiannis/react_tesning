import { useNavigate } from 'react-router-dom';

/**
 * StepIndicator - Klickbara completion dots för multistep wizard
 * Visar progression mellan steg 1-4 och tillåter navigation
 * 
 * @param {number} current_step - Aktuellt steg (1-4)
 * @param {number} completedSteps - Antal slutförda steg (0-4)
 */
export default function StepIndicator({ current_step, completedSteps = 0 }) {
  const navigate = useNavigate();

  const steps = [
    { number: 1, route: '/riskfragor', label: 'Grundläggande' },
    { number: 2, route: '/riskfragor/steg2', label: 'Geografisk risk' },
    { number: 3, route: '/riskfragor/steg3', label: 'Betalningsmetoder' },
    { number: 4, route: '/riskfragor/steg4', label: 'EDD-frågor' }
  ];

  const handleStepClick = (step) => {
    // Tillåt endast navigation till slutförda steg eller nuvarande steg
    if (step.number <= completedSteps + 1) {
      navigate(step.route);
    }
  };

  return (
    <div className="flex items-center justify-center gap-3 mb-6">
      {steps.map((step, index) => {
        const isActive = step.number === current_step;
        const isCompleted = step.number <= completedSteps;
        const isClickable = step.number <= completedSteps + 1;

        return (
          <div key={step.number} className="flex items-center">
            {/* Step dot */}
            <button
              onClick={() => handleStepClick(step)}
              disabled={!isClickable}
              className={`
                relative flex items-center justify-center
                w-8 h-8 rounded-full font-semibold text-xs
                transition-all duration-200
                ${isActive 
                  ? 'bg-brand-600 text-white ring-3 ring-brand-200 scale-110' 
                  : isCompleted
                    ? 'bg-brand-500 text-white hover:bg-brand-600'
                    : 'bg-gray-200 text-gray-400'
                }
                ${isClickable && !isActive ? 'cursor-pointer hover:scale-105' : ''}
                ${!isClickable ? 'cursor-not-allowed' : ''}
              `}
              title={step.label}
            >
              {isCompleted && !isActive ? (
                // Checkmark för slutförda steg
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                step.number
              )}
            </button>

            {/* Connector line (except after last step) */}
            {index < steps.length - 1 && (
              <div 
                className={`
                  w-8 h-0.5 mx-1
                  ${step.number <= completedSteps ? 'bg-brand-500' : 'bg-gray-200'}
                  transition-colors duration-200
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
