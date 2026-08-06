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
              className="text-xs bg-primary text-on-primary px-2 py-1 font-label-caps hover:bg-surface hover:text-primary transition-colors border border-primary disabled:opacity-50"
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
        
        <div className="flex flex-col border border-primary bg-surface h-[calc(100vh-250px)] overflow-y-auto">
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
                className={`p-sm border-b cursor-pointer transition-colors relative overflow-hidden ${
                  isActive 
                    ? 'border-primary bg-primary text-on-primary' 
                    : 'border-secondary-container hover:bg-secondary-container text-primary'
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
        {/* Extracted Entities (Data Grid) */}
        <div>
          <div className="flex items-center justify-between border-b border-primary pb-xs mb-md">
            <h2 className="font-label-caps text-label-caps text-primary">
              Extracted Entities: <span className="text-secondary">{activeDoc ? activeDoc.file_name : 'No Document Selected'}</span>
            </h2>
          </div>
          <div className="border border-primary bg-surface overflow-x-auto min-h-[200px]">
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
                      <tr key={i} className="border-b border-secondary-container hover:bg-secondary-container transition-colors">
                        <td className="p-sm">
                          <span className={`border border-primary px-2 py-0.5 text-xs font-label-caps uppercase ${entity.type === 'Critical' ? 'bg-primary text-on-primary' : ''}`}>
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
        <div className="flex-grow flex flex-col">
          <div className="flex items-center justify-between border-b border-primary pb-xs mb-md">
            <h2 className="font-label-caps text-label-caps text-primary">Knowledge Topology</h2>
          </div>
          <div className="flex-grow border border-primary bg-surface relative overflow-hidden min-h-[400px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-surface-container-high via-surface to-surface opacity-50"></div>
            <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(to right, #e2e2e2 1px, transparent 1px), linear-gradient(to bottom, #e2e2e2 1px, transparent 1px)", backgroundSize: "40px 40px" }}></div>
            
            {activeDoc && (
              <>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-32 px-4 h-12 bg-primary text-on-primary flex items-center justify-center font-label-caps text-xs z-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center line-clamp-1">
                    {activeDoc.file_name.substring(0, 15)}...
                </div>
                
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  {activeDoc.entities?.entities?.map((_, i) => (
                    <line key={i} stroke="#000000" strokeWidth="1" strokeDasharray={i % 2 === 0 ? "4 4" : ""} x1="50%" x2={`${20 + (i * 15)}%`} y1="50%" y2={`${30 + (i % 2 === 0 ? 50 : 0)}%`}></line>
                  ))}
                </svg>
                
                {activeDoc.entities?.entities?.map((ent, i) => (
                  <div key={i} className="absolute border border-primary bg-surface px-4 py-2 font-label-caps text-xs text-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-secondary-container transition-colors cursor-pointer max-w-[150px] truncate"
                    style={{
                      top: `${30 + (i % 2 === 0 ? 50 : 0)}%`,
                      left: `${20 + (i * 15)}%`,
                      transform: 'translate(-50%, -50%)'
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
