import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { FileText, Grid, ShieldCheck, ChevronRight } from "lucide-react";

export default function HomePage({ config }) {
  return (
    <div className="pt-32 pb-24 px-4 bg-gradient-to-br from-hospital-light/20 via-white to-hospital-light/5">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-7xl font-black text-hospital-dark mb-6 tracking-tighter leading-tight">
            Hospital Regional <br /> 
            <span className="text-hospital-primary">Diego Paroissien</span>
          </h1>
          <h3 className="text-xl text-slate-500 max-w-2xl mx-auto mb-2 font-bold">
            Portal de Trámites y Servicios Digitales
          </h3>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-light">
            Seleccione el área a la que desea acceder para gestionar sus tareas diarias o consultar información relevante.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> 
          <Link to="/servicios" className="group">
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center group-hover:border-hospital-primary transition-all relative overflow-hidden h-full"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-150 transition-transform">
                <Grid size={160} className="text-hospital-primary" />
              </div>
              <div className="w-20 h-20 bg-hospital-light text-hospital-primary rounded-3xl flex items-center justify-center mb-8 shadow-inner">
                <Grid size={40} />
              </div>
              <h2 className="text-3xl font-black text-hospital-dark mb-4 group-hover:text-hospital-primary transition-colors">Servicios<br/>Digitales</h2>
              <p className="text-slate-500 mb-8 max-w-xs leading-relaxed">
                Acceso directo a aplicaciones, sistemas y herramientas de uso cotidiano en el hospital.
              </p>
              <div className="flex items-center gap-2 text-hospital-primary font-bold uppercase text-xs tracking-widest">
                Explorar aplicaciones <ChevronRight size={16} />
              </div>
            </motion.div>
          </Link>

          <Link to="/tramites" className="group">
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center group-hover:border-hospital-primary transition-all relative overflow-hidden h-full"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-150 transition-transform">
                <FileText size={160} className="text-hospital-primary" />
              </div>
              <div className="w-20 h-20 bg-hospital-light text-hospital-primary rounded-3xl flex items-center justify-center mb-8 shadow-inner">
                <FileText size={40} />
              </div>
              <h2 className="text-3xl font-black text-hospital-dark mb-4 group-hover:text-hospital-primary transition-colors">Trámites<br/> e Información</h2>
              <p className="text-slate-500 mb-8 max-w-xs leading-relaxed">
                Información interna, requisitos, formularios y guías paso a paso para el personal.
              </p>
              <div className="flex items-center gap-2 text-hospital-primary font-bold uppercase text-xs tracking-widest">
                Ingresar ahora <ChevronRight size={16} />
              </div>
            </motion.div>
          </Link>

          <Link to="/calidad" className="group md:col-span-2 lg:col-span-1">
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center group-hover:border-hospital-primary transition-all relative overflow-hidden h-full"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-150 transition-transform">
                <ShieldCheck size={160} className="text-hospital-primary" />
              </div>
              <div className="w-20 h-20 bg-hospital-light text-hospital-primary rounded-3xl flex items-center justify-center mb-8 shadow-inner">
                <ShieldCheck size={40} />
              </div>
              <h2 className="text-3xl font-black text-hospital-dark mb-4 group-hover:text-hospital-primary transition-colors">Calidad y Seguridad <br/>del Paciente</h2>
              <p className="text-slate-500 mb-8 max-w-xs leading-relaxed">
                Rporte de incidentes de seguridad, estandarización de procesos y monitoreo de indicadores.
              </p>
              <div className="flex items-center gap-2 text-hospital-primary font-bold uppercase text-xs tracking-widest">
                Ver recursos <ChevronRight size={16} />
              </div>
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  );
}
