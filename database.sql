-- SQL Script para Configuração do Banco de Dados OperaBeauty (Supabase)
-- Arquitetura SaaS Multi Tenant e White Label

CREATE TABLE IF NOT EXISTS public.cap_tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    primary_color TEXT DEFAULT '#be185d',
    secondary_color TEXT DEFAULT '#fbcfe8',
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cap_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES public.cap_tenants(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'professional',
    is_active BOOLEAN DEFAULT false,
    access_email TEXT,
    access_password TEXT,
    is_superadmin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cap_clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.cap_tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    birth_date DATE,
    password_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, phone)
);

CREATE TABLE IF NOT EXISTS public.cap_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.cap_tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    maintenance_days INTEGER DEFAULT 30,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cap_appointment_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.cap_tenants(id) ON DELETE CASCADE,
    appointment_id UUID,
    service_id UUID REFERENCES public.cap_services(id),
    price_at_time NUMERIC(10, 2),
    duration_at_time INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cap_appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.cap_tenants(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.cap_clients(id) ON DELETE CASCADE,
    service_id UUID, -- Legacy? (Mantido conforme a base enviada)
    professional_id UUID REFERENCES public.cap_profiles(id),
    voucher_id UUID,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'scheduled',
    total_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cap_date_exceptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.cap_tenants(id) ON DELETE CASCADE,
    exception_date DATE NOT NULL,
    is_closed BOOLEAN DEFAULT FALSE,
    open_time TIME,
    close_time TIME,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, exception_date)
);

