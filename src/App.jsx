import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useParams } from 'react-router-dom';
import { supabase } from './lib/supabase';

// --- Context ---
import { NotificationProvider } from './context/NotificationProvider';
import { Crown } from 'lucide-react';

// --- Páginas (Ainda mantendo as antigas temporariamente para não quebrar o build) ---
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Birthdays from './pages/Birthdays';
import ClientDetail from './pages/ClientDetail';
import Settings from './pages/Settings';
import Agenda from './pages/Agenda';
import Services from './pages/Services';
import Employees from './pages/Employees';
import Inventory from './pages/Inventory';
import PublicBooking from './pages/PublicBooking';
import Maintenance from './pages/Maintenance';
import ProfileSettings from './pages/ProfileSettings';
import ProfessionalPortal from './pages/ProfessionalPortal';

// --- Páginas Novas do Design System ---
import AcessoProfissional from './pages/AcessoProfissional';
import AcessoTelefone from './pages/AcessoTelefone';
import AcessoSenha from './pages/AcessoSenha';
import CadastroCliente from './pages/CadastroCliente';
import AgendamentoServicos from './pages/AgendamentoServicos';
import AgendamentoProfissionais from './pages/AgendamentoProfissionais';
import AgendamentoHorarios from './pages/AgendamentoHorarios';
import AgendamentoRevisao from './pages/AgendamentoRevisao';
import AgendamentoConfirmado from './pages/AgendamentoConfirmado';
import HistoricoAgendamentos from './pages/HistoricoAgendamentos';
import HomeCliente from './pages/HomeCliente';
import PerfilCliente from './pages/PerfilCliente';
import AgendaProfissional from './pages/AgendaProfissional';
import FichaClienteCRM from './pages/FichaClienteCRM';
import ResumoAgendamento from './pages/ResumoAgendamento';
import { BookingProvider } from './context/BookingContext';
import AdminLayout from './components/admin/AdminLayout';
import LandingPage from './pages/LandingPage';

// --- Contexto Multi-Tenant ---
import { TenantProvider, useTenant } from './context/TenantContext';
// --- Wrapper para Proteger as Rotas do Salão ---
const TenantWrapper = () => {
  return (
    <TenantProvider>
      <BookingProvider>
        <Outlet />
      </BookingProvider>
    </TenantProvider>
  );
};

// --- Rota Protegida Super Admin ---
const SuperAdminProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user?.email === 'cf95.souza@gmail.com') {
        setAuthorized(true);
      } else {
        setAuthorized(false);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-surface text-on-surface font-body-md">Validando acesso...</div>;
  if (!authorized) return <Navigate to="/superadmin/login" replace />;

  return children || <Outlet />;
};

// --- Rota Protegida Staff ---
const StaffProtectedRoute = ({ children }) => {
  const { session, loading } = useTenant();
  const { tenant_slug } = useParams();

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-surface text-on-surface font-body-md">Validando acesso...</div>;
  if (!session || (session.role !== 'professional' && session.role !== 'manager' && session.role !== 'admin')) {
    return <Navigate to={`/${tenant_slug}/staff/login`} replace />;
  }

  return children || <Outlet />;
};

// --- Rota Protegida Antiga (Será refatorada na Fase 23+) ---
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { session, loading } = useTenant();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Sincronizando...</div>;
  if (!session) return <Navigate to="login" replace />; 

  if (allowedRoles && session.role && !allowedRoles.includes(session.role)) {
    return <Navigate to={session.role === 'professional' ? 'portal' : ''} replace />;
  }
  return children || <Outlet />;
};

// --- Componente Principal ---
import DashboardAdmin from './pages/admin/DashboardAdmin';
import GestaoFinanceira from './pages/admin/GestaoFinanceira';
import GestaoEquipe from './pages/admin/GestaoEquipe';
import GestaoServicos from './pages/admin/GestaoServicos';
import GestaoClientes from './pages/admin/GestaoClientes';
import ConfiguracoesOperacionais from './pages/admin/ConfiguracoesOperacionais';
import BrandingCustomizacao from './pages/admin/BrandingCustomizacao';
import ControleEstoque from './pages/admin/ControleEstoque';
import AssinaturaSaaS from './pages/admin/AssinaturaSaaS';
import SuperAdmin from './pages/superadmin/SuperAdmin';
import SuperAdminLogin from './pages/superadmin/SuperAdminLogin';
import TenantDetailAdmin from './pages/superadmin/TenantDetailAdmin';
import TenantListAdmin from './pages/superadmin/TenantListAdmin';
import PlanosAdmin from './pages/superadmin/PlanosAdmin';
import SettingsAdmin from './pages/superadmin/SettingsAdmin';

