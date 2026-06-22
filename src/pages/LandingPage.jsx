import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  useEffect(() => {
    // Smooth scroll implementation
    const anchors = document.querySelectorAll('a[href^="#"]');
    const handleScroll = function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if(target) target.scrollIntoView({ behavior: 'smooth' });
    };
    anchors.forEach(anchor => anchor.addEventListener('click', handleScroll));

    // Header scroll effect
    const handleWindowScroll = () => {
        const header = document.querySelector('header');
        if(!header) return;
        if (window.scrollY > 50) {
            header.classList.add('py-2', 'shadow-md');
            header.classList.remove('h-20');
            header.classList.add('h-16');
        } else {
            header.classList.remove('py-2', 'shadow-md');
            header.classList.remove('h-16');
            header.classList.add('h-20');
        }
    };
    window.addEventListener('scroll', handleWindowScroll);

    // Intersection Observer for fade-in animations
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('opacity-100', 'translate-y-0');
                entry.target.classList.remove('opacity-0', 'translate-y-10');
            }
        });
    }, observerOptions);

    const elements = document.querySelectorAll('section > div');
    elements.forEach(el => {
        el.classList.add('transition-all', 'duration-1000', 'opacity-0', 'translate-y-10');
        observer.observe(el);
    });

    return () => {
        anchors.forEach(anchor => anchor.removeEventListener('click', handleScroll));
        window.removeEventListener('scroll', handleWindowScroll);
        elements.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="bg-background text-on-surface font-body-md selection:bg-primary-container selection:text-on-primary-container">
      <style>{`
        .premium-shadow { box-shadow: 0px 4px 20px rgba(0,0,0,0.04); }
        .premium-shadow-lg { box-shadow: 0px 10px 30px rgba(0,0,0,0.08); }
        .glass-nav { backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
      `}</style>
      
{/*  Top Navigation Bar  */}
<header className="fixed top-0 w-full z-50 bg-surface/80 glass-nav shadow-sm transition-all duration-300">
<div className="max-w-7xl mx-auto px-container-margin flex justify-between items-center h-20">
<div className="flex items-center">
<span className="font-headline-md text-headline-md font-bold tracking-tight text-primary">OperaBeauty</span>
</div>
<nav className="hidden md:flex items-center space-x-lg">
<a className="font-body-md text-label-md text-primary border-b-2 border-primary pb-1" href="#features">Features</a>
<a className="font-body-md text-label-md text-secondary hover:text-primary transition-colors duration-200" href="#pricing">Pricing</a>
<a className="font-body-md text-label-md text-secondary hover:text-primary transition-colors duration-200" href="#">Portfolio</a>
<a className="font-body-md text-label-md text-secondary hover:text-primary transition-colors duration-200" href="#">Resources</a>
</nav>
<div className="flex items-center">
<button className="bg-primary text-on-primary font-label-md text-label-md px-lg py-sm rounded-full hover:opacity-80 transition-opacity">Get Started</button>
</div>
</div>
</header>
<main className="pt-20">
{/*  Hero Section  */}
<section className="relative overflow-hidden bg-background py-xl md:py-32">
<div className="max-w-7xl mx-auto px-container-margin grid grid-cols-1 md:grid-cols-2 gap-xl items-center">
<div className="space-y-lg z-10">
<span className="inline-block px-md py-xs bg-primary-container text-on-primary-container rounded-full text-label-sm font-semibold tracking-wider">PREMIUM SAAS SOLUTION</span>
<h1 className="font-display-lg text-display-lg text-on-surface">Transforme a gestão do seu salão com elegância</h1>
<p className="font-body-lg text-body-lg text-secondary max-w-lg">OperaBeauty combina inteligência operacional com uma interface serena, permitindo que você foque no que realmente importa: a experiência dos seus clientes.</p>
<div className="flex flex-wrap gap-md pt-md">
<button className="bg-primary text-on-primary px-lg py-md rounded-xl font-label-md text-label-md premium-shadow hover:-translate-y-1 transition-all duration-300">Começar Agora</button>
<button className="bg-on-background text-on-primary px-lg py-md rounded-xl font-label-md text-label-md premium-shadow hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
<span className="material-symbols-outlined">play_circle</span>
                            Agendar Demo
                        </button>
</div>
</div>
<div className="relative mt-xl md:mt-0">
<div className="absolute -top-10 -right-10 w-64 h-64 bg-primary-container/20 blur-3xl rounded-full"></div>
<div className="bg-surface-container-low p-base rounded-3xl premium-shadow-lg rotate-3 hover:rotate-0 transition-transform duration-700 overflow-hidden">
<img className="w-full h-auto rounded-2xl" data-alt="A professional high-fidelity software dashboard interface mockup displayed on a sleek, silver laptop screen. The UI features a soft rose and deep charcoal color palette, minimalist charts, and elegant typography. The laptop is placed on a clean white marble surface with a soft-focus spa background with a green plant leaf. Natural morning sunlight creates soft shadows and a premium, tranquil mood." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBd0G3KdYCei2MD6wJjFSIycAbDX9XW_OtYN1ahgdqO-W07l7BqUzCipbMCK7ASw9nva0QjY6LsXSKidFKchEbRqcwySHA5og1F_mr442k9rQ3UUbZZaWbqQEjZjw0VTx72JwsalFW3ysOzcX1U6X8va-IW0pHe6v_qf0Cy0Eb21fMXed64lslugPvP0qkmSVTaRv8izoVXKoSFrGj4wIUX20oSOIeiybE7OtX0MkZ0YrJwWVjAafZF29QBku3a_lnDkGwhrqbOqvz8"/>
</div>
</div>
</div>
</section>
{/*  Social Proof/Stats  */}
<section className="bg-surface-container py-lg border-y border-outline-variant/20">
<div className="max-w-7xl mx-auto px-container-margin">
<div className="grid grid-cols-1 md:grid-cols-3 gap-lg text-center divide-y md:divide-y-0 md:divide-x divide-outline-variant/30">
<div className="py-md md:py-0">
<div className="font-headline-lg text-headline-lg text-primary">1.200+</div>
<div className="text-label-md text-secondary uppercase tracking-widest mt-1">Salões Parceiros</div>
</div>
<div className="py-md md:py-0">
<div className="font-headline-lg text-headline-lg text-primary">50k+</div>
<div className="text-label-md text-secondary uppercase tracking-widest mt-1">Agendamentos Mensais</div>
</div>
<div className="py-md md:py-0">
<div className="font-headline-lg text-headline-lg text-primary">4.9/5</div>
<div className="text-label-md text-secondary uppercase tracking-widest mt-1">Satisfação Geral</div>
</div>
</div>
</div>
</section>
{/*  Features Grid  */}
<section className="py-32 bg-background" id="features">
<div className="max-w-7xl mx-auto px-container-margin">
<div className="text-center mb-20">
<h2 className="font-headline-lg text-headline-lg text-on-surface mb-md">Gestão sem esforço, Resultados Excepcionais</h2>
<p className="font-body-md text-body-md text-secondary max-w-2xl mx-auto">Nossas ferramentas foram desenhadas para simplificar a complexidade, permitindo um controle total com apenas alguns cliques.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
{/*  Feature 1  */}
<div className="bg-surface p-xl rounded-2xl premium-shadow group hover:bg-primary-container/10 transition-colors duration-300">
<div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-xl flex items-center justify-center mb-lg group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-3xl">calendar_month</span>
</div>
<h3 className="font-headline-md text-headline-md mb-md">Controle Operacional</h3>
<p className="font-body-md text-secondary">Agenda inteligente que minimiza buracos no horário e gerencia escalas de profissionais automaticamente.</p>
</div>
{/*  Feature 2  */}
<div className="bg-surface p-xl rounded-2xl premium-shadow group hover:bg-primary-container/10 transition-colors duration-300">
<div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-xl flex items-center justify-center mb-lg group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-3xl">analytics</span>
</div>
<h3 className="font-headline-md text-headline-md mb-md">Inteligência Financeira</h3>
<p className="font-body-md text-secondary">Relatórios detalhados de faturamento, comissões e fluxo de caixa em tempo real para decisões precisas.</p>
</div>
{/*  Feature 3  */}
<div className="bg-surface p-xl rounded-2xl premium-shadow group hover:bg-primary-container/10 transition-colors duration-300">
<div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-xl flex items-center justify-center mb-lg group-hover:scale-110 transition-transform">
<span className="material-symbols-outlined text-3xl">star</span>
</div>
<h3 className="font-headline-md text-headline-md mb-md">Experiência Premium</h3>
<p className="font-body-md text-secondary">Interface personalizada para o cliente final, reforçando o branding e a exclusividade do seu salão.</p>
</div>
</div>
</div>
</section>
{/*  Deep Dive Section  */}
<section className="py-xl space-y-32">
{/*  Part 1  */}
<div className="max-w-7xl mx-auto px-container-margin grid grid-cols-1 md:grid-cols-2 gap-xl items-center">
<div className="rounded-2xl overflow-hidden premium-shadow-lg">
<img className="w-full h-auto" data-alt="A clean and modern digital calendar interface for a luxury beauty salon. The design features soft peach and beige tones with elegant serif typography. Professional icons represent different beauty services like hair, nails, and massage. The interface shows a detailed client profile with history and notes, suggesting a high-end CRM integration. Soft lighting and minimal shadows enhance the professional look." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUDYpFY1wr9URrJbVH2TWN_w0U_2_vZxeF5LkYeCeAOdrCEgsSQp3CFG7eWFF38OBL23oS6rdxXnaeSYwoi2Bd86qYpoWzcTMLmERmewDRDnn9EBmwE0jSb5S3Yv0IhEruy7E-lPE-GTVAv8Fw3ZY1bEk4W4iHTXYEPJHIv6MfF4_R8KcqsKh7ebm5eyJUE6tCOVdeFiv-M6pLMDHhMATptQChqtHg-5vuBgenjlImn37wQULU2-MVhGqYb7ZJx_2sGxpf5Y1iCkux"/>
</div>
<div className="space-y-lg md:pl-xl">
<h2 className="font-headline-lg text-headline-lg text-on-surface">Agenda Profissional com CRM Integrado</h2>
<p className="font-body-lg text-body-lg text-secondary">Conheça seu cliente antes mesmo dele sentar na cadeira. Visualize histórico de serviços, preferências de produtos e datas especiais em um único lugar.</p>
<ul className="space-y-md">
<li className="flex items-center gap-md font-label-md text-label-md text-on-surface">
<span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                            Confirmações automáticas via WhatsApp
                        </li>
<li className="flex items-center gap-md font-label-md text-label-md text-on-surface">
<span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                            Ficha de anamnese digital e segura
                        </li>
<li className="flex items-center gap-md font-label-md text-label-md text-on-surface">
<span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                            Histórico fotográfico de procedimentos
                        </li>
</ul>
</div>
</div>
{/*  Part 2  */}
<div className="max-w-7xl mx-auto px-container-margin grid grid-cols-1 md:grid-cols-2 gap-xl items-center">
<div className="order-2 md:order-1 space-y-lg md:pr-xl">
<h2 className="font-headline-lg text-headline-lg text-on-surface">Gestão de Estoque &amp; Branding</h2>
<p className="font-body-lg text-body-lg text-secondary">Nunca mais perca uma venda por falta de produto. O OperaBeauty monitora seu inventário e permite que você crie campanhas de marketing baseadas no comportamento de compra.</p>
<ul className="space-y-md">
<li className="flex items-center gap-md font-label-md text-label-md text-on-surface">
<span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                            Alertas de reposição inteligente
                        </li>
<li className="flex items-center gap-md font-label-md text-label-md text-on-surface">
<span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                            Landing pages personalizadas para o seu salão
                        </li>
<li className="flex items-center gap-md font-label-md text-label-md text-on-surface">
<span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                            Dashboard de ROI de campanhas
                        </li>
</ul>
</div>
<div className="order-1 md:order-2 rounded-2xl overflow-hidden premium-shadow-lg">
<img className="w-full h-auto" data-alt="A sophisticated inventory management dashboard for a premium beauty salon, displaying stock levels of high-end cosmetic bottles. The UI is clean, with minimalist data visualizations, soft rose background accents, and elegant typography. The layout is spacious, conveying a sense of organized efficiency. In the background, a glimpse of a well-designed salon retail shelf with luxury packaging and warm ambient lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAS8Vcs6c1pOa1bJOwog3XEQsZwb4qVooS8otyAWoOL7MIZ5qGGI_xBSEsrP2kH0nfkQN6gGLSRh6zpsV1pok_Ba9NKbr3cuq6IgjGYbZrunqURTmz2YYRsCWoDXDV7zXIXnbZh5cDtvMJqEK3N6w7RTnIw-2dH3LcRfg8_U0MOv9AKf2DASqBuQIOHMyZT53EaJteE36OrOZucwjZ59s8aS-BEsySpATnsjrIGlt7ONaV5SEAichGXapMcVBfKSCr_SeuZkZb1RMnR"/>
</div>
</div>
</section>
{/*  Pricing Table  */}
<section className="py-32 bg-surface-container-low" id="pricing">
<div className="max-w-7xl mx-auto px-container-margin">
<div className="text-center mb-20">
<h2 className="font-headline-lg text-headline-lg text-on-surface">Escolha o Plano para sua Jornada</h2>
<p className="font-body-md text-body-md text-secondary">Planos flexíveis que crescem junto com o seu negócio.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
{/*  Basic  */}
<div className="bg-surface p-xl rounded-3xl premium-shadow border border-outline-variant/30 flex flex-col h-full">
<div className="mb-lg">
<h3 className="font-headline-md text-headline-md text-on-surface mb-2">Básico</h3>
<div className="flex items-baseline gap-1">
<span className="text-label-md text-secondary">R$</span>
<span className="text-4xl font-bold text-on-surface">149</span>
<span className="text-label-sm text-secondary">/mês</span>
</div>
</div>
<ul className="space-y-md flex-grow mb-xl">
<li className="flex items-center gap-2 text-label-md text-secondary">
<span className="material-symbols-outlined text-primary scale-75">done</span> Agenda Digital
                            </li>
<li className="flex items-center gap-2 text-label-md text-secondary">
<span className="material-symbols-outlined text-primary scale-75">done</span> Até 3 Profissionais
                            </li>
<li className="flex items-center gap-2 text-label-md text-secondary">
<span className="material-symbols-outlined text-primary scale-75">done</span> CRM Essencial
                            </li>
<li className="flex items-center gap-2 text-label-md text-secondary">
<span className="material-symbols-outlined text-primary scale-75">done</span> Relatórios Mensais
                            </li>
</ul>
<button className="w-full py-md rounded-xl border border-primary text-primary font-label-md hover:bg-primary/5 transition-colors">Selecionar Plano</button>
</div>
{/*  PRO - Featured  */}
<div className="bg-on-background p-xl rounded-3xl premium-shadow-lg border-2 border-primary-container flex flex-col h-full transform md:-translate-y-4 relative">
<div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary-container text-on-primary-container px-lg py-1 rounded-full text-label-sm font-bold">MAIS POPULAR</div>
<div className="mb-lg">
<h3 className="font-headline-md text-headline-md text-on-primary mb-2">PRO</h3>
<div className="flex items-baseline gap-1">
<span className="text-label-md text-surface-variant">R$</span>
<span className="text-4xl font-bold text-on-primary">299</span>
<span className="text-label-sm text-surface-variant">/mês</span>
</div>
</div>
<ul className="space-y-md flex-grow mb-xl">
<li className="flex items-center gap-2 text-label-md text-surface-variant">
<span className="material-symbols-outlined text-primary-container scale-75" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Tudo no Básico
                            </li>
<li className="flex items-center gap-2 text-label-md text-surface-variant">
<span className="material-symbols-outlined text-primary-container scale-75" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Profissionais Ilimitados
                            </li>
<li className="flex items-center gap-2 text-label-md text-surface-variant">
<span className="material-symbols-outlined text-primary-container scale-75" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> CRM Avançado + Fotos
                            </li>
<li className="flex items-center gap-2 text-label-md text-surface-variant">
<span className="material-symbols-outlined text-primary-container scale-75" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Notificações WhatsApp
                            </li>
<li className="flex items-center gap-2 text-label-md text-surface-variant">
<span className="material-symbols-outlined text-primary-container scale-75" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> Gestão de Estoque
                            </li>
</ul>
<button className="w-full py-md rounded-xl bg-primary text-on-primary font-label-md hover:opacity-90 transition-opacity">Selecionar Plano</button>
</div>
{/*  Elite  */}
<div className="bg-surface p-xl rounded-3xl premium-shadow border border-outline-variant/30 flex flex-col h-full">
<div className="mb-lg">
<h3 className="font-headline-md text-headline-md text-on-surface mb-2">Elite</h3>
<div className="flex items-baseline gap-1">
<span className="text-label-md text-secondary">R$</span>
<span className="text-4xl font-bold text-on-surface">549</span>
<span className="text-label-sm text-secondary">/mês</span>
</div>
</div>
<ul className="space-y-md flex-grow mb-xl">
<li className="flex items-center gap-2 text-label-md text-secondary">
<span className="material-symbols-outlined text-primary scale-75">done</span> Tudo no plano PRO
                            </li>
<li className="flex items-center gap-2 text-label-md text-secondary">
<span className="material-symbols-outlined text-primary scale-75">done</span> Branding Personalizado (White Label)
                            </li>
<li className="flex items-center gap-2 text-label-md text-secondary">
<span className="material-symbols-outlined text-primary scale-75">done</span> Suporte VIP 24/7
                            </li>
<li className="flex items-center gap-2 text-label-md text-secondary">
<span className="material-symbols-outlined text-primary scale-75">done</span> API para Integrações Customizadas
                            </li>
</ul>
<button className="w-full py-md rounded-xl border border-primary text-primary font-label-md hover:bg-primary/5 transition-colors">Selecionar Plano</button>
</div>
</div>
</div>
</section>
{/*  Final CTA  */}
<section className="py-32 bg-primary-container/20">
<div className="max-w-4xl mx-auto px-container-margin text-center space-y-lg">
<h2 className="font-headline-lg text-headline-lg text-on-surface">Eleve o nível do seu salão hoje mesmo</h2>
<p className="font-body-lg text-body-lg text-on-primary-container max-w-2xl mx-auto">Junte-se a centenas de salões de luxo que transformaram sua gestão e experiência do cliente com o OperaBeauty.</p>
<div className="pt-md">
<button className="bg-primary text-on-primary px-xl py-lg rounded-2xl font-label-md text-body-lg premium-shadow-lg hover:-translate-y-1 transition-all duration-300">Começar Teste Grátis de 14 dias</button>
</div>
<p className="text-label-sm text-secondary">Sem cartão de crédito necessário.</p>
</div>
</section>
</main>
{/*  Footer  */}
<footer className="bg-surface-container-low py-xl border-t border-outline-variant/30">
<div className="max-w-7xl mx-auto px-container-margin grid grid-cols-1 md:grid-cols-4 gap-lg">
<div className="space-y-md col-span-1 md:col-span-1">
<span className="font-headline-md text-headline-md text-primary">OperaBeauty</span>
<p className="font-body-md text-body-md text-on-surface-variant">Sistemas de gestão premium para o mercado de beleza de alto padrão.</p>
<div className="flex gap-md">
<span className="material-symbols-outlined text-secondary hover:text-primary cursor-pointer">face_nod</span>
<span className="material-symbols-outlined text-secondary hover:text-primary cursor-pointer">person_apron</span>
<span className="material-symbols-outlined text-secondary hover:text-primary cursor-pointer">share</span>
</div>
</div>
<div>
<h4 className="font-label-md text-label-md text-on-surface mb-lg">Soluções</h4>
<ul className="space-y-sm">
<li><a className="font-body-md text-body-md text-on-secondary-container hover:text-primary transition-colors" href="#">Features</a></li>
<li><a className="font-body-md text-body-md text-on-secondary-container hover:text-primary transition-colors" href="#">Pricing</a></li>
<li><a className="font-body-md text-body-md text-on-secondary-container hover:text-primary transition-colors" href="#">Agendamento</a></li>
</ul>
</div>
<div>
<h4 className="font-label-md text-label-md text-on-surface mb-lg">Empresa</h4>
<ul className="space-y-sm">
<li><a className="font-body-md text-body-md text-on-secondary-container hover:text-primary transition-colors" href="#">Sobre Nós</a></li>
<li><a className="font-body-md text-body-md text-on-secondary-container hover:text-primary transition-colors" href="#">Carreiras</a></li>
<li><a className="font-body-md text-body-md text-on-secondary-container hover:text-primary transition-colors" href="#">Contato</a></li>
</ul>
</div>
<div>
<h4 className="font-label-md text-label-md text-on-surface mb-lg">Suporte</h4>
<ul className="space-y-sm">
<li><a className="font-body-md text-body-md text-on-secondary-container hover:text-primary transition-colors" href="#">Help Center</a></li>
<li><a className="font-body-md text-body-md text-on-secondary-container hover:text-primary transition-colors" href="#">Privacy Policy</a></li>
<li><a className="font-body-md text-body-md text-on-secondary-container hover:text-primary transition-colors" href="#">Terms of Service</a></li>
</ul>
</div>
</div>
<div className="max-w-7xl mx-auto px-container-margin mt-xl pt-lg border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-md">
<p className="font-body-md text-body-md text-on-surface-variant">© 2024 OperaBeauty Systems. All rights reserved.</p>
<p className="font-body-md text-body-md text-on-surface-variant">Made with Grace.</p>
</div>
</footer>


    </div>
  );
}
