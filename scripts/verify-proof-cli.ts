/**
 * Obscura CLI Proof Verification Tool
 * Allows offline or local inspection and verification of generated zero-knowledge proof tokens.
 */
import { verifyEligibilityProofDigest } from '../contract/circuit';

function runCliVerification(): void {
  const args = process.argv.slice(2);

  console.log('======================================================');
  console.log('       Obscura CLI ZK Proof Verifier Tool             ');
  console.log('======================================================\n');

  if (args.length < 4) {
    console.log('Usage:');
    console.log('  ts-node scripts/verify-proof-cli.ts <proofHash> <nullifierHash> <minAgeThreshold> <contextNonce>\n');
    console.log('Example:');
    console.log('  ts-node scripts/verify-proof-cli.ts zkp_3b8a... 9f2e... 18 epoch_001\n');
    return;
  }

  const [proofHash, nullifierHash, thresholdStr, contextNonce] = args;
  const threshold = parseInt(thresholdStr, 10);

  const isValid = verifyEligibilityProofDigest(proofHash, nullifierHash, threshold, contextNonce);

  console.log(`Proof Digest       : ${proofHash}`);
  console.log(`Nullifier Hash     : ${nullifierHash}`);
  console.log(`Required Threshold : >= ${threshold}`);
  console.log(`Context Nonce      : ${contextNonce}\n`);

  if (isValid) {
    console.log('>> [SUCCESS] Proof is mathematically VALID and authenticated on Midnight circuit parameters.');
  } else {
    console.log('>> [FAILED] Proof signature or circuit constraints are INVALID.');
  }
}

runCliVerification();
