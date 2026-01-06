"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const questions = [
  {
    q: "¿Cuánto tarda el envío?",
    a: "En Santiago entregamos en 24-48 horas hábiles. Para regiones, el tiempo es de 3 a 5 días hábiles a través de BlueExpress."
  },
  {
    q: "¿Tienen tienda física?",
    a: "Por el momento somos una tienda 100% online, lo que nos permite ofrecerte mejores precios al no tener costos de local."
  },
  {
    q: "¿Qué medios de pago aceptan?",
    a: "Aceptamos todas las tarjetas de crédito, débito y prepago a través de WebPay Plus (Transbank). Es totalmente seguro."
  },
  {
    q: "¿Puedo devolver un producto?",
    a: "¡Claro! Tienes 10 días desde que recibes tu compra para solicitar cambio o devolución si el producto no cumple tus expectativas."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-3xl font-black text-center mb-12 tracking-tight">Preguntas Frecuentes</h2>
        
        <div className="space-y-4">
          {questions.map((item, i) => (
            <div key={i} className="border border-gray-200 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex justify-between items-center p-6 text-left bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="font-bold text-gray-900">{item.q}</span>
                <span className={`transform transition-transform duration-300 ${openIndex === i ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </button>
              
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-50"
                  >
                    <div className="p-6 pt-0 text-gray-600 text-sm leading-relaxed">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}