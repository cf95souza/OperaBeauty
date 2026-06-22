import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import { supabase } from '../../lib/supabase';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const GestaoFinanceira = () => {
  const { tenant_slug } = useParams();
  const { tenant } = useTenant();

  const [loading, setLoading] = useState(true);
  const [entradasMes, setEntradasMes] = useState(0);
  const [ticketMedio, setTicketMedio] = useState(0);
  const [comissoesPagar, setComissoesPagar] = useState(0);
  const [servicoMaisRentavel, setServicoMaisRentavel] = useState({ name: '-', value: 0 });
  const [transacoes, setTransacoes] = useState([]);
  const [comissoesPorProfissional, setComissoesPorProfissional] = useState([]);

  useEffect(() => {
    if (tenant?.id) {
      fetchFinanceData();
    }
  }, [tenant]);

  const fetchFinanceData = async () => {
    setLoading(true);
    try {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();

      const { data: appointments, error } = await supabase
        .from('cap_appointments')
        .select(`
          id,
          total_price,
          staff_commission_value,
          start_time,
          end_time,
          cap_staff (id, name),
          cap_services (id, name),
          cap_clients (id, name)
        `)
        .eq('tenant_id', tenant.id)
        .eq('status', 'completed')
        .gte('start_time', startOfMonth)
        .order('end_time', { ascending: false });

      if (error) throw error;

      if (appointments && appointments.length > 0) {
        const totalEntradas = appointments.reduce((sum, appt) => sum + Number(appt.total_price), 0);
        setEntradasMes(totalEntradas);

        setTicketMedio(totalEntradas / appointments.length);

        const totalComissoes = appointments.reduce((sum, appt) => sum + Number(appt.staff_commission_value || 0), 0);
        setComissoesPagar(totalComissoes);

        const revenueByService = {};
        appointments.forEach(appt => {
          const sName = appt.cap_services?.name || 'Serviço Personalizado';
          revenueByService[sName] = (revenueByService[sName] || 0) + Number(appt.total_price);
        });

        const topService = Object.keys(revenueByService).reduce((a, b) => revenueByService[a] > revenueByService[b] ? a : b, '-');
        setServicoMaisRentavel({ name: topService, value: revenueByService[topService] || 0 });

        const comissoesMap = {};
        appointments.forEach(appt => {
          const pId = appt.cap_staff?.id || 'unknown';
          const pName = appt.cap_staff?.name || 'Profissional Removido';
          if (!comissoesMap[pId]) {
            comissoesMap[pId] = { name: pName, commission: 0, revenue: 0 };
          }
          comissoesMap[pId].commission += Number(appt.staff_commission_value || 0);
          comissoesMap[pId].revenue += Number(appt.total_price);
        });
        
        const comissoesArray = Object.values(comissoesMap).sort((a, b) => b.commission - a.commission);
        setComissoesPorProfissional(comissoesArray);

        setTransacoes(appointments);
      } else {
        setEntradasMes(0);
        setTicketMedio(0);
        setComissoesPagar(0);
        setServicoMaisRentavel({ name: '-', value: 0 });
        setComissoesPorProfissional([]);
        setTransacoes([]);
      }

    } catch (err) {
      console.error("Erro ao buscar dados financeiros:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
        <div className="p-container-margin md:p-xl max-w-[1200px] mx-auto space-y-xl mt-md md:mt-0 animate-fade-in-up">
          
          {/* Page Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-md">
            <div>
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-xs">Gestão Financeira</h1>
              <p className="text-on-surface-variant font-body-lg text-body-lg">Visão detalhada de faturamento, ticket médio e comissões.</p>
            </div>
            <div className="flex gap-sm w-full md:w-auto">
              <button className="flex-1 md:flex-none bg-surface-container-high text-on-surface font-label-md text-label-md px-md py-sm rounded-lg hover:bg-surface-variant transition-colors flex items-center justify-center gap-xs">
                <span className="material-symbols-outlined text-[18px]">download</span> Exportar Relatório
              </button>
            </div>
          </div>

          {/* KPIs Bento Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
            
            {/* Entradas Mês */}
            <div className="bg-surface-container-lowest rounded-xl p-md shadow-[0px_4px_20px_rgba(0,0,0,0.04)] flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-[0px_10px_30px_rgba(0,0,0,0.08)] transition-shadow">
              <div className="absolute top-0 right-0 p-sm opacity-20 group-hover:opacity-40 transition-opacity">
                <span className="material-symbols-outlined text-[48px] text-[#2e7d32]">arrow_circle_up</span>
              </div>
              <p className="font-label-md text-label-md text-secondary">Entradas (Mês Atual)</p>
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface">{formatCurrency(entradasMes)}</h3>
                <p className="text-sm text-[#2e7d32] flex items-center gap-xs mt-xs">Faturamento Bruto</p>
              </div>
            </div>

            {/* Ticket Médio */}
            <div className="bg-surface-container-lowest rounded-xl p-md shadow-[0px_4px_20px_rgba(0,0,0,0.04)] flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-[0px_10px_30px_rgba(0,0,0,0.08)] transition-shadow">
              <div className="absolute top-0 right-0 p-sm opacity-20 group-hover:opacity-40 transition-opacity">
                <span className="material-symbols-outlined text-[48px] text-primary">analytics</span>
              </div>
              <p className="font-label-md text-label-md text-secondary">Ticket Médio</p>
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface">{formatCurrency(ticketMedio)}</h3>
                <p className="text-sm text-secondary mt-xs">Gasto médio por agendamento</p>
              </div>
            </div>

            {/* Serviço Mais Rentável */}
            <div className="bg-surface-container-lowest rounded-xl p-md shadow-[0px_4px_20px_rgba(0,0,0,0.04)] flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-[0px_10px_30px_rgba(0,0,0,0.08)] transition-shadow">
              <div className="absolute top-0 right-0 p-sm opacity-20 group-hover:opacity-40 transition-opacity">
                <span className="material-symbols-outlined text-[48px] text-tertiary">diamond</span>
              </div>
              <p className="font-label-md text-label-md text-secondary">Serviço em Destaque</p>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface truncate pr-8" title={servicoMaisRentavel.name}>{servicoMaisRentavel.name}</h3>
                <p className="text-sm text-tertiary mt-xs">Gerou {formatCurrency(servicoMaisRentavel.value)}</p>
              </div>
            </div>
            
            {/* Comissões a Pagar */}
            <div className="bg-surface-container-lowest rounded-xl p-md shadow-[0px_4px_20px_rgba(0,0,0,0.04)] flex flex-col justify-between h-32 relative overflow-hidden group hover:shadow-[0px_10px_30px_rgba(0,0,0,0.08)] transition-shadow">
              <div className="absolute top-0 right-0 p-sm opacity-20 group-hover:opacity-40 transition-opacity">
                <span className="material-symbols-outlined text-[48px] text-error">payments</span>
              </div>
              <p className="font-label-md text-label-md text-secondary">Comissões Acumuladas</p>
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface">{formatCurrency(comissoesPagar)}</h3>
                <p className="text-sm text-error mt-xs">Para a equipe neste mês</p>
              </div>
            </div>

          </section>

          {/* Main Data Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
            
            {/* Fluxo de Caixa / Lista de Transações */}
            <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-lg shadow-[0px_4px_20px_rgba(0,0,0,0.04)]">
              <div className="flex justify-between items-center mb-md border-b border-surface-variant pb-sm">
                <h3 className="font-label-md text-label-md text-on-surface text-lg">Últimas Transações (Entradas)</h3>
                <div className="flex gap-sm">
                  <span className="text-sm text-secondary bg-surface-variant px-3 py-1 rounded-full">{transacoes.length} registros</span>
                </div>
              </div>
              
              <div className="space-y-2">
                {transacoes.length === 0 ? (
                   <p className="text-center text-secondary py-md">Nenhuma transação registrada no mês.</p>
                ) : (
                  transacoes.slice(0, 15).map((t, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-surface-variant/50 last:border-0 hover:bg-surface-container-low transition-colors rounded-lg px-2 -mx-2">
                      <div className="flex items-center gap-md">
                        <div className="w-10 h-10 rounded-full bg-primary-container/30 flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined">point_of_sale</span>
                        </div>
                        <div>
                          <p className="font-label-md text-label-md text-on-surface">{t.cap_clients?.name || 'Cliente Avulso'}</p>
                          <p className="text-xs text-secondary truncate max-w-[150px] md:max-w-[250px]">{t.cap_services?.name || 'Serviço'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-label-md text-label-md text-[#2e7d32]">+{formatCurrency(t.total_price)}</p>
                        <p className="text-xs text-secondary">{format(parseISO(t.end_time || t.start_time), "dd MMM, HH:mm", { locale: ptBR })}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Controle de Comissões por Profissional */}
            <div className="bg-surface-container-lowest rounded-xl p-lg shadow-[0px_4px_20px_rgba(0,0,0,0.04)] flex flex-col h-full max-h-[600px]">
              <div className="flex justify-between items-center mb-md border-b border-surface-variant pb-sm">
                <h3 className="font-label-md text-label-md text-on-surface text-lg">Comissões (Ranking)</h3>
              </div>
              
              <div className="flex-1 space-y-2 overflow-y-auto pr-2">
                {comissoesPorProfissional.length === 0 ? (
                  <p className="text-center text-secondary py-md text-sm">Sem dados de comissão no mês.</p>
                ) : (
                  comissoesPorProfissional.map((prof, idx) => (
                    <div key={idx} className="flex flex-col group p-3 hover:bg-surface-container-low rounded-lg transition-colors border border-outline-variant/30 mb-2">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary text-on-primary font-bold flex items-center justify-center text-xs">
                            {prof.name.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="font-label-md text-on-surface truncate max-w-[100px]">{prof.name}</span>
                        </div>
                        <span className="font-bold text-on-surface">{formatCurrency(prof.commission)}</span>
                      </div>
                      <div className="flex justify-between items-center pl-10">
                         <span className="text-xs text-secondary">Faturou:</span>
                         <span className="text-xs text-secondary font-medium">{formatCurrency(prof.revenue)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              <div className="mt-md pt-sm border-t border-surface-variant">
                <button className="w-full bg-surface-container-highest text-on-surface font-label-md text-label-md px-md py-sm rounded-lg hover:bg-outline-variant transition-colors flex items-center justify-center gap-xs">
                  <span className="material-symbols-outlined text-[18px]">price_check</span> Fechar Período
                </button>
              </div>
            </div>
            
          </div>
          
        </div>
    </>
  );
};

export default GestaoFinanceira;
