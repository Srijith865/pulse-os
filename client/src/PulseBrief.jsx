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
            <button onClick={handleConnectGmail} className="press-feedback bg-primary text-on-primary font-label-caps text-label-caps px-lg py-sm rounded-xl hover:bg-surface hover:text-primary transition-colors flex items-center gap-2 hover-lift">
              <span className="material-symbols-outlined text-sm">mail</span>
              CONNECT GMAIL
            </button>
          ) : (
            <button onClick={fetchBrief} disabled={loading} className={`press-feedback font-label-caps text-label-caps px-lg py-sm rounded-xl border border-primary hover:bg-secondary-container transition-colors flex items-center gap-2 hover-lift ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <span className="material-symbols-outlined text-sm">{loading ? 'sync' : 'auto_awesome'}</span>
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
      <div className="col-span-1 lg:col-span-8 flex flex-col gap-xl">
        {/* Overnight Synthesis */}
        <section>
          <div className="flex items-center justify-between mb-md pb-xs editorial-divider border-b-2 border-primary">
            <h3 className="font-headline-lg text-headline-lg text-primary">Overnight Synthesis</h3>
            <span className="font-label-caps text-label-caps bg-primary text-on-primary px-xs py-base">
              {briefData ? briefData.synthesis?.length || 0 : '3'} Updates
            </span>
          </div>
          <div className="flex flex-col gap-base stagger-children">
            
            {briefData ? (
              briefData.synthesis?.map((item, idx) => (
                <details key={idx} className="group glass-card rounded-2xl cursor-pointer [&_summary::-webkit-details-marker]:hidden enter-fade-up overflow-hidden" open>
                  <summary className="flex items-center justify-between p-md font-headline-md text-headline-md text-primary hover:bg-white/40 transition-colors">
                    <div className="flex items-center gap-sm">
                      <span className="material-symbols-outlined">forum</span>
                      <span>{item.title}</span>
                    </div>
                    <span className="material-symbols-outlined group-open:rotate-180 transition-transform duration-300">expand_more</span>
                  </summary>
                  <div className="p-md pt-0 text-body-md font-body-md text-on-surface-variant border-t border-gray-200">
                    <p className="mt-sm">{item.summary}</p>
                    <div className="mt-sm flex gap-xs">
                      {item.tags?.map(tag => (
                        <span key={tag} className="tag-pill">#{tag}</span>
                      ))}
                    </div>
                  </div>
                </details>
              ))
            ) : (
              // Placeholder State
              <div className="p-md glass-card rounded-2xl border-dashed text-center text-on-surface-variant font-label-caps">
                {needsAuth ? "Waiting for Gmail connection..." : "Click 'Generate AI Brief' to analyze recent emails."}
              </div>
            )}
            
          </div>
        </section>

        {/* Urgent Actions */}
        <section>
          <div className="flex items-center justify-between mb-md pb-xs editorial-divider border-b-2 border-primary">
            <h3 className="font-headline-lg text-headline-lg text-primary">Urgent Actions</h3>
            <span className="font-label-caps text-label-caps border border-primary px-xs py-base rounded-full">High Priority</span>
          </div>
          <div className="flex flex-col">
            {briefData ? (
              briefData.urgent_actions?.map((action, idx) => (
                <label key={idx} className="flex items-center p-sm editorial-divider cursor-pointer hover:bg-white/40 transition-colors group enter-fade-up rounded-xl">
                  <input className="w-5 h-5 border-black text-black focus:ring-black rounded cursor-pointer" type="checkbox" />
                  <span className="ml-sm font-body-lg text-body-lg text-primary group-hover:pl-xs transition-all">{action}</span>
                </label>
              ))
            ) : (
              <div className="p-md border border-outline border-dashed text-center text-on-surface-variant font-label-caps">
                Awaiting AI Analysis
              </div>
            )}
          </div>
        </section>
      </div>
      
      {/* Right Column: Schedule & Engineering */}
      <div className="col-span-1 lg:col-span-4 pl-0 lg:pl-lg border-l-0 lg:border-l border-primary h-full">
        <div className="sticky top-24 flex flex-col gap-xl">
          {/* Schedule Section */}
          <div>
            <h3 className="font-headline-lg text-headline-lg text-primary mb-md pb-xs editorial-divider border-b-2 border-primary">Schedule Context</h3>
            <div className="relative border-l border-primary ml-xs pl-sm">
              {briefData ? (
                briefData.schedule?.map((item, idx) => (
                  <div key={idx} className="mb-md relative">
                    <div className={`absolute -left-[25px] top-1 w-3 h-3 rounded-full border-2 border-black ${idx === 0 ? 'bg-black border-white' : 'bg-white'}`}></div>
                    <p className="font-body-md text-body-md text-primary font-bold">{item}</p>
                  </div>
                ))
              ) : (
                <div className="mb-md relative text-on-surface-variant font-label-caps">
                  Awaiting AI Analysis
                </div>
              )}
            </div>
          </div>

          {/* Engineering Queue Section */}
          <div>
            <h3 className="font-headline-lg text-headline-lg text-primary mb-md pb-xs editorial-divider border-b-2 border-primary">Engineering Queue</h3>
            <div className="flex flex-col gap-sm">
              {briefData ? (
                briefData.engineering?.map((item, idx) => (
                  <div key={idx} className="glass-card p-sm rounded-xl hover:bg-white/60 transition-colors enter-fade-up">
                    <p className="font-[JetBrains_Mono] text-xs font-bold text-primary">{item}</p>
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
