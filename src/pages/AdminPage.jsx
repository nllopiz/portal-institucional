import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Lock, 
  Plus, 
  Trash2, 
  Edit2, 
  ArrowLeft, 
  Sliders, 
  FileText, 
  HelpCircle, 
  Settings, 
  Briefcase, 
  LayoutGrid, 
  Search, 
  Clock, 
  Mail, 
  MapPin, 
  PlusCircle, 
  MinusCircle, 
  CheckCircle,
  Eye,
  EyeOff,
  AlertTriangle
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { fetchData, saveData } from "../lib/api";

const ICON_OPTIONS = ["Database", "User", "Mail", "BookOpen", "FileText", "LayoutGrid", "Settings"];

export default function AdminPage({ 
  procedures, 
  setProcedures, 
  faqs, 
  setFaqs, 
  config, 
  setConfig 
}) {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("tramites"); // 'tramites' | 'servicios' | 'faq' | 'config'
  const [error, setError] = useState("");

  // Services Local State
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);

  // Editing States
  const [editingProcedure, setEditingProcedure] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [procedureSearch, setProcedureSearch] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");

  // Helper Inputs for lists
  const [newRequirement, setNewRequirement] = useState("");
  const [newStep, setNewStep] = useState("");
  const [newDocumentation, setNewDocumentation] = useState("");

  // Check login on mount from sessionStorage
  useEffect(() => {
    const savedSession = sessionStorage.getItem("admin_session");
    if (savedSession === "active") {
      setIsLoggedIn(true);
    }
    
    // Load services
    const loadServices = async () => {
      setLoadingServices(true);
      try {
        const s = await fetchData("services");
        setServices(s);
      } catch (err) {
        console.error("Error cargando servicios", err);
      } finally {
        setLoadingServices(false);
      }
    };
    loadServices();
  }, []);

  const handleLogin = () => {
    if (config && password === config.adminPassword) {
      setIsLoggedIn(true);
      sessionStorage.setItem("admin_session", "active");
      setError("");
    } else {
      setError("Contraseña incorrecta. Por favor intente de nuevo.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem("admin_session");
  };

  const handleSaveData = async (file, data, setter) => {
    try {
      await saveData(file, data);
      setter(data);
      alert("¡Cambios guardados con éxito!");
    } catch (err) {
      alert("Error al intentar guardar cambios: " + err.message);
    }
  };

  // --- Procedures (Trámites) Handlers ---
  const handleEditProcedure = (p) => {
    setEditingProcedure({ ...p });
  };

  const handleNewProcedure = () => {
    setEditingProcedure({
      id: "",
      title: "",
      category: "asistencial",
      description: "",
      requirements: [],
      steps: [],
      documentation: [],
      hours: "Lunes a Viernes de 08:00 a 14:00",
      location: "",
      contact: "",
      pdfUrl: "",
      formUrl: ""
    });
  };

  const handleSaveProcedure = async () => {
    if (!editingProcedure.title.trim()) {
      alert("Por favor ingrese un título");
      return;
    }
    let updated;
    if (editingProcedure.id) {
      updated = procedures.map(p => p.id === editingProcedure.id ? editingProcedure : p);
    } else {
      const newId = `t${Date.now()}`;
      updated = [...procedures, { ...editingProcedure, id: newId }];
    }
    await handleSaveData("procedures", updated, setProcedures);
    setEditingProcedure(null);
  };

  const handleDeleteProcedure = (id) => {
    const proc = procedures.find(p => p.id === id);
    if (proc) {
      setDeleteConfirm({
        type: "procedure",
        id,
        title: proc.title
      });
    }
  };

  // --- Services (Servicios) Handlers ---
  const handleEditService = (s) => {
    setEditingService({ 
      category: "asistencial",
      ...s 
    });
  };

  const handleNewService = () => {
    setEditingService({
      id: "",
      name: "",
      description: "",
      url: "",
      icon: "Database",
      category: "asistencial"
    });
  };

  const handleSaveService = async () => {
    if (!editingService.name.trim()) {
      alert("Por favor ingrese un nombre");
      return;
    }
    let updated;
    if (editingService.id) {
      updated = services.map(s => s.id === editingService.id ? editingService : s);
    } else {
      const newId = `s${Date.now()}`;
      updated = [...services, { ...editingService, id: newId }];
    }
    await handleSaveData("services", updated, setServices);
    setEditingService(null);
  };

  const handleDeleteService = (id) => {
    const srv = services.find(s => s.id === id);
    if (srv) {
      setDeleteConfirm({
        type: "service",
        id,
        title: srv.name
      });
    }
  };

  // --- FAQ Handlers ---
  const handleAddFaq = () => {
    const updated = [...faqs, { question: "Nueva Pregunta", answer: "Nueva Respuesta" }];
    setFaqs(updated);
  };

  const handleDeleteFaq = (index) => {
    const faq = faqs[index];
    if (faq) {
      setDeleteConfirm({
        type: "faq",
        id: index,
        title: faq.question
      });
    }
  };

  const executeDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    const { type, id } = deleteConfirm;
    
    if (type === "procedure") {
      const updated = procedures.filter(p => p.id !== id);
      await handleSaveData("procedures", updated, setProcedures);
    } else if (type === "service") {
      const updated = services.filter(s => s.id !== id);
      await handleSaveData("services", updated, setServices);
    } else if (type === "faq") {
      const updated = faqs.filter((_, idx) => idx !== id);
      await handleSaveData("faq", updated, setFaqs);
    }
    
    setDeleteConfirm(null);
  };

  const handleSaveAllFaqs = async () => {
    await handleSaveData("faq", faqs, setFaqs);
  };

  // --- Config Handlers ---
  const handleSaveConfig = async () => {
    await handleSaveData("siteConfig", config, setConfig);
  };

  if (!isLoggedIn) {
    return (
      <div className="pt-32 pb-24 px-4 min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white p-10 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50"
        >
          <div className="w-16 h-16 bg-hospital-light text-hospital-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock size={30} />
          </div>
          <h2 className="text-3xl font-black text-center text-hospital-dark mb-2 tracking-tight">
            Acceso <span className="text-hospital-primary">Admin</span>
          </h2>
          <p className="text-center text-slate-400 text-sm font-light mb-8">
            Ingrese la contraseña del portal institucional para gestionar trámites, servicios y configuraciones.
          </p>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Contraseña de Acceso</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="••••••••"
                  className="w-full px-5 py-3.5 pr-12 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-hospital-primary/20 focus:border-hospital-primary transition-all text-base"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <button 
                onClick={handleLogin}
                className="w-full py-4 bg-hospital-primary hover:bg-hospital-dark text-white rounded-xl font-bold shadow-lg shadow-hospital-primary/20 transition-all text-sm uppercase tracking-wider"
              >
                Ingresar al Dashboard
              </button>
              <Link 
                to="/" 
                className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-all text-xs uppercase tracking-wider text-center"
              >
                Volver al Portal
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-4 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Banner/Header of Admin Panel */}
        <div className="mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link to="/" className="inline-flex items-center gap-1.5 text-xs font-black text-hospital-primary uppercase tracking-wider hover:-translate-x-1 transition-transform">
                <ArrowLeft size={14} /> Volver al Inicio
              </Link>
              <span className="text-slate-300">|</span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase">Sesión Activa</span>
            </div>
            <h1 className="text-4xl font-black text-hospital-dark tracking-tighter">
              Panel de Administración <span className="text-hospital-primary font-light">Interna</span>
            </h1>
            <p className="text-slate-500 font-light mt-1 text-sm">Gestiona todo el contenido dinámico del portal institucional de manera centralizada.</p>
          </div>

          <button 
            onClick={handleLogout}
            className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-black uppercase tracking-wider transition-all border border-red-100 shrink-0 self-start lg:self-auto"
          >
            Cerrar Sesión
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-slate-200/50 p-1.5 rounded-2xl mb-10 max-w-2xl overflow-x-auto no-scrollbar shrink-0 gap-1 shadow-sm">
          <button 
            onClick={() => { setActiveTab("tramites"); setEditingProcedure(null); }}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === "tramites" ? "bg-white text-hospital-primary shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-white/30"}`}
          >
            <FileText size={16} /> Trámites ({procedures.length})
          </button>
          <button 
            onClick={() => { setActiveTab("servicios"); setEditingService(null); }}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === "servicios" ? "bg-white text-hospital-primary shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-white/30"}`}
          >
            <LayoutGrid size={16} /> Servicios ({services.length})
          </button>
          <button 
            onClick={() => { setActiveTab("faq"); }}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === "faq" ? "bg-white text-hospital-primary shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-white/30"}`}
          >
            <HelpCircle size={16} /> FAQs ({faqs.length})
          </button>
          <button 
            onClick={() => { setActiveTab("config"); }}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${activeTab === "config" ? "bg-white text-hospital-primary shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-white/30"}`}
          >
            <Settings size={16} /> Configuración
          </button>
        </div>

        {/* Tabs Contents */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/30 p-8">
          
          {/* TRÁMITES TAB */}
          {activeTab === "tramites" && (
            <div>
              {!editingProcedure ? (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                      <h2 className="text-2xl font-black text-hospital-dark tracking-tight">Gestión de Trámites Internos</h2>
                      <p className="text-slate-400 text-sm font-light">Agregue o modifique trámites del portal para el personal del hospital.</p>
                    </div>
                    <div className="flex flex-wrap gap-4 w-full sm:w-auto">
                      <div className="relative flex-grow sm:flex-grow-0">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                          type="text" 
                          placeholder="Buscar trámite..."
                          value={procedureSearch}
                          onChange={(e) => setProcedureSearch(e.target.value)}
                          className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-hospital-primary/20 focus:border-hospital-primary"
                        />
                      </div>
                      <button 
                        onClick={handleNewProcedure}
                        className="px-5 py-3 bg-hospital-primary hover:bg-hospital-dark text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-hospital-primary/15"
                      >
                        <Plus size={16} /> Nuevo Trámite
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {procedures
                      .filter(p => p.title.toLowerCase().includes(procedureSearch.toLowerCase()) || p.description.toLowerCase().includes(procedureSearch.toLowerCase()))
                      .map(p => (
                        <div 
                          key={p.id} 
                          className="p-5 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center justify-between hover:border-hospital-primary/50 hover:bg-white hover:shadow-md transition-all group"
                        >
                          <div className="flex items-center gap-4 overflow-hidden">
                            <div className={`w-12 h-12 rounded-xl shrink-0 ${p.category === "asistencial" ? "bg-emerald-50 text-emerald-600" : p.category === "general" ? "bg-amber-50 text-amber-600" : "bg-hospital-light text-hospital-primary"} flex items-center justify-center font-black text-xs uppercase`}>
                              {p.category === "asistencial" ? "ASI" : p.category === "general" ? "GEN" : "ADM"}
                            </div>
                            <div className="overflow-hidden">
                              <h3 className="font-bold text-slate-800 truncate">{p.title}</h3>
                              <p className="text-slate-400 text-xs truncate max-w-md font-light">{p.description}</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-1.5 shrink-0 ml-4">
                            <button 
                              onClick={() => handleEditProcedure(p)}
                              title="Editar Trámite"
                              className="p-2.5 hover:bg-hospital-light text-slate-500 hover:text-hospital-primary rounded-xl transition-colors"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteProcedure(p.id)}
                              title="Eliminar Trámite"
                              className="p-2.5 hover:bg-red-50 text-slate-300 hover:text-red-600 rounded-xl transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="text-xl font-black text-hospital-dark italic">
                        {editingProcedure.id ? "Editar Trámite" : "Nuevo Trámite de Información"}
                      </h3>
                      <p className="text-slate-400 text-xs font-light mt-0.5">Defina los detalles, requisitos y flujos para esta guía.</p>
                    </div>
                    <button 
                      onClick={() => setEditingProcedure(null)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold uppercase transition-all"
                    >
                      Volver a la Lista
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Título del Trámite</label>
                      <input 
                        type="text" 
                        value={editingProcedure.title}
                        onChange={e => setEditingProcedure({...editingProcedure, title: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-hospital-primary/20 focus:border-hospital-primary"
                        placeholder="Ej. Solicitud de Vacaciones Extraordinarias"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Categoría</label>
                      <select 
                        value={editingProcedure.category}
                        onChange={e => setEditingProcedure({...editingProcedure, category: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-hospital-primary/20 focus:border-hospital-primary bg-white font-medium"
                      >
                        <option value="asistencial">Asistencial</option>
                        <option value="administrativo">Administrativo</option>
                        <option value="general">General</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Descripción Corta</label>
                    <textarea 
                      value={editingProcedure.description}
                      onChange={e => setEditingProcedure({...editingProcedure, description: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-hospital-primary/20 focus:border-hospital-primary h-24 text-sm resize-none"
                      placeholder="Breve resumen del trámite..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Horarios de Atención</label>
                      <input 
                        type="text" 
                        value={editingProcedure.hours}
                        onChange={e => setEditingProcedure({...editingProcedure, hours: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-hospital-primary/20 focus:border-hospital-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Oficina / Ubicación</label>
                      <input 
                        type="text" 
                        value={editingProcedure.location}
                        onChange={e => setEditingProcedure({...editingProcedure, location: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-hospital-primary/20 focus:border-hospital-primary"
                        placeholder="Ej. Planta Baja - Oficina de Personal"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Email de Contacto</label>
                      <input 
                        type="text" 
                        value={editingProcedure.contact}
                        onChange={e => setEditingProcedure({...editingProcedure, contact: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-hospital-primary/20 focus:border-hospital-primary"
                        placeholder="personal@hospitalparoisien.gob.ar"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Descargar PDF (Link)</label>
                      <input 
                        type="text" 
                        value={editingProcedure.pdfUrl || ""}
                        onChange={e => setEditingProcedure({...editingProcedure, pdfUrl: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-hospital-primary/20 focus:border-hospital-primary"
                        placeholder="https://ejemplo.com/documento.pdf"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Link Formulario (Link)</label>
                      <input 
                        type="text" 
                        value={editingProcedure.formUrl || ""}
                        onChange={e => setEditingProcedure({...editingProcedure, formUrl: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-hospital-primary/20 focus:border-hospital-primary"
                        placeholder="https://forms.gle/... o enlace externo"
                      />
                    </div>
                  </div>

                  {/* ARRAY EDITORS (Requirements, Steps, Documentation) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100">
                    
                    {/* Requirements Array */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Requisitos</span>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={newRequirement}
                          onChange={(e) => setNewRequirement(e.target.value)}
                          placeholder="Nuevo requisito..."
                          className="flex-grow px-3 py-2 text-xs border rounded-lg focus:outline-none focus:border-hospital-primary"
                        />
                        <button 
                          onClick={() => {
                            if (newRequirement.trim()) {
                              setEditingProcedure({
                                ...editingProcedure,
                                requirements: [...editingProcedure.requirements, newRequirement.trim()]
                              });
                              setNewRequirement("");
                            }
                          }}
                          className="px-2.5 py-1 bg-hospital-primary text-white rounded-lg hover:bg-hospital-dark shrink-0 flex items-center justify-center"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar">
                        {editingProcedure.requirements.map((req, index) => (
                          <div key={index} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border text-xs text-slate-600">
                            <span className="truncate pr-2">{req}</span>
                            <button 
                              onClick={() => {
                                setEditingProcedure({
                                  ...editingProcedure,
                                  requirements: editingProcedure.requirements.filter((_, idx) => idx !== index)
                                });
                              }}
                              className="text-slate-300 hover:text-red-500"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Steps Array */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Pasos del Trámite</span>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={newStep}
                          onChange={(e) => setNewStep(e.target.value)}
                          placeholder="Siguiente paso..."
                          className="flex-grow px-3 py-2 text-xs border rounded-lg focus:outline-none focus:border-hospital-primary"
                        />
                        <button 
                          onClick={() => {
                            if (newStep.trim()) {
                              setEditingProcedure({
                                ...editingProcedure,
                                steps: [...editingProcedure.steps, newStep.trim()]
                              });
                              setNewStep("");
                            }
                          }}
                          className="px-2.5 py-1 bg-hospital-primary text-white rounded-lg hover:bg-hospital-dark shrink-0 flex items-center justify-center"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar">
                        {editingProcedure.steps ? editingProcedure.steps.map((st, index) => (
                          <div key={index} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border text-xs text-slate-600">
                            <span className="truncate pr-2">{index + 1}. {st}</span>
                            <button 
                              onClick={() => {
                                setEditingProcedure({
                                  ...editingProcedure,
                                  steps: editingProcedure.steps.filter((_, idx) => idx !== index)
                                });
                              }}
                              className="text-slate-300 hover:text-red-500"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        )) : null}
                      </div>
                    </div>

                    {/* Documentation Array */}
                    <div className="space-y-3">
                      <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">Documentación Requerida</span>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={newDocumentation}
                          onChange={(e) => setNewDocumentation(e.target.value)}
                          placeholder="Documento/Formulario..."
                          className="flex-grow px-3 py-2 text-xs border rounded-lg focus:outline-none focus:border-hospital-primary"
                        />
                        <button 
                          onClick={() => {
                            if (newDocumentation.trim()) {
                              setEditingProcedure({
                                ...editingProcedure,
                                documentation: [...(editingProcedure.documentation || []), newDocumentation.trim()]
                              });
                              setNewDocumentation("");
                            }
                          }}
                          className="px-2.5 py-1 bg-hospital-primary text-white rounded-lg hover:bg-hospital-dark shrink-0 flex items-center justify-center"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar">
                        {(editingProcedure.documentation || []).map((doc, index) => (
                          <div key={index} className="flex justify-between items-center bg-slate-50 p-2.5 rounded-lg border text-xs text-slate-600">
                            <span className="truncate pr-2">{doc}</span>
                            <button 
                              onClick={() => {
                                setEditingProcedure({
                                  ...editingProcedure,
                                  documentation: editingProcedure.documentation.filter((_, idx) => idx !== index)
                                });
                              }}
                              className="text-slate-300 hover:text-red-500"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                    <button 
                      onClick={() => setEditingProcedure(null)}
                      className="px-5 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={handleSaveProcedure}
                      className="px-8 py-3 bg-hospital-primary hover:bg-hospital-dark text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-hospital-primary/10"
                    >
                      Guardar Trámite
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}


          {/* SERVICIOS TAB */}
          {activeTab === "servicios" && (
            <div>
              {!editingService ? (
                <div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                      <h2 className="text-2xl font-black text-hospital-dark tracking-tight">Gestión de Servicios y Aplicaciones</h2>
                      <p className="text-slate-400 text-sm font-light">Agregue o configure accesos directos a plataformas y sistemas externos.</p>
                    </div>
                    <div className="flex flex-wrap gap-4 w-full sm:w-auto">
                      <div className="relative flex-grow sm:flex-grow-0">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                          type="text" 
                          placeholder="Buscar servicio..."
                          value={serviceSearch}
                          onChange={(e) => setServiceSearch(e.target.value)}
                          className="w-full sm:w-64 pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-hospital-primary/20 focus:border-hospital-primary"
                        />
                      </div>
                      <button 
                        onClick={handleNewService}
                        className="px-5 py-3 bg-hospital-primary hover:bg-hospital-dark text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-hospital-primary/15"
                      >
                        <Plus size={16} /> Nuevo Servicio
                      </button>
                    </div>
                  </div>

                  {loadingServices ? (
                    <p className="text-center text-slate-400 py-8 font-light italic">Cargando lista de servicios...</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {services
                        .filter(s => s.name.toLowerCase().includes(serviceSearch.toLowerCase()) || s.description.toLowerCase().includes(serviceSearch.toLowerCase()))
                        .map(s => (
                          <div 
                            key={s.id} 
                            className="p-5 bg-slate-50 rounded-2xl border border-slate-200/60 flex items-center justify-between hover:border-hospital-primary/50 hover:bg-white hover:shadow-md transition-all group"
                          >
                            <div className="flex items-center gap-4 overflow-hidden">
                              <div className="w-12 h-12 rounded-xl shrink-0 bg-hospital-light text-hospital-primary flex items-center justify-center font-bold font-mono text-sm uppercase">
                                {s.icon.substring(0, 3)}
                              </div>
                              <div className="overflow-hidden">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-bold text-slate-800 truncate">{s.name}</h3>
                                  <span className={`px-2 py-0.5 text-[9px] font-black rounded-md uppercase tracking-wider ${
                                    s.category === "general" 
                                      ? "bg-indigo-50 text-indigo-600 border border-indigo-200/50" 
                                      : s.category === "administrativo" 
                                        ? "bg-blue-50 text-blue-600 border border-blue-200/50" 
                                        : "bg-emerald-50 text-emerald-600 border border-emerald-200/50"
                                  }`}>
                                    {s.category === "general" ? "General" : s.category === "administrativo" ? "Admin" : "Asist"}
                                  </span>
                                </div>
                                <p className="text-slate-400 text-xs truncate max-w-md font-light italic">{s.url}</p>
                              </div>
                            </div>
                            
                            <div className="flex gap-1.5 shrink-0 ml-4">
                              <button 
                                onClick={() => handleEditService(s)}
                                title="Editar Servicio"
                                className="p-2.5 hover:bg-hospital-light text-slate-500 hover:text-hospital-primary rounded-xl transition-colors"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteService(s.id)}
                                title="Eliminar Servicio"
                                className="p-2.5 hover:bg-red-50 text-slate-300 hover:text-red-600 rounded-xl transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <h3 className="text-xl font-black text-hospital-dark italic">
                        {editingService.id ? "Editar Servicio" : "Nuevo Servicio Institucional"}
                      </h3>
                      <p className="text-slate-400 text-xs font-light mt-0.5">Defina las credenciales de navegación de la tarjeta de servicio.</p>
                    </div>
                    <button 
                      onClick={() => setEditingService(null)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold uppercase transition-all"
                    >
                      Volver a la Lista
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Nombre del Servicio / App</label>
                      <input 
                        type="text" 
                        value={editingService.name}
                        onChange={e => setEditingService({...editingService, name: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-hospital-primary/20 focus:border-hospital-primary"
                        placeholder="Ej. Portal de Recetas Digitales"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Icono Lucide</label>
                      <select 
                        value={editingService.icon}
                        onChange={e => setEditingService({...editingService, icon: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-hospital-primary/20 focus:border-hospital-primary bg-white font-medium"
                      >
                        {ICON_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">URL de Destino (Enlace Externo)</label>
                      <input 
                        type="url" 
                        value={editingService.url}
                        onChange={e => setEditingService({...editingService, url: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-hospital-primary/20 focus:border-hospital-primary"
                        placeholder="https://su-subdominio.hospitalparoisien.gob.ar"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Categoría</label>
                      <select 
                        value={editingService.category || "asistencial"}
                        onChange={e => setEditingService({...editingService, category: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-hospital-primary/20 focus:border-hospital-primary bg-white font-medium"
                      >
                        <option value="asistencial">Asistencial</option>
                        <option value="administrativo">Administrativo</option>
                        <option value="general">General</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Descripción Detallada</label>
                      <textarea 
                        value={editingService.description}
                        onChange={e => setEditingService({...editingService, description: e.target.value})}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-hospital-primary/20 focus:border-hospital-primary h-24 text-sm resize-none"
                        placeholder="Breve descripción del propósito y uso del servicio..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                    <button 
                      onClick={() => setEditingService(null)}
                      className="px-5 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button 
                      onClick={handleSaveService}
                      className="px-8 py-3 bg-hospital-primary hover:bg-hospital-dark text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-hospital-primary/10"
                    >
                      Guardar Servicio
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}


          {/* FAQs TAB */}
          {activeTab === "faq" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-2xl font-black text-hospital-dark tracking-tight">Preguntas Frecuentes (FAQ)</h2>
                  <p className="text-slate-400 text-sm font-light">Escriba y estructure directivas de soporte técnico frecuentes.</p>
                </div>
                <button 
                  onClick={handleAddFaq}
                  className="px-4 py-2.5 bg-hospital-light hover:bg-hospital-primary text-hospital-primary hover:text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all"
                >
                  <Plus size={16} /> Agregar Pregunta
                </button>
              </div>

              <div className="space-y-6">
                {faqs.map((f, i) => (
                  <div key={i} className="p-6 bg-slate-50 border border-slate-200/80 rounded-2xl relative space-y-4 shadow-sm hover:bg-white transition-all">
                    <button 
                      onClick={() => handleDeleteFaq(i)}
                      className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Eliminar FAQ"
                    >
                      <Trash2 size={16} />
                    </button>
                    
                    <div className="space-y-2 max-w-4xl">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Pregunta institucional #{i + 1}</label>
                      <input 
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-hospital-primary/20 focus:border-hospital-primary outline-none bg-white" 
                        value={f.question}
                        onChange={(e) => {
                          const updated = [...faqs];
                          updated[i].question = e.target.value;
                          setFaqs(updated);
                        }}
                      />
                    </div>
                    
                    <div className="space-y-2 max-w-4xl">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Respuesta estructurada</label>
                      <textarea 
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-hospital-primary/20 focus:border-hospital-primary outline-none h-24 bg-white resize-none" 
                        value={f.answer}
                        onChange={(e) => {
                          const updated = [...faqs];
                          updated[i].answer = e.target.value;
                          setFaqs(updated);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-6 border-t border-slate-100">
                <button 
                  onClick={handleSaveAllFaqs} 
                  className="px-8 py-3.5 bg-hospital-primary text-white rounded-xl font-bold hover:bg-hospital-dark transition-colors shadow-lg shadow-hospital-primary/20 text-sm"
                >
                  Guardar Todo FAQs
                </button>
              </div>
            </div>
          )}


          {/* CONFIGURATION TAB */}
          {activeTab === "config" && (
            <div className="space-y-8 max-w-3xl">
              <div>
                <h2 className="text-2xl font-black text-hospital-dark tracking-tight">Configuración del Portal</h2>
                <p className="text-slate-400 text-sm font-light">Modifique la información estática del centro asistencial y credenciales de acceso.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">Nombre del Hospital</label>
                  <input 
                    className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-hospital-primary/20 focus:border-hospital-primary outline-none" 
                    value={config.hospitalName} 
                    onChange={e => setConfig({...config, hospitalName: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">Dirección Física</label>
                  <input 
                    className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-hospital-primary/20 focus:border-hospital-primary outline-none" 
                    value={config.address} 
                    onChange={e => setConfig({...config, address: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">Teléfono Directo</label>
                  <input 
                    className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-hospital-primary/20 focus:border-hospital-primary outline-none" 
                    value={config.phone} 
                    onChange={e => setConfig({...config, phone: e.target.value})} 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-wider text-slate-500">Email de Soporte Administrativo</label>
                  <input 
                    className="w-full p-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-hospital-primary/20 focus:border-hospital-primary outline-none" 
                    value={config.email} 
                    onChange={e => setConfig({...config, email: e.target.value})} 
                  />
                </div>
              </div>

              <div className="p-6 bg-amber-50/50 border border-amber-100 rounded-2xl max-w-xl space-y-4">
                <div className="flex gap-2 items-center text-amber-800">
                  <Lock size={18} />
                  <span className="text-xs font-black uppercase tracking-wider">Credenciales de Seguridad</span>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-amber-900 block">Contraseña del Administrador</label>
                  <input 
                    type="text" 
                    className="w-full p-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-white font-mono text-sm" 
                    value={config.adminPassword} 
                    onChange={e => setConfig({...config, adminPassword: e.target.value})} 
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={handleSaveConfig} 
                  className="px-8 py-3.5 bg-hospital-primary hover:bg-hospital-dark text-white rounded-xl font-bold transition-all shadow-lg shadow-hospital-primary/20 text-sm"
                >
                  Actualizar Configuración General
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-2xl p-6 max-w-md w-full space-y-6"
            >
              <div className="flex gap-4 items-start col-span-12">
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 shrink-0">
                  <AlertTriangle size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-slate-900 text-lg">¿Confirmar Eliminación?</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Está a punto de eliminar {deleteConfirm.type === 'procedure' ? 'el trámite' : deleteConfirm.type === 'service' ? 'el servicio' : 'la pregunta FAQ'}:
                  </p>
                  <p className="font-bold text-slate-800 text-sm mt-1 bg-slate-50 p-3 rounded-xl border border-slate-100 italic">
                    "{deleteConfirm.title}"
                  </p>
                  <p className="text-xs text-red-500 font-medium mt-2">
                    Esta acción no se puede deshacer.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={executeDeleteConfirm}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-red-600/10"
                >
                  Confirmar y Eliminar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
