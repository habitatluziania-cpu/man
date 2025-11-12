import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface InputWithCopyProps {
  type?: string;
  value: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  className?: string;
  readOnly?: boolean;
}

export const InputWithCopy: React.FC<InputWithCopyProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  required,
  maxLength,
  min,
  max,
  className = '',
  readOnly = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (value !== undefined && value !== null && value !== '') {
      try {
        await navigator.clipboard.writeText(value.toString());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Erro ao copiar:', err);
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        min={min}
        max={max}
        readOnly={readOnly}
        className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${className}`}
      />
      <button
        type="button"
        onClick={handleCopy}
        className={`p-2 rounded-lg border transition-all flex-shrink-0 ${
          copied
            ? 'bg-green-50 border-green-300 text-green-600'
            : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
        }`}
        title="Copiar"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
};
