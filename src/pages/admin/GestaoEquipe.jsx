import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import { supabase } from '../../lib/supabase';

const GestaoEquipe = () => {
  const { tenant_slug } = useParams();
  const { tenant } = useTenant();

  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({ name: '', phone: '', password: '', role: 'professional', is_active: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!tenant) return;
    fetchStaff();
  }, [tenant]);

  const fetchStaff = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('cap_staff')
      .select('*')
      .eq('tenant_id', tenant.id)
      .order('name');
    
    if (!error && data) {
      setStaffList(data);
    }
    setLoading(false);
  };

  const openNewModal = () => {
    setEditingStaff(null);
    setFormData({ name: '', phone: '', password: '', role: 'professional', is_active: true });
    setShowModal(true);
  };

  const openEditModal = (staff) => {
    setEditingStaff(staff);
    setFormData({ 
      name: staff.name, 
      phone: staff.phone, 
      password: '', // Senha vazia a menos que o gestor queira alterar
      role: staff.role, 
      is_active: staff.is_active 
    });
    setShowModal(true);
  };

  const handleSaveStaff = async (e) => {
    e.preventDefault();
    if (!tenant) return;
    setSaving(true);
    try {
      const cleanPhone = formData.phone.replace(/\D/g, '');
      
      if (editingStaff) {
        // Update
        const { error } = await supabase.rpc('cap_update_staff', {
          p_staff_id: editingStaff.id,
          p_tenant_id: tenant.id,
          p_name: formData.name,
          p_phone: cleanPhone,
          p_password: formData.password || null,
          p_role: formData.role,
          p_is_active: formData.is_active
        });
        if (error) throw error;
        alert('Profissional atualizado com sucesso!');
      } else {
        // Create
        if (!formData.password) {
            alert('A senha é obrigatória para cadastrar.');
            setSaving(false);
            return;
        }
        const { error } = await supabase.rpc('cap_register_staff', {
          p_tenant_id: tenant.id,
          p_name: formData.name,
          p_phone: cleanPhone,
          p_password: formData.password,
          p_role: formData.role
        });
        if (error) throw error;
        alert('Profissional cadastrado com sucesso!');
      }

      setShowModal(false);
      fetchStaff();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar profissional. Verifique os dados ou se o telefone já existe.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
        {/* Page Content */}
        <div className="p-gutter md:p-xl flex-1 flex flex-col gap-lg max-w-[1200px] mx-auto w-full animate-fade-in-up">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
            <div>
              <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background">Gestão de Equipe</h2>
              <p className="font-body-md text-body-md text-secondary mt-1">Gerencie profissionais, desempenho e comissões.</p>
            </div>
            <button 
              onClick={openNewModal}
              className="flex items-center gap-sm bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md text-label-md hover:bg-on-primary-fixed-variant transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              Novo Profissional
            </button>
          </div>

          {/* Modal for New/Edit Staff */}
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="bg-surface w-[90vw] max-w-[450px] rounded-xl shadow-xl p-md md:p-lg relative animate-fade-in-up">
                <button 
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 text-secondary hover:text-error transition-colors"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-md">
                  {editingStaff ? 'Editar Profissional' : 'Cadastrar Profissional'}
                </h3>
                <form onSubmit={handleSaveStaff} className="space-y-4">
                  <div>
                    <label className="block text-sm text-on-surface-variant mb-1">Nome Completo</label>
                    <input required className="w-full border border-outline-variant rounded-lg px-3 py-2 bg-transparent focus:border-primary outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm text-on-surface-variant mb-1">Telefone (Login)</label>
                    <input required type="tel" placeholder="(11) 99999-9999" className="w-full border border-outline-variant rounded-lg px-3 py-2 bg-transparent focus:border-primary outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  
                  {editingStaff && (
                    <div className="flex items-center gap-2 mt-2 bg-surface-container p-2 rounded-lg">
                      <input 
                        type="checkbox" 
                        id="statusToggle"
                        className="w-4 h-4 text-primary bg-surface border-outline-variant rounded focus:ring-primary"
                        checked={formData.is_active} 
                        onChange={e => setFormData({...formData, is_active: e.target.checked})} 
                      />
                      <label htmlFor="statusToggle" className="text-sm text-on-surface cursor-pointer">Profissional Ativo</label>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm text-on-surface-variant mb-1">Nível de Acesso</label>
                    <select className="w-full border border-outline-variant rounded-lg px-3 py-2 bg-transparent focus:border-primary outline-none" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                      <option value="professional">Profissional (Acesso Limitado)</option>
                      <option value="manager">Gestor (Acesso Total)</option>
                    </select>
                  </div>

                  <div className="pt-2 border-t border-surface-variant">
                    <label className="block text-sm text-on-surface-variant mb-1">
                      {editingStaff ? 'Nova Senha (deixe em branco para não alterar)' : 'Senha Segura'}
                    </label>
                    <input type="password" minLength={formData.password ? "4" : undefined} className="w-full border border-outline-variant rounded-lg px-3 py-2 bg-transparent focus:border-primary outline-none" placeholder={editingStaff ? "••••••••" : ""} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required={!editingStaff} />
                  </div>

                  <button type="submit" disabled={saving} className="w-full bg-primary text-on-primary py-2 rounded-lg font-bold disabled:opacity-50 mt-4">
                    {saving ? 'Salvando...' : 'Salvar Dados'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Bento Grid Layout for Staff Members */}
          {loading ? (
             <div className="flex justify-center p-xl"><span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span></div>
          ) : staffList.length === 0 ? (
             <div className="text-center p-xl text-secondary">Nenhum profissional cadastrado.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
              {staffList.map((staff) => (
                <div 
                  key={staff.id} 
                  onClick={() => openEditModal(staff)}
                  className={`bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] p-md flex flex-col gap-md cursor-pointer hover:shadow-[0px_10px_30px_rgba(0,0,0,0.08)] transition-all border border-transparent hover:border-primary group relative overflow-hidden ${!staff.is_active ? 'opacity-75 grayscale' : ''}`}
                >
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-primary text-[20px]">edit</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-md">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-surface-variant border-2 border-surface flex items-center justify-center text-xl font-bold text-on-surface-variant">
                         {staff.name.substring(0,2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-label-md text-label-md text-on-surface group-hover:text-primary transition-colors pr-6">{staff.name}</h3>
                        <p className="font-body-sm text-sm text-secondary">{staff.role === 'manager' ? 'Gestor' : 'Profissional'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2">
                    <span className="bg-surface-variant text-on-surface-variant px-sm py-1 rounded-full text-xs truncate">Tel: {staff.phone}</span>
                    <span className={`px-2 py-1 rounded-md text-[10px] font-semibold flex items-center gap-1 uppercase tracking-wider ${staff.is_active ? 'bg-primary-container text-on-primary-container' : 'bg-surface-variant text-on-surface-variant'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full block ${staff.is_active ? 'bg-primary' : 'bg-secondary'}`}></span> {staff.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Performance Dashboard Widget (Real data pending/Placeholder) */}
          <div className="mt-lg">
            <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] p-lg flex flex-col gap-md w-full">
              <div className="flex justify-between items-center border-b border-surface-variant pb-sm">
                <h3 className="font-headline-md text-headline-md text-on-surface">Visão Geral de Desempenho (Visão da Equipe)</h3>
                <span className="text-secondary text-sm flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">info</span> Em breve</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-md pt-sm">
                <div className="bg-surface-bright p-md rounded-lg border border-surface-variant opacity-70">
                  <p className="text-sm text-secondary mb-1">Total de Serviços</p>
                  <p className="font-display-lg text-[32px] text-primary blur-[2px]">000</p>
                </div>
                <div className="bg-surface-bright p-md rounded-lg border border-surface-variant opacity-70">
                  <p className="text-sm text-secondary mb-1">Comissão Gerada</p>
                  <p className="font-display-lg text-[32px] text-primary blur-[2px]">R$ 0.000</p>
                </div>
              </div>
              
              {/* Placeholder for Chart */}
              <div className="h-48 bg-surface-variant rounded-lg mt-sm flex items-center justify-center relative overflow-hidden opacity-50">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 -skew-x-12 translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
                <span className="text-secondary text-sm">Gráfico de Performance em Desenvolvimento</span>
              </div>
            </div>
          </div>
          
        </div>

      <style>{`
        @keyframes shimmer {
            100% { transform: translateX(100%); }
        }
      `}</style>
    </>
  );
};

export default GestaoEquipe;
