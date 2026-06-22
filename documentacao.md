# Documentação do Projeto: OperaBeauty

## Escopo do Projeto
O OperaBeauty é um sistema SaaS White Label Multi Tenant focado no ramo de beleza feminina, abrangendo estúdios, salões de beleza, manicures, clínicas de estética, entre outros. A arquitetura Multi Tenant permite que uma única instância do sistema atenda múltiplas empresas simultaneamente, com segurança e independência.

A estratégia principal de acesso (tanto para clientes finais quanto para os profissionais e gestores) se dará através de rotas baseadas no nome do salão, utilizando o formato `seudominio.com/[nomedosalao]` (ex: `OperaBeauty/salaodamaria`). Esse formato evita falhas globais de roteamento, garante isolamento visual/dados, e permite customização de identidade visual (White Label) para cada ambiente.

O sistema é dividido estrategicamente em 4 Módulos Principais (fundamentados pelo novo Design System do Stitch):
1. **Módulo Cliente (Portal do Cliente):** Fluxo de agendamento, histórico, fidelidade e pagamentos. **Importante:** O isolamento de clientes é total. O link de acesso dita a base de dados. Se uma cliente usa o salão A e o salão C, ela terá cadastros e senhas separadas para cada um, vinculados unicamente àquele link.
    - **Fluxo Exato do Cliente:**
      1. Acessa o link do salão (`/[nomedosalao]`).
      2. Tela **`acesso_telefone`**: Digita o número. Se já tiver cadastro, avança para:
      3. Tela **`acesso_senha`**: Digita a senha para autenticar.
      4. Tela **`home_dashboard`**: Painel principal do cliente com atalhos.
      5. Jornada de Agendamento (Implementada com Design Stitch): **`agendamento_selecionar_profissional`** > **`agendamento_selecionar_servi_o`** > **`agendamento_selecionar_hor_rio`** > **`agendamento_revis_o_e_cupom`** > **`agendamento_confirmado`**.
      6. Tela **`hist_rico_de_agendamentos`** (Implementada): Permite gerenciar, cancelar e rever procedimentos realizados.
      7. Tela **`meu_perfil`**: Gestão e atualização de dados pessoais.
2. **Módulo Operador / Profissional (Staff App):** Acessado via link do próprio salão. Assim como clientes, profissionais que trabalham em mais de um salão terão usuários separados para cada link, sem cruzamento de dados. Cada gestor administra sua própria equipe.
    - **Fluxo Exato do Profissional:**
      1. Tela **`acesso_profissional_staff`**: Login.
      2. Tela **`agenda_profissional_controles_de_atendimento`**: Visualização da agenda do salão e da sua própria agenda.
      3. Tela **`ficha_da_cliente_crm`**: O acesso ao CRM/Ficha da cliente se dá *exclusivamente* por dentro de um procedimento em andamento.
      - *Regra de Negócio (Multitarefa):* É possível iniciar um procedimento, deixá-lo "em andamento", voltar para a tela principal e iniciar outro procedimento simultaneamente. Isso economiza tempo operacional do salão.
3. **Módulo Gerente / Dono (Administrativo):** Dashboard gerencial, gestão de equipe total, fluxo financeiro, estoque e renovação de assinatura do sistema.
    - **Fluxo Exato do Gestor:**
      1. Login pela mesma tela da equipe: **`acesso_profissional_staff`**.
      2. Telas Gerenciais (Implementadas): **`dashboard_administrativo`**, **`gest_o_financeira`**, **`gest_o_de_equipe`**, **`configura_es_operacionais`**, **`branding_customiza_o`** e **`controle_de_estoque`**.
      - *Regra de Negócio:* O gestor também pode executar serviços (atuar como profissional). Portanto, ele tem acesso livre à tela de agenda com a mesma visão e controles da equipe.
4. **Módulo Super Admin (SaaS Mestre):** Acesso exclusivo do dono da plataforma (Você). Responsável por cadastrar os salões novos e monitorar o faturamento macro. 

---

## O Novo Design System (Integração Stitch)
O projeto passou por um grande refatoramento visual. Foram exportadas 27 telas completas do Stitch, que definem a nova identidade visual do sistema. As tecnologias utilizadas para comportar este design continuam sendo:
- **Frontend Core:** React 19, Vite 8, React Router v7.
- **Estilização e UI:** Tailwind CSS v4.

---

## Funcionalidades e Diferenciais (Roadmap Estratégico)

### 1. Agenda e Agendamento (Core)
- **Funcionalidades:** Agenda diária/semanal/mensal, fluxos otimizados para seleção.
- **Diferencial (IA):** Sugestão automática de encaixes.

