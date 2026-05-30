# Yoopix

App para **dividir contas e cobrar via Pix** sem fricção. Você cria uma conta a
pagar, define como dividir entre as pessoas e o Yoopix gera o **código Pix
(copia e cola)**, o **QR Code** e uma **mensagem pronta para o WhatsApp** — é só
enviar para quem deve.

🔗 **Online:** [yoopix.com.br](https://yoopix.com.br)

## Funcionalidades

- Criar uma cobrança informando a chave Pix do recebedor
- Detecção automática do tipo de chave Pix (CPF, e-mail, telefone, aleatória)
- Divisão **igualitária** ou **personalizada** por participante
- Sugestão automática do valor restante na divisão personalizada
- Geração do **Pix BR Code** (copia e cola) e do **QR Code**
- Compartilhamento da cobrança direto no **WhatsApp**
- **Histórico** de cobranças salvo no dispositivo
- **PWA**: instalável e funciona como um app no celular

## Stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS** para o estilo
- **React Router** para navegação
- **React Hook Form** + **Zod** para formulários e validação
- **pix-utils** (geração do BR Code) e **qrcode** (QR)
- **vite-plugin-pwa** para o app instalável
- Deploy na **Netlify**

## Como rodar

```bash
npm install
npm run dev      # ambiente de desenvolvimento
```

Outros scripts:

```bash
npm run build    # build de produção
npm run preview  # pré-visualiza o build
npm run lint     # análise estática (ESLint)
```

## Estrutura

```
src/
├── pages/        # Home, NewBill, SplitMode, Result, History
├── components/   # TopBar, PixQR, ícones e primitivos de UI
├── hooks/        # useBills, useDraft, usePrefs
├── lib/          # pix, split, format, storage, validators
└── types/        # tipos compartilhados
```

## Como funciona a divisão

A lógica de divisão (`src/lib/split.ts`) distribui o valor total entre os
participantes — em partes iguais ou com valores personalizados — e o módulo de
Pix (`src/lib/pix.ts`) monta o payload do BR Code a partir da chave e do valor
de cada pessoa, que é então renderizado como texto (copia e cola) e QR Code.
