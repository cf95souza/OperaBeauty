import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTenant } from '../context/TenantContext';
import { useBooking } from '../context/BookingContext';
import { supabase } from '../lib/supabase';

// Helper functions for slots
const generateSlots = (start, end) => {
  const slots = [];
  for (let i = start; i <= end; i++) {
    slots.push(`${i.toString().padStart(2, '0')}:00`);
  }
  return slots;
};

const MORNING_HOURS = generateSlots(8, 11);
const AFTERNOON_HOURS = generateSlots(13, 17);
const EVENING_HOURS = generateSlots(18, 20);

const AgendamentoHorarios = () => {
  const { tenant_slug } = useParams();
  const navigate = useNavigate();
  const { tenant } = useTenant();
  const { bookingData, updateBooking } = useBooking();
  
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState(bookingData.time || null);
  const [bookedTimes, setBookedTimes] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(true);

  useEffect(() => {
    if (!tenant) return;
    const fetchAppointments = async () => {
      setLoadingSlots(true);
      let query = supabase
        .from('cap_appointments')
        .select('start_time')
        .eq('tenant_id', tenant.id)
        .gte('start_time', `${selectedDate}T00:00:00`)
        .lt('start_time', `${selectedDate}T23:59:59`)
        .neq('status', 'cancelled');
      
      if (bookingData.professional?.id) {
        query = query.eq('staff_id', bookingData.professional.id);
      }

      const { data, error } = await query;
      if (!error && data) {
        // Extract just the HH:MM from start_time
        const times = data.map(app => {
          const dt = new Date(app.start_time);
          return `${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}`;
        });
        setBookedTimes(times);
      }
      setLoadingSlots(false);
    };
    fetchAppointments();
  }, [tenant, selectedDate, bookingData.professional]);

  const handleSelectTime = (time) => {
    setSelectedTime(time);
    updateBooking('date', selectedDate);
    updateBooking('time', time);
  };

  const handleContinue = () => {
    if (selectedTime && selectedDate) {
      navigate(`/${tenant_slug}/agendar/revisao`);
    }
  };

  const renderSlot = (timeStr) => {
    const isSelected = selectedTime === timeStr;
    const isBooked = bookedTimes.includes(timeStr);
    
    if (isBooked) {
      return (
        <button key={timeStr} disabled className="px-[8px] py-[16px] rounded-xl bg-[#eeeeee] text-secondary opacity-50 cursor-not-allowed font-semibold text-[14px] flex flex-col items-center gap-[4px]">
          <span>{timeStr}</span>
          <span className="text-[10px]">Lotado</span>
        </button>
      );
    }

    return (
      <button 
        key={timeStr}
        onClick={() => handleSelectTime(timeStr)}
        className={`relative px-[8px] py-[16px] rounded-xl font-semibold text-[14px] text-center transition-all ${
          isSelected 
            ? 'bg-primary-container text-on-primary-container border-primary shadow-md scale-95' 
            : 'bg-white shadow-[0px_4px_20px_rgba(0,0,0,0.04)] text-on-surface hover:border-primary border border-transparent'
        }`}
      >
        {timeStr}
        {isSelected && (
          <span className="material-symbols-outlined text-[16px] absolute -top-1 -right-1 bg-primary text-white rounded-full p-[2px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
        )}
      </button>
    );
  };

  return (
    <div className="font-body-md text-on-surface bg-[#f9f9f9] min-h-screen pb-[120px]">
      <header className="w-full top-0 sticky z-50 bg-[#f9f9f9] shadow-sm transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-center px-[16px] py-[8px] w-full max-w-7xl mx-auto">
          <button onClick={() => navigate(-1)} className="text-primary hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline-md text-[24px] font-semibold text-primary tracking-tight">Seleção de Horário</h1>
          <div className="w-8 h-8 rounded-full bg-[#e4e2e1] overflow-hidden">
             <span className="material-symbols-outlined mt-1 text-[#656464] ml-1">person</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-[16px] py-[16px]">
        <section className="mb-[40px] animate-fade-in-up">
          <div className="flex items-center justify-between mb-[16px]">
            <h2 className="font-serif text-[24px] font-semibold text-on-surface">Data Selecionada</h2>
          </div>

          <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] p-[16px]">
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedTime(null);
                updateBooking('time', null);
              }}
              min={today}
              className="w-full text-center font-headline-md text-primary bg-transparent outline-none cursor-pointer"
            />
          </div>
        </section>

        <section className="space-y-[40px] animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-baseline justify-between border-b border-[#e2e2e2] pb-[4px]">
            <h2 className="font-serif text-[24px] font-semibold text-on-surface">Horários Disponíveis</h2>
            {loadingSlots && <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>}
          </div>

          <div className="space-y-[16px]">
            <div className="flex items-center gap-[8px] text-primary">
              <span className="material-symbols-outlined text-[20px]">light_mode</span>
              <h3 className="font-semibold text-[14px] uppercase tracking-widest">Manhã</h3>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-[8px]">
              {MORNING_HOURS.map(renderSlot)}
            </div>
          </div>

          <div className="space-y-[16px]">
            <div className="flex items-center gap-[8px] text-primary">
              <span className="material-symbols-outlined text-[20px]">sunny</span>
              <h3 className="font-semibold text-[14px] uppercase tracking-widest">Tarde</h3>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-[8px]">
              {AFTERNOON_HOURS.map(renderSlot)}
            </div>
          </div>

          <div className="space-y-[16px]">
            <div className="flex items-center gap-[8px] text-primary">
              <span className="material-symbols-outlined text-[20px]">bedtime</span>
              <h3 className="font-semibold text-[14px] uppercase tracking-widest">Noite</h3>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-[8px]">
              {EVENING_HOURS.map(renderSlot)}
            </div>
          </div>
        </section>
      </main>

      {selectedTime && (
        <div className="fixed bottom-0 left-0 w-full z-50 bg-white shadow-[0px_-4px_20px_rgba(0,0,0,0.04)] p-[16px] flex flex-col gap-[16px] md:flex-row md:items-center md:justify-between border-t border-[#e2e2e2] animate-fade-in-up">
          <div className="hidden md:flex flex-col">
            <span className="font-medium text-[12px] text-secondary">Horário Selecionado</span>
            <span className="font-serif text-[24px] font-semibold text-primary">{selectedDate.split('-').reverse().join('/')}, {selectedTime}</span>
          </div>
          <button 
            onClick={handleContinue}
            className="w-full md:w-auto px-[40px] py-[24px] bg-primary text-white rounded-xl font-semibold text-[14px] uppercase tracking-widest shadow-lg hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-[8px]"
          >
            <span>Confirmar Agendamento</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default AgendamentoHorarios;
