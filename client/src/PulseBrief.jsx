import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PulseBrief = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [briefData, setBriefData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [needsAuth, setNeedsAuth] = useState(false);

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase());
    
    // Check if we just redirected back from Google OAuth
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('auth_success') === 'true') {
      fetchBrief();
      // Remove query param from URL without refreshing
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const fetchBrief = async () => {
    setLoading(true);
    setError(null);
    setNeedsAuth(false);
    
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/brief/generate`, {
        withCredentials: true // needed if we ever use cookies, but we just have in-memory server auth for now
      });
      setBriefData(response.data.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setNeedsAuth(true);
      } else {
        setError(err.response?.data?.error || 'Failed to generate brief. See console.');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConnectGmail = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/brief/auth`;
  };

  return (
    <div className="p-margin-mobile md:p-margin-desktop max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-lg flex-1">
      {/* Header Section */}
      <div className="col-span-1 lg:col-span-12 editorial-divider pb-lg flex justify-between items-end">
        <div>
          <p className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-md">Morning Intelligence Report // <span>{currentDate}</span></p>
          <h1 className="font-display text-display text-primary">The Pulse Brief</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm max-w-3xl">Executive summary of overnight system states, urgent communications, and required tactical decisions. All systems nominal, zero critical alerts.</p>
        </div>
        
        {/* Action Buttons */}
        <div>
          {needsAuth ? (
            <button onClick={handleConnectGmail} className="press-feedback bg-black dark:bg-white text-white dark:text-black font-label-caps text-label-caps px-4 py-1.5 rounded-md hover:opacity-90 transition-opacity flex items-center gap-2 text-xs">
              <span className="material-symbols-outlined text-[16px]">mail</span>
              CONNECT GMAIL
            </button>
          ) : (
            <button onClick={fetchBrief} disabled={loading} className={`press-feedback font-label-caps text-label-caps px-4 py-1.5 rounded-md border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition-colors flex items-center gap-2 text-xs text-black dark:text-white ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <span className="material-symbols-outlined text-[16px]">{loading ? 'sync' : 'auto_awesome'}</span>
              {loading ? 'GENERATING...' : 'GENERATE AI BRIEF'}
            </button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="col-span-1 lg:col-span-12 p-sm bg-error-container text-on-error-container border border-error">
          <p className="font-label-caps font-bold">ERROR: {error}</p>
        </div>
      )}

      {/* Left Column: Synthesis & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg transition-opacity duration-500 col-span-1 lg:col-span-8">
        
        {/* Main Content Area (Spans 8 cols) */}
        <section className="lg:col-span-8 flex flex-col gap-sm">
          <div className="flex items-center justify-between mb-sm border-b border-black/10 dark:border-white/10 pb-2">
            <h3 className="font-headline-md text-headline-md text-black dark:text-white font-medium">Overnight Synthesis</h3>
            <span className="font-label-caps text-label-caps text-secondary dark:text-secondary-fixed">
              {briefData ? briefData.synthesis?.length || 0 : '3'} Updates
            </span>
          </div>
          <div className="flex flex-col stagger-children bg-white dark:bg-[#1A1B22] border border-black/10 dark:border-white/10 rounded-lg">
            
            {briefData ? (
              briefData.synthesis?.map((item, idx) => (
                <details key={idx} className="group border-b border-black/10 dark:border-white/10 last:border-0 cursor-pointer [&_summary::-webkit-details-marker]:hidden enter-fade-up overflow-hidden" open>
                  <summary className="flex items-center justify-between p-3 font-body-md text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-medium">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-secondary">forum</span>
                      <span>{item.title}</span>
                    </div>
                    <span className="material-symbols-outlined group-open:rotate-180 transition-transform duration-300">expand_more</span>
                  </summary>
                  <div className="px-3 pb-3 pt-1 text-sm text-secondary dark:text-secondary-fixed">
                    <p className="mb-2">{item.summary}</p>
                    <div className="flex gap-2">
                      {item.tags?.map(tag => (
                        <span key={tag} className="tag-pill text-[10px]">#{tag}</span>
                      ))}
                    </div>
                  </div>
                </details>
              ))
            ) : (
              // Placeholder State
              <div className="p-4 text-center text-sm text-secondary dark:text-secondary-fixed">
                {needsAuth ? "Waiting for Gmail connection..." : "Click 'Generate AI Brief' to analyze recent emails."}
              </div>
            )}
            
          </div>
        </section>

        {/* Urgent Actions */}
        <section className="lg:col-span-4 flex flex-col gap-md">
          <div className="flex flex-col gap-sm">
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2">
              <h3 className="font-headline-md text-headline-md text-black dark:text-white font-medium">Urgent Actions</h3>
              <span className="font-label-caps text-label-caps bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-2 py-0.5 rounded text-[10px]">High Priority</span>
            </div>
            <div className="flex flex-col linear-surface">
              {briefData ? (
                briefData.actions?.map((action, idx) => (
                  <label key={idx} className="flex items-start p-3 border-b border-black/10 dark:border-white/10 last:border-0 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors group enter-fade-up">
                    <input className="mt-1 w-4 h-4 border-black/20 dark:border-white/20 text-black focus:ring-black rounded-sm cursor-pointer" type="checkbox" />
                    <span className="ml-3 font-body-md text-sm text-black dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{action}</span>
                  </label>
                ))
              ) : (
                <div className="p-md border border-outline border-dashed text-center text-on-surface-variant font-label-caps">
                  Awaiting AI Analysis
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
      
      {/* Right Column: Schedule & Engineering */}
      <div className="col-span-1 lg:col-span-4 pl-0 lg:pl-lg border-l-0 lg:border-l border-primary h-full">
        <div className="sticky top-24 flex flex-col gap-xl">
          {/* Schedule Section */}
          <div>
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2">
              <h3 className="font-headline-md text-headline-md text-black dark:text-white font-medium">System Metrics</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="linear-surface p-3 flex flex-col items-center justify-center">
                <span className="font-display text-2xl text-black dark:text-white">{briefData ? '99.9%' : '--'}</span>
                <span className="font-label-caps text-label-caps text-secondary text-[10px]">Uptime</span>
              </div>
              <div className="linear-surface p-3 flex flex-col items-center justify-center">
                <span className="font-display text-2xl text-black dark:text-white">{briefData ? '12ms' : '--'}</span>
                <span className="font-label-caps text-label-caps text-secondary text-[10px]">Latency</span>
              </div>
            </div>
          </div>

          {/* Engineering Queue Section */}
          <div className="flex flex-col gap-sm mt-4">
            <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2">
              <h3 className="font-headline-md text-headline-md text-black dark:text-white font-medium">Engineering Log</h3>
            </div>
            <div className="flex flex-col gap-2">
              {briefData ? (
                briefData.engineering?.map((item, idx) => (
                  <div key={idx} className="linear-surface p-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors enter-fade-up">
                    <p className="font-[JetBrains_Mono] text-[11px] text-secondary dark:text-secondary-fixed">{item}</p>
                  </div>
                ))
              ) : (
                <div className="p-sm border border-dashed border-outline text-on-surface-variant font-label-caps text-center">
                  Awaiting AI Analysis
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PulseBrief;
