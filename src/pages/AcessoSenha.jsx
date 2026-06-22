import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useTenant } from '../context/TenantContext';
import { supabase } from '../lib/supabase';

const AcessoSenha = () => {
  const { tenant_slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { tenant, loginClient } = useTenant();
  
  const [phone, setPhone] = useState(location.state?.phone || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      const data = await loginClient(phone, password);
      
      if (data) {
        navigate(`/${tenant_slug}/home`); 
      } else {
        setError('Senha incorreta.');
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao realizar login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface font-body-md text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col bg-[#f9f9f9]">
      <header className="w-full top-0 sticky z-40 bg-surface flex items-center justify-between px-[20px] py-[16px]">
        <button 
          onClick={() => navigate(-1)}
          aria-label="Voltar" 
          className="hover:opacity-80 transition-opacity active:scale-95 duration-150 text-primary"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-headline-md text-[24px] leading-[1.3] font-semibold text-primary tracking-tight">
          {tenant?.name || 'Serene Beauty'}
        </h1>
        <div className="w-6"></div>
      </header>

      <main className="flex-grow flex flex-col items-center px-[20px] pt-[40px] pb-[24px]">
        <div className="relative w-full max-w-[448px] aspect-[4/3] rounded-xl overflow-hidden mb-[40px] shadow-lg">
          <img 
            alt="Spa Interior" 
            className="w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAX9lBuc4OUxQunjttUlB9g9uJlLw-UiNGP7l30r2RuUjBdqmIwQ_B8lv1-O_lQ184F3oBJvehMv-jao-ePyTZjj7eqt9IBY3LdJdvRbwF_muMRFnF_KGptD8x62jKcnQCP3gjRt6gGUc-hrcHZNG7gZibsTqz2F1EEBcrcOoyyvScLNX3-jZfhWgUgv8-i2GrAdIX_qMtPQHDxarxDM8SwFrR5qQe7TEGfIA5v7ImpmGlT1AYAOOmUFjVk3qqmFSpLDYMqRXqhyF5D"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#f9f9f9] to-70%"></div>
        </div>

        <div className="w-full max-w-[448px] animate-fade-in-up">
          <div className="text-left mb-[24px]">
            <p className="font-semibold text-[14px] text-secondary mb-[4px]">{phone}</p>
            <h2 className="font-serif text-[28px] leading-[1.2] font-semibold text-on-surface mb-[8px]">
              Olá! Digite sua senha para continuar
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-[24px]">
            {error && <p className="text-error text-sm">{error}</p>}
            
            <div className="relative">
              <label className="block font-medium text-[12px] text-outline mb-[4px]" htmlFor="password">
                Senha
              </label>
              <div className="relative">
                <input 
                  id="password" 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••" 
                  className="w-full bg-transparent border-b-2 border-outline-variant focus:border-primary focus:ring-0 transition-colors py-[16px] text-[18px] text-on-surface placeholder:text-outline-variant outline-none"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors focus:outline-none"
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-[16px] pt-[16px]">
              <button 
                type="submit" 
                disabled={loading || password.length < 3}
                className="w-full py-[24px] bg-primary text-on-primary font-semibold text-[14px] rounded-xl shadow-lg hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {loading && <span className="material-symbols-outlined animate-spin">progress_activity</span>}
                {!loading && <span>Entrar</span>}
              </button>
              <button 
                type="button" 
                className="text-center font-semibold text-[14px] text-primary hover:underline decoration-2 underline-offset-4 transition-all"
              >
                Esqueci minha senha
              </button>
            </div>
          </form>
        </div>

        <div className="mt-auto pt-[40px] opacity-20">
          <span className="material-symbols-outlined text-[64px] text-primary">spa</span>
        </div>
      </main>
    </div>
  );
};

export default AcessoSenha;

