import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Lock,
  CheckCircle,
  XCircle,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { ApertureIris } from './ApertureIris';
import { VerificationSession } from '../types/midnight';
import { evaluateAgeEligibilityCircuit } from '../../../contract/circuit';

interface EligibilityGateProps {
  walletAddress: string | null;
  onConnectPrompt: () => void;
  minAgeThreshold?: number;
}

export const EligibilityGate: React.FC<EligibilityGateProps> = ({
  walletAddress,
  onConnectPrompt,
  minAgeThreshold = 18,
}) => {
  const [inputAge, setInputAge] = useState<number>(21);
  const [progress, setProgress] = useState<number>(0);
  const [copiedProof, setCopiedProof] = useState<boolean>(false);
  const [copiedNullifier, setCopiedNullifier] = useState<boolean>(false);

  const [session, setSession] = useState<VerificationSession>({
    stage: 'idle',
    privateAgeInput: 21,
    thresholdRequired: minAgeThreshold,
    isEligible: null,
  });

  const handleGenerateProof = async () => {
    if (!walletAddress) {
      onConnectPrompt();
      return;
    }

    setSession({
      stage: 'witness_prep',
      privateAgeInput: inputAge,
      thresholdRequired: minAgeThreshold,
      isEligible: null,
      startTime: Date.now(),
    });
    setProgress(15);

    // Stage 1: Witness generation & blinding salt
    await new Promise((r) => setTimeout(r, 600));
    setSession((prev) => ({ ...prev, stage: 'synthesizing_proof' }));
    setProgress(55);

    // Stage 2: Arithmetic constraint evaluation
    await new Promise((r) => setTimeout(r, 800));
    setProgress(85);

    // Stage 3: Synthesize proof via local Compact circuit engine
    const salt = 'a9f24e' + Math.random().toString(16).substring(2, 10) + '00000000000000000000000000000000';
    const secret = 'bb81cd' + Math.random().toString(16).substring(2, 10) + '00000000000000000000000000000000';
    const nonce = `epoch_ctx_${Date.now()}`;

    const circuitResult = evaluateAgeEligibilityCircuit(
      {
        userAge: inputAge,
        secretSalt: salt,
        identitySecret: secret,
      },
      {
        contextNonce: nonce,
        publicMinAgeThreshold: minAgeThreshold,
        spentNullifierRoot: '',
      }
    );

    setSession((prev) => ({ ...prev, stage: 'submitting_ledger' }));
    setProgress(95);

    await new Promise((r) => setTimeout(r, 600));
    setProgress(100);

    if (circuitResult.isValid) {
      setSession({
        stage: 'verified',
        privateAgeInput: inputAge,
        thresholdRequired: minAgeThreshold,
        isEligible: true,
        proofHash: circuitResult.proofHash,
        nullifierHash: circuitResult.nullifierHash,
        txHash: `0x${circuitResult.proofHash.slice(4, 36)}...midnight`,
        endTime: Date.now(),
      });
    } else {
      setSession({
        stage: 'failed',
        privateAgeInput: inputAge,
        thresholdRequired: minAgeThreshold,
        isEligible: false,
        error: circuitResult.error || 'Age requirement not met.',
        endTime: Date.now(),
      });
    }
  };

  const resetGate = () => {
    setSession({
      stage: 'idle',
      privateAgeInput: inputAge,
      thresholdRequired: minAgeThreshold,
      isEligible: null,
    });
    setProgress(0);
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Interactive Gate Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden"
      >
        {/* Step indicator header */}
        <div className="flex items-center justify-between pb-5 mb-6 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-violet-600 text-white font-bold text-xs shadow-md shadow-violet-500/30">
              01
            </span>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Zero-Knowledge Eligibility Gate</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Proving condition: Age &gt;= {minAgeThreshold}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300">
            <Lock className="w-3.5 h-3.5" /> Client Witness
          </div>
        </div>

        {/* Wallet Connection Status Warning if not connected */}
        {!walletAddress && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-semibold text-amber-900 dark:text-amber-200">
                Midnight Lace Wallet Required
              </span>
              <p className="text-amber-700 dark:text-amber-400/90 mt-0.5">
                Connect your Midnight wallet to sign zero-knowledge state transactions.
              </p>
              <button
                onClick={onConnectPrompt}
                className="mt-2 inline-flex items-center gap-1.5 font-bold text-violet-600 dark:text-violet-400 hover:underline"
              >
                Connect Wallet Now <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Input Configuration Card */}
        <div className="p-6 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <label className="block text-sm font-bold text-slate-800 dark:text-slate-200">
                Your Private Chronological Age
              </label>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Never sent to any server or validator
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="120"
                value={inputAge}
                onChange={(e) => setInputAge(Math.max(1, parseInt(e.target.value) || 1))}
                disabled={session.stage !== 'idle'}
                className="w-16 px-2.5 py-1 text-center font-mono font-bold text-lg rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <span className="text-xs text-slate-500 font-medium">years</span>
            </div>
          </div>

          {/* Interactive Range Slider */}
          <input
            type="range"
            min="10"
            max="80"
            value={inputAge}
            onChange={(e) => setInputAge(parseInt(e.target.value))}
            disabled={session.stage !== 'idle'}
            className="age-slider my-3"
          />

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>10 yrs</span>
            <span className="text-violet-600 dark:text-violet-400 font-semibold">
              Threshold Barrier: {minAgeThreshold}
            </span>
            <span>80 yrs</span>
          </div>

          {/* Test Preset Buttons */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-700/60">
            <span className="text-[11px] font-medium text-slate-500">Quick Test Scenarios:</span>
            <button
              onClick={() => setInputAge(16)}
              disabled={session.stage !== 'idle'}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-100/70 hover:bg-rose-200 dark:bg-rose-950/60 dark:hover:bg-rose-900 text-rose-700 dark:text-rose-300 transition-colors"
            >
              16 (Underage Test)
            </button>
            <button
              onClick={() => setInputAge(18)}
              disabled={session.stage !== 'idle'}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-violet-100/70 hover:bg-violet-200 dark:bg-violet-950/60 dark:hover:bg-violet-900 text-violet-700 dark:text-violet-300 transition-colors"
            >
              18 (Boundary Test)
            </button>
            <button
              onClick={() => setInputAge(25)}
              disabled={session.stage !== 'idle'}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-teal-100/70 hover:bg-teal-200 dark:bg-teal-950/60 dark:hover:bg-teal-900 text-teal-700 dark:text-teal-300 transition-colors"
            >
              25 (Standard Pass)
            </button>
          </div>
        </div>

        {/* Action Button */}
        {session.stage === 'idle' ? (
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleGenerateProof}
            className="w-full py-3.5 rounded-2xl font-bold text-white shadow-xl bg-gradient-to-r from-violet-600 via-teal-500 to-rose-500 hover:shadow-violet-500/25 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Sparkles className="w-5 h-5" />
            <span>Generate Zero-Knowledge Proof</span>
          </motion.button>
        ) : session.stage === 'verified' || session.stage === 'failed' ? (
          <button
            onClick={resetGate}
            className="w-full py-3 rounded-2xl font-semibold text-slate-700 dark:text-slate-200 bg-slate-200/70 hover:bg-slate-300/70 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset and Test Another Proof</span>
          </button>
        ) : (
          <button
            disabled
            className="w-full py-3.5 rounded-2xl font-semibold text-white bg-slate-400 dark:bg-slate-700 cursor-not-allowed flex items-center justify-center gap-2 text-sm"
          >
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Evaluating Circuit Constraints ({progress}%)...</span>
          </button>
        )}

        {/* Live Verifiable Result Card */}
        <AnimatePresence>
          {session.stage === 'verified' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="mt-6 p-5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-300/70 dark:border-emerald-800/60"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-bold text-sm text-emerald-800 dark:text-emerald-200">
                    Proof Verified: Eligible (Age &gt;= {minAgeThreshold})
                  </span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-semibold">
                  Zero Data Leakage
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/70 font-mono">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">
                    Proof Digest (Public)
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-300 truncate max-w-[280px]">
                      {session.proofHash}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(session.proofHash || '');
                        setCopiedProof(true);
                        setTimeout(() => setCopiedProof(false), 2000);
                      }}
                      className="text-slate-400 hover:text-slate-600 ml-2"
                    >
                      {copiedProof ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/70 dark:bg-slate-900/70 font-mono">
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5">
                    Context Nullifier (Anti-Replay)
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-300 truncate max-w-[280px]">
                      {session.nullifierHash}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(session.nullifierHash || '');
                        setCopiedNullifier(true);
                        setTimeout(() => setCopiedNullifier(false), 2000);
                      }}
                      className="text-slate-400 hover:text-slate-600 ml-2"
                    >
                      {copiedNullifier ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {session.stage === 'failed' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="mt-6 p-5 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-300/70 dark:border-rose-800/60"
            >
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                <span className="font-bold text-sm text-rose-800 dark:text-rose-200">
                  Verification Constraint Failed
                </span>
              </div>
              <p className="text-xs text-rose-700 dark:text-rose-300/90 leading-relaxed">
                The private witness age evaluated to less than the required threshold ({minAgeThreshold}).
                Notice that your exact submitted age ({inputAge}) was never broadcasted or disclosed to the network.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Right Column: Visual Aperture Iris & Midnight State Tracker */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="lg:col-span-5 glass-panel rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden"
      >
        <div className="w-full flex items-center justify-between pb-4 mb-4 border-b border-slate-200/80 dark:border-slate-800">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Camera Obscura Mechanism
          </span>
          <span className="flex items-center gap-1 text-[11px] text-teal-600 dark:text-teal-400 font-mono">
            <Info className="w-3 h-3" /> Iris Diaphragm
          </span>
        </div>

        {/* The Animated Aperture Iris */}
        <ApertureIris session={session} stageProgress={progress} />

        {/* Midnight Circuit Specs */}
        <div className="w-full mt-6 p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
            <span className="text-slate-500 dark:text-slate-400">Circuit Language</span>
            <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">Midnight Compact v0.6+</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-700/60">
            <span className="text-slate-500 dark:text-slate-400">Arithmetic Proof</span>
            <span className="font-mono font-semibold text-violet-600 dark:text-violet-400">Zero-Knowledge Inequality</span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-slate-500 dark:text-slate-400">Public Disclosure</span>
            <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">Boolean Only (isEligible)</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
