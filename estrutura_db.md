# Estrutura de Banco de Dados Multi-Tenant (SaaS) - **Versão Oficial V 1.0 (Homologação)**

Para suportar o novo escopo do OperaBeauty, onde cada salão tem seu próprio link e dados totalmente isolados, utilizaremos o próprio banco de dados para resolver o problema de autenticação. 

Em vez de depender do `auth.users` global do Supabase (que restringe telefones duplicados no mundo), criamos nossas próprias tabelas `cap_staff` e `cap_clients` usando a extensão `pgcrypto` para validar senhas de forma segura via RPC.

Abaixo está o script **SQL COMPLETO E DEFINITIVO (DDL)** para a criação da base de dados do novo ambiente de Homologação/Produção.
Este arquivo deve ser rodado de forma sequencial no novo banco.

```sql
-- ==========================================
-- 0. CLEANUP (CUIDADO: APAGA TUDO!)
-- Rode isso primeiro para limpar a base antiga (Single-Tenant)
-- ==========================================
DROP TABLE IF EXISTS public.cap_timeline_notes CASCADE;
DROP TABLE IF EXISTS public.cap_appointment_services CASCADE;
DROP TABLE IF EXISTS public.cap_appointments CASCADE;
DROP TABLE IF EXISTS public.cap_service_inventory CASCADE;
DROP TABLE IF EXISTS public.cap_inventory CASCADE;
DROP TABLE IF EXISTS public.cap_services CASCADE;
DROP TABLE IF EXISTS public.cap_clients CASCADE;
DROP TABLE IF EXISTS public.cap_staff CASCADE;
DROP TABLE IF EXISTS public.cap_profiles CASCADE;
DROP TABLE IF EXISTS public.cap_business_hours CASCADE;
DROP TABLE IF EXISTS public.cap_date_exceptions CASCADE;
DROP TABLE IF EXISTS public.cap_blocked_dates CASCADE;
DROP TABLE IF EXISTS public.cap_vouchers CASCADE;
DROP TABLE IF EXISTS public.cap_settings CASCADE;
DROP TABLE IF EXISTS public.cap_tenants CASCADE;

-- ==========================================
-- 1. EXTENSÕES NECESSÁRIAS
-- ==========================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 2. CRIAÇÃO DAS NOVAS TABELAS (MULTI-TENANT)
-- ==========================================

-- 2.1 Tabela de Planos de Assinatura (SaaS)
CREATE TABLE public.cap_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    interval TEXT DEFAULT 'month',
    max_professionals INT, -- NULL ou 0 significa ilimitado
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.2 Tabela de Configurações Globais da Plataforma (Ex: Gateway de Pagamento)
CREATE TABLE public.cap_platform_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_gateway TEXT DEFAULT 'mercadopago', -- abacatepay, mercadopago, stripe
    gateway_api_key TEXT,
    gateway_public_key TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.3 Tabela Master de Salões (Tenants)
CREATE TABLE public.cap_tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL, -- Ex: 'studiomaria'
    name TEXT NOT NULL,
    status TEXT DEFAULT 'active', -- active, suspended
    plan_price NUMERIC DEFAULT 59.99,
    
    -- Customização Visual (Branding)
    logo_url TEXT,
    primary_color TEXT DEFAULT '#7c5357',
    secondary_color TEXT DEFAULT '#eeb9bd',
    tertiary_color TEXT DEFAULT '#f9f9f9',
    banner_url TEXT,
    banner_title TEXT,
    banner_subtitle TEXT,
    welcome_message TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de Profissionais e Gestores (Isolados por Salão)
CREATE TABLE public.cap_staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.cap_tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('professional', 'manager')),
    commission_rate NUMERIC DEFAULT 0.00, -- Opcional, para cálculo automático
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, phone) -- Permite o mesmo telefone no salão A e B, mas senhas/usuarios separados
);

-- 3. Tabela de Clientes (Isolados por Salão)
CREATE TABLE public.cap_clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.cap_tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    birth_date DATE,
    password_hash TEXT NOT NULL,
    anamnese_data JSONB DEFAULT '{}'::jsonb, -- 100% Dinâmico e Aberto para o Gestor customizar
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, phone)
);

-- 4. Serviços
CREATE TABLE public.cap_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.cap_tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    duration_minutes INT NOT NULL,
    price NUMERIC NOT NULL,
    reduces_stock BOOLEAN DEFAULT FALSE, -- Flag se exige baixa de estoque
    maintenance_days INT DEFAULT 0, -- Dias para retorno (0 se não houver)
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.1. Horários de Funcionamento Padrão
CREATE TABLE public.cap_business_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.cap_tenants(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL,
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    is_closed BOOLEAN DEFAULT FALSE,
    UNIQUE(tenant_id, day_of_week)
);

-- 4.2. Exceções de Datas e Bloqueios
CREATE TABLE public.cap_date_exceptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.cap_tenants(id) ON DELETE CASCADE,
    exception_date DATE NOT NULL,
    is_closed BOOLEAN DEFAULT FALSE,
    open_time TIME,
    close_time TIME,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, exception_date)
);

-- 5. Estoque
CREATE TABLE public.cap_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.cap_tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    quantity NUMERIC NOT NULL DEFAULT 0,
    unit TEXT NOT NULL, -- ml, un, gr
    min_quantity NUMERIC NOT NULL DEFAULT 0,
    type TEXT DEFAULT 'professional', -- 'sale' ou 'professional'
    price NUMERIC DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Relação Serviço x Estoque (Quantos itens o serviço gasta)
CREATE TABLE public.cap_service_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.cap_tenants(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES public.cap_services(id) ON DELETE CASCADE,
    inventory_id UUID NOT NULL REFERENCES public.cap_inventory(id) ON DELETE CASCADE,
    quantity_consumed NUMERIC NOT NULL -- Ex: 30 (ml)
);

-- 7. Agendamentos
CREATE TABLE public.cap_appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.cap_tenants(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.cap_clients(id),
    staff_id UUID NOT NULL REFERENCES public.cap_staff(id),
    service_id UUID NOT NULL REFERENCES public.cap_services(id),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled', -- scheduled, in-progress, completed, cancelled
    total_price NUMERIC NOT NULL,
    staff_commission_value NUMERIC DEFAULT 0, -- Calculado automaticamente ao concluir
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Prontuários e Histórico
CREATE TABLE public.cap_timeline_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.cap_tenants(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.cap_clients(id),
    appointment_id UUID REFERENCES public.cap_appointments(id),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

-- ==========================================
-- 9. DESABILITAR RLS (TEMPORÁRIO PARA DESENVOLVIMENTO)
-- O Supabase pode bloquear as consultas no frontend se o RLS for ativado automaticamente.
-- ==========================================
ALTER TABLE public.cap_tenants DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.cap_clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.cap_staff DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.cap_services DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.cap_inventory DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.cap_service_inventory DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.cap_appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.cap_timeline_notes DISABLE ROW LEVEL SECURITY;

### Funções RPC para Autenticação (Banco de Dados)

Para validarmos o login com segurança (sem transitar senhas puras), usaremos funções RPC dentro do próprio Supabase. O Frontend manda a senha crua, o banco criptografa e compara internamente.

```sql
-- Função para Criar Cliente com Senha Segura
CREATE OR REPLACE FUNCTION cap_register_client(p_tenant_id UUID, p_name TEXT, p_phone TEXT, p_password TEXT)
RETURNS UUID AS $$
DECLARE
    new_id UUID;
