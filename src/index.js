export const SUPPORTED_FEATURE_KEYS = ["files_tab", "roadmaps", "merch"];

export const FEATURE_LABELS = Object.freeze({
  files_tab: "Files",
  roadmaps: "Roadmap",
  merch: "Merch",
});

function emptyGating() {
  return {
    hasGatingCollections: false,
    unlockedByCollection: false,
    gatingCollections: [],
  };
}

export function collectionToPublicGate(collection) {
  if (!collection || typeof collection !== "object") return null;
  return {
    id: String(collection.id ?? collection._id ?? ""),
    name: collection.name || "",
    image: collection.image || "",
    source: collection.source || "native",
    chainId: collection.chainId ?? collection.chain_id ?? null,
    contractAddress: collection.contractAddress ?? collection.contract_address ?? null,
    tokenId: collection.tokenId ?? collection.token_id ?? null,
    mintAddress: collection.mintAddress ?? collection.mint_address ?? null,
  };
}

export function collectionGatesFeature(collection, featureKey) {
  const key = String(featureKey || "").trim();
  if (!key) return false;
  const features =
    collection?.gatingSummary?.features ??
    collection?.gating?.features ??
    collection?.features;
  return Array.isArray(features) && features.includes(key);
}

export function buildFeatureGating({
  publicCollections = [],
  ownedCollectionIds = [],
  featureKeys = SUPPORTED_FEATURE_KEYS,
} = {}) {
  const owned = new Set(
    Array.isArray(ownedCollectionIds)
      ? ownedCollectionIds.map((id) => String(id))
      : [],
  );
  const collections = Array.isArray(publicCollections) ? publicCollections : [];

  const result = {};
  for (const rawKey of featureKeys) {
    const key = String(rawKey || "").trim();
    if (!key) continue;
    if (Object.prototype.hasOwnProperty.call(result, key)) continue;

    const gating = collections.filter((c) => collectionGatesFeature(c, key));
    if (gating.length === 0) {
      result[key] = emptyGating();
      continue;
    }

    result[key] = {
      hasGatingCollections: true,
      unlockedByCollection: gating.some((c) => owned.has(String(c.id ?? c._id))),
      gatingCollections: gating,
    };
  }

  return result;
}

export function evaluateFeatureAccess({
  featureKey,
  gatingCollections = [],
  ownedCollectionIds = [],
  isCreator = false,
  hasWallet = true,
} = {}) {
  if (!featureKey) return { allowed: false, reason: "missing_input" };
  if (isCreator) return { allowed: true, reason: "creator" };

  const gating = Array.isArray(gatingCollections)
    ? gatingCollections.filter((c) => collectionGatesFeature(c, featureKey))
    : [];
  if (gating.length === 0) return { allowed: true, reason: "ungated" };

  const publicGates = gating.map(collectionToPublicGate).filter(Boolean);
  if (!hasWallet) {
    return {
      allowed: false,
      reason: "no_wallet",
      gatingCollections: publicGates,
    };
  }

  const owned = new Set(
    Array.isArray(ownedCollectionIds)
      ? ownedCollectionIds.map((id) => String(id))
      : [],
  );
  const matched = gating.find((c) => owned.has(String(c.id ?? c._id)));
  if (matched) return { allowed: true, reason: "collection" };

  return {
    allowed: false,
    reason: "forbidden",
    gatingCollections: publicGates,
  };
}

function cleanLabel(value, fallback = "this section") {
  const label = String(value || "").trim();
  return label || fallback;
}

function featureNoun(label) {
  const clean = cleanLabel(label).toLowerCase();
  return clean === "this section" ? clean : clean;
}

function collectionName(collection) {
  return String(collection?.name || "").trim();
}

export function getFeatureLabel(featureKey, fallback = "this section") {
  return FEATURE_LABELS[featureKey] || cleanLabel(fallback);
}

export function getCollectionGateCopy({
  featureLabel = "this section",
  gatingCollections = [],
} = {}) {
  const label = cleanLabel(featureLabel);
  const feature = featureNoun(label);
  const collections = Array.isArray(gatingCollections)
    ? gatingCollections.filter(Boolean)
    : [];
  const primaryName = collectionName(collections[0]);
  const extra = Math.max(0, collections.length - 1);

  const extraCopy =
    extra > 0 ? ` or ${extra} other Collection${extra === 1 ? "" : "s"}` : "";
  const holderCopy = primaryName
    ? `Holders of "${primaryName}"${extraCopy} can view ${feature} in this Club.`
    : `Hold a gating Collection to view ${feature} in this Club.`;

  return {
    title: `${label} is gated by a Collection`,
    description: holderCopy,
    buttonText:
      collections.length === 1 && primaryName
        ? `Mint ${primaryName} to unlock`
        : "Mint a Collection to unlock",
    badgeText: "Collection Gate",
  };
}
