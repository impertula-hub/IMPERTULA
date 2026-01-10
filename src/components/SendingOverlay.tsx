import { motion } from "motion/react";
import { Send, CheckCircle } from "lucide-react";

interface SendingOverlayProps {
  message?: string;
}

export function SendingOverlay({ message = "Enviando mensaje..." }: SendingOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-[#003366] to-[#004488] rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-6 max-w-md mx-4"
      >
        {/* Animación del icono */}
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
          className="relative"
        >
          <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl" />
          <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-6 border-2 border-white/20">
            <Send className="h-12 w-12 text-white" />
          </div>
        </motion.div>

        {/* Texto */}
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold text-white">{message}</h3>
          <p className="text-white/80">Esto solo tomará un momento</p>
        </div>

        {/* Barra de progreso animada */}
        <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2,
              ease: "easeInOut",
            }}
            className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
