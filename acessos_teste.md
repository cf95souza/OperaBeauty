# Links e Acessos de Teste (Ambiente Local)

Aqui estão os mapeamentos de todas as rotas do projeto. O prefixo `salaomaria` atua como o **Slug do Tenant** (pode ser trocado por qualquer outro salão no futuro).

### 1. Super Admin (Dono do SaaS)
- **URL:** [http://localhost:5173/superadmin/login](http://localhost:5173/superadmin/login)
- **Login:** `cf95.souza@gmail.com`
- **Senha:** (A senha real que você usa na sua conta Supabase Auth)
- **Fluxo:** Se o login validar que o e-mail é exatamente este, ele te deixa entrar no Painel Mestre global (fora da visão de qualquer salão).

### 2. Cliente (Portal de Agendamento)
- **URL Inicial (Home):** [http://localhost:5173/salaomaria/home](http://localhost:5173/salaomaria/home)
- **URL de Login:** [http://localhost:5173/salaomaria/login](http://localhost:5173/salaomaria/login)
- **URL de Cadastro:** [http://localhost:5173/salaomaria/cadastro](http://localhost:5173/salaomaria/cadastro)
- **Como testar hoje:** O cadastro vai depender do banco estar pronto, então usaremos a criação de usuários de teste logo a seguir.

### 3. Profissional / Operador (Staff App)
- **URL de Login:** [http://localhost:5173/salaomaria/staff/login](http://localhost:5173/salaomaria/staff/login)
- **Credenciais (Após inserirmos os dados no banco):**
  - **Telefone:** `(11) 88888-8888`
  - **Senha:** `123456`
- **Fluxo:** O sistema detectará a permissão `role = 'professional'` e enviará direto para `/salaomaria/agenda-profissional`.

### 4. Gestor / Dono do Salão (Administrativo)
- **URL de Login:** [http://localhost:5173/salaomaria/staff/login](http://localhost:5173/salaomaria/staff/login) *(É a mesmíssima tela da equipe)*
- **Credenciais (Após inserirmos os dados no banco):**
  - **Telefone:** `(11) 99999-9999`
  - **Senha:** `123456`
- **Fluxo:** O sistema detectará a permissão `role = 'manager'` e enviará para o painel de controles financeiros em `/salaomaria/admin/dashboard`.

---

**Nota:** Como a interface já está toda amarrada para chamar funções reais do banco (`supabase.rpc('cap_login_staff')`), o botão de entrar só funcionará de verdade após finalizarmos o próximo passo: **estruturar o banco de dados e inserir essas contas de teste!**
