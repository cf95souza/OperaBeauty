# Projeto OperaBeauty - Fases de Desenvolvimento

Este arquivo rastreia o progresso do desenvolvimento do sistema de gestão, desde a base inicial (Capelli) até a atual **NOVA ERA: OperaBeauty SaaS**.

*(As fases de 1 a 20 focaram no desenvolvimento inicial do produto Single-Tenant e PWA, cujos módulos básicos estão prontos e em operação. Detalhamentos mantidos em histórico anterior.)*

---

# NOVA ERA: OperaBeauty (SaaS White Label Multi Tenant & Novo Design System)

Com a chegada de 27 novas telas exportadas do Figma/Stitch, iniciamos um refatoramento total de interface atrelado à evolução da arquitetura do banco de dados para o modelo SaaS.

## Fase 21: Setup do Novo Design System (Stitch)
- [ ] Configuração do Tailwind v4 para aceitar as classes customizadas das telas exportadas (ex: `on-surface`, `primary`, fontes, etc).
- [ ] Criação dos componentes de layout e UI básicos baseados nos HTMLs (Botões, Inputs, Cards, Menus laterais, Headers).
- [ ] Estabelecimento da estrutura global de roteamento (Super Admin, Admin/Gestor, Profissional, Cliente).

## Fase 22: Fundação Multi Tenant no Banco de Dados
- [ ] Criação da tabela `cap_tenants` (Salões/Estabelecimentos).
- [ ] Refatoração das tabelas existentes (`cap_clients`, `cap_appointments`, `cap_services`, etc) para incluir `tenant_id`.
- [ ] Reescrita completa do RLS (Row Level Security) para garantir isolamento de dados por salão.
- [ ] Atualização do `AuthContext` e Contextos Globais no frontend para identificar o Salão atual (Tenant).

## Fase 23: Módulo de Acesso e Autenticação (Conversão de UI)
- [ ] Construir tela: `acesso_senha` e `acesso_telefone`.
- [ ] Construir tela: `cadastro` e `cadastro_com_senha`.
- [ ] Construir tela: `acesso_profissional_staff`.
- [ ] Integrar novas telas de acesso com o fluxo de autenticação real do Supabase.

## Fase 24: Portal do Cliente e Fluxo de Agendamento
- [x] Construir tela: `agendamento_selecionar_servi_o`.
- [x] Construir tela: `agendamento_selecionar_profissional`.
- [x] Construir tela: `agendamento_selecionar_hor_rio`.
- [x] Construir tela: `agendamento_revis_o_e_cupom`.
- [x] Construir tela: `agendamento_confirma_o` e `agendamento_confirmado`.
- [x] Construir tela: `hist_rico_de_agendamentos`.

## Fase 25: Portal do Profissional (Staff App)
- [x] Construir tela: `agenda_profissional` (Listagem de horários e clientes do dia).
- [x] Construir tela: `agenda_profissional_controles_de_atendimento`.
- [x] Construir tela: `meu_perfil`.

## Fase 26: Módulo Gestor Administrativo (Dashboard)
- [x] Construir tela: `home_dashboard` e `dashboard_administrativo`.
- [x] Construir tela: `gest_o_de_equipe`.
- [x] Construir tela: `gest_o_financeira`.
- [x] Construir tela: `controle_de_estoque`.
- [x] Construir tela: `configura_es_operacionais`.
- [x] Construir tela: `ficha_da_cliente_crm`.

## Fase 27: Módulo Super Admin (Gestor SaaS)
- [x] Construir tela: `super_admin_gest_o_de_sal_es_e_planos` e Login Exclusivo do Mestre.
- [x] Construir tela: `branding_customiza_o` (Ajuste global de cores e logo do salão).

## Fase 28: Integração de Banco de Dados Multi-Tenant e CRUDs
- [x] Unificação dos scripts de banco (`database.sql`) e atualização da documentação (`estrutura_db.md`).
- [x] Integração da tela Acesso Profissional e Cliente com RPCs de Login Seguro (`pgcrypto`).
- [x] Integração da tela Branding & Customização para persistir cores no `TenantContext` e injetar CSS Variables via BD.
- [x] Integração da tela Gestão de Equipe com listagem e criação de staff via RPC `cap_register_staff`.
- [x] Criação e integração da tela Gestão de Serviços com CRUD na tabela `cap_services`.
- [x] Criação e integração da tela Controle de Estoque com filtros, CRUD, tipo de venda e botão de reabastecimento rápido.
- [x] Implementação de dados reais no Dashboard Gerencial (Faturamento, Ocupação, Aniversários e Alertas de Estoque).
- [x] Refatoração da Gestão Financeira com métricas reais (Ticket Médio, Serviço mais Rentável e Faturamento Mensal).

## Fase 29: Homologação SaaS, Funcionalidades Dinâmicas e Agenda
- [x] Conexão do Fluxo de Agendamento do Cliente com Banco de Dados.
- [x] Listagem real de Serviços (`cap_services`) e Profissionais (`cap_staff`) na jornada do cliente.
- [x] Criação da lógica de bloqueio de horários baseada em agendamentos existentes (`cap_appointments`).
- [x] Inserção final do agendamento validado (`cap_appointments`) via tela de Revisão.
- [x] Integração da Tela de Agenda Profissional/Salão com visualização e permissão baseada no cargo (Gestor vs Profissional).
- [x] Refatoração da tabela cap_blocked_dates para cap_date_exceptions e cap_business_hours para suportar todos os dias da semana.
- [x] Atualização da tela de Configurações Operacionais para gerar grade dinâmica de exceções e bloqueios por data.
- [x] Atualização da tela de Gestão de Serviços integrando consumo de estoque, tempo de manutenção e retornos automáticos no Dashboard.
- [x] Motor de Cupons de Desconto (Criação pelo Gestor e Aplicação e Validação real no fluxo de Checkout do Cliente).
- [x] Módulo Avançado de Identidade e Branding (Edição do nome do salão e do link único/slug de acesso com recarregamento dinâmico).
- [x] Melhorias no CRM (Ficha de Cliente e Gestão de Clientes) integrando contato rápido via WhatsApp.
- [x] Integração Módulo de Faturas (Assinatura SaaS) e Baixa Manual.
- [x] Proteção Reforçada de Rotas Administrativas (StaffProtectedRoute).

## Fase 30: Novo Ambiente (Banco de Dados Homologação/Produção)
- [ ] Criação de novo projeto/banco de dados no Supabase limpo para a versão oficial.
- [ ] Rodar o script unificado do `estrutura_db.md` (V 1.0) no novo banco.
- [ ] Configuração de Chaves (API Keys e URL) do novo ambiente no `.env`.
- [ ] Executar bateria final de testes sistêmicos.

## Fase 31: Landing Page (Página de Vendas do SaaS)
- [ ] Implementação do layout de apresentação do produto (Pitch de vendas, benefícios).
- [ ] Formulário de intenção de assinatura / Contato comercial.
- [ ] Integração com botão de Login do Super Admin na área restrita.
