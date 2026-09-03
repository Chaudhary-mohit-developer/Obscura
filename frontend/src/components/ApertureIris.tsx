import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Shield, Lock, EyeOff, Sparkles, Cpu } from 'lucide-react';
import { VerificationSession } from '../types/midnight';

interface ApertureIrisProps {
  session: VerificationSession;
  stageProgress: number; // 0 to 100
}

export const ApertureIris: React.FC<ApertureIrisProps> = ({ session, stageProgress }) => {
  const isProving = session.stage === 'witness_prep' || session.stage === 'synthesizing_proof' || session.stage === 'submitting_ledger';
  const isVerified = session.stage === 'verified';
  const isFailed = session.stage === 'failed';

  // Number of aperture blades
  const blades = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <div className="relative flex flex-col items-center justify-center p-6 sm:p-10 select-none">
      {/* Outer Glow Halo */}
      <div
        className={`absolute w-72 h-72 sm:w-88 sm:h-88 rounded-full filter blur-3xl transition-all duration-700 pointer-events-none ${
          isVerified
            ? 'bg-emerald-400/20 dark:bg-emerald-500/15'
            : isFailed
            ? 'bg-rose-500/20 dark:bg-rose-500/15'
            : isProving
            ? 'bg-gradient-to-tr from-violet-500/30 via-teal-400/25 to-rose-400/20 animate-pulse'
            : 'bg-violet-400/15 dark:bg-violet-600/10'
        }`}
      />

      {/* Main Aperture Housing / Lens Ring */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full glass-panel flex items-center justify-center border-2 border-white/80 dark:border-white/15 shadow-2xl overflow-hidden">
        {/* Concentric Calibration Ticks Ring */}
        <motion.div
          animate={{ rotate: isProving ? 360 : 0 }}
          transition={{
            repeat: isProving ? Infinity : 0,
            duration: 12,
            ease: 'linear',
          }}
          className="absolute inset-2 rounded-full border border-dashed border-violet-400/40 dark:border-violet-300/25 pointer-events-none"
        />

        {/* Optical Glass Lens Reflection Layer */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent dark:via-white/5 rounded-full pointer-events-none" />

        {/* Dynamic Iris Blades (Rotating and Contracting/Expanding) */}
        <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-full flex items-center justify-center">
          {blades.map((angle, index) => (
            <motion.div
              key={index}
              style={{ originX: 0.5, originY: 0.5 }}
              animate={{
                rotate: isProving ? angle + stageProgress * 3.6 : angle,
                scale: isProving ? [1, 0.85, 1.05, 0.9][index % 4] : isVerified ? 0.75 : 1,
              }}
              transition={{
                duration: isProving ? 1.8 : 0.6,
                repeat: isProving ? Infinity : 0,
                ease: 'easeInOut',
              }}
              className="absolute w-28 h-10 -left-4 rounded-3xl opacity-25 dark:opacity-20 pointer-events-none bg-gradient-to-r from-violet-600 via-teal-500 to-transparent"
            />
          ))}

          {/* Aperture Core (The Center Hole / Iris Diaphragm) */}
          <motion.div
            animate={{
              scale: isProving ? [0.7, 0.45, 0.65, 0.5] : isVerified ? 1.15 : isFailed ? 0.8 : 1,
            }}
            transition={{
              duration: isProving ? 1.2 : 0.5,
              repeat: isProving ? Infinity : 0,
              ease: 'easeInOut',
            }}
            className={`relative w-32 h-32 sm:w-36 sm:h-36 rounded-full flex flex-col items-center justify-center p-4 transition-all duration-500 shadow-inner ${
              isVerified
                ? 'bg-gradient-to-tr from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/40 border-2 border-emerald-400/60'
                : isFailed
                ? 'bg-gradient-to-tr from-rose-50 to-amber-50 dark:from-rose-950/50 dark:to-slate-900 border-2 border-rose-400/60'
                : isProving
                ? 'bg-gradient-to-tr from-violet-500/10 to-teal-500/10 dark:from-violet-900/30 dark:to-teal-900/20 border-2 border-violet-400/50'
                : 'bg-white/80 dark:bg-slate-800/80 border-2 border-slate-200/80 dark:border-slate-700/80'
            }`}
          >
            {/* Center State Content */}
            {isVerified && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-11 h-11 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-1">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 tracking-wide uppercase">
                  Eligible
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Zero Leakage</span>
              </motion.div>
            )}

            {isFailed && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-11 h-11 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 mb-1">
                  <X className="w-6 h-6 stroke-[3]" />
                </div>
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 tracking-wide uppercase">
                  Ineligible
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Under Required Age</span>
              </motion.div>
            )}

            {isProving && (
              <div className="flex flex-col items-center text-center">
                <Cpu className="w-7 h-7 text-teal-600 dark:text-teal-400 animate-pulse mb-1" />
                <span className="text-xs font-semibold text-violet-600 dark:text-violet-300">
                  Synthesizing
                </span>
                <span className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  {stageProgress}%
                </span>
              </div>
            )}

            {!isProving && !isVerified && !isFailed && (
              <div className="flex flex-col items-center text-center text-slate-600 dark:text-slate-300">
                <Shield className="w-7 h-7 text-violet-500 dark:text-violet-400 mb-1" />
                <span className="text-xs font-semibold">Camera Obscura</span>
                <span className="text-[10px] text-slate-400">Aperture Idle</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Proof Progress Caption */}
      <div className="mt-5 text-center max-w-xs">
        {session.stage === 'witness_prep' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 justify-center text-xs font-medium text-slate-600 dark:text-slate-300">
            <Lock className="w-3.5 h-3.5 text-violet-500" />
            <span>Securing private witness inputs locally...</span>
          </motion.div>
        )}
        {session.stage === 'synthesizing_proof' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 justify-center text-xs font-medium text-slate-600 dark:text-slate-300">
            <Sparkles className="w-3.5 h-3.5 text-teal-500 animate-spin" />
            <span>Evaluating Compact arithmetic constraints...</span>
          </motion.div>
        )}
        {session.stage === 'submitting_ledger' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 justify-center text-xs font-medium text-slate-600 dark:text-slate-300">
            <Shield className="w-3.5 h-3.5 text-rose-500" />
            <span>Broadcasting proof commitment to Midnight...</span>
          </motion.div>
        )}
        {session.stage === 'verified' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 justify-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <EyeOff className="w-3.5 h-3.5" />
            <span>Verified on Midnight ledger. Raw age never revealed!</span>
          </motion.div>
        )}
        {session.stage === 'idle' && (
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Enter private age and trigger the ZK aperture circuit.
          </div>
        )}
      </div>
    </div>
  );
};
