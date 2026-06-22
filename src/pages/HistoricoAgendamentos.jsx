import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTenant } from '../context/TenantContext';

const MOCK_UPCOMING = [
  { id: 1, service: 'Limpeza de Pele Deep Glow', professional: 'Elena Rossi', date: '24 de Outubro', time: '14:30', icon: 'spa' },
  { id: 2, service: 'Design de Sobrancelhas', professional: 'Marina Silva', date: '28 de Outubro', time: '10:00', icon: 'face_3' }
];

const MOCK_PAST = [
  { id: 3, service: 'Manicure & Spa de Pés', date: '15 de Setembro, 2023', price: '120,00', status: 'Concluído', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBB4D_Y8i3KZcQAFc46rU6UkdMgfsN4C8s_E7tfLsbHB19HEzG_m-1-4s4osWgbUQtlkJW2nMqtfhcuDY01xKwKWOpWbxF0MnDXKohae6PEv5aNWUcsohygpsIbZhPDKncBCmGQztbklJbctzouQHzeYrnchVb3okjY-F4jLkn5FA69WI2QDa-T9Cz-R8prJriQvMQ8DMFqfOfSMlYgK8H5UjXOsoqDj5AlMBI3jtpbnouVVcOryzQO46tMrKshXGGdCB9OZuh1iEUz' },
  { id: 4, service: 'Peeling Químico', date: '02 de Setembro, 2023', price: '280,00', status: 'Concluído', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDzEp7d2cwdmb6H34iWQ9m9r7d6hbkGuGwahhr82P6yOwFpQoLLSMADq13mg-5X3P2D6VRByu2GSBx207LCQpXGIzIeApD-uA7ixlbpIGdhD8UBGgMrFlAdWIPPiJfGD9-w9y_iZE8BIidGZtJzRercq0YJBM8bMfcgqFC4ctrP6OqIt7bwrnnt6Alr9eapZy_P-8RbTJHPqVZ0g_YsxP53MER9FVMQTx8zjpS1dHuXp8Pt8TsZWWrlPFrNsAxJSmQtV924sU75QFCV' },
  { id: 5, service: 'Massagem Relaxante', date: '20 de Agosto, 2023', price: '180,00', status: 'Concluído', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvIDcz6rOvM1VVgQKh33UBh6omziFuFqipVtrAyEfVdZDOd0dO2LPPWMZ_MZaXqzv4wrZBZkVYEfkTA_B2xUWldYS7U7yYl_vzKYw-AimQy3Z7E8gV1raAbAe0Fz1pk4yL6erJ-Uga7fApA7wmO9ttyzWqIPRWU-9GoMNFtfYEJvgBsHhMjNF0ExRSMX5Cuie9H-la7nkeZJ7t5pO1QYnWK5DKT9AniVwU-km8BNrTKIiLuubyjnbdR6aSaPVaerlJ33gYoOR7dkTd' }
];

const HistoricoAgendamentos = () => {
  const { tenant_slug } = useParams();
  const navigate = useNavigate();
  const { tenant } = useTenant();
  const [activeTab, setActiveTab] = useState('proximos');

  return (
    <div className="bg-[#f9f9f9] text-on-background font-body-md min-h-screen pb-[120px]">
      <header className="w-full top-0 sticky z-40 bg-surface flex items-center justify-between px-[16px] py-[16px] max-w-7xl mx-auto shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(`/${tenant_slug}`)} className="hover:opacity-80 transition-opacity active:scale-95 duration-150">
            <span className="material-symbols-outlined text-primary">arrow_back</span>
          </button>
          <h1 className="font-headline-md text-[24px] font-semibold text-primary tracking-tight">Histórico</h1>
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm bg-[#e2e2e2]">
          <span className="material-symbols-outlined mt-2 ml-2 text-[#504444]">person</span>
        </div>
      </header>

      <main className="px-[16px] mt-[16px] max-w-[672px] mx-auto">
        <div className="flex gap-[24px] border-b border-[#d4c2c3] mb-[24px]">
          <button 
            onClick={() => setActiveTab('proximos')}
            className={`pb-[16px] font-semibold text-[14px] transition-all relative ${
              activeTab === 'proximos' 
                ? 'text-primary' 
                : 'text-secondary'
            }`}
          >
            Próximos
            {activeTab === 'proximos' && (
              <span className="absolute bottom-[-1px] left-0 right-0 height-[2px] bg-primary rounded-[2px] border-b-2 border-primary"></span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('concluidos')}
            className={`pb-[16px] font-semibold text-[14px] transition-all relative ${
              activeTab === 'concluidos' 
                ? 'text-primary' 
                : 'text-secondary'
            }`}
          >
            Concluídos
            {activeTab === 'concluidos' && (
              <span className="absolute bottom-[-1px] left-0 right-0 height-[2px] bg-primary rounded-[2px] border-b-2 border-primary"></span>
            )}
          </button>
        </div>

        {activeTab === 'proximos' && (
          <section className="space-y-[16px] animate-fade-in-up">
            {MOCK_UPCOMING.map(item => (
              <div key={item.id} className="bg-white rounded-xl p-[16px] shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-[#e2e2e2]/30">
                <div className="flex justify-between items-start mb-[16px]">
                  <div className="flex gap-[16px]">
                    <div className="w-12 h-12 rounded-lg bg-[#ffdadc] flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">{item.icon}</span>
                    </div>
                    <div>
                      <h3 className="font-serif text-[24px] font-semibold text-on-surface">{item.service}</h3>
                      <p className="font-sans text-[14px] font-semibold text-secondary">Profissional: {item.professional}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-[16px] py-[16px] border-y border-[#e2e2e2]/50 mb-[16px]">
                  <div className="flex items-center gap-[4px] text-primary">
                    <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                    <span className="font-semibold text-[14px]">{item.date}</span>
                  </div>
                  <div className="flex items-center gap-[4px] text-primary">
                    <span className="material-symbols-outlined text-[18px]">schedule</span>
                    <span className="font-semibold text-[14px]">{item.time}</span>
                  </div>
                </div>
                <button className="w-full py-[16px] rounded-lg font-semibold text-[14px] text-[#ba1a1a] hover:bg-[#ffdad6]/20 transition-colors border border-[#ba1a1a]/20 active:scale-[0.98] duration-150">
                  Cancelar Agendamento
                </button>
              </div>
            ))}
          </section>
        )}

        {activeTab === 'concluidos' && (
          <section className="space-y-[16px] animate-fade-in-up">
            {MOCK_PAST.map(item => (
              <div key={item.id} className="bg-white rounded-xl p-[16px] shadow-[0px_4px_20px_rgba(0,0,0,0.04)] flex justify-between items-center group cursor-pointer hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-[#e8b4b8]">
                <div className="flex gap-[16px] items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#ffdadc]">
                    <img className="w-full h-full object-cover" src={item.image} alt={item.service} />
                  </div>
                  <div>
                    <h4 className="font-serif text-[24px] font-semibold text-on-surface">{item.service}</h4>
                    <p className="font-semibold text-[14px] text-secondary">{item.date}</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className="block font-serif text-[24px] font-semibold text-primary mb-1">R$ {item.price}</span>
                  <span className="font-medium text-[12px] text-[#504e4d] bg-[#cac6c4] px-2 py-[2px] rounded-full">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </section>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-[16px] py-[12px] bg-white shadow-[0px_-4px_20px_rgba(0,0,0,0.04)] rounded-t-xl">
        <button onClick={() => navigate(`/${tenant_slug}/agendar/servicos`)} className="flex flex-col items-center justify-center text-secondary hover:bg-[#f3f3f4] rounded-lg px-[16px] py-[4px] transition-colors duration-200">
          <span className="material-symbols-outlined mb-[4px]">calendar_month</span>
          <span className="font-semibold text-[14px]">Agendar</span>
        </button>
        <button className="flex flex-col items-center justify-center bg-[#e8b4b8] text-[#6b4448] rounded-full px-[24px] py-[4px]">
          <span className="material-symbols-outlined mb-[4px]" style={{ fontVariationSettings: "'FILL' 1" }}>history</span>
          <span className="font-semibold text-[14px]">Histórico</span>
        </button>
        <button className="flex flex-col items-center justify-center text-secondary hover:bg-[#f3f3f4] rounded-lg px-[16px] py-[4px] transition-colors duration-200">
          <span className="material-symbols-outlined mb-[4px]">person</span>
          <span className="font-semibold text-[14px]">Perfil</span>
        </button>
      </nav>
    </div>
  );
};

export default HistoricoAgendamentos;

