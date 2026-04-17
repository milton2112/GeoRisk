import fs from "fs-extra";
import path from "path";
import { normalizeText } from "./text-normalization.js";

const projectRoot = path.resolve(process.cwd());
const aliasConfigPath = path.join(projectRoot, "data", "geo_aliases.json");

export async function loadAliasConfig() {
  return fs.readJson(aliasConfigPath);
}

export function buildCountryLookupVariants(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return [];
  }

  const variants = new Set();
  const queue = [raw];

  while (queue.length) {
    const current = queue.pop();
    const normalized = normalizeText(current);
    if (!normalized || variants.has(normalized)) {
      continue;
    }

    variants.add(normalized);

    const withoutParentheses = normalized.replace(/\([^)]*\)/g, " ").replace(/\s+/g, " ").trim();
    const punctuationSimplified = normalized
      .replace(/[.'",]/g, " ")
      .replace(/&/g, " and ")
      .replace(/\s+/g, " ")
      .trim();
    const expandedAbbreviations = punctuationSimplified
      .replace(/\brep\b/g, "republic")
      .replace(/\bdem\b/g, "democratic")
      .replace(/\bis\b/g, "islands")
      .replace(/\bst\b/g, "saint")
      .replace(/\bn\b/g, "north")
      .replace(/\bs\b/g, "south")
      .replace(/\bw\b/g, "western")
      .replace(/\be\b/g, "eastern")
      .replace(/\s+/g, " ")
      .trim();

    [withoutParentheses, punctuationSimplified, expandedAbbreviations].forEach(variant => {
      if (variant && !variants.has(variant)) {
        queue.push(variant);
      }
    });
  }

  return Array.from(variants);
}

export function createCountryAliasIndex(countries, aliasConfig = {}, extraSources = {}) {
  const aliasIndex = new Map();
  const worldBankIndex = new Map();

  const register = (map, alias, code, overwrite = false) => {
    buildCountryLookupVariants(alias).forEach(variant => {
      if (overwrite || !map.has(variant) || map.get(variant) === code) {
        map.set(variant, code);
      }
    });
  };

  Object.entries(countries || {}).forEach(([code, country]) => {
    register(aliasIndex, code, code, true);
    register(aliasIndex, country?.name, code, true);
    register(aliasIndex, country?.general?.officialName, code, true);
    (country?.general?.historicalNames || []).forEach(alias => register(aliasIndex, alias, code, false));
  });

  Object.entries(extraSources.countryNames || {}).forEach(([code, name]) => {
    if (countries?.[code]) {
      register(aliasIndex, name, code, true);
    }
  });

  Object.entries(extraSources.populationNames || {}).forEach(([name, code]) => {
    if (countries?.[code]) {
      register(worldBankIndex, name, code, true);
    }
  });

  Object.entries(aliasConfig.mapNameAliases || {}).forEach(([alias, code]) => {
    if (countries?.[code]) {
      register(aliasIndex, alias, code, true);
    }
  });

  Object.entries(aliasConfig.worldBankNameAliases || {}).forEach(([alias, code]) => {
    if (countries?.[code]) {
      register(worldBankIndex, alias, code, true);
    }
  });

  return { aliasIndex, worldBankIndex };
}

export function resolveCountryNameToCode(rawName, countries, indexes) {
  const variants = buildCountryLookupVariants(rawName);
  if (!variants.length) {
    return null;
  }

  for (const variant of variants) {
    const aliasCode = indexes?.aliasIndex?.get(variant);
    if (aliasCode && countries?.[aliasCode]) {
      return aliasCode;
    }

    const worldBankCode = indexes?.worldBankIndex?.get(variant);
    if (worldBankCode && countries?.[worldBankCode]) {
      return worldBankCode;
    }
  }

  for (const [code, country] of Object.entries(countries || {})) {
    const candidateVariants = new Set();
    [
      code,
      country?.name,
      country?.general?.officialName,
      ...(country?.general?.historicalNames || [])
    ].forEach(name => {
      buildCountryLookupVariants(name).forEach(variant => candidateVariants.add(variant));
    });

    if (variants.some(variant => candidateVariants.has(variant))) {
      return code;
    }
  }

  return null;
}
