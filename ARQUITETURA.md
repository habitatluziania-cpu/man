# Arquitetura do Projeto - Sistema Habitat Social

## Visão Geral

Este documento descreve a organização e estrutura do sistema de cadastro social Habitat, detalhando a separação de responsabilidades e boas práticas implementadas.

## Estrutura de Diretórios

```
src/
├── components/          # Componentes React reutilizáveis
│   ├── sections/       # Seções específicas do formulário
│   ├── ThemeToggle.tsx # Botão de alternância de tema
│   ├── StatsCard.tsx   # Card de estatísticas do dashboard
│   └── ...
├── pages/              # Páginas principais da aplicação
│   ├── AdminDashboard.tsx
│   ├── AdminLogin.tsx
│   └── UserLogin.tsx
├── services/           # Camada de serviços (lógica de negócio)
│   ├── authService.ts        # Autenticação de administradores
│   ├── registrationService.ts # CRUD de registros sociais
│   └── statsService.ts       # Cálculo de estatísticas
├── utils/              # Funções utilitárias
│   ├── masks.ts        # Máscaras de formatação
│   ├── validation.ts   # Validações de campos
│   └── share.ts        # Compartilhamento social
├── hooks/              # React Hooks customizados
│   └── useTheme.ts     # Gerenciamento de tema
├── types/              # TypeScript types e interfaces
│   └── index.ts        # Todas as definições de tipos
├── constants/          # Constantes e configurações
│   └── index.ts        # Valores constantes do sistema
└── lib/                # Bibliotecas e configurações externas
    └── supabase.ts     # Cliente Supabase
```

## Camadas da Aplicação

### 1. Camada de Apresentação (Components/Pages)
- **Responsabilidade**: Interface visual e interação com o usuário
- **Características**:
  - Componentes React puros ou com estado local
  - Validações de UI
  - Formatação de dados para exibição
  - Gerenciamento de estado de formulários

### 2. Camada de Serviços (Services)
- **Responsabilidade**: Lógica de negócio e comunicação com APIs
- **Características**:
  - Operações CRUD
  - Transformação de dados
  - Regras de negócio complexas
  - Comunicação com Supabase

**Serviços Principais**:
- `authService.ts`: Login, logout e verificação de sessão
- `registrationService.ts`: Gerenciamento de cadastros sociais
- `statsService.ts`: Cálculos e exportação de dados estatísticos

### 3. Camada de Utilitários (Utils)
- **Responsabilidade**: Funções auxiliares reutilizáveis
- **Características**:
  - Funções puras (sem efeitos colaterais)
  - Transformações de dados
  - Validações
  - Máscaras de formatação

### 4. Camada de Tipos (Types)
- **Responsabilidade**: Definições de TypeScript
- **Características**:
  - Interfaces de dados
  - Types auxiliares
  - Enums e uniões de tipos
  - Garantia de type-safety

### 5. Camada de Constantes (Constants)
- **Responsabilidade**: Valores fixos e configurações
- **Características**:
  - Valores imutáveis
  - Configurações globais
  - Mensagens padronizadas
  - Rotas e chaves de armazenamento

## Fluxo de Dados

```
┌─────────────────┐
│   Components    │  ← Recebe eventos do usuário
└────────┬────────┘
         │
         ↓ chama
┌─────────────────┐
│    Services     │  ← Processa lógica de negócio
└────────┬────────┘
         │
         ↓ usa
┌─────────────────┐
│   Supabase DB   │  ← Persiste/busca dados
└─────────────────┘
```

## Boas Práticas Implementadas

### 1. Separação de Responsabilidades
- Cada arquivo tem um propósito específico
- Componentes não fazem chamadas diretas ao banco
- Serviços encapsulam toda a lógica de API

### 2. Reutilização de Código
- Hooks customizados para lógica compartilhada
- Componentes modulares e composíveis
- Funções utilitárias genéricas

### 3. Type Safety
- TypeScript em todo o projeto
- Interfaces centralizadas
- Validação em tempo de compilação

### 4. Documentação
- Comentários JSDoc em todas as funções
- Explicações inline para lógica complexa
- README e documentação de arquitetura

### 5. Consistência
- Nomenclatura padronizada
- Estrutura de arquivos organizada
- Padrões de código uniformes

## Principais Tecnologias

- **React 18**: Biblioteca de interface
- **TypeScript**: Type safety e autocompletar
- **Supabase**: Backend as a Service (banco de dados e autenticação)
- **Tailwind CSS**: Estilização utilitária
- **Vite**: Bundler e dev server
- **Lucide React**: Biblioteca de ícones

## Como Adicionar Novas Funcionalidades

### 1. Novo Componente
```typescript
// src/components/MeuComponente.tsx
/**
 * Descrição do componente
 */
export const MeuComponente: React.FC<Props> = ({ ...props }) => {
  // implementação
};
```

### 2. Novo Serviço
```typescript
// src/services/meuService.ts
/**
 * SERVIÇO DE [NOME]
 * Descrição do que o serviço faz
 */

/**
 * Função específica
 * @param param - Descrição
 * @returns Descrição do retorno
 */
export const minhaFuncao = async (param: Type): Promise<Result> => {
  // implementação
};
```

### 3. Nova Validação
```typescript
// src/utils/validation.ts
// Adicionar ao objeto validation:
meuCampo: (value: string): boolean => {
  // lógica de validação
  return true;
},
```

### 4. Novo Tipo
```typescript
// src/types/index.ts
/**
 * Descrição da interface
 */
export interface MeuTipo {
  campo: string;
  // ... outros campos
}
```

## Manutenção e Escalabilidade

### Facilidades Implementadas
1. **Fácil localização**: Estrutura de pastas intuitiva
2. **Modificações isoladas**: Mudanças em serviços não afetam UI
3. **Testabilidade**: Funções puras e serviços isolados
4. **Documentação inline**: Comentários explicativos em todo código

### Próximos Passos Sugeridos
1. Implementar testes unitários (Jest/Vitest)
2. Adicionar testes de integração
3. Implementar CI/CD
4. Adicionar monitoring e logs
5. Criar storybook para componentes

## Suporte

Para dúvidas sobre a arquitetura ou implementação, consulte:
1. Este documento (ARQUITETURA.md)
2. Comentários inline no código
3. Documentação das bibliotecas utilizadas
