# Obscura: Level 3 Product Proposal
**Program:** RiseIn — *"New Moon to Full: Monthly Moonshots on Midnight"*  
**Submission Milestone:** Level 3 — First Quarter Submission  
**Project Name:** Obscura  
**Tagline:** *"Visible proof. Invisible data."*  
**Category:** Zero-Knowledge Identity, Selective Disclosure & Private Eligibility Gate  

---

## 1. What is the problem?

In both contemporary Web2 and decentralized Web3 ecosystems, access to financial primitives, token-gated organizations, decentralized lending, adult content, regulated token sales, and compliant gaming requires individuals to prove their chronological age or regulatory qualification (e.g., minimum age 18 or 21, accredited investor thresholds, geographical or tier eligibility).

However, existing verification architectures impose catastrophic privacy and security violations:

1. **Massive Over-Disclosure & Identity Honey-Pots:**
   To prove a simple boolean fact (*"I am at least 18 years old"*), current Web2 services force users to upload unencrypted scans of government-issued passports, driver's licenses, or national identity cards. The verifier receives an enormous payload of extraneous personally identifiable information (PII): legal full names, home addresses, government registration numbers, and biometric portrait photos. Centralized storage of this sensitive data creates massive attack surfaces and honeypots that are routinely breached and exploited for identity theft.

2. **Public Blockchain Correlation & Deanonymization:**
   When decentralized applications (dApps) on public blockchains (such as Ethereum or Solana) attempt on-chain gating, every transaction parameter and caller address (`msg.sender`) is permanently recorded on a transparent public ledger. Submitting an age attestation publicly links the user's pseudonymous wallet directly to their demographic attribute for all eternity. Observers, advertisers, and surveillance heuristics can cross-reference timestamps, balance histories, and interaction graphs to permanently deanonymize participants.

3. **All-or-Nothing Attestation Models:**
   Current digital identity protocols lack nuanced selective disclosure. Users are forced to either reveal everything to gain access or remain locked out entirely.

---

## 2. What is the solution?

**Obscura** solves this fundamental flaw by engineering a production-grade, zero-knowledge Age and Eligibility Gate Protocol built natively on the **Midnight blockchain**.

Inspired by the optical phenomenon of the **Camera Obscura**—where light passes through a pinhole aperture to project a focused, authentic image while keeping the inner chamber concealed—Obscura enables users to prove that their age satisfies a required threshold **without ever disclosing their actual age, birth date, or identity**:

```
+-----------------------------------------------------------------------+
|                    OFF-CHAIN CLIENT WITNESS (Private)                 |
|                                                                       |
|  [ Private Age: 25 ]  +  [ 256-bit Salt ]  +  [ Identity Secret ]     |
|                               |                                       |
|                               v                                       |
|               +-------------------------------+                       |
|               |  Compact ZK Inequality Circuit |                      |
|               |   assert(userAge >= minAge)   |                       |
|               +---------------+---------------+                       |
+-------------------------------|---------------------------------------+
                                |  Succinct Zero-Knowledge Proof
                                |  + One-Time Nullifier Hash
                                v  (Zero raw age disclosed)
+-----------------------------------------------------------------------+
|                    MIDNIGHT BLOCKCHAIN (Public Ledger)                |
|                                                                       |
|               +-------------------------------+                       |
|               |    Obscura Compact Contract   |                       |
|               +---------------+---------------+                       |
|                               |                                       |
|                               v                                       |
|  [ Public State: isEligible = true | verifiedCount++ | nullifierRoot ] |
+-----------------------------------------------------------------------+
```

### Core Solution Architecture:
1. **Client-Side Witness Isolation:** The user enters their chronological age into their local browser environment. This value is handled exclusively in ephemeral memory as a private witness.
2. **Compact Arithmetic Circuit:** An off-chain zero-knowledge circuit written in Midnight's Compact language evaluates the arithmetic constraint:
   $$\text{userAge} \ge \text{ledger.minAgeThreshold}$$
3. **Single-Use Context Nullifiers:** The circuit derives a deterministic nullifier hash:
   $$\text{Nullifier} = \text{SHA-256}(\text{identitySecret} \parallel \text{secretSalt} \parallel \text{contextNonce})$$
   This guarantees that an eligible participant can only claim or verify once per context/epoch without linking their identity across sessions.
4. **On-Chain Attestation:** The Midnight validator node inspects the succinct SNARK proof. If valid, the contract increments the public `verifiedEligibleCount`, updates `nullifierRoot`, and commits `isEligible = true`.
5. **Result:** Verifiers receive mathematical certainty of qualification while learning zero bits of the user's private data.

---

## 3. Why is Midnight's privacy model essential for this solution?

Standard transparent blockchains (EVM, Solana, Bitcoin) cannot support this protocol because all ledger state, transaction inputs, and caller identities are public by default. Even when zero-knowledge verifiers are deployed on Ethereum, the transaction sender address and transaction payload are permanently broadcasted, enabling timing and graph analysis.

Midnight's unique **dual-state execution paradigm** is the foundational enabler for Obscura:

