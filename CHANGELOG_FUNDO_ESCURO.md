# Changelog - Ajuste de Transparência do Overlay do Fundo

## Data: 2025-11-12

## Modificação Realizada

### Objetivo
Aumentar a opacidade do overlay escuro sobre a imagem de fundo de 20% para 40%.

---

## Arquivo Modificado

### `src/components/MultiStepForm.tsx`

#### Alteração: Overlay da Imagem de Fundo
**Linha ~248**

**Antes**:
```jsx
{/* Overlay escuro opcional para melhorar legibilidade */}
<div className="absolute inset-0 bg-black/20 -z-10"></div>
```

**Depois**:
```jsx
{/* MODIFICADO: Overlay com 40% de opacidade (mais transparente que antes - era 20%) */}
<div className="absolute inset-0 bg-black/40 -z-10"></div>
```

**Mudança de Classe**:
- `bg-black/20` (20% de opacidade) → `bg-black/40` (40% de opacidade)

---

## Detalhes Técnicos

### Opacidade no Tailwind

A notação `/XX` no Tailwind representa a opacidade:
- `bg-black/20` = 20% de preto (80% transparente)
- `bg-black/40` = 40% de preto (60% transparente)

---

## Efeito Visual

### Antes (bg-black/20):
- Overlay muito sutil
- Imagem de fundo muito visível
- Menos contraste com o formulário

### Depois (bg-black/40):
- Overlay moderado
- Imagem de fundo ainda visível mas mais atenuada
- Melhor contraste com o formulário
- Melhor legibilidade dos textos

---

## Estrutura de Camadas

```
┌─────────────────────────────────┐
│  Conteúdo (z-10)               │ ← Topo
├─────────────────────────────────┤
│  Container Relativo (z-0)      │
├─────────────────────────────────┤
│  Overlay Escuro 40% (-z-10)    │ ← MODIFICADO
├─────────────────────────────────┤
│  Imagem de Fundo (background)  │ ← Base
└─────────────────────────────────┘
```

---

## Elementos NÃO Modificados

- ✅ Imagem de fundo (obras.jpg)
- ✅ Posicionamento da imagem
- ✅ Efeito parallax
- ✅ Container do formulário
- ✅ Todos os textos e campos
- ✅ Todas as funcionalidades

---

## Compatibilidade

- ✅ Build testado e funcionando
- ✅ Classe Tailwind válida
- ✅ Sem quebra de funcionalidades

---

## Reversão

Para voltar ao estado anterior:
```jsx
<div className="absolute inset-0 bg-black/20 -z-10"></div>
```

## Modificações Anteriores (Mantidas Abaixo)

### Arquivo Modificado: `src/components/MultiStepForm.tsx`

#### Alteração 1: Fundo do Container Principal
**Linha ~250**
- **Antes**: `className="bg-white rounded-lg shadow-lg p-6 sm:p-8"`
- **Depois**: `className="bg-black/40 backdrop-blur-sm rounded-lg shadow-lg p-6 sm:p-8"`

**Mudanças aplicadas**:
- `bg-white` → `bg-black/40` (fundo preto com 40% de opacidade)
- Adicionado `backdrop-blur-sm` (efeito de desfoque suave no fundo)

#### Alteração 2: Título Principal
**Linha ~254**
- **Antes**: `className="text-3xl font-bold text-gray-900"`
- **Depois**: `className="text-3xl font-bold text-white"`

**Mudanças aplicadas**:
- `text-gray-900` → `text-white` (texto branco para contraste)

#### Alteração 3: Indicador de Etapa
**Linha ~255**
- **Antes**: `className="text-sm font-medium text-gray-500"`
- **Depois**: `className="text-sm font-medium text-gray-200"`

**Mudanças aplicadas**:
- `text-gray-500` → `text-gray-200` (texto mais claro para legibilidade)

#### Alteração 4: Barra de Progresso Inativa
**Linha ~265**
- **Antes**: `'bg-blue-500' : 'bg-gray-200'`
- **Depois**: `'bg-blue-500' : 'bg-gray-400'`

**Mudanças aplicadas**:
- `bg-gray-200` → `bg-gray-400` (cor mais visível no fundo escuro)

## Resultado Visual

### Características do Novo Design:
1. ✅ Fundo preto com 40% de transparência
2. ✅ Efeito de desfoque sutil (backdrop-blur)
3. ✅ Textos em branco/tons claros para contraste
4. ✅ Botões mantidos sem alterações
5. ✅ Campos de entrada mantidos sem alterações
6. ✅ Barra de progresso ajustada para melhor visibilidade

## Elementos NÃO Modificados

Os seguintes elementos foram mantidos intactos:
- ✅ Botões de navegação (Anterior/Próximo)
- ✅ Campos de entrada (inputs)
- ✅ Labels dos formulários
- ✅ Mensagens de erro/sucesso
- ✅ Botões de compartilhamento
- ✅ Lógica e funcionalidades do formulário

## Compatibilidade

- ✅ Build testado e funcionando
- ✅ Classes Tailwind válidas
- ✅ Responsividade mantida
- ✅ Sem quebra de funcionalidades

## Observações Técnicas

### Opacidade do Tailwind
- `bg-black/40` = `background-color: rgb(0 0 0 / 0.4)`
- Equivale a 40% de opacidade sobre fundo preto

### Backdrop Blur
- `backdrop-blur-sm` aplica um desfoque suave aos elementos atrás do container
- Cria um efeito visual moderno e sofisticado

## Reversão (se necessário)

Para reverter as alterações, substitua:
- `bg-black/40 backdrop-blur-sm` → `bg-white`
- `text-white` → `text-gray-900`
- `text-gray-200` → `text-gray-500`
- `bg-gray-400` → `bg-gray-200`
