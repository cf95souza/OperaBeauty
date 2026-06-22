import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useTenant } from '../context/TenantContext';
import { supabase } from '../lib/supabase';

const CadastroCliente = () => {
  const { tenant_slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { tenant, login } = useTenant();
  
  const [phone] = useState(location.state?.phone || '');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!phone) {
      navigate(`/${tenant_slug}/login`);
    }
  }, [phone, navigate, tenant_slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data: newClientId, error: registerError } = await supabase.rpc('cap_register_client', {
        p_tenant_id: tenant.id,
        p_name: name,
        p_phone: phone,
        p_password: password
      });

      if (registerError) throw registerError;

      login({
        id: newClientId,
        name: name,
        tenant_id: tenant.id,
        role: 'client'
      });

      navigate(`/${tenant_slug}/home`);

    } catch (err) {
      console.error(err);
      setError("Erro ao realizar cadastro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start overflow-x-hidden bg-[#f9f9f9]">
      <header className="w-full top-0 sticky bg-[#f9f9f9] flex items-center justify-between px-[20px] py-[16px] z-40">
        <div className="flex items-center gap-[16px]">
          <button 
            onClick={() => navigate(-1)}
            className="active:scale-95 duration-150 hover:opacity-80 transition-opacity text-primary"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <span className="font-serif text-[24px] leading-[1.3] font-semibold text-primary tracking-tight">
            {tenant?.name || 'Serene Beauty'}
          </span>
        </div>
        <div className="w-6"></div>
      </header>

      <main className="w-full max-w-[448px] px-[20px] flex-grow flex flex-col">
        <section className="mt-[16px] mb-[40px] animate-fade-in-up">
          <div className="grid grid-cols-2 gap-4 h-48">
            <div className="bg-[#e8b4b8] rounded-xl overflow-hidden relative group transition-transform duration-500 hover:scale-[1.02]">
              <img 
                alt="Beauty Atmosphere" 
                className="w-full h-full object-cover opacity-80" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBY2D0vDZtjzyiwfZHAfSdcsfMe2eBgerm3GkEy1h9CfY63fh8WGVTjZGNdRzcni39FE13M0kmtTmgPqayJxgNT3XHeGPgetAL38r4C8IK6Nn2ZCm8wezHp_5m4MgbSHZwXUlyP8maVtAYWvPKPYqqVKtibIHPbxpqI_S56CsryrV0_6TqIS3AA-9I1kgLP7h-GhOvTETGtP82vQ-f9gGPmpTSUMbefEituG_cNFoyf0YLT1kB3X6XqNOEdFjSdbF8wF25PNvaUYC1b"
              />
              <div className="absolute inset-0 bg-[#7c5357]/20 mix-blend-multiply"></div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="h-1/2 bg-[#e2e2e2] rounded-xl flex items-center justify-center p-4">
                <span className="material-symbols-outlined text-primary scale-150">auto_awesome</span>
              </div>
              <div className="h-1/2 bg-[#e4e2e1] rounded-xl flex items-center justify-center p-4">
                <span className="material-symbols-outlined text-[#656464] scale-150">spa</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-[24px] animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <h1 className="font-serif text-[28px] leading-[1.2] font-semibold text-on-surface mb-2">
            Parece que você é novo por aqui!
          </h1>
          <p className="font-sans text-[16px] text-on-surface-variant">
            Vamos fazer seu cadastro para você aproveitar a melhor experiência de beleza.
          </p>
        </section>

        <section className="bg-white rounded-xl p-[24px] shadow-[0px_4px_20px_rgba(0,0,0,0.04)] mb-[40px] animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <form onSubmit={handleSubmit} className="space-y-[24px]">
            {error && <p className="text-error text-sm">{error}</p>}
            
            <div className="relative">
              <label className="font-semibold text-[14px] tracking-widest text-on-surface-variant block mb-2" htmlFor="name">
                Nome completo
              </label>
              <input 
                id="name" 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Como quer ser chamado(a)?"
                className="w-full border-0 border-b border-outline-variant bg-transparent px-0 py-2 focus:ring-0 focus:border-primary transition-colors text-[16px] text-on-surface placeholder:text-outline-variant outline-none"
              />
            </div>

            <div className="relative">
              <label className="font-semibold text-[14px] tracking-widest text-on-surface-variant block mb-2" htmlFor="phone">
                Telefone
              </label>
              <div className="flex items-center border-b border-outline-variant">
                <span className="material-symbols-outlined text-outline text-[16px] mr-2">phone_android</span>
                <input 
                  id="phone" 
                  type="tel" 
                  value={phone}
                  readOnly
                  className="w-full border-0 bg-transparent px-0 py-2 focus:ring-0 text-[16px] text-secondary cursor-not-allowed outline-none"
                />
                <span className="material-symbols-outlined text-[#e8b4b8] text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>
            </div>

            <div className="relative">
              <label className="font-semibold text-[14px] tracking-widest text-on-surface-variant block mb-2" htmlFor="password">
                Crie uma Senha
              </label>
              <input 
                id="password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Mínimo 6 caracteres"
                className="w-full border-0 border-b border-outline-variant bg-transparent px-0 py-2 focus:ring-0 focus:border-primary transition-colors text-[16px] text-on-surface placeholder:text-outline-variant outline-none"
              />
            </div>
            
            <div className="mt-auto pt-[24px]">
              <button 
                type="submit" 
                disabled={loading || password.length < 6 || name.length < 3}
                className="w-full py-4 bg-primary text-on-primary font-semibold text-[14px] rounded-full shadow-lg active:scale-95 transition-transform duration-150 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>{loading ? 'Processando...' : 'Finalizar Cadastro'}</span>
                {!loading && <span className="material-symbols-outlined">check_circle</span>}
              </button>
              <p className="mt-4 text-center text-[12px] font-medium text-on-surface-variant px-[16px]">
                  Ao finalizar, você concorda com nossos termos de privacidade e serviço de luxo.
              </p>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default CadastroCliente;

