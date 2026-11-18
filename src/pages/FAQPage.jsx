import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ArrowLeft, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function FAQPage({ faqs }) {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <main className="pt-32 pb-24 px-4 min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-hospital-primary font-bold text-sm mb-6 hover:-translate-x-1 transition-transform">
            <ArrowLeft size={16} /> Volver al Inicio
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-hospital-light text-hospital-primary rounded-2xl flex items-center justify-center">
              <HelpCircle size={28} />
            </div>
            <h1 className="text-4xl font-black text-hospital-dark tracking-tighter">Preguntas <span className="text-hospital-primary">Frecuentes</span></h1>
          </div>
          <p className="text-slate-500 font-light text-lg">¿Tiene dudas adicionales? Quizás aquí encuentre la respuesta.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full text-left px-6 py-6 flex items-center justify-between gap-4 group"
              >
                <span className="font-bold text-slate-700 group-hover:text-hospital-primary transition-colors uppercase text-sm tracking-wide">
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`text-slate-400 transition-transform duration-300 ${openIndex === i ? 'rotate-180 text-hospital-primary' : ''}`} 
                  size={20} 
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <div className="px-6 pb-6 text-slate-500 leading-relaxed flex gap-6">
                      <div className="w-1.5 h-auto bg-hospital-light rounded-full shrink-0" />
                      <p className="text-base font-light italic">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 p-10 bg-hospital-dark rounded-[2.5rem] text-white text-center relative overflow-hidden">
           <div className="absolute top-0 right-0 p-8 opacity-10">
              <HelpCircle size={120} />
           </div>
           <h3 className="text-2xl font-black mb-4 relative z-10">¿No encontró lo que buscaba?</h3>
           <p className="text-slate-300 mb-8 max-w-md mx-auto font-light relative z-10">Nuestro equipo de soporte técnico y administrativo está disponible para ayudarle con cualquier consulta adicional.</p>
           <a href="#contacto" className="inline-flex items-center gap-2 px-8 py-3 bg-hospital-primary text-white rounded-xl font-bold hover:bg-white hover:text-hospital-dark transition-all shadow-lg relative z-10">
             Contactar con soporte
           </a>
        </div>
      </div>
    </main>
  );
}
