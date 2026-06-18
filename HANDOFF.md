# Handoff — `@munityclubs/nft-feature-gating`

> One-page orientation for anyone landing on this repo cold: a new collaborator, a code auditor, a grant reviewer, or future-you after a long context switch.

## What this is

NFT collection feature-gating helpers for community apps. The package converts public Collection metadata and owned-Collection ids into deterministic feature-gating states (`files_tab`, `roadmaps`, `merch`) and lock copy. It does **not** own wallet auth, RPC reads, or database state — those stay in the integrating application. That boundary lets consumer apps reuse the gating decision shape without restructuring their data layer.

## Current state (2026-05-24)

- **Version:** `v0.1.0` (npm) — published 2026-05-20
- **License:** MIT
- **Stability:** v0.1 surface is stable. Feature keys, gate-object shape, and per-feature gating-map construction are exercised in Munity production and frozen for v0.1.
- **Experimental:** none in v0.1.
- **Open work:** v0.2 ships TypeScript port, integration-walkthrough docs for a minimal Polygon ERC-1155 community app, reference JSON fixtures, and a small starter app showing creator-gated page rendering. See Polygon Consumer Crypto grant draft in the Munity webapp repo.

## How it fits the Munity stack

- **Munity webapp** uses the same gating-decision logic at `src/utils/community/featureGating.js` (server-side authoritative) and `src/utils/community/buildFeatureGating.js` (client-side advisory).
- **Collection access** (`src/utils/community/collectionAccess.js`) and **Club NFT access** (`src/utils/community/communityNftAccess.js`) feed ownership inputs into this package's gating evaluator.
- **Companion package:** `@munityclubs/verifiable-ticketing` (different surface — ticket admit gating — but the same decision-shape pattern).

## Where it's deployed

| Surface | Address / URL |
|---|---|
| npm | [`@munityclubs/nft-feature-gating@0.1.0`](https://www.npmjs.com/package/@munityclubs/nft-feature-gating) |
| Source | [github.com/Munity-Clubs/nft-feature-gating](https://github.com/Munity-Clubs/nft-feature-gating) |
| Production consumer (Solana) | [Munity Clubs](https://app.munity.club) — v2 program [`4PeTc…`](https://explorer.solana.com/address/4PeTcJYm5rPj4AU3Lq72nhpbyUxny2vJDTW6XUdpDDpk) |
| Production consumer (EVM) | Ethereum [`0x55c3…4941`](https://etherscan.io/address/0x55c31189539606D5b1Cb61d01D34E9180fca4941) · Polygon [`0xaF02…08db`](https://polygonscan.com/address/0xaF02eFB0a310FAd8C3Af3F01EB50EddF966908db) |

## How to verify

```bash
npm view @munityclubs/nft-feature-gating dist
git clone https://github.com/Munity-Clubs/nft-feature-gating
cd nft-feature-gating && npm install && npm test
```

## Roadmap pointer

v0.2 milestones are committed in [`docs/grants/applications/polygon-consumer-crypto-draft-v1.md`](https://github.com/kidofthenorth/munity-full-stack/blob/final-merge/docs/grants/applications/polygon-consumer-crypto-draft-v1.md) in the Munity webapp repo — TypeScript port, fixtures, Polygon starter app, and adoption support.

## Security + disclosure

- See [`SECURITY.md`](./SECURITY.md) for vulnerability reporting policy and in-scope surface.
- Contact: `security@munity.club`
- RFC 9116: [`munity.club/.well-known/security.txt`](https://munity.club/.well-known/security.txt)
- Sec3 third-party audit engagement letter on file 2026-05-20.