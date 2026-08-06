import React, { useState } from 'react';
import axios from 'axios';

const PulseSearch = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [graphData, setGraphData] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;
    
    setLoading(true);
    setError(null);
    setGraphData(null);

    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/search/query?q=${encodeURIComponent(query)}`);
      setGraphData(res.data.data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to search Knowledge Graph');
    } finally {
      setLoading(false);
    }
  };

  // Helper for node placement in a circle
  const renderNodes = (nodes) => {
    const radius = 120;
    const center = 150;
    const angleStep = (2 * Math.PI) / nodes.length;

    return nodes.map((node, i) => {
      const x = center + radius * Math.cos(i * angleStep);
      const y = center + radius * Math.sin(i * angleStep);
      
      let bgColor = 'bg-surface';
      if (node.type === 'github') bgColor = 'bg-black text-white';
      if (node.type === 'slack') bgColor = 'bg-[#4A154B] text-white';
      
      return (
        <div key={node.id} className={`absolute linear-surface px-2 py-1 text-[10px] font-label-caps max-w-[120px] text-center hover-lift enter-scale ${bgColor}`}
          style={{ top: y, left: x, transform: 'translate(-50%, -50%)', animationDelay: `${i * 50}ms` }}
        >
          <strong className="block mb-1 opacity-70">{node.type.toUpperCase()}</strong>
          {node.label}
        </div>
      );
    });
  };

  return (
    <div className="p-margin-mobile md:p-margin-desktop flex-1 flex flex-col gap-lg max-w-[1440px] mx-auto w-full">
      <div className="border-b border-black/10 dark:border-white/10 pb-md mb-md">
        <h2 className="font-headline-md text-headline-md text-black dark:text-white font-medium">Global Knowledge Search</h2>
        <p className="font-body-md text-body-md text-secondary dark:text-secondary-fixed mt-1 max-w-2xl">Query the neural net across all integrated subsystems (Docs, GitHub, Slack, Calendar).</p>
      </div>

      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2 mb-lg relative">
        <div className="flex-1 flex items-center linear-surface px-4 py-3 hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus-within:ring-1 focus-within:ring-black dark:focus-within:ring-white">
          <span className="material-symbols-outlined text-secondary dark:text-secondary-fixed mr-3 text-[20px]">search</span>
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., 'Project Phoenix status'"
            className="flex-1 bg-transparent text-sm font-body-md text-black dark:text-white focus:outline-none placeholder-secondary dark:placeholder-secondary-fixed"
          />
        </div>
        <button 
          type="submit" 
          disabled={loading || !query}
          className="press-feedback bg-black dark:bg-white text-white dark:text-black font-label-caps text-label-caps px-6 py-3 rounded-md hover:opacity-90 transition-opacity disabled:opacity-50 text-xs whitespace-nowrap shadow-sm"
        >
          {loading ? 'SEARCHING...' : 'INITIALIZE QUERY'}
        </button>
      </form>

      {error && (
        <div className="p-md bg-error-container text-error font-bold font-label-caps">
          ERROR: {error}
        </div>
      )}

      {graphData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 linear-surface p-6 enter-fade-up">
          {/* Left Column: Narrative Synthesis */}
          <div className="flex flex-col gap-4 border-r border-black/10 dark:border-white/10 pr-6">
            <h3 className="font-[Inter] text-xs font-semibold text-black dark:text-white uppercase tracking-widest">Cross-Platform Synthesis</h3>
            <div className="font-body-md text-sm text-black dark:text-white whitespace-pre-wrap flex-1 leading-relaxed">
              {graphData.narrative_summary}
            </div>
          </div>

          {/* Right Column: Node Graph Visualization */}
          <div className="relative min-h-[300px] flex items-center justify-center bg-[#F4F5F8] dark:bg-[#111111] rounded border border-black/5 dark:border-white/5 p-4">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
            
            <div className="relative w-[300px] h-[300px]">
              {/* Draw Edges */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ overflow: 'visible' }}>
                {graphData.edges?.map((edge, idx) => {
                   const sourceIdx = graphData.nodes?.findIndex(n => n.id === edge.source);
                   const targetIdx = graphData.nodes?.findIndex(n => n.id === edge.target);
                   if (sourceIdx === -1 || targetIdx === -1) return null;
                   
                   const radius = 120;
                   const center = 150;
                   const angleStep = (2 * Math.PI) / graphData.nodes.length;
                   
                   const x1 = center + radius * Math.cos(sourceIdx * angleStep);
                   const y1 = center + radius * Math.sin(sourceIdx * angleStep);
                   const x2 = center + radius * Math.cos(targetIdx * angleStep);
                   const y2 = center + radius * Math.sin(targetIdx * angleStep);
                   
                   return (
                     <g key={idx}>
                       <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" className="enter-fade-up text-black/20 dark:text-white/20" style={{ animationDelay: '300ms' }} />
                       <text x={(x1+x2)/2} y={(y1+y2)/2} fill="currentColor" fontSize="10" className="font-label-caps enter-fade-up text-black/50 dark:text-white/50" style={{ animationDelay: '400ms', backgroundColor: 'transparent' }}>
                         {edge.relationship}
                       </text>
                     </g>
                   );
                })}
              </svg>
              
              {/* Draw Nodes */}
              {renderNodes(graphData.nodes || [])}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PulseSearch;
