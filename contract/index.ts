import {
  evaluateAgeEligibilityCircuit,
  computeNullifier,
  verifyEligibilityProofDigest,
  AgeWitness,
  EligibilityProofContext,
  CircuitEvaluationResult,
} from './circuit';
import { PoseidonHash } from './poseidon';

export interface ObscuraLedgerState {
  minAgeThreshold: number;
  verifiedEligibleCount: number;
  nullifierRoot: string;
  adminPublicKeyHash: string;
}

export interface VerificationReceipt {
  success: boolean;
  proofHash: string;
  nullifierHash: string;
  epochNonce: string;
  ledgerUpdated: boolean;
  verifiedEligibleCount: number;
  message: string;
  txHash?: string;
  timestamp: number;
}

/**
 * ObscuraContractClient
 * High-level TypeScript client for interacting with the Obscura Midnight Compact contract,
 * proving zero-knowledge statements client-side, and querying ledger state.
 */
export class ObscuraContractClient {
  private ledgerState: ObscuraLedgerState;
  private spentNullifiers: Set<string>;

  constructor(initialMinAgeThreshold = 18) {
    this.ledgerState = {
      minAgeThreshold: initialMinAgeThreshold,
      verifiedEligibleCount: 0,
      nullifierRoot: '0'.repeat(64),
      adminPublicKeyHash: PoseidonHash.hash(['admin_root_seed_2026']),
    };
    this.spentNullifiers = new Set<string>();
  }

  /**
   * Returns current on-chain public ledger state.
   */
  public getLedgerState(): ObscuraLedgerState {
    return { ...this.ledgerState };
  }

  /**
   * Generates a zero-knowledge proof client-side without submitting to ledger.
   */
  public generateProofOnly(
    userAge: number,
    secretSalt?: string,
    identitySecret?: string,
    contextNonce?: string
  ): CircuitEvaluationResult {
    const salt = secretSalt || PoseidonHash.generateSalt();
    const secret = identitySecret || PoseidonHash.generateIdentitySecret();
    const nonce = contextNonce || `session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const witness: AgeWitness = {
      userAge,
      secretSalt: salt,
      identitySecret: secret,
    };

    const context: EligibilityProofContext = {
      contextNonce: nonce,
      publicMinAgeThreshold: this.ledgerState.minAgeThreshold,
      spentNullifierRoot: this.ledgerState.nullifierRoot,
    };

    return evaluateAgeEligibilityCircuit(witness, context);
  }

  /**
   * Generates a zero-knowledge proof client-side and validates it against current ledger state.
   * If valid, updates on-chain ledger state without ever storing or revealing userAge.
   */
  public async proveAndVerifyEligibility(
    userAge: number,
    secretSalt?: string,
    identitySecret?: string,
    contextNonce?: string
  ): Promise<CircuitEvaluationResult> {
    const salt = secretSalt || PoseidonHash.generateSalt();
    const secret = identitySecret || PoseidonHash.generateIdentitySecret();
    const nonce = contextNonce || `session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const witness: AgeWitness = {
      userAge,
      secretSalt: salt,
      identitySecret: secret,
    };

    const context: EligibilityProofContext = {
      contextNonce: nonce,
      publicMinAgeThreshold: this.ledgerState.minAgeThreshold,
      spentNullifierRoot: this.ledgerState.nullifierRoot,
    };

    // Synthesize proof via zero-knowledge circuit logic
    const evalResult = evaluateAgeEligibilityCircuit(witness, context);

    if (evalResult.isValid && !this.spentNullifiers.has(evalResult.nullifierHash)) {
      // Simulate state transition on Midnight ledger
      this.ledgerState.verifiedEligibleCount += 1;
      this.ledgerState.nullifierRoot = evalResult.nullifierHash;
      this.spentNullifiers.add(evalResult.nullifierHash);
    }

    return evalResult;
  }


  /**
   * Submits pre-computed proof to Midnight blockchain.
   */
  public async submitProofToLedger(
    proofHash: string,
    nullifierHash: string,
    contextNonce: string
  ): Promise<VerificationReceipt> {
    const isValid = verifyEligibilityProofDigest(
      proofHash,
      nullifierHash,
      this.ledgerState.minAgeThreshold,
      contextNonce
    );

    if (!isValid) {
      return {
        success: false,
        proofHash,
        nullifierHash,
        epochNonce: contextNonce,
        ledgerUpdated: false,
        verifiedEligibleCount: this.ledgerState.verifiedEligibleCount,
        message: 'Midnight node rejected proof: Cryptographic signature mismatch.',
        timestamp: Date.now(),
      };
    }

    if (this.spentNullifiers.has(nullifierHash)) {
      return {
        success: false,
        proofHash,
        nullifierHash,
        epochNonce: contextNonce,
        ledgerUpdated: false,
        verifiedEligibleCount: this.ledgerState.verifiedEligibleCount,
        message: 'Midnight ledger constraint: Nullifier has already been consumed.',
        timestamp: Date.now(),
      };
    }

    this.ledgerState.verifiedEligibleCount += 1;
    this.ledgerState.nullifierRoot = nullifierHash;
    this.spentNullifiers.add(nullifierHash);

    const txHash = `0x${PoseidonHash.hash(['tx', proofHash, Date.now()])}`;

    return {
      success: true,
      proofHash,
      nullifierHash,
      epochNonce: contextNonce,
      ledgerUpdated: true,
      verifiedEligibleCount: this.ledgerState.verifiedEligibleCount,
      message: 'Eligibility assertion verified on Midnight ledger. Raw data remains invisible.',
      txHash,
      timestamp: Date.now(),
    };
  }

  /**
   * Updates minimum age threshold (admin protected).
   */
  public updateThreshold(newThreshold: number, adminSecret: string): boolean {
    const checkHash = PoseidonHash.hash([adminSecret]);
    if (checkHash !== this.ledgerState.adminPublicKeyHash) {
      return false;
    }
    if (newThreshold <= 0) {
      return false;
    }
    this.ledgerState.minAgeThreshold = newThreshold;
    return true;
  }
}

export * from './circuit';
export * from './poseidon';
