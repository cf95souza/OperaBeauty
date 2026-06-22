import React, { useState, useEffect } from 'react';
import { Outlet, Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';

const AdminLayout = () => {
  const { tenant_slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { tenant, session, logout } = useTenant();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fecha o menu mobile quando a rota mudar
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock scroll quando o menu mobile estiver aberto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    if (logout) logout();
    navigate(`/${tenant_slug}/staff/login`);
  };

  const isManager = !session || session?.role === 'manager' || session?.role === 'admin'; // fallback to manager if no session for testing

  const navLinks = [
    ...(isManager ? [{ to: `/${tenant_slug}/staff/admin/dashboard`, icon: 'analytics', label: 'Dashboard' }] : []),
    ...(isManager ? [{ to: `/${tenant_slug}/staff/admin/financeiro`, icon: 'payments', label: 'Financeiro' }] : []),
    { to: `/${tenant_slug}/staff/agenda-profissional`, icon: 'today', label: isManager ? 'Agenda do Salão' : 'Minha Agenda' },
    ...(isManager ? [{ to: `/${tenant_slug}/staff/admin/equipe`, icon: 'diversity_3', label: 'Equipe' }] : []),
    ...(isManager ? [{ to: `/${tenant_slug}/staff/admin/clientes`, icon: 'groups', label: 'Clientes' }] : []),
    ...(isManager ? [{ to: `/${tenant_slug}/staff/admin/servicos`, icon: 'spa', label: 'Serviços' }] : []),
    ...(isManager ? [{ to: `/${tenant_slug}/staff/admin/estoque`, icon: 'shelves', label: 'Estoque' }] : []),
    ...(isManager ? [{ to: `/${tenant_slug}/staff/admin/configuracoes`, icon: 'settings_account_box', label: 'Operacional' }] : []),
    ...(isManager ? [{ to: `/${tenant_slug}/staff/admin/branding`, icon: 'palette', label: 'Branding' }] : []),
    ...(isManager ? [{ to: `/${tenant_slug}/staff/admin/assinatura`, icon: 'workspace_premium', label: 'Assinatura' }] : []),
  ];

  return (
    <div className="antialiased min-h-screen flex bg-background font-body-md text-body-md text-on-background selection:bg-primary-container selection:text-on-primary-container relative">
      
      {/* Overlay Escuro para Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 md:hidden animate-fade-in"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Navigation Drawer (Desktop/Tablet/Mobile) */}
      <aside className={`
        fixed left-0 top-0 h-full w-80 bg-surface shadow-[0px_10px_30px_rgba(0,0,0,0.08)] z-[60] flex flex-col p-md gap-base transition-transform duration-300 ease-in-out pt-[max(env(safe-area-inset-top),_1.5rem)]
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        
        {/* Header da Sidebar */}
        <div className="flex items-center justify-between mb-xl p-sm">
          <div className="flex items-center gap-md">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-variant flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-on-surface-variant text-2xl">person</span>
            </div>
            <div>
              <h2 className="font-label-md text-label-md text-on-surface">{session?.name || (isManager ? 'Gestor' : 'Profissional')}</h2>
              <p className="font-label-sm text-label-sm text-secondary">{tenant?.name || 'Salão'}</p>
            </div>
          </div>
          <button 
            className="md:hidden text-on-surface-variant hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 space-y-2 overflow-y-auto hide-scrollbar">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link 
                key={link.to}
                to={link.to} 
                className={`flex items-center gap-md px-md py-sm rounded-lg transition-all font-label-md text-label-md ${
                  isActive 
                    ? 'bg-primary-container text-on-primary-container font-semibold' 
                    : 'text-secondary hover:bg-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  {link.icon}
                </span>
                {link.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-auto pt-md border-t border-surface-variant flex flex-col gap-sm">
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 text-error hover:bg-error-container hover:text-error px-md py-sm rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label-md text-label-md">Sair da Conta</span>
          </button>
          <p className="font-label-sm text-label-sm text-tertiary text-center">Acesso {isManager ? 'Gestor' : 'Profissional'}</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 w-full md:ml-80 flex flex-col min-h-screen">
        
        {/* TopAppBar (Mobile & Desktop) */}
        <header className="flex justify-between items-center w-full px-gutter z-40 bg-surface shadow-[0px_4px_20px_rgba(0,0,0,0.04)] sticky top-0 shrink-0 pt-[max(env(safe-area-inset-top),_1rem)] pb-2 min-h-[4rem]">
          <div className="flex items-center gap-sm">
            <button 
              className="md:hidden text-primary hover:opacity-80 transition-opacity p-2 -ml-2"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h1 className="font-headline-md text-headline-md text-primary tracking-tight">{tenant?.name || 'Salão'}</h1>
          </div>
          {/* Trailing Avatar */}
          <div className="flex items-center gap-md">
            <button className="text-secondary hover:opacity-80 transition-opacity relative p-2 -mr-2">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-surface-variant overflow-hidden md:hidden flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface-variant text-sm">person</span>
            </div>
          </div>
        </header>

        {/* Outlet Canvas */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-container-margin py-xl animate-fade-in-up">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