BEGIN
    INSERT INTO public.cap_clients (tenant_id, name, phone, password_hash)
    VALUES (p_tenant_id, p_name, p_phone, crypt(p_password, gen_salt('bf')))
    RETURNING id INTO new_id;
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para Login de Cliente
CREATE OR REPLACE FUNCTION cap_login_client(p_tenant_slug TEXT, p_phone TEXT, p_password TEXT)
RETURNS jsonb AS $$
DECLARE
    v_tenant_id UUID;
    v_client RECORD;
BEGIN
    -- 1. Achar o tenant pelo slug
    SELECT id INTO v_tenant_id FROM public.cap_tenants WHERE slug = p_tenant_slug AND status = 'active';
    IF NOT FOUND THEN RETURN NULL; END IF;

    -- 2. Achar cliente e validar senha usando pgcrypto
    SELECT id, name, phone INTO v_client
    FROM public.cap_clients 
    WHERE tenant_id = v_tenant_id 
      AND phone = p_phone 
      AND password_hash = crypt(p_password, password_hash);
      
    IF NOT FOUND THEN RETURN NULL; END IF;

    -- 3. Retornar os dados não sensíveis
    RETURN jsonb_build_object('id', v_client.id, 'name', v_client.name, 'tenant_id', v_tenant_id, 'role', 'client');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- O MESMO PADRÃO PODE SER APLICADO PARA O cap_staff (Profissionais/Gestores)
