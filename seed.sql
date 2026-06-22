-- ==========================================
-- SCRIPT DE POPULAÇÃO DE DADOS (SEED)
-- Execute este script no Supabase APÓS ter rodado o script de criação das tabelas.
-- ==========================================

-- 1. Criar o Salão (Tenant) de teste
INSERT INTO public.cap_tenants (id, slug, name, status, plan_price)
VALUES (
    '11111111-1111-1111-1111-111111111111', 
    'salaomaria', 
    'Salão Maria', 
    'active', 
    59.99
) ON CONFLICT (slug) DO NOTHING;

-- 2. Criar o Gestor do Salão (Usa a função segura que criamos para hashear a senha '123456')
-- Usaremos um INSERT direto chamando o crypt do pgcrypto para facilitar o seed
INSERT INTO public.cap_staff (tenant_id, name, phone, password_hash, role, is_active)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'Maria (Gestora)',
    '11999999999',
    crypt('123456', gen_salt('bf')),
    'manager',
    true
);

-- 3. Criar um Profissional do Salão
INSERT INTO public.cap_staff (tenant_id, name, phone, password_hash, role, commission_rate, is_active)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'Ana (Manicure)',
    '11888888888',
    crypt('123456', gen_salt('bf')),
    'professional',
    40.00,
    true
);

-- 4. Criar um Cliente de Teste
INSERT INTO public.cap_clients (tenant_id, name, phone, password_hash)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'Cliente Teste',
    '11777777777',
    crypt('123456', gen_salt('bf'))
);

-- 5. Criar alguns Serviços de Teste
INSERT INTO public.cap_services (tenant_id, name, duration_minutes, price, is_active)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Corte Feminino', 60, 80.00, true),
    ('11111111-1111-1111-1111-111111111111', 'Manicure', 45, 35.00, true),
    ('11111111-1111-1111-1111-111111111111', 'Escova Progressiva', 120, 250.00, true);
