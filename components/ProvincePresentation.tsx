import React, { useState, useEffect } from 'react';

interface ProvincePresentationProps {
  onClose: () => void;
}

/**
 * Premium Integrated Slide Viewer.
 * Features: Cinematic loading state, High-fidelity fallback, and interactive gallery stage.
 */
export const ProvincePresentation: React.FC<ProvincePresentationProps> = ({ onClose }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Auto-scroll to top when component mounts
  useEffect(() => {
    const stage = document.getElementById('slide-stage');
    if (stage) stage.scrollTop = 0;
  }, []);

  return (
    <div className="w-full h-full bg-[#0f172a] flex flex-col relative group overflow-hidden select-none">
      
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full animate-pulse" />
      </div>

      {/* Floating Precision Header */}
      <div className="absolute top-4 left-4 right-4 h-20 px-8 flex items-center justify-between bg-slate-900/80 backdrop-blur-2xl border border-white/10 z-50 rounded-2xl shadow-2xl transition-all duration-500 opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0">
        <div className="flex items-center gap-6">
           <div className="w-12 h-12 bg-white flex items-center justify-center rounded-xl shadow-inner border border-[#000080]/20">
              <span className="text-[#000080] font-black text-xl">I.1</span>
           </div>
           <div className="flex flex-col">
             <h3 className="text-white font-black uppercase text-[12px] tracking-[0.2em] leading-none mb-1">Diagnostic Territorial</h3>
             <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest leading-none opacity-60">Archive Officielle PDTI 2026</p>
           </div>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsZoomed(!isZoomed)}
            className="flex items-center gap-3 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all active:scale-95 shadow-lg shadow-blue-600/20"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d={isZoomed ? "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" : "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"} />
            </svg>
            <span className="text-[11px] font-black uppercase tracking-widest">{isZoomed ? "Réduire" : "Explorer"}</span>
          </button>
          
          <div className="h-10 w-px bg-white/10"></div>

          <button 
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center bg-red-600 hover:bg-red-500 text-white rounded-xl transition-all shadow-xl shadow-red-600/20 active:scale-90"
            title="Quitter la vue"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Presentation Stage */}
      <div 
        id="slide-stage"
        className={`flex-1 overflow-auto custom-scrollbar flex items-center justify-center p-12 transition-all duration-700 bg-black/20 ${isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
        onClick={() => setIsZoomed(!isZoomed)}
      >
        <div className={`relative transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] ${isZoomed ? 'scale-150 p-32' : 'scale-[0.98] md:scale-100'}`}>
          
          {/* Document Frame */}
          <div className="relative bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.6)] border border-white/20 p-1.5 rounded-sm ring-1 ring-white/10 overflow-hidden">
            
            {/* Loading Indicator */}
            {loading && !error && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50">
                 <div className="w-16 h-16 border-4 border-blue-600/10 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                 <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest animate-pulse">Chargement du Diagnostic...</p>
              </div>
            )}

            {/* Error / Missing File Fallback */}
            {error ? (
              <div className="w-[1024px] h-[768px] bg-white flex flex-col items-center justify-center p-20 text-center border-[20px] border-slate-50">
                 <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mb-8 border border-slate-200">
                    <svg className="w-12 h-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                 </div>
                 <h2 className="text-4xl font-black text-[#000080] mb-4">I.1 Diagnostic Succinct</h2>
                 <p className="text-slate-500 max-w-md font-medium text-lg mb-8 leading-relaxed">
                   La photo <span className="font-bold text-red-500">diapo.png</span> est introuvable.
                 </p>
                 <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Vérifications nécessaires :</p>
                    <ul className="text-sm text-slate-600 text-left space-y-1 list-disc list-inside">
                      <li>Nom exacte : <b>diapo.png</b> (tout en minuscules)</li>
                      <li>Emplacement : À côté de <b>index.tsx</b></li>
                      <li>Format : Doit être un vrai fichier <b>.png</b></li>
                    </ul>
                 </div>
              </div>
            ) : (
              <img 
                src="diapo.png" 
                alt="Diagnostic PDTI Tétouan" 
                className={`max-w-[90vw] max-h-[85vh] object-contain transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setLoading(false)}
                onError={() => {
                  setLoading(false);
                  setError(true);
                }}
              />
            )}

            {/* Subtle Surface Reflection */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/0 via-white/0 to-white/5 opacity-40"></div>
          </div>
        </div>
      </div>

      {/* Interaction Hint */}
      {!isZoomed && !error && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-slate-900/90 backdrop-blur-xl border border-white/10 px-8 py-3.5 rounded-full text-white shadow-2xl opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-500">
           <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></div>
           <span className="text-[11px] font-black uppercase tracking-[0.2em]">Cliquer pour explorer les détails</span>
        </div>
      )}

      {/* Legal & Meta Info */}
      <div className="absolute bottom-6 left-10 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity flex items-center gap-4">
         <div className="w-10 h-0.5 bg-white/20"></div>
         <p className="text-[9px] font-bold text-white uppercase tracking-[0.4em] leading-none">Diffusion Restreinte | Tanger-Tetouan-Al Hoceima</p>
      </div>
    </div>
  );
};