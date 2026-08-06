import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 border-r border-primary bg-surface dark:bg-background z-50">
      <div className="p-lg editorial-divider">
        <h1 className="font-headline-md text-headline-md font-bold text-primary">Pulse OS</h1>
        <p className="font-label-caps text-label-caps text-on-surface-variant mt-xs">System Intelligence</p>
      </div>
      <nav className="flex-1 py-md flex flex-col gap-xs">
        <Link 
          className={`flex items-center gap-sm p-sm ml-sm mr-sm transition-colors duration-200 ease-in-out border ${isActive('/brief') ? 'bg-primary text-on-primary border-primary' : 'text-primary border-transparent hover:bg-secondary-container hover:border-primary'}`} 
          to="/brief"
        >
          <span className="material-symbols-outlined" style={isActive('/brief') ? { fontVariationSettings: "'FILL' 1" } : {}}>wb_sunny</span>
          <span className="font-label-caps text-label-caps uppercase">Brief</span>
        </Link>
        <Link 
          className={`flex items-center gap-sm p-sm ml-sm mr-sm transition-colors duration-200 ease-in-out border ${isActive('/docs') ? 'bg-primary text-on-primary border-primary' : 'text-primary border-transparent hover:bg-secondary-container hover:border-primary'}`} 
          to="/docs"
        >
          <span className="material-symbols-outlined" style={isActive('/docs') ? { fontVariationSettings: "'FILL' 1" } : {}}>description</span>
          <span className="font-label-caps text-label-caps uppercase">Docs</span>
        </Link>
        <Link 
          className={`flex items-center gap-sm p-sm ml-sm mr-sm transition-colors duration-200 ease-in-out border ${isActive('/decide') ? 'bg-primary text-on-primary border-primary' : 'text-primary border-transparent hover:bg-secondary-container hover:border-primary'}`} 
          to="/decide"
        >
          <span className="material-symbols-outlined" style={isActive('/decide') ? { fontVariationSettings: "'FILL' 1" } : {}}>query_stats</span>
          <span className="font-label-caps text-label-caps uppercase">Decide</span>
        </Link>
        <Link 
          className={`flex items-center gap-sm p-sm ml-sm mr-sm transition-colors duration-200 ease-in-out border ${isActive('/search') ? 'bg-primary text-on-primary border-primary' : 'text-primary border-transparent hover:bg-secondary-container hover:border-primary'}`} 
          to="/search"
        >
          <span className="material-symbols-outlined" style={isActive('/search') ? { fontVariationSettings: "'FILL' 1" } : {}}>hub</span>
          <span className="font-label-caps text-label-caps uppercase">Search</span>
        </Link>
      </nav>
      <div className="p-md editorial-divider border-t border-primary">
        <div className="flex items-center gap-sm">
          <img alt="User profile" className="w-[32px] h-[32px] rounded-full grayscale border border-primary object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCC_l_WRNy843qESIP5s5FTnsbw7nQJODxNRiLZqss6pYzvv1CKx4HcXNmD5RsFIG2bCa6pTrMBtdD8HKsHbWEx9aalh5i-zHczsSs2xcRszpWp2j5mhYApb_oatr0dZE_a2Os9Irm6l3b3E0-1Qv3LUN6jgkh25jzpJtT_75mvLD0ryapwx0qjUrsmJeBKQ9E24agQs5KNoyMXfQ_mqhHWNzPBuqQSbAQJWgxwgPt8icPOxqugMB6vcA" />
          <span className="font-label-caps text-label-caps text-primary uppercase">Admin</span>
        </div>
      </div>
    </aside>
  );
};

const TopBar = () => (
  <header className="w-full border-b border-primary bg-surface flex justify-between items-center px-lg py-sm sticky top-0 z-40">
    <h2 className="font-headline-md text-headline-md font-bold text-primary">System Console</h2>
    <div className="flex items-center gap-md">
      <div className="hidden lg:flex items-center border-b border-primary pb-xs">
        <span className="material-symbols-outlined text-secondary mr-xs">search</span>
        <input className="bg-transparent border-none outline-none font-label-caps text-label-caps text-primary placeholder-on-surface-variant focus:ring-0 p-0 w-64" placeholder="Search..." type="text" />
      </div>
      <div className="flex gap-sm">
        <button className="text-primary hover:bg-secondary-container p-xs transition-colors duration-200 ease-in-out black-border bg-white cursor-pointer">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="text-primary hover:bg-secondary-container p-xs transition-colors duration-200 ease-in-out black-border bg-white cursor-pointer">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </div>
    </div>
  </header>
);

const Layout = ({ children }) => {
  return (
    <div className="bg-background text-on-background font-body-md text-body-md antialiased overflow-x-hidden min-h-screen flex">
      <Sidebar />
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <TopBar />
        {children}
      </main>
    </div>
  );
};

export default Layout;