### 2. CRM Avançado e Ficha de Anamnese
- **Ficha de Cliente (CRM):** Histórico completo (acessível apenas via procedimento em andamento).
- **Anamnese 100% Dinâmica (Form Builder):** O sistema terá um construtor completamente aberto (provavelmente utilizando campos JSON no banco de dados). O salão terá autonomia total para montar o questionário como bem entender (textos, múltipla escolha, checkboxes), sem limitação de formato.

### 3. Serviços e Equipe (Gestão)
- **Painel de Equipe:** Gestão de staff, acessos e perfil do profissional.
- **Comissões Automatizadas:** Ao cadastrar um profissional, o gestor pode (opcionalmente) definir taxas de comissão. O sistema utilizará esses dados para calcular o pagamento de forma 100% automática a cada serviço concluído.
- **Controle Operacional:** Check-in e checkout de atendimentos.

### 4. Financeiro e Estoque
- **Dashboard e Financeiro:** Fluxo de caixa e histórico de receitas e despesas.
- **Estoque Atrelado a Serviços:** Ao cadastrar um serviço, o gestor pode escolher se ele consome estoque. Se ativado, ele seleciona um ou mais itens da lista de insumos e define a quantidade exata consumida por serviço. A baixa é automática assim que o procedimento for concluído no aplicativo.

### 5. Multi Tenant, Roteamento e Assinaturas (SaaS)
- **Criação de Salão (Onboarding):** Feita exclusivamente de forma manual pelo Super Admin (Você).
- **Modelo de Negócio (Plano Único):** O salão paga uma assinatura mensal de **R$ 59,99/mês**, sem limites de profissionais.
- **Gateway de Pagamento (AbacatePay):** Será a **última etapa do projeto** (em fase de aprovação). O pagamento e renovação da assinatura do sistema será feito pelo dono do salão por dentro do painel gerencial.
- **Roteamento Dinâmico (Slug):** Acesso individualizado por salão através da rota `/[nomedosalao]`.
- **Isolamento de Dados:** RLS (Row Level Security) aplicado rigorosamente.

---

## Relatório de Status Atual (Atualizado)

Nesta última grande sprint, concluímos a fundação visual de **todos os 4 módulos principais** do sistema utilizando o novo Design System exportado do Figma via Stitch.

### O que já foi feito (Telas Implementadas):
1. **Módulo Cliente:** Todo o fluxo de login (telefone/senha), cadastro, dashboard inicial, jornada completa de agendamento (serviço, profissional, horário, revisão) e histórico de agendamentos.
2. **Módulo Profissional:** Login da equipe, agenda diária e ficha de CRM da cliente.
3. **Módulo Gestor (Admin):** Dashboard gerencial, gestão financeira, gestão de equipe, controle de estoque, configurações operacionais, gestão de serviços e branding/customização.
4. **Módulo Super Admin:** Painel global do dono da plataforma (SaaS Mestre) e tela de login isolada e super segura.
5. **Arquitetura Base e Integração BD:** O modelo Multi-Tenant foi ativado e todas as telas fundamentais estão integradas. As páginas de Dashboard, Financeiro, Agenda (Profissional e Salão), Gestão de Equipe, Estoque e Serviços já realizam operações reais de leitura/escrita e manipulam dados vivos utilizando Supabase RPCs seguras e joins relacionais.
6. **Configurações Operacionais Dinâmicas:** A tabela de bloqueios de datas foi transformada para suportar Exceções Específicas por Data (podendo abrir com horários diferenciados). O calendário geral agora aceita gestão flexível de todos os dias (Domingo a Sábado).
7. **Gestão de Serviços Avançada:** Implementamos o Módulo de Serviços (Módulo Ouro) integrando o controle de tempo de manutenção e o abatimento automático de estoque atrelado ao procedimento. O Dashboard agora prevê e avisa automaticamente os Retornos Agendados (Próximos 30 dias).
8. **Motor de Cupons e Branding Completo:** Sistema de descontos funcional com controle de expiração (data) e limites de quantidade de usos, integrado em tempo real no checkout da cliente. Branding customizável permitindo alterar nome e slug (link) do salão de forma dinâmica.
9. **CRM Aprimorado:** Tela de clientes com rápido acesso para iniciar chamadas no WhatsApp, redefinição segura de senhas pelo gerente e proteção contra links quebrados no painel.

### Próximos Passos (Integrações Finais):
1. **Fluxo Financeiro de Comandas:** Gerenciar check-in e check-out da comanda (recebimentos no salão são sempre diretos/presenciais, sem gateway), integrando com a leitura já implementada no Dashboard Gerencial.
2. **Gateway de Pagamento (SaaS):** Integração com AbacatePay exclusiva para o painel do Super Admin (e gerencial do dono do salão), com foco unicamente na cobrança da mensalidade do uso do sistema (SaaS).
3. **Comunicação:** Disparos automáticos via WhatsApp (Notificações) para clientes finais.
