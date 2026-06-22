import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const TenantContext = createContext({});

export const useTenant = () => useContext(TenantContext);

export const TenantProvider = ({ children }) => {
  const { tenant_slug } = useParams();
  const [tenant, setTenant] = useState(null);
  const [session, setSession] = useState(null); // { id, name, role, tenant_id }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const initializeTenant = async () => {
      setLoading(true);
      try {
        if (!tenant_slug) return;

        // 1. Busca os dados do Salão
        const { data: tenantData, error: tenantError } = await supabase
          .from('cap_tenants')
          .select('*')
          .eq('slug', tenant_slug)
          .eq('status', 'active')
          .maybeSingle();

        if (tenantError || !tenantData) {
          console.error("Salão não encontrado ou inativo.");
          if (isMounted) setLoading(false);
          return;
        }

        if (isMounted) setTenant(tenantData);

        // 2. Aplica as cores do Salão (White Label)
        if (tenantData.primary_color) {
          document.documentElement.style.setProperty('--color-primary', tenantData.primary_color);
        }
        if (tenantData.secondary_color) {
          document.documentElement.style.setProperty('--color-primary-container', tenantData.secondary_color);
        }

        // 3. Tenta recuperar a sessão do usuário (isolada para este tenant)
        const savedSession = localStorage.getItem(`cap_session_${tenantData.id}`);
        if (savedSession) {
          const parsedSession = JSON.parse(savedSession);
          if (isMounted) setSession(parsedSession);
        }

      } catch (err) {
        console.error("Erro ao inicializar Tenant:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeTenant();

    return () => {
      isMounted = false;
    };
  }, [tenant_slug]);

  // Login Cliente via RPC
  const loginClient = async (phone, password) => {
    if (!tenant) throw new Error("Salão não carregado.");
    const { data, error } = await supabase.rpc('cap_login_client', {
      p_tenant_id: tenant.id,
      p_phone: phone,
      p_password: password
    });
    if (error) throw new Error(error.message);
    setSession(data);
    localStorage.setItem(`cap_session_${tenant.id}`, JSON.stringify(data));
    return data;
  };

  // Login Staff via RPC
  const loginStaff = async (phone, password) => {
    if (!tenant) throw new Error("Salão não carregado.");
    const { data, error } = await supabase.rpc('cap_login_staff', {
      p_tenant_id: tenant.id,
      p_phone: phone,
      p_password: password
    });
    if (error) throw new Error(error.message);
    setSession(data);
    localStorage.setItem(`cap_session_${tenant.id}`, JSON.stringify(data));
    return data;
  };

  // Função central para processar Login (legado ou custom)
  const login = (userData) => {
    if (!tenant) return;
    setSession(userData);
    localStorage.setItem(`cap_session_${tenant.id}`, JSON.stringify(userData));
  };

  // Função central para Logout
  const logout = () => {
    if (!tenant) return;
    setSession(null);
    localStorage.removeItem(`cap_session_${tenant.id}`);
  };

  return (
    <TenantContext.Provider value={{ tenant, session, loading, login, loginClient, loginStaff, logout }}>
      {children}
    </TenantContext.Provider>
  );
};
