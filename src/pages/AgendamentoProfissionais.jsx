import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTenant } from '../context/TenantContext';
import { useBooking } from '../context/BookingContext';
import { supabase } from '../lib/supabase';

const AgendamentoProfissionais = () => {
  const { tenant_slug } = useParams();
  const navigate = useNavigate();
  const { tenant } = useTenant();
  const { bookingData, updateBooking } = useBooking();
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [dbStaff, setDbStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tenant) return;
    const fetchStaff = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('cap_staff')
        .select('*')
        .eq('tenant_id', tenant.id)
        .eq('is_active', true)
        .order('name');
      
      if (!error && data) {
        setDbStaff(data);
      }
      setLoading(false);
    };
    fetchStaff();
  }, [tenant]);

  // Filtros desativados, exibindo todos da base real
  const categories = ['Todos'];
  const filteredStaff = dbStaff;

  const handleSelectStaff = (staff) => {
    updateBooking('professional', staff);
    navigate(`/${tenant_slug}/agendar/horarios`);
  };

  const handleAnyStaff = () => {
    updateBooking('professional', null);
    navigate(`/${tenant_slug}/agendar/horarios`);
  };

  return (
    <div className="font-body-md text-on-background bg-[#f9f9f9] min-h-screen pb-[120px]">
      <header className="w-full top-0 sticky z-40 bg-surface dark:bg-surface-dim shadow-sm flex justify-between items-center px-[16px] py-[8px] max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-primary hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline-md text-[24px] md:text-[28px] font-semibold text-primary tracking-tight">
            {tenant?.name || 'Ethereal Grace'}
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-[16px] py-[40px]">
        <div className="mb-[40px] text-center md:text-left animate-fade-in-up">
          <h2 className="font-serif text-[28px] md:text-[32px] font-semibold text-on-surface mb-2">Escolha o Profissional</h2>
          <p className="font-sans text-[16px] text-secondary">Selecione o especialista ideal para o seu momento de cuidado.</p>
        </div>

        {/* Sem preferência button */}
        <div className="mb-[24px] flex justify-center md:justify-start">
            <button 
              onClick={handleAnyStaff}
              className="bg-white border-2 border-primary text-primary px-[24px] py-[12px] rounded-xl font-semibold shadow-sm hover:bg-primary hover:text-white transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined">groups</span>
              Sem preferência de profissional
            </button>
        </div>

        <div className="flex gap-[8px] overflow-x-auto pb-[24px] no-scrollbar">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-none px-6 py-2 rounded-full font-semibold text-[14px] transition-all duration-300 shadow-sm ${
                activeCategory === cat 
                  ? 'bg-primary text-on-primary' 
                  : 'bg-[#e8b4b8]/30 text-[#6b4448] hover:bg-[#e8b4b8]/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
          {loading ? (
             <div className="col-span-3 text-center py-10"><span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span></div>
          ) : filteredStaff.length === 0 ? (
             <div className="col-span-3 text-center py-10 text-secondary">Nenhum profissional cadastrado no momento.</div>
          ) : (
            filteredStaff.map(staff => (
              <div 
                key={staff.id}
                onClick={() => handleSelectStaff(staff)}
                className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-48 bg-surface-variant overflow-hidden flex items-center justify-center">
                  <span className="material-symbols-outlined text-[80px] text-on-surface-variant opacity-50 group-hover:scale-110 transition-transform duration-700">person</span>
                </div>
                <div className="p-[24px]">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-serif text-[24px] font-semibold text-on-surface">{staff.name}</h3>
                    <span className="text-primary material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  </div>
                  <p className="font-semibold text-[14px] text-secondary mb-[16px]">{staff.role === 'manager' ? 'Especialista Sênior' : 'Profissional'}</p>
                  <div className="flex items-center justify-between mt-[16px] pt-[16px] border-t border-[#d4c2c3]/30">
                    <button className="w-full bg-primary text-white px-[24px] py-[8px] rounded-full font-semibold text-[14px] hover:opacity-90 transition-colors">
                      Selecionar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default AgendamentoProfissionais;
