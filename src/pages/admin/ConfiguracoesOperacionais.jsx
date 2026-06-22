import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import { supabase } from '../../lib/supabase';
import { format, parseISO } from 'date-fns';

const DAYS_OF_WEEK = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Segunda-feira' },
  { value: 2, label: 'Terça-feira' },
  { value: 3, label: 'Quarta-feira' },
  { value: 4, label: 'Quinta-feira' },
  { value: 5, label: 'Sexta-feira' },
  { value: 6, label: 'Sábado' },
];

const ConfiguracoesOperacionais = () => {
  const { tenant_slug } = useParams();
  const { tenant } = useTenant();

  const [businessHours, setBusinessHours] = useState([]);
  const [exceptions, setExceptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Modal Exception State
  const [showExceptionModal, setShowExceptionModal] = useState(false);
  const [newException, setNewException] = useState({ date: '', is_closed: true, open_time: '09:00', close_time: '18:00', reason: '' });

  // Coupon State
  const [coupons, setCoupons] = useState([]);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [newCoupon, setNewCoupon] = useState({ code: '', discount_type: 'percentage', discount_value: 10, max_uses: '', expires_at: '' });

  useEffect(() => {
    if (tenant?.id) {
      fetchData();
    }
  }, [tenant]);

  const fetchData = async () => {
    setLoading(true);
    // Fetch Business Hours
    const { data: hoursData } = await supabase
      .from('cap_business_hours')
      .select('*')
      .eq('tenant_id', tenant.id);
      
    // Initialize defaults if missing
    let loadedHours = [...(hoursData || [])];
    const missingDays = DAYS_OF_WEEK.filter(d => !loadedHours.some(h => h.day_of_week === d.value));
    
    missingDays.forEach(d => {
      loadedHours.push({
        day_of_week: d.value,
        open_time: '09:00',
        close_time: '18:00',
        is_closed: d.value === 0 // default sunday closed
      });
    });

    loadedHours.sort((a, b) => a.day_of_week - b.day_of_week);
    setBusinessHours(loadedHours);

    // Fetch Exceptions
    const { data: exceptionsData } = await supabase
      .from('cap_date_exceptions')
      .select('*')
      .eq('tenant_id', tenant.id)
      .order('exception_date', { ascending: true });
      
    setExceptions(exceptionsData || []);
    
    // Fetch Coupons
    const { data: couponsData } = await supabase
      .from('cap_coupons')
      .select('*')
      .eq('tenant_id', tenant.id)
      .order('created_at', { ascending: false });
      
    setCoupons(couponsData || []);
    
    setLoading(false);
  };

  const handleHourChange = (dayOfWeek, field, value) => {
    setBusinessHours(prev => prev.map(h => {
      if (h.day_of_week === dayOfWeek) {
        return { ...h, [field]: value };
      }
      return h;
    }));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      // Upsert Business Hours
      const toUpsert = businessHours.map(h => {
        const { id, ...rest } = h; // remove local ID se for insercao (embora supabase entenda se existir)
        return {
          ...rest,
          tenant_id: tenant.id
        };
      });
      await supabase.from('cap_business_hours').upsert(toUpsert, { onConflict: 'tenant_id,day_of_week' });
      alert('Configurações salvas com sucesso!');
      fetchData();
    } catch (e) {
      console.error(e);
      alert('Erro ao salvar as configurações.');
    }
    setSaving(false);
  };

  const handleAddException = async () => {
    if (!newException.date) {
      alert("Por favor selecione a data."); return;
    }
    
    const toInsert = {
      tenant_id: tenant.id,
      exception_date: newException.date,
      is_closed: newException.is_closed,
      open_time: newException.is_closed ? null : newException.open_time,
      close_time: newException.is_closed ? null : newException.close_time,
      reason: newException.reason
    };

    const { error } = await supabase.from('cap_date_exceptions').insert([toInsert]);
    if (error) {
      console.error(error);
      alert('Erro ao adicionar exceção: ' + error.message);
    } else {
      setShowExceptionModal(false);
      setNewException({ date: '', is_closed: true, open_time: '09:00', close_time: '18:00', reason: '' });
      fetchData(); // refresh
    }
  };

  const handleDeleteException = async (id) => {
    if(confirm('Deseja remover esta exceção?')) {
      await supabase.from('cap_date_exceptions').delete().eq('id', id);
      fetchData();
    }
  };

  const handleAddCoupon = async () => {
    if (!newCoupon.code || !newCoupon.discount_value) {
      alert("Preencha o código e o valor do desconto."); return;
    }
    
    const toInsert = {
      tenant_id: tenant.id,
      code: newCoupon.code.toUpperCase().replace(/\s+/g, ''),
      discount_type: newCoupon.discount_type,
      discount_value: parseFloat(newCoupon.discount_value),
      max_uses: newCoupon.max_uses ? parseInt(newCoupon.max_uses) : null,
      expires_at: newCoupon.expires_at ? new Date(newCoupon.expires_at + 'T23:59:59').toISOString() : null
    };

    const { error } = await supabase.from('cap_coupons').insert([toInsert]);
    if (error) {
      console.error(error);
      alert('Erro ao adicionar cupom: ' + error.message);
    } else {
      setShowCouponModal(false);
      setNewCoupon({ code: '', discount_type: 'percentage', discount_value: 10, max_uses: '', expires_at: '' });
      fetchData(); // refresh
    }
  };

  const handleDeleteCoupon = async (id) => {
    if(confirm('Deseja inativar/remover este cupom?')) {
      await supabase.from('cap_coupons').delete().eq('id', id);
      fetchData();
    }
  };

  if (loading) return <div className="p-xl flex justify-center text-secondary">Carregando horários...</div>;

  return (
    <>
      <div className="flex-1 p-container-margin md:p-xl max-w-[1200px] w-full mx-auto pb-32 md:pb-xl animate-fade-in-up">
        <div className="mb-xl flex justify-between items-end">
          <div>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-sm">Configurações Operacionais</h1>
            <p className="font-body-md text-body-md text-secondary">Gerencie horários, dias de funcionamento e exceções/bloqueios.</p>
          </div>
          <button onClick={handleSaveAll} disabled={saving} className="hidden md:flex bg-primary text-on-primary font-label-md text-label-md px-lg py-sm rounded-lg items-center gap-sm hover:bg-on-primary-container transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[18px]">save</span>
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
          {/* Bento Grid Section: Working Hours */}
          <section className="lg:col-span-8 space-y-md">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-md flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary">schedule</span>
              Jornada de Funcionamento (Padrão)
            </h2>
            <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] p-lg flex flex-col gap-md">
              
              {DAYS_OF_WEEK.map((day) => {
                const dayData = businessHours.find(h => h.day_of_week === day.value) || {};
                const isOpen = !dayData.is_closed;
                return (
                  <div key={day.value} className="flex flex-col sm:flex-row sm:items-center justify-between py-sm border-b border-surface-variant gap-sm">
                    <div className="flex items-center justify-between sm:w-48">
                      <span className={`font-label-md text-label-md ${isOpen ? 'text-on-surface' : 'text-secondary'}`}>{day.label}</span>
                      <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input 
                          checked={isOpen}
                          onChange={(e) => handleHourChange(day.value, 'is_closed', !e.target.checked)}
                          className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer" 
                          id={`toggle-${day.value}`} 
                          name={`toggle-${day.value}`} 
                          type="checkbox"
                        />
                        <label className="toggle-label block overflow-hidden h-5 rounded-full bg-surface-variant cursor-pointer" htmlFor={`toggle-${day.value}`}></label>
                      </div>
                    </div>
                    <div className={`flex items-center gap-sm transition-opacity ${isOpen ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                      <input 
                        value={dayData.open_time?.substring(0, 5) || '09:00'}
                        onChange={(e) => handleHourChange(day.value, 'open_time', e.target.value)}
                        disabled={!isOpen}
                        className="bg-transparent border-b border-outline-variant focus:border-primary text-body-md font-body-md text-on-surface pb-1 outline-none w-24 text-center" 
                        type="time" 
                      />
                      <span className="text-secondary font-body-md text-body-md">às</span>
                      <input 
                        value={dayData.close_time?.substring(0, 5) || '18:00'}
                        onChange={(e) => handleHourChange(day.value, 'close_time', e.target.value)}
                        disabled={!isOpen}
                        className="bg-transparent border-b border-outline-variant focus:border-primary text-body-md font-body-md text-on-surface pb-1 outline-none w-24 text-center" 
                        type="time" 
                      />
                    </div>
                  </div>
                )
              })}
              
            </div>
          </section>
          
          {/* Sidebar Info/Settings */}
          <section className="lg:col-span-4 space-y-xl">
            <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] p-lg">
              <h3 className="font-headline-md text-[20px] text-on-surface mb-md flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary text-[20px]">calendar_add_on</span>
                Exceções de Horário
              </h3>
              <p className="font-body-md text-body-md text-secondary mb-md">Adicione datas de recesso, feriados ou dias com horário especial (ex: aberturas em domingos excepcionais).</p>
              
              <div className="space-y-sm mb-md max-h-[300px] overflow-y-auto">
                {exceptions.map(exc => (
                  <div key={exc.id} className="flex justify-between items-center bg-surface p-sm rounded-lg border border-surface-variant">
                    <div>
                      <p className="font-label-md text-label-md text-on-surface">{exc.reason || 'Sem motivo'}</p>
                      <p className="font-body-sm text-[12px] text-secondary">
                        {format(parseISO(exc.exception_date), 'dd/MM/yyyy')} 
                        {exc.is_closed ? ' - Fechado' : ` - das ${exc.open_time?.substring(0, 5)} às ${exc.close_time?.substring(0, 5)}`}
                      </p>
                    </div>
                    <button onClick={() => handleDeleteException(exc.id)} className="text-outline hover:text-error transition-colors">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                ))}
                {exceptions.length === 0 && (
                  <p className="text-body-sm text-secondary italic">Nenhuma exceção cadastrada.</p>
                )}
              </div>
              
              <button onClick={() => setShowExceptionModal(true)} className="w-full border border-primary text-primary font-label-md text-label-md py-sm rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors flex items-center justify-center gap-xs">
                <span className="material-symbols-outlined text-[18px]">add</span> Nova Exceção
              </button>
            </div>
            
            {/* Coupons Section */}
            <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] p-lg">
              <h3 className="font-headline-md text-[20px] text-on-surface mb-md flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary text-[20px]">local_activity</span>
                Cupons de Desconto
              </h3>
              
              <div className="space-y-sm mb-md max-h-[300px] overflow-y-auto">
                {coupons.map(coupon => (
                  <div key={coupon.id} className="flex justify-between items-center bg-surface p-sm rounded-lg border border-surface-variant">
                    <div>
                      <p className="font-label-md text-label-md text-on-surface font-mono">{coupon.code}</p>
                      <p className="font-body-sm text-[12px] text-secondary">
                        {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `R$ ${coupon.discount_value.toFixed(2)}`}
                        {coupon.max_uses ? ` • ${coupon.current_uses}/${coupon.max_uses} usos` : ` • Usado ${coupon.current_uses}x`}
                        {coupon.expires_at && ` • Válido até ${format(parseISO(coupon.expires_at), 'dd/MM/yyyy')}`}
                      </p>
                    </div>
                    <button onClick={() => handleDeleteCoupon(coupon.id)} className="text-outline hover:text-error transition-colors">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                ))}
                {coupons.length === 0 && (
                  <p className="text-body-sm text-secondary italic">Nenhum cupom ativo.</p>
                )}
              </div>
              
              <button onClick={() => setShowCouponModal(true)} className="w-full border border-primary text-primary font-label-md text-label-md py-sm rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors flex items-center justify-center gap-xs">
                <span className="material-symbols-outlined text-[18px]">add</span> Novo Cupom
              </button>
            </div>
            
            <div className="bg-primary-container rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] p-lg">
              <h3 className="font-headline-md text-[20px] text-on-primary-container mb-sm flex items-center gap-sm">
                <span className="material-symbols-outlined text-on-primary-container text-[20px]">info</span>
                Aviso
              </h3>
              <p className="font-body-md text-body-md text-on-primary-container opacity-90">
                Alterações na jornada afetam a disponibilidade de todos os profissionais. Agendamentos existentes fora dos novos horários ou nas exceções exigirão reagendamento manual.
              </p>
            </div>
          </section>
        </div>

        {/* Mobile Save FAB */}
        <button onClick={handleSaveAll} disabled={saving} className="md:hidden fixed bottom-6 right-4 bg-primary text-on-primary rounded-full p-md shadow-[0px_10px_30px_rgba(0,0,0,0.08)] flex items-center justify-center hover:scale-105 transition-transform z-40">
          <span className="material-symbols-outlined text-[24px]">save</span>
        </button>
      </div>

      {showExceptionModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-[500px] flex flex-col p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold mb-4 text-slate-900">Adicionar Exceção de Data</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Motivo / Título</label>
                <input 
                  type="text" 
                  value={newException.reason}
                  onChange={(e) => setNewException({...newException, reason: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                  placeholder="Ex: Feriado Nacional, Evento..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Data</label>
                <input 
                  type="date" 
                  value={newException.date}
                  onChange={(e) => setNewException({...newException, date: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                />
              </div>
              <div className="flex items-center gap-2 mt-4 mb-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <input 
                  type="checkbox" 
                  id="exc-closed"
                  checked={newException.is_closed}
                  onChange={(e) => setNewException({...newException, is_closed: e.target.checked})}
                  className="w-4 h-4 text-accent border-slate-300 rounded focus:ring-accent"
                />
                <label htmlFor="exc-closed" className="text-sm font-bold text-slate-700 cursor-pointer">Dia Inteiro Fechado?</label>
              </div>
              {!newException.is_closed && (
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-slate-700 mb-1">Abertura</label>
                    <input 
                      type="time" 
                      value={newException.open_time}
                      onChange={(e) => setNewException({...newException, open_time: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-bold text-slate-700 mb-1">Fechamento</label>
                    <input 
                      type="time" 
                      value={newException.close_time}
                      onChange={(e) => setNewException({...newException, close_time: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button onClick={() => setShowExceptionModal(false)} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">Cancelar</button>
              <button onClick={handleAddException} className="px-6 py-2.5 text-sm font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">Adicionar</button>
            </div>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-[400px] flex flex-col p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold mb-4 text-slate-900">Novo Cupom</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Código do Cupom</label>
                <input 
                  type="text" 
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none font-mono uppercase"
                  placeholder="EX: VERAO20"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Tipo de Desconto</label>
                  <select
                    value={newCoupon.discount_type}
                    onChange={(e) => setNewCoupon({...newCoupon, discount_type: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                  >
                    <option value="percentage">Porcentagem (%)</option>
                    <option value="fixed">Valor Fixo (R$)</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Valor</label>
                  <input 
                    type="number" 
                    value={newCoupon.discount_value}
                    onChange={(e) => setNewCoupon({...newCoupon, discount_value: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Máximo de Usos</label>
                  <input 
                    type="number" 
                    value={newCoupon.max_uses}
                    onChange={(e) => setNewCoupon({...newCoupon, max_uses: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                    placeholder="Ilimitado"
                    min="1"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-bold text-slate-700 mb-1">Válido Até</label>
                  <input 
                    type="date" 
                    value={newCoupon.expires_at}
                    onChange={(e) => setNewCoupon({...newCoupon, expires_at: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm focus:border-accent focus:ring-1 focus:ring-accent outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button onClick={() => setShowCouponModal(false)} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">Cancelar</button>
              <button onClick={handleAddCoupon} className="px-6 py-2.5 text-sm font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">Criar Cupom</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .toggle-checkbox:checked { right: 0; border-color: var(--color-primary); }
        .toggle-checkbox:checked + .toggle-label { background-color: var(--color-primary-container); }
        .toggle-checkbox:checked + .toggle-label:after { transform: translateX(100%); border-color: white; }
      `}</style>
    </>
  );
};

export default ConfiguracoesOperacionais;
