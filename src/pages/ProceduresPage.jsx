import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, FileText, ChevronDown, Download, CheckCircle, Info, Clock, X, ArrowLeft, MapPin, Mail, ClipboardList, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProceduresPage({ procedures }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filtered = procedures.filter(p => {
    const pCat = p.category || "asistencial";
    const matchesFilter = filter === "all" || pCat === filter || (filter !== "general" && pCat === "general");
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="pt-32 pb-24 px-4 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header Section Matches Services Design */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="flex-grow">
            <Link to="/" className="inline-flex items-center gap-2 text-hospital-primary font-bold text-sm mb-6 hover:-translate-x-1 transition-transform">
              <ArrowLeft size={16} /> Volver al Inicio
            </Link>
            <h1 className="text-4xl font-black text-hospital-dark tracking-tighter">Trámites e <span className="text-hospital-primary">Información</span></h1>
            <p className="text-slate-500 mt-2 font-light">Guía completa y requisitos para el personal asistencial y administrativo.</p>
          </div>
          
          {/* Controls: Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar trámite..."
                className="w-full sm:w-60 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-hospital-primary/20 focus:border-hospital-primary transition-all text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex bg-slate-200/50 p-1 rounded-xl">
              {["all", "asistencial", "administrativo", "general"].map((f) => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${filter === f ? 'bg-white text-hospital-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {f === 'all' ? 'Todos' : f === 'asistencial' ? 'Asistencial' : f === 'administrativo' ? 'Admin' : 'General'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Procedures Grid Matches Services Design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, idx) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="group relative bg-white p-8 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 flex flex-col hover:border-hospital-primary hover:shadow-xl transition-all h-full cursor-pointer"
                onClick={() => setSelected(p)}
              >
                <div className={`w-14 h-14 ${p.category === 'asistencial' ? 'bg-emerald-50 text-emerald-600' : p.category === 'general' ? 'bg-amber-50 text-amber-600' : 'bg-hospital-light text-hospital-primary'} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <FileText size={28} />
                </div>
                <h3 className="text-xl font-bold text-hospital-dark mb-3 leading-tight group-hover:text-hospital-primary transition-colors">
                  {p.title}
                </h3>
                <p className="text-sm text-slate-500 font-light leading-relaxed mb-8 flex-grow line-clamp-3">
                  {p.description}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                   <div className="flex items-center gap-1.5">
                     <Clock size={12} className="text-slate-400" />
                     <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{p.hours.split(" ")[0]}...</span>
                   </div>
                   <ChevronDown size={14} className="text-hospital-primary -rotate-90 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Detail Modal Remains (as Trámites need deep info) */}
      <AnimatePresence>
        {selected && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setSelected(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-start shrink-0">
                <div className="flex gap-4">
                  <div className={`w-14 h-14 ${selected.category === 'asistencial' ? 'bg-emerald-100 text-emerald-600' : selected.category === 'general' ? 'bg-amber-100 text-amber-600' : 'bg-hospital-light text-hospital-primary'} rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0`}>
                    {selected.category === 'asistencial' ? 'AS' : selected.category === 'general' ? 'G' : 'AD'}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">
                      {selected.category === 'asistencial' ? 'Asistencial' : selected.category === 'general' ? 'General' : 'Administrativo'}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">{selected.title}</h3>
                  </div>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-900">
                  <X />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-8 space-y-10 custom-scrollbar">
                <div>
                  <h4 className="text-xs font-black uppercase text-hospital-primary mb-4 tracking-wider flex items-center gap-2">
                    <Info size={14} /> Descripción del Trámite
                  </h4>
                  <p className="text-slate-600 leading-relaxed italic">{selected.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left Column: Requirements & Documentation */}
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-xs font-black uppercase text-hospital-primary mb-4 tracking-wider flex items-center gap-2">
                        <CheckCircle size={14} /> Requisitos
                      </h4>
                      {selected.requirements && selected.requirements.length > 0 ? (
                        <ul className="space-y-3">
                          {selected.requirements.map((req, i) => (
                            <li key={i} className="text-sm text-slate-600 flex gap-3">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 shrink-0" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-slate-400 italic">No se requieren condiciones previas.</p>
                      )}
                    </div>

                    {selected.documentation && selected.documentation.length > 0 && (
                      <div>
                        <h4 className="text-xs font-black uppercase text-hospital-primary mb-4 tracking-wider flex items-center gap-2">
                          <ClipboardList size={14} /> Documentación Requerida
                        </h4>
                        <ul className="space-y-3">
                          {selected.documentation.map((doc, i) => (
                            <li key={i} className="text-sm text-slate-600 flex gap-3">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                              {doc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Steps & Location/Contact */}
                  <div className="space-y-8">
                    {selected.steps && selected.steps.length > 0 && (
                      <div>
                        <h4 className="text-xs font-black uppercase text-hospital-primary mb-4 tracking-wider flex items-center gap-2">
                          <ClipboardList size={14} /> Pasos a Seguir
                        </h4>
                        <ol className="space-y-4">
                          {selected.steps.map((step, i) => (
                            <li key={i} className="text-sm text-slate-600 flex gap-4">
                              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-hospital-light text-hospital-primary font-bold text-xs shrink-0">
                                {i + 1}
                              </span>
                              <span className="mt-0.5">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}

                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                      <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-2">
                        <Clock size={14} className="text-hospital-primary" /> Información de Atención
                      </h4>
                      <div className="space-y-3 text-sm text-slate-600">
                        {selected.hours && (
                          <div className="flex gap-2.5">
                            <Clock size={16} className="text-slate-400 shrink-0 mt-0.5" />
                            <span><strong>Horarios:</strong> {selected.hours}</span>
                          </div>
                        )}
                        {selected.location && (
                          <div className="flex gap-2.5">
                            <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                            <span><strong>Ubicación:</strong> {selected.location}</span>
                          </div>
                        )}
                        {selected.contact && (
                          <div className="flex gap-2.5">
                            <Mail size={16} className="text-slate-400 shrink-0 mt-0.5" />
                            <span><strong>Contacto:</strong> {selected.contact}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3 shrink-0">
                {/* Button 1: Link Formulario */}
                {selected.formUrl ? (
                  <a 
                    href={selected.formUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-hospital-light text-hospital-primary hover:bg-hospital-primary hover:text-white rounded-xl font-bold transition-all text-sm shadow-sm"
                  >
                    <ExternalLink size={18} /> Link Formulario
                  </a>
                ) : (
                  <button 
                    disabled 
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-400 rounded-xl font-bold cursor-not-allowed text-sm"
                  >
                    <ExternalLink size={18} /> Formulario no disponible
                  </button>
                )}

                {/* Button 2: Descargar PDF */}
                {selected.pdfUrl ? (
                  <a 
                    href={selected.pdfUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-hospital-primary hover:bg-hospital-dark text-white rounded-xl font-bold transition-all text-sm shadow-lg shadow-hospital-primary/20"
                  >
                    <Download size={18} /> Descargar PDF
                  </a>
                ) : (
                  <button 
                    disabled 
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 text-slate-400 rounded-xl font-bold cursor-not-allowed text-sm"
                  >
                    <Download size={18} /> PDF no disponible
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
