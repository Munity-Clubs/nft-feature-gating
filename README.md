# @munityclubs/nft-feature-gating

[![npm version](https://img.shields.io/npm/v/@munityclubs/nft-feature-gating.svg?style=flat-square)](https://www.npmjs.com/package/@munityclubs/nft-feature-gating)
[![License: MIT](https://img.shields.io/npm/l/@munityclubs/nft-feature-gating.svg?style=flat-square)](./LICENSE)
[![Security Policy](https://img.shields.io/badge/security-policy-blue?style=flat-square)](./SECURITY.md)
[![Handoff](https://img.shields.io/badge/handoff-doc-green?style=flat-square)](./HANDOFF.md)

Reusable NFT collection feature-gating helpers for community apps.

Munity uses this pattern for Clubs where one community can have multiple NFT
Collections, and each Collection can unlock different product surfaces like
files, roadmap, or merch.

## Install

```bash
npm install @munityclubs/nft-feature-gating
```

## Usage

```js
import {
  buildFeatureGating,
  evaluateFeatureAccess,
} from "@munityclubs/nft-feature-gating";

const gating = buildFeatureGating({
  publicCollections,
  ownedCollectionIds: ["collection-a"],
});

const access = evaluateFeatureAccess({
  featureKey: "files_tab",
  gatingCollections: publicCollections,
  ownedCollectionIds: ["collection-a"],
  hasWallet: true,
});
```

## What It Covers

- Per-feature NFT Collection gating maps
- Any-of-N Collection unlock logic
- Public-safe gate collection objects for "mint to unlock" UI
- Creator, wallet-missing, ungated, collection, and forbidden access reasons
- Human copy for gated feature prompts

The package is storage-neutral. Your app still owns wallet authentication,
on-chain ownership reads, database queries, and authoritative API enforcement.

## Development

```bash
yarn install
yarn test
```

## License

MIT