function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [initializing, setInitializing] = useState(false); // Simplificado provisoriamente
  const [branding, setBranding] = useState({ salonName: 'OperaBeauty', primaryColor: '#7c5357', logoUrl: '' });

  // A lógica antiga de Supabase Auth foi temporariamente isolada aqui
  // pois precisará ser inteiramente refeita para usar a nova tabela `cap_staff` com RPC (Fase 22 concluída, agora aplicar no frontend).

  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          {/* Rota Raiz (SaaS Global) */}
          <Route path="/" element={<LandingPage />} />

          {/* Rotas Super Admin (SaaS Mestre) */}
          <Route path="/superadmin/login" element={<SuperAdminLogin />} />
          <Route element={<SuperAdminProtectedRoute />}>
            <Route path="/superadmin" element={<SuperAdmin />} />
            <Route path="/superadmin/tenants" element={<TenantListAdmin />} />
            <Route path="/superadmin/tenants/:id" element={<TenantDetailAdmin />} />
            <Route path="/superadmin/planos" element={<PlanosAdmin />} />
            <Route path="/superadmin/configuracoes" element={<SettingsAdmin />} />
          </Route>

          {/* Rotas Multi-Tenant (Todas encapsuladas no slug do salão) */}
          <Route path="/:tenant_slug" element={<TenantWrapper />}>
            
            {/* Rota Raiz do Salão (Redireciona para login ou dashboard) */}
            <Route index element={<Navigate to="home" replace />} />

            {/* Rotas Públicas do Salão */}
            <Route path="home" element={<HomeCliente />} />
            <Route path="agendar" element={<Navigate to="servicos" replace />} />
            <Route path="agendar/servicos" element={<AgendamentoServicos />} />
            <Route path="agendar/profissionais" element={<AgendamentoProfissionais />} />
            <Route path="agendar/horarios" element={<AgendamentoHorarios />} />
            <Route path="agendar/revisao" element={<AgendamentoRevisao />} />
            <Route path="agendar/confirmado" element={<AgendamentoConfirmado />} />
            <Route path="historico" element={<HistoricoAgendamentos />} />
            <Route path="perfil" element={<PerfilCliente />} />
            {/* Jornada de Login (Cliente e Staff) */}
            <Route path="login" element={<AcessoTelefone />} />
            <Route path="acesso-senha" element={<AcessoSenha />} />
            <Route path="cadastro" element={<CadastroCliente />} />
            <Route path="staff/login" element={<AcessoProfissional />} />
            <Route element={<StaffProtectedRoute />}>
              <Route path="staff/ficha-cliente/:id" element={<FichaClienteCRM />} />
              <Route element={<AdminLayout />}>
                <Route path="staff/agendamento/:id" element={<ResumoAgendamento />} />
                <Route path="staff/agenda-profissional" element={<AgendaProfissional />} />
                <Route path="staff/admin/dashboard" element={<DashboardAdmin />} />
                <Route path="staff/admin/financeiro" element={<GestaoFinanceira />} />
                <Route path="staff/admin/equipe" element={<GestaoEquipe />} />
                <Route path="staff/admin/clientes" element={<GestaoClientes />} />
                <Route path="staff/admin/servicos" element={<GestaoServicos />} />
                <Route path="staff/admin/configuracoes" element={<ConfiguracoesOperacionais />} />
                <Route path="staff/admin/branding" element={<BrandingCustomizacao />} />
                <Route path="staff/admin/estoque" element={<ControleEstoque />} />
                <Route path="staff/admin/assinatura" element={<AssinaturaSaaS />} />
              </Route>
            </Route>

            {/* Antigas rotas (mantidas para compatibilidade provisória) */}
            <Route element={<ProtectedRoute />}>
               <Route element={<Layout />}>
                 {/* <Route path="dashboard" element={<Dashboard />} /> */}
                 <Route path="clientes" element={<Clients />} />
                 <Route path="clientes/:id" element={<ClientDetail />} />
                 <Route path="aniversariantes" element={<Birthdays />} />
                 <Route path="agenda" element={<Agenda />} />
                 <Route path="servicos" element={<Services profile={profile} />} />
                 <Route path="profissionais" element={<Employees />} />
                 <Route path="estoque" element={<Inventory profile={profile} />} />
                 <Route path="manutencao" element={<Maintenance />} />
                 <Route path="configuracoes" element={<Settings />} />
                 <Route path="minha-conta" element={<ProfileSettings />} />
                 <Route path="portal" element={<ProfessionalPortal profile={profile} onLogout={() => setSession(null)} />} />
               </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  );
}

export default App;
