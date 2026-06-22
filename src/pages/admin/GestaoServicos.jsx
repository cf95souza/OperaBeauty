import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import { supabase } from '../../lib/supabase';

const GestaoServicos = () => {
  const { tenant_slug } = useParams();
  const { tenant } = useTenant();

  const [services, setServices] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newService, setNewService] = useState({ 
    name: '', 
    duration_minutes: 60, 
    price: '', 
    maintenance_days: 0,
    use_inventory: false,
    inventory_id: '',
    quantity_consumed: 1
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!tenant) return;
    fetchData();
  }, [tenant]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: srvData, error: srvError } = await supabase
        .from('cap_services')
        .select(`
          *,
          cap_service_inventory (
             quantity_consumed,
             cap_inventory ( id, name, unit )
          )
        `)
        .eq('tenant_id', tenant.id)
        .order('name');
      
      if (!srvError && srvData) {
        setServices(srvData);
      }

      const { data: invData, error: invError } = await supabase
        .from('cap_inventory')
        .select('*')
        .eq('tenant_id', tenant.id)
        .eq('is_active', true)
        .order('name');
      
      if (!invError && invData) {
        setInventoryItems(invData);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleEdit = (service) => {
    const hasInv = service.cap_service_inventory && service.cap_service_inventory.length > 0;
    const inv = hasInv ? service.cap_service_inventory[0] : null;

    setNewService({
      name: service.name,
      duration_minutes: service.duration_minutes,
      price: service.price,
      maintenance_days: service.maintenance_days || 0,
      use_inventory: service.reduces_stock || false,
      inventory_id: inv ? inv.cap_inventory.id : '',
      quantity_consumed: inv ? inv.quantity_consumed : 1
    });
    setEditingId(service.id);
    setShowModal(true);
  };

  const handleToggleActive = async (id, currentStatus) => {
    if (!window.confirm(`Deseja realmente ${currentStatus ? 'inativar' : 'ativar'} este serviço?`)) return;
    
    try {
      const { error } = await supabase.from('cap_services').update({ is_active: !currentStatus }).eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Erro ao alterar status do serviço.');
    }
  };

  const handleDelete = async (id) => {
    try {
      // Verifica se já foi usado em algum agendamento
      const { data: appts, error: apptError } = await supabase
        .from('cap_appointments')
        .select('id')
        .eq('service_id', id)
        .limit(1);
      
      if (apptError) throw apptError;

      if (appts && appts.length > 0) {
        alert('Este serviço não pode ser excluído pois já possui agendamentos atrelados a ele. Recomendamos Inativar o serviço.');
        return;
      }

      if (!window.confirm('Tem certeza que deseja excluir este serviço? Esta ação não pode ser desfeita.')) return;

      const { error } = await supabase.from('cap_services').delete().eq('id', id);
      if (error) throw error;
      
      alert('Serviço excluído com sucesso.');
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir serviço.');
    }
  };

  const openNewModal = () => {
    setEditingId(null);
    setNewService({ 
      name: '', duration_minutes: 60, price: '', maintenance_days: 0,
      use_inventory: false, inventory_id: '', quantity_consumed: 1
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!tenant) return;
    
    if (newService.use_inventory && !newService.inventory_id) {
      alert("Selecione um item do estoque.");
      return;
    }

    setSaving(true);
    try {
      let serviceId = editingId;

      if (editingId) {
        const { error: srvErr } = await supabase
          .from('cap_services')
          .update({
            name: newService.name,
            duration_minutes: parseInt(newService.duration_minutes),
            price: parseFloat(newService.price),
            maintenance_days: parseInt(newService.maintenance_days) || 0,
            reduces_stock: newService.use_inventory
          })
          .eq('id', editingId);
        
        if (srvErr) throw srvErr;

        // Clean up old inventory links
        await supabase.from('cap_service_inventory').delete().eq('service_id', editingId);

      } else {
        const { data: insertedService, error: srvErr } = await supabase
          .from('cap_services')
          .insert([{
            tenant_id: tenant.id,
            name: newService.name,
            duration_minutes: parseInt(newService.duration_minutes),
            price: parseFloat(newService.price),
            maintenance_days: parseInt(newService.maintenance_days) || 0,
            reduces_stock: newService.use_inventory,
            is_active: true
          }])
          .select('id')
          .single();

        if (srvErr) throw srvErr;
        serviceId = insertedService.id;
      }

      // Insert Inventory Link if applicable
      if (newService.use_inventory && newService.inventory_id && serviceId) {
         const { error: invErr } = await supabase
           .from('cap_service_inventory')
           .insert([{
             tenant_id: tenant.id,
             service_id: serviceId,
             inventory_id: newService.inventory_id,
             quantity_consumed: parseFloat(newService.quantity_consumed) || 1
           }]);
         if (invErr) throw invErr;
      }
      
      alert(`Serviço ${editingId ? 'atualizado' : 'cadastrado'} com sucesso!`);
      setShowModal(false);
      fetchData(); 
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar serviço.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="p-gutter md:p-xl flex-1 flex flex-col gap-lg max-w-[1200px] mx-auto w-full animate-fade-in-up">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md">
          <div>
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">spa</span> Serviços
            </h2>
            <p className="font-body-md text-body-md text-secondary mt-1">Gerencie seu catálogo, tempo, e consumo de estoque.</p>
          </div>
          <button 
            onClick={openNewModal}
            className="flex items-center gap-sm bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md text-label-md hover:bg-on-primary-fixed-variant transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Novo Serviço
          </button>
        </div>

        {/* Modal for New/Edit Service */}
        {showModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white w-full max-w-[600px] flex flex-col rounded-2xl shadow-xl p-6 md:p-8 relative animate-in zoom-in-95 duration-200 my-8">
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-surface-variant text-secondary hover:text-error hover:bg-error/10 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">{editingId ? 'edit' : 'add_circle'}</span> 
                {editingId ? 'Editar Serviço' : 'Cadastrar Serviço'}
              </h3>
              
              <form onSubmit={handleSave} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block font-label-sm text-secondary mb-1">Nome do Procedimento</label>
                    <input required className="w-full border border-outline-variant rounded-lg px-3 py-2 bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})} placeholder="Ex: Limpeza de Pele Profunda"/>
                  </div>
                  <div>
                    <label className="block font-label-sm text-secondary mb-1">Duração (minutos)</label>
                    <input required type="number" min="5" className="w-full border border-outline-variant rounded-lg px-3 py-2 bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" value={newService.duration_minutes} onChange={e => setNewService({...newService, duration_minutes: e.target.value})} />
                  </div>
                  <div>
                    <label className="block font-label-sm text-secondary mb-1">Preço (R$)</label>
                    <input required type="number" step="0.01" min="0" className="w-full border border-outline-variant rounded-lg px-3 py-2 bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} placeholder="0.00" />
                  </div>
                  <div className="md:col-span-2 bg-primary/5 p-4 rounded-lg border border-primary/20">
                    <label className="block font-label-sm text-primary mb-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">calendar_clock</span> Manutenção (Retorno)
                    </label>
                    <p className="text-xs text-secondary mb-3">Dias esperados para o cliente retornar. Zero (0) se não houver.</p>
                    <input required type="number" min="0" className="w-full border border-outline-variant rounded-lg px-3 py-2 bg-white focus:border-primary outline-none" value={newService.maintenance_days} onChange={e => setNewService({...newService, maintenance_days: e.target.value})} />
                  </div>
                </div>

                <div className="border-t border-surface-variant pt-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-label-md text-on-surface flex items-center gap-2">
                         <span className="material-symbols-outlined text-secondary text-sm">inventory_2</span> 
                         Utiliza Estoque?
                      </h4>
                      <p className="text-xs text-secondary">Gasta produtos físicos ao realizar.</p>
                    </div>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                      <input 
                        checked={newService.use_inventory}
                        onChange={(e) => setNewService({...newService, use_inventory: e.target.checked})}
                        className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer" 
                        id="toggle-inv" 
                        type="checkbox"
                      />
                      <label className="toggle-label block overflow-hidden h-5 rounded-full bg-surface-variant cursor-pointer" htmlFor="toggle-inv"></label>
                    </div>
                  </div>

                  {newService.use_inventory && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-surface-bright p-4 rounded-lg border border-outline-variant animate-in slide-in-from-top-2 duration-200">
                      <div>
                        <label className="block font-label-sm text-secondary mb-1">Produto Base</label>
                        <select 
                           className="w-full border border-outline-variant rounded-lg px-3 py-2 bg-white focus:border-primary outline-none text-sm"
                           value={newService.inventory_id}
                           onChange={e => setNewService({...newService, inventory_id: e.target.value})}
                        >
                          <option value="">Selecione um produto...</option>
                          {inventoryItems.map(inv => (
                            <option key={inv.id} value={inv.id}>{inv.name} ({inv.unit})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block font-label-sm text-secondary mb-1">Quantidade Gasta</label>
                        <input 
                           type="number" 
                           step="0.01" 
                           min="0.01" 
                           className="w-full border border-outline-variant rounded-lg px-3 py-2 bg-white focus:border-primary outline-none" 
                           value={newService.quantity_consumed} 
                           onChange={e => setNewService({...newService, quantity_consumed: e.target.value})} 
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button type="submit" disabled={saving} className="w-full bg-primary text-on-primary py-3 rounded-xl font-bold disabled:opacity-50 hover:bg-on-primary-container transition-colors shadow-md mt-4">
                  {saving ? 'Salvando...' : (editingId ? 'Salvar Alterações' : 'Cadastrar Serviço')}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* List of Services */}
        {loading ? (
          <div className="flex justify-center p-xl"><span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span></div>
        ) : services.length === 0 ? (
          <div className="text-center p-xl text-secondary bg-surface-container-lowest rounded-xl flex flex-col items-center">
            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">spa</span>
            <p>Nenhum serviço cadastrado ainda.</p>
          </div>
        ) : (
          <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-surface-variant font-label-md text-label-md text-on-surface-variant">
                    <th className="px-6 py-4 border-b border-surface-variant">Serviço</th>
                    <th className="px-6 py-4 border-b border-surface-variant text-center">Duração</th>
                    <th className="px-6 py-4 border-b border-surface-variant">Consumo</th>
                    <th className="px-6 py-4 border-b border-surface-variant text-center">Retorno (Dias)</th>
                    <th className="px-6 py-4 border-b border-surface-variant text-right">Valor</th>
                    <th className="px-6 py-4 border-b border-surface-variant text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-variant">
                  {services.map((service) => {
                    const hasInventory = service.cap_service_inventory && service.cap_service_inventory.length > 0;
                    const inv = hasInventory ? service.cap_service_inventory[0] : null;

                    return (
                      <tr key={service.id} className={`transition-colors group ${!service.is_active ? 'opacity-50 bg-surface-variant/20' : 'hover:bg-surface-bright'}`}>
                        <td className="px-6 py-4">
                          <span className="font-label-md text-label-md text-on-surface block flex items-center gap-2">
                             {service.name}
                             {!service.is_active && <span className="text-[10px] bg-error text-white px-2 py-0.5 rounded-full uppercase">Inativo</span>}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-xs text-secondary bg-surface-variant px-2 py-1 rounded-full font-medium inline-flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">schedule</span> {service.duration_minutes}m
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {hasInventory ? (
                            <span className="text-xs text-tertiary bg-tertiary/10 px-2 py-1 rounded-md border border-tertiary/20 flex items-center gap-1 w-max">
                              <span className="material-symbols-outlined text-[14px]">inventory_2</span>
                              {inv.cap_inventory?.name} ({inv.quantity_consumed} {inv.cap_inventory?.unit})
                            </span>
                          ) : (
                            <span className="text-xs text-secondary opacity-50">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {service.maintenance_days > 0 ? (
                            <span className="text-xs text-primary font-bold">{service.maintenance_days} d</span>
                          ) : (
                            <span className="text-xs text-secondary opacity-50">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-label-md text-label-md text-on-surface">R$ {parseFloat(service.price).toFixed(2).replace('.', ',')}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <button 
                                onClick={() => handleEdit(service)}
                                className="w-8 h-8 rounded-full bg-surface-variant text-secondary hover:text-primary hover:bg-primary/10 flex items-center justify-center transition-colors"
                                title="Editar Serviço"
                             >
                                <span className="material-symbols-outlined text-[18px]">edit</span>
                             </button>
                             <button 
                                onClick={() => handleToggleActive(service.id, service.is_active)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${service.is_active ? 'bg-surface-variant text-secondary hover:text-error hover:bg-error/10' : 'bg-surface-variant text-secondary hover:text-primary hover:bg-primary/10'}`}
                                title={service.is_active ? "Inativar Serviço" : "Ativar Serviço"}
                             >
                                <span className="material-symbols-outlined text-[18px]">{service.is_active ? 'block' : 'check_circle'}</span>
                             </button>
                             <button 
                                onClick={() => handleDelete(service.id)}
                                className="w-8 h-8 rounded-full bg-surface-variant text-secondary hover:text-error hover:bg-error/10 flex items-center justify-center transition-colors"
                                title="Excluir Permanentemente"
                             >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                             </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <style>{`
        .toggle-checkbox:checked { right: 0; border-color: var(--color-primary); }
        .toggle-checkbox:checked + .toggle-label { background-color: var(--color-primary-container); }
      `}</style>
    </>
  );
};

export default GestaoServicos;
