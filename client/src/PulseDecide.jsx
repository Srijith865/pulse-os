import React, { useState } from 'react';
import axios from 'axios';

const PulseDecide = () => {
  const [optionsText, setOptionsText] = useState('Maintain current operations\nAggressive restructuring of tier-1 suppliers');
  const [criteriaText, setCriteriaText] = useState('Minimize capital outlay\nReduce risk of supply chain failure within 90 days');
  
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [error, setError] = useState(null);
  const [decideData, setDecideData] = useState(null);
  const [execResult, setExecResult] = useState(null);

  const handleExecute = async () => {
    if (!decideData || !decideData.execution_plan) return;
    setExecuting(true);
    setExecResult(null);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/decide/execute`, {
        execution_plan: decideData.execution_plan
      });
      setExecResult(res.data.results);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to execute actions');
    } finally {
      setExecuting(false);
    }
  };

  const handleEvaluate = async () => {
    setLoading(true);
    setError(null);
    
    const options = optionsText.split('\n').filter(o => o.trim());
    const criteria = criteriaText.split('\n').filter(c => c.trim());

    if (options.length < 2 || criteria.length < 1) {
      setError("Please provide at least 2 options and 1 criteria.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/decide/evaluate`, {
        options,
        criteria
      });
      setDecideData(response.data.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to evaluate decisions.');
    } finally {
      setLoading(false);
    }
  };

  // Helper to construct radar polygon points based on scores (0-100)
  // Axes: 0: Capital(Top), 1: Market(TopRight), 2: Legal(BotRight), 3: Operational(Bot), 4: Reputation(BotLeft), 5: Tech(TopLeft)
  const getRadarPoints = (radarScores) => {
    if (!radarScores) return "100,100";
    
    const scores = [
      radarScores.capital || 0,
      radarScores.market || 0,
      radarScores.legal || 0,
      radarScores.operational || 0,
      radarScores.reputation || 0,
      radarScores.tech || 0
    ];

    const angles = [
      -Math.PI / 2,         // Top (Capital)
      -Math.PI / 6,         // Top Right (Market)
      Math.PI / 6,          // Bottom Right (Legal)
      Math.PI / 2,          // Bottom (Operational)
      5 * Math.PI / 6,      // Bottom Left (Reputation)
      -5 * Math.PI / 6      // Top Left (Tech)
    ];

    const center = 100;
    const radius = 80; // Max radius for 100 score

    return scores.map((score, i) => {
      const r = (score / 100) * radius;
      const x = center + r * Math.cos(angles[i]);
      const y = center + r * Math.sin(angles[i]);
      return `${x},${y}`;
    }).join(' ');
  };

  return (
    <div className="p-margin-mobile md:p-margin-desktop flex-1 flex flex-col gap-lg max-w-[1440px] mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-md border-b border-primary pb-md">
        <div>
          <h2 className="font-display text-display text-primary">Strategic Decision Engine</h2>
          <p className="font-body-lg text-body-lg text-secondary mt-xs max-w-2xl">Input options and evaluation criteria. The system will synthesize a recommended protocol.</p>
        </div>
        <div className="font-label-caps text-label-caps text-primary border border-primary/20 px-sm py-xs bg-white/60 rounded-xl backdrop-blur-sm">
          ID: DEC-2023-094
        </div>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md border border-black/5 bg-white/40 p-md glass-card rounded-3xl">
        <div>
          <label className="font-label-caps text-label-caps font-bold block mb-xs">Options (One per line)</label>
          <textarea 
            className="w-full border border-black/10 p-sm font-body-md bg-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all h-32"
            value={optionsText}
            onChange={(e) => setOptionsText(e.target.value)}
            placeholder="Option A&#10;Option B"
          />
        </div>
        <div>
          <label className="font-label-caps text-label-caps font-bold block mb-xs">Criteria (One per line)</label>
          <textarea 
            className="w-full border border-black/10 p-sm font-body-md bg-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all h-32"
            value={criteriaText}
            onChange={(e) => setCriteriaText(e.target.value)}
            placeholder="Criteria 1&#10;Criteria 2"
          />
        </div>
        <div className="md:col-span-2 flex justify-between items-center mt-2">
          {error ? <span className="text-error font-bold text-xs bg-error-container p-1">{error}</span> : <span></span>}
          <button 
            onClick={handleEvaluate} 
            disabled={loading}
            className="press-feedback bg-primary text-on-primary font-label-caps text-label-caps px-lg py-sm rounded-xl hover:bg-indigo-600 transition-colors disabled:opacity-50 glow-sm"
          >
            {loading ? 'EVALUATING...' : 'EXECUTE ANALYSIS'}
          </button>
        </div>
      </div>
      
      {/* Bento Grid Layout */}
      <div className={`grid grid-cols-1 lg:grid-cols-12 gap-md transition-opacity duration-500 ${decideData ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
        
        {/* Main AI Recommendation Block (Spans 8 cols) */}
        <section className="lg:col-span-8 p-lg glass-card rounded-3xl flex flex-col">
          <div className="flex justify-between items-center border-b border-black/10 pb-sm mb-md">
            <div className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-primary">smart_toy</span>
              <h3 className="font-label-caps text-label-caps font-bold">Primary Recommendation</h3>
            </div>
            <span className="font-label-caps text-label-caps bg-primary text-on-primary px-xs py-base">
              {decideData?.primary_recommendation?.match_percentage || '0'}% MATCH
            </span>
          </div>
          <h4 className="font-headline-lg text-headline-lg mb-sm">
            {decideData?.primary_recommendation?.title || 'Awaiting Analysis'}
          </h4>
          <p className="font-body-lg text-body-lg mb-lg flex-1">
            {decideData?.primary_recommendation?.justification || 'System standing by for option evaluation.'}
          </p>

          {/* Execution Plan Render */}
          {decideData?.execution_plan && (
            <div className="mb-md">
              <h5 className="font-label-caps text-label-caps font-bold mb-xs text-primary">Autonomous Execution Plan</h5>
              <div className="flex flex-col gap-xs">
                {decideData.execution_plan.map((action, idx) => {
                  const res = execResult?.find(r => r.app === action.app);
                  return (
                  <div key={idx} className="flex justify-between items-center border border-primary p-2 bg-surface-container-lowest text-xs font-[JetBrains_Mono]">
                    <span className="truncate mr-2"><strong className="uppercase">{action.app}</strong>: {action.description}</span>
                    {res && (
                      <span className={`px-2 py-0.5 text-white flex-shrink-0 ${res.status === 'success' ? 'bg-black' : 'bg-red-500'}`}>
                        {res.status.toUpperCase()}
                      </span>
                    )}
                  </div>
                )})}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-sm items-center mt-auto pt-md border-t border-gray-200">
            <button 
              onClick={handleExecute}
              disabled={executing || !decideData?.execution_plan}
              className="press-feedback w-full sm:w-auto bg-primary text-on-primary font-label-caps text-label-caps px-lg py-sm rounded-xl hover:bg-indigo-600 transition-colors disabled:opacity-50 glow-sm"
            >
              {executing ? 'EXECUTING...' : 'EXECUTE NOW'}
            </button>
            <button className="press-feedback w-full sm:w-auto bg-white/60 text-primary font-label-caps text-label-caps px-lg py-sm border border-black/10 rounded-xl hover:bg-white transition-colors">
              DEFER TO BOARD
            </button>
          </div>
        </section>
        
        {/* Risk Radar Chart (Spans 4 cols) */}
        <section className="lg:col-span-4 p-md glass-card rounded-3xl flex flex-col">
          <div className="flex items-center gap-xs border-b border-black/10 pb-sm mb-md">
            <span className="material-symbols-outlined text-primary">radar</span>
            <h3 className="font-label-caps text-label-caps font-bold">Risk Radar</h3>
          </div>
          <div className="flex-1 flex justify-center items-center py-md relative">
            <svg className="w-full max-w-[250px] h-auto" viewBox="0 0 200 200">
              {/* Background Web */}
              <polygon stroke="#e2e2e2" strokeWidth="1" fill="none" points="100,20 176,51 176,149 100,180 24,149 24,51"></polygon>
              <polygon stroke="#e2e2e2" strokeWidth="1" fill="none" points="100,40 157,63 157,137 100,160 43,137 43,63"></polygon>
              <polygon stroke="#e2e2e2" strokeWidth="1" fill="none" points="100,60 138,76 138,124 100,140 62,124 62,76"></polygon>
              <polygon stroke="#e2e2e2" strokeWidth="1" fill="none" points="100,80 119,88 119,112 100,120 81,112 81,88"></polygon>
              {/* Axes */}
              <line stroke="#000" strokeWidth="1" x1="100" x2="100" y1="100" y2="20"></line>
              <line stroke="#000" strokeWidth="1" x1="100" x2="176" y1="100" y2="51"></line>
              <line stroke="#000" strokeWidth="1" x1="100" x2="176" y1="100" y2="149"></line>
              <line stroke="#000" strokeWidth="1" x1="100" x2="100" y1="100" y2="180"></line>
              <line stroke="#000" strokeWidth="1" x1="100" x2="24" y1="100" y2="149"></line>
              <line stroke="#000" strokeWidth="1" x1="100" x2="24" y1="100" y2="51"></line>
              
              {/* Dynamic Data Polygon */}
              {decideData && (
                <polygon 
                  fill="rgba(0,0,0,0.1)" 
                  stroke="#000" 
                  strokeWidth="2" 
                  points={getRadarPoints(decideData.risk_radar)}
                  className="transition-all duration-1000 ease-in-out"
                ></polygon>
              )}
            </svg>
            {/* Axis Labels */}
            <span className="absolute top-0 left-1/2 -translate-x-1/2 text-[10px] font-[JetBrains_Mono] font-bold">CAPITAL</span>
            <span className="absolute top-1/4 right-0 text-[10px] font-[JetBrains_Mono]">MARKET</span>
            <span className="absolute bottom-1/4 right-0 text-[10px] font-[JetBrains_Mono]">LEGAL</span>
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[10px] font-[JetBrains_Mono]">OPERATIONAL</span>
            <span className="absolute bottom-1/4 left-0 text-[10px] font-[JetBrains_Mono]">REPUTATION</span>
            <span className="absolute top-1/4 left-0 text-[10px] font-[JetBrains_Mono]">TECH</span>
          </div>
        </section>
        
        {/* Strategic Alternatives Title */}
        <div className="lg:col-span-12 mt-lg border-b border-primary pb-xs flex justify-between items-end">
          <h3 className="font-headline-md text-headline-md font-bold">Strategic Alternatives</h3>
          <span className="font-label-caps text-label-caps text-secondary border border-primary px-xs py-base">COMPARATIVE ANALYSIS</span>
        </div>
        
        {/* Dynamic Alternatives */}
        {decideData?.alternatives?.map((alt, idx) => (
          <section key={idx} className="lg:col-span-6 p-lg glass-card rounded-3xl hover:bg-white/60 transition-colors group cursor-pointer relative overflow-hidden hover-lift enter-fade-up" style={{ animationDelay: `${idx * 100}ms` }}>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-sm">
                <span className="font-label-caps text-label-caps border border-primary px-xs py-base group-hover:bg-primary group-hover:text-on-primary transition-colors">ALT-{String.fromCharCode(65 + idx)}</span>
                <span className="font-label-caps text-label-caps text-secondary">{alt.match_percentage}% MATCH</span>
              </div>
              <h4 className="font-headline-md text-headline-md mb-xs">{alt.title}</h4>
              <p className="font-body-md text-body-md text-secondary mb-md">
                {alt.description}
              </p>
              <div className="border-t border-primary pt-sm mt-auto">
                <div className="flex justify-between items-center mb-xs">
                  <span className="font-label-caps text-label-caps text-secondary">EST. COST</span>
                  <span className="font-[JetBrains_Mono] font-bold">{alt.est_cost}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-label-caps text-label-caps text-secondary">RISK LEVEL</span>
                  <span className="font-[JetBrains_Mono] font-bold">{alt.risk_level}</span>
                </div>
              </div>
            </div>
          </section>
        ))}

        {!decideData && (
          <div className="lg:col-span-12 p-xl text-center text-secondary font-label-caps border border-dashed border-primary">
            Submit options for alternative generation
          </div>
        )}
      </div>
      
      <div className="mt-lg border-t border-gray-200 pt-md text-center">
        <p className="font-caption text-caption text-secondary uppercase tracking-widest">System Intelligence Core V2.4.1 // Conf: High</p>
      </div>
    </div>
  );
};

export default PulseDecide;
