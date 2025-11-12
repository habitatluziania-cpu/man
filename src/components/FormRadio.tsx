import React from 'react';

interface FormRadioProps {
  label: string;
  value: boolean | null;
  onChange: (value: boolean) => void;
  required?: boolean;
  error?: string;
}

export const FormRadio: React.FC<FormRadioProps> = ({
  label,
  value,
  onChange,
  required,
  error,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="flex gap-6">
        <div className="flex items-center gap-2">
          <input
            type="radio"
            id={`${label}-yes`}
            checked={value === true}
            onChange={() => onChange(true)}
            className="w-4 h-4 cursor-pointer"
          />
          <label htmlFor={`${label}-yes`} className="cursor-pointer text-sm text-gray-700">
            Sim
          </label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="radio"
            id={`${label}-no`}
            checked={value === false}
            onChange={() => onChange(false)}
            className="w-4 h-4 cursor-pointer"
          />
          <label htmlFor={`${label}-no`} className="cursor-pointer text-sm text-gray-700">
            Não
          </label>
        </div>
      </div>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};
