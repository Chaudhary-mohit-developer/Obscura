import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sun,
  Moon,
  Shield,
  Layers,
  Sparkles,
  ExternalLink,
  Github,
  Award,
  CircleDot,
  FileCode2,
  Lock,
} from 'lucide-react';
import { WalletConnector } from './components/WalletConnector';
import { EligibilityGate } from './components/EligibilityGate';
import { PrivacyExplainer } from './components/PrivacyExplainer';

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [networkName, setNetworkName] = useState<string>('Midnight Testnet-02');
  const [showContractCode, setShowContractCode] = useState<boolean>(false);

  useEffect(() => {
    // Light mode is default!
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleWalletConnect = (address: string, isSimulated: boolean) => {
    setWalletAddress(address);
    if (isSimulated) {
      setNetworkName('Midnight Devnet (Local)');
    } else {
      setNetworkName('Midnight Testnet-02');
    }
  };

  const handleWalletDisconnect = () => {
    setWalletAddress(null);
  };

  return (
    <div className="min-h-screen bg-aurora-canvas text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col justify-between">
      {/* Background Decorative Aperture Orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-violet-400/10 dark:bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-10 right-1/4 w-96 h-96 bg-teal-400/10 dark:bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/60 dark:bg-slate-950/60 border-b border-slate-200/60 dark:border-slate-800/60 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo Area */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-2xl p-0.5 bg-gradient-to-tr from-violet-600 via-teal-400 to-rose-400 shadow-md shadow-violet-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
                {/* Concentric aperture rings */}
                <div className="relative w-6 h-6 rounded-full border-2 border-violet-500 flex items-center justify-center">
                  <div className="w-3.5 h-3.5 rounded-full border border-teal-400 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  Obscura
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-violet-100 dark:bg-violet-950/80 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800">
                  v1.0 • Level 3
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Midnight ZK Eligibility Gate
              </span>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowContractCode(!showContractCode)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold glass-pill text-slate-700 dark:text-slate-200 hover:border-violet-400 transition-all"
            >
              <FileCode2 className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
              <span>Compact Contract</span>
            </button>

            {/* Dark/Light mode toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-full glass-pill text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors shadow-sm"
              title="Toggle Light/Dark Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-violet-600" />}
            </button>

            {/* Midnight Lace Wallet Connection */}
            <WalletConnector
              walletAddress={walletAddress}
              networkName={networkName}
              onConnect={handleWalletConnect}
              onDisconnect={handleWalletDisconnect}
            />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-pill text-xs font-semibold text-violet-700 dark:text-violet-300 mb-4 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-500" />
            <span>Midnight Moonshot — Level 3 Submission</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight"
          >
            <span className="text-aurora">Visible proof.</span>
            <br />
            <span className="text-slate-800 dark:text-slate-100">Invisible data.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-5 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal"
          >
            Prove your age or private qualification threshold to any on-chain smart contract
            <strong className="text-slate-900 dark:text-white font-semibold"> without ever revealing your actual age or date of birth.</strong> Powered by Midnight Compact zero-knowledge circuits.
          </motion.p>
        </section>

        {/* Live Metrics Strip */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="glass-panel p-4 rounded-2xl text-center">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Min Age Threshold
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">18+</div>
            <span className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">Configurable at Deploy</span>
          </div>

          <div className="glass-panel p-4 rounded-2xl text-center">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Raw Data Disclosed
            </div>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">0 Bytes</div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">100% Client-Side Private</span>
          </div>

          <div className="glass-panel p-4 rounded-2xl text-center">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              ZK Constraints
            </div>
            <div className="text-2xl font-black text-violet-600 dark:text-violet-400 mt-1">128 R1CS</div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Compact Prover v0.6+</span>
          </div>

          <div className="glass-panel p-4 rounded-2xl text-center">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Ledger State
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">isEligible</div>
            <span className="text-[10px] text-teal-600 dark:text-teal-400 font-medium">Single Boolean Assertion</span>
          </div>
        </section>

        {/* The Eligibility Gate Core Flow */}
        <section>
          <EligibilityGate
            walletAddress={walletAddress}
            onConnectPrompt={() => {
              const devAddress = `addr_midnight_7fa2${Math.random().toString(16).substring(2, 10)}99c1`;
              handleWalletConnect(devAddress, true);
            }}
            minAgeThreshold={18}
          />
        </section>

        {/* Compact Contract Source Preview Modal / Drawer */}
        {showContractCode && (
          <section className="mt-8 glass-panel p-6 rounded-3xl border border-violet-200 dark:border-violet-900/60">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-violet-600" />
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  contract/obscura.compact (Midnight Compact Smart Contract)
                </span>
              </div>
              <button
                onClick={() => setShowContractCode(false)}
                className="text-xs font-semibold text-slate-400 hover:text-slate-600"
              >
                Close
              </button>
            </div>
            <pre className="font-mono text-xs overflow-x-auto p-4 rounded-2xl bg-slate-900 text-slate-200 leading-relaxed max-h-96">
{`module ObscuraContract;

import CompactStandardLibrary;

ledger {
  minAgeThreshold: Uint<32>;
  verifiedEligibleCount: Uint<64>;
  adminPublicKeyHash: Bytes<32>;
  nullifierRoot: Bytes<32>;
}

witness userAge(): Uint<32>;
witness secretSalt(): Bytes<32>;
witness identitySecret(): Bytes<32>;

circuit computeNullifier(secret: Bytes<32>, salt: Bytes<32>, contextNonce: Bytes<32>): Bytes<32> {
  return sha256(concat(concat(secret, salt), contextNonce));
}

export circuit proveEligibility(contextNonce: Bytes<32>): Boolean {
  const age: Uint<32> = userAge();
  const salt: Bytes<32> = secretSalt();
  const secret: Bytes<32> = identitySecret();

  // Zero-Knowledge Inequality Constraint
  assert(age >= ledger.minAgeThreshold, "Obscura: Age does not meet the required threshold");

  const nullifier: Bytes<32> = computeNullifier(secret, salt, contextNonce);
  assert(nullifier != ledger.nullifierRoot, "Obscura: Proof already consumed for this context");

  ledger.verifiedEligibleCount = ledger.verifiedEligibleCount + 1;
  ledger.nullifierRoot = nullifier;

  return true;
}`}
            </pre>
          </section>
        )}

        {/* Privacy Explainer Section */}
        <section>
          <PrivacyExplainer />
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 dark:border-slate-800/80 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">Obscura</span>
            <span>—</span>
            <span>Level 3 Submission for RiseIn Monthly Moonshots on Midnight</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://github.com/Chaudhary-mohit-developer/Obscura"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Repo</span>
            </a>

            <a
              href="https://github.com/Chaudhary-mohit-developer"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Developer Profile</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
