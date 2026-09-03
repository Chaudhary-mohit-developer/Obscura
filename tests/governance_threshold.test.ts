import { describe, it, expect } from 'vitest';
import { ObscuraContractClient } from '../contract/index';

describe('Obscura Governance & Dynamic Threshold Tests', () => {
  it('1. Successfully updates minimum age threshold with valid admin credential witness', () => {
    const client = new ObscuraContractClient(18);
    expect(client.getLedgerState().minAgeThreshold).toBe(18);

    // Update threshold to 21 with matching admin root seed
    const success = client.updateThreshold(21, 'admin_root_seed_2026');
    expect(success).toBe(true);
    expect(client.getLedgerState().minAgeThreshold).toBe(21);
  });

  it('2. Rejects unauthorized threshold modifications with invalid admin credentials', () => {
    const client = new ObscuraContractClient(18);

    // Attempt unauthorized threshold update
    const success = client.updateThreshold(25, 'fake_attacker_seed_bad');
    expect(success).toBe(false);
    expect(client.getLedgerState().minAgeThreshold).toBe(18); // Unchanged
  });

  it('3. Rejects non-positive threshold configurations', () => {
    const client = new ObscuraContractClient(18);

    // Reject 0 or negative thresholds
    const successZero = client.updateThreshold(0, 'admin_root_seed_2026');
    const successNegative = client.updateThreshold(-5, 'admin_root_seed_2026');

    expect(successZero).toBe(false);
    expect(successNegative).toBe(false);
    expect(client.getLedgerState().minAgeThreshold).toBe(18);
  });
});
