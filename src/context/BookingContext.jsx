import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext({});

export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const [bookingData, setBookingData] = useState({
    service: null, // { id, name, price, duration, image }
    professional: null, // { id, name, role, image } ou null para "Sem Preferência"
    date: null, // "YYYY-MM-DD"
    time: null, // "HH:MM"
  });

  const updateBooking = (key, value) => {
    setBookingData((prev) => ({ ...prev, [key]: value }));
  };

  const clearBooking = () => {
    setBookingData({
      service: null,
      professional: null,
      date: null,
      time: null,
    });
  };

  return (
    <BookingContext.Provider value={{ bookingData, updateBooking, clearBooking }}>
      {children}
    </BookingContext.Provider>
  );
};
