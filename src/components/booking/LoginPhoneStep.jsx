import React from 'react';
import { Crown, Loader2, Phone, ArrowRight, Sparkles } from 'lucide-react';

const LoginPhoneStep = ({ 
  phone, 
  setPhone, 
  handleIdentify, 
  loading, 
  branding 
}) => {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center px-6 py-12 animate-in fade-in zoom-in duration-700">
      
      {/* Premium Glassmorphism Card */}
      <div className="w-full max-w-[448px] bg-white/70 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] p-8 relative overflow-hidden">
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-3xl -mr-10 -mt-10" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-slate-900/5 rounded-full blur-2xl -ml-8 -mb-8" />

        <div className="relative z-10">
          <div className="text-center space-y-6 mb-10">
            <div className="w-20 h-20 bg-gradient-to-br from-accent/20 to-accent/5 text-accent rounded-[2rem] flex items-center justify-center mx-auto shadow-inner border border-accent/10">
              <Crown size={36} strokeWidth={1.5} />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-serif text-slate-900 tracking-tight leading-tight">
                Bem-vindo(a) ao <br/> 
                <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-accent">
                  {branding?.salonName || 'OperaBeauty'}
                </span>
              </h2>
              <p className="text-slate-500 font-medium text-sm flex items-center justify-center gap-1.5">
                <Sparkles size={14} className="text-accent/60" />
                Sua jornada de beleza começa aqui
              </p>
            </div>
          </div>

          <form onSubmit={handleIdentify} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-2 block">
                Seu número de celular
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-accent transition-colors">
                  <Phone size={20} />
                </div>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="(11) 99999-9999" 
                  className="w-full bg-white/80 border border-slate-200/80 py-5 pl-14 pr-6 rounded-[1.5rem] text-lg font-semibold text-slate-800 placeholder:text-slate-300 shadow-sm outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent transition-all" 
                />
              </div>
            </div>
            
            <button 
              type="submit"
              disabled={loading || phone.length < 10} 
              className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-bold text-base shadow-[0_10px_20px_rgb(0,0,0,0.1)] hover:shadow-[0_10px_20px_rgb(0,0,0,0.15)] hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:translate-y-0"
            > 
              {loading ? (
                <Loader2 className="animate-spin" size={22} />
              ) : (
                <>
                  Continuar
                  <ArrowRight size={18} />
                </>
              )} 
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">
              Ao continuar, você concorda com nossos termos de serviço.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPhoneStep;