CREATE OR REPLACE FUNCTION cap_login_staff(p_tenant_slug TEXT, p_phone TEXT, p_password TEXT)
RETURNS jsonb AS $$
DECLARE
    v_tenant_id UUID;
    v_staff RECORD;
BEGIN
    -- 1. Achar o tenant pelo slug
    SELECT id INTO v_tenant_id FROM public.cap_tenants WHERE slug = p_tenant_slug AND status = 'active';
    IF NOT FOUND THEN RETURN NULL; END IF;

    -- 2. Achar staff e validar senha usando pgcrypto
    SELECT id, name, phone, role INTO v_staff
    FROM public.cap_staff 
    WHERE tenant_id = v_tenant_id 
      AND phone = p_phone 
      AND password_hash = crypt(p_password, password_hash)
      AND is_active = true;
      
    IF NOT FOUND THEN RETURN NULL; END IF;

    -- 3. Retornar os dados não sensíveis
    RETURN jsonb_build_object('id', v_staff.id, 'name', v_staff.name, 'tenant_id', v_tenant_id, 'role', v_staff.role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para Criar um Membro da Equipe com Senha Segura
CREATE OR REPLACE FUNCTION cap_register_staff(
    p_tenant_id UUID, 
    p_name TEXT, 
    p_phone TEXT, 
    p_password TEXT, 
    p_role TEXT DEFAULT 'professional'
)
RETURNS UUID AS $$
DECLARE
    new_id UUID;
BEGIN
    INSERT INTO public.cap_staff (tenant_id, name, phone, password_hash, role, is_active)
    VALUES (
        p_tenant_id, 
        p_name, 
        p_phone, 
        crypt(p_password, gen_salt('bf')),
        p_role,
        true
    )
    RETURNING id INTO new_id;
    
    RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para Atualizar um Membro da Equipe (incluindo Senha Segura opcional)
CREATE OR REPLACE FUNCTION cap_update_staff(
    p_staff_id UUID, 
    p_tenant_id UUID,
    p_name TEXT, 
    p_phone TEXT, 
    p_password TEXT, 
    p_role TEXT,
    p_is_active BOOLEAN
)
RETURNS void AS $$
BEGIN
    IF p_password IS NOT NULL AND p_password != '' THEN
        UPDATE public.cap_staff 
        SET name = p_name, phone = p_phone, role = p_role, is_active = p_is_active, password_hash = crypt(p_password, gen_salt('bf'))
        WHERE id = p_staff_id AND tenant_id = p_tenant_id;
    ELSE
        UPDATE public.cap_staff 
        SET name = p_name, phone = p_phone, role = p_role, is_active = p_is_active
        WHERE id = p_staff_id AND tenant_id = p_tenant_id;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para Atualizar a Senha de um Cliente pelo Gestor
CREATE OR REPLACE FUNCTION cap_update_client_password(
    p_client_id UUID, 
    p_tenant_id UUID,
    p_password TEXT
)
RETURNS void AS $$
BEGIN
    UPDATE public.cap_clients 
    SET password_hash = crypt(p_password, gen_salt('bf'))
    WHERE id = p_client_id AND tenant_id = p_tenant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Faturas da Plataforma (SaaS)
CREATE TABLE public.cap_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.cap_tenants(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'overdue', 'cancelled'
    due_date DATE NOT NULL,
    paid_at TIMESTAMPTZ,
    payment_method TEXT,
    reference_month TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Planos da Plataforma (SaaS)
CREATE TABLE public.cap_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    interval TEXT DEFAULT 'month',
    max_professionals INTEGER NULL,
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.cap_plans DISABLE ROW LEVEL SECURITY;
```
