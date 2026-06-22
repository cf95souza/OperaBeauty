import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTenant } from '../context/TenantContext';

const HomeCliente = () => {
  const { tenant_slug } = useParams();
  const navigate = useNavigate();
  const { tenant, session } = useTenant();

  return (
    <div className="bg-background text-on-background min-h-screen pb-[80px] md:pb-0 font-body-md text-body-md antialiased selection:bg-primary-container selection:text-on-primary-container">
      {/* TopAppBar */}
      <header className="w-full top-0 sticky z-40 bg-surface shadow-sm transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-center px-gutter py-sm w-full max-w-7xl mx-auto">
          <button className="text-primary hover:opacity-80 transition-opacity p-2 -ml-2 rounded-full active:bg-surface-variant flex items-center justify-center">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className="font-headline-md text-headline-md-mobile md:text-headline-md text-primary tracking-tight">
            {tenant?.name || 'Ethereal Grace'}
          </h1>
          <button 
            onClick={() => navigate(`/${tenant_slug}/perfil`)}
            className="hover:opacity-80 transition-opacity rounded-full overflow-hidden w-10 h-10 border border-surface-variant shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <span className="material-symbols-outlined text-[32px] text-secondary flex items-center justify-center mt-1">account_circle</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-container-margin md:px-xl py-lg space-y-xl animate-fade-in-up">
        
        {/* Hero Section */}
        <section className="space-y-sm">
          <h2 className="font-headline-lg-mobile md:text-headline-lg text-on-surface">
            Olá, {session?.name ? session.name.split(' ')[0] : 'Bem-vindo(a)'}
          </h2>
          <p className="text-secondary">Encontre sua serenidade hoje.</p>
        </section>

        {/* Primary Actions (Bento Grid Style) */}
        <section className="grid grid-cols-2 gap-md">
          <button 
            onClick={() => navigate(`/${tenant_slug}/agendar/servicos`)}
            className="flex flex-col items-start p-lg bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0px_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 group border border-surface-variant/50 relative overflow-hidden text-left"
          >
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="bg-primary-container text-on-primary-container p-3 rounded-full mb-lg relative z-10">
              <span className="material-symbols-outlined text-headline-md">calendar_add_on</span>
            </div>
            <span className="font-label-md text-label-md text-on-surface relative z-10 group-hover:text-primary transition-colors">Agendar Novo<br />Horário</span>
          </button>

          <button 
            onClick={() => navigate(`/${tenant_slug}/historico`)}
            className="flex flex-col items-start p-lg bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0px_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 group border border-surface-variant/50 relative overflow-hidden text-left"
          >
            <div className="absolute inset-0 bg-surface-variant/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="bg-surface-variant text-on-surface-variant p-3 rounded-full mb-lg relative z-10">
              <span className="material-symbols-outlined text-headline-md">history</span>
            </div>
            <span className="font-label-md text-label-md text-on-surface relative z-10 group-hover:text-on-surface-variant transition-colors">Meus<br />Agendamentos</span>
          </button>
        </section>

        {/* Assinaturas & Planos (Glassmorphism Card) */}
        <section className="relative rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-surface-variant/30">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-container/40 to-surface-container-lowest/80 backdrop-blur-md z-0"></div>
          <div className="relative z-10 p-lg flex items-center justify-between">
            <div className="space-y-base">
              <div className="flex items-center space-x-2 text-primary">
                <span className="material-symbols-outlined filled text-body-md" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                <span className="font-label-sm text-label-sm uppercase tracking-wider">Fidelidade</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface">Clube {tenant?.name ? tenant.name.split(' ')[0] : 'Grace'}</h3>
              <p className="text-secondary text-sm md:text-base">Em breve benefícios exclusivos para você.</p>
            </div>
            <button className="bg-primary text-on-primary rounded-full p-3 hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </section>

        {/* Serviços Especiais (Horizontal Scroll) */}
        <section className="space-y-md">
          <div className="flex items-center justify-between">
            <h3 className="font-headline-md text-headline-md text-on-surface">Recomendações</h3>
            <button className="text-primary font-label-md text-label-md hover:underline">Ver todos</button>
          </div>
          <div className="flex overflow-x-auto hide-scrollbar space-x-md pb-4 -mx-container-margin px-container-margin md:mx-0 md:px-0">
            {/* Card 1 */}
            <div className="min-w-[280px] w-[70vw] md:w-1/3 bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] overflow-hidden shrink-0 group">
              <div className="h-40 bg-surface-container overflow-hidden relative">
                <div className="w-full h-full flex items-center justify-center text-primary/20">
                    <span className="material-symbols-outlined text-[64px]">spa</span>
                </div>
                <div className="absolute top-sm right-sm bg-surface-container-lowest/80 backdrop-blur-sm rounded-full p-1.5 text-primary">
                  <span className="material-symbols-outlined text-[18px]">favorite</span>
                </div>
              </div>
              <div className="p-md space-y-xs">
                <h4 className="font-label-md text-label-md text-on-surface">Dia da Noiva</h4>
                <p className="text-secondary text-sm line-clamp-2">Uma experiência completa de relaxamento e beleza.</p>
              </div>
            </div>
            
            {/* Card 2 */}
            <div className="min-w-[280px] w-[70vw] md:w-1/3 bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] overflow-hidden shrink-0 group">
              <div className="h-40 bg-surface-container overflow-hidden relative">
                <div className="w-full h-full flex items-center justify-center text-primary/20">
                    <span className="material-symbols-outlined text-[64px]">self_improvement</span>
                </div>
                <div className="absolute top-sm right-sm bg-surface-container-lowest/80 backdrop-blur-sm rounded-full p-1.5 text-primary">
                  <span className="material-symbols-outlined text-[18px]">spa</span>
                </div>
              </div>
              <div className="p-md space-y-xs">
                <h4 className="font-label-md text-label-md text-on-surface">Pacotes de Luxo</h4>
                <p className="text-secondary text-sm line-clamp-2">Tratamentos combinados para renovação total.</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 pb-[env(safe-area-inset-bottom,20px)] bg-surface-container-lowest shadow-[0px_-4px_20px_rgba(0,0,0,0.04)] rounded-t-xl transition-all duration-300 ease-in-out">
        <button 
          className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1 scale-95 transition-transform duration-200"
        >
          <span className="material-symbols-outlined filled mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
          <span className="font-label-sm text-label-sm">Início</span>
        </button>
        <button 
          onClick={() => navigate(`/${tenant_slug}/historico`)}
          className="flex flex-col items-center justify-center text-secondary opacity-70 hover:opacity-100 hover:bg-surface-variant rounded-full px-4 py-1 transition-all duration-200"
        >
          <span className="material-symbols-outlined mb-1">calendar_month</span>
          <span className="font-label-sm text-label-sm">Agenda</span>
        </button>
        <button 
          onClick={() => navigate(`/${tenant_slug}/perfil`)}
          className="flex flex-col items-center justify-center text-secondary opacity-70 hover:opacity-100 hover:bg-surface-variant rounded-full px-4 py-1 transition-all duration-200"
        >
          <span className="material-symbols-outlined mb-1">person</span>
          <span className="font-label-sm text-label-sm">Perfil</span>
        </button>
      </nav>
    </div>
  );
};

export default HomeCliente;
