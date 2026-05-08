# YouPix — Backlog de Features

> Ideias discutidas para implementar após o MVP v1.0.

---

## 1. Contatos salvos ("galera")

**Resumo:** Ao digitar o nome de um participante, o app sugere nomes já usados antes. O usuário pode selecionar da lista em vez de redigitar toda vez.

**Problema que resolve:** Em rolês repetidos (trabalho, família, grupo de amigos fixo) o usuário redigita os mesmos nomes sempre.

**Comportamento esperado:**
- Input de nome no SplitMode ganha autocomplete com nomes salvos
- Ao confirmar um split, os nomes dos participantes são salvos automaticamente em `youpix:contacts`
- Tela de contatos (acessível pelo histórico ou settings) lista todos os nomes salvos
- Usuário pode deletar contatos individualmente

**Modelo de dados sugerido:**
```ts
interface Contact {
  id: string;
  name: string;
  firstSeenAt: number;
  lastSeenAt: number;
}
```

**Storage key:** `youpix:contacts`

---

## 2. Histórico financeiro por pessoa

**Resumo:** Cada contato salvo acumula um histórico de quanto pagou e quanto deve ao longo de todos os rolês.

**Problema que resolve:** Dificuldade de rastrear quem sempre atrasa o pagamento, ou quanto cada pessoa já gastou no grupo.

**Comportamento esperado:**
- Tela de detalhe do contato mostra:
  - Total pago (participações com `paid: true`)
  - Total pendente (participações com `paid: false`)
  - Lista dos rolês que participou com valor e status
- Cálculo 100% client-side varrendo `storage.getBills()`

**Métricas por contato:**
```
João Silva
├── 8 rolês participados
├── R$ 340,00 pagos
└── R$ 45,00 pendentes
```

---

## 3. Dashboard de gastos pessoais

**Resumo:** Visão geral do próprio usuário ("Você") — quanto gastou por mês, em que tipo de rolê, e qual a tendência.

**Problema que resolve:** Falta de consciência do quanto sai do bolso em rolês ao longo do tempo.

**Comportamento esperado:**
- Seção adicional na tela de Histórico
- Total gasto no mês atual vs mês anterior
- Breakdown por descrição (bar, restaurante, viagem...)
- Gráfico simples de barras (CSS puro, sem lib externa)

---

## Notas de implementação

- Tudo client-side, sem backend
- Dados derivados on-the-fly de `getBills()` — sem duplicação de estado
- Não quebra privacidade: nenhum dado sai do dispositivo
- Ordem de prioridade sugerida: **1 → 2 → 3**
