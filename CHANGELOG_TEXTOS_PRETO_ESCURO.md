# Changelog - Textos em Preto Escuro

## Data: 2025-11-12

## Modificações Realizadas

### Objetivo
Alterar a cor dos textos dos labels, placeholders e botões para preto escuro (text-gray-900) para melhor contraste com o fundo do formulário.

---

## Arquivos Modificados

### 1. `src/components/FormInput.tsx`

#### Alteração A: Label do Input
**Linha ~55**

**Antes**:
```jsx
<label className="block text-sm font-medium text-gray-700">
```

**Depois**:
```jsx
{/* MODIFICADO: Label em preto escuro */}
<label className="block text-sm font-medium text-gray-900">
```

#### Alteração B: Input com Texto e Placeholder
**Linha ~67**

**Antes**:
```jsx
className={`flex-1 px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 ${
```

**Depois**:
```jsx
className={`flex-1 px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500 ${
```

**Classes adicionadas**:
- `text-gray-900` - Texto digitado em preto escuro
- `placeholder-gray-500` - Placeholder em cinza médio

---

### 2. `src/components/FormNumber.tsx`

#### Alteração A: Label do Input Numérico
**Linha ~50**

**Antes**:
```jsx
<label className="block text-sm font-medium text-gray-700">
```

**Depois**:
```jsx
{/* MODIFICADO: Label em preto escuro */}
<label className="block text-sm font-medium text-gray-900">
```

#### Alteração B: Input Numérico com Texto
**Linha ~62**

**Antes**:
```jsx
className={`flex-1 px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 ${
```

**Depois**:
```jsx
className={`flex-1 px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500 ${
```

**Classes adicionadas**:
- `text-gray-900` - Texto digitado em preto escuro
- `placeholder-gray-500` - Placeholder em cinza médio

---

### 3. `src/components/FormRadio.tsx`

#### Alteração A: Label da Pergunta
**Linha ~20**

**Antes**:
```jsx
<label className="block text-sm font-medium text-gray-700">
```

**Depois**:
```jsx
{/* MODIFICADO: Label em preto escuro */}
<label className="block text-sm font-medium text-gray-900">
```

#### Alteração B: Labels das Opções (Sim/Não)
**Linhas ~33 e ~45**

**Antes**:
```jsx
<label htmlFor={`${label}-yes`} className="cursor-pointer text-sm text-gray-700">
  Sim
</label>
...
<label htmlFor={`${label}-no`} className="cursor-pointer text-sm text-gray-700">
  Não
</label>
```

**Depois**:
```jsx
{/* MODIFICADO: Labels Sim/Não em preto escuro */}
<label htmlFor={`${label}-yes`} className="cursor-pointer text-sm text-gray-900">
  Sim
</label>
...
<label htmlFor={`${label}-no`} className="cursor-pointer text-sm text-gray-900">
  Não
</label>
```

---

### 4. `src/components/MultiStepForm.tsx`

#### Alteração: Botão "Anterior"
**Linha ~345**

**Antes**:
```jsx
className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
  step === 0
    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
}`}
```

**Depois**:
```jsx
{/* MODIFICADO: Botão Anterior com texto preto escuro */}
className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
  step === 0
    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
    : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
}`}
```

**Mudança**:
- `text-gray-700` → `text-gray-900` (quando o botão está ativo)

---

### 5. `src/components/ShareButtons.tsx`

#### Alteração: Texto "Compartilhar formulário"
**Linhas ~39-40**

**Antes**:
```jsx
<Share2 className="w-4 h-4 text-gray-600" />
<span className="text-sm font-medium text-gray-700">Compartilhar formulário:</span>
```

**Depois**:
```jsx
{/* MODIFICADO: Texto "Compartilhar formulário" em preto escuro */}
<Share2 className="w-4 h-4 text-gray-900" />
<span className="text-sm font-medium text-gray-900">Compartilhar formulário:</span>
```

**Mudanças**:
- Ícone: `text-gray-600` → `text-gray-900`
- Texto: `text-gray-700` → `text-gray-900`

---

### 6. `src/components/sections/PersonalDataSection.tsx`

#### Alteração: Título "Dados Pessoais"
**Linha ~28**

**Antes**:
```jsx
<h2 className="text-2xl font-bold text-gray-900">Dados Pessoais</h2>
```

**Depois**:
```jsx
{/* MODIFICADO: Texto preto escuro para contraste */}
<h2 className="text-2xl font-bold text-gray-900">Dados Pessoais</h2>
```

**Nota**: O título já estava em `text-gray-900`, mas foi adicionado comentário para documentar.

---

## Resumo das Mudanças de Cores

### Cores Alteradas

| Elemento | Antes | Depois |
|----------|-------|--------|
| Labels de inputs | `text-gray-700` | `text-gray-900` |
| Texto digitado em inputs | (padrão) | `text-gray-900` |
| Placeholders | (padrão) | `placeholder-gray-500` |
| Labels de radio (Sim/Não) | `text-gray-700` | `text-gray-900` |
| Botão "Anterior" (ativo) | `text-gray-700` | `text-gray-900` |
| "Compartilhar formulário:" | `text-gray-700` | `text-gray-900` |
| Ícone Share2 | `text-gray-600` | `text-gray-900` |

### Escala de Cinzas Tailwind

Para referência:
- `text-gray-500` - Cinza médio (placeholders)
- `text-gray-700` - Cinza escuro (valor anterior)
- `text-gray-900` - Preto escuro (valor atual)

---

## Elementos Afetados

### ✅ Elementos Modificados:
1. **"Dados Pessoais"** - Título da seção
2. **"Nome Completo"** - Label do campo
3. **"Digite seu nome completo"** - Placeholder
4. **"CPF"** - Label do campo
5. **"000.000.000-00"** - Placeholder
6. **"Número do NIS (PIS)"** - Label do campo
7. **"00000000000"** - Placeholder
8. **"Título Eleitoral"** - Label do campo
9. **"000000000000"** - Placeholder
10. **"Senha"** - Label do campo
11. **"Digite sua senha"** - Placeholder
12. **"Confirme a Senha"** - Label do campo
13. **"Confirme sua senha"** - Placeholder
14. **"Anterior"** - Texto do botão
15. **"Compartilhar formulário:"** - Texto + ícone

### ✅ Elementos Também Afetados (outras seções):
- Todos os labels de "Contatos"
- Todos os labels de "Composição Familiar"
- Todos os labels de "Perfil Socioeconômico"
- Opções "Sim" e "Não" dos radios

---

## Elementos NÃO Modificados

### ✅ Mantidos Intactos:
- Botão "Próximo" (continua azul: `bg-blue-600 text-white`)
- Botões de compartilhamento (WhatsApp, Facebook, etc.)
- Campos de entrada (fundo branco mantido)
- Mensagens de erro (vermelho mantido)
- Barra de progresso (azul mantido)
- Título principal "Pré-Inscrição Habitat Social" (branco)
- Indicador "Etapa X de Y" (branco/cinza claro)

---

## Compatibilidade

- ✅ Build testado e funcionando
- ✅ Classes Tailwind válidas
- ✅ Contraste adequado (WCAG AAA)
- ✅ Responsivo em todos os dispositivos
- ✅ Sem quebra de funcionalidades

---

## Testes de Contraste

### Combinações Testadas:
1. **text-gray-900 no bg-white**: ✅ Contraste excelente (AAA)
2. **text-gray-900 no bg-black/40**: ✅ Legível
3. **placeholder-gray-500 no bg-white**: ✅ Contraste adequado (AA)

---

## Reversão (se necessário)

Para reverter as alterações:

### FormInput.tsx
```jsx
// Reverter linha 55
<label className="block text-sm font-medium text-gray-700">

// Reverter linha 67
className={`flex-1 px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 ${
```

### FormNumber.tsx
```jsx
// Reverter linha 50
<label className="block text-sm font-medium text-gray-700">

// Reverter linha 62
className={`flex-1 px-3 py-2 border rounded-lg transition-colors focus:outline-none focus:ring-2 ${
```

### FormRadio.tsx
```jsx
// Reverter linha 20
<label className="block text-sm font-medium text-gray-700">

// Reverter linhas 33 e 45
<label htmlFor={...} className="cursor-pointer text-sm text-gray-700">
```

### MultiStepForm.tsx
```jsx
// Reverter linha 345
: 'bg-gray-200 text-gray-700 hover:bg-gray-300'
```

### ShareButtons.tsx
```jsx
// Reverter linhas 39-40
<Share2 className="w-4 h-4 text-gray-600" />
<span className="text-sm font-medium text-gray-700">Compartilhar formulário:</span>
```

---

## Observações Finais

### Vantagens da Mudança:
1. ✅ Melhor contraste visual
2. ✅ Textos mais legíveis
3. ✅ Hierarquia visual mais clara
4. ✅ Aparência mais profissional
5. ✅ Melhor acessibilidade

### Consistência Visual:
- Todos os labels agora usam `text-gray-900`
- Todos os inputs digitados usam `text-gray-900`
- Todos os placeholders usam `placeholder-gray-500`
- Botão "Anterior" ativo usa `text-gray-900`

### Padrão Estabelecido:
- **Labels**: `text-gray-900` (preto escuro)
- **Inputs**: `text-gray-900` (preto escuro)
- **Placeholders**: `placeholder-gray-500` (cinza médio)
- **Títulos de seções**: `text-gray-900` (preto escuro)
- **Textos informativos**: `text-gray-900` (preto escuro)
