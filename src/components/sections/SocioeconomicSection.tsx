import React from 'react';
import { FormRadio } from '../FormRadio';

interface SocioeconomicSectionProps {
  data: {
    femaleHeadOfHousehold: boolean | null;
    hasElderly: boolean | null;
    vulnerableSituation: boolean | null;
    homeless: boolean | null;
    domesticViolenceVictim: boolean | null;
    cohabitation: boolean | null;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: boolean) => void;
}

export const SocioeconomicSection: React.FC<SocioeconomicSectionProps> = ({
  data,
  errors,
  onChange,
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Perfil Socioeconômico</h2>

      <FormRadio
        label="Mulher responsável pela família?"
        value={data.femaleHeadOfHousehold}
        onChange={(value) => onChange('femaleHeadOfHousehold', value)}
        required
        error={errors.femaleHeadOfHousehold}
      />

      <FormRadio
        label="Tem idosos (+60) na composição familiar?"
        value={data.hasElderly}
        onChange={(value) => onChange('hasElderly', value)}
        required
        error={errors.hasElderly}
      />

      <FormRadio
        label="Encontra-se em situação de vulnerabilidade?"
        value={data.vulnerableSituation}
        onChange={(value) => onChange('vulnerableSituation', value)}
        required
        error={errors.vulnerableSituation}
      />

      <FormRadio
        label="É morador de rua?"
        value={data.homeless}
        onChange={(value) => onChange('homeless', value)}
        required
        error={errors.homeless}
      />

      <FormRadio
        label="É mulher vítima de violência doméstica?"
        value={data.domesticViolenceVictim}
        onChange={(value) => onChange('domesticViolenceVictim', value)}
        required
        error={errors.domesticViolenceVictim}
      />

      <FormRadio
        label="(Coabitação) Mora mais de uma família na mesma residência?"
        value={data.cohabitation}
        onChange={(value) => onChange('cohabitation', value)}
        required
        error={errors.cohabitation}
      />
    </div>
  );
};
