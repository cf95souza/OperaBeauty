import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTenant } from '../context/TenantContext';

const PerfilCliente = () => {
  const { tenant_slug } = useParams();
  const navigate = useNavigate();
  const { tenant, session, logout } = useTenant();

  const [nome, setNome] = useState(session?.name || '');
  const [telefone, setTelefone] = useState(session?.phone || '');
  const [dataNascimento, setDataNascimento] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(`/${tenant_slug}/login`);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simular salvamento
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);
  };

  return (
    <div className="bg-background text-on-background min-h-screen pb-32 font-body-md text-body-md antialiased selection:bg-primary-container selection:text-on-primary-container">
      
      {/* Top App Bar */}
      <header className="w-full top-0 sticky z-50 backdrop-blur-md bg-surface/80 flex items-center justify-between px-container-margin py-md">
        <div className="flex items-center gap-4">
          <span 
            onClick={() => navigate(-1)}
            className="material-symbols-outlined text-primary active:scale-95 duration-150 cursor-pointer"
          >
            arrow_back
          </span>
          <h1 className="font-headline-md text-headline-md-mobile text-primary tracking-tight">
            {tenant?.name || 'Serene Beauty'}
          </h1>
        </div>
        <button className="material-symbols-outlined text-primary hover:opacity-80 transition-opacity">
          more_vert
        </button>
      </header>

      <main className="w-full px-container-margin mt-lg max-w-[448px] mx-auto animate-fade-in-up">
        
        {/* Profile Header */}
        <section className="flex flex-col items-center mb-xl">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-surface-container-highest shadow-lg mb-md bg-surface-variant flex items-center justify-center">
               <span className="material-symbols-outlined text-[48px] text-secondary">person</span>
            </div>
            <button className="absolute bottom-4 right-0 bg-primary text-on-primary rounded-full p-2 shadow-md active:scale-90 transition-transform flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">edit</span>
            </button>
          </div>
          <h2 className="font-headline-md text-headline-md-mobile text-on-surface">
            {session?.name || 'Cliente'}
          </h2>
          <p className="font-label-sm text-label-sm text-secondary">Membro Platinum</p>
        </section>

        {/* Form Sections */}
        <form onSubmit={handleSave} className="space-y-xl">
          
          {/* Meus Dados Section */}
          <section>
            <div className="flex items-center gap-2 mb-md">
              <span className="material-symbols-outlined text-primary text-[20px]">badge</span>
              <h3 className="font-label-md text-label-md text-primary uppercase tracking-widest">Meus Dados</h3>
            </div>
            
            <div className="bg-surface-container-lowest rounded-xl p-md shadow-[0px_4px_20px_rgba(0,0,0,0.04)] space-y-md">
              <div className="relative focus-within:text-primary text-secondary transition-colors">
                <label className="block font-label-sm text-label-sm mb-1 ml-1 inherit-color">Nome Completo</label>
                <input 
                  className="w-full bg-transparent border-b border-outline-variant py-2 focus:border-primary focus:ring-0 transition-colors outline-none text-on-surface" 
                  type="text" 
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
              <div className="relative focus-within:text-primary text-secondary transition-colors">
                <label className="block font-label-sm text-label-sm mb-1 ml-1 inherit-color">Telefone</label>
                <input 
                  className="w-full bg-transparent border-b border-outline-variant py-2 focus:border-primary focus:ring-0 transition-colors outline-none text-on-surface" 
                  type="tel" 
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  disabled
                />
              </div>
              <div className="relative focus-within:text-primary text-secondary transition-colors">
                <label className="block font-label-sm text-label-sm mb-1 ml-1 inherit-color">Data de Nascimento</label>
                <input 
                  className="w-full bg-transparent border-b border-outline-variant py-2 focus:border-primary focus:ring-0 transition-colors outline-none text-on-surface" 
                  type="date" 
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Segurança Section */}
          <section>
            <div className="flex items-center gap-2 mb-md">
              <span className="material-symbols-outlined text-primary text-[20px]">lock</span>
              <h3 className="font-label-md text-label-md text-primary uppercase tracking-widest">Segurança</h3>
            </div>
            
            <div className="bg-surface-container-lowest rounded-xl p-md shadow-[0px_4px_20px_rgba(0,0,0,0.04)] space-y-md">
              <div className="relative focus-within:text-primary text-secondary transition-colors">
                <label className="block font-label-sm text-label-sm mb-1 ml-1 inherit-color">Nova Senha</label>
                <input 
                  className="w-full bg-transparent border-b border-outline-variant py-2 focus:border-primary focus:ring-0 transition-colors outline-none text-on-surface" 
                  placeholder="••••••••" 
                  type="password"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                />
              </div>
              <div className="relative focus-within:text-primary text-secondary transition-colors">
                <label className="block font-label-sm text-label-sm mb-1 ml-1 inherit-color">Confirmar Senha</label>
                <input 
                  className="w-full bg-transparent border-b border-outline-variant py-2 focus:border-primary focus:ring-0 transition-colors outline-none text-on-surface" 
                  placeholder="••••••••" 
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Action Button */}
          <div className="pt-md">
            <button 
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-label-md text-label-md shadow-lg active:scale-[0.98] transition-all hover:opacity-90 flex items-center justify-center gap-2 ${saved ? 'bg-tertiary text-on-tertiary' : 'bg-primary text-on-primary'}`}
            >
              {loading ? (
                <span className="material-symbols-outlined animate-spin">refresh</span>
              ) : saved ? (
                'Alterações Salvas!'
              ) : (
                'Salvar Alterações'
              )}
            </button>
            <button 
              type="button"
              onClick={handleLogout}
              className="w-full mt-4 text-error font-label-md text-label-md py-2 active:scale-95 transition-transform"
            >
              Sair da Conta
            </button>
          </div>

        </form>
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-surface-container-lowest shadow-[0px_-4px_20px_rgba(0,0,0,0.04)] rounded-t-xl">
        <button 
          onClick={() => navigate(`/${tenant_slug}/home`)}
          className="flex flex-col items-center justify-center text-secondary hover:bg-surface-variant/50 transition-colors active:scale-90 duration-200 ease-out px-4 py-1"
        >
          <span className="material-symbols-outlined">home</span>
          <span className="font-label-md text-label-md mt-1">Início</span>
        </button>
        <button 
          onClick={() => navigate(`/${tenant_slug}/agendar/servicos`)}
          className="flex flex-col items-center justify-center text-secondary hover:bg-surface-variant/50 transition-colors active:scale-90 duration-200 ease-out px-4 py-1"
        >
          <span className="material-symbols-outlined">calendar_add_on</span>
          <span className="font-label-md text-label-md mt-1">Agendar</span>
        </button>
        <button 
          className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-6 py-1 active:scale-90 duration-200 ease-out"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
          <span className="font-label-md text-label-md mt-1">Perfil</span>
        </button>
      </nav>
      
    </div>
  );
};

export default PerfilCliente;
