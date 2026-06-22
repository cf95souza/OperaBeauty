import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTenant } from '../context/TenantContext';

const ResumoAgendamento = () => {
  const { tenant_slug, id } = useParams();
  const navigate = useNavigate();
  const { tenant } = useTenant();

  // Dados mockados para exibição. Na integração, buscaremos pelo 'id'
  const agendamento = {
    id: id || '1',
    clienteNome: 'Mariana Silva',
    clienteTelefone: '(11) 98765-4321',
    servico: 'Corte Feminino & Escova',
    profissional: 'Ana Clara',
    data: 'Terça-feira, 24 de Outubro',
    horario: '09:00',
    duracao: '60m',
    status: 'EM ANDAMENTO', // AGENDADO, EM ANDAMENTO, CONCLUÍDO
    valor: 'R$ 120,00'
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'EM ANDAMENTO': return 'bg-primary text-on-primary';
      case 'CONCLUÍDO': return 'bg-secondary text-on-secondary';
      default: return 'bg-surface-variant text-on-surface-variant';
    }
  };

  return (
    <div className="max-w-[800px] mx-auto py-lg animate-fade-in-up">
      {/* Header com botão de voltar */}
      <div className="flex items-center gap-4 mb-xl">
        <button 
          onClick={() => navigate(`/${tenant_slug}/staff/agenda-profissional`)}
          className="p-2 rounded-full hover:bg-surface-variant text-on-surface transition-colors flex items-center justify-center"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h1 className="font-headline-md text-headline-md text-primary">Resumo do Agendamento</h1>
          <p className="font-body-md text-body-md text-secondary">Detalhes do atendimento</p>
        </div>
      </div>

      {/* Card Principal */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-[0px_10px_30px_rgba(0,0,0,0.08)] p-md md:p-xl mb-xl">
        
        {/* Status Badge */}
        <div className="flex justify-between items-start mb-lg">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-xl font-bold">
              {agendamento.clienteNome.charAt(0)}
            </div>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface">{agendamento.clienteNome}</h2>
              <p className="font-body-md text-body-md text-secondary">{agendamento.clienteTelefone}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full font-label-sm text-[12px] uppercase tracking-wider ${getStatusColor(agendamento.status)}`}>
            {agendamento.status}
          </span>
        </div>

        <hr className="border-surface-variant mb-lg" />

        {/* Detalhes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-xl">
          <div>
            <p className="font-label-sm text-label-sm text-secondary mb-1">Serviço</p>
            <p className="font-body-lg text-body-lg text-on-surface font-medium">{agendamento.servico}</p>
            <p className="font-body-sm text-body-sm text-tertiary mt-1">Duração estimada: {agendamento.duracao}</p>
          </div>
          <div>
            <p className="font-label-sm text-label-sm text-secondary mb-1">Data e Horário</p>
            <p className="font-body-lg text-body-lg text-on-surface font-medium">{agendamento.data} às {agendamento.horario}</p>
          </div>
          <div>
            <p className="font-label-sm text-label-sm text-secondary mb-1">Profissional</p>
            <p className="font-body-lg text-body-lg text-on-surface font-medium">{agendamento.profissional}</p>
          </div>
          <div>
            <p className="font-label-sm text-label-sm text-secondary mb-1">Valor</p>
            <p className="font-body-lg text-body-lg text-primary font-medium">{agendamento.valor}</p>
          </div>
        </div>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-4 mt-xl">
          {agendamento.status === 'AGENDADO' && (
            <button className="flex-1 bg-secondary text-on-secondary px-6 py-3 rounded-xl font-label-lg text-label-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm">
              <span className="material-symbols-outlined">play_arrow</span>
              Iniciar Atendimento
            </button>
          )}
          {agendamento.status === 'EM ANDAMENTO' && (
            <button className="flex-1 bg-primary text-on-primary px-6 py-3 rounded-xl font-label-lg text-label-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm">
              <span className="material-symbols-outlined">check_circle</span>
              Finalizar Atendimento
            </button>
          )}
          
          <Link 
            to={`/${tenant_slug}/staff/ficha-cliente/${agendamento.id}`}
            className="flex-1 border-2 border-primary text-primary px-6 py-3 rounded-xl font-label-lg text-label-lg hover:bg-primary hover:text-on-primary transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">assignment_ind</span>
            Ver Ficha do Cliente
          </Link>
        </div>
        
      </div>
      
    </div>
  );
};

export default ResumoAgendamento;
