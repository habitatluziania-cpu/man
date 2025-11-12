import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, AlertCircle } from 'lucide-react';
import { PersonalDataSection } from './sections/PersonalDataSection';
import { ContactSection } from './sections/ContactSection';
import { FamilyAddressSection } from './sections/FamilyAddressSection';
import { SocioeconomicSection } from './sections/SocioeconomicSection';
import { ShareButtons } from './ShareButtons';
import { supabase } from '../lib/supabase';
import { validation, getValidationError } from '../utils/validation';
import { unmask } from '../utils/masks';

interface FormData {
  fullName: string;
  cpf: string;
  nisPis: string;
  voterRegistration: string;
  password: string;
  confirmPassword: string;
  personalPhone: string;
  referencePhone1: string;
  referencePhone2: string;
  referencePhone3: string;
  adultsCount: number;
  minorsCount: number;
  hasDisability: boolean | null;
  disabilityCount: number;
  address: string;
  neighborhood: string;
  cep: string;
  femaleHeadOfHousehold: boolean | null;
  hasElderly: boolean | null;
  vulnerableSituation: boolean | null;
  homeless: boolean | null;
  domesticViolenceVictim: boolean | null;
  cohabitation: boolean | null;
}

const initialFormData: FormData = {
  fullName: '',
  cpf: '',
  nisPis: '',
  voterRegistration: '',
  password: '',
  confirmPassword: '',
  personalPhone: '',
  referencePhone1: '',
  referencePhone2: '',
  referencePhone3: '',
  adultsCount: 1,
  minorsCount: 0,
  hasDisability: null,
  disabilityCount: 0,
  address: '',
  neighborhood: '',
  cep: '',
  femaleHeadOfHousehold: null,
  hasElderly: null,
  vulnerableSituation: null,
  homeless: null,
  domesticViolenceVictim: null,
  cohabitation: null,
};

