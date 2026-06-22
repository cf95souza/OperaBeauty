import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTenant } from '../../context/TenantContext';
import { supabase } from '../../lib/supabase';

const BrandingCustomizacao = () => {
  const { tenant_slug } = useParams();
  const { tenant } = useTenant();
  
  const [branding, setBranding] = useState({
    name: 'Salão',
    slug: '',
    primary_color: '#7c5357',
    secondary_color: '#eeb9bd',
    tertiary_color: '#f9f9f9',
    logo_url: '',
    banner_url: '',
    banner_title: 'Pacote Rejuvenescimento',
    banner_subtitle: '20% off em todas as massagens nesta estação.',
    welcome_message: 'Bem-vindo ao salão. Agende seu próximo momento de tranquilidade abaixo.'
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (tenant) {
      setBranding({
        name: tenant.name || 'Salão',
        slug: tenant.slug || '',
        primary_color: tenant.primary_color || '#7c5357',
        secondary_color: tenant.secondary_color || '#eeb9bd',
        tertiary_color: tenant.tertiary_color || '#f9f9f9',
        logo_url: tenant.logo_url || '',
        banner_url: tenant.banner_url || '',
        banner_title: tenant.banner_title || 'Pacote Rejuvenescimento',
        banner_subtitle: tenant.banner_subtitle || '20% off em todas as massagens nesta estação.',
        welcome_message: tenant.welcome_message || 'Bem-vindo ao salão. Agende seu próximo momento de tranquilidade abaixo.'
      });
    }
  }, [tenant]);

  const handleSave = async () => {
    if (!tenant) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('cap_tenants')
        .update({
          name: branding.name,
          slug: branding.slug,
          primary_color: branding.primary_color,
          secondary_color: branding.secondary_color,
          tertiary_color: branding.tertiary_color,
          logo_url: branding.logo_url,
          banner_url: branding.banner_url,
          banner_title: branding.banner_title,
          banner_subtitle: branding.banner_subtitle,
          welcome_message: branding.welcome_message
        })
        .eq('id', tenant.id);
      
      if (error) throw error;
      
      // Update local CSS vars for immediate feedback
      document.documentElement.style.setProperty('--color-primary', branding.primary_color);
      document.documentElement.style.setProperty('--color-primary-container', branding.secondary_color);
      document.documentElement.style.setProperty('--color-surface-container-lowest', branding.tertiary_color);
      alert('Configurações salvas com sucesso!');
      
      // If slug changed, we must reload the app to the new URL
      if (branding.slug && branding.slug !== tenant_slug) {
        window.location.href = `/${branding.slug}/staff/admin/branding`;
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar configurações.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setBranding({
      ...branding,
      primary_color: '#7c5357',
      secondary_color: '#eeb9bd',
      tertiary_color: '#f9f9f9'
    });
  };

  return (
    <>
      <div className="flex-1 p-container-margin md:p-xl max-w-[1200px] mx-auto w-full animate-fade-in-up pb-32 md:pb-xl">
        <header className="mb-xl flex justify-between items-end">
          <div>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-2">Branding & Customização</h1>
            <p className="font-body-lg text-body-lg text-secondary">Molde a identidade digital e a experiência do cliente do {tenant?.name || 'Salão'}.</p>
          </div>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="hidden md:flex items-center gap-2 bg-primary text-on-primary px-lg py-3 rounded-lg font-label-md text-label-md hover:bg-on-primary-container transition-colors shadow-sm disabled:opacity-50"
          >
            <span className="material-symbols-outlined">{saving ? 'sync' : 'save'}</span> {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
          
          {/* Identidade e Link Card */}
          <section className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] p-lg flex flex-col">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-md flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">storefront</span> Identidade e Link
            </h2>
            <div className="mb-4">
               <label className="font-label-sm text-label-sm text-secondary block mb-1">Nome do Salão</label>
               <input 
                  className="w-full border border-outline-variant rounded-lg p-2 font-body-md text-body-md focus:border-primary outline-none" 
                  type="text" 
                  placeholder="Nome do Salão"
                  value={branding.name}
                  onChange={e => setBranding({...branding, name: e.target.value})}
               />
            </div>
            <div className="mb-4">
               <label className="font-label-sm text-label-sm text-secondary block mb-1">Link do Salão (Slug)</label>
               <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden focus-within:border-primary transition-colors">
                 <span className="bg-surface-variant text-secondary px-3 py-2 font-body-md text-body-md border-r border-outline-variant select-none">
                   app.com/
                 </span>
                 <input 
                    className="w-full p-2 font-body-md text-body-md outline-none bg-transparent" 
                    type="text" 
                    placeholder="meu-salao"
                    value={branding.slug}
                    onChange={e => setBranding({...branding, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})}
                 />
               </div>
            </div>
            
            <div className="mt-auto bg-error/10 border border-error/20 p-3 rounded-lg flex items-start gap-2">
              <span className="material-symbols-outlined text-error text-[18px] mt-0.5">warning</span>
              <p className="font-body-sm text-[12px] text-error">
                <strong>Cuidado:</strong> Alterar o "Link do Salão" quebrará todos os links antigos enviados aos clientes. Eles precisarão usar o novo link para acessar.
              </p>
            </div>
          </section>

          {/* Logo URL Card */}
          <section className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] p-lg flex flex-col">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-md flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">image</span> Logo
            </h2>
            <p className="text-sm text-secondary mb-4">Insira o link (URL) direto da imagem da sua logo para economizar armazenamento.</p>
            <div className="mb-4">
               <label className="font-label-sm text-label-sm text-secondary block mb-1">URL da Logo</label>
               <input 
                  className="w-full border border-outline-variant rounded-lg p-2 font-body-md text-body-md focus:border-primary outline-none" 
                  type="url" 
                  placeholder="https://exemplo.com/logo.png"
                  value={branding.logo_url}
                  onChange={e => setBranding({...branding, logo_url: e.target.value})}
               />
            </div>
            
            <div className="mt-auto flex items-center gap-md p-4 bg-surface-bright rounded-lg border border-outline-variant">
              <div className="w-16 h-16 rounded-lg bg-surface-variant flex items-center justify-center overflow-hidden">
                {branding.logo_url ? (
                   <img src={branding.logo_url} alt="Logo Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
                ) : (
                   <span className="font-bold text-tertiary">LG</span>
                )}
              </div>
              <div className="flex-1">
                <p className="font-label-sm text-label-sm text-secondary">Visualização</p>
                <p className="font-body-md text-body-md text-on-surface truncate">{branding.logo_url ? 'Logo Ativa' : 'Sem logo configurada'}</p>
              </div>
            </div>
          </section>

          {/* Brand Colors Card */}
          <section className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] p-lg">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-md flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">colors</span> Paleta de Cores
            </h2>
            <div className="space-y-md">
              <div>
                <label className="font-label-md text-label-md text-on-surface block mb-2">Cor Primária</label>
                <div className="flex items-center gap-3">
                  <input 
                    className="h-10 w-10 rounded cursor-pointer border-0 p-0" 
                    type="color" 
                    value={branding.primary_color}
                    onChange={e => setBranding({...branding, primary_color: e.target.value})}
                  />
                  <input 
                    className="flex-1 border-b border-outline-variant bg-transparent py-2 font-body-md text-body-md focus:border-primary focus:outline-none transition-colors uppercase" 
                    type="text" 
                    value={branding.primary_color}
                    onChange={e => setBranding({...branding, primary_color: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="font-label-md text-label-md text-on-surface block mb-2">Cor Secundária</label>
                <div className="flex items-center gap-3">
                  <input 
                    className="h-10 w-10 rounded cursor-pointer border-0 p-0" 
                    type="color" 
                    value={branding.secondary_color}
                    onChange={e => setBranding({...branding, secondary_color: e.target.value})}
                  />
                  <input 
                    className="flex-1 border-b border-outline-variant bg-transparent py-2 font-body-md text-body-md focus:border-primary focus:outline-none transition-colors uppercase" 
                    type="text" 
                    value={branding.secondary_color}
                    onChange={e => setBranding({...branding, secondary_color: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="font-label-md text-label-md text-on-surface block mb-2">Background (Terciária)</label>
                <div className="flex items-center gap-3">
                  <input 
                    className="h-10 w-10 rounded cursor-pointer border-0 p-0" 
                    type="color" 
                    value={branding.tertiary_color}
                    onChange={e => setBranding({...branding, tertiary_color: e.target.value})}
                  />
                  <input 
                    className="flex-1 border-b border-outline-variant bg-transparent py-2 font-body-md text-body-md focus:border-primary focus:outline-none transition-colors uppercase" 
                    type="text" 
                    value={branding.tertiary_color}
                    onChange={e => setBranding({...branding, tertiary_color: e.target.value})}
                  />
                </div>
              </div>
            </div>
            <button onClick={handleReset} className="mt-lg w-full bg-surface-variant text-on-surface px-4 py-2 rounded-lg font-label-md text-label-md hover:bg-secondary-container transition-colors">
              Restaurar Padrões
            </button>
          </section>

          {/* Client App Home Screen Editor */}
          <section className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] p-lg lg:col-span-2">
            <h2 className="font-headline-md text-headline-md text-on-surface mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">view_quilt</span> App do Cliente
            </h2>
            <p className="font-body-md text-body-md text-secondary mb-lg">Gerencie o banner promocional e a mensagem de boas-vindas exibida aos clientes na tela inicial.</p>
            
            <div className="space-y-lg">
              {/* Banner Item */}
              <div className="flex flex-col md:flex-row gap-lg p-md border border-surface-variant rounded-lg bg-surface-bright items-start relative group">
                <div className="w-full md:w-48 h-32 bg-surface-variant rounded-lg overflow-hidden relative flex items-center justify-center">
                  {branding.banner_url ? (
                     <img src={branding.banner_url} alt="Banner" className="w-full h-full object-cover" onError={(e) => e.target.style.display='none'} />
                  ) : (
                     <span className="material-symbols-outlined text-4xl text-on-surface-variant">photo</span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-2 pointer-events-none">
                    <span className="font-label-sm text-label-sm text-white">Banner Promoção</span>
                  </div>
                </div>
                <div className="flex-1 w-full space-y-4">
                  <div>
                    <label className="font-label-sm text-label-sm text-secondary block mb-1">URL da Imagem do Banner</label>
                    <input 
                       className="w-full border-b border-outline-variant bg-transparent py-1 font-body-md text-body-md focus:border-primary focus:outline-none transition-colors" 
                       type="url" 
                       placeholder="https://exemplo.com/banner.jpg"
                       value={branding.banner_url}
                       onChange={e => setBranding({...branding, banner_url: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="font-label-sm text-label-sm text-secondary block mb-1">Título da Promoção</label>
                    <input 
                       className="w-full border-b border-outline-variant bg-transparent py-1 font-body-md text-body-md focus:border-primary focus:outline-none transition-colors" 
                       type="text" 
                       placeholder="Ex: Pacote Rejuvenescimento"
                       value={branding.banner_title}
                       onChange={e => setBranding({...branding, banner_title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="font-label-sm text-label-sm text-secondary block mb-1">Subtítulo / Mensagem</label>
                    <input 
                       className="w-full border-b border-outline-variant bg-transparent py-1 font-body-md text-body-md focus:border-primary focus:outline-none transition-colors" 
                       type="text" 
                       placeholder="Ex: 20% off em todas as massagens nesta estação."
                       value={branding.banner_subtitle}
                       onChange={e => setBranding({...branding, banner_subtitle: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Welcome Message */}
              <div className="p-md border border-surface-variant rounded-lg bg-surface-bright">
                <label className="font-label-md text-label-md text-on-surface block mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-sm">edit_note</span> Mensagem de Boas-vindas
                </label>
                <textarea 
                   className="w-full border border-outline-variant rounded-lg p-3 bg-transparent font-body-md text-body-md focus:border-primary focus:outline-none transition-colors resize-none h-24" 
                   placeholder="Digite a saudação..." 
                   value={branding.welcome_message}
                   onChange={e => setBranding({...branding, welcome_message: e.target.value})}
                />
              </div>
            </div>
          </section>

        </div>
        
        {/* Mobile Save Button Sticky Bottom */}
        <div className="md:hidden fixed bottom-0 left-0 w-full p-4 pb-safe bg-surface/90 backdrop-blur-md border-t border-surface-variant z-40">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-primary text-on-primary px-lg py-3 rounded-lg font-label-md text-label-md flex justify-center items-center gap-2 shadow-sm disabled:opacity-50"
          >
            <span className="material-symbols-outlined">{saving ? 'sync' : 'save'}</span> {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </div>
      </div>
    </>
  );
};

export default BrandingCustomizacao;
