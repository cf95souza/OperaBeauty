import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTenant } from '../context/TenantContext';
import { supabase } from '../lib/supabase';

const AcessoProfissional = () => {
  const { tenant_slug } = useParams();
  const navigate = useNavigate();
  const { tenant, loginStaff } = useTenant();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Remover formatação do telefone, se houver
      const cleanPhone = phone.replace(/\D/g, '');

      const data = await loginStaff(cleanPhone, password);

      if (data) {
        // Direcionar de acordo com a role
        if (data.role === 'manager') {
          navigate(`/${tenant_slug}/staff/admin/dashboard`);
        } else {
          navigate(`/${tenant_slug}/staff/agenda-profissional`);
        }
      } else {
        setError('Telefone ou senha inválidos.');
      }
    } catch (err) {
      console.error(err);
      setError('Erro ao processar login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex items-center justify-center p-gutter md:p-0">
      <div className="w-full max-w-[1024px] flex flex-col md:flex-row bg-surface-container-lowest rounded-xl md:rounded-3xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] overflow-hidden min-h-[600px]">
        
        {/* Image Section (Desktop Only) */}
        <div className="hidden md:block md:w-1/2 relative bg-surface-container">
          <img 
            alt="Spa interior" 
            className="absolute inset-0 w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUPnRMkAaP3fjFFG7IFw7QHsrroWNFmOBHMWnmyvvawxSViimXi_cId57WtKtxA1ep3z4Oy93rQEh0_zsXt6FMJZcfD6Qy6NZj2NAYzkt62X2YFxdtBBq_ZFMgKQrgxb9SHAeml_fAHc0qBmx0MTSNwJUiBY8r8XZqDuSDh-MpbJjZ8HI1jCpq2QuBu050ww5wR4QOFhXraGlIBhv0s9s2FW2hI_29CJkbjB0qJ88ltzYBG_J-oDb8oZYU8TW8RqABnZTytdvOUjuA"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-xl left-xl right-xl text-white">
            <span className="font-headline-md text-headline-md block mb-sm">{tenant?.name || 'Radiant Salon'}</span>
            <p className="font-body-md text-body-md opacity-90">Gestão e excelência para nossa equipe.</p>
          </div>
        </div>

        {/* Login Form Section */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-lg py-xl md:px-xl">
          <div className="w-full max-w-[384px] mx-auto">
            
            {/* Mobile Brand (Hidden on Desktop) */}
            <div className="md:hidden mb-xl text-center">
              <span className="font-headline-md text-headline-md text-primary">{tenant?.name || 'Radiant Salon'}</span>
            </div>
            
            <div className="mb-xl">
              <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-sm">
                Acesso Equipe
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Bem-vindo(a) de volta. Insira suas credenciais para acessar o painel.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-lg flex flex-col">
              
              {error && (
                <div className="p-sm mb-4 bg-error-container text-on-error-container rounded-md text-sm text-center">
                  {error}
                </div>
              )}

              {/* Phone Input */}
              <div className="relative group">
                <label 
                  className="font-label-sm text-label-sm text-on-surface-variant block mb-base transition-colors group-focus-within:text-primary" 
                  htmlFor="phone"
                >
                  Telefone
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-0 text-on-surface-variant group-focus-within:text-primary transition-colors">
                    phone_iphone
                  </span>
                  <input 
                    className="w-full bg-transparent border-0 border-b border-outline-variant py-sm pl-[32px] font-body-md text-body-md text-on-surface placeholder:text-outline focus:ring-0 focus:border-primary transition-colors outline-none" 
                    id="phone" 
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="relative group">
                <label 
                  className="font-label-sm text-label-sm text-on-surface-variant block mb-base transition-colors group-focus-within:text-primary" 
                  htmlFor="password"
                >
                  Senha
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-0 text-on-surface-variant group-focus-within:text-primary transition-colors">
                    lock
                  </span>
                  <input 
                    className="w-full bg-transparent border-0 border-b border-outline-variant py-sm pl-[32px] pr-[32px] font-body-md text-body-md text-on-surface placeholder:text-outline focus:ring-0 focus:border-primary transition-colors outline-none" 
                    id="password" 
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button 
                    type="button"
                    className="absolute right-0 text-on-surface-variant hover:text-on-surface transition-colors focus:outline-none"
                  >
                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                  </button>
                </div>
              </div>

              {/* Actions Row */}
              <div className="flex items-center justify-between pt-sm">
                <label className="flex items-center gap-sm cursor-pointer group">
                  <input className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20 transition-all cursor-pointer" type="checkbox" />
                  <span className="font-label-md text-label-md text-on-surface-variant group-hover:text-on-surface transition-colors">Lembrar-me</span>
                </label>
                <a className="font-label-sm text-label-sm text-primary hover:text-on-primary-fixed-variant transition-colors hover:underline cursor-pointer">
                  Esqueci minha senha
                </a>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                disabled={loading}
                className="w-full mt-lg bg-primary text-on-primary py-md px-lg rounded-lg font-label-md text-label-md flex items-center justify-center gap-sm hover:bg-on-primary-fixed-variant active:scale-[0.98] transition-all shadow-sm disabled:opacity-70" 
              >
                <span>{loading ? 'Entrando...' : 'Entrar'}</span>
                {!loading && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
              </button>

            </form>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default AcessoProfissional;
