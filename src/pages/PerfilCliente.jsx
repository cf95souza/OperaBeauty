import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTenant } from '../context/TenantContext';
import { supabase } from '../lib/supabase';

const PerfilCliente = () => {
  const { tenant_slug } = useParams();
  const navigate = useNavigate();
  const { tenant, session, logout } = useTenant();

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Fetch client data
  useEffect(() => {
    if (!session || session.role !== 'client') {
      navigate(`/${tenant_slug}/login`);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('cap_clients')
          .select('name, phone, birth_date')
          .eq('id', session.id)
          .single();

        if (error) throw error;
        if (data) {
          setNome(data.name || '');
          setTelefone(data.phone || '');
          setDataNascimento(data.birth_date || '');
        }
      } catch (err) {
        console.error("Erro ao buscar perfil do cliente", err);
      } finally {
        setInitialLoad(false);
      }
    };
    fetchProfile();
  }, [session, navigate, tenant_slug]);

  const handleLogout = () => {
    logout();
    navigate(`/${tenant_slug}/login`);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!nome.trim()) return alert("O nome é obrigatório.");
    
    if (novaSenha || confirmarSenha) {
      if (novaSenha !== confirmarSenha) {
        return alert("As senhas não coincidem.");
      }
      if (novaSenha.length < 6) {
        return alert("A nova senha deve ter no mínimo 6 caracteres.");
      }
    }

    setLoading(true);
    try {
      // Update name and birth_date
      const { error: updateError } = await supabase
        .from('cap_clients')
        .update({
          name: nome,
          birth_date: dataNascimento || null
        })
        .eq('id', session.id);

      if (updateError) throw updateError;

      // Update password via RPC if provided
      if (novaSenha) {
        const { error: rpcError } = await supabase.rpc('cap_update_client_password', {
          p_client_id: session.id,
          p_tenant_id: tenant.id,
          p_password: novaSenha
        });
        if (rpcError) throw rpcError;
        setNovaSenha('');
        setConfirmarSenha('');
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar alterações: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen pb-32 font-body-md text-body-md antialiased selection:bg-primary-container selection:text-on-primary-container">
      
      {/* Top App Bar */}
      <header className="w-full top-0 sticky z-50 backdrop-blur-md bg-surface/80 pt-[env(safe-area-inset-top,0px)]">
        <div className="flex items-center justify-between px-container-margin py-md max-w-7xl mx-auto">
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
          <div className="w-6"></div>{/* Spacer for symmetry */}
        </div>
      </header>

      <main className="w-full px-container-margin mt-lg max-w-[448px] mx-auto animate-fade-in-up">
        
        {/* Profile Header */}
        <section className="flex flex-col items-center mb-xl">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-surface-container-highest shadow-lg mb-md bg-surface-variant flex items-center justify-center">
               <span className="material-symbols-outlined text-[48px] text-secondary">person</span>
            </div>
          </div>
          <h2 className="font-headline-md text-headline-md-mobile text-on-surface">
            {nome || 'Cliente'}
          </h2>
          <p className="font-label-sm text-label-sm text-secondary">Membro Platinum</p>
        </section>

        {/* Form Sections */}
        {initialLoad ? (
          <div className="flex justify-center py-10">
            <span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span>
          </div>
        ) : (
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
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 py-3 pb-[env(safe-area-inset-bottom,20px)] bg-white shadow-[0px_-4px_20px_rgba(0,0,0,0.04)] rounded-t-xl transition-all duration-300 ease-in-out">
        <button 
          onClick={() => navigate(`/${tenant_slug}/home`)}
          className="flex flex-col items-center justify-center text-secondary opacity-70 hover:opacity-100 hover:bg-surface-variant rounded-full px-4 py-1 transition-all duration-200"
        >
          <span className="material-symbols-outlined mb-1">spa</span>
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
          className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1 scale-95 transition-transform duration-200"
        >
          <span className="material-symbols-outlined filled mb-1" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
          <span className="font-label-sm text-label-sm">Perfil</span>
        </button>
      </nav>
      
    </div>
  );
};

export default PerfilCliente;