export const MultiStepForm: React.FC = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [submitMessage, setSubmitMessage] = useState('');

  const steps = [
    {
      title: 'Dados Pessoais',
      component: PersonalDataSection,
      fields: ['fullName', 'cpf', 'nisPis', 'password', 'confirmPassword'],
    },
    {
      title: 'Contatos',
      component: ContactSection,
      fields: ['personalPhone', 'referencePhone1'],
    },
    {
      title: 'Composição Familiar e Domicílio',
      component: FamilyAddressSection,
      fields: ['adultsCount', 'minorsCount', 'hasDisability', 'address', 'neighborhood', 'cep'],
    },
    {
      title: 'Perfil Socioeconômico',
      component: SocioeconomicSection,
      fields: [
        'femaleHeadOfHousehold',
        'hasElderly',
        'vulnerableSituation',
        'homeless',
        'domesticViolenceVictim',
        'cohabitation',
      ],
    },
  ];

  const handleFieldChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFieldBlur = (field: string) => {
    const value = formData[field as keyof FormData];
    const error = getValidationError(field, String(value));
    if (error) {
      setErrors((prev) => ({
        ...prev,
        [field]: error,
      }));
    }
  };

  const validateStep = (): boolean => {
    const stepFields = steps[step].fields;
    const newErrors: Record<string, string> = {};

    stepFields.forEach((field) => {
      const value = formData[field as keyof FormData];

      if (field === 'disabilityCount' && formData.hasDisability !== true) {
        return;
      }

      if (field === 'referencePhone2' || field === 'referencePhone3') {
        if (value && !validation.phone(String(value))) {
          newErrors[field] = 'Telefone inválido';
        }
        return;
      }

      if (field === 'voterRegistration') {
        if (value && String(value).length > 0 && String(value).replace(/\D/g, '').length < 12) {
          newErrors[field] = 'Título eleitoral inválido';
        }
        return;
      }

      if (field === 'password') {
        if (!value || String(value).length < 6) {
          newErrors[field] = 'A senha deve ter pelo menos 6 caracteres';
        }
        return;
      }

      if (field === 'confirmPassword') {
        if (value !== formData.password) {
          newErrors[field] = 'As senhas não coincidem';
        }
        return;
      }

      const error = getValidationError(field, String(value));
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('social_registrations').insert({
        full_name: formData.fullName,
        cpf: unmask(formData.cpf),
        nis_pis: unmask(formData.nisPis),
        voter_registration: unmask(formData.voterRegistration),
        password: formData.password,
        personal_phone: unmask(formData.personalPhone),
        reference_phone_1: unmask(formData.referencePhone1),
        reference_phone_2: formData.referencePhone2 ? unmask(formData.referencePhone2) : null,
        reference_phone_3: formData.referencePhone3 ? unmask(formData.referencePhone3) : null,
        adults_count: formData.adultsCount,
        minors_count: formData.minorsCount,
        has_disability: formData.hasDisability ?? false,
        disability_count: formData.hasDisability ? formData.disabilityCount : null,
        address: formData.address,
        neighborhood: formData.neighborhood,
        cep: unmask(formData.cep),
        female_head_of_household: formData.femaleHeadOfHousehold ?? false,
        has_elderly: formData.hasElderly ?? false,
        vulnerable_situation: formData.vulnerableSituation ?? false,
        homeless: formData.homeless ?? false,
        domestic_violence_victim: formData.domesticViolenceVictim ?? false,
        cohabitation: formData.cohabitation ?? false,
      });

      if (error) {
        setSubmitStatus('error');
        setSubmitMessage(error.message || 'Erro ao enviar o formulário');
      } else {
        setSubmitStatus('success');
        setSubmitMessage('Pré-inscrição realizada com sucesso!');
        setFormData(initialFormData);
        setStep(0);
        setTimeout(() => {
          setSubmitStatus(null);
        }, 5000);
      }
    } catch (err) {
      setSubmitStatus('error');
      setSubmitMessage('Erro ao enviar o formulário. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentSection = steps[step].component;

  return (
    // MODIFICADO: Adicionada imagem de fundo obras.jpg centralizada e cobrindo toda a área
    <div
      className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: "url('/obras.jpg')",
        backgroundAttachment: 'fixed'
      }}
    >
      {/* MODIFICADO: Overlay com 40% de opacidade (mais transparente que antes - era 20%) */}
      <div className="absolute inset-0 bg-black/40 -z-10"></div>

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="flex justify-center mb-6 px-4">
          <img
            src="/Habitat-.png"
            alt="Logo Habitat"
            className="h-32 sm:h-44 md:h-52 lg:h-58 w-auto max-w-full object-contain"
          />
        </div>

        {/* MODIFICADO: Fundo mais escuro com 40% de opacidade (bg-black/40) */}
        <div className="bg-black/40 backdrop-blur-sm rounded-lg shadow-lg p-6 sm:p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {/* MODIFICADO: Texto branco para contraste com fundo escuro */}
              <h1 className="text-3xl font-bold text-white">Pré-Inscrição Habitat Social</h1>
              <span className="text-sm font-medium text-gray-200">
                Etapa {step + 1} de {steps.length}
              </span>
            </div>

            <div className="flex gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    index <= step ? 'bg-blue-500' : 'bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>

          {submitStatus && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-gap-3 ${
                submitStatus === 'success'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              {submitStatus === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 mr-3 flex-shrink-0" />
              )}
              <p
                className={
                  submitStatus === 'success' ? 'text-green-700 text-sm' : 'text-red-700 text-sm'
                }
              >
                {submitMessage}
              </p>
            </div>
          )}

          <div className="mb-8">
            <CurrentSection
              data={{
                fullName: formData.fullName,
                cpf: formData.cpf,
                nisPis: formData.nisPis,
                voterRegistration: formData.voterRegistration,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                personalPhone: formData.personalPhone,
                referencePhone1: formData.referencePhone1,
                referencePhone2: formData.referencePhone2,
                referencePhone3: formData.referencePhone3,
                adultsCount: formData.adultsCount,
                minorsCount: formData.minorsCount,
                hasDisability: formData.hasDisability,
                disabilityCount: formData.disabilityCount,
                address: formData.address,
                neighborhood: formData.neighborhood,
                cep: formData.cep,
                femaleHeadOfHousehold: formData.femaleHeadOfHousehold,
                hasElderly: formData.hasElderly,
                vulnerableSituation: formData.vulnerableSituation,
                homeless: formData.homeless,
                domesticViolenceVictim: formData.domesticViolenceVictim,
                cohabitation: formData.cohabitation,
              }}
              errors={errors}
              onChange={handleFieldChange}
              onBlur={handleFieldBlur}
            />
          </div>

          <div className="flex gap-3 justify-between">
            {/* MODIFICADO: Botão Anterior com texto preto escuro */}
            <button
              onClick={handlePrevious}
              disabled={step === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                step === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>

            <button
              onClick={step === steps.length - 1 ? handleSubmit : handleNext}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {step === steps.length - 1 ? (
                <>
                  {isSubmitting ? 'Enviando...' : 'Enviar'}
                </>
              ) : (
                <>
                  Próximo
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <ShareButtons />
        </div>
      </div>
    </div>
  );
};
