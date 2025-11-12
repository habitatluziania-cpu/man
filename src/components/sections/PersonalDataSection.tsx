import React from 'react';
import { FormInput } from '../FormInput';
import { masks } from '../../utils/masks';
import { validation, getValidationError } from '../../utils/validation';

interface PersonalDataSectionProps {
  data: {
    fullName: string;
    cpf: string;
    nisPis: string;
    voterRegistration: string;
    password: string;
    confirmPassword: string;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
  onBlur: (field: string) => void;
}

export const PersonalDataSection: React.FC<PersonalDataSectionProps> = ({
  data,
  errors,
  onChange,
  onBlur,
}) => {
  return (
    <div className="space-y-6">
      {/* MODIFICADO: Texto preto escuro para contraste */}
      <h2 className="text-2xl font-bold text-gray-900">Dados Pessoais</h2>

      <FormInput
        label="Nome Completo"
        value={data.fullName}
        onChange={(value) => onChange('fullName', value)}
        onBlur={() => onBlur('fullName')}
        placeholder="Digite seu nome completo"
        required
        error={errors.fullName}
      />

      <FormInput
        label="CPF"
        value={data.cpf}
        onChange={(value) => onChange('cpf', masks.cpf(value))}
        onBlur={() => onBlur('cpf')}
        placeholder="000.000.000-00"
        required
        error={errors.cpf}
        maxLength={14}
      />

      <FormInput
        label="Número do NIS (PIS)"
        value={data.nisPis}
        onChange={(value) => onChange('nisPis', masks.nisPis(value))}
        onBlur={() => onBlur('nisPis')}
        placeholder="00000000000"
        required
        error={errors.nisPis}
        maxLength={11}
      />

      <FormInput
        label="Título Eleitoral"
        value={data.voterRegistration}
        onChange={(value) => onChange('voterRegistration', masks.voterRegistration(value))}
        onBlur={() => onBlur('voterRegistration')}
        placeholder="000000000000"
        error={errors.voterRegistration}
        maxLength={12}
      />

      <FormInput
        label="Senha"
        type="password"
        value={data.password}
        onChange={(value) => onChange('password', value)}
        onBlur={() => onBlur('password')}
        placeholder="Digite sua senha"
        required
        error={errors.password}
      />

      <FormInput
        label="Confirme a Senha"
        type="password"
        value={data.confirmPassword}
        onChange={(value) => onChange('confirmPassword', value)}
        onBlur={() => onBlur('confirmPassword')}
        placeholder="Confirme sua senha"
        required
        error={errors.confirmPassword}
      />
    </div>
  );
};
