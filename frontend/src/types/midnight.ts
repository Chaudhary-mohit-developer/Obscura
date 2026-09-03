export interface LaceMidnightWallet {
  name: string;
  apiVersion: string;
  icon: string;
  enable: () => Promise<LaceMidnightAPI>;
  isEnabled: () => Promise<boolean>;
}

export interface LaceMidnightAPI {
  getNetworkId: () => Promise<string>;
  getUnspentOutputs: () => Promise<any[]>;
  getBalance: () => Promise<{ midnightToken: bigint; shieldedToken: bigint }>;
  getChangeAddress: () => Promise<string>;
  signData: (addr: string, payload: string) => Promise<{ signature: string; key: string }>;
  submitTx: (txHex: string) => Promise<string>;
}

declare global {
  interface Window {
    midnight?: {
      lace?: LaceMidnightWallet;
      [key: string]: any;
    };
  }
}

export interface VerificationSession {
  stage: 'idle' | 'witness_prep' | 'synthesizing_proof' | 'submitting_ledger' | 'verified' | 'failed';
  privateAgeInput: number;
  thresholdRequired: number;
  isEligible: boolean | null;
  proofHash?: string;
  nullifierHash?: string;
  txHash?: string;
  error?: string;
  startTime?: number;
  endTime?: number;
}
