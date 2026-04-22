import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton({ show, onClick, className = "" }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          onClick={onClick}
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.9 }}
          transition={{ duration: 0.25 }}
          className={`fixed bottom-6 right-4 z-50 flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgb(21,98,160)] text-white shadow-[0_10px_25px_rgba(21,98,160,0.35)] hover:bg-[rgb(15,75,125)] active:scale-95 ${className}`}
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
