import { describe, it, expect } from 'vitest';
import {
  evaluateAgeEligibilityCircuit,
  computeNullifier,
  verifyEligibilityProofDigest,
  AgeWitness,
  EligibilityProofContext,
} from '../contract/circuit';

describe('Obscura Compact Circuit: Zero-Knowledge Age & Eligibility Verification', () => {
  const secretSalt = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
  const identitySecret = 'fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210';
  const contextNonce = 'obscura_epoch_2026_testnet_ctx_001';
  const minAgeThreshold = 18;

  it('1. Circuit PASSES when private userAge is strictly greater than threshold (e.g. 21 >= 18)', () => {
    const witness: AgeWitness = {
      userAge: 21,
      secretSalt,
      identitySecret,
    };

    const context: EligibilityProofContext = {
      contextNonce,
      publicMinAgeThreshold: minAgeThreshold,
      spentNullifierRoot: '0'.repeat(64),
    };

    const result = evaluateAgeEligibilityCircuit(witness, context);

    expect(result.isValid).toBe(true);
    expect(result.publicStateUpdate.isEligible).toBe(true);
    expect(result.publicStateUpdate.thresholdMet).toBe(true);
    expect(result.publicStateUpdate.rawAgeDisclosed).toBe(false);
    expect(result.proofHash.startsWith('zkp_')).toBe(true);
    expect(result.nullifierHash).toBeDefined();
    expect(result.nullifierHash.length).toBe(64);

    // Verify on-chain verification digest
    const verifiedOnChain = verifyEligibilityProofDigest(
      result.proofHash,
      result.nullifierHash,
      minAgeThreshold,
      contextNonce
    );
    expect(verifiedOnChain).toBe(true);
  });

  it('2. Circuit PASSES on exact boundary threshold condition (e.g. 18 >= 18)', () => {
    const witness: AgeWitness = {
      userAge: 18,
      secretSalt,
      identitySecret,
    };

    const context: EligibilityProofContext = {
      contextNonce,
      publicMinAgeThreshold: minAgeThreshold,
      spentNullifierRoot: '0'.repeat(64),
    };

    const result = evaluateAgeEligibilityCircuit(witness, context);

    expect(result.isValid).toBe(true);
    expect(result.publicStateUpdate.isEligible).toBe(true);
    expect(result.publicStateUpdate.thresholdMet).toBe(true);
    expect(result.publicStateUpdate.rawAgeDisclosed).toBe(false);
  });

  it('3. Circuit REJECTS proof when private userAge is below required threshold (e.g. 16 < 18)', () => {
    const witness: AgeWitness = {
      userAge: 16,
      secretSalt,
      identitySecret,
    };

    const context: EligibilityProofContext = {
      contextNonce,
      publicMinAgeThreshold: minAgeThreshold,
      spentNullifierRoot: '0'.repeat(64),
    };

    const result = evaluateAgeEligibilityCircuit(witness, context);

    expect(result.isValid).toBe(false);
    expect(result.publicStateUpdate.isEligible).toBe(false);
    expect(result.publicStateUpdate.thresholdMet).toBe(false);
    expect(result.error).toContain('does not meet requirement');
  });

  it('4. Circuit REJECTS proof when nullifier is already recorded as spent on ledger', () => {
    const witness: AgeWitness = {
      userAge: 25,
      secretSalt,
      identitySecret,
    };

    const nullifier = computeNullifier(identitySecret, secretSalt, contextNonce);

    const context: EligibilityProofContext = {
      contextNonce,
      publicMinAgeThreshold: minAgeThreshold,
      spentNullifierRoot: nullifier, // already recorded as spent
    };

    const result = evaluateAgeEligibilityCircuit(witness, context);

    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Nullifier has already been spent');
  });

  it('5. Circuit verifies zero raw age leakage across arbitrary valid ages', () => {
    const agesToTest = [18, 21, 30, 65, 99];
    for (const age of agesToTest) {
      const result = evaluateAgeEligibilityCircuit(
        { userAge: age, secretSalt, identitySecret },
        { contextNonce, publicMinAgeThreshold: minAgeThreshold, spentNullifierRoot: '' }
      );
      expect(result.isValid).toBe(true);
      expect(result.publicStateUpdate.rawAgeDisclosed).toBe(false);
      // Ensure proofHash does NOT contain the raw age string anywhere
      expect(result.proofHash.includes(`_${age}_`)).toBe(false);
    }
  });
});
