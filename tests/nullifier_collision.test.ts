import { describe, it, expect } from 'vitest';
import { computeNullifier } from '../contract/circuit';
import { PoseidonHash } from '../contract/poseidon';

describe('Obscura Nullifier Integrity & Anti-Replay Tests', () => {
  const secret = '11223344556677889900aabbccddeeff11223344556677889900aabbccddeeff';
  const salt = 'aabbccddeeff00112233445566778899aabbccddeeff00112233445566778899';
  const epoch1 = 'epoch_testnet_2026_09_ctx1';
  const epoch2 = 'epoch_testnet_2026_09_ctx2';

  it('1. Produces deterministic nullifiers for identical inputs within the same epoch', () => {
    const nullifierA = computeNullifier(secret, salt, epoch1);
    const nullifierB = computeNullifier(secret, salt, epoch1);

    expect(nullifierA).toBe(nullifierB);
    expect(nullifierA).toHaveLength(64);
  });

  it('2. Enforces cross-epoch uniqueness to prevent linkability across sessions', () => {
    const nullifierEpoch1 = computeNullifier(secret, salt, epoch1);
    const nullifierEpoch2 = computeNullifier(secret, salt, epoch2);

    expect(nullifierEpoch1).not.toBe(nullifierEpoch2);
  });

  it('3. Guarantees collision resistance across disparate users within identical epoch', () => {
    const userSecret1 = PoseidonHash.generateIdentitySecret();
    const userSecret2 = PoseidonHash.generateIdentitySecret();
    const salt1 = PoseidonHash.generateSalt();
    const salt2 = PoseidonHash.generateSalt();

    const nullifierUser1 = computeNullifier(userSecret1, salt1, epoch1);
    const nullifierUser2 = computeNullifier(userSecret2, salt2, epoch1);

    expect(nullifierUser1).not.toBe(nullifierUser2);
  });
});