CREATE TABLE IF NOT EXISTS public.cap_business_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.cap_tenants(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL,
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    is_closed BOOLEAN DEFAULT FALSE,
    UNIQUE(tenant_id, day_of_week)
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

CREATE TABLE IF NOT EXISTS public.cap_service_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.cap_tenants(id) ON DELETE CASCADE,
    service_id UUID REFERENCES public.cap_services(id) ON DELETE CASCADE,
    inventory_id UUID REFERENCES public.cap_inventory(id) ON DELETE CASCADE,
    quantity_consumed NUMERIC(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.cap_timeline_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.cap_tenants(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.cap_clients(id) ON DELETE CASCADE,
    professional_id UUID REFERENCES public.cap_profiles(id),
    appointment_id UUID REFERENCES public.cap_appointments(id),
    content TEXT NOT NULL,
    type TEXT DEFAULT 'comment',
    image_path TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.cap_vouchers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.cap_tenants(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    discount_type TEXT NOT NULL DEFAULT 'percentage',
    discount_value NUMERIC(10, 2) NOT NULL,
    expiry_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, code)
);
-- ==========================================
-- ATUALIZAÇÃO DO BANCO DE DADOS (OPERA BEAUTY)
-- ==========================================

-- 1. Adicionar colunas de Customização Visual (Branding) na tabela de Salões (Tenants)
ALTER TABLE public.cap_tenants
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS primary_color TEXT DEFAULT '#7c5357',
ADD COLUMN IF NOT EXISTS secondary_color TEXT DEFAULT '#eeb9bd';

-- ==========================================
-- 2. EXTENSÃO PGCRYPTO PARA SENHAS SEGURAS
-- ==========================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ==========================================
-- 3. FUNÇÕES RPC DE AUTENTICAÇÃO (LOGIN)
-- ==========================================

-- A. Login para Profissionais / Gestores
CREATE OR REPLACE FUNCTION cap_login_staff(p_tenant_id UUID, p_phone TEXT, p_password TEXT)
RETURNS json AS $$
DECLARE
    v_staff_record RECORD;
BEGIN
    -- Busca o profissional pelo telefone e tenant_id
    SELECT id, name, role, is_active, tenant_id, password_hash
    INTO v_staff_record
    FROM public.cap_staff
    WHERE tenant_id = p_tenant_id 
      AND phone = p_phone;

    -- Se não achou ou a senha não bater (criptografada)
    IF v_staff_record.id IS NULL OR v_staff_record.password_hash != crypt(p_password, v_staff_record.password_hash) THEN
        RAISE EXCEPTION 'Telefone ou senha incorretos';
    END IF;

    -- Se estiver inativo
    IF NOT v_staff_record.is_active THEN
        RAISE EXCEPTION 'Acesso bloqueado. Contate o administrador do salão.';
    END IF;

    -- Retorna os dados seguros (sem a senha)
    RETURN json_build_object(
        'id', v_staff_record.id,
        'name', v_staff_record.name,
        'role', v_staff_record.role,
        'tenant_id', v_staff_record.tenant_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- B. Login para Clientes Finais
CREATE OR REPLACE FUNCTION cap_login_client(p_tenant_id UUID, p_phone TEXT, p_password TEXT)
RETURNS json AS $$
DECLARE
    v_client_record RECORD;
BEGIN
    -- Busca o cliente pelo telefone e tenant_id
    SELECT id, name, tenant_id, password_hash
    INTO v_client_record
    FROM public.cap_clients
    WHERE tenant_id = p_tenant_id 
      AND phone = p_phone;

    -- Se não achou ou a senha não bater (criptografada)
    IF v_client_record.id IS NULL OR v_client_record.password_hash != crypt(p_password, v_client_record.password_hash) THEN
        RAISE EXCEPTION 'Telefone ou senha incorretos';
    END IF;

    -- Retorna os dados seguros (sem a senha)
    RETURN json_build_object(
        'id', v_client_record.id,
        'name', v_client_record.name,
        'role', 'client',
        'tenant_id', v_client_record.tenant_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- 4. BUCKET DE ARMAZENAMENTO PARA LOGOMARCAS
-- ==========================================
-- Caso não exista, crie manualmente no Supabase Dashboard um Storage Bucket chamado 'tenant_logos'
-- e defina-o como PÚBLICO para que as logos possam ser lidas no front-end.
-- ==========================================
-- SCRIPT COMPLEMENTAR: CRIAÇÃO DE EQUIPE (STAFF)
-- ==========================================

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

-- ==========================================
-- CUSTOMIZA��O VISUAL E BRANDING
-- ==========================================
ALTER TABLE public.cap_tenants
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS primary_color TEXT DEFAULT '#7c5357',
ADD COLUMN IF NOT EXISTS secondary_color TEXT DEFAULT '#eeb9bd',
ADD COLUMN IF NOT EXISTS tertiary_color TEXT DEFAULT '#f9f9f9',
ADD COLUMN IF NOT EXISTS banner_url TEXT,
ADD COLUMN IF NOT EXISTS banner_title TEXT,
ADD COLUMN IF NOT EXISTS banner_subtitle TEXT,
ADD COLUMN IF NOT EXISTS welcome_message TEXT;

-- ==========================================
-- MANUTEN��O DE SERVI�OS
-- ==========================================
ALTER TABLE public.cap_services
ADD COLUMN IF NOT EXISTS maintenance_days INTEGER DEFAULT 0;

-- Fun��o para Atualizar a Senha de um Cliente pelo Gestor
CREATE OR REPLACE FUNCTION cap_update_client_password(
    p_client_id UUID, 
    p_tenant_id UUID,
    p_password TEXT
)
RETURNS void AS 
BEGIN
    UPDATE public.cap_clients 
    SET password_hash = crypt(p_password, gen_salt('bf'))
    WHERE id = p_client_id AND tenant_id = p_tenant_id;
END;
 LANGUAGE plpgsql SECURITY DEFINER;

ALTER TABLE public.cap_timeline_notes ADD COLUMN IF NOT EXISTS staff_id UUID REFERENCES public.cap_staff(id);

ALTER TABLE public.cap_clients ADD COLUMN IF NOT EXISTS birth_date DATE;

ALTER TABLE public.cap_business_hours DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.cap_date_exceptions DISABLE ROW LEVEL SECURITY;

-- Tabela de Cupons de Desconto
CREATE TABLE public.cap_coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES public.cap_tenants(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('fixed', 'percentage')),
    discount_value NUMERIC NOT NULL,
    max_uses INT,
    current_uses INT DEFAULT 0,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, code)
);
ALTER TABLE public.cap_coupons DISABLE ROW LEVEL SECURITY;

-- Atualizacoes do Estoque
ALTER TABLE public.cap_inventory ADD COLUMN IF NOT EXISTS min_quantity NUMERIC NOT NULL DEFAULT 0;
ALTER TABLE public.cap_inventory ADD COLUMN IF NOT EXISTS unit TEXT NOT NULL DEFAULT 'un';
ALTER TABLE public.cap_inventory ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE public.cap_inventory ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'professional';
ALTER TABLE public.cap_inventory ADD COLUMN IF NOT EXISTS price NUMERIC DEFAULT 0;
ALTER TABLE public.cap_inventory DISABLE ROW LEVEL SECURITY;
