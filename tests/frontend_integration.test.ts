import { describe, it, expect } from 'vitest';
import { ObscuraContractClient } from '../contract/index';

describe('Obscura Frontend & Application Integration Tests', () => {
  it('1. Handles sequential multi-user verification flow across varying age witnesses', async () => {
    // Initialized with standard threshold of 21
    const client = new ObscuraContractClient(21);

    // Initial state check
    const initialState = client.getLedgerState();
    expect(initialState.minAgeThreshold).toBe(21);
    expect(initialState.verifiedEligibleCount).toBe(0);

    // User Alice: Age 19 (Underage for 21 threshold)
    const aliceResult = await client.proveAndVerifyEligibility(19);
    expect(aliceResult.isValid).toBe(false);
    expect(aliceResult.publicStateUpdate.isEligible).toBe(false);
    expect(aliceResult.publicStateUpdate.thresholdMet).toBe(false);
    expect(aliceResult.publicStateUpdate.rawAgeDisclosed).toBe(false);

    // Ledger count should NOT increment on failed verification
    expect(client.getLedgerState().verifiedEligibleCount).toBe(0);

    // User Bob: Age 21 (Exact threshold boundary)
    const bobResult = await client.proveAndVerifyEligibility(21);
    expect(bobResult.isValid).toBe(true);
    expect(bobResult.publicStateUpdate.isEligible).toBe(true);
    expect(bobResult.publicStateUpdate.thresholdMet).toBe(true);
    expect(bobResult.publicStateUpdate.rawAgeDisclosed).toBe(false);

    // Ledger count increments to 1
    expect(client.getLedgerState().verifiedEligibleCount).toBe(1);

    // User Charlie: Age 34 (Above threshold)
    const charlieResult = await client.proveAndVerifyEligibility(34);
    expect(charlieResult.isValid).toBe(true);
    expect(charlieResult.publicStateUpdate.isEligible).toBe(true);
    expect(charlieResult.publicStateUpdate.thresholdMet).toBe(true);
    expect(charlieResult.publicStateUpdate.rawAgeDisclosed).toBe(false);

    // Ledger count increments to 2
    expect(client.getLedgerState().verifiedEligibleCount).toBe(2);
  });

  it('2. Enforces cryptographic uniqueness of zero-knowledge proofs and nullifiers', async () => {
    const client = new ObscuraContractClient(18);

    const user1 = await client.proveAndVerifyEligibility(25);
    const user2 = await client.proveAndVerifyEligibility(25);

    expect(user1.isValid).toBe(true);
    expect(user2.isValid).toBe(true);

    // Even with the identical raw age (25), distinct blinding salts ensure distinct proofs
    expect(user1.proofHash).not.toBe(user2.proofHash);
    expect(user1.nullifierHash).not.toBe(user2.nullifierHash);
  });

  it('3. Submits proof to ledger and issues verifiable transaction receipt', async () => {
    const client = new ObscuraContractClient(18);
    const nonce = 'session_receipt_test_epoch_99';

    const userResult = client.generateProofOnly(22, undefined, undefined, nonce);
    expect(userResult.isValid).toBe(true);

    const receipt = await client.submitProofToLedger(userResult.proofHash, userResult.nullifierHash, nonce);
    expect(receipt.success).toBe(true);
    expect(receipt.txHash).toBeDefined();
    expect(receipt.txHash?.startsWith('0x')).toBe(true);
    expect(receipt.ledgerUpdated).toBe(true);
  });
});
