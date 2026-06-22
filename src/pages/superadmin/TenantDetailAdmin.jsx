import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const TenantDetailAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);

  // States for sub-data
  const [staff, setStaff] = useState([]);
  const [clients, setClients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [invoices, setInvoices] = useState([]);

  // States for Editing
  const [editForm, setEditForm] = useState({
    name: '',
    slug: '',
    primary_color: '',
    secondary_color: '',
    status: ''
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchTenantData();
  }, [id]);

  useEffect(() => {
    if (activeTab === 'staff' && staff.length === 0) fetchStaff();
    if (activeTab === 'clients' && clients.length === 0) fetchClients();
    if (activeTab === 'billing' && appointments.length === 0) fetchAppointments();
    if (activeTab === 'invoices') fetchInvoices();
  }, [activeTab]);

  const fetchTenantData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cap_tenants')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      setTenant(data);
      setEditForm({
        name: data.name || '',
        slug: data.slug || '',
        primary_color: data.primary_color || '',
        secondary_color: data.secondary_color || '',
        status: data.status || 'active'
      });
    } catch (error) {
      console.error('Error fetching tenant:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const { data, error } = await supabase.from('cap_staff').select('*').eq('tenant_id', id);
      if (!error) setStaff(data || []);
    } catch (error) {
      console.error('Error fetching staff:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase.from('cap_clients').select('*').eq('tenant_id', id);
      if (!error) setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase.from('cap_appointments').select('*').eq('tenant_id', id).order('created_at', { ascending: false }).limit(50);
      if (!error) setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const fetchInvoices = async () => {
    try {
      const { data, error } = await supabase.from('cap_invoices').select('*').eq('tenant_id', id).order('due_date', { ascending: false });
      if (!error) setInvoices(data || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const handleGenerateInvoice = async () => {
    const referenceMonth = prompt('Mês de referência (ex: Julho / 2026):');
    if (!referenceMonth) return;

    try {
      const { error } = await supabase.from('cap_invoices').insert([{
        tenant_id: id,
        amount: tenant.plan_price || 59.90,
        status: 'pending',
        due_date: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0], // vence em 5 dias
        reference_month: referenceMonth
      }]);
      if (error) throw error;
      alert('Fatura gerada com sucesso!');
      fetchInvoices();
    } catch (err) {
      console.error(err);
      alert('Erro ao gerar fatura.');
    }
  };

  const handleMarkAsPaid = async (invoiceId) => {
    if (!window.confirm('Marcar esta fatura como paga manualmente?')) return;
    try {
      const { error } = await supabase.from('cap_invoices').update({
        status: 'paid',
        paid_at: new Date().toISOString(),
        payment_method: 'manual'
      }).eq('id', invoiceId);
      
      if (error) throw error;
      alert('Fatura baixada com sucesso!');
      fetchInvoices();
    } catch (err) {
      console.error(err);
      alert('Erro ao dar baixa na fatura.');
    }
  };

  const handleUpdateTenant = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('cap_tenants')
        .update({
          name: editForm.name,
          slug: editForm.slug,
          primary_color: editForm.primary_color,
          secondary_color: editForm.secondary_color,
          status: editForm.status
        })
        .eq('id', id);
      
      if (error) throw error;
      alert('Salão atualizado com sucesso!');
      fetchTenantData();
    } catch (error) {
      console.error('Error updating tenant:', error);
      alert('Erro ao atualizar salão.');
    } finally {
      setIsSaving(false);
    }
  };

  const resetStaffPassword = async (staffId) => {
    const newPassword = prompt("Digite a nova senha para este profissional:");
    if (!newPassword) return;

    try {
      // Usamos a mesma RPC, mas precisamos garantir que o staff não perca suas outras infos
      // Então apenas fazemos um update na tabela com crypt
      const { error } = await supabase.rpc('cap_update_staff', {
        p_staff_id: staffId,
        p_tenant_id: id,
        p_name: staff.find(s => s.id === staffId).name,
        p_phone: staff.find(s => s.id === staffId).phone,
        p_password: newPassword,
        p_role: staff.find(s => s.id === staffId).role,
        p_is_active: staff.find(s => s.id === staffId).is_active
      });

      if (error) throw error;
      alert('Senha do profissional redefinida com sucesso!');
    } catch (err) {
      console.error('Erro ao resetar senha do staff', err);
      alert('Falha ao resetar senha.');
    }
  };

  const resetClientPassword = async (clientId) => {
    const newPassword = prompt("Digite a nova senha para este cliente:");
    if (!newPassword) return;

    try {
      const { error } = await supabase.rpc('cap_update_client_password', {
        p_client_id: clientId,
        p_tenant_id: id,
        p_password: newPassword
      });

      if (error) throw error;
      alert('Senha do cliente redefinida com sucesso!');
    } catch (err) {
      console.error('Erro ao resetar senha do cliente', err);
      alert('Falha ao resetar senha.');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background text-secondary">Carregando dados do salão...</div>;
  if (!tenant) return <div className="min-h-screen flex items-center justify-center bg-background text-error">Salão não encontrado.</div>;

  return (
    <div className="font-body-md text-body-md antialiased min-h-screen flex flex-col bg-background text-on-surface animate-fade-in-up">
      
      {/* Top App Bar */}
      <header className="flex justify-between items-center px-gutter py-3 bg-surface shadow-sm sticky top-0 z-30 pt-[max(env(safe-area-inset-top),_0.75rem)]">
        <div className="flex items-center gap-sm">
          <button onClick={() => navigate('/superadmin')} className="material-symbols-outlined text-primary p-2 hover:bg-surface-container-low rounded-full transition-colors">arrow_back</button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary overflow-hidden shrink-0" style={{ backgroundColor: tenant.primary_color ? `${tenant.primary_color}20` : undefined, color: tenant.primary_color }}>
              <span className="material-symbols-outlined text-sm">storefront</span>
            </div>
            <span className="font-headline-md text-[18px] text-primary tracking-tight">{tenant.name}</span>
          </div>
        </div>
      </header>

      <main className="flex-1 p-container-margin md:p-xl flex flex-col gap-lg max-w-7xl mx-auto w-full">
        
        {/* Header & Status */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md bg-surface p-lg rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface">{tenant.name}</h1>
            <p className="font-body-md text-secondary">/{tenant.slug}</p>
          </div>
          <div className="flex items-center gap-sm">
            <div className={`px-4 py-2 rounded-full font-label-md flex items-center gap-2 ${tenant.status === 'active' ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-error-container text-error'}`}>
              <div className={`w-2 h-2 rounded-full ${tenant.status === 'active' ? 'bg-[#10b981]' : 'bg-error'}`}></div>
              {tenant.status === 'active' ? 'Ativo' : 'Inativo / Suspenso'}
            </div>
            <a href={`/${tenant.slug}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-surface-container-low text-primary rounded-full hover:bg-surface-container-high transition-colors" title="Abrir Salão">
              <span className="material-symbols-outlined">open_in_new</span>
            </a>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-2 border-b border-surface-variant pb-px">
          {['overview', 'staff', 'clients', 'billing', 'invoices'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-label-md text-label-md whitespace-nowrap border-b-2 transition-colors ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-on-surface'}`}
            >
              {tab === 'overview' && 'Visão Geral'}
              {tab === 'staff' && 'Equipe'}
              {tab === 'clients' && 'Clientes'}
              {tab === 'billing' && 'Faturamento'}
              {tab === 'invoices' && 'Faturas SaaS'}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1">
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
              <div className="bg-surface p-lg rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                <h3 className="font-headline-sm text-headline-sm mb-lg border-b border-surface-variant pb-2">Editar Informações Base</h3>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block font-label-sm text-secondary mb-1">Nome do Salão</label>
                    <input 
                      className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg p-3 outline-none focus:border-primary"
                      value={editForm.name}
                      onChange={e => setEditForm({...editForm, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block font-label-sm text-secondary mb-1">Slug (URL de Acesso)</label>
                    <input 
                      className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg p-3 outline-none focus:border-primary"
                      value={editForm.slug}
                      onChange={e => setEditForm({...editForm, slug: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-label-sm text-secondary mb-1">Cor Primária</label>
                      <input 
                        type="color"
                        className="w-full h-12 rounded-lg cursor-pointer"
                        value={editForm.primary_color}
                        onChange={e => setEditForm({...editForm, primary_color: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block font-label-sm text-secondary mb-1">Cor Secundária</label>
                      <input 
                        type="color"
                        className="w-full h-12 rounded-lg cursor-pointer"
                        value={editForm.secondary_color}
                        onChange={e => setEditForm({...editForm, secondary_color: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-label-sm text-secondary mb-1">Status da Conta</label>
                    <select 
                      className="w-full bg-surface-container-lowest border border-surface-variant rounded-lg p-3 outline-none focus:border-primary"
                      value={editForm.status}
                      onChange={e => setEditForm({...editForm, status: e.target.value})}
                    >
                      <option value="active">Ativo (Funcionando)</option>
                      <option value="suspended">Suspenso (Bloqueado)</option>
                    </select>
                  </div>
                  
                  <button 
                    onClick={handleUpdateTenant}
                    disabled={isSaving}
                    className="mt-4 bg-primary text-on-primary py-3 rounded-lg font-label-md hover:opacity-90 disabled:opacity-50"
                  >
                    {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </div>

              <div className="bg-surface p-lg rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col justify-center items-center text-center">
                 <span className="material-symbols-outlined text-[64px] text-error mb-4">gavel</span>
                 <h3 className="font-headline-sm text-headline-sm mb-2">Controle de Acesso Master</h3>
                 <p className="text-secondary mb-6">Ao suspender a conta, nenhum profissional, gestor ou cliente conseguirá acessar este salão. Utilize isso em casos de inadimplência ou cancelamento.</p>
                 <button 
                    onClick={() => setEditForm({...editForm, status: editForm.status === 'active' ? 'suspended' : 'active'})}
                    className={`px-6 py-3 rounded-full font-label-md border-2 transition-colors ${editForm.status === 'active' ? 'border-error text-error hover:bg-error-container' : 'border-[#10b981] text-[#10b981] hover:bg-[#10b981]/10'}`}
                 >
                   {editForm.status === 'active' ? 'Suspender Conta Imediatamente' : 'Reativar Conta do Salão'}
                 </button>
              </div>
            </div>
          )}

          {/* TAB: STAFF */}
          {activeTab === 'staff' && (
            <div className="bg-surface rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="p-lg border-b border-surface-variant flex justify-between items-center">
                <h3 className="font-headline-sm text-headline-sm">Equipe e Gestores ({staff.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-container-lowest border-b border-surface-variant">
                    <tr>
                      <th className="p-4 font-label-md text-secondary">Nome</th>
                      <th className="p-4 font-label-md text-secondary">Telefone</th>
                      <th className="p-4 font-label-md text-secondary">Cargo</th>
                      <th className="p-4 font-label-md text-secondary">Status</th>
                      <th className="p-4 font-label-md text-secondary text-right">Ação Mestre</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staff.length === 0 ? (
                      <tr><td colSpan="5" className="p-8 text-center text-secondary">Nenhum profissional cadastrado.</td></tr>
                    ) : (
                      staff.map(s => (
                        <tr key={s.id} className="border-b border-surface-variant hover:bg-surface-container-lowest">
                          <td className="p-4 font-label-md text-on-surface">{s.name}</td>
                          <td className="p-4 text-secondary">{s.phone}</td>
                          <td className="p-4"><span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full text-[12px]">{s.role === 'manager' ? 'Gestor' : 'Profissional'}</span></td>
                          <td className="p-4"><span className={`text-[12px] px-3 py-1 rounded-full ${s.is_active ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-error-container text-error'}`}>{s.is_active ? 'Ativo' : 'Desativado'}</span></td>
                          <td className="p-4 text-right">
                            <button onClick={() => resetStaffPassword(s.id)} className="text-primary hover:underline font-label-sm">Resetar Senha</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: CLIENTS */}
          {activeTab === 'clients' && (
            <div className="bg-surface rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="p-lg border-b border-surface-variant flex justify-between items-center">
                <h3 className="font-headline-sm text-headline-sm">Clientes Cadastrados ({clients.length})</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-surface-container-lowest border-b border-surface-variant">
                    <tr>
                      <th className="p-4 font-label-md text-secondary">Nome</th>
                      <th className="p-4 font-label-md text-secondary">Telefone</th>
                      <th className="p-4 font-label-md text-secondary text-right">Ação Mestre</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.length === 0 ? (
                      <tr><td colSpan="3" className="p-8 text-center text-secondary">Nenhum cliente cadastrado.</td></tr>
                    ) : (
                      clients.map(c => (
                        <tr key={c.id} className="border-b border-surface-variant hover:bg-surface-container-lowest">
                          <td className="p-4 font-label-md text-on-surface">{c.name}</td>
                          <td className="p-4 text-secondary">{c.phone}</td>
                          <td className="p-4 text-right">
                            <button onClick={() => resetClientPassword(c.id)} className="text-primary hover:underline font-label-sm">Resetar Senha</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: BILLING */}
          {activeTab === 'billing' && (
            <div className="flex flex-col gap-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
                 <div className="bg-surface p-lg rounded-2xl shadow-sm border border-surface-variant">
                    <span className="block font-label-md text-secondary mb-2">Total de Agendamentos</span>
                    <span className="font-display-lg text-on-surface">{appointments.length}</span>
                 </div>
                 <div className="bg-surface p-lg rounded-2xl shadow-sm border border-surface-variant">
                    <span className="block font-label-md text-secondary mb-2">Volume Processado</span>
                    <span className="font-display-lg text-[#10b981]">
                      R$ {appointments.reduce((sum, app) => sum + (Number(app.total_price) || 0), 0).toFixed(2)}
                    </span>
                 </div>
                 <div className="bg-surface p-lg rounded-2xl shadow-sm border border-surface-variant">
                    <span className="block font-label-md text-secondary mb-2">Comissões Devidas</span>
                    <span className="font-display-lg text-error">
                      R$ {appointments.reduce((sum, app) => sum + (Number(app.staff_commission_value) || 0), 0).toFixed(2)}
                    </span>
                 </div>
              </div>

              <div className="bg-surface rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden mt-4">
                <div className="p-lg border-b border-surface-variant">
                  <h3 className="font-headline-sm text-headline-sm">Últimos Agendamentos (Máx 50)</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-surface-container-lowest border-b border-surface-variant">
                      <tr>
                        <th className="p-4 font-label-md text-secondary">Data</th>
                        <th className="p-4 font-label-md text-secondary">Status</th>
                        <th className="p-4 font-label-md text-secondary text-right">Valor Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.length === 0 ? (
                        <tr><td colSpan="3" className="p-8 text-center text-secondary">Nenhum agendamento encontrado.</td></tr>
                      ) : (
                        appointments.map(app => (
                          <tr key={app.id} className="border-b border-surface-variant hover:bg-surface-container-lowest">
                            <td className="p-4 text-on-surface">{new Date(app.start_time).toLocaleString('pt-BR')}</td>
                            <td className="p-4"><span className="bg-surface-container-high px-2 py-1 rounded text-[12px] uppercase">{app.status}</span></td>
                            <td className="p-4 text-right font-label-md">R$ {Number(app.total_price).toFixed(2)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB: INVOICES (SaaS) */}
          {activeTab === 'invoices' && (
            <div className="flex flex-col gap-lg">
              <div className="flex justify-between items-center bg-surface p-lg rounded-2xl shadow-sm border border-surface-variant">
                 <div>
                   <h3 className="font-headline-sm text-headline-sm">Cobrança da Plataforma</h3>
                   <p className="text-secondary text-sm">Gerencie as mensalidades deste salão.</p>
                 </div>
                 <button 
                   onClick={handleGenerateInvoice}
                   className="bg-primary text-on-primary px-6 py-3 rounded-full font-label-md hover:opacity-90 shadow-sm transition-colors"
                 >
                   Gerar Fatura Manual
                 </button>
              </div>

              <div className="bg-surface rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-surface-container-lowest border-b border-surface-variant">
                      <tr>
                        <th className="p-4 font-label-md text-secondary">Mês/Ref</th>
                        <th className="p-4 font-label-md text-secondary">Vencimento</th>
                        <th className="p-4 font-label-md text-secondary">Valor</th>
                        <th className="p-4 font-label-md text-secondary">Status</th>
                        <th className="p-4 font-label-md text-secondary text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.length === 0 ? (
                        <tr><td colSpan="5" className="p-8 text-center text-secondary">Nenhuma fatura encontrada.</td></tr>
                      ) : (
                        invoices.map(inv => (
                          <tr key={inv.id} className="border-b border-surface-variant hover:bg-surface-container-lowest">
                            <td className="p-4 font-label-md text-on-surface">{inv.reference_month}</td>
                            <td className="p-4 text-secondary">{new Date(inv.due_date).toLocaleDateString('pt-BR')}</td>
                            <td className="p-4 font-label-md">R$ {Number(inv.amount).toFixed(2)}</td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-[12px] font-label-sm ${
                                inv.status === 'paid' ? 'bg-[#10b981]/10 text-[#10b981]' : 
                                inv.status === 'pending' ? 'bg-[#f59e0b]/10 text-[#f59e0b]' : 
                                'bg-error-container text-error'
                              }`}>
                                {inv.status === 'paid' ? 'Pago' : inv.status === 'pending' ? 'Pendente' : 'Vencida'}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              {inv.status !== 'paid' ? (
                                <button 
                                  onClick={() => handleMarkAsPaid(inv.id)}
                                  className="text-primary hover:underline font-label-sm"
                                >
                                  Dar Baixa Manual
                                </button>
                              ) : (
                                <span className="text-secondary text-sm">Pago em {new Date(inv.paid_at).toLocaleDateString('pt-BR')}</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default TenantDetailAdmin;
