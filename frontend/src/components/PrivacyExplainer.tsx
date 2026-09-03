import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ShieldCheck, Database, KeyRound, Server, FileCheck2, Cpu } from 'lucide-react';

interface PrivacyExplainerProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const PrivacyExplainer: React.FC<PrivacyExplainerProps> = () => {
  return (
    <div className="w-full glass-panel rounded-3xl p-6 sm:p-8 mt-10 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
              Privacy Architecture
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            How Obscura Protects Your Identity
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Understanding Midnight's dual-state ledger model and selective disclosure.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
            <Lock className="w-3 h-3" /> Zero Knowledge Verified
          </span>
        </div>
      </div>

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Invisible / Private Box */}
        <div className="p-5 sm:p-6 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/70 dark:border-rose-900/40">
          <div className="flex items-center gap-2.5 mb-4 text-rose-700 dark:text-rose-400">
            <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-900/60 flex items-center justify-center">
              <EyeOff className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-base">Invisible Data (Client-Only Private Witness)</h4>
              <p className="text-xs text-rose-600/80 dark:text-rose-400/80">Never leaves your device unencrypted</p>
            </div>
          </div>

          <ul className="space-y-3">
            <li className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
              <Lock className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-slate-100 font-semibold">Exact Chronological Age:</strong>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">Your exact age is consumed solely as a private witness inside the client arithmetic circuit.</p>
              </div>
            </li>

            <li className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
              <KeyRound className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-slate-100 font-semibold">Blinding Salt (secretSalt):</strong>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">256-bit cryptographically secure random entropy prevents reverse-lookup dictionary attacks.</p>
              </div>
            </li>

            <li className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
              <Cpu className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-slate-100 font-semibold">Private Identity Secret:</strong>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">Prevents front-running or proof copying by unauthorized third parties.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Visible / Public Box */}
        <div className="p-5 sm:p-6 rounded-2xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/70 dark:border-teal-900/40">
          <div className="flex items-center gap-2.5 mb-4 text-teal-700 dark:text-teal-400">
            <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-900/60 flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-base">Visible Proof (Public On-Chain Ledger)</h4>
              <p className="text-xs text-teal-600/80 dark:text-teal-400/80">Publicly auditable by any Midnight node</p>
            </div>
          </div>

          <ul className="space-y-3">
            <li className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
              <FileCheck2 className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-slate-100 font-semibold">Boolean Assertion (isEligible):</strong>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">The blockchain records only that the threshold was satisfied, with no numeric information.</p>
              </div>
            </li>

            <li className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
              <Database className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-slate-100 font-semibold">Context Nullifier Hash:</strong>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">Enforces single-use eligibility within the current epoch without revealing user identity.</p>
              </div>
            </li>

            <li className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
              <Server className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 dark:text-slate-100 font-semibold">Aggregate Verified Counter:</strong>
                <p className="text-slate-500 dark:text-slate-400 mt-0.5">Monotonically increments total successful verifications while maintaining user anonymity.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
