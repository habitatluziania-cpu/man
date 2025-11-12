import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  type?: string;
  error?: string;
  required?: boolean;
  maxLength?: number;
  mask?: (value: string) => string;
  showCopyButton?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  type = 'text',
  error,
  required,
  maxLength,
  mask,
  showCopyButton = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    if (mask) {
      newValue = mask(newValue);
    }
    onChange(newValue);
  };

  const handleCopy = async () => {
    if (value) {
      try {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Erro ao copiar:', err);
      }
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {/* MODIFICADO: Label em preto escuro */}
      <label className="block text-sm font-medium text-gray-900">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative flex items-center gap-2">
        <input
          type={type}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`flex-1 px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500 ${
            error
              ? 'border-red-500 focus:ring-red-200'
              : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
          }`}
        />
        {showCopyButton && (
          <button
            type="button"
            onClick={handleCopy}
            className={`p-2 rounded-lg border transition-all ${
              copied
                ? 'bg-green-50 border-green-300 text-green-600'
                : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
            }`}
            title="Copiar"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};
