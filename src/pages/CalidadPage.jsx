import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Database, User, Mail, BookOpen, ExternalLink, ArrowLeft, FileText, AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchData } from "../lib/api";

const ICON_MAP = {
  Database: Database,
  User: User,
  Mail: Mail,
  BookOpen: BookOpen,
  FileText: FileText
};

export default function CalidadPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchData("calidad");
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los recursos de Calidad y Seguridad del Paciente.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadData();
  }, [loadData]);

  const searchTerm = search.trim().toLowerCase();

  const filtered = services.filter(s => {
    const serviceCategory = s.category || "asistencial";
    const matchesFilter = filter === "all" || serviceCategory === filter || (filter !== "general" && serviceCategory === "general");
    const matchesSearch =
      (s.name || "").toLowerCase().includes(searchTerm) ||
      (s.description || "").toLowerCase().includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="pt-32 pb-24 px-4 min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-hospital-dark">
          <Loader2 className="animate-spin text-hospital-primary" size={36} />
          <p className="text-xs font-bold uppercase tracking-widest animate-pulse">Cargando recursos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-4 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-grow">
            <Link to="/" className="inline-flex items-center gap-2 text-hospital-primary font-bold text-sm mb-6 hover:-translate-x-1 transition-transform">
              <ArrowLeft size={16} /> Volver al Inicio
            </Link>
            <h1 className="text-4xl font-black text-hospital-dark tracking-tighter">Calidad y Seguridad<span className="text-hospital-primary"> del Paciente</span></h1>
            <p className="text-slate-500 mt-2 font-light">Gestión de Riesgo, reporte de incidentes de seguridad, estandarización de procesos y monitoreo de indicadores para garantizar una atención segura y de calidad.</p>
          </div>

          {/* Controls: Search */}
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar recurso..."
                aria-label="Buscar recurso de Calidad y Seguridad"
                className="w-full sm:w-60 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-hospital-primary/20 focus:border-hospital-primary transition-all text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {/* 
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
            Controls: Search and Filter */}
          </div>
        </div>

        {error ? (
          <div className="max-w-xl mx-auto bg-white p-10 rounded-3xl border border-red-100 shadow-lg text-center">
            <AlertCircle className="mx-auto text-red-500 mb-4" size={40} />
            <h2 className="text-xl font-black text-hospital-dark mb-2">No se pudieron cargar los recursos</h2>
            <p className="text-slate-500 font-light mb-6">{error}</p>
            <button 
              onClick={loadData}
              className="inline-flex items-center gap-2 px-6 py-3 bg-hospital-primary hover:bg-hospital-dark text-white rounded-xl font-bold text-sm transition-all"
            >
              <RefreshCw size={16} /> Reintentar
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="max-w-xl mx-auto bg-white p-10 rounded-3xl border border-slate-200 shadow-sm text-center">
            <Search className="mx-auto text-slate-300 mb-4" size={40} />
            <h2 className="text-xl font-black text-hospital-dark mb-2">Sin resultados</h2>
            <p className="text-slate-500 font-light mb-6">
              {search ? `No encontramos recursos para "${search}".` : "Todavía no hay recursos cargados en esta sección."}
            </p>
            {search && (
              <button 
                onClick={() => setSearch("")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-hospital-primary hover:bg-hospital-dark text-white rounded-xl font-bold text-sm transition-all"
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((service, idx) => {
                const IconComp = ICON_MAP[service.icon] || ExternalLink;
                return (
                  <motion.a
                    key={service.id}
                    href={service.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="group relative bg-white p-8 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 flex flex-col hover:border-hospital-primary hover:shadow-xl transition-all h-full"
                  >
                    <div className="w-14 h-14 bg-hospital-light text-hospital-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      <IconComp size={28} />
                    </div>
                    <h3 className="text-xl font-bold text-hospital-dark mb-3 leading-tight group-hover:text-hospital-primary transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-sm text-slate-500 font-light leading-relaxed mb-8 flex-grow">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                       <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Abrir App</span>
                       <ExternalLink size={14} className="text-hospital-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </motion.a>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
