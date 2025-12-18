import React from 'react';

interface ProvincePresentationProps {
  onClose: () => void;
}

export const ProvincePresentation: React.FC<ProvincePresentationProps> = ({ onClose }) => {
  return (
    <div className="w-full h-full relative flex flex-col bg-white overflow-hidden select-none font-serif">
      {/* Sidebar Accent Teal */}
      <div className="absolute left-0 top-0 bottom-0 w-[2.2%] bg-[#4eb1ba]"></div>

      {/* Exit Button - Overlay */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 z-[2000] w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all text-slate-400 shadow-sm"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      <div className="flex-1 ml-[2.2%] p-6 flex flex-col">
        {/* HEADER SECTION - REPLICATING PHOTO BLOCKS */}
        <div className="flex items-stretch gap-3 mb-12">
          {/* Block 1: Project Identity */}
          <div className="w-[28%] border-[1.5px] border-[#000080] p-2 text-center bg-white shadow-sm flex flex-col justify-center">
            <h1 className="text-[#000080] font-bold text-xl leading-tight">Projet du PDTI</h1>
            <h1 className="text-[#000080] font-bold text-xl leading-tight">de la Province de Tétouan</h1>
            <p className="text-[11px] text-black font-bold leading-tight mt-1">
              (La 1<sup>ère</sup> Tranche Prioritaire,<br/>Au titre de l’Année 2026)
            </p>
          </div>
          
          {/* Block 2: Axis Indicator */}
          <div className="flex-1 flex items-stretch">
            <div className="border-[1.5px] border-[#000080] bg-[#eef7f8] flex items-center justify-center px-5 mr-2">
              <span className="text-[#d12027] font-black text-2xl">I</span>
            </div>
            <div className="flex-1 border-[1.5px] border-[#000080] bg-white flex items-center px-5">
              <h2 className="text-[#000080] font-bold text-[26px]">Diagnostics et Formulation des Projets par Axe</h2>
            </div>
          </div>

          {/* Block 3: Subsection */}
          <div className="w-[42%] flex items-stretch">
            <div className="border-[1.5px] border-[#000080] bg-[#f2f2f2] flex items-center justify-center px-4 mr-2">
               <span className="text-[#d12027] font-black text-2xl">I.1</span>
            </div>
            <div className="flex-1 border-[1.5px] border-[#000080] bg-white flex items-center px-5">
               <h2 className="text-[22px] font-bold text-[#000080]">Présentation Succincte de la Province de Tétouan</h2>
            </div>
          </div>
        </div>

        {/* MAIN BODY GRID */}
        <div className="grid grid-cols-2 gap-16 flex-1 px-4">
          
          {/* LEFT CONTENT */}
          <div className="space-y-12">
            {/* Section A */}
            <section>
              <h3 className="text-[#2c8a2e] text-[22px] font-bold mb-4">
                A. Enoncés démographiques et géographiques
              </h3>
              <div className="w-full">
                <table className="w-full border-collapse border border-slate-300">
                  <thead className="bg-[#4eb1ba] text-white">
                    <tr>
                      <th className="p-2 text-left font-bold text-lg border border-white">Indicateurs</th>
                      <th className="p-2 text-center font-bold text-lg border border-white">Valeurs (2024)</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white text-[17px] font-sans">
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 text-slate-800 font-medium pl-4">Population</td>
                      <td className="p-2.5 text-center text-black font-bold">611 928 habitants</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2.5 text-slate-800 font-medium pl-4">Taux de la population rurale</td>
                      <td className="p-2.5 text-center text-black font-bold">28,1%</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="p-2.5 text-[#d12027] font-bold italic pl-4">Taux de la population urbaine</td>
                      <td className="p-2.5 text-center text-[#d12027] font-black italic">71,9%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] mt-1 text-black font-bold">Source: HCP 2024</p>
            </section>

            {/* Superficie Flow Diagram */}
            <div className="flex items-center">
               {/* Left Square */}
               <div className="w-32 h-20 bg-[#4eb1ba] border-[1.5px] border-[#000080] flex flex-col items-center justify-center text-white relative z-20">
                  <span className="text-[14px] font-bold">Superficie:</span>
                  <span className="text-xl font-black">2541 Km²</span>
                  {/* Extension line to trunk */}
                  <div className="absolute left-full top-1/2 w-4 h-[1.5px] bg-[#4eb1ba] -translate-y-1/2"></div>
               </div>

               {/* Connecting Branches */}
               <div className="flex-1 pl-8 relative">
                  {/* Vertical Trunk Line */}
                  <div className="absolute left-0 top-[15%] bottom-[15%] w-[1.5px] bg-[#4eb1ba]"></div>
                  
                  <div className="space-y-2">
                    {[
                      { l: "Littoral", v: "29,6 Km" },
                      { l: "SAU", v: "29%" },
                      { l: "Zones montagneuses", v: "86 %" },
                      { l: "Forêts", v: "31 %" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center">
                        <div className="w-8 h-[1.5px] bg-[#4eb1ba]"></div>
                        <div className="flex-1 bg-white border-[3px] border-black rounded-[4px] py-1 text-center">
                           <span className="text-[#000080] font-black text-[19px] mr-2">{item.l} :</span>
                           <span className="text-[#d12027] font-black text-[19px] font-sans">{item.v}</span>
                        </div>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="space-y-10">
            {/* Section B - SVG Map */}
            <section>
              <h3 className="text-[#2c8a2e] text-[22px] font-bold mb-4 text-right pr-4">
                B. Carte de la Province de Tétouan
              </h3>
              <div className="flex items-start">
                <div className="flex-1 relative">
                   <svg viewBox="0 0 400 300" className="w-full">
                      {/* Rural Shape (Green) */}
                      <path d="M60 150 L110 60 L210 40 L310 90 L360 160 L330 260 L210 290 L90 270 Z" fill="#2c8a2e" />
                      
                      {/* Urban Dots (Orange) */}
                      <circle cx="345" cy="185" r="14" fill="#ff7f32" />
                      <path d="M265 110 Q285 100 305 120 L295 150 Q275 140 265 110" fill="#ff7f32