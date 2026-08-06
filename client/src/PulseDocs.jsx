import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const PulseDocs = () => {
  const [documents, setDocuments] = useState([]);
  const [activeDoc, setActiveDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/docs`);
      setDocuments(response.data);
      if (response.data.length > 0) {
        setActiveDoc(response.data[0]);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/docs/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const newDoc = response.data.document;
      setDocuments([newDoc, ...documents]);
      setActiveDoc(newDoc);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to analyze document');
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex-1 p-margin-mobile md:p-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-gutter max-w-[1440px] mx-auto w-full">
      {/* Document Corpus List (Left Column) */}
      <aside className="col-span-1 lg:col-span-3 flex flex-col gap-md">
        <div className="flex items-center justify-between border-b border-primary pb-xs">
          <h2 className="font-label-caps text-label-caps text-primary">Document Corpus</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => fileInputRef.current?.click()} 
              disabled={uploading}
              className="press-feedback text-xs bg-black dark:bg-white text-white dark:text-black px-4 py-1.5 rounded-md font-label-caps hover:opacity-90 transition-opacity disabled:opacity-50 shadow-sm"
            >
              {uploading ? 'ANALYZING...' : '+ UPLOAD MEDIA'}
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileUpload}
            />
          </div>
        </div>
        
        {error && <div className="text-error text-xs font-bold p-2 bg-error-container">{error}</div>}
        
        <div className="flex flex-col linear-surface h-[calc(100vh-250px)] overflow-y-auto stagger-children">
          {loading && <div className="p-4 text-center font-label-caps text-secondary">Loading Database...</div>}
          
          {documents.length === 0 && !loading && (
            <div className="p-4 text-center font-label-caps text-secondary">No documents uploaded.</div>
          )}

          {documents.map((doc) => {
            const isActive = activeDoc?.id === doc.id;
            return (
              <div 
                key={doc.id}
                onClick={() => setActiveDoc(doc)}
                className={`p-3 border-b border-black/10 dark:border-white/10 last:border-0 cursor-pointer transition-colors relative enter-fade-up ${
                  isActive 
                    ? 'bg-black/5 dark:bg-white/10 text-black dark:text-white' 
                    : 'bg-transparent hover:bg-black/5 dark:hover:bg-white/5 text-secondary dark:text-secondary-fixed'
                }`}
              >
                {isActive && <div className="absolute inset-0 bg-white/10 pointer-events-none"></div>}
                <div className="flex justify-between items-start mb-1 relative z-10">
                  <span className={`font-label-caps text-label-caps ${isActive ? 'text-inverse-primary' : 'text-secondary'}`}>
                    {doc.id.substring(0, 8).toUpperCase()}
                  </span>
                  <span className={`text-caption font-caption ${isActive ? 'text-inverse-primary' : 'text-secondary'}`}>
                    {new Date(doc.uploaded_at).toLocaleDateString()}
                  </span>
                </div>
                <h3 className={`font-body-md text-body-md font-bold mb-1 relative z-10 ${isActive ? 'text-on-primary' : 'text-primary'}`}>
                  {doc.file_name}
                </h3>
              </div>
            );
          })}
        </div>
      </aside>

      {/* Center/Right Area: Extracted Entities & Topology */}
      <section className="col-span-1 lg:col-span-9 flex flex-col gap-lg">
        
        {/* Document Intelligence Overview (Summary & Suggestions) */}
        {activeDoc && activeDoc.entities && (activeDoc.entities.summary || activeDoc.entities.suggestions) && (
          <div className="flex flex-col gap-md">
            
            {/* Summary Panel */}
            {activeDoc.entities.summary && (
              <div className="bg-black/5 dark:bg-white/5 p-4 rounded-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-black dark:bg-white"></div>
                <h2 className="font-[Inter] text-xs font-semibold text-black dark:text-white uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">subject</span>
                  Executive Summary
                </h2>
                <p className="font-body-md text-sm text-black dark:text-white leading-relaxed">{activeDoc.entities.summary}</p>
              </div>
            )}

            {/* Suggestions Panel */}
            {activeDoc.entities.suggestions && activeDoc.entities.suggestions.length > 0 && (
              <div className="linear-surface p-6 enter-fade-up" style={{ animationDelay: '100ms' }}>
                <h2 className="font-[Inter] text-xs font-semibold text-black dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">lightbulb</span>
                  Strategic Suggestions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-sm">
                  {activeDoc.entities.suggestions.map((suggestion, idx) => (
                    <div key={idx} className="bg-transparent border border-black/10 dark:border-white/10 rounded-md p-3 flex items-start gap-2 hover:border-black/30 dark:hover:border-white/30 transition-colors cursor-default hover-lift">
                      <span className="font-[JetBrains_Mono] text-black dark:text-white bg-black/5 dark:bg-white/10 px-1.5 py-0.5 text-[10px] rounded">
                        0{idx + 1}
                      </span>
                      <p className="font-body-md text-sm text-primary">
                        {suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        )}

        <div className="enter-fade-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2 mb-4">
            <h2 className="font-[Inter] text-xs font-semibold text-black dark:text-white uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">data_object</span>
              Raw Entities: <span className="text-secondary dark:text-secondary-fixed">{activeDoc ? activeDoc.file_name : 'No Document Selected'}</span>
            </h2>
          </div>
          <div className="linear-surface overflow-hidden min-h-[200px]">
            {activeDoc ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-primary bg-surface-container-low">
                    <th className="p-sm font-label-caps text-label-caps text-primary">Entity Type</th>
                    <th className="p-sm font-label-caps text-label-caps text-primary">Value</th>
                    <th className="p-sm font-label-caps text-label-caps text-primary">Confidence</th>
                  </tr>
                </thead>
                <tbody className="font-body-md text-body-md text-on-surface">
                  {activeDoc.entities?.entities?.length > 0 ? (
                    activeDoc.entities.entities.map((entity, i) => (
                      <tr key={i} className="border-b border-black/5 dark:border-white/5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-black dark:text-white">
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-label-caps uppercase ${entity.type === 'Critical' ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-black/5 dark:bg-white/10 text-secondary dark:text-secondary-fixed'}`}>
                            {entity.type}
                          </span>
                        </td>
                        <td className="p-sm font-bold">{entity.value}</td>
                        <td className="p-sm font-label-caps text-secondary">{entity.confidence || '95%'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="p-md text-center text-secondary font-label-caps">No entities extracted.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-secondary font-label-caps">
                Select a document to view entities
              </div>
            )}
          </div>
        </div>

        {/* Knowledge Topology (Visualization Area) */}
        <div className="flex-grow flex flex-col enter-fade-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-2 mb-4">
            <h2 className="font-[Inter] text-xs font-semibold text-black dark:text-white uppercase tracking-widest">Knowledge Topology</h2>
          </div>
          <div className="flex-grow bg-[#F4F5F8] dark:bg-[#111111] rounded border border-black/5 dark:border-white/5 relative overflow-hidden min-h-[400px]">
            <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
            
            {activeDoc && (
              <>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-32 px-4 h-10 bg-black dark:bg-white text-white dark:text-black rounded-md flex items-center justify-center font-label-caps text-[10px] z-10 shadow-sm text-center line-clamp-1">
                    {activeDoc.file_name.substring(0, 15)}...
                </div>
                
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  {activeDoc.entities?.entities?.map((_, i) => (
                    <line key={i} stroke="#000000" strokeWidth="1" strokeDasharray={i % 2 === 0 ? "4 4" : ""} x1="50%" x2={`${20 + (i * 15)}%`} y1="50%" y2={`${30 + (i % 2 === 0 ? 50 : 0)}%`}></line>
                  ))}
                </svg>
                
                {activeDoc.entities?.entities?.map((ent, i) => (
                  <div key={i} className="absolute linear-surface bg-white dark:bg-[#1A1B22] px-3 py-1.5 font-label-caps text-[10px] text-black dark:text-white shadow-sm hover:border-black/30 dark:hover:border-white/30 transition-colors cursor-pointer max-w-[150px] truncate hover-lift enter-scale"
                    style={{
                      top: `${30 + (i % 2 === 0 ? 50 : 0)}%`,
                      left: `${20 + (i * 15)}%`,
                      transform: 'translate(-50%, -50%)',
                      animationDelay: `${400 + (i * 50)}ms`
                    }}
                  >
                      {ent.value}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PulseDocs;
