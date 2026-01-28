import { motion } from 'framer-motion';
import { BrainCircuit } from 'lucide-react';

interface SplashProps {
  onEnter: () => void;
}

export const Splash = ({ onEnter }: SplashProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.8 }}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-cyber-black px-4"
    >
      {/* 旋转的赛博太极图 */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="w-48 h-48 sm:w-64 sm:h-64 border border-cyber-cyan/30 rounded-full flex items-center justify-center relative"
      >
        <div className="absolute inset-0 border-t border-cyber-cyan w-full h-full rounded-full animate-spin-slow" />
        <div className="w-36 h-36 sm:w-48 sm:h-48 border border-cyber-red/30 rounded-full flex items-center justify-center">
          <BrainCircuit className="w-16 h-16 sm:w-24 sm:h-24 text-cyber-cyan opacity-80" />
        </div>
      </motion.div>
      
      {/* 应用标题 */}
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 sm:mt-12 text-5xl sm:text-6xl font-display text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-cyber-red"
      >
        灵机
      </motion.h1>
      
      {/* 副标题 */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-3 sm:mt-4 font-display text-cyber-cyan/60 tracking-widest text-base sm:text-lg"
      >
        赛博占卜系统
      </motion.p>

      {/* 进入按钮 */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        onClick={onEnter}
        whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(0, 255, 204, 0.3)" }}
        whileTap={{ scale: 0.95 }}
        className="mt-12 sm:mt-16 px-8 sm:px-12 py-2.5 sm:py-3 border border-cyber-cyan text-cyber-cyan font-display text-lg sm:text-xl hover:bg-cyber-cyan hover:text-cyber-black transition-colors duration-300 rounded-sm tracking-widest"
      >
        启动天机
      </motion.button>
    </motion.div>
  );
};

export default Splash;
