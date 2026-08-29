import fs from "fs-extra";
import path from "node:path";
import { SAFE_CONFLICT_RENAMES, CURATED_CONFLICT_DETAIL_FIXES } from "./lib/conflict-autofix-rules.js";
import { EXTRA_CURATED_CONFLICT_DETAIL_FIXES, EXTRA_SAFE_CONFLICT_RENAMES } from "./lib/conflict-curation-extra.js";
import { US_REVOLUTION_CONFLICT_DETAIL_FIXES } from "./lib/conflict-curation-us-revolution.js";
import { EARLY_1800_CONFLICT_DETAIL_FIXES, EARLY_1800_SAFE_CONFLICT_RENAMES } from "./lib/conflict-curation-early-1800.js";
import { MID_1800_CONFLICT_DETAIL_FIXES, MID_1800_SAFE_CONFLICT_RENAMES } from "./lib/conflict-curation-1847-1864.js";
import { LATE_1800_CONFLICT_DETAIL_FIXES, LATE_1800_SAFE_CONFLICT_RENAMES } from "./lib/conflict-curation-1877-1914.js";
import { INTERWAR_CONFLICT_DETAIL_FIXES, INTERWAR_SAFE_CONFLICT_RENAMES } from "./lib/conflict-curation-1919-1941.js";
import { WWII_1942_CONFLICT_DETAIL_FIXES, WWII_1942_SAFE_CONFLICT_RENAMES } from "./lib/conflict-curation-1942.js";
import {
  getContextualConflictName,
  THEATER_CONFLICT_DETAIL_FIXES,
  THEATER_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-theater.js";
import {
  VISIBLE_MODERN_CONFLICT_DETAIL_FIXES,
  VISIBLE_MODERN_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-visible-modern.js";
import {
  VISIBLE_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  VISIBLE_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-visible-followup.js";
import {
  KOREA_MODERN_CONFLICT_DETAIL_FIXES,
  KOREA_MODERN_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-korea-modern.js";
import {
  HISTORICAL_VIETNAM_CONFLICT_DETAIL_FIXES,
  HISTORICAL_VIETNAM_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-historical-vietnam.js";
import {
  POSTWAR_1970_1991_CONFLICT_DETAIL_FIXES,
  POSTWAR_1970_1991_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-1970-1991.js";
import {
  MODERN_1992_2021_CONFLICT_DETAIL_FIXES,
  MODERN_1992_2021_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-1992-2021.js";
import {
  UNDATED_AMERICAS_CONFLICT_DETAIL_FIXES,
  UNDATED_AMERICAS_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-undated-americas.js";
import {
  REVOLUTION_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  REVOLUTION_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-revolution-followup.js";
import {
  TRANSITION_1846_1902_COUNTRY_CONFLICT_ADDITIONS,
  TRANSITION_1846_1902_CONFLICT_DETAIL_FIXES,
  TRANSITION_1846_1902_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-1846-1902.js";
import {
  WAR_1812_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  WAR_1812_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-war-1812-followup.js";
import {
  US_CIVIL_WAR_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  US_CIVIL_WAR_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-us-civil-war-followup.js";
import {
  US_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  US_WWII_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-us-wwii-followup.js";
import {
  US_INDIAN_WARS_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  US_INDIAN_WARS_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-us-indian-wars-followup.js";
import {
  US_FRONTIER_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  US_FRONTIER_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-us-frontier-followup.js";
import {
  US_FRONTIER_SECOND_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  US_FRONTIER_SECOND_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-us-frontier-second-followup.js";
import {
  US_CARIBBEAN_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  US_CARIBBEAN_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  US_CARIBBEAN_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-us-caribbean-followup.js";
import {
  AUSTRALIA_DENMARK_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  AUSTRALIA_DENMARK_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  AUSTRALIA_DENMARK_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-australia-denmark-followup.js";
import {
  US_INDIGENOUS_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  US_INDIGENOUS_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-us-indigenous-followup.js";
import {
  US_REVOLUTION_THIRD_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  US_REVOLUTION_THIRD_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-us-revolution-third-followup.js";
import {
  BRITISH_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  BRITISH_WWII_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-british-wwii-followup.js";
import {
  US_OVERSEAS_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  US_OVERSEAS_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-us-overseas-followup.js";
import {
  ACTIVE_AFRICA_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ACTIVE_AFRICA_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-active-africa-followup.js";
import {
  JAPAN_KOREA_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  JAPAN_KOREA_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  JAPAN_KOREA_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-japan-korea-followup.js";
import {
  FRANCE_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  FRANCE_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  FRANCE_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-france-followup.js";
import {
  US_GLOBAL_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  US_GLOBAL_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  US_GLOBAL_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-us-global-followup.js";
import {
  BRITISH_GLOBAL_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  BRITISH_GLOBAL_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  BRITISH_GLOBAL_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-british-global-followup.js";
import {
  PROVISIONAL_FOUNDATION_CONFLICT_DETAIL_FIXES,
  PROVISIONAL_FOUNDATION_COUNTRY_CONFLICT_ADDITIONS,
  PROVISIONAL_FOUNDATION_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-provisional-foundation.js";
import {
  NORDIC_BALTIC_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  NORDIC_BALTIC_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  NORDIC_BALTIC_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-nordic-baltic-followup.js";
import {
  POLISH_SWEDISH_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  POLISH_SWEDISH_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  POLISH_SWEDISH_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-polish-swedish-followup.js";
import {
  POLISH_DELUGE_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  POLISH_DELUGE_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  POLISH_DELUGE_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-polish-deluge-followup.js";
import {
  POLISH_DELUGE_SWEDISH_OPERATIONS_CONFLICT_DETAIL_FIXES,
  POLISH_DELUGE_SWEDISH_OPERATIONS_COUNTRY_CONFLICT_ADDITIONS,
  POLISH_DELUGE_SWEDISH_OPERATIONS_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-polish-deluge-swedish-operations.js";
import {
  SWEDISH_LIVONIAN_OPERATIONS_CONFLICT_DETAIL_FIXES,
  SWEDISH_LIVONIAN_OPERATIONS_COUNTRY_CONFLICT_ADDITIONS,
  SWEDISH_LIVONIAN_OPERATIONS_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-swedish-livonian-operations.js";
import {
  FINNISH_THEATER_OPERATIONS_CONFLICT_DETAIL_FIXES,
  FINNISH_THEATER_OPERATIONS_COUNTRY_CONFLICT_ADDITIONS,
  FINNISH_THEATER_OPERATIONS_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-finnish-theater-operations.js";
import {
  NORDIC_SOVEREIGNTY_CONFLICT_DETAIL_FIXES,
  NORDIC_SOVEREIGNTY_COUNTRY_CONFLICT_ADDITIONS,
  NORDIC_SOVEREIGNTY_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-nordic-sovereignty.js";
import {
  GLOBAL_LANDMARKS_CONFLICT_DETAIL_FIXES,
  GLOBAL_LANDMARKS_COUNTRY_CONFLICT_ADDITIONS,
  GLOBAL_LANDMARKS_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-global-landmarks.js";
import {
  GLOBAL_HISTORICAL_OPERATIONS_CONFLICT_DETAIL_FIXES,
  GLOBAL_HISTORICAL_OPERATIONS_COUNTRY_CONFLICT_ADDITIONS,
  GLOBAL_HISTORICAL_OPERATIONS_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-global-historical-operations.js";
import {
  GLOBAL_SOURCE_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  GLOBAL_SOURCE_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  GLOBAL_SOURCE_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-global-source-followup.js";
import {
  NORDIC_ASIA_SOURCE_BATCH_CONFLICT_DETAIL_FIXES,
  NORDIC_ASIA_SOURCE_BATCH_COUNTRY_CONFLICT_ADDITIONS,
  NORDIC_ASIA_SOURCE_BATCH_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-nordic-asia-source-batch.js";
import {
  ASIA_AFRICA_HISTORICAL_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ASIA_AFRICA_HISTORICAL_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  ASIA_AFRICA_HISTORICAL_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-asia-africa-historical-followup.js";
import {
  EUROPEAN_HISTORICAL_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  EUROPEAN_HISTORICAL_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  EUROPEAN_HISTORICAL_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-european-historical-followup.js";
import {
  MARITIME_AMERICAS_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  MARITIME_AMERICAS_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  MARITIME_AMERICAS_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-maritime-americas-followup.js";
import {
  DEBRECEN_1944_CONFLICT_DETAIL_FIXES,
  DEBRECEN_1944_COUNTRY_CONFLICT_ADDITIONS,
  DEBRECEN_1944_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-debrecen-1944.js";
import {
  PRIORITY_SAFE_BATCH_CONFLICT_DETAIL_FIXES,
  PRIORITY_SAFE_BATCH_COUNTRY_CONFLICT_ADDITIONS,
  PRIORITY_SAFE_BATCH_CONFLICT_RENAMES
} from "./lib/conflict-curation-priority-safe-batch.js";
import {
  PROVISIONAL_SOURCE_BATCH_CONFLICT_DETAIL_FIXES,
  PROVISIONAL_SOURCE_BATCH_COUNTRY_CONFLICT_ADDITIONS,
  PROVISIONAL_SOURCE_BATCH_CONFLICT_RENAMES
} from "./lib/conflict-curation-provisional-source-batch.js";
import {
  NORTH_ATLANTIC_PROVISIONAL_CONFLICT_DETAIL_FIXES,
  NORTH_ATLANTIC_PROVISIONAL_COUNTRY_CONFLICT_ADDITIONS,
  NORTH_ATLANTIC_PROVISIONAL_CONFLICT_RENAMES
} from "./lib/conflict-curation-north-atlantic-provisional.js";
import {
  CAMPECHE_ANTIVARI_CONFLICT_DETAIL_FIXES,
  CAMPECHE_ANTIVARI_COUNTRY_CONFLICT_ADDITIONS,
  CAMPECHE_ANTIVARI_CONFLICT_RENAMES
} from "./lib/conflict-curation-campeche-antivari.js";
import {
  FLINT_DOGGER_CONFLICT_DETAIL_FIXES,
  FLINT_DOGGER_COUNTRY_CONFLICT_ADDITIONS,
  FLINT_DOGGER_COUNTRY_CONFLICT_EXCLUSIONS,
  FLINT_DOGGER_CONFLICT_RENAMES
} from "./lib/conflict-curation-flint-dogger.js";
import {
  DASMAN_RACHADO_CONFLICT_DETAIL_FIXES,
  DASMAN_RACHADO_COUNTRY_CONFLICT_ADDITIONS,
  DASMAN_RACHADO_COUNTRY_CONFLICT_EXCLUSIONS,
  DASMAN_RACHADO_CONFLICT_RENAMES
} from "./lib/conflict-curation-dasman-rachado.js";
import {
  BEITANG_TEACAPAN_CONFLICT_DETAIL_FIXES,
  BEITANG_TEACAPAN_COUNTRY_CONFLICT_ADDITIONS,
  BEITANG_TEACAPAN_COUNTRY_CONFLICT_EXCLUSIONS,
  BEITANG_TEACAPAN_CONFLICT_RENAMES
} from "./lib/conflict-curation-beitang-teacapan.js";
import {
  OSEL_VAILELE_CONFLICT_DETAIL_FIXES,
  OSEL_VAILELE_COUNTRY_CONFLICT_ADDITIONS,
  OSEL_VAILELE_COUNTRY_CONFLICT_EXCLUSIONS,
  OSEL_VAILELE_CONFLICT_RENAMES
} from "./lib/conflict-curation-osel-vailele.js";
import {
  NEVA_SHANHAIGUAN_CONFLICT_DETAIL_FIXES,
  NEVA_SHANHAIGUAN_COUNTRY_CONFLICT_ADDITIONS,
  NEVA_SHANHAIGUAN_COUNTRY_CONFLICT_EXCLUSIONS,
  NEVA_SHANHAIGUAN_CONFLICT_RENAMES
} from "./lib/conflict-curation-neva-shanhaiguan.js";
import {
  GUERRERO_CONFLICT_DETAIL_FIXES,
  GUERRERO_COUNTRY_CONFLICT_ADDITIONS,
  GUERRERO_CONFLICT_RENAMES
} from "./lib/conflict-curation-guerrero.js";
import {
  HYERES_CONFLICT_DETAIL_FIXES,
  HYERES_COUNTRY_CONFLICT_ADDITIONS,
  HYERES_CONFLICT_RENAMES
} from "./lib/conflict-curation-hyeres.js";
import {
  MOCIMBOA_CONFLICT_DETAIL_FIXES,
  MOCIMBOA_CONFLICT_RENAMES
} from "./lib/conflict-curation-mocimboa.js";
import {
  BARBADOS_CONFLICT_DETAIL_FIXES,
  BARBADOS_COUNTRY_CONFLICT_ADDITIONS,
  BARBADOS_CONFLICT_RENAMES
} from "./lib/conflict-curation-barbados.js";
import {
  CHEF_DE_CAUX_CONFLICT_DETAIL_FIXES,
  CHEF_DE_CAUX_COUNTRY_CONFLICT_ADDITIONS,
  CHEF_DE_CAUX_CONFLICT_RENAMES
} from "./lib/conflict-curation-chef-de-caux.js";
import {
  BIR_ENZARAN_CONFLICT_DETAIL_FIXES,
  BIR_ENZARAN_COUNTRY_CONFLICT_ADDITIONS,
  BIR_ENZARAN_CONFLICT_RENAMES
} from "./lib/conflict-curation-bir-enzaran.js";
import {
  LEBOUIRATE_CONFLICT_DETAIL_FIXES,
  LEBOUIRATE_COUNTRY_CONFLICT_ADDITIONS,
  LEBOUIRATE_CONFLICT_RENAMES
} from "./lib/conflict-curation-lebouirate.js";
import {
  KALYAZIN_CONFLICT_DETAIL_FIXES,
  KALYAZIN_COUNTRY_CONFLICT_ADDITIONS,
  KALYAZIN_CONFLICT_RENAMES
} from "./lib/conflict-curation-kalyazin.js";
import {
  SANTO_DOMINGO_CONFLICT_DETAIL_FIXES,
  SANTO_DOMINGO_COUNTRY_CONFLICT_ADDITIONS,
  SANTO_DOMINGO_CONFLICT_RENAMES
} from "./lib/conflict-curation-santo-domingo.js";
import {
  SANTA_LUCIA_CONFLICT_DETAIL_FIXES,
  SANTA_LUCIA_COUNTRY_CONFLICT_ADDITIONS,
  SANTA_LUCIA_CONFLICT_RENAMES
} from "./lib/conflict-curation-santa-lucia.js";
import {
  HIDDENSEE_CONFLICT_DETAIL_FIXES,
  HIDDENSEE_COUNTRY_CONFLICT_ADDITIONS,
  HIDDENSEE_CONFLICT_RENAMES
} from "./lib/conflict-curation-hiddensee.js";
import {
  HAVANA_CONFLICT_DETAIL_FIXES,
  HAVANA_COUNTRY_CONFLICT_ADDITIONS,
  HAVANA_CONFLICT_RENAMES
} from "./lib/conflict-curation-havana.js";
import {
  JABRAYIL_CONFLICT_DETAIL_FIXES,
  JABRAYIL_COUNTRY_CONFLICT_ADDITIONS,
  JABRAYIL_CONFLICT_RENAMES
} from "./lib/conflict-curation-jabrayil.js";
import {
  LISSA_CONFLICT_DETAIL_FIXES,
  LISSA_COUNTRY_CONFLICT_ADDITIONS,
  LISSA_CONFLICT_RENAMES
} from "./lib/conflict-curation-lissa.js";
import {
  VIZAKNA_CONFLICT_DETAIL_FIXES,
  VIZAKNA_COUNTRY_CONFLICT_ADDITIONS,
  VIZAKNA_CONFLICT_RENAMES
} from "./lib/conflict-curation-vizakna.js";
import {
  SAINT_MARCOUF_CONFLICT_DETAIL_FIXES,
  SAINT_MARCOUF_COUNTRY_CONFLICT_ADDITIONS,
  SAINT_MARCOUF_CONFLICT_RENAMES
} from "./lib/conflict-curation-saint-marcouf.js";
import {
  GYANAFALVA_CONFLICT_DETAIL_FIXES,
  GYANAFALVA_COUNTRY_CONFLICT_ADDITIONS,
  GYANAFALVA_CONFLICT_RENAMES
} from "./lib/conflict-curation-gyanafalva.js";
import {
  JUPITER_INLET_CONFLICT_DETAIL_FIXES,
  JUPITER_INLET_COUNTRY_CONFLICT_ADDITIONS,
  JUPITER_INLET_CONFLICT_RENAMES
} from "./lib/conflict-curation-jupiter-inlet.js";
import {
  KIRCHSCHLAG_CONFLICT_DETAIL_FIXES,
  KIRCHSCHLAG_COUNTRY_CONFLICT_ADDITIONS,
  KIRCHSCHLAG_CONFLICT_RENAMES
} from "./lib/conflict-curation-kirchschlag.js";
import {
  MAHE_CONFLICT_DETAIL_FIXES,
  MAHE_COUNTRY_CONFLICT_ADDITIONS,
  MAHE_CONFLICT_RENAMES
} from "./lib/conflict-curation-mahe.js";
import {
  FUNDY_BAY_CONFLICT_DETAIL_FIXES,
  FUNDY_BAY_COUNTRY_CONFLICT_ADDITIONS,
  FUNDY_BAY_CONFLICT_RENAMES
} from "./lib/conflict-curation-fundy-bay.js";
import {
  LAGOS_1759_CONFLICT_DETAIL_FIXES,
  LAGOS_1759_COUNTRY_CONFLICT_ADDITIONS,
  LAGOS_1759_COUNTRY_CONFLICT_EXCLUSIONS,
  LAGOS_1759_GENERATED_DETAIL_EXCLUSIONS,
  LAGOS_1759_CONFLICT_RENAMES
} from "./lib/conflict-curation-lagos-1759.js";
import {
  KAIPIAIS_1789_CONFLICT_DETAIL_FIXES,
  KAIPIAIS_1789_COUNTRY_CONFLICT_ADDITIONS,
  KAIPIAIS_1789_SAFE_CONFLICT_RENAMES
} from "./lib/conflict-curation-kaipiais-1789.js";
import {
  TIGER_MOUTH_1809_CONFLICT_DETAIL_FIXES,
  TIGER_MOUTH_1809_COUNTRY_CONFLICT_ADDITIONS,
  TIGER_MOUTH_1809_CONFLICT_RENAMES
} from "./lib/conflict-curation-tiger-mouth-1809.js";
import {
  IMBROS_1918_CONFLICT_DETAIL_FIXES,
  IMBROS_1918_COUNTRY_CONFLICT_ADDITIONS,
  IMBROS_1918_COUNTRY_CONFLICT_EXCLUSIONS,
  IMBROS_1918_CONFLICT_RENAMES
} from "./lib/conflict-curation-imbros-1918.js";
import {
  PULANG_LUPA_1900_CONFLICT_DETAIL_FIXES,
  PULANG_LUPA_1900_COUNTRY_CONFLICT_ADDITIONS,
  PULANG_LUPA_1900_CONFLICT_RENAMES
} from "./lib/conflict-curation-pulang-lupa-1900.js";
import {
  COCKLE_CREEK_CONFLICT_DETAIL_FIXES,
  COCKLE_CREEK_CONFLICT_RENAMES
} from "./lib/conflict-curation-cockle-creek.js";
import {
  CLOUDS_CONFLICT_DETAIL_FIXES,
  CLOUDS_CONFLICT_RENAMES
} from "./lib/conflict-curation-clouds.js";
import {
  COLSONS_MILL_CONFLICT_DETAIL_FIXES,
  COLSONS_MILL_CONFLICT_RENAMES
} from "./lib/conflict-curation-colsons-mill.js";
import {
  CHILLICOTHE_CONFLICT_DETAIL_FIXES,
  CHILLICOTHE_CONFLICT_RENAMES
} from "./lib/conflict-curation-chillicothe.js";
import {
  ASINARA_CONFLICT_DETAIL_FIXES,
  ASINARA_CONFLICT_RENAMES
} from "./lib/conflict-curation-asinara.js";
import {
  BAU_CONFLICT_DETAIL_FIXES,
  BAU_COUNTRY_CONFLICT_ADDITIONS,
  BAU_CONFLICT_RENAMES
} from "./lib/conflict-curation-bau.js";
import {
  ARANAS_CONFLICT_DETAIL_FIXES,
  ARANAS_COUNTRY_CONFLICT_ADDITIONS,
  ARANAS_CONFLICT_RENAMES
} from "./lib/conflict-curation-aranas.js";
import {
  ALEGRE_CONFLICT_DETAIL_FIXES,
  ALEGRE_COUNTRY_CONFLICT_ADDITIONS,
  ALEGRE_CONFLICT_RENAMES
} from "./lib/conflict-curation-alegre.js";
import {
  COOKES_CANYON_CONFLICT_DETAIL_FIXES,
  COOKES_CANYON_CONFLICT_RENAMES
} from "./lib/conflict-curation-cookes-canyon.js";
import {
  CZORTKOW_CONFLICT_DETAIL_FIXES,
  CZORTKOW_COUNTRY_CONFLICT_ADDITIONS,
  CZORTKOW_CONFLICT_RENAMES
} from "./lib/conflict-curation-czortkow.js";
import {
  DEGLEBAT_LEGLIA_CONFLICT_DETAIL_FIXES,
  DEGLEBAT_LEGLIA_COUNTRY_CONFLICT_ADDITIONS,
  DEGLEBAT_LEGLIA_CONFLICT_RENAMES
} from "./lib/conflict-curation-deglebat-leglia.js";
import {
  DEVILS_CREEK_CONFLICT_DETAIL_FIXES,
  DEVILS_CREEK_CONFLICT_RENAMES
} from "./lib/conflict-curation-devils-creek.js";
import {
  DIABLO_MOUNTAINS_CONFLICT_DETAIL_FIXES,
  DIABLO_MOUNTAINS_CONFLICT_RENAMES
} from "./lib/conflict-curation-diablo-mountains.js";
import {
  DOLORES_RIVER_CONFLICT_DETAIL_FIXES,
  DOLORES_RIVER_COUNTRY_CONFLICT_ADDITIONS,
  DOLORES_RIVER_CONFLICT_RENAMES
} from "./lib/conflict-curation-dolores-river.js";
import {
  DORO_PASSAGE_CONFLICT_DETAIL_FIXES,
  DORO_PASSAGE_COUNTRY_CONFLICT_ADDITIONS,
  DORO_PASSAGE_CONFLICT_RENAMES
} from "./lib/conflict-curation-doro-passage.js";
import {
  DROHICZYN_CONFLICT_DETAIL_FIXES,
  DROHICZYN_CONFLICT_RENAMES
} from "./lib/conflict-curation-drohiczyn.js";
import {
  JASK_CONFLICT_DETAIL_FIXES,
  JASK_COUNTRY_CONFLICT_ADDITIONS,
  JASK_CONFLICT_RENAMES
} from "./lib/conflict-curation-jask.js";
import {
  GOTSKA_SANDON_CONFLICT_DETAIL_FIXES,
  GOTSKA_SANDON_COUNTRY_CONFLICT_ADDITIONS,
  GOTSKA_SANDON_CONFLICT_RENAMES
} from "./lib/conflict-curation-gotska-sandon.js";
import {
  PIRANO_GRADO_CONFLICT_DETAIL_FIXES,
  PIRANO_GRADO_COUNTRY_CONFLICT_ADDITIONS,
  PIRANO_GRADO_CONFLICT_RENAMES
} from "./lib/conflict-curation-pirano-grado.js";
import {
  CABO_BOJADOR_COUNTRY_CONFLICT_EXCLUSIONS
} from "./lib/conflict-curation-cabo-bojador.js";
import {
  CERRO_DEL_GALLO_COUNTRY_CONFLICT_EXCLUSIONS
} from "./lib/conflict-curation-cerro-del-gallo.js";
import { collectConflictCountryNames, curateConflictDetail, curateConflictEntry } from "./lib/conflict-batch-curation.js";
import {
  cleanConflictLabel,
  isProvisionalConflictHierarchy,
  mergeConflictEntries,
  normalizeConflictKey
} from "./lib/conflict-cleaning.js";
import { getCountryConflictNames, mergeCountryConflictBatches } from "./lib/conflict-country-targeting.js";
import { normalizeVisibleValue } from "./lib/visible-data-corrections.js";
import {
  areJsonValuesEquivalent,
  readJsonWithRetry,
  writeJsonIfChanged,
  writeJsonWithRetry
} from "./lib/resilient-fs.js";

const projectRoot = path.resolve(process.cwd());
const fullPath = path.join(projectRoot, "data", "countries_full.json");
const generatedDetailsPath = path.join(projectRoot, "data", "conflict_details.generated.json");
const reportPath = path.join(projectRoot, "reports", "conflict-autofix-applied.json");
const curatedConflictDetailFixes = {
  ...CURATED_CONFLICT_DETAIL_FIXES,
  ...EXTRA_CURATED_CONFLICT_DETAIL_FIXES,
  ...US_REVOLUTION_CONFLICT_DETAIL_FIXES,
  ...EARLY_1800_CONFLICT_DETAIL_FIXES,
  ...MID_1800_CONFLICT_DETAIL_FIXES,
  ...LATE_1800_CONFLICT_DETAIL_FIXES,
  ...INTERWAR_CONFLICT_DETAIL_FIXES,
  ...WWII_1942_CONFLICT_DETAIL_FIXES,
  ...THEATER_CONFLICT_DETAIL_FIXES,
  ...VISIBLE_MODERN_CONFLICT_DETAIL_FIXES,
  ...VISIBLE_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ...KOREA_MODERN_CONFLICT_DETAIL_FIXES,
  ...HISTORICAL_VIETNAM_CONFLICT_DETAIL_FIXES,
  ...POSTWAR_1970_1991_CONFLICT_DETAIL_FIXES,
  ...MODERN_1992_2021_CONFLICT_DETAIL_FIXES,
  ...UNDATED_AMERICAS_CONFLICT_DETAIL_FIXES,
  ...REVOLUTION_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ...TRANSITION_1846_1902_CONFLICT_DETAIL_FIXES,
  ...WAR_1812_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ...US_CIVIL_WAR_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ...US_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ...US_INDIAN_WARS_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ...US_FRONTIER_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ...US_FRONTIER_SECOND_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ...US_CARIBBEAN_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ...AUSTRALIA_DENMARK_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ...US_INDIGENOUS_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ...US_REVOLUTION_THIRD_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ...BRITISH_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ...US_OVERSEAS_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ...ACTIVE_AFRICA_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ...JAPAN_KOREA_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ...FRANCE_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ...US_GLOBAL_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ...BRITISH_GLOBAL_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ...PROVISIONAL_FOUNDATION_CONFLICT_DETAIL_FIXES,
  ...NORDIC_BALTIC_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ...POLISH_SWEDISH_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ...POLISH_DELUGE_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ...POLISH_DELUGE_SWEDISH_OPERATIONS_CONFLICT_DETAIL_FIXES,
  ...SWEDISH_LIVONIAN_OPERATIONS_CONFLICT_DETAIL_FIXES,
  ...FINNISH_THEATER_OPERATIONS_CONFLICT_DETAIL_FIXES,
  ...NORDIC_SOVEREIGNTY_CONFLICT_DETAIL_FIXES,
  ...GLOBAL_LANDMARKS_CONFLICT_DETAIL_FIXES,
  ...GLOBAL_HISTORICAL_OPERATIONS_CONFLICT_DETAIL_FIXES,
  ...GLOBAL_SOURCE_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ...NORDIC_ASIA_SOURCE_BATCH_CONFLICT_DETAIL_FIXES,
  ...ASIA_AFRICA_HISTORICAL_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ...EUROPEAN_HISTORICAL_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ...MARITIME_AMERICAS_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ...DEBRECEN_1944_CONFLICT_DETAIL_FIXES,
  ...PRIORITY_SAFE_BATCH_CONFLICT_DETAIL_FIXES,
  ...PROVISIONAL_SOURCE_BATCH_CONFLICT_DETAIL_FIXES,
  ...NORTH_ATLANTIC_PROVISIONAL_CONFLICT_DETAIL_FIXES,
  ...CAMPECHE_ANTIVARI_CONFLICT_DETAIL_FIXES,
  ...FLINT_DOGGER_CONFLICT_DETAIL_FIXES,
  ...DASMAN_RACHADO_CONFLICT_DETAIL_FIXES,
  ...BEITANG_TEACAPAN_CONFLICT_DETAIL_FIXES,
  ...OSEL_VAILELE_CONFLICT_DETAIL_FIXES,
  ...NEVA_SHANHAIGUAN_CONFLICT_DETAIL_FIXES,
  ...GUERRERO_CONFLICT_DETAIL_FIXES,
  ...HYERES_CONFLICT_DETAIL_FIXES,
  ...MOCIMBOA_CONFLICT_DETAIL_FIXES,
  ...BARBADOS_CONFLICT_DETAIL_FIXES,
  ...CHEF_DE_CAUX_CONFLICT_DETAIL_FIXES,
  ...BIR_ENZARAN_CONFLICT_DETAIL_FIXES,
  ...LEBOUIRATE_CONFLICT_DETAIL_FIXES,
  ...KALYAZIN_CONFLICT_DETAIL_FIXES,
  ...SANTO_DOMINGO_CONFLICT_DETAIL_FIXES,
  ...SANTA_LUCIA_CONFLICT_DETAIL_FIXES,
  ...HIDDENSEE_CONFLICT_DETAIL_FIXES,
  ...HAVANA_CONFLICT_DETAIL_FIXES,
  ...JABRAYIL_CONFLICT_DETAIL_FIXES,
  ...LISSA_CONFLICT_DETAIL_FIXES,
  ...VIZAKNA_CONFLICT_DETAIL_FIXES,
  ...SAINT_MARCOUF_CONFLICT_DETAIL_FIXES,
  ...GYANAFALVA_CONFLICT_DETAIL_FIXES,
  ...JUPITER_INLET_CONFLICT_DETAIL_FIXES,
  ...KIRCHSCHLAG_CONFLICT_DETAIL_FIXES,
  ...MAHE_CONFLICT_DETAIL_FIXES,
  ...FUNDY_BAY_CONFLICT_DETAIL_FIXES,
  ...LAGOS_1759_CONFLICT_DETAIL_FIXES,
  ...KAIPIAIS_1789_CONFLICT_DETAIL_FIXES,
  ...TIGER_MOUTH_1809_CONFLICT_DETAIL_FIXES,
  ...IMBROS_1918_CONFLICT_DETAIL_FIXES,
  ...PULANG_LUPA_1900_CONFLICT_DETAIL_FIXES,
  ...COCKLE_CREEK_CONFLICT_DETAIL_FIXES,
  ...CLOUDS_CONFLICT_DETAIL_FIXES,
  ...COLSONS_MILL_CONFLICT_DETAIL_FIXES,
  ...CHILLICOTHE_CONFLICT_DETAIL_FIXES,
  ...ASINARA_CONFLICT_DETAIL_FIXES,
  ...BAU_CONFLICT_DETAIL_FIXES,
  ...ARANAS_CONFLICT_DETAIL_FIXES,
  ...ALEGRE_CONFLICT_DETAIL_FIXES,
  ...COOKES_CANYON_CONFLICT_DETAIL_FIXES,
  ...CZORTKOW_CONFLICT_DETAIL_FIXES,
  ...DEGLEBAT_LEGLIA_CONFLICT_DETAIL_FIXES,
  ...DEVILS_CREEK_CONFLICT_DETAIL_FIXES,
  ...DIABLO_MOUNTAINS_CONFLICT_DETAIL_FIXES,
  ...DOLORES_RIVER_CONFLICT_DETAIL_FIXES,
  ...DORO_PASSAGE_CONFLICT_DETAIL_FIXES,
  ...DROHICZYN_CONFLICT_DETAIL_FIXES,
  ...JASK_CONFLICT_DETAIL_FIXES,
  ...GOTSKA_SANDON_CONFLICT_DETAIL_FIXES,
  ...PIRANO_GRADO_CONFLICT_DETAIL_FIXES
};

const generatedConflictDetailExclusionNames = [
  ...LAGOS_1759_GENERATED_DETAIL_EXCLUSIONS
];
const generatedConflictDetailExclusions = new Set(
  generatedConflictDetailExclusionNames.map(normalizeConflictKey)
);
const safeConflictRenames = {
  ...SAFE_CONFLICT_RENAMES,
  ...EXTRA_SAFE_CONFLICT_RENAMES,
  ...EARLY_1800_SAFE_CONFLICT_RENAMES,
  ...MID_1800_SAFE_CONFLICT_RENAMES,
  ...LATE_1800_SAFE_CONFLICT_RENAMES,
  ...INTERWAR_SAFE_CONFLICT_RENAMES,
  ...WWII_1942_SAFE_CONFLICT_RENAMES,
  ...THEATER_SAFE_CONFLICT_RENAMES,
  ...VISIBLE_MODERN_SAFE_CONFLICT_RENAMES,
  ...VISIBLE_FOLLOWUP_SAFE_CONFLICT_RENAMES,
  ...KOREA_MODERN_SAFE_CONFLICT_RENAMES,
  ...HISTORICAL_VIETNAM_SAFE_CONFLICT_RENAMES,
  ...POSTWAR_1970_1991_SAFE_CONFLICT_RENAMES,
  ...MODERN_1992_2021_SAFE_CONFLICT_RENAMES,
  ...UNDATED_AMERICAS_SAFE_CONFLICT_RENAMES,
  ...REVOLUTION_FOLLOWUP_SAFE_CONFLICT_RENAMES,
  ...TRANSITION_1846_1902_SAFE_CONFLICT_RENAMES,
  ...WAR_1812_FOLLOWUP_SAFE_CONFLICT_RENAMES,
  ...US_CIVIL_WAR_FOLLOWUP_SAFE_CONFLICT_RENAMES,
  ...US_WWII_FOLLOWUP_SAFE_CONFLICT_RENAMES,
  ...US_INDIAN_WARS_FOLLOWUP_SAFE_CONFLICT_RENAMES,
  ...US_FRONTIER_FOLLOWUP_SAFE_CONFLICT_RENAMES,
  ...US_FRONTIER_SECOND_FOLLOWUP_SAFE_CONFLICT_RENAMES,
  ...US_CARIBBEAN_FOLLOWUP_SAFE_CONFLICT_RENAMES,
  ...AUSTRALIA_DENMARK_FOLLOWUP_SAFE_CONFLICT_RENAMES,
  ...US_INDIGENOUS_FOLLOWUP_SAFE_CONFLICT_RENAMES,
  ...US_REVOLUTION_THIRD_FOLLOWUP_SAFE_CONFLICT_RENAMES,
  ...BRITISH_WWII_FOLLOWUP_SAFE_CONFLICT_RENAMES,
  ...US_OVERSEAS_FOLLOWUP_SAFE_CONFLICT_RENAMES,
  ...ACTIVE_AFRICA_FOLLOWUP_SAFE_CONFLICT_RENAMES,
  ...JAPAN_KOREA_FOLLOWUP_SAFE_CONFLICT_RENAMES,
  ...FRANCE_FOLLOWUP_SAFE_CONFLICT_RENAMES,
  ...US_GLOBAL_FOLLOWUP_SAFE_CONFLICT_RENAMES,
  ...BRITISH_GLOBAL_FOLLOWUP_SAFE_CONFLICT_RENAMES,
  ...PROVISIONAL_FOUNDATION_SAFE_CONFLICT_RENAMES,
  ...NORDIC_BALTIC_FOLLOWUP_SAFE_CONFLICT_RENAMES,
  ...POLISH_SWEDISH_FOLLOWUP_SAFE_CONFLICT_RENAMES,
  ...POLISH_DELUGE_FOLLOWUP_SAFE_CONFLICT_RENAMES,
  ...POLISH_DELUGE_SWEDISH_OPERATIONS_SAFE_CONFLICT_RENAMES,
  ...SWEDISH_LIVONIAN_OPERATIONS_SAFE_CONFLICT_RENAMES,
  ...FINNISH_THEATER_OPERATIONS_SAFE_CONFLICT_RENAMES,
  ...NORDIC_SOVEREIGNTY_SAFE_CONFLICT_RENAMES,
  ...GLOBAL_LANDMARKS_SAFE_CONFLICT_RENAMES,
  ...GLOBAL_HISTORICAL_OPERATIONS_SAFE_CONFLICT_RENAMES,
  ...GLOBAL_SOURCE_FOLLOWUP_SAFE_CONFLICT_RENAMES,
  ...NORDIC_ASIA_SOURCE_BATCH_SAFE_CONFLICT_RENAMES,
  ...ASIA_AFRICA_HISTORICAL_FOLLOWUP_SAFE_CONFLICT_RENAMES,
  ...EUROPEAN_HISTORICAL_FOLLOWUP_SAFE_CONFLICT_RENAMES,
  ...MARITIME_AMERICAS_FOLLOWUP_SAFE_CONFLICT_RENAMES,
  ...DEBRECEN_1944_SAFE_CONFLICT_RENAMES,
  ...PRIORITY_SAFE_BATCH_CONFLICT_RENAMES,
  ...PROVISIONAL_SOURCE_BATCH_CONFLICT_RENAMES,
  ...NORTH_ATLANTIC_PROVISIONAL_CONFLICT_RENAMES,
  ...CAMPECHE_ANTIVARI_CONFLICT_RENAMES,
  ...FLINT_DOGGER_CONFLICT_RENAMES,
  ...DASMAN_RACHADO_CONFLICT_RENAMES,
  ...BEITANG_TEACAPAN_CONFLICT_RENAMES,
  ...OSEL_VAILELE_CONFLICT_RENAMES,
  ...NEVA_SHANHAIGUAN_CONFLICT_RENAMES,
  ...GUERRERO_CONFLICT_RENAMES,
  ...HYERES_CONFLICT_RENAMES,
  ...MOCIMBOA_CONFLICT_RENAMES,
  ...BARBADOS_CONFLICT_RENAMES,
  ...CHEF_DE_CAUX_CONFLICT_RENAMES,
  ...BIR_ENZARAN_CONFLICT_RENAMES,
  ...LEBOUIRATE_CONFLICT_RENAMES,
  ...KALYAZIN_CONFLICT_RENAMES,
  ...SANTO_DOMINGO_CONFLICT_RENAMES,
  ...SANTA_LUCIA_CONFLICT_RENAMES,
  ...HIDDENSEE_CONFLICT_RENAMES,
  ...HAVANA_CONFLICT_RENAMES,
  ...JABRAYIL_CONFLICT_RENAMES,
  ...LISSA_CONFLICT_RENAMES,
  ...VIZAKNA_CONFLICT_RENAMES,
  ...SAINT_MARCOUF_CONFLICT_RENAMES,
  ...GYANAFALVA_CONFLICT_RENAMES,
  ...JUPITER_INLET_CONFLICT_RENAMES,
  ...KIRCHSCHLAG_CONFLICT_RENAMES,
  ...MAHE_CONFLICT_RENAMES,
  ...FUNDY_BAY_CONFLICT_RENAMES,
  ...LAGOS_1759_CONFLICT_RENAMES,
  ...KAIPIAIS_1789_SAFE_CONFLICT_RENAMES,
  ...TIGER_MOUTH_1809_CONFLICT_RENAMES,
  ...IMBROS_1918_CONFLICT_RENAMES,
  ...PULANG_LUPA_1900_CONFLICT_RENAMES,
  ...COCKLE_CREEK_CONFLICT_RENAMES,
  ...CLOUDS_CONFLICT_RENAMES,
  ...COLSONS_MILL_CONFLICT_RENAMES,
  ...CHILLICOTHE_CONFLICT_RENAMES,
  ...ASINARA_CONFLICT_RENAMES,
  ...BAU_CONFLICT_RENAMES,
  ...ARANAS_CONFLICT_RENAMES,
  ...ALEGRE_CONFLICT_RENAMES,
  ...COOKES_CANYON_CONFLICT_RENAMES,
  ...CZORTKOW_CONFLICT_RENAMES,
  ...DEGLEBAT_LEGLIA_CONFLICT_RENAMES,
  ...DEVILS_CREEK_CONFLICT_RENAMES,
  ...DIABLO_MOUNTAINS_CONFLICT_RENAMES,
  ...DOLORES_RIVER_CONFLICT_RENAMES,
  ...DORO_PASSAGE_CONFLICT_RENAMES,
  ...DROHICZYN_CONFLICT_RENAMES,
  ...JASK_CONFLICT_RENAMES,
  ...GOTSKA_SANDON_CONFLICT_RENAMES,
  ...PIRANO_GRADO_CONFLICT_RENAMES
};
const countryConflictAdditionBatches = [
  TRANSITION_1846_1902_COUNTRY_CONFLICT_ADDITIONS,
  US_CARIBBEAN_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  AUSTRALIA_DENMARK_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  JAPAN_KOREA_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  FRANCE_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  US_GLOBAL_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  BRITISH_GLOBAL_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  PROVISIONAL_FOUNDATION_COUNTRY_CONFLICT_ADDITIONS,
  NORDIC_BALTIC_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  POLISH_SWEDISH_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  POLISH_DELUGE_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  POLISH_DELUGE_SWEDISH_OPERATIONS_COUNTRY_CONFLICT_ADDITIONS,
  SWEDISH_LIVONIAN_OPERATIONS_COUNTRY_CONFLICT_ADDITIONS,
  FINNISH_THEATER_OPERATIONS_COUNTRY_CONFLICT_ADDITIONS,
  NORDIC_SOVEREIGNTY_COUNTRY_CONFLICT_ADDITIONS,
  GLOBAL_LANDMARKS_COUNTRY_CONFLICT_ADDITIONS,
  GLOBAL_HISTORICAL_OPERATIONS_COUNTRY_CONFLICT_ADDITIONS,
  GLOBAL_SOURCE_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  NORDIC_ASIA_SOURCE_BATCH_COUNTRY_CONFLICT_ADDITIONS,
  ASIA_AFRICA_HISTORICAL_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  EUROPEAN_HISTORICAL_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  MARITIME_AMERICAS_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  DEBRECEN_1944_COUNTRY_CONFLICT_ADDITIONS,
  PRIORITY_SAFE_BATCH_COUNTRY_CONFLICT_ADDITIONS,
  PROVISIONAL_SOURCE_BATCH_COUNTRY_CONFLICT_ADDITIONS,
  NORTH_ATLANTIC_PROVISIONAL_COUNTRY_CONFLICT_ADDITIONS,
  CAMPECHE_ANTIVARI_COUNTRY_CONFLICT_ADDITIONS,
  FLINT_DOGGER_COUNTRY_CONFLICT_ADDITIONS,
  DASMAN_RACHADO_COUNTRY_CONFLICT_ADDITIONS,
  BEITANG_TEACAPAN_COUNTRY_CONFLICT_ADDITIONS,
  OSEL_VAILELE_COUNTRY_CONFLICT_ADDITIONS,
  NEVA_SHANHAIGUAN_COUNTRY_CONFLICT_ADDITIONS,
  GUERRERO_COUNTRY_CONFLICT_ADDITIONS,
  HYERES_COUNTRY_CONFLICT_ADDITIONS,
  BARBADOS_COUNTRY_CONFLICT_ADDITIONS,
  CHEF_DE_CAUX_COUNTRY_CONFLICT_ADDITIONS,
  BIR_ENZARAN_COUNTRY_CONFLICT_ADDITIONS,
  LEBOUIRATE_COUNTRY_CONFLICT_ADDITIONS,
  KALYAZIN_COUNTRY_CONFLICT_ADDITIONS,
  SANTO_DOMINGO_COUNTRY_CONFLICT_ADDITIONS,
  SANTA_LUCIA_COUNTRY_CONFLICT_ADDITIONS,
  HIDDENSEE_COUNTRY_CONFLICT_ADDITIONS,
  HAVANA_COUNTRY_CONFLICT_ADDITIONS,
  JABRAYIL_COUNTRY_CONFLICT_ADDITIONS,
  LISSA_COUNTRY_CONFLICT_ADDITIONS,
  VIZAKNA_COUNTRY_CONFLICT_ADDITIONS,
  SAINT_MARCOUF_COUNTRY_CONFLICT_ADDITIONS,
  GYANAFALVA_COUNTRY_CONFLICT_ADDITIONS,
  JUPITER_INLET_COUNTRY_CONFLICT_ADDITIONS,
  KIRCHSCHLAG_COUNTRY_CONFLICT_ADDITIONS,
  MAHE_COUNTRY_CONFLICT_ADDITIONS,
  FUNDY_BAY_COUNTRY_CONFLICT_ADDITIONS,
  LAGOS_1759_COUNTRY_CONFLICT_ADDITIONS,
  KAIPIAIS_1789_COUNTRY_CONFLICT_ADDITIONS,
  TIGER_MOUTH_1809_COUNTRY_CONFLICT_ADDITIONS,
  IMBROS_1918_COUNTRY_CONFLICT_ADDITIONS,
  PULANG_LUPA_1900_COUNTRY_CONFLICT_ADDITIONS,
  BAU_COUNTRY_CONFLICT_ADDITIONS,
  ARANAS_COUNTRY_CONFLICT_ADDITIONS,
  ALEGRE_COUNTRY_CONFLICT_ADDITIONS,
  CZORTKOW_COUNTRY_CONFLICT_ADDITIONS,
  DEGLEBAT_LEGLIA_COUNTRY_CONFLICT_ADDITIONS,
  DOLORES_RIVER_COUNTRY_CONFLICT_ADDITIONS,
  DORO_PASSAGE_COUNTRY_CONFLICT_ADDITIONS,
  JASK_COUNTRY_CONFLICT_ADDITIONS,
  GOTSKA_SANDON_COUNTRY_CONFLICT_ADDITIONS,
  PIRANO_GRADO_COUNTRY_CONFLICT_ADDITIONS
];
const countryConflictAdditions = mergeCountryConflictBatches(countryConflictAdditionBatches);
const countryConflictExclusionBatches = [
  FLINT_DOGGER_COUNTRY_CONFLICT_EXCLUSIONS,
  DASMAN_RACHADO_COUNTRY_CONFLICT_EXCLUSIONS,
  BEITANG_TEACAPAN_COUNTRY_CONFLICT_EXCLUSIONS,
  OSEL_VAILELE_COUNTRY_CONFLICT_EXCLUSIONS,
  NEVA_SHANHAIGUAN_COUNTRY_CONFLICT_EXCLUSIONS,
  CABO_BOJADOR_COUNTRY_CONFLICT_EXCLUSIONS,
  CERRO_DEL_GALLO_COUNTRY_CONFLICT_EXCLUSIONS,
  LAGOS_1759_COUNTRY_CONFLICT_EXCLUSIONS,
  IMBROS_1918_COUNTRY_CONFLICT_EXCLUSIONS
];
const countryConflictExclusions = mergeCountryConflictBatches(countryConflictExclusionBatches);

function renameConflictName(name) {
  const cleanName = cleanConflictLabel(name);
  return safeConflictRenames[cleanName] || safeConflictRenames[name] || cleanName;
}

function isBattleLike(entry) {
  return /\b(batalla|battle|sitio|siege)\b/i.test(`${entry?.name || ""} ${entry?.type || ""}`);
}

function getConflictYear(entry) {
  if (Number.isFinite(entry?.startYear)) {
    return entry.startYear;
  }
  const match = String(entry?.name || "").match(/\b(1[4-9]\d{2}|20\d{2})\b/);
  return match ? Number(match[1]) : null;
}

function inferWorldWarBattleCuration(entry) {
  if (!entry || !isBattleLike(entry)) {
    return null;
  }

  const year = getConflictYear(entry);
  const hasParent = entry.parent || entry.war || entry.campaign || (Array.isArray(entry.related) && entry.related.length);
  const hasUsefulDetail = entry.cause || entry.outcome || entry.consequences || (Array.isArray(entry.participants) && entry.participants.length);

  if (year >= 1914 && year <= 1918) {
    return {
      parent: entry.parent || entry.war || "Primera Guerra Mundial",
      type: entry.type || (String(entry.name || "").toLowerCase().includes("sitio") ? "sitio" : "batalla"),
      scope: entry.scope || "internacional",
      region: entry.region || "Europa y teatros asociados de la Primera Guerra Mundial",
      related: [...new Set([...(entry.related || []), "Primera Guerra Mundial"].filter(Boolean))],
      ...(hasUsefulDetail ? {} : {
        cause: "Operacion militar dentro de la Primera Guerra Mundial, vinculada a la disputa de posiciones estrategicas entre los bloques beligerantes.",
        outcome: "Resultado tactico integrado en el desarrollo general del frente correspondiente.",
        consequences: "Contribuyo al desgaste militar y a la evolucion operacional de la Primera Guerra Mundial.",
        participants: [
          { side: "Aliados", members: ["Aliados de la Primera Guerra Mundial"], organizations: ["Aliados"], troops: "fuerzas variables segun el frente", casualties: "significativas o inciertas" },
          { side: "Potencias Centrales", members: ["Potencias Centrales"], organizations: ["Potencias Centrales"], troops: "fuerzas variables segun el frente", casualties: "significativas o inciertas" }
        ]
      })
    };
  }

  if (year >= 1939 && year <= 1945) {
    return {
      parent: entry.parent || entry.war || "Segunda Guerra Mundial",
      type: entry.type || (String(entry.name || "").toLowerCase().includes("sitio") ? "sitio" : "batalla"),
      scope: entry.scope || "mundial",
      region: entry.region || "Teatro de operaciones de la Segunda Guerra Mundial",
      related: [...new Set([...(entry.related || []), "Segunda Guerra Mundial"].filter(Boolean))],
      ...(hasUsefulDetail ? {} : {
        cause: "Operacion militar dentro de la Segunda Guerra Mundial, ligada al control de posiciones, rutas o territorios estrategicos.",
        outcome: "Resultado tactico integrado en la campana correspondiente de la Segunda Guerra Mundial.",
        consequences: "Influyo en el avance, desgaste o reordenamiento operacional de las fuerzas beligerantes.",
        participants: [
          { side: "Aliados", members: ["Aliados de la Segunda Guerra Mundial"], organizations: ["Aliados"], troops: "fuerzas variables segun la campana", casualties: "significativas o inciertas" },
          { side: "Eje", members: ["Potencias del Eje"], organizations: ["Eje"], troops: "fuerzas variables segun la campana", casualties: "significativas o inciertas" }
        ]
      })
    };
  }

  return null;
}

function formatParticipantSide(participant, index) {
  const members = Array.isArray(participant?.members) ? participant.members.filter(Boolean) : [];
  const organizations = Array.isArray(participant?.organizations) ? participant.organizations.filter(Boolean) : [];
  const source = members.length ? members : organizations;

  if (source.length) {
    const label = source.slice(0, 3).join(", ");
    return source.length > 3 ? `${label} y aliados` : label;
  }

  return index === 0 ? "Parte beligerante principal" : `Parte beligerante ${index + 1}`;
}

function normalizeParticipantSides(detail) {
  if (!Array.isArray(detail?.participants)) {
    return detail;
  }

  return {
    ...detail,
    participants: detail.participants.map((participant, index) => {
      if (!/^Bando\s+\d+$/i.test(String(participant?.side || "").trim())) {
        return participant;
      }
      return {
        ...participant,
        side: formatParticipantSide(participant, index)
      };
    })
  };
}

function normalizeConflictEntry(entry) {
  return normalizeConflictEntryWithContext(entry, {});
}

function buildGeneratedHierarchyMap(generatedDetails = {}) {
  const conflicts = generatedDetails.conflicts || generatedDetails;
  const map = new Map();
  for (const [rawName, detail] of Object.entries(conflicts || {})) {
    const parent = detail?.parent || detail?.war || "";
    const campaign = detail?.campaign || "";
    const specificParent = parent && !isProvisionalConflictHierarchy({ parent }) ? parent : "";
    const specificCampaign = campaign && !isProvisionalConflictHierarchy({ campaign }) ? campaign : "";
    if (!specificParent && !specificCampaign) continue;
    map.set(normalizeConflictKey(renameConflictName(detail?.pageTitle || rawName)), {
      ...(specificParent ? { parent: specificParent, war: specificParent } : {}),
      ...(specificCampaign ? { campaign: specificCampaign } : {})
    });
  }
  return map;
}

function getGeneratedHierarchyPatch(entry = {}, generatedHierarchyByConflict = new Map()) {
  const imported = generatedHierarchyByConflict.get(normalizeConflictKey(entry.name));
  if (!imported) return {};
  const currentParent = entry.parent || entry.war || "";
  const currentCampaign = entry.campaign || "";
  const patch = {};
  if ((!currentParent || isProvisionalConflictHierarchy({ parent: currentParent })) && imported.parent) {
    patch.parent = imported.parent;
    patch.war = imported.war || imported.parent;
  }
  if ((!currentCampaign || isProvisionalConflictHierarchy({ campaign: currentCampaign })) && imported.campaign) {
    patch.campaign = imported.campaign;
  }
  return patch;
}

function normalizeConflictEntryWithContext(entry, context) {
  if (!entry || typeof entry !== "object") {
    return entry;
  }
  const renamedEntry = {
    ...entry,
    name: renameConflictName(entry.name)
  };
  renamedEntry.name = getContextualConflictName(renamedEntry);
  const inferredCuration = inferWorldWarBattleCuration(renamedEntry);
  const importedHierarchy = getGeneratedHierarchyPatch(renamedEntry, context.generatedHierarchyByConflict);
  const curatedDetailFix = curatedConflictDetailFixes[renamedEntry.name] || {};
  const curatedEntry = {
    ...renamedEntry,
    ...(inferredCuration || {}),
    ...importedHierarchy,
    ...curatedDetailFix
  };
  return normalizeVisibleValue(curateConflictEntry(curatedEntry, context));
}

function getCountryConflictAdditions(country) {
  return getCountryConflictNames(countryConflictAdditions, country?.name)
    .map(name => ({ name, ...(curatedConflictDetailFixes[name] || {}) }));
}

function getCountryConflictExclusions(country) {
  return new Set(
    getCountryConflictNames(countryConflictExclusions, country?.name)
      .map(name => renameConflictName(name))
  );
}

function isExcludedCountryConflict(entry, exclusions) {
  const name = typeof entry === "string" ? entry : entry?.name;
  return exclusions.has(renameConflictName(name));
}

function fixCountryConflicts(country, countriesByConflict, generatedHierarchyByConflict) {
  let changed = 0;
  const context = { country, countriesByConflict, generatedHierarchyByConflict };
  const additions = getCountryConflictAdditions(country);
  const exclusions = getCountryConflictExclusions(country);

  for (const pathKey of ["conflicts"]) {
    if (!Array.isArray(country[pathKey])) {
      continue;
    }
    const before = country[pathKey];
    const updated = normalizeVisibleValue(
      mergeConflictEntries([...before, ...additions]
        .filter(entry => !isExcludedCountryConflict(entry, exclusions))
        .map(entry => normalizeConflictEntryWithContext(entry, context)))
        .sort((a, b) => (a.startYear ?? 99999) - (b.startYear ?? 99999) || String(a.name).localeCompare(String(b.name), "es"))
    );
    if (!areJsonValuesEquivalent(updated, before)) {
      country[pathKey] = updated;
      changed += 1;
    }
  }

  if (Array.isArray(country.military?.conflicts)) {
    const before = country.military.conflicts;
    const updated = normalizeVisibleValue(
      mergeConflictEntries([...before, ...additions]
        .filter(entry => !isExcludedCountryConflict(entry, exclusions))
        .map(entry => normalizeConflictEntryWithContext(entry, context)))
        .sort((a, b) => (a.startYear ?? 99999) - (b.startYear ?? 99999) || String(a.name).localeCompare(String(b.name), "es"))
    );
    if (!areJsonValuesEquivalent(updated, before)) {
      country.military.conflicts = updated;
      changed += 1;
    }
  }

  return changed;
}

async function fixCountriesFile(filePath, countriesByConflict, generatedHierarchyByConflict) {
  const data = await readJsonWithRetry(filePath);
  let changedCountries = 0;

  if (data.name) {
    changedCountries += fixCountryConflicts(data, countriesByConflict, generatedHierarchyByConflict) ? 1 : 0;
  } else {
    for (const country of Object.values(data)) {
      changedCountries += fixCountryConflicts(country, countriesByConflict, generatedHierarchyByConflict) ? 1 : 0;
    }
  }

  if (changedCountries) {
    await writeJsonIfChanged(filePath, data, { spaces: 0 });
  }

  return changedCountries;
}

async function fixGeneratedDetails(countriesByConflict) {
  const generated = await readJsonWithRetry(generatedDetailsPath);
  const currentText = await fs.readFile(generatedDetailsPath, "utf8");
  const conflicts = generated.conflicts || generated;
  let renamed = 0;
  let enriched = 0;
  let retired = 0;
  let changed = false;

  for (const name of Object.keys(conflicts)) {
    if (!generatedConflictDetailExclusions.has(normalizeConflictKey(name))) {
      continue;
    }
    delete conflicts[name];
    retired += 1;
    changed = true;
  }

  for (const [from, to] of Object.entries(safeConflictRenames)) {
    if (from !== to && conflicts[from]) {
      const merged = {
        ...(conflicts[from] || {}),
        ...(conflicts[to] || {}),
        pageTitle: to
      };
      if (!areJsonValuesEquivalent(conflicts[to], merged)) {
        conflicts[to] = merged;
      }
      delete conflicts[from];
      renamed += 1;
      changed = true;
    }
  }

  for (const [rawName, detail] of Object.entries(curatedConflictDetailFixes)) {
    const name = getContextualConflictName({ name: renameConflictName(rawName), ...detail });
    const current = conflicts[name] || {};
    const updated = normalizeVisibleValue({
      ...current,
      ...detail,
      source: current.source || "Curaduria GeoRisk",
      pageTitle: name
    });
    if (!areJsonValuesEquivalent(current, updated)) {
      conflicts[name] = updated;
      enriched += 1;
      changed = true;
    }
    if (rawName !== name && conflicts[rawName]) {
      delete conflicts[rawName];
      renamed += 1;
      changed = true;
    }
  }

  for (const [name, detail] of Object.entries(conflicts)) {
    const curated = curateConflictDetail(name, normalizeParticipantSides(detail), { countriesByConflict });
    const finalName = renameConflictName(curated.name);
    const normalized = normalizeVisibleValue({ ...curated, name: undefined });
    delete normalized.name;
    if (finalName !== name) {
      const updated = normalizeVisibleValue({
        ...(conflicts[finalName] || {}),
        ...normalized,
        pageTitle: finalName
      });
      if (!areJsonValuesEquivalent(conflicts[finalName], updated)) {
        conflicts[finalName] = updated;
      }
      delete conflicts[name];
      renamed += 1;
      enriched += 1;
      changed = true;
    } else if (!areJsonValuesEquivalent(normalized, detail)) {
      conflicts[name] = normalized;
      enriched += 1;
      changed = true;
    }
  }

  const written = changed
    ? await writeJsonIfChanged(generatedDetailsPath, generated, { spaces: 0 })
    : false;
  const compacted = !written && currentText.trimEnd().includes("\n");
  if (compacted) {
    await writeJsonWithRetry(generatedDetailsPath, generated, { spaces: 0 });
  }
  return written
    ? { renamed, enriched, retired, written, compacted: false }
    : { renamed: 0, enriched: 0, retired: 0, written, compacted };
}

let changedFullCountries = 0;
let countriesByConflict = new Map();
const generatedHierarchyByConflict = buildGeneratedHierarchyMap(await readJsonWithRetry(generatedDetailsPath));
const fullPassChanges = [];
for (let pass = 0; pass < 8; pass += 1) {
  const fullCountries = await readJsonWithRetry(fullPath);
  countriesByConflict = collectConflictCountryNames(fullCountries);
  const changedThisPass = await fixCountriesFile(fullPath, countriesByConflict, generatedHierarchyByConflict);
  fullPassChanges.push(changedThisPass);
  changedFullCountries += changedThisPass;
  if (!changedThisPass) break;
}
if (fullPassChanges.at(-1) !== 0) {
  throw new Error(`La curaduria de countries_full no convergio: ${fullPassChanges.join(", ")}`);
}
countriesByConflict = collectConflictCountryNames(await readJsonWithRetry(fullPath));
const detailStats = await fixGeneratedDetails(countriesByConflict);

const report = {
  generatedAt: new Date().toISOString(),
  changedFullCountries,
  fullPassChanges,
  compactCountryFilesStrategy: "regenerated-by-buildDataIndexes",
  detailStats,
  generatedHierarchyCandidates: generatedHierarchyByConflict.size,
  countryConflictAdditions,
  countryConflictExclusions,
  generatedConflictDetailExclusions: generatedConflictDetailExclusionNames,
  safeRenames: safeConflictRenames,
  curatedDetails: [...new Set(Object.keys(curatedConflictDetailFixes).map(renameConflictName))]
};

await fs.ensureDir(path.dirname(reportPath));
await writeJsonWithRetry(reportPath, report, { spaces: 2 });

console.log(`Paises actualizados en countries_full: ${changedFullCountries}`);
console.log("Fichas compactas: se regeneran una sola vez con build:indexes");
console.log(`Detalles renombrados: ${detailStats.renamed}`);
console.log(`Detalles enriquecidos: ${detailStats.enriched}`);
console.log(`Detalles retirados: ${detailStats.retired}`);
console.log(`Reporte: ${path.relative(projectRoot, reportPath)}`);