- **Private Witness Boundary:** Compact smart contracts natively distinguish between *private state* (witnesses that execute strictly on the client) and *public state* (ledger variables validated across the network). The raw inputs (`userAge`, `secretSalt`, `identitySecret`) never leave the prover's machine.
- **Selective Disclosure:** Midnight allows the contract to declare exactly which boolean statements (`isEligible`) are revealed, keeping everything else encrypted.
- **Shielded State Transitions & Anti-Replay Protection:** Obscura utilizes Midnight's nullifier mechanics to enforce single-use authorization per epoch while preventing front-running or proof copying by third-party observers.
- **Regulatory Compliance Without Surveillance:** Obscura satisfies strict compliance mandates (e.g. COPPA, GDPR, age-verification acts) by mathematically certifying compliance without storing or processing identifiable user dossiers.

---

## 4. How do you plan to use Midnight's features to ship to Mainnet by Level 6?

Obscura is designed on a modular, multi-quarter roadmap aligning directly with the RiseIn Midnight Moonshots progression:

### Level 3 (Current — First Quarter Submission)
- [x] Full Compact smart contract definition (`contract/obscura.compact`) with private witnesses and public ledger state.
- [x] Dual-state arithmetic circuit validation (`proveEligibility`, `updateAgeThreshold`).
- [x] Light-first glassmorphism design system with custom Camera Obscura aperture/iris animation.
- [x] Midnight Lace wallet connection and devnet simulation fallback.
- [x] 17 automated tests (circuit correctness, edge cases, replay prevention, integration).
- [x] Automated CI/CD pipeline with GitHub Actions running `compact compile` and full test suites.
- [x] Local devnet deployment simulation and automated verification artifacts (`deployed_contract.json`).

### Level 4 (Waxing Gibbous)
- **W3C Verifiable Credentials (VC) Ingestion:** Allow users to import cryptographically signed digital birthdate attestations from government or university identity issuers directly into their local Midnight wallet.
- **Proof-of-Attribute Oracle Connector:** Enable off-chain Web2 identity providers to generate zero-knowledge witness commitments without seeing the underlying credentials.
- **Midnight Indexer Integration:** Deploy dedicated Midnight GraphQL indexer instances to serve real-time eligibility events and nullifier tracking.

### Level 5 (Waxing Crescent to Full Moon)
- **Multi-Attribute Composite Circuits:** Expand the Compact contract to support multi-dimensional eligibility formulas in a single proof:
  $$\text{age} \ge 21 \land \text{jurisdiction} \notin \text{SanctionedList} \land \text{kycTier} \ge 2$$
- **Third-Party DApp Verification SDK (`@obscura/sdk`):** Publish an npm package allowing any Midnight smart contract (DEX, DAO, NFT launchpad) to import `ObscuraVerifier` as an on-chain interface.
- **Formal Security Audits:** Audit the Compact R1CS constraint graph for under-constrained variables and nullifier malleability.

### Level 6 (Full Moon — Mainnet Production Launch)
- **Genesis Mainnet Deployment:** Deploy audited Obscura contracts on Midnight Mainnet.
- **Enterprise SLA & Proof-Server Clustering:** High-availability proving cluster capable of sub-second witness generation for mobile and enterprise clients.
- **Cross-Chain Attestation Relays:** Utilize Midnight's cross-chain messaging bridges to relay zero-knowledge eligibility receipts to Cardano and EVM partner chains.

---

## 5. Architectural Diagram

```
+--------------------------------------------------------------------------------+
|                             OBSCURA SYSTEM ARCHITECTURE                        |
+--------------------------------------------------------------------------------+

 [ CLIENT LAYER (Browser / Mobile) ]
      |
      +---> User Interface: Light-Mode Aurora Glassmorphism (Tailwind + Framer Motion)
      |
      +---> Midnight Lace Wallet Extension (window.midnight.lace)
      |
      +---> Private Witness Generator (Local Memory Only)
               - Chronological Age
               - 256-bit Blinding Salt (secretSalt)
               - Identity Secret Key
      |
      +---> Local Zero-Knowledge Prover
               - Evaluates Compact Circuit Constraints (age >= threshold)
               - Derives One-Time Context Nullifier Hash

 [ MIDNIGHT NETWORK LAYER (Preprod / Testnet-02) ]
      |
      +---> Obscura Compact Smart Contract (obscura.compact)
               - Ledger State: minAgeThreshold, verifiedEligibleCount, nullifierRoot
               - Circuit: proveEligibility(contextNonce)
               - Circuit: updateAgeThreshold(newThreshold, adminWitness)
      |
      +---> Midnight Consensus Nodes (Halo2 / ZK-SNARK Verifier)
      |
      +---> Midnight Block Explorer & State Indexer

 [ PUBLIC CONSUMERS ]
      |
      +---> Verifying DApps: DeFi Protocols, DAOs, Gated Portals
      +---> Observers: Can see boolean (isEligible = true), cannot see raw age.
+--------------------------------------------------------------------------------+
```

---

## 6. Conclusion

Obscura demonstrates the true power of the Midnight blockchain: building Web3 infrastructure where privacy is not an afterthought, but the core architectural foundation. By replacing dangerous data honeypots with zero-knowledge selective disclosure, Obscura establishes a new standard for confidential verification on Midnight.
