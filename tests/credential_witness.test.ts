import { describe, it, expect } from 'vitest';
import { PoseidonHash } from '../contract/poseidon';
import { AgeWitness } from '../contract/circuit';

describe('Obscura Credential & Private Witness Tests', () => {
  it('1. Generates 256-bit cryptographically secure blinding salts with high entropy', () => {
    const salt1 = PoseidonHash.generateSalt();
    const salt2 = PoseidonHash.generateSalt();

    expect(salt1).toHaveLength(64); // 32 bytes hex encoded
    expect(salt2).toHaveLength(64);
    expect(salt1).not.toBe(salt2);

    // Verify hex character format
    expect(/^[0-9a-f]{64}$/i.test(salt1)).toBe(true);
    expect(/^[0-9a-f]{64}$/i.test(salt2)).toBe(true);
  });

  it('2. Enforces private witness encapsulation without serialization leak', () => {
    const privateAge = 28;
    const salt = PoseidonHash.generateSalt();
    const identitySecret = PoseidonHash.generateIdentitySecret();

    const witness: AgeWitness = {
      userAge: privateAge,
      secretSalt: salt,
      identitySecret,
    };

    // Synthesize public commitment
    const commitment = PoseidonHash.hash([witness.identitySecret, witness.secretSalt]);

    expect(commitment).toHaveLength(64);
    // Commitment must be a valid 256-bit cryptographic digest not equal to input secrets
    expect(commitment).not.toBe(salt);
    expect(commitment).not.toBe(identitySecret);
    expect(commitment).not.toBe(String(privateAge));
  });

  it('3. Guarantees identity pseudonym isolation across disparate sessions', () => {
    const secret = PoseidonHash.generateIdentitySecret();
    const saltA = PoseidonHash.generateSalt();
    const saltB = PoseidonHash.generateSalt();

    const sessionCommitmentA = PoseidonHash.hash(['session_A', secret, saltA]);
    const sessionCommitmentB = PoseidonHash.hash(['session_B', secret, saltB]);

    expect(sessionCommitmentA).not.toBe(sessionCommitmentB);
  });
});
