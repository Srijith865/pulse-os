import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { supabase } from './supabaseClient';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserEmail(user.email);
    });
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/app/brief', icon: 'wb_sunny', label: 'Brief' },
    { path: '/app/docs', icon: 'description', label: 'Docs' },
    { path: '/app/decide', icon: 'query_stats', label: 'Decide' },
    { path: '/app/search', icon: 'hub', label: 'Search' },
  ];

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 z-50 glass-card" style={{ borderTop: 'none', borderBottom: 'none', borderLeft: 'none' }}>
      <div className="p-lg border-b border-black/5">
        <h1 className="font-headline-md text-headline-md font-bold text-primary">Pulse OS</h1>
        <p className="font-label-caps text-label-caps text-on-surface-variant mt-xs">System Intelligence</p>
      </div>

      <nav className="flex-1 py-md flex flex-col gap-xs px-sm">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-sm px-sm py-2.5 rounded-xl transition-all duration-200 press-feedback ${
              isActive(item.path)
                ? 'bg-primary text-on-primary shadow-md glow-sm'
                : 'text-primary hover:bg-white/60'
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={isActive(item.path) ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {item.icon}
            </span>
            <span className="font-label-caps text-label-caps uppercase">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-md border-t border-black/5 flex flex-col gap-3">
        <div className="flex items-center gap-sm">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
            {userEmail ? userEmail.charAt(0).toUpperCase() : 'A'}
          </div>
          <span className="font-label-caps text-label-caps text-primary uppercase text-xs truncate max-w-[150px]">
            {userEmail || 'Admin'}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="press-feedback flex items-center gap-2 text-xs text-red-500 hover:text-red-600 transition-colors uppercase font-bold tracking-wider cursor-pointer"
        >
          <span className="material-symbols-outlined text-[14px]">logout</span>
          Secure Logout
        </button>
      </div>
    </aside>
  );
};

const TopBar = () => (
  <header className="w-full glass-card flex justify-between items-center px-lg py-sm sticky top-0 z-40" style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
    <h2 className="font-headline-md text-headline-md font-bold text-primary">System Console</h2>
    <div className="flex items-center gap-md">
      <div className="hidden lg:flex items-center bg-white/60 border border-black/10 rounded-xl px-sm py-1">
        <span className="material-symbols-outlined text-secondary mr-xs text-[18px]">search</span>
        <input className="bg-transparent border-none outline-none font-label-caps text-label-caps text-primary placeholder-on-surface-variant focus:ring-0 p-0 w-52" placeholder="Search..." type="text" />
      </div>
      <div className="flex gap-xs">
        <button className="press-feedback text-primary hover:bg-white/60 p-xs rounded-xl transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-[20px]">notifications</span>
        </button>
        <button className="press-feedback text-primary hover:bg-white/60 p-xs rounded-xl transition-colors cursor-pointer">
          <span className="material-symbols-outlined text-[20px]">settings</span>
        </button>
      </div>
    </div>
  </header>
);

const Layout = () => {
  return (
    <div className="text-on-background font-body-md text-body-md antialiased overflow-x-hidden min-h-screen flex dot-grid">
      <Sidebar />
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <TopBar />
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
