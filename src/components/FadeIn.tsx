"use client";
import { motion } from "framer-motion";

export default function FadeIn({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Empieza invisible y 20px abajo
      animate={{ opacity: 1, y: 0 }}  // Termina visible y en su lugar
      transition={{ duration: 0.5, delay, ease: "easeOut" }} // Tarda 0.5s
    >
      {children}
    </motion.div>
  );
}