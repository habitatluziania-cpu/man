import React from 'react';
import { FormInput } from '../FormInput';
import { masks } from '../../utils/masks';

interface ContactSectionProps {
  data: {
    personalPhone: string;
    referencePhone1: string;
    referencePhone2: string;
    referencePhone3: string;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
  onBlur: (field: string) => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  data,
  errors,
  onChange,
  onBlur,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Contatos</h2>

      <FormInput
        label="Telefone Pessoal"
        value={data.personalPhone}
        onChange={(value) => onChange('personalPhone', masks.phone(value))}
        onBlur={() => onBlur('personalPhone')}
        placeholder="(00) 00000-0000"
        required
        error={errors.personalPhone}
        maxLength={15}
      />

      <FormInput
        label="Telefone para Recado 1"
        value={data.referencePhone1}
        onChange={(value) => onChange('referencePhone1', masks.phone(value))}
        onBlur={() => onBlur('referencePhone1')}
        placeholder="(00) 00000-0000"
        required
        error={errors.referencePhone1}
        maxLength={15}
      />

      <FormInput
        label="Telefone para Recado 2 (Opcional)"
        value={data.referencePhone2}
        onChange={(value) => onChange('referencePhone2', masks.phone(value))}
        onBlur={() => onBlur('referencePhone2')}
        placeholder="(00) 00000-0000"
        maxLength={15}
      />

      <FormInput
        label="Telefone para Recado 3 (Opcional)"
        value={data.referencePhone3}
        onChange={(value) => onChange('referencePhone3', masks.phone(value))}
        onBlur={() => onBlur('referencePhone3')}
        placeholder="(00) 00000-0000"
        maxLength={15}
      />
    </div>
  );
};
