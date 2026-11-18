import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Search, FileText, HelpCircle, Phone, Lock, LogIn, ChevronDown, Download, CheckCircle, Info, MapPin, Mail, Clock, Plus, Trash2, Edit2, X, AlertCircle, Menu, Grid } from "lucide-react";
import { fetchData, saveData } from "./lib/api";

// Pages
import HomePage from "./pages/HomePage";
import ProceduresPage from "./pages/ProceduresPage";
import ServicesPage from "./pages/ServicesPage";
import FAQPage from "./pages/FAQPage";
import AdminPage from "./pages/AdminPage";
import CalidadPage from "./pages/CalidadPage";

// --- Components ---

const Logo = ({ className = "h-10" }) => (
  <Link to="/" className={`flex items-center ${className}`}>
    <img 
      src="/logo_paroissien.jpg" 
      alt="Hospital Regional Diego Paroissien" 
      className="h-full w-auto object-contain" 
      referrerPolicy="no-referrer"
    />
  </Link>
);

const Header = ({ config }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const NavLinks = ({ className = "" }) => (
    <>
      <Link to="/" onClick={() => setIsMenuOpen(false)} className={`hover:text-hospital-primary transition-colors ${location.pathname === '/' ? 'text-hospital-primary' : ''} ${className}`}>Inicio</Link>
      <Link to="/servicios" onClick={() => setIsMenuOpen(false)} className={`hover:text-hospital-primary transition-colors ${location.pathname === '/servicios' ? 'text-hospital-primary' : ''} ${className}`}>Servicios</Link>
      <Link to="/calidad" onClick={() => setIsMenuOpen(false)} className={`hover:text-hospital-primary transition-colors ${location.pathname === '/calidad' ? 'text-hospital-primary' : ''} ${className}`}>Calidad</Link>
      <Link to="/tramites" onClick={() => setIsMenuOpen(false)} className={`hover:text-hospital-primary transition-colors ${location.pathname === '/tramites' ? 'text-hospital-primary' : ''} ${className}`}>Trámites</Link>
      <Link to="/faq" onClick={() => setIsMenuOpen(false)} className={`hover:text-hospital-primary transition-colors ${location.pathname === '/faq' ? 'text-hospital-primary' : ''} ${className}`}>FAQ</Link>
      <a href="#contacto" onClick={() => setIsMenuOpen(false)} className={`hover:text-hospital-primary transition-colors ${className}`}>Contacto</a>
    </>
  );

  return (
    <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-hospital-light shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Logo className="h-10 lg:h-12" />
        
        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-10 text-sm font-bold text-slate-500 uppercase tracking-widest">
          <NavLinks />
        </nav>

        <div className="flex items-center gap-2 lg:gap-4">
          {/*<Link 
            to="/admin"
            className="p-2.5 hover:bg-hospital-light rounded-xl transition-all text-slate-400 hover:text-hospital-primary"
            title="Acceso Admin"
          >
            <Lock size={18} />
          </Link>*/}

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2.5 hover:bg-hospital-light rounded-xl transition-all text-slate-400 hover:text-hospital-primary"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-white border-b border-hospital-light overflow-hidden shadow-xl"
          >
            <nav className="flex flex-col p-6 gap-6 text-sm font-bold text-slate-500 uppercase tracking-widest shrink-0">
              <NavLinks className="py-2 border-b border-slate-50 last:border-0" />
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

const Footer = ({ config }) => (
  <footer id="contacto" className="bg-hospital-dark text-white pt-24 pb-12 px-4 relative overflow-hidden">
    <div className="max-w-7xl mx-auto relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
        <div className="col-span-1 lg:col-span-2">
          <div className="bg-white p-3 rounded-2xl inline-block mb-8 shadow-sm">
            <Logo className="h-12" />
          </div>
          <p className="text-hospital-light/60 max-w-sm leading-relaxed font-light italic">
            {/*Servicio público de salud comprometido con la excelencia asistencial.*/}
          </p>
        </div>
        
        {/*<div>
          <h4 className="text-xs font-black uppercase tracking-widest text-hospital-primary mb-6">Ubicación</h4>
          <p className="text-hospital-light flex gap-3 text-sm leading-relaxed">
            <MapPin size={18} className="shrink-0 text-hospital-primary" />
            {config?.address}
          </p>
        </div>*/}

        <div>
          <h4 className="text-xs font-black uppercase tracking-widest  mb-6">Contacto</h4>
          <div className="space-y-4">
            <p className="text-hospital-light flex gap-3 text-sm">
              <Phone size={18} className="shrink-0 text-hospital-primary" />
              {config?.phone}
            </p>
            <p className="text-hospital-light flex gap-3 text-sm">
              <Mail size={18} className="shrink-0 text-hospital-primary" />
              {config?.email}
            </p>
          </div>
        </div>
      </div>

      <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-hospital-light/40 text-xs font-medium mx-auto">© 2026 Informática. Todos los derechos reservados.</p>
        {/*<div className="flex gap-4 text-xs font-black uppercase tracking-tighter text-hospital-primary">
           <span>Accesibilidad</span>
           <span>Privacidad</span>
           <span>Gobierno</span>
        </div>*/}
      </div>
    </div>
    {/* Decorative background shape */}
    <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-hospital-primary/10 rounded-full blur-[120px]" />
  </footer>
);



// --- Main App ---

export default function App() {
  const [procedures, setProcedures] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const [p, f, c] = await Promise.all([
          fetchData("procedures"),
          fetchData("faq"),
          fetchData("siteConfig"),
        ]);
        setProcedures(p);
        setFaqs(f);
        setConfig(c);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 flex flex-col">
        {loading ? (
          <div className="h-screen w-full flex flex-col items-center justify-center bg-hospital-light/30">
            <motion.div 
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="h-24"
            >
              <Logo showText={false} className="h-24" />
            </motion.div>
            <p className="mt-8 text-hospital-dark font-bold tracking-widest text-xs uppercase animate-pulse">Cargando Portal...</p>
          </div>
        ) : (
          <>
            <Header config={config} />
            
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage config={config} />} />
                <Route path="/tramites" element={<ProceduresPage procedures={procedures} />} />
                <Route path="/servicios" element={<ServicesPage />} />
                <Route path="/calidad" element={<CalidadPage />} />
                <Route path="/faq" element={<FAQPage faqs={faqs} />} />
                <Route 
                  path="/admin" 
                  element={
                    <AdminPage 
                      procedures={procedures} 
                      setProcedures={setProcedures} 
                      faqs={faqs} 
                      setFaqs={setFaqs} 
                      config={config} 
                      setConfig={setConfig} 
                    />
                  } 
                />
              </Routes>
            </div>

            <Footer config={config} />
          </>
        )}

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&display=swap');
          
          body {
            font-family: 'Plus Jakarta Sans', sans-serif;
            scroll-behavior: smooth;
          }

          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }

          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </Router>
  );
}
