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
        <div key={node.id} className={`absolute border border-primary p-2 text-[10px] font-label-caps shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${bgColor} max-w-[120px] text-center`}
          style={{ top: y, left: x, transform: 'translate(-50%, -50%)' }}
        >
          <strong className="block mb-1">{node.type.toUpperCase()}</strong>
          {node.label}
        </div>
      );
    });
  };

  return (
    <div className="p-margin-mobile md:p-margin-desktop flex-1 flex flex-col gap-lg max-w-[1440px] mx-auto w-full">
      <div className="border-b border-primary pb-md mb-md">
        <h2 className="font-display text-display text-primary">Global Knowledge Search</h2>
        <p className="font-body-lg text-body-lg text-secondary mt-xs max-w-2xl">Query the neural net across all integrated subsystems (Docs, GitHub, Slack, Calendar).</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-4 mb-lg">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., 'Project Phoenix status'"
          className="flex-1 border-b-2 border-primary bg-transparent text-headline-md font-headline-md focus:outline-none p-2 placeholder-secondary"
        />
        <button 
          type="submit" 
          disabled={loading || !query}
          className="bg-primary text-on-primary font-label-caps text-label-caps px-xl py-sm border border-primary hover:bg-surface hover:text-primary transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg border border-primary bg-surface p-md shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {/* Left Column: Narrative Synthesis */}
          <div className="flex flex-col gap-md border-r border-primary pr-md">
            <h3 className="font-headline-lg text-headline-lg text-primary">Cross-Platform Synthesis</h3>
            <div className="font-body-lg text-body-lg text-on-surface whitespace-pre-wrap flex-1">
              {graphData.narrative_summary}
            </div>
          </div>

          {/* Right Column: Node Graph Visualization */}
          <div className="relative min-h-[300px] flex items-center justify-center bg-surface-container-lowest overflow-hidden border border-dashed border-primary p-4">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
            
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
                       <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#000" strokeWidth="1" strokeDasharray="4 4" />
                       <text x={(x1+x2)/2} y={(y1+y2)/2} fill="#000" fontSize="10" className="font-label-caps bg-white px-1">
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
