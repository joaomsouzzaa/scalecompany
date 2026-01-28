# Guia de Configuração do Webhook da GoExplosion no Supabase

Este guia explica passo a passo como configurar o Supabase para receber notificações de vendas da GoExplosion.

## Passo 1: Criar a Tabela de Vendas (Se não existir)

Vá até o **SQL Editor** no painel do Supabase e execute o seguinte comando para criar a tabela `sales`:

```sql
create table if not exists public.sales (
  id uuid default gen_random_uuid() primary key,
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  "customerName" text,
  "customerEmail" text,
  product text,
  status text,
  amount numeric,
  platform text,
  "utmSource" text,
  campaign text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Opcional: Habilitar RLS (Row Level Security) se necessário
alter table public.sales enable row level security;
```

## Passo 2: Implantar a Função (Edge Function)

Você precisa implantar o código que criamos para o Supabase.

1.  Abra o terminal na pasta do projeto (`c:\Users\scale\Documents\Scale Company\scalecompany`).
2.  Faça login no Supabase CLI (caso não tenha feito):
    ```bash
    npx supabase login
    ```
3.  Implante a função:
    ```bash
    npx supabase functions deploy goexplosion-webhook
    ```
    *Nota: Se for a primeira vez, ele pode pedir para vincular ao projeto. Use `npx supabase link --project-ref <seu-project-id>`.*

4.  Ao final, o terminal mostrará uma URL. Ela se parece com:
    `https://<project-id>.supabase.co/functions/v1/goexplosion-webhook`
    **Copie essa URL.**

## Passo 3: Configurar na GoExplosion

1.  Acesse sua conta na **GoExplosion**.
2.  Vá em **Configurações** ou **Integrações** (o nome pode variar, procure por Webhooks).
3.  Crie um novo **Webhook**.
4.  No campo **URL**, cole a URL que você copiou no Passo 2.
5.  Se houver opção de eventos, selecione **Venda Aprovada** (Order Approved), **Reembolso** (Refund), etc.
6.  Salve a configuração.

## Passo 4: Testar

Para verificar se está funcionando:

1.  **Teste Manual na GoExplosion**: Muitos plataformas têm um botão "Enviar Teste". Use-o.
2.  **Verificar no Supabase**:
    - Vá ao **Table Editor**.
    - Abra a tabela `sales`.
    - Veja se um novo registro apareceu.

## Solução de Problemas

- **Erro de Permissão**: Certifique-se de que a função tem permissão para escrever no banco de dados. Como usamos a chave `service_role` dentro da função (gerenciada automaticamente pelo Supabase Functions), ela deve ter acesso total.
- **Campos Vazios**: Se os dados chegarem mas os campos (nome, produto) estiverem vazios, pode ser que o formato do JSON da GoExplosion seja diferente do que previmos.
    - Para corrigir: Verifique os logs da função no painel do Supabase (**Edge Functions** > **goexplosion-webhook** > **Logs**) para ver o JSON real que chegou (`Webhook received: ...`) e ajuste o arquivo `index.ts`.
