import React from 'react';
import { Link } from 'react-router-dom';

const SuperAdmin = () => {
  return (
    <div className="font-body-md text-body-md antialiased overflow-x-hidden min-h-screen flex bg-surface text-on-surface animate-fade-in-up">
      
      {/* Navigation Drawer (Desktop) */}
      <aside className="hidden md:flex flex-col h-screen w-72 left-0 top-0 fixed bg-surface shadow-md py-lg gap-sm z-40">
        <div className="px-md mb-lg">
          <h2 className="font-headline-md text-headline-md text-primary tracking-tight">BeautyPlatform</h2>
        </div>
        <nav className="flex flex-col gap-xs flex-1">
          <Link to="/superadmin" className="flex items-center gap-md py-3 px-4 bg-primary-container text-on-primary-container rounded-lg mx-md font-label-md text-label-md transition-all duration-200 ease-in-out">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
            Global Dashboard
          </Link>
          <Link to="#" className="flex items-center gap-md py-3 px-4 text-on-surface-variant hover:bg-surface-container-high rounded-lg mx-md font-label-md text-label-md transition-all duration-200 ease-in-out">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>storefront</span>
            Salon Directory
          </Link>
          <Link to="#" className="flex items-center gap-md py-3 px-4 text-on-surface-variant hover:bg-surface-container-high rounded-lg mx-md font-label-md text-label-md transition-all duration-200 ease-in-out">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>subscriptions</span>
            Plan Management
          </Link>
          <Link to="#" className="flex items-center gap-md py-3 px-4 text-on-surface-variant hover:bg-surface-container-high rounded-lg mx-md font-label-md text-label-md transition-all duration-200 ease-in-out">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>settings</span>
            System Settings
          </Link>
        </nav>
        <div className="px-md mt-auto">
          <div className="flex items-center gap-sm p-4 bg-surface-container-low rounded-xl">
            <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center overflow-hidden">
              <span className="material-symbols-outlined text-secondary">person</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-label-md text-on-surface">Super Admin</span>
              <span className="font-label-sm text-label-sm text-secondary">cf95.souza@gmail.com</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-72 flex flex-col min-h-screen bg-background">
        
        {/* Top App Bar (Mobile) */}
        <header className="md:hidden flex justify-between items-center h-16 px-gutter w-full max-w-full bg-surface shadow-sm sticky top-0 z-30">
          <div className="flex items-center gap-md cursor-pointer active:opacity-80">
            <span className="material-symbols-outlined text-primary font-headline-md text-headline-md">spa</span>
            <span className="font-headline-md text-headline-md text-primary tracking-tight">SaaS Admin</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center overflow-hidden cursor-pointer">
            <span className="material-symbols-outlined text-secondary text-sm">person</span>
          </div>
        </header>

        <div className="p-container-margin md:p-xl flex-1 flex flex-col gap-xl">
          
          {/* Page Header & Quick Actions */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-lg">
            <div>
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-xs">Global Overview</h1>
              <p className="font-body-md text-body-md text-secondary">Manage platform performance and tenant health.</p>
            </div>
            <button className="bg-primary text-on-primary font-label-md text-label-md py-3 px-6 rounded-full flex items-center gap-sm hover:opacity-90 transition-opacity shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transform duration-300">
              <span className="material-symbols-outlined">add</span>
              Add New Salon
            </button>
          </div>

          {/* Bento Grid: Global Overview Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            
            {/* Total Active Salons */}
            <div className="bg-surface-container-lowest rounded-xl p-lg shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                <span className="font-label-md text-label-md text-secondary">Total Active Salons</span>
                <div className="bg-surface-container-low p-2 rounded-full text-primary">
                  <span className="material-symbols-outlined">storefront</span>
                </div>
              </div>
              <div>
                <div className="font-display-lg text-display-lg text-on-surface">1</div>
                <div className="flex items-center gap-xs mt-1 text-on-primary-container font-label-sm text-label-sm">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  <span>+100% this month</span>
                </div>
              </div>
            </div>

            {/* Total MRR */}
            <div className="bg-surface-container-lowest rounded-xl p-lg shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col justify-between h-40 relative overflow-hidden">
              <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 100% 0%, var(--color-primary) 0%, transparent 50%)" }}></div>
              <div className="flex justify-between items-start relative z-10">
                <span className="font-label-md text-label-md text-secondary">Total MRR</span>
                <div className="bg-surface-container-low p-2 rounded-full text-primary">
                  <span className="material-symbols-outlined">payments</span>
                </div>
              </div>
              <div className="relative z-10">
                <div className="font-display-lg text-display-lg text-on-surface">R$ 59,99</div>
                <div className="flex items-center gap-xs mt-1 text-on-primary-container font-label-sm text-label-sm">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  <span>+100% this month</span>
                </div>
              </div>
            </div>

            {/* Pending Approvals */}
            <div className="bg-surface-container-lowest rounded-xl p-lg shadow-[0_4px_20px_rgba(0,0,0,0.04)] flex flex-col justify-between h-40">
              <div className="flex justify-between items-start">
                <span className="font-label-md text-label-md text-secondary">Pending Approvals</span>
                <div className="bg-error-container p-2 rounded-full text-on-error-container">
                  <span className="material-symbols-outlined">hourglass_empty</span>
                </div>
              </div>
              <div>
                <div className="font-display-lg text-display-lg text-on-surface">0</div>
                <div className="flex items-center gap-xs mt-1 text-secondary font-label-sm text-label-sm">
                  <span>Requires review</span>
                </div>
              </div>
            </div>

          </section>

          {/* Salon Directory (Tenants) */}
          <section className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-md md:p-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-lg gap-md">
              <h2 className="font-headline-md text-headline-md text-on-surface">Salon Directory</h2>
              <div className="flex items-center gap-md w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary">search</span>
                  <input className="w-full bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 font-body-md text-body-md focus:ring-2 focus:ring-primary focus:bg-surface-container-lowest transition-all outline-none" placeholder="Search salons..." type="text"/>
                </div>
                <button className="bg-surface-container-high p-2 rounded-full text-on-surface-variant hover:bg-surface-variant transition-colors">
                  <span className="material-symbols-outlined">filter_list</span>
                </button>
              </div>
            </div>

            {/* Table/List View */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-surface-variant">
                    <th className="py-sm px-md font-label-md text-label-md text-secondary whitespace-nowrap">Salon Name</th>
                    <th className="py-sm px-md font-label-md text-label-md text-secondary whitespace-nowrap">Plan</th>
                    <th className="py-sm px-md font-label-md text-label-md text-secondary whitespace-nowrap">Status</th>
                    <th className="py-sm px-md font-label-md text-label-md text-secondary text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="font-body-md text-body-md">
                  
                  {/* Row 1 */}
                  <tr className="border-b border-surface-variant hover:bg-surface-container-low transition-colors group">
                    <td className="py-md px-md">
                      <div className="flex items-center gap-md">
                        <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary overflow-hidden shrink-0">
                          <span className="material-symbols-outlined text-secondary">storefront</span>
                        </div>
                        <div>
                          <div className="font-label-md text-label-md text-on-surface">Salão Maria</div>
                          <div className="font-label-sm text-label-sm text-secondary">salaomaria</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-md px-md">
                      <span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full font-label-sm text-label-sm">Standard</span>
                    </td>
                    <td className="py-md px-md">
                      <div className="flex items-center gap-xs">
                        <div className="w-2 h-2 rounded-full bg-[#10b981]"></div>
                        <span className="text-on-surface-variant">Active</span>
                      </div>
                    </td>
                    <td className="py-md px-md text-right">
                      <button className="text-secondary hover:text-primary transition-colors p-2">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
            
            <div className="mt-md flex justify-center">
              <button className="text-primary font-label-md text-label-md hover:underline py-2">View All Salons</button>
            </div>
          </section>

        </div>

        {/* Bottom Nav Bar (Mobile) */}
        <nav className="md:hidden fixed bottom-0 w-full z-50 flex justify-around items-center px-gutter py-sm bg-surface shadow-[0_-4px_20px_rgba(0,0,0,0.04)] rounded-t-xl">
          <Link to="/superadmin" className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1 active:scale-95 transition-transform">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
            <span className="font-label-sm text-label-sm mt-1" style={{ fontSize: '10px' }}>Dashboard</span>
          </Link>
          <Link to="#" className="flex flex-col items-center justify-center text-secondary active:scale-95 transition-transform active:bg-surface-container-highest rounded-full px-4 py-1">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>storefront</span>
            <span className="font-label-sm text-label-sm mt-1" style={{ fontSize: '10px' }}>Tenants</span>
          </Link>
          <Link to="#" className="flex flex-col items-center justify-center text-secondary active:scale-95 transition-transform active:bg-surface-container-highest rounded-full px-4 py-1">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>subscriptions</span>
            <span className="font-label-sm text-label-sm mt-1" style={{ fontSize: '10px' }}>Plans</span>
          </Link>
          <Link to="#" className="flex flex-col items-center justify-center text-secondary active:scale-95 transition-transform active:bg-surface-container-highest rounded-full px-4 py-1">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>settings</span>
            <span className="font-label-sm text-label-sm mt-1" style={{ fontSize: '10px' }}>Settings</span>
          </Link>
        </nav>

        {/* Spacer for mobile nav */}
        <div className="h-20 md:hidden"></div>

      </main>
      
    </div>
  );
};

export default SuperAdmin;
