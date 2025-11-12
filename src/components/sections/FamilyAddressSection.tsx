import React from 'react';
import { FormInput } from '../FormInput';
import { FormNumber } from '../FormNumber';
import { FormRadio } from '../FormRadio';
import { masks } from '../../utils/masks';

interface FamilyAddressSectionProps {
  data: {
    adultsCount: number;
    minorsCount: number;
    hasDisability: boolean | null;
    disabilityCount: number;
    address: string;
    neighborhood: string;
    cep: string;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: string | number | boolean) => void;
  onBlur: (field: string) => void;
}

export const FamilyAddressSection: React.FC<FamilyAddressSectionProps> = ({
  data,
  errors,
  onChange,
  onBlur,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Composição Familiar e Domicílio</h2>

      <FormNumber
        label="Quantidade de Pessoas Adultas na Casa"
        value={data.adultsCount}
        onChange={(value) => onChange('adultsCount', value)}
        placeholder="1"
        required
        min={1}
        error={errors.adultsCount}
      />

      <FormNumber
        label="Quantidade de Pessoas de Menor na Casa"
        value={data.minorsCount}
        onChange={(value) => onChange('minorsCount', value)}
        placeholder="0"
        required
        min={0}
        error={errors.minorsCount}
      />

      <FormRadio
        label="Tem alguma pessoa na casa que possua deficiência?"
        value={data.hasDisability}
        onChange={(value) => onChange('hasDisability', value)}
        required
        error={errors.hasDisability}
      />

      {data.hasDisability === true && (
        <FormNumber
          label="Quantas pessoas com deficiência?"
          value={data.disabilityCount}
          onChange={(value) => onChange('disabilityCount', value)}
          placeholder="0"
          required
          min={1}
          error={errors.disabilityCount}
        />
      )}

      <FormInput
        label="Endereço Completo"
        value={data.address}
        onChange={(value) => onChange('address', value)}
        onBlur={() => onBlur('address')}
        placeholder="Rua, número, complemento"
        required
        error={errors.address}
      />

      <FormInput
        label="Bairro"
        value={data.neighborhood}
        onChange={(value) => onChange('neighborhood', value)}
        onBlur={() => onBlur('neighborhood')}
        placeholder="Digite o bairro"
        required
        error={errors.neighborhood}
      />

      <FormInput
        label="CEP"
        value={data.cep}
        onChange={(value) => onChange('cep', masks.cep(value))}
        onBlur={() => onBlur('cep')}
        placeholder="00000-000"
        required
        error={errors.cep}
        maxLength={9}
      />
    </div>
  );
};
