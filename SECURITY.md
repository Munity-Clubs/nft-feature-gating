# Security Policy

## Reporting a Vulnerability

If you believe you have found a security vulnerability in `@munityclubs/nft-feature-gating`, please report it privately by emailing **`security@munity.club`**.

Please do **not** open public GitHub issues for suspected security vulnerabilities. The maintainers monitor `security@munity.club` and will route reports to the engineering owner.

## Response Targets

- **First acknowledgment**: within 48 hours of receipt
- **Substantive response with triage outcome**: within 5 business days
- **Coordinated-disclosure default window**: 90 days from report to public disclosure or first patch release, whichever is sooner. Adjusted case-by-case with the reporter.

## In-Scope Surface

- Feature-gate evaluation correctness across supported keys (`files_tab`, `roadmaps`, `merch`) — bypass paths that surface a locked feature as unlocked
- Public Collection metadata shape and validation against malformed / hostile metadata payloads
- Owned-Collection-id derivation against duplicate, overflow, or negative-id inputs
- Creator / ungated / no-wallet / holder / forbidden state-transition determinism (no holder-state leakage across wallets, no stale-state reuse)
- Lock-copy rendering against script injection or markup escape failures
- Per-feature gating-map construction against ordering or precedence ambiguity that could leak access intended for a different feature

## Out of Scope

- Wallet authentication or RPC ownership reads (the package is storage-neutral by design — wallet auth + chain reads are integrator-side)
- Database state correctness in integrator applications
- Underlying chain or NFT-contract security
- Wallet-adapter implementation bugs
- Transitive-dependency issues with published advisories
- Network-level attacks (DNS, BGP, TLS downgrade)
- Phishing or social engineering against end users

## Supported Versions

The latest published minor version on the `main` branch is supported. Previous minor versions receive security patches for **90 days** after a new minor ships. Patch releases are tagged and announced in `CHANGELOG.md`.

## Public Audit Status

A third-party security audit (Sec3 engagement letter on file 2026-05-20) of v0.2 is planned (target ship: September 2026) contingent on grant funding. Audit findings will be published in the `audits/` directory of this repository before v0.2 is released to npm.

## Disclosure Acknowledgments

Researchers who report valid vulnerabilities under this policy are credited in the corresponding release notes and, with their permission, in this `SECURITY.md` after disclosure.

## Contact

**`security@munity.club`**

Munity maintains `security@munity.club` as the dedicated channel for vulnerability reports across all `@munityclubs/*` packages. See also: [munity.club/.well-known/security.txt](https://munity.club/.well-known/security.txt) (RFC 9116). PGP key publication is on the v0.2 roadmap.