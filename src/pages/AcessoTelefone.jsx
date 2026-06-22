import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTenant } from '../context/TenantContext';
import { supabase } from '../lib/supabase';

const AcessoTelefone = () => {
  const { tenant_slug } = useParams();
  const navigate = useNavigate();
  const { tenant } = useTenant();
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatPhone = (value) => {
    let v = value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    
    if (v.length > 10) {
        v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    } else if (v.length > 6) {
        v = `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;
    } else if (v.length > 2) {
        v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    } else if (v.length > 0) {
        v = `(${v}`;
    }
    return v;
  };

  const handlePhoneChange = (e) => {
    setPhone(formatPhone(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tenant) {
      setError("Salão não configurado ou inativo. Contate o administrador.");
      return;
    }
    
    if (phone.length < 14) return;
    
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('cap_clients')
        .select('id')
        .eq('tenant_id', tenant.id)
        .eq('phone', phone)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        navigate(`/${tenant_slug}/acesso-senha`, { state: { phone } });
      } else {
        navigate(`/${tenant_slug}/cadastro`, { state: { phone } });
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao verificar telefone. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-body-md text-on-surface bg-[#f9f9f9]">
      <main className="flex-grow flex flex-col items-center px-[20px] pt-[40px] pb-[24px] overflow-hidden relative">
        <div className="absolute top-0 right-0 -z-10 w-64 h-64 bg-primary-fixed opacity-20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 -z-10 w-72 h-72 bg-secondary-container opacity-30 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3"></div>
        
        <div className="w-full max-w-[448px] flex flex-col items-center text-center animate-fade-in-up">
          <header className="mb-[40px]">
            <div className="flex flex-col items-center gap-[4px]">
              <span className="material-symbols-outlined text-primary text-[48px] mb-[4px]" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
              <h1 className="font-headline-md text-[28px] leading-[1.2] font-semibold text-primary tracking-tight">{tenant?.name || 'Serene Beauty'}</h1>
            </div>
          </header>

          <div className="w-full mb-[24px]">
            <img 
              className="w-full aspect-[4/3] object-cover rounded-xl shadow-lg mb-[24px]" 
              alt="Beauty Spa environment" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0lmx1ogRGahvge5467Oei_h2Ymvaj_nE7LBksQ8zKBZy0rlQg_rfa6SOC8RbIhbh5bqY7VRaB3PlKXh3oHdk-vLRIdIBC9tTYSN0mt2FDGD9tLCTGxRj8RK4hcMzAwsv19gSq879TjByzaP7jecxaIvxjrO_m3K3nQ9ZmgHq7j2DxuhOid1LGOskqBU3DEJJ_WT0s3p_SwEmhdALdH0NusT4EVHaezcWZoqtHnuAZ3EoJB0sFrT5nvlV4NCx3OK6JCGnKAK3R4Z42"
            />
          </div>

          <section className="w-full space-y-[16px]">
            <div className="space-y-[4px]">
              <h2 className="font-serif text-[28px] leading-[1.2] font-semibold text-on-surface">Bem-vindo ao {tenant?.name || 'Serene Beauty'}</h2>
              <p className="text-on-surface-variant font-body-md text-[16px]">Sua jornada de autocuidado e luxo começa aqui.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-[24px] pt-[16px]">
              {error && (
                <p className="text-error text-sm">{error}</p>
              )}
              
              <div className="relative group text-left">
                <label 
                  className="absolute -top-3 left-4 px-1 bg-[#f9f9f9] text-[12px] font-medium text-outline group-focus-within:text-primary transition-colors z-10" 
                  htmlFor="phone"
                >
                  Digite seu telefone
                </label>
                <input 
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  required
                  placeholder="(00) 00000-0000"
                  className="w-full px-[24px] py-[16px] bg-transparent border border-outline-variant rounded-xl text-[16px] focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading || phone.length < 14}
                className="w-full py-[16px] bg-primary text-on-primary font-semibold text-[14px] rounded-xl shadow-md active:scale-95 transition-transform duration-150 flex items-center justify-center gap-[8px] disabled:opacity-50"
              >
                {loading ? 'Processando...' : 'Próximo'}
                {!loading && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
              </button>
            </form>

            <div className="pt-[24px] flex items-center justify-center gap-[4px]">
              <div className="h-[1px] w-8 bg-outline-variant"></div>
              <p className="text-[12px] font-medium text-outline-variant uppercase tracking-widest">Acesso Cliente</p>
              <div className="h-[1px] w-8 bg-outline-variant"></div>
            </div>
          </section>
        </div>
      </main>

      <footer className="p-[24px] text-center mt-auto">
        <p className="text-[12px] font-medium text-on-surface-variant/60">
            © {new Date().getFullYear()} {tenant?.name || 'Serene Beauty'}. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
};

export default AcessoTelefone;
