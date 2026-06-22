import fs from 'fs';

let html = fs.readFileSync('stitch_telas/pagina_vendas.html', 'utf8');

// Extract the body content
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if (!bodyMatch) {
  console.log("No body found");
  process.exit(1);
}
let bodyHtml = bodyMatch[1];

// Remove the script at the end
bodyHtml = bodyHtml.replace(/<script>[\s\S]*?<\/script>/i, '');

// Convert class to className
bodyHtml = bodyHtml.replace(/class="/g, 'className="');

// Convert inline styles
bodyHtml = bodyHtml.replace(/style="font-variation-settings:\s*'FILL'\s*1;"/g, "style={{ fontVariationSettings: \"'FILL' 1\" }}");

// Convert self-closing tags
bodyHtml = bodyHtml.replace(/<img([^>]+)>/g, (match, p1) => {
    if (p1.endsWith('/')) return match;
    return `<img${p1} />`;
});

// Convert HTML comments to JSX comments
bodyHtml = bodyHtml.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');

// Change Elysia to OperaBeauty
bodyHtml = bodyHtml.replace(/ELYSIA/g, 'OperaBeauty');
bodyHtml = bodyHtml.replace(/Elysia/g, 'OperaBeauty');
bodyHtml = bodyHtml.replace(/Ethereal Grace/g, 'OperaBeauty');

const componentCode = `import React, { useEffect } from 'react';
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
      <style>{\`
        .premium-shadow { box-shadow: 0px 4px 20px rgba(0,0,0,0.04); }
        .premium-shadow-lg { box-shadow: 0px 10px 30px rgba(0,0,0,0.08); }
        .glass-nav { backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
      \`}</style>
      ${bodyHtml}
    </div>
  );
}
`;

fs.writeFileSync('src/pages/LandingPage.jsx', componentCode);
console.log("Converted successfully!");
