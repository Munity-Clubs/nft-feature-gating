import { describe, expect, it } from "vitest";

import {
  SUPPORTED_FEATURE_KEYS,
  buildFeatureGating,
  collectionToPublicGate,
  evaluateFeatureAccess,
  getCollectionGateCopy,
  getFeatureLabel,
} from "../index.js";

function collection(id, features = [], extra = {}) {
  return {
    id,
    name: `Collection ${id}`,
    gatingSummary: { features },
    ...extra,
  };
}

describe("@munityclubs/nft-feature-gating", () => {
  it("keeps the supported public feature set pinned", () => {
    expect(SUPPORTED_FEATURE_KEYS).toEqual(["files_tab", "roadmaps", "merch"]);
  });

  it("builds per-feature gating maps from public collections", () => {
    const filesPass = collection("files-pass", ["files_tab"]);
    const merchPass = collection("merch-pass", ["merch"]);

    const result = buildFeatureGating({
      publicCollections: [filesPass, merchPass],
      ownedCollectionIds: ["files-pass"],
    });

    expect(result.files_tab).toMatchObject({
      hasGatingCollections: true,
      unlockedByCollection: true,
      gatingCollections: [filesPass],
    });
    expect(result.merch).toMatchObject({
      hasGatingCollections: true,
      unlockedByCollection: false,
      gatingCollections: [merchPass],
    });
    expect(result.roadmaps).toEqual({
      hasGatingCollections: false,
      unlockedByCollection: false,
      gatingCollections: [],
    });
  });

  it("supports raw gating.features collections as well as public gating summaries", () => {
    const result = buildFeatureGating({
      publicCollections: [
        { _id: "mongo-id", name: "Roadmap Pass", gating: { features: ["roadmaps"] } },
      ],
      ownedCollectionIds: ["mongo-id"],
      featureKeys: ["roadmaps"],
    });

    expect(result.roadmaps.unlockedByCollection).toBe(true);
  });

  it("evaluates creator, ungated, no-wallet, owned, and forbidden access", () => {
    const gates = [
      collection("files-pass", ["files_tab"], {
        chain_id: 1,
        contract_address: "0xabc",
        token_id: "1",
      }),
    ];

    expect(
      evaluateFeatureAccess({
        featureKey: "files_tab",
        gatingCollections: gates,
        isCreator: true,
      }),
    ).toEqual({ allowed: true, reason: "creator" });

    expect(
      evaluateFeatureAccess({
        featureKey: "merch",
        gatingCollections: gates,
      }),
    ).toEqual({ allowed: true, reason: "ungated" });

    expect(
      evaluateFeatureAccess({
        featureKey: "files_tab",
        gatingCollections: gates,
        hasWallet: false,
      }),
    ).toMatchObject({
      allowed: false,
      reason: "no_wallet",
      gatingCollections: [
        {
          id: "files-pass",
          chainId: 1,
          contractAddress: "0xabc",
          tokenId: "1",
        },
      ],
    });

    expect(
      evaluateFeatureAccess({
        featureKey: "files_tab",
        gatingCollections: gates,
        ownedCollectionIds: ["files-pass"],
      }),
    ).toEqual({ allowed: true, reason: "collection" });

    expect(
      evaluateFeatureAccess({
        featureKey: "files_tab",
        gatingCollections: gates,
        ownedCollectionIds: ["other"],
      }),
    ).toMatchObject({ allowed: false, reason: "forbidden" });
  });

  it("converts internal collection shapes to public gate objects", () => {
    expect(
      collectionToPublicGate({
        _id: "mongo-id",
        name: "Files Pass",
        chain_id: 101,
        mint_address: "mint",
      }),
    ).toEqual({
      id: "mongo-id",
      name: "Files Pass",
      image: "",
      source: "native",
      chainId: 101,
      contractAddress: null,
      tokenId: null,
      mintAddress: "mint",
    });
  });

  it("returns feature labels and holder-facing gate copy", () => {
    expect(getFeatureLabel("files_tab")).toBe("Files");
    expect(
      getCollectionGateCopy({
        featureLabel: "Files",
        gatingCollections: [collection("a"), collection("b")],
      }),
    ).toEqual({
      title: "Files is gated by a Collection",
      description:
        'Holders of "Collection a" or 1 other Collection can view files in this Club.',
      buttonText: "Mint a Collection to unlock",
      badgeText: "Collection Gate",
    });
  });
});
