import assert from "node:assert/strict";
import { SAFE_CONFLICT_RENAMES, CURATED_CONFLICT_DETAIL_FIXES } from "../lib/conflict-autofix-rules.js";
import { WWII_1942_CONFLICT_DETAIL_FIXES, WWII_1942_SAFE_CONFLICT_RENAMES } from "../lib/conflict-curation-1942.js";
import { getContextualConflictName, THEATER_CONFLICT_DETAIL_FIXES, THEATER_SAFE_CONFLICT_RENAMES } from "../lib/conflict-curation-theater.js";
import {
  VISIBLE_MODERN_CONFLICT_DETAIL_FIXES,
  VISIBLE_MODERN_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-visible-modern.js";
import {
  VISIBLE_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  VISIBLE_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-visible-followup.js";
import {
  KOREA_MODERN_CONFLICT_DETAIL_FIXES,
  KOREA_MODERN_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-korea-modern.js";
import {
  HISTORICAL_VIETNAM_CONFLICT_DETAIL_FIXES,
  HISTORICAL_VIETNAM_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-historical-vietnam.js";
import {
  POSTWAR_1970_1991_CONFLICT_DETAIL_FIXES,
  POSTWAR_1970_1991_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-1970-1991.js";
import {
  MODERN_1992_2021_CONFLICT_DETAIL_FIXES,
  MODERN_1992_2021_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-1992-2021.js";
import {
  UNDATED_AMERICAS_CONFLICT_DETAIL_FIXES,
  UNDATED_AMERICAS_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-undated-americas.js";
import {
  REVOLUTION_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  REVOLUTION_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-revolution-followup.js";
import {
  TRANSITION_1846_1902_COUNTRY_CONFLICT_ADDITIONS,
  TRANSITION_1846_1902_CONFLICT_DETAIL_FIXES,
  TRANSITION_1846_1902_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-1846-1902.js";
import {
  WAR_1812_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  WAR_1812_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-war-1812-followup.js";
import {
  US_CIVIL_WAR_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  US_CIVIL_WAR_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-us-civil-war-followup.js";
import {
  US_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  US_WWII_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-us-wwii-followup.js";
import {
  US_INDIAN_WARS_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  US_INDIAN_WARS_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-us-indian-wars-followup.js";
import {
  US_FRONTIER_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  US_FRONTIER_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-us-frontier-followup.js";
import {
  US_FRONTIER_SECOND_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  US_FRONTIER_SECOND_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-us-frontier-second-followup.js";
import {
  US_CARIBBEAN_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  US_CARIBBEAN_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  US_CARIBBEAN_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-us-caribbean-followup.js";
import {
  AUSTRALIA_DENMARK_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  AUSTRALIA_DENMARK_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  AUSTRALIA_DENMARK_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-australia-denmark-followup.js";
import {
  US_INDIGENOUS_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  US_INDIGENOUS_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-us-indigenous-followup.js";
import {
  US_REVOLUTION_THIRD_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  US_REVOLUTION_THIRD_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-us-revolution-third-followup.js";
import {
  BRITISH_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  BRITISH_WWII_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-british-wwii-followup.js";
import {
  US_OVERSEAS_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  US_OVERSEAS_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-us-overseas-followup.js";
import {
  ACTIVE_AFRICA_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ACTIVE_AFRICA_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-active-africa-followup.js";
import {
  JAPAN_KOREA_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  JAPAN_KOREA_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  JAPAN_KOREA_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-japan-korea-followup.js";
import {
  FRANCE_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  FRANCE_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  FRANCE_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-france-followup.js";
import {
  US_GLOBAL_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  US_GLOBAL_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  US_GLOBAL_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-us-global-followup.js";
import {
  BRITISH_GLOBAL_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  BRITISH_GLOBAL_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  BRITISH_GLOBAL_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-british-global-followup.js";
import {
  PROVISIONAL_FOUNDATION_CONFLICT_DETAIL_FIXES,
  PROVISIONAL_FOUNDATION_COUNTRY_CONFLICT_ADDITIONS,
  PROVISIONAL_FOUNDATION_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-provisional-foundation.js";
import {
  NORDIC_BALTIC_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  NORDIC_BALTIC_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  NORDIC_BALTIC_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-nordic-baltic-followup.js";
import {
  POLISH_SWEDISH_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  POLISH_SWEDISH_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  POLISH_SWEDISH_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-polish-swedish-followup.js";
import {
  POLISH_DELUGE_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  POLISH_DELUGE_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  POLISH_DELUGE_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-polish-deluge-followup.js";
import {
  POLISH_DELUGE_SWEDISH_OPERATIONS_CONFLICT_DETAIL_FIXES,
  POLISH_DELUGE_SWEDISH_OPERATIONS_COUNTRY_CONFLICT_ADDITIONS,
  POLISH_DELUGE_SWEDISH_OPERATIONS_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-polish-deluge-swedish-operations.js";
import {
  SWEDISH_LIVONIAN_OPERATIONS_CONFLICT_DETAIL_FIXES,
  SWEDISH_LIVONIAN_OPERATIONS_COUNTRY_CONFLICT_ADDITIONS,
  SWEDISH_LIVONIAN_OPERATIONS_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-swedish-livonian-operations.js";
import {
  FINNISH_THEATER_OPERATIONS_CONFLICT_DETAIL_FIXES,
  FINNISH_THEATER_OPERATIONS_COUNTRY_CONFLICT_ADDITIONS,
  FINNISH_THEATER_OPERATIONS_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-finnish-theater-operations.js";
import {
  NORDIC_SOVEREIGNTY_CONFLICT_DETAIL_FIXES,
  NORDIC_SOVEREIGNTY_COUNTRY_CONFLICT_ADDITIONS,
  NORDIC_SOVEREIGNTY_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-nordic-sovereignty.js";
import {
  GLOBAL_LANDMARKS_CONFLICT_DETAIL_FIXES,
  GLOBAL_LANDMARKS_COUNTRY_CONFLICT_ADDITIONS,
  GLOBAL_LANDMARKS_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-global-landmarks.js";
import {
  GLOBAL_HISTORICAL_OPERATIONS_CONFLICT_DETAIL_FIXES,
  GLOBAL_HISTORICAL_OPERATIONS_COUNTRY_CONFLICT_ADDITIONS,
  GLOBAL_HISTORICAL_OPERATIONS_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-global-historical-operations.js";
import {
  GLOBAL_SOURCE_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  GLOBAL_SOURCE_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  GLOBAL_SOURCE_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-global-source-followup.js";
import {
  NORDIC_ASIA_SOURCE_BATCH_CONFLICT_DETAIL_FIXES,
  NORDIC_ASIA_SOURCE_BATCH_COUNTRY_CONFLICT_ADDITIONS,
  NORDIC_ASIA_SOURCE_BATCH_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-nordic-asia-source-batch.js";
import {
  ASIA_AFRICA_HISTORICAL_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  ASIA_AFRICA_HISTORICAL_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  ASIA_AFRICA_HISTORICAL_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-asia-africa-historical-followup.js";
import {
  EUROPEAN_HISTORICAL_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  EUROPEAN_HISTORICAL_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  EUROPEAN_HISTORICAL_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-european-historical-followup.js";
import {
  MARITIME_AMERICAS_FOLLOWUP_CONFLICT_DETAIL_FIXES,
  MARITIME_AMERICAS_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS,
  MARITIME_AMERICAS_FOLLOWUP_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-maritime-americas-followup.js";
import {
  DEBRECEN_1944_CONFLICT_DETAIL_FIXES,
  DEBRECEN_1944_COUNTRY_CONFLICT_ADDITIONS,
  DEBRECEN_1944_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-debrecen-1944.js";
import {
  PRIORITY_SAFE_BATCH_CONFLICT_DETAIL_FIXES,
  PRIORITY_SAFE_BATCH_COUNTRY_CONFLICT_ADDITIONS,
  PRIORITY_SAFE_BATCH_CONFLICT_RENAMES
} from "../lib/conflict-curation-priority-safe-batch.js";
import {
  PROVISIONAL_SOURCE_BATCH_CONFLICT_DETAIL_FIXES,
  PROVISIONAL_SOURCE_BATCH_COUNTRY_CONFLICT_ADDITIONS,
  PROVISIONAL_SOURCE_BATCH_CONFLICT_RENAMES
} from "../lib/conflict-curation-provisional-source-batch.js";
import {
  NORTH_ATLANTIC_PROVISIONAL_CONFLICT_DETAIL_FIXES,
  NORTH_ATLANTIC_PROVISIONAL_COUNTRY_CONFLICT_ADDITIONS,
  NORTH_ATLANTIC_PROVISIONAL_CONFLICT_RENAMES
} from "../lib/conflict-curation-north-atlantic-provisional.js";
import {
  CAMPECHE_ANTIVARI_CONFLICT_DETAIL_FIXES,
  CAMPECHE_ANTIVARI_COUNTRY_CONFLICT_ADDITIONS,
  CAMPECHE_ANTIVARI_CONFLICT_RENAMES
} from "../lib/conflict-curation-campeche-antivari.js";
import {
  FLINT_DOGGER_CONFLICT_DETAIL_FIXES,
  FLINT_DOGGER_COUNTRY_CONFLICT_ADDITIONS,
  FLINT_DOGGER_COUNTRY_CONFLICT_EXCLUSIONS,
  FLINT_DOGGER_CONFLICT_RENAMES
} from "../lib/conflict-curation-flint-dogger.js";
import {
  DASMAN_RACHADO_CONFLICT_DETAIL_FIXES,
  DASMAN_RACHADO_COUNTRY_CONFLICT_ADDITIONS,
  DASMAN_RACHADO_COUNTRY_CONFLICT_EXCLUSIONS,
  DASMAN_RACHADO_CONFLICT_RENAMES
} from "../lib/conflict-curation-dasman-rachado.js";
import {
  BEITANG_TEACAPAN_CONFLICT_DETAIL_FIXES,
  BEITANG_TEACAPAN_COUNTRY_CONFLICT_ADDITIONS,
  BEITANG_TEACAPAN_COUNTRY_CONFLICT_EXCLUSIONS,
  BEITANG_TEACAPAN_CONFLICT_RENAMES
} from "../lib/conflict-curation-beitang-teacapan.js";
import {
  OSEL_VAILELE_CONFLICT_DETAIL_FIXES,
  OSEL_VAILELE_COUNTRY_CONFLICT_ADDITIONS,
  OSEL_VAILELE_COUNTRY_CONFLICT_EXCLUSIONS,
  OSEL_VAILELE_CONFLICT_RENAMES
} from "../lib/conflict-curation-osel-vailele.js";
import {
  NEVA_SHANHAIGUAN_CONFLICT_DETAIL_FIXES,
  NEVA_SHANHAIGUAN_COUNTRY_CONFLICT_ADDITIONS,
  NEVA_SHANHAIGUAN_COUNTRY_CONFLICT_EXCLUSIONS,
  NEVA_SHANHAIGUAN_CONFLICT_RENAMES
} from "../lib/conflict-curation-neva-shanhaiguan.js";
import {
  GUERRERO_CONFLICT_DETAIL_FIXES,
  GUERRERO_COUNTRY_CONFLICT_ADDITIONS,
  GUERRERO_CONFLICT_RENAMES
} from "../lib/conflict-curation-guerrero.js";
import {
  HYERES_CONFLICT_DETAIL_FIXES,
  HYERES_COUNTRY_CONFLICT_ADDITIONS,
  HYERES_CONFLICT_RENAMES
} from "../lib/conflict-curation-hyeres.js";
import {
  MOCIMBOA_CONFLICT_DETAIL_FIXES,
  MOCIMBOA_CONFLICT_RENAMES
} from "../lib/conflict-curation-mocimboa.js";
import {
  BARBADOS_CONFLICT_DETAIL_FIXES,
  BARBADOS_COUNTRY_CONFLICT_ADDITIONS,
  BARBADOS_CONFLICT_RENAMES
} from "../lib/conflict-curation-barbados.js";
import {
  CHEF_DE_CAUX_CONFLICT_DETAIL_FIXES,
  CHEF_DE_CAUX_COUNTRY_CONFLICT_ADDITIONS,
  CHEF_DE_CAUX_CONFLICT_RENAMES
} from "../lib/conflict-curation-chef-de-caux.js";
import {
  BIR_ENZARAN_CONFLICT_DETAIL_FIXES,
  BIR_ENZARAN_COUNTRY_CONFLICT_ADDITIONS,
  BIR_ENZARAN_CONFLICT_RENAMES
} from "../lib/conflict-curation-bir-enzaran.js";
import {
  LEBOUIRATE_CONFLICT_DETAIL_FIXES,
  LEBOUIRATE_COUNTRY_CONFLICT_ADDITIONS,
  LEBOUIRATE_CONFLICT_RENAMES
} from "../lib/conflict-curation-lebouirate.js";
import {
  KALYAZIN_CONFLICT_DETAIL_FIXES,
  KALYAZIN_COUNTRY_CONFLICT_ADDITIONS,
  KALYAZIN_CONFLICT_RENAMES
} from "../lib/conflict-curation-kalyazin.js";
import {
  SANTO_DOMINGO_CONFLICT_DETAIL_FIXES,
  SANTO_DOMINGO_COUNTRY_CONFLICT_ADDITIONS,
  SANTO_DOMINGO_CONFLICT_RENAMES
} from "../lib/conflict-curation-santo-domingo.js";
import {
  SANTA_LUCIA_CONFLICT_DETAIL_FIXES,
  SANTA_LUCIA_COUNTRY_CONFLICT_ADDITIONS,
  SANTA_LUCIA_CONFLICT_RENAMES
} from "../lib/conflict-curation-santa-lucia.js";
import {
  HIDDENSEE_CONFLICT_DETAIL_FIXES,
  HIDDENSEE_COUNTRY_CONFLICT_ADDITIONS,
  HIDDENSEE_CONFLICT_RENAMES
} from "../lib/conflict-curation-hiddensee.js";
import {
  HAVANA_CONFLICT_DETAIL_FIXES,
  HAVANA_COUNTRY_CONFLICT_ADDITIONS,
  HAVANA_CONFLICT_RENAMES
} from "../lib/conflict-curation-havana.js";
import {
  JABRAYIL_CONFLICT_DETAIL_FIXES,
  JABRAYIL_COUNTRY_CONFLICT_ADDITIONS,
  JABRAYIL_CONFLICT_RENAMES
} from "../lib/conflict-curation-jabrayil.js";
import {
  LISSA_CONFLICT_DETAIL_FIXES,
  LISSA_COUNTRY_CONFLICT_ADDITIONS,
  LISSA_CONFLICT_RENAMES
} from "../lib/conflict-curation-lissa.js";
import {
  VIZAKNA_CONFLICT_DETAIL_FIXES,
  VIZAKNA_COUNTRY_CONFLICT_ADDITIONS,
  VIZAKNA_CONFLICT_RENAMES
} from "../lib/conflict-curation-vizakna.js";
import {
  SAINT_MARCOUF_CONFLICT_DETAIL_FIXES,
  SAINT_MARCOUF_COUNTRY_CONFLICT_ADDITIONS,
  SAINT_MARCOUF_CONFLICT_RENAMES
} from "../lib/conflict-curation-saint-marcouf.js";
import {
  GYANAFALVA_CONFLICT_DETAIL_FIXES,
  GYANAFALVA_COUNTRY_CONFLICT_ADDITIONS,
  GYANAFALVA_CONFLICT_RENAMES
} from "../lib/conflict-curation-gyanafalva.js";
import {
  JUPITER_INLET_CONFLICT_DETAIL_FIXES,
  JUPITER_INLET_COUNTRY_CONFLICT_ADDITIONS,
  JUPITER_INLET_CONFLICT_RENAMES
} from "../lib/conflict-curation-jupiter-inlet.js";
import {
  KIRCHSCHLAG_CONFLICT_DETAIL_FIXES,
  KIRCHSCHLAG_COUNTRY_CONFLICT_ADDITIONS,
  KIRCHSCHLAG_CONFLICT_RENAMES
} from "../lib/conflict-curation-kirchschlag.js";
import {
  MAHE_CONFLICT_DETAIL_FIXES,
  MAHE_COUNTRY_CONFLICT_ADDITIONS,
  MAHE_CONFLICT_RENAMES
} from "../lib/conflict-curation-mahe.js";
import {
  FUNDY_BAY_CONFLICT_DETAIL_FIXES,
  FUNDY_BAY_COUNTRY_CONFLICT_ADDITIONS,
  FUNDY_BAY_CONFLICT_RENAMES
} from "../lib/conflict-curation-fundy-bay.js";
import {
  LAGOS_1759_CONFLICT_DETAIL_FIXES,
  LAGOS_1759_COUNTRY_CONFLICT_ADDITIONS,
  LAGOS_1759_COUNTRY_CONFLICT_EXCLUSIONS,
  LAGOS_1759_GENERATED_DETAIL_EXCLUSIONS,
  LAGOS_1759_CONFLICT_RENAMES
} from "../lib/conflict-curation-lagos-1759.js";
import {
  KAIPIAIS_1789_CONFLICT_DETAIL_FIXES,
  KAIPIAIS_1789_COUNTRY_CONFLICT_ADDITIONS,
  KAIPIAIS_1789_SAFE_CONFLICT_RENAMES
} from "../lib/conflict-curation-kaipiais-1789.js";
import {
  TIGER_MOUTH_1809_CONFLICT_DETAIL_FIXES,
  TIGER_MOUTH_1809_COUNTRY_CONFLICT_ADDITIONS,
  TIGER_MOUTH_1809_CONFLICT_RENAMES
} from "../lib/conflict-curation-tiger-mouth-1809.js";
import {
  IMBROS_1918_CONFLICT_DETAIL_FIXES,
  IMBROS_1918_COUNTRY_CONFLICT_ADDITIONS,
  IMBROS_1918_COUNTRY_CONFLICT_EXCLUSIONS,
  IMBROS_1918_CONFLICT_RENAMES
} from "../lib/conflict-curation-imbros-1918.js";
import {
  PULANG_LUPA_1900_CONFLICT_DETAIL_FIXES,
  PULANG_LUPA_1900_COUNTRY_CONFLICT_ADDITIONS,
  PULANG_LUPA_1900_CONFLICT_RENAMES
} from "../lib/conflict-curation-pulang-lupa-1900.js";
import {
  MARSHES_1984_CONFLICT_DETAIL_FIXES,
  MARSHES_1984_COUNTRY_CONFLICT_ADDITIONS,
  MARSHES_1984_CONFLICT_RENAMES
} from "../lib/conflict-curation-marshes-1984.js";
import {
  STEGEBORG_1598_CONFLICT_DETAIL_FIXES,
  STEGEBORG_1598_COUNTRY_CONFLICT_ADDITIONS,
  STEGEBORG_1598_CONFLICT_RENAMES
} from "../lib/conflict-curation-stegeborg-1598.js";
import {
  RAKVERE_1603_CONFLICT_DETAIL_FIXES,
  RAKVERE_1603_COUNTRY_CONFLICT_ADDITIONS,
  RAKVERE_1603_CONFLICT_RENAMES
} from "../lib/conflict-curation-rakvere-1603.js";
import {
  HREBIONKA_1920_CONFLICT_DETAIL_FIXES,
  HREBIONKA_1920_COUNTRY_CONFLICT_ADDITIONS,
  HREBIONKA_1920_CONFLICT_RENAMES
} from "../lib/conflict-curation-hrebionka-1920.js";
import {
  KAMANI_1993_CONFLICT_DETAIL_FIXES,
  KAMANI_1993_CONFLICT_RENAMES
} from "../lib/conflict-curation-kamani-1993.js";
import {
  CEDAR_MOUNTAIN_1862_CONFLICT_DETAIL_FIXES,
  CEDAR_MOUNTAIN_1862_COUNTRY_CONFLICT_ADDITIONS,
  CEDAR_MOUNTAIN_1862_CONFLICT_RENAMES
} from "../lib/conflict-curation-cedar-mountain-1862.js";
import {
  MANI_MANI_1898_CONFLICT_DETAIL_FIXES,
  MANI_MANI_1898_COUNTRY_CONFLICT_ADDITIONS,
  MANI_MANI_1898_CONFLICT_RENAMES
} from "../lib/conflict-curation-mani-mani-1898.js";
import {
  MOUNT_GRAY_1864_CONFLICT_DETAIL_FIXES,
  MOUNT_GRAY_1864_COUNTRY_CONFLICT_ADDITIONS,
  MOUNT_GRAY_1864_CONFLICT_RENAMES
} from "../lib/conflict-curation-mount-gray-1864.js";
import {
  MIMBRES_RIVER_1860_CONFLICT_DETAIL_FIXES,
  MIMBRES_RIVER_1860_COUNTRY_CONFLICT_ADDITIONS,
  MIMBRES_RIVER_1860_CONFLICT_RENAMES
} from "../lib/conflict-curation-mimbres-river-1860.js";
import {
  FLORIDA_MOUNTAINS_1861_CONFLICT_DETAIL_FIXES,
  FLORIDA_MOUNTAINS_1861_COUNTRY_CONFLICT_ADDITIONS,
  FLORIDA_MOUNTAINS_1861_CONFLICT_RENAMES
} from "../lib/conflict-curation-florida-mountains-1861.js";
import {
  ILE_RONDE_1794_CONFLICT_DETAIL_FIXES,
  ILE_RONDE_1794_COUNTRY_CONFLICT_ADDITIONS,
  ILE_RONDE_1794_CONFLICT_RENAMES,
  ILE_RONDE_1794_CONFLICT_REFERENCE_RENAMES
} from "../lib/conflict-curation-ile-ronde-1794.js";
import {
  DRAGOON_SPRINGS_1862_CONFLICT_DETAIL_FIXES,
  DRAGOON_SPRINGS_1862_COUNTRY_CONFLICT_ADDITIONS,
  DRAGOON_SPRINGS_1862_CONFLICT_RENAMES
} from "../lib/conflict-curation-dragoon-springs-1862.js";
import {
  LITTLE_DRY_CREEK_1885_CONFLICT_DETAIL_FIXES,
  LITTLE_DRY_CREEK_1885_COUNTRY_CONFLICT_ADDITIONS,
  LITTLE_DRY_CREEK_1885_CONFLICT_RENAMES
} from "../lib/conflict-curation-little-dry-creek-1885.js";
import {
  FAYETTEVILLE_1863_CONFLICT_DETAIL_FIXES,
  FAYETTEVILLE_1863_COUNTRY_CONFLICT_ADDITIONS,
  FAYETTEVILLE_1863_CONFLICT_RENAMES
} from "../lib/conflict-curation-fayetteville-1863.js";
import {
  OSTRODA_1628_CONFLICT_DETAIL_FIXES,
  OSTRODA_1628_COUNTRY_CONFLICT_ADDITIONS,
  OSTRODA_1628_CONFLICT_RENAMES
} from "../lib/conflict-curation-ostroda-1628.js";
import {
  MONA_PASSAGE_1782_CONFLICT_DETAIL_FIXES,
  MONA_PASSAGE_1782_COUNTRY_CONFLICT_ADDITIONS,
  MONA_PASSAGE_1782_CONFLICT_RENAMES
} from "../lib/conflict-curation-mona-passage-1782.js";
import {
  NEUVILLE_1760_CONFLICT_DETAIL_FIXES,
  NEUVILLE_1760_COUNTRY_CONFLICT_ADDITIONS,
  NEUVILLE_1760_COUNTRY_CONFLICT_EXCLUSIONS,
  NEUVILLE_1760_CONFLICT_RENAMES
} from "../lib/conflict-curation-neuville-1760.js";
import {
  ORFORD_NESS_1704_CONFLICT_DETAIL_FIXES,
  ORFORD_NESS_1704_COUNTRY_CONFLICT_ADDITIONS,
  ORFORD_NESS_1704_CONFLICT_RENAMES
} from "../lib/conflict-curation-orford-ness-1704.js";
import {
  NEWRY_ROAD_1993_CONFLICT_DETAIL_FIXES,
  NEWRY_ROAD_1993_CONFLICT_RENAMES
} from "../lib/conflict-curation-newry-road-1993.js";
import {
  CALLAO_1866_CONFLICT_DETAIL_FIXES,
  CALLAO_1866_COUNTRY_CONFLICT_ADDITIONS,
  CALLAO_1866_CONFLICT_RENAMES
} from "../lib/conflict-curation-callao-1866.js";
import {
  LAKE_PEI_PUS_1242_CONFLICT_DETAIL_FIXES,
  LAKE_PEI_PUS_1242_COUNTRY_CONFLICT_ADDITIONS,
  LAKE_PEI_PUS_1242_COUNTRY_CONFLICT_EXCLUSIONS,
  LAKE_PEI_PUS_1242_CONFLICT_RENAMES
} from "../lib/conflict-curation-lake-peipus-1242.js";
import {
  VIZAGAPATAM_1804_CONFLICT_DETAIL_FIXES,
  VIZAGAPATAM_1804_COUNTRY_CONFLICT_ADDITIONS,
  VIZAGAPATAM_1804_CONFLICT_RENAMES
} from "../lib/conflict-curation-vizagapatam-1804.js";
import {
  YERBA_BUENA_1846_CONFLICT_DETAIL_FIXES,
  YERBA_BUENA_1846_COUNTRY_CONFLICT_ADDITIONS,
  YERBA_BUENA_1846_CONFLICT_RENAMES
} from "../lib/conflict-curation-yerba-buena-1846.js";
import {
  CAPE_LIZARD_1707_CONFLICT_DETAIL_FIXES,
  CAPE_LIZARD_1707_COUNTRY_CONFLICT_ADDITIONS,
  CAPE_LIZARD_1707_CONFLICT_RENAMES
} from "../lib/conflict-curation-cape-lizard-1707.js";
import {
  PONDICHERRY_1759_CONFLICT_DETAIL_FIXES,
  PONDICHERRY_1759_COUNTRY_CONFLICT_ADDITIONS,
  PONDICHERRY_1759_CONFLICT_RENAMES
} from "../lib/conflict-curation-pondicherry-1759.js";
import {
  MATAMOROS_1836_CONFLICT_DETAIL_FIXES,
  MATAMOROS_1836_COUNTRY_CONFLICT_ADDITIONS,
  MATAMOROS_1836_CONFLICT_RENAMES
} from "../lib/conflict-curation-matamoros-1836.js";
import {
  HUITE_1866_CONFLICT_DETAIL_FIXES,
  HUITE_1866_COUNTRY_CONFLICT_ADDITIONS,
  HUITE_1866_CONFLICT_RENAMES
} from "../lib/conflict-curation-huite-1866.js";
import {
  TAMAO_1521_CONFLICT_DETAIL_FIXES,
  TAMAO_1521_COUNTRY_CONFLICT_ADDITIONS,
  TAMAO_1521_CONFLICT_RENAMES
} from "../lib/conflict-curation-tamao-1521.js";
import {
  TATAMAGOUCHE_1745_CONFLICT_DETAIL_FIXES,
  TATAMAGOUCHE_1745_COUNTRY_CONFLICT_ADDITIONS,
  TATAMAGOUCHE_1745_CONFLICT_RENAMES
} from "../lib/conflict-curation-tatamagouche-1745.js";
import {
  PORT_LOUIS_1799_CONFLICT_DETAIL_FIXES,
  PORT_LOUIS_1799_COUNTRY_CONFLICT_ADDITIONS,
  PORT_LOUIS_1799_CONFLICT_RENAMES
} from "../lib/conflict-curation-port-louis-1799.js";
import {
  SAINT_MARTIN_RE_1622_CONFLICT_DETAIL_FIXES,
  SAINT_MARTIN_RE_1622_CONFLICT_RENAMES
} from "../lib/conflict-curation-saint-martin-re-1622.js";
import {
  SAINT_LOUIS_DU_SUD_1748_CONFLICT_DETAIL_FIXES,
  SAINT_LOUIS_DU_SUD_1748_COUNTRY_CONFLICT_ADDITIONS,
  SAINT_LOUIS_DU_SUD_1748_CONFLICT_RENAMES
} from "../lib/conflict-curation-saint-louis-du-sud-1748.js";
import {
  PIERRES_NOIRES_1944_CONFLICT_DETAIL_FIXES,
  PIERRES_NOIRES_1944_COUNTRY_CONFLICT_ADDITIONS,
  PIERRES_NOIRES_1944_CONFLICT_RENAMES
} from "../lib/conflict-curation-pierres-noires-1944.js";
import {
  NEVA_MOUTH_1703_CONFLICT_DETAIL_FIXES,
  NEVA_MOUTH_1703_COUNTRY_CONFLICT_ADDITIONS,
  NEVA_MOUTH_1703_CONFLICT_RENAMES
} from "../lib/conflict-curation-neva-mouth-1703.js";
import {
  REMADA_1958_CONFLICT_DETAIL_FIXES,
  REMADA_1958_COUNTRY_CONFLICT_ADDITIONS,
  REMADA_1958_CONFLICT_RENAMES
} from "../lib/conflict-curation-remada-1958.js";
import {
  TREIDEN_1628_CONFLICT_DETAIL_FIXES,
  TREIDEN_1628_COUNTRY_CONFLICT_ADDITIONS,
  TREIDEN_1628_CONFLICT_RENAMES
} from "../lib/conflict-curation-treiden-1628.js";
import {
  TELLICHERRY_1791_CONFLICT_DETAIL_FIXES,
  TELLICHERRY_1791_COUNTRY_CONFLICT_ADDITIONS,
  TELLICHERRY_1791_CONFLICT_RENAMES
} from "../lib/conflict-curation-tellicherry-1791.js";
import {
  WESTTIEF_1712_CONFLICT_DETAIL_FIXES,
  WESTTIEF_1712_COUNTRY_CONFLICT_ADDITIONS,
  WESTTIEF_1712_CONFLICT_RENAMES
} from "../lib/conflict-curation-westtief-1712.js";
import {
  PROCIDA_CANAL_1809_CONFLICT_DETAIL_FIXES,
  PROCIDA_CANAL_1809_COUNTRY_CONFLICT_ADDITIONS,
  PROCIDA_CANAL_1809_CONFLICT_RENAMES
} from "../lib/conflict-curation-procida-canal-1809.js";
import {
  ANABTA_NUR_SHAMS_1936_CONFLICT_DETAIL_FIXES,
  ANABTA_NUR_SHAMS_1936_COUNTRY_CONFLICT_ADDITIONS,
  ANABTA_NUR_SHAMS_1936_CONFLICT_RENAMES
} from "../lib/conflict-curation-anabta-nur-shams-1936.js";
import {
  PUTZIGER_WIEK_1870_CONFLICT_DETAIL_FIXES,
  PUTZIGER_WIEK_1870_COUNTRY_CONFLICT_ADDITIONS,
  PUTZIGER_WIEK_1870_CONFLICT_RENAMES
} from "../lib/conflict-curation-putziger-wiek-1870.js";
import {
  JACKSON_1863_CONFLICT_DETAIL_FIXES,
  JACKSON_1863_COUNTRY_CONFLICT_ADDITIONS,
  JACKSON_1863_CONFLICT_RENAMES
} from "../lib/conflict-curation-jackson-1863.js";
import {
  SPRINGFIELD_1863_CONFLICT_DETAIL_FIXES,
  SPRINGFIELD_1863_COUNTRY_CONFLICT_ADDITIONS,
  SPRINGFIELD_1863_CONFLICT_RENAMES
} from "../lib/conflict-curation-springfield-1863.js";
import {
  KUMBO_2024_CONFLICT_DETAIL_FIXES,
  KUMBO_2024_COUNTRY_CONFLICT_ADDITIONS,
  KUMBO_2024_CONFLICT_RENAMES
} from "../lib/conflict-curation-kumbo-2024.js";
import {
  REIM_2023_CONFLICT_DETAIL_FIXES,
  REIM_2023_COUNTRY_CONFLICT_ADDITIONS,
  REIM_2023_CONFLICT_RENAMES
} from "../lib/conflict-curation-reim-2023.js";
import {
  RIO_GRANDE_CITY_1859_CONFLICT_DETAIL_FIXES,
  RIO_GRANDE_CITY_1859_COUNTRY_CONFLICT_ADDITIONS,
  RIO_GRANDE_CITY_1859_CONFLICT_RENAMES
} from "../lib/conflict-curation-rio-grande-city-1859.js";
import {
  MALTA_CONVOY_1800_CONFLICT_DETAIL_FIXES,
  MALTA_CONVOY_1800_COUNTRY_CONFLICT_ADDITIONS,
  MALTA_CONVOY_1800_CONFLICT_RENAMES
} from "../lib/conflict-curation-malta-convoy-1800.js";
import {
  WADDAMS_GROVE_1832_CONFLICT_DETAIL_FIXES,
  WADDAMS_GROVE_1832_CONFLICT_RENAMES
} from "../lib/conflict-curation-waddams-grove-1832.js";
import {
  SIDELING_HILL_1756_CONFLICT_DETAIL_FIXES,
  SIDELING_HILL_1756_CONFLICT_RENAMES
} from "../lib/conflict-curation-sideling-hill-1756.js";
import {
  ROMANOVKA_1919_CONFLICT_DETAIL_FIXES,
  ROMANOVKA_1919_COUNTRY_CONFLICT_ADDITIONS,
  ROMANOVKA_1919_CONFLICT_RENAMES
} from "../lib/conflict-curation-romanovka-1919.js";
import {
  TOLDOS_VIEJOS_1826_CONFLICT_DETAIL_FIXES,
  TOLDOS_VIEJOS_1826_CONFLICT_RENAMES
} from "../lib/conflict-curation-toldos-viejos-1826.js";
import {
  WILDCAT_CREEK_1812_CONFLICT_DETAIL_FIXES,
  WILDCAT_CREEK_1812_CONFLICT_RENAMES
} from "../lib/conflict-curation-wildcat-creek-1812.js";
import {
  TY_HO_BAY_1855_CONFLICT_DETAIL_FIXES,
  TY_HO_BAY_1855_COUNTRY_CONFLICT_ADDITIONS,
  TY_HO_BAY_1855_CONFLICT_RENAMES
} from "../lib/conflict-curation-ty-ho-bay-1855.js";
import {
  WENDEN_1577_1578_CONFLICT_DETAIL_FIXES,
  WENDEN_1577_1578_COUNTRY_CONFLICT_ADDITIONS,
  WENDEN_1577_1578_CONFLICT_RENAMES
} from "../lib/conflict-curation-wenden-1577-1578.js";
import {
  PHASE_LINE_BULLET_1991_CONFLICT_DETAIL_FIXES,
  PHASE_LINE_BULLET_1991_COUNTRY_CONFLICT_ADDITIONS,
  PHASE_LINE_BULLET_1991_CONFLICT_RENAMES
} from "../lib/conflict-curation-phase-line-bullet-1991.js";
import {
  COCKLE_CREEK_CONFLICT_DETAIL_FIXES,
  COCKLE_CREEK_CONFLICT_RENAMES
} from "../lib/conflict-curation-cockle-creek.js";
import {
  CLOUDS_CONFLICT_DETAIL_FIXES,
  CLOUDS_CONFLICT_RENAMES
} from "../lib/conflict-curation-clouds.js";
import {
  COLSONS_MILL_CONFLICT_DETAIL_FIXES,
  COLSONS_MILL_CONFLICT_RENAMES
} from "../lib/conflict-curation-colsons-mill.js";
import {
  CHILLICOTHE_CONFLICT_DETAIL_FIXES,
  CHILLICOTHE_CONFLICT_RENAMES
} from "../lib/conflict-curation-chillicothe.js";
import {
  ASINARA_CONFLICT_DETAIL_FIXES,
  ASINARA_CONFLICT_RENAMES
} from "../lib/conflict-curation-asinara.js";
import {
  BAU_CONFLICT_DETAIL_FIXES,
  BAU_COUNTRY_CONFLICT_ADDITIONS,
  BAU_CONFLICT_RENAMES
} from "../lib/conflict-curation-bau.js";
import {
  ARANAS_CONFLICT_DETAIL_FIXES,
  ARANAS_COUNTRY_CONFLICT_ADDITIONS,
  ARANAS_CONFLICT_RENAMES
} from "../lib/conflict-curation-aranas.js";
import {
  ALEGRE_CONFLICT_DETAIL_FIXES,
  ALEGRE_COUNTRY_CONFLICT_ADDITIONS,
  ALEGRE_CONFLICT_RENAMES
} from "../lib/conflict-curation-alegre.js";
import {
  COOKES_CANYON_CONFLICT_DETAIL_FIXES,
  COOKES_CANYON_CONFLICT_RENAMES
} from "../lib/conflict-curation-cookes-canyon.js";
import {
  CZORTKOW_CONFLICT_DETAIL_FIXES,
  CZORTKOW_COUNTRY_CONFLICT_ADDITIONS,
  CZORTKOW_CONFLICT_RENAMES
} from "../lib/conflict-curation-czortkow.js";
import {
  DEGLEBAT_LEGLIA_CONFLICT_DETAIL_FIXES,
  DEGLEBAT_LEGLIA_COUNTRY_CONFLICT_ADDITIONS,
  DEGLEBAT_LEGLIA_CONFLICT_RENAMES
} from "../lib/conflict-curation-deglebat-leglia.js";
import {
  DEVILS_CREEK_CONFLICT_DETAIL_FIXES,
  DEVILS_CREEK_CONFLICT_RENAMES
} from "../lib/conflict-curation-devils-creek.js";
import {
  DIABLO_MOUNTAINS_CONFLICT_DETAIL_FIXES,
  DIABLO_MOUNTAINS_CONFLICT_RENAMES
} from "../lib/conflict-curation-diablo-mountains.js";
import {
  DOLORES_RIVER_CONFLICT_DETAIL_FIXES,
  DOLORES_RIVER_COUNTRY_CONFLICT_ADDITIONS,
  DOLORES_RIVER_CONFLICT_RENAMES
} from "../lib/conflict-curation-dolores-river.js";
import {
  DORO_PASSAGE_CONFLICT_DETAIL_FIXES,
  DORO_PASSAGE_COUNTRY_CONFLICT_ADDITIONS,
  DORO_PASSAGE_CONFLICT_RENAMES
} from "../lib/conflict-curation-doro-passage.js";
import {
  DROHICZYN_CONFLICT_DETAIL_FIXES,
  DROHICZYN_CONFLICT_RENAMES
} from "../lib/conflict-curation-drohiczyn.js";
import {
  JASK_CONFLICT_DETAIL_FIXES,
  JASK_COUNTRY_CONFLICT_ADDITIONS,
  JASK_CONFLICT_RENAMES
} from "../lib/conflict-curation-jask.js";
import {
  GOTSKA_SANDON_CONFLICT_DETAIL_FIXES,
  GOTSKA_SANDON_COUNTRY_CONFLICT_ADDITIONS,
  GOTSKA_SANDON_CONFLICT_RENAMES
} from "../lib/conflict-curation-gotska-sandon.js";
import {
  PIRANO_GRADO_CONFLICT_DETAIL_FIXES,
  PIRANO_GRADO_COUNTRY_CONFLICT_ADDITIONS,
  PIRANO_GRADO_CONFLICT_RENAMES
} from "../lib/conflict-curation-pirano-grado.js";
import {
  CABO_BOJADOR_COUNTRY_CONFLICT_EXCLUSIONS,
  CABO_BOJADOR_CURATORIAL_NOTES
} from "../lib/conflict-curation-cabo-bojador.js";
import {
  CERRO_DEL_GALLO_COUNTRY_CONFLICT_EXCLUSIONS,
  CERRO_DEL_GALLO_CURATORIAL_NOTES
} from "../lib/conflict-curation-cerro-del-gallo.js";
import { curateConflictEntry } from "../lib/conflict-batch-curation.js";
import { cleanConflictLabel, mergeConflictEntries } from "../lib/conflict-cleaning.js";
import {
  getCountryConflictNames,
  mergeCountryConflictBatches,
  normalizeCountryConflictKey
} from "../lib/conflict-country-targeting.js";
import { buildConflictAuditReport } from "../lib/conflict-audit.js";
import { hasReasonableTemporalMatch, resolveWikipediaConflictTitle } from "../lib/wikipedia-conflicts.js";

assert.equal(SAFE_CONFLICT_RENAMES["Adriatic Campaign de World War II"], "Campana del Adriatico en la Segunda Guerra Mundial");
assert.equal(
  SAFE_CONFLICT_RENAMES["Conflicto Irano-israeli durante la guerra civil siria"],
  "Conflicto irano-israeli durante la guerra civil siria"
);
assert.equal(CURATED_CONFLICT_DETAIL_FIXES["Batalla de Saigon"].parent, "Guerra de Vietnam");
assert.equal(WWII_1942_SAFE_CONFLICT_RENAMES["Batalla de la BahÃƒÂ­a de Milne"], "Batalla de la Bahia de Milne");
assert.equal(WWII_1942_CONFLICT_DETAIL_FIXES["Batalla de Midway"].parent, "Segunda Guerra Mundial");
assert.equal(THEATER_SAFE_CONFLICT_RENAMES["Sullivan Expedition"], "Expedicion de Sullivan");
assert.equal(getContextualConflictName({ name: "Guerra del Pacifico", startYear: 1941 }), "Guerra del Pacifico de la Segunda Guerra Mundial");
assert.equal(getContextualConflictName({ name: "Batalla de Manila", startYear: 1899 }), "Batalla de Manila (1899)");
assert.equal(getContextualConflictName({ name: "Batalla de Manila", startYear: 1945 }), "Batalla de Manila (1945)");
assert.equal(getContextualConflictName({ name: "Batalla de Manila" }), "Batalla de Manila (1899)");
const disambiguatedManilaBattles = mergeConflictEntries([
  { name: "Batalla de Manila", startYear: 1899, endYear: 1899 },
  { name: "Batalla de Manila", startYear: 1945, endYear: 1945 }
].map(entry => ({ ...entry, name: getContextualConflictName(entry) })));
assert.equal(disambiguatedManilaBattles.length, 2, "Manila 1899 y Manila 1945 no deben volver a fusionarse");
assert.deepEqual(disambiguatedManilaBattles.map(item => item.startYear), [1899, 1945]);
assert.equal(THEATER_CONFLICT_DETAIL_FIXES["Intervencion en Siberia"].region, "Siberia");
assert.equal(VISIBLE_MODERN_SAFE_CONFLICT_RENAMES["Batalla de Cheonpyeong Valley"], "Batalla de Cheonpyeong");
assert.equal(VISIBLE_MODERN_SAFE_CONFLICT_RENAMES["Guerra de Malvinas (1982)"], "Guerra de las Malvinas");
assert.equal(VISIBLE_MODERN_CONFLICT_DETAIL_FIXES["Batalla de Cheonpyeong"].startYear, 1950);
assert.equal(VISIBLE_MODERN_CONFLICT_DETAIL_FIXES["Batalla de Cheonpyeong"].parent, "Guerra de Corea");
assert.equal(VISIBLE_MODERN_CONFLICT_DETAIL_FIXES["Batalla de Joybar"].startYear, 2011);
assert.equal(VISIBLE_MODERN_CONFLICT_DETAIL_FIXES["Combate de Buenavista"].startYear, 1880);
assert.equal(VISIBLE_MODERN_CONFLICT_DETAIL_FIXES["Combate de El Manzano"].parent, "Guerra del Pac\u00edfico");
assert.ok(
  Object.values(VISIBLE_MODERN_CONFLICT_DETAIL_FIXES).every(detail => detail.hierarchyConfidence === "alta" && detail.hierarchySources?.[0]?.url),
  "la tanda visible debe conservar fuente y confianza especificas para cada jerarquia"
);
assert.equal(VISIBLE_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Brandywine"].startYear, 1777);
assert.equal(VISIBLE_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Holowczyn"].parent, "Gran Guerra del Norte");
assert.equal(VISIBLE_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Garmsir"].startYear, 2008);
assert.equal(VISIBLE_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de la isla de las Serpientes"].startYear, 2022);
assert.equal(VISIBLE_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Basantar"].parent, "Guerra indo-pakistan\u00ed de 1971");
assert.equal(VISIBLE_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Samichon River"], "Batalla del r\u00edo Samichon");
assert.equal(VISIBLE_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Galwan"], "Combate del valle de Galwan de 2020");
assert.ok(
  Object.values(VISIBLE_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    ["alta", "media"].includes(detail.hierarchyConfidence) && detail.hierarchySources?.[0]?.url
  ),
  "la segunda tanda visible debe conservar fuente y confianza especificas"
);
assert.equal(KOREA_MODERN_CONFLICT_DETAIL_FIXES["Batalla de Battle Mountain"].parent, "Guerra de Corea");
assert.equal(KOREA_MODERN_CONFLICT_DETAIL_FIXES["Batalla de Chipyong-ni"].startYear, 1951);
assert.equal(KOREA_MODERN_CONFLICT_DETAIL_FIXES["Batalla de Khaz Oruzgan"].startYear, 2008);
assert.equal(KOREA_MODERN_CONFLICT_DETAIL_FIXES["Batalla de la borne 233"].startYear, 1961);
assert.equal(KOREA_MODERN_CONFLICT_DETAIL_FIXES["Batalla de Basra"].campaign, "Operación Carga de los Caballeros");
assert.equal(KOREA_MODERN_SAFE_CONFLICT_RENAMES["Batalla de la cota 233"], "Batalla de la borne 233");
assert.equal(KOREA_MODERN_SAFE_CONFLICT_RENAMES["Batalla de Kisangani"], "Batalla de Kisangani de 1997");
assert.equal(KOREA_MODERN_SAFE_CONFLICT_RENAMES["Batalla de Douz"], "Escaramuza de Douz de 2011");
assert.ok(
  Object.values(KOREA_MODERN_CONFLICT_DETAIL_FIXES).every(detail =>
    ["alta", "media"].includes(detail.hierarchyConfidence) && detail.hierarchySources?.[0]?.url
  ),
  "la tanda de Corea y conflictos modernos debe conservar fuente y confianza"
);
assert.equal(
  HISTORICAL_VIETNAM_SAFE_CONFLICT_RENAMES["Combate de la Junon contra el Fox"],
  "Combate naval de la Junon contra la Fox (1778)"
);
assert.equal(HISTORICAL_VIETNAM_CONFLICT_DETAIL_FIXES["Combate naval de la Junon contra la Fox (1778)"].startYear, 1778);
assert.equal(HISTORICAL_VIETNAM_CONFLICT_DETAIL_FIXES["Asalto de Ivángorod"].parent, "Guerra ruso-sueca de 1495-1497");
assert.equal(HISTORICAL_VIETNAM_CONFLICT_DETAIL_FIXES["Batalla del valle de Ia Drang"].parent, "Guerra de Vietnam");
assert.equal(HISTORICAL_VIETNAM_CONFLICT_DETAIL_FIXES["Sitio de Khe Sanh"].campaign, "Campaña de Khe Sanh");
assert.equal(HISTORICAL_VIETNAM_CONFLICT_DETAIL_FIXES["Batalla de Lima Site 85"].parent, "Guerra civil de Laos");
assert.ok(
  Object.values(HISTORICAL_VIETNAM_CONFLICT_DETAIL_FIXES).every(detail =>
    ["alta", "media"].includes(detail.hierarchyConfidence) && detail.hierarchySources?.[0]?.url
  ),
  "la tanda histórica y de Vietnam debe conservar fuente y confianza"
);

assert.equal(POSTWAR_1970_1991_CONFLICT_DETAIL_FIXES["Batalla del Bogside"].parent, "Conflicto de Irlanda del Norte");
assert.equal(POSTWAR_1970_1991_CONFLICT_DETAIL_FIXES["Batalla de Jijiga"].parent, "Guerra de Ogadén");
assert.equal(POSTWAR_1970_1991_CONFLICT_DETAIL_FIXES["Sitio de Alepo (1980-1981)"].startYear, 1980);
assert.notEqual(POSTWAR_1970_1991_CONFLICT_DETAIL_FIXES["Sitio de Alepo (1980-1981)"].parent, "Guerra civil siria");
assert.equal(POSTWAR_1970_1991_CONFLICT_DETAIL_FIXES["Batalla de Guelta Zemmur (1989)"].parent, "Guerra del Sahara Occidental");
assert.equal(POSTWAR_1970_1991_CONFLICT_DETAIL_FIXES["Batalla del monte Kent"].parent, "Guerra de las Malvinas");
assert.equal(POSTWAR_1970_1991_SAFE_CONFLICT_RENAMES["Ofensiva Esmara-Tifariti"], "Ofensiva de Esmara-Tifariti");
assert.ok(
  Object.values(POSTWAR_1970_1991_CONFLICT_DETAIL_FIXES).every(detail =>
    detail.hierarchyConfidence === "alta" && detail.hierarchySources?.[0]?.url
  ),
  "la tanda 1970-1991 debe conservar fuente y confianza"
);

assert.equal(Object.keys(MODERN_1992_2021_CONFLICT_DETAIL_FIXES).length, 39);
assert.equal(MODERN_1992_2021_CONFLICT_DETAIL_FIXES["Batalla de Gagra"].parent, "Guerra de Abjasia");
assert.equal(MODERN_1992_2021_CONFLICT_DETAIL_FIXES["Batalla de Takur Ghar"].campaign, "Operación Anaconda");
assert.equal(MODERN_1992_2021_CONFLICT_DETAIL_FIXES["Batalla de Nasiriya"].parent, "Guerra de Irak");
assert.equal(MODERN_1992_2021_CONFLICT_DETAIL_FIXES["Batalla de Mosul (2016-2017)"].parent, "Guerra contra el Estado Islámico");
assert.equal(MODERN_1992_2021_SAFE_CONFLICT_RENAMES["Batalla de los puentes"], "Batalla de los puentes de Nasiriya");
assert.equal(MODERN_1992_2021_SAFE_CONFLICT_RENAMES["Batalla de Haifa Street"], "Batalla de la calle Haifa");
assert.ok(
  Object.values(MODERN_1992_2021_CONFLICT_DETAIL_FIXES).every(detail =>
    ["alta", "media"].includes(detail.hierarchyConfidence)
      && detail.hierarchySources?.[0]?.url
      && detail.parent === detail.war
      && detail.campaign
      && !/^Conflicto regional de /i.test(detail.parent)
  ),
  "la tanda 1992-2021 debe conservar jerarquia especifica, fuente y confianza"
);

assert.equal(Object.keys(UNDATED_AMERICAS_CONFLICT_DETAIL_FIXES).length, 40);
assert.equal(UNDATED_AMERICAS_CONFLICT_DETAIL_FIXES["Batalla de Bemis Heights"].startYear, 1777);
assert.equal(UNDATED_AMERICAS_CONFLICT_DETAIL_FIXES["Batalla de Camden"].parent, "Guerra de Independencia de Estados Unidos");
assert.equal(UNDATED_AMERICAS_CONFLICT_DETAIL_FIXES["Batalla de Brownstown"].campaign, "Campaña del noroeste de 1812");
assert.equal(UNDATED_AMERICAS_CONFLICT_DETAIL_FIXES["Batalla de Nueva Orleans"].startYear, 1815);
assert.equal(UNDATED_AMERICAS_SAFE_CONFLICT_RENAMES["Batalla de Ch-teauguay"], "Batalla de Châteauguay");
assert.ok(
  Object.values(UNDATED_AMERICAS_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && Number.isInteger(detail.endYear)
      && ["alta", "media"].includes(detail.hierarchyConfidence)
      && detail.hierarchySources?.[0]?.url
      && detail.parent === detail.war
      && detail.campaign
      && !/^Conflicto regional de /i.test(detail.parent)
  ),
  "la tanda americana sin fecha debe conservar anos, jerarquia especifica, fuente y confianza"
);

assert.equal(Object.keys(REVOLUTION_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 43);
assert.equal(REVOLUTION_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de White Plains"].startYear, 1776);
assert.equal(REVOLUTION_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Princeton"].campaign, "Campaña de Nueva Jersey de 1776-1777");
assert.equal(REVOLUTION_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de la bahía de Delaware"].type, "batalla naval");
assert.equal(REVOLUTION_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Lindley's Mill"].startYear, 1781);
assert.equal(REVOLUTION_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Delaware Bay"], "Batalla de la bahía de Delaware");
assert.equal(REVOLUTION_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Delaware Capes"], "Batalla de la bahía de Delaware");
assert.equal(REVOLUTION_FOLLOWUP_SAFE_CONFLICT_RENAMES["Inteligencia en la batalla de Princeton"], "Batalla de Princeton");
assert.equal(REVOLUTION_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Sullivan's Island"], "Batalla de la isla de Sullivan");
assert.ok(
  Object.values(REVOLUTION_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && ["alta", "media"].includes(detail.hierarchyConfidence)
      && detail.hierarchySources?.[0]?.url
      && detail.parent === "Guerra de Independencia de Estados Unidos"
      && detail.parent === detail.war
      && detail.campaign
      && !/^Conflicto regional de /i.test(detail.parent)
  ),
  "la segunda tanda revolucionaria debe conservar fecha, jerarquia especifica y fuente"
);

assert.equal(Object.keys(TRANSITION_1846_1902_CONFLICT_DETAIL_FIXES).length, 43);
assert.equal(TRANSITION_1846_1902_CONFLICT_DETAIL_FIXES["Batalla de Monterrey"].startYear, 1846);
assert.equal(TRANSITION_1846_1902_CONFLICT_DETAIL_FIXES["Batalla de Santa Cruz de Rosales"].startYear, 1848);
assert.equal(TRANSITION_1846_1902_CONFLICT_DETAIL_FIXES["Primera batalla de Cárdenas"].type, "batalla naval");
assert.equal(TRANSITION_1846_1902_CONFLICT_DETAIL_FIXES["Batalla del río Zapote"].parent, "Guerra filipino-estadounidense");
assert.equal(TRANSITION_1846_1902_CONFLICT_DETAIL_FIXES["Batalla de Manila (1899)"].endYear, 1899);
assert.equal(TRANSITION_1846_1902_CONFLICT_DETAIL_FIXES["Batalla de Manila (1945)"].parent, "Segunda Guerra Mundial");
assert.deepEqual(TRANSITION_1846_1902_COUNTRY_CONFLICT_ADDITIONS["Estados Unidos"], ["Batalla de Manila (1945)"]);
assert.equal(TRANSITION_1846_1902_SAFE_CONFLICT_RENAMES["Batalla de Monterey"], "Batalla de Monterrey");
assert.equal(TRANSITION_1846_1902_SAFE_CONFLICT_RENAMES["Batalla de Mora"], "Primera batalla de Mora");
assert.equal(TRANSITION_1846_1902_SAFE_CONFLICT_RENAMES["Batalla de Marilao River"], "Batalla del río Marilao");
assert.ok(
  Object.values(TRANSITION_1846_1902_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && ["alta", "media"].includes(detail.hierarchyConfidence)
      && detail.hierarchySources?.[0]?.url
      && detail.parent === detail.war
      && detail.campaign
      && !/^Conflicto regional de /i.test(detail.parent)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
  ),
  "la tanda 1846-1902 debe conservar fecha, jerarquia, fuentes y participantes reales"
);

assert.equal(Object.keys(WAR_1812_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 25);
assert.equal(WAR_1812_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Fort Dearborn"].startYear, 1812);
assert.equal(WAR_1812_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Stoney Creek"].campaign, "Campaña del Niágara de 1813");
assert.equal(WAR_1812_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Hampden"].startYear, 1814);
assert.equal(WAR_1812_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Horseshoe Bend"].parent, "Guerra Creek");
assert.equal(WAR_1812_FOLLOWUP_SAFE_CONFLICT_RENAMES["Guerra de 1812"], "Guerra anglo-estadounidense de 1812");
assert.equal(WAR_1812_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Fort Wayne"], "Sitio de Fort Wayne");
assert.equal(WAR_1812_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de River Canard"], "Batalla del río Canard");
assert.ok(
  Object.values(WAR_1812_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.[0]?.url
      && detail.parent === detail.war
      && detail.campaign
      && !/^Conflicto regional de /i.test(detail.parent)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
  ),
  "la tanda de 1812 debe conservar fecha, jerarquia, fuentes y participantes reales"
);

assert.equal(Object.keys(US_CIVIL_WAR_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 20);
assert.equal(US_CIVIL_WAR_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Fredericksburg"].startYear, 1862);
assert.equal(US_CIVIL_WAR_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Cedar Creek"].campaign, "Campaña del valle de Shenandoah de 1864");
assert.equal(US_CIVIL_WAR_FOLLOWUP_CONFLICT_DETAIL_FIXES["Segunda batalla de Fort McAllister"].startYear, 1864);
assert.equal(US_CIVIL_WAR_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla naval de Memphis"].type, "batalla naval");
assert.equal(US_CIVIL_WAR_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Fort McAllister"], "Segunda batalla de Fort McAllister");
assert.equal(US_CIVIL_WAR_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Galveston Harbor"], "Batalla del puerto de Galveston de 1862");
assert.equal(US_CIVIL_WAR_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Head de Passes"], "Batalla de Head of Passes");
assert.ok(
  Object.values(US_CIVIL_WAR_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && ["alta", "media"].includes(detail.hierarchyConfidence)
      && detail.hierarchySources?.[0]?.url
      && detail.parent === "Guerra Civil estadounidense"
      && detail.parent === detail.war
      && detail.campaign
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
  ),
  "la tanda de la Guerra Civil debe conservar fecha, jerarquia, fuentes y participantes reales"
);

assert.equal(Object.keys(US_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 16);
assert.equal(US_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Dutch Harbor"].startYear, 1942);
assert.equal(US_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Bairoko"].campaign, "Campaña de Nueva Georgia");
assert.equal(US_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla del estrecho de Surigao"].type, "batalla naval");
assert.equal(US_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Saint-Vith"].campaign, "Ofensiva de las Ardenas");
assert.equal(US_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES["Combate naval del SS Stephen Hopkins"].participants[1].members[0], "Alemania");
assert.equal(US_WWII_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla del Mar de Sibuyan"], "Batalla del mar de Sibuyán");
assert.equal(US_WWII_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de St. Vith"], "Batalla de Saint-Vith");
assert.equal(US_WWII_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de SS Stephen Hopkins"], "Combate naval del SS Stephen Hopkins");
assert.ok(
  Object.values(US_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent === "Segunda Guerra Mundial"
      && detail.parent === detail.war
      && detail.campaign
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.[0]?.url
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
      && detail.treaties.length === 0
  ),
  "la tanda de la Segunda Guerra Mundial debe conservar jerarquia, fuentes y contexto editorial"
);
assert.equal(Object.keys(US_INDIAN_WARS_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 27);
assert.equal(US_INDIAN_WARS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla del cañón White Bird"].parent, "Guerra de los Nez Perce");
assert.equal(US_INDIAN_WARS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Little Bighorn"].startYear, 1876);
assert.equal(US_INDIAN_WARS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla del lago Stony"].campaign, "Expedición de Sibley de 1863");
assert.equal(US_INDIAN_WARS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Withlacoochee"].parent, "Segunda Guerra Seminola");
assert.equal(US_INDIAN_WARS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Escaramuza del arroyo Warbonnet"].type, "escaramuza");
assert.equal(US_INDIAN_WARS_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Little Big Horn"], "Batalla de Little Bighorn");
assert.equal(US_INDIAN_WARS_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Ouithlacoochie"], "Batalla de Withlacoochee");
assert.equal(US_INDIAN_WARS_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Lake Okeechobee"], "Batalla del lago Okeechobee");
assert.ok(
  Object.values(US_INDIAN_WARS_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent
      && detail.parent === detail.war
      && detail.campaign
      && detail.cause
      && detail.outcome
      && detail.consequences
      && ["alta", "media"].includes(detail.hierarchyConfidence)
      && detail.hierarchySources?.[0]?.url
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
      && detail.treaties.length === 0
  ),
  "la tanda de guerras indígenas debe conservar jerarquia, fuentes, participantes y cierre editorial explícito"
);
assert.equal(Object.keys(US_FRONTIER_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 14);
assert.equal(Object.keys(US_FRONTIER_FOLLOWUP_SAFE_CONFLICT_RENAMES).length, 8);
assert.equal(US_FRONTIER_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla del paso Apache"].startYear, 1862);
assert.equal(US_FRONTIER_FOLLOWUP_CONFLICT_DETAIL_FIXES["Ataque a Fort Apache"].campaign, "Crisis de Cibecue y Fort Apache de 1881");
assert.equal(US_FRONTIER_FOLLOWUP_CONFLICT_DETAIL_FIXES["Ataque a Fort Apache"].type, "ataque");
assert.equal(US_FRONTIER_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla del río Tongue"].parent, "Guerras de las llanuras");
assert.equal(US_FRONTIER_FOLLOWUP_CONFLICT_DETAIL_FIXES["Masacre de Skeleton Cave"].type, "masacre");
assert.equal(US_FRONTIER_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de los Árboles Caídos"].treaties[0], "Tratado de Greenville (1795)");
assert.equal(US_FRONTIER_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Cieneguilla"].participants[0].casualties, "22 muertos y 23 heridos");
assert.equal(US_FRONTIER_FOLLOWUP_SAFE_CONFLICT_RENAMES["Battle of the Tongue River"], "Batalla del río Tongue");
assert.equal(US_FRONTIER_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Salt River Canyon"], "Masacre de Skeleton Cave");
assert.ok(
  Object.values(US_FRONTIER_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent
      && detail.parent === detail.war
      && detail.campaign
      && detail.region
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.chronology?.[0]?.year === detail.startYear
      && detail.chronology?.[0]?.event
      && ["alta", "media"].includes(detail.hierarchyConfidence)
      && detail.hierarchySources?.length >= 1
      && detail.hierarchySources.every(source => source.label && source.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
  ),
  "la segunda tanda fronteriza debe conservar fecha, jerarquia, fuentes, participantes y contexto editorial"
);
assert.equal(Object.keys(US_FRONTIER_SECOND_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 10);
assert.equal(Object.keys(US_FRONTIER_SECOND_FOLLOWUP_SAFE_CONFLICT_RENAMES).length, 10);
assert.equal(
  US_FRONTIER_SECOND_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Kenapacomaqua"],
  "Ataque a Kenapacomaqua (1791)"
);
assert.equal(
  US_FRONTIER_SECOND_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Devil's River"],
  "Combate del río Devils (1857)"
);
assert.equal(US_FRONTIER_SECOND_FOLLOWUP_CONFLICT_DETAIL_FIXES["Masacre de Claremore Mound (1817)"].type, "ataque y masacre");
assert.equal(US_FRONTIER_SECOND_FOLLOWUP_CONFLICT_DETAIL_FIXES["Combate de Sink Hole (1815)"].treaties[0], "Tratado de Gante (1814)");
assert.equal(US_FRONTIER_SECOND_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Pima Butte (1857)"].type, "batalla intertribal");
assert.match(
  US_FRONTIER_SECOND_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Pima Butte (1857)"].curationNote,
  /únicamente geográfica/i
);
assert.equal(US_FRONTIER_SECOND_FOLLOWUP_CONFLICT_DETAIL_FIXES["Combate atribuido de Bandera Pass (c. 1842)"].hierarchyConfidence, "media");
assert.equal(US_FRONTIER_SECOND_FOLLOWUP_CONFLICT_DETAIL_FIXES["Combate atribuido de Bandera Pass (c. 1842)"].sourceDispute, true);
assert.equal(
  US_FRONTIER_SECOND_FOLLOWUP_CONFLICT_DETAIL_FIXES["Combate atribuido de Bandera Pass (c. 1842)"].datePrecision,
  "aproximada y disputada"
);
assert.match(
  US_FRONTIER_SECOND_FOLLOWUP_CONFLICT_DETAIL_FIXES["Combate del río Devils (1857)"].curationNote,
  /difieren.*bajas indígenas/i
);
assert.ok(
  Object.values(US_FRONTIER_SECOND_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent
      && detail.parent === detail.war
      && detail.campaign
      && detail.region
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.chronology?.[0]?.year === detail.startYear
      && detail.chronology?.[0]?.event
      && ["alta", "media"].includes(detail.hierarchyConfidence)
      && detail.hierarchySources?.length >= 1
      && detail.hierarchySources.every(source => source.label && source.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
      && detail.curationNote
  ),
  "la nueva tanda fronteriza debe conservar fecha, jerarquia, fuentes, participantes y cautelas historiograficas"
);
assert.equal(Object.keys(US_CARIBBEAN_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 10);
assert.equal(Object.keys(US_CARIBBEAN_FOLLOWUP_SAFE_CONFLICT_RENAMES).length, 4);
assert.deepEqual(US_CARIBBEAN_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS.Nicaragua, [
  "Batalla de Masaya",
  "Batalla de La Paz Centro",
  "Batalla de Ocotal",
  "Batalla de Telpaneca",
  "Batalla de Sapotillal",
  "Segunda batalla de Las Cruces (1928)",
  "Batalla de El Sauce"
]);
assert.equal(US_CARIBBEAN_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS["Haití"][0], "Batalla de Fort Rivière");
assert.equal(US_CARIBBEAN_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Masaya"].startYear, 1912);
assert.equal(US_CARIBBEAN_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Ocotal"].parent, "Guerra de Sandino");
assert.equal(US_CARIBBEAN_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Telpaneca"].conflictType, "insurgencia");
assert.equal(US_CARIBBEAN_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Fort Rivière"].startYear, 1915);
assert.equal(US_CARIBBEAN_FOLLOWUP_CONFLICT_DETAIL_FIXES["Incursión naval de Puerto Plata (1800)"].parent, "Cuasi-Guerra");
assert.equal(US_CARIBBEAN_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Puerto Plata (1916)"].region, "Puerto Plata, República Dominicana");
assert.equal(US_CARIBBEAN_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Las Cruces"], "Segunda batalla de Las Cruces (1928)");
assert.equal(US_CARIBBEAN_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Fort Riviere"], "Batalla de Fort Rivière");
assert.ok(
  Object.values(US_CARIBBEAN_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent
      && detail.parent === detail.war
      && detail.campaign
      && detail.region
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.chronology?.[0]?.year === detail.startYear
      && detail.chronology?.[0]?.event
      && ["alta", "media"].includes(detail.hierarchyConfidence)
      && detail.hierarchySources?.length >= 1
      && detail.hierarchySources.every(source => source.label && source.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
  ),
  "la tanda de Nicaragua y Caribe debe conservar fecha, jerarquia, fuentes, participantes y contexto editorial"
);
assert.equal(Object.keys(AUSTRALIA_DENMARK_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 11);
assert.equal(Object.keys(AUSTRALIA_DENMARK_FOLLOWUP_SAFE_CONFLICT_RENAMES).length, 4);
assert.deepEqual(AUSTRALIA_DENMARK_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS["Timor Oriental"], ["Batalla de Aidabasalala"]);
assert.deepEqual(AUSTRALIA_DENMARK_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS.Alemania, ["Batalla de Schleswig (1848)", "Batalla de Isted"]);
assert.equal(AUSTRALIA_DENMARK_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Aidabasalala"].startYear, 1999);
assert.equal(AUSTRALIA_DENMARK_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Broodseinde"].parent, "Primera Guerra Mundial");
assert.equal(AUSTRALIA_DENMARK_FOLLOWUP_CONFLICT_DETAIL_FIXES["Primera batalla de Dernancourt"].startYear, 1918);
assert.equal(AUSTRALIA_DENMARK_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Isted"].parent, "Primera Guerra de Schleswig");
assert.equal(AUSTRALIA_DENMARK_FOLLOWUP_CONFLICT_DETAIL_FIXES["Ocupacion indonesia de Timor Oriental"].endYear, 1999);
assert.equal(cleanConflictLabel("Ocupación indonesia de Timor Oriental"), "Ocupacion indonesia de Timor Oriental");
assert.ok(AUSTRALIA_DENMARK_FOLLOWUP_CONFLICT_DETAIL_FIXES[cleanConflictLabel("Ocupación indonesia de Timor Oriental")]);
assert.equal(
  AUSTRALIA_DENMARK_FOLLOWUP_SAFE_CONFLICT_RENAMES[cleanConflictLabel("Invasión indonesia de Timor Oriental")],
  "Invasion indonesia de Timor Oriental (1975)"
);
assert.equal(AUSTRALIA_DENMARK_FOLLOWUP_CONFLICT_DETAIL_FIXES["Crisis de Timor Oriental de 2006"].startYear, 2006);
assert.notEqual(AUSTRALIA_DENMARK_FOLLOWUP_CONFLICT_DETAIL_FIXES["Invasion indonesia de Timor Oriental (1975)"].parent, "Segunda Guerra Mundial");
assert.notEqual(AUSTRALIA_DENMARK_FOLLOWUP_CONFLICT_DETAIL_FIXES["Crisis de Timor Oriental de 2006"].campaign, "Guerra del Pacífico de la Segunda Guerra Mundial");
assert.equal(
  AUSTRALIA_DENMARK_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla entre el HMAS Sydney y el Kormoran"],
  "Combate naval entre el HMAS Sydney y el Kormoran (1941)"
);
assert.ok(
  Object.values(AUSTRALIA_DENMARK_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && Number.isInteger(detail.endYear)
      && detail.parent
      && detail.parent === detail.war
      && detail.campaign
      && detail.region
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.chronology?.length >= 1
      && detail.chronology.every(item => Number.isInteger(item.year) && item.event)
      && ["alta", "media"].includes(detail.hierarchyConfidence)
      && detail.hierarchySources?.length >= 1
      && detail.hierarchySources.every(source => source.label && source.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
  ),
  "la tanda de Australia, Dinamarca y Timor debe conservar fecha, jerarquia, fuentes, participantes y contexto editorial"
);
assert.equal(Object.keys(US_INDIGENOUS_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 9);
assert.equal(Object.keys(US_INDIGENOUS_FOLLOWUP_SAFE_CONFLICT_RENAMES).length, 10);
assert.equal(US_INDIGENOUS_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Dry Lake"], "Batalla de Dry Lake (1873)");
assert.equal(US_INDIGENOUS_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Sand Butte"], "Batalla de Dry Lake (1873)");
assert.equal(US_INDIGENOUS_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Turner's Falls"], "Masacre de Peskeompskut (1676)");
assert.equal(US_INDIGENOUS_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Kelley Creek"], "Masacre de Kelley Creek (1911)");
assert.equal(US_INDIGENOUS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla del cañón de Ojo Caliente (1854)"].parent, "Guerra jicarilla");
assert.equal(US_INDIGENOUS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Dry Lake (1873)"].parent, "Guerra modoc");
assert.equal(US_INDIGENOUS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Turret Peak (1873)"].parent, "Guerra tonto");
assert.equal(US_INDIGENOUS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Combate de Bear Valley (1918)"].conflictType, "frontera");
assert.match(US_INDIGENOUS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Masacre de Kelley Creek (1911)"].curationNote, /persecución policial/i);
assert.ok(
  Object.values(US_INDIGENOUS_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.endYear === detail.startYear
      && detail.parent
      && detail.parent === detail.war
      && detail.campaign
      && detail.region
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.chronology?.length >= 1
      && detail.chronology.every(item => Number.isInteger(item.year) && item.event)
      && ["alta", "media"].includes(detail.hierarchyConfidence)
      && detail.hierarchySources?.length >= 1
      && detail.hierarchySources.every(source => source.label && source.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
  ),
  "la tanda indígena estadounidense debe conservar jerarquia, fuentes, participantes y cautelas editoriales"
);
assert.equal(Object.keys(US_REVOLUTION_THIRD_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 10);
assert.equal(Object.keys(US_REVOLUTION_THIRD_FOLLOWUP_SAFE_CONFLICT_RENAMES).length, 10);
assert.equal(
  US_REVOLUTION_THIRD_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Norwalk"],
  "Incursión de Norwalk (1779)"
);
assert.equal(
  US_REVOLUTION_THIRD_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Wetzell's Mill"],
  "Escaramuza de Wetzell's Mill (1781)"
);
assert.equal(
  US_REVOLUTION_THIRD_FOLLOWUP_CONFLICT_DETAIL_FIXES["Ataque a Lindley's Fort (1776)"].parent,
  "Guerra cheroqui de 1776"
);
assert.equal(
  US_REVOLUTION_THIRD_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Saint-Pierre (1776)"].campaign,
  "Invasión de Quebec de 1775-1776"
);
assert.equal(
  US_REVOLUTION_THIRD_FOLLOWUP_CONFLICT_DETAIL_FIXES["Escaramuza de Wetzell's Mill (1781)"].type,
  "escaramuza"
);
assert.match(
  US_REVOLUTION_THIRD_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de San Luis (1780)"].curationNote,
  /naciones indígenas/i
);
assert.ok(
  Object.values(US_REVOLUTION_THIRD_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.endYear === detail.startYear
      && detail.parent
      && detail.parent === detail.war
      && detail.campaign
      && detail.region
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.chronology?.length >= 1
      && detail.chronology.every(item => Number.isInteger(item.year) && item.event)
      && ["alta", "media"].includes(detail.hierarchyConfidence)
      && detail.hierarchySources?.length >= 1
      && detail.hierarchySources.every(source => source.label && source.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
  ),
  "la tercera tanda revolucionaria debe conservar fecha, jerarquia, fuentes, participantes y contexto editorial"
);
assert.equal(Object.keys(BRITISH_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 26);
assert.equal(Object.keys(BRITISH_WWII_FOLLOWUP_SAFE_CONFLICT_RENAMES).length, 18);
assert.equal(BRITISH_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Abbeville"].campaign, "Batalla de Francia");
assert.equal(BRITISH_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Heraclión"].campaign, "Batalla de Creta");
assert.equal(BRITISH_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla del mar de Barents"].type, "batalla naval");
assert.equal(BRITISH_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Ptolemaida"].startYear, 1941);
assert.equal(BRITISH_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla del mar de Liguria"].startYear, 1945);
assert.equal(BRITISH_WWII_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Britain Day"], "Día de la Batalla de Inglaterra");
assert.equal(BRITISH_WWII_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Bay de Biscay"], "Batalla del golfo de Vizcaya");
assert.equal(BRITISH_WWII_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Merville Gun Battery"], "Batalla de la batería de Merville");
assert.ok(
  Object.values(BRITISH_WWII_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent === "Segunda Guerra Mundial"
      && detail.parent === detail.war
      && detail.campaign
      && detail.region
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.chronology?.[0]?.event
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.[0]?.url
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
      && detail.treaties.length === 0
  ),
  "la tanda británica de la Segunda Guerra Mundial debe conservar fechas, jerarquia, fuentes y contexto editorial"
);
assert.equal(Object.keys(US_OVERSEAS_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 22);
assert.equal(Object.keys(US_OVERSEAS_FOLLOWUP_SAFE_CONFLICT_RENAMES).length, 8);
assert.equal(US_OVERSEAS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Beicang"].parent, "Rebelion de los Boxers");
assert.equal(US_OVERSEAS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Ust-Padenga"].campaign, "Intervencion aliada en el norte de Rusia");
assert.equal(US_OVERSEAS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Cantigny"].startYear, 1918);
assert.equal(US_OVERSEAS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de El Guettar"].parent, "Segunda Guerra Mundial");
assert.equal(US_OVERSEAS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Combate aéreo del aeródromo de Suwon"].type, "combate aéreo");
assert.equal(US_OVERSEAS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Ataque al campamento de Hiep Hoa"].conflictType, "insurgencia");
assert.equal(US_OVERSEAS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla del Aeropuerto Internacional de Bagdad"].startYear, 2004);
assert.equal(US_OVERSEAS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla del Aeropuerto Internacional de Bagdad"].campaign, "Levantamiento del Ejército del Mahdi de 2004");
assert.equal(US_OVERSEAS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Do Ab"].parent, "Guerra de Afganistán");
assert.equal(US_OVERSEAS_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Ch-teau-Thierry"], "Batalla de Château-Thierry");
assert.equal(US_OVERSEAS_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de BIAP"], "Batalla del Aeropuerto Internacional de Bagdad");
assert.equal(US_OVERSEAS_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Shok Valley"], "Batalla del valle de Shok");
assert.ok(
  Object.values(US_OVERSEAS_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent
      && detail.parent === detail.war
      && detail.campaign
      && detail.region
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.chronology?.[0]?.year === detail.startYear
      && detail.chronology?.[0]?.event
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.[0]?.url
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
      && detail.treaties.length === 0
  ),
  "la tanda ultramarina estadounidense debe conservar fechas, jerarquia, fuentes, participantes y contexto editorial"
);
assert.equal(Object.keys(ACTIVE_AFRICA_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 4);
assert.equal(Object.keys(ACTIVE_AFRICA_FOLLOWUP_SAFE_CONFLICT_RENAMES).length, 1);
assert.equal(ACTIVE_AFRICA_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Ras Kamboni (2024)"].parent, "Crisis de Jubalandia de 2024");
assert.equal(ACTIVE_AFRICA_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Tinzawatène (2024)"].parent, "Guerra de Malí");
assert.equal(ACTIVE_AFRICA_FOLLOWUP_CONFLICT_DETAIL_FIXES["Ofensiva de Fano en Amhara de 2024"].type, "ofensiva");
assert.equal(ACTIVE_AFRICA_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Boulikessi (2025)"].conflictType, "insurgencia");
assert.equal(
  ACTIVE_AFRICA_FOLLOWUP_SAFE_CONFLICT_RENAMES["Ofensiva de Amhara de 2024"],
  "Ofensiva de Fano en Amhara de 2024"
);
assert.ok(
  Object.values(ACTIVE_AFRICA_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent
      && detail.parent === detail.war
      && detail.campaign
      && detail.region
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.chronology?.length >= 2
      && detail.chronology.every(event => event.year === detail.startYear && event.event)
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 2
      && detail.hierarchySources.every(source => source.label && source.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
      && detail.treaties.length === 0
  ),
  "la tanda africana reciente debe conservar jerarquia, cautelas editoriales, dos fuentes y participantes reales"
);
assert.equal(Object.keys(JAPAN_KOREA_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 13);
assert.equal(Object.keys(JAPAN_KOREA_FOLLOWUP_SAFE_CONFLICT_RENAMES).length, 13);
assert.equal(JAPAN_KOREA_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS["Corea del Sur"].length, 13);
assert.deepEqual(
  JAPAN_KOREA_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS["República Popular China"],
  ["Batalla naval de Noryang (1598)"]
);
assert.equal(JAPAN_KOREA_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Happo"], "Acción naval de Happo (1592)");
assert.equal(
  JAPAN_KOREA_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Danghangpo"],
  "Primera batalla naval de Danghangpo (1592)"
);
assert.equal(
  JAPAN_KOREA_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Chobayashiura"],
  "Acción naval de Jangnimpo (1592)"
);
assert.equal(
  COOKES_CANYON_CONFLICT_RENAMES["Batalla de Cookes Canyon"],
  "Combate de Cooke's Canyon (1861)"
);
const cookesCanyonDetail = COOKES_CANYON_CONFLICT_DETAIL_FIXES["Combate de Cooke's Canyon (1861)"];
assert.equal(cookesCanyonDetail.parent, "Guerras apaches");
assert.equal(cookesCanyonDetail.startYear, 1861);
assert.equal(cookesCanyonDetail.endYear, 1861);
assert.equal(cookesCanyonDetail.conflictType, "colonial");
assert.equal(cookesCanyonDetail.participants[1].members[0], "Apache chiricahua");
assert.equal(cookesCanyonDetail.sourceDispute, true);
assert.equal(cookesCanyonDetail.hierarchyConfidence, "media");
assert.equal(cookesCanyonDetail.hierarchySources.length, 2);
assert.equal(CZORTKOW_CONFLICT_RENAMES["Batalla de Czortkowem"], "Batalla de Czortk\u00f3w (1919)");
assert.deepEqual(CZORTKOW_COUNTRY_CONFLICT_ADDITIONS.Ucrania, ["Batalla de Czortk\u00f3w (1919)"]);
const czortkowDetail = CZORTKOW_CONFLICT_DETAIL_FIXES["Batalla de Czortk\u00f3w (1919)"];
assert.equal(czortkowDetail.parent, "Guerra polaco-ucraniana (1918-1919)");
assert.equal(czortkowDetail.campaign, "Ofensiva de Chortkiv (junio de 1919)");
assert.equal(czortkowDetail.startYear, 1919);
assert.equal(czortkowDetail.endYear, 1919);
assert.equal(czortkowDetail.participants[1].members[0], "Rep\u00fablica Popular de Ucrania Occidental");
assert.equal(czortkowDetail.sourceDispute, true);
assert.equal(czortkowDetail.hierarchySources.length, 3);
assert.equal(
  DEGLEBAT_LEGLIA_CONFLICT_RENAMES["Batalla de Deglebat-Leglia"],
  "Combate de Deglebat-Leglia (1977)"
);
assert.deepEqual(
  DEGLEBAT_LEGLIA_COUNTRY_CONFLICT_ADDITIONS["Sahara Occidental"],
  ["Combate de Deglebat-Leglia (1977)"]
);
const deglebatLegliaDetail = DEGLEBAT_LEGLIA_CONFLICT_DETAIL_FIXES["Combate de Deglebat-Leglia (1977)"];
assert.equal(deglebatLegliaDetail.parent, "Guerra del Sahara Occidental");
assert.equal(deglebatLegliaDetail.campaign, "Operaciones del Frente Polisario contra Mauritania de agosto-septiembre de 1977");
assert.equal(deglebatLegliaDetail.startYear, 1977);
assert.equal(deglebatLegliaDetail.endYear, 1977);
assert.equal(deglebatLegliaDetail.conflictType, "independencia");
assert.equal(deglebatLegliaDetail.participants[0].members[0], "Mauritania");
assert.equal(deglebatLegliaDetail.participants[1].members[0], "Frente Polisario");
assert.equal(deglebatLegliaDetail.sourceDispute, true);
assert.equal(deglebatLegliaDetail.hierarchyConfidence, "media");
assert.equal(deglebatLegliaDetail.hierarchySources.length, 3);
assert.match(deglebatLegliaDetail.outcome, /no consolida bajas/i);
assert.match(deglebatLegliaDetail.curationNote, /no adjudica soberania/i);
assert.equal(
  DEVILS_CREEK_CONFLICT_RENAMES["Batalla de Devil's Creek"],
  "Combate de Devil's Creek (1885)"
);
const devilsCreekDetail = DEVILS_CREEK_CONFLICT_DETAIL_FIXES["Combate de Devil's Creek (1885)"];
assert.equal(devilsCreekDetail.parent, "Guerras apaches");
assert.equal(devilsCreekDetail.campaign, "Campa\u00f1a de Ger\u00f3nimo de 1885-1886");
assert.equal(devilsCreekDetail.startYear, 1885);
assert.equal(devilsCreekDetail.endYear, 1885);
assert.equal(devilsCreekDetail.conflictType, "colonial");
assert.equal(devilsCreekDetail.participants[0].members[0], "Estados Unidos");
assert.equal(devilsCreekDetail.participants[0].members[2], "Exploradores apaches");
assert.equal(devilsCreekDetail.participants[1].members[0], "Chiricahua Apache");
assert.equal(devilsCreekDetail.sourceDispute, true);
assert.equal(devilsCreekDetail.hierarchyConfidence, "alta");
assert.equal(devilsCreekDetail.hierarchySources.length, 3);
assert.match(devilsCreekDetail.outcome, /no permite consolidar bajas chiricahuas/i);
assert.match(devilsCreekDetail.curationNote, /no permiten fijar a Geronimo/i);
assert.equal(
  DIABLO_MOUNTAINS_CONFLICT_RENAMES["Batalla de Diablo Mountains"],
  "Combate de Sierra Diablo (1854)"
);
const diabloMountainsDetail = DIABLO_MOUNTAINS_CONFLICT_DETAIL_FIXES["Combate de Sierra Diablo (1854)"];
assert.equal(diabloMountainsDetail.parent, "Guerras apaches");
assert.equal(diabloMountainsDetail.campaign, "Operaciones fronterizas estadounidenses en el oeste de Texas de 1854");
assert.equal(diabloMountainsDetail.startYear, 1854);
assert.equal(diabloMountainsDetail.endYear, 1854);
assert.equal(diabloMountainsDetail.conflictType, "colonial");
assert.match(diabloMountainsDetail.region, /Sierra Diablo/);
assert.equal(diabloMountainsDetail.participants[0].members[0], "Estados Unidos");
assert.equal(diabloMountainsDetail.participants[1].members[0], "Apache");
assert.equal(diabloMountainsDetail.sourceDispute, true);
assert.equal(diabloMountainsDetail.hierarchyConfidence, "media");
assert.equal(diabloMountainsDetail.hierarchySources.length, 3);
assert.match(diabloMountainsDetail.outcome, /no consolida una victoria tactica/i);
assert.match(diabloMountainsDetail.curationNote, /no asigna la accion a la Guerra jicarilla/i);
assert.equal(
  DOLORES_RIVER_CONFLICT_RENAMES["Batalla de Dolores River"],
  "Combate del rio Dolores (1904)"
);
assert.deepEqual(
  DOLORES_RIVER_COUNTRY_CONFLICT_ADDITIONS.Filipinas,
  ["Combate del rio Dolores (1904)"]
);
const doloresRiverDetail = DOLORES_RIVER_CONFLICT_DETAIL_FIXES["Combate del rio Dolores (1904)"];
assert.equal(doloresRiverDetail.parent, "Insurgencia pulahan en Samar (1904-1911)");
assert.equal(doloresRiverDetail.campaign, "Operaciones de la Constabularia Filipina en Samar oriental de 1904");
assert.equal(doloresRiverDetail.startYear, 1904);
assert.equal(doloresRiverDetail.endYear, 1904);
assert.equal(doloresRiverDetail.conflictType, "insurgencia");
assert.match(doloresRiverDetail.region, /Samar oriental/);
assert.equal(doloresRiverDetail.participants[0].members[0], "Filipinas");
assert.equal(doloresRiverDetail.participants[0].members[2], "Estados Unidos");
assert.equal(doloresRiverDetail.participants[1].members[0], "Pulahanes");
assert.equal(doloresRiverDetail.sourceDispute, true);
assert.equal(doloresRiverDetail.hierarchyConfidence, "alta");
assert.equal(doloresRiverDetail.hierarchySources.length, 3);
assert.match(doloresRiverDetail.datePrecision, /diciembre de 1904/i);
assert.match(doloresRiverDetail.curationNote, /no en America continental/i);
assert.equal(
  DORO_PASSAGE_CONFLICT_RENAMES["Batalla de Doro Passage"],
  "Accion naval del paso de Doro (1827)"
);
assert.deepEqual(
  DORO_PASSAGE_COUNTRY_CONFLICT_ADDITIONS.Grecia,
  ["Accion naval del paso de Doro (1827)"]
);
assert.deepEqual(
  DORO_PASSAGE_COUNTRY_CONFLICT_ADDITIONS["Reino Unido"],
  ["Accion naval del paso de Doro (1827)"]
);
const doroPassageDetail = DORO_PASSAGE_CONFLICT_DETAIL_FIXES["Accion naval del paso de Doro (1827)"];
assert.equal(doroPassageDetail.parent, "Operaciones antipirateria estadounidenses en el mar Egeo");
assert.equal(doroPassageDetail.campaign, "Escolta del convoy de la USS Porpoise entre Esmirna y Malta (1827)");
assert.equal(doroPassageDetail.startYear, 1827);
assert.equal(doroPassageDetail.endYear, 1827);
assert.equal(doroPassageDetail.conflictType, "intervencion");
assert.match(doroPassageDetail.region, /mar Egeo/);
assert.equal(doroPassageDetail.participants[0].members[0], "Estados Unidos");
assert.equal(doroPassageDetail.participants[1].members[0], "Piratas griegos");
assert.equal(doroPassageDetail.participants[2].members[0], "Reino Unido");
assert.equal(doroPassageDetail.sourceDispute, true);
assert.equal(doroPassageDetail.hierarchyConfidence, "alta");
assert.equal(doroPassageDetail.hierarchySources.length, 3);
assert.match(doroPassageDetail.datePrecision, /15 al 16 de octubre de 1827/i);
assert.match(doroPassageDetail.curationNote, /erronea en America/i);
assert.equal(
  DROHICZYN_CONFLICT_RENAMES["Batalla de Drohiczyn"],
  "Combate de Drohiczyn (1192)"
);
const drohiczynDetail = DROHICZYN_CONFLICT_DETAIL_FIXES["Combate de Drohiczyn (1192)"];
assert.equal(drohiczynDetail.parent, "Expedicion de Casimiro II contra Drohiczyn y los yotvingios (1192)");
assert.equal(drohiczynDetail.campaign, "Operaciones por el control de Drohiczyn en Podlaquia (1192)");
assert.equal(drohiczynDetail.startYear, 1192);
assert.equal(drohiczynDetail.endYear, 1192);
assert.equal(drohiczynDetail.conflictType, "frontera");
assert.match(drohiczynDetail.region, /Podlaquia/);
assert.equal(drohiczynDetail.participants[0].members[0], "Polonia");
assert.equal(drohiczynDetail.participants[1].members[0], "Yotvingios");
assert.equal(drohiczynDetail.sourceDispute, true);
assert.equal(drohiczynDetail.hierarchyConfidence, "alta");
assert.equal(drohiczynDetail.hierarchySources.length, 3);
assert.match(drohiczynDetail.datePrecision, /1194/i);
assert.match(drohiczynDetail.curationNote, /1238/i);
assert.equal(JASK_CONFLICT_RENAMES["Batalla de Dschask"], "Combate naval de Jask (1620)");
const jaskDetail = JASK_CONFLICT_DETAIL_FIXES["Combate naval de Jask (1620)"];
assert.equal(jaskDetail.parent, "Rivalidad anglo-portuguesa por el comercio del golfo Persico (1616-1622)");
assert.equal(jaskDetail.campaign, "Operaciones navales frente a Jask y acceso ingles a Persia (1620)");
assert.equal(jaskDetail.startYear, 1620);
assert.equal(jaskDetail.endYear, 1620);
assert.equal(jaskDetail.conflictType, "colonial");
assert.match(jaskDetail.region, /Jask/);
assert.equal(jaskDetail.participants[0].members[0], "Reino de Inglaterra");
assert.equal(jaskDetail.participants[1].members[0], "Portugal");
assert.equal(jaskDetail.sourceDispute, true);
assert.equal(jaskDetail.hierarchyConfidence, "alta");
assert.equal(jaskDetail.hierarchySources.length, 3);
assert.match(jaskDetail.datePrecision, /diciembre/i);
assert.match(jaskDetail.curationNote, /Iran/);
assert.deepEqual(JASK_COUNTRY_CONFLICT_ADDITIONS.Iran, ["Combate naval de Jask (1620)"]);
assert.deepEqual(JASK_COUNTRY_CONFLICT_ADDITIONS["Reino Unido"], ["Combate naval de Jask (1620)"]);
assert.equal(
  GOTSKA_SANDON_CONFLICT_RENAMES["Batalla de Gotska Sand\u00f6n"],
  "Batalla naval de Gotska Sand\u00f6n (1563)"
);
const gotskaSandonDetail = GOTSKA_SANDON_CONFLICT_DETAIL_FIXES["Batalla naval de Gotska Sand\u00f6n (1563)"];
assert.equal(gotskaSandonDetail.parent, "Guerra N\u00f3rdica de los Siete A\u00f1os (1563-1570)");
assert.equal(gotskaSandonDetail.campaign, "Operaciones navales del B\u00e1ltico central de 1563");
assert.equal(gotskaSandonDetail.startYear, 1563);
assert.equal(gotskaSandonDetail.endYear, 1563);
assert.equal(gotskaSandonDetail.conflictType, "interestatal");
assert.match(gotskaSandonDetail.region, /Gotska Sand\u00f6n/);
assert.equal(gotskaSandonDetail.participants[0].members[0], "Reino de Suecia");
assert.equal(gotskaSandonDetail.participants[1].members[0], "Dinamarca-Noruega");
assert.equal(gotskaSandonDetail.sourceDispute, true);
assert.equal(gotskaSandonDetail.hierarchyConfidence, "alta");
assert.equal(gotskaSandonDetail.hierarchySources.length, 3);
assert.match(gotskaSandonDetail.datePrecision, /septiembre de 1563/i);
assert.match(gotskaSandonDetail.curationNote, /L\u00fcbeck/i);
assert.deepEqual(
  GOTSKA_SANDON_COUNTRY_CONFLICT_ADDITIONS.Dinamarca,
  ["Batalla naval de Gotska Sand\u00f6n (1563)"]
);
assert.equal(PIRANO_GRADO_CONFLICT_RENAMES["Batalla de Grado"], "Batalla naval de Pirano (1812)");
assert.equal(PIRANO_GRADO_CONFLICT_RENAMES["Batalla naval de PIrano (1812)"], "Batalla naval de Pirano (1812)");
const piranoGradoDetail = PIRANO_GRADO_CONFLICT_DETAIL_FIXES["Batalla naval de Pirano (1812)"];
assert.equal(piranoGradoDetail.parent, "Guerras napole\u00f3nicas (1803-1815)");
assert.equal(piranoGradoDetail.campaign, "Campa\u00f1a del Adri\u00e1tico (1807-1814)");
assert.equal(piranoGradoDetail.startYear, 1812);
assert.equal(piranoGradoDetail.endYear, 1812);
assert.equal(piranoGradoDetail.conflictType, "interestatal");
assert.match(piranoGradoDetail.region, /Pirano/);
assert.equal(piranoGradoDetail.participants[0].members[0], "Reino Unido de Gran Breta\u00f1a e Irlanda");
assert.equal(piranoGradoDetail.participants[1].members[0], "Primer Imperio franc\u00e9s");
assert.equal(piranoGradoDetail.sourceDispute, true);
assert.equal(piranoGradoDetail.hierarchyConfidence, "alta");
assert.equal(piranoGradoDetail.hierarchySources.length, 3);
assert.match(piranoGradoDetail.datePrecision, /22 de febrero de 1812/i);
assert.match(piranoGradoDetail.curationNote, /Eslovenia/i);
assert.deepEqual(
  PIRANO_GRADO_COUNTRY_CONFLICT_ADDITIONS.Italia,
  ["Batalla naval de Pirano (1812)"]
);
assert.deepEqual(
  PIRANO_GRADO_COUNTRY_CONFLICT_ADDITIONS.Eslovenia,
  ["Batalla naval de Pirano (1812)"]
);
const curatedPiranoName = curateConflictEntry({
  name: "Batalla naval de Pirano (1812)",
  startYear: 1812,
  endYear: 1812,
  type: "batalla naval"
});
assert.equal(curatedPiranoName.name, "Batalla naval de Pirano (1812)");
assert.equal(JAPAN_KOREA_FOLLOWUP_CONFLICT_DETAIL_FIXES["Acción naval de Happo (1592)"].type, "acción naval");
assert.equal(
  JAPAN_KOREA_FOLLOWUP_CONFLICT_DETAIL_FIXES["Ataque al fondeadero de Jeokjinpo (1592)"].type,
  "ataque a fondeadero"
);
assert.equal(
  JAPAN_KOREA_FOLLOWUP_CONFLICT_DETAIL_FIXES["Acción naval de Jangnimpo (1592)"].type,
  "acción naval"
);
assert.equal(
  JAPAN_KOREA_FOLLOWUP_CONFLICT_DETAIL_FIXES["Escaramuza naval de Eoranpo (1597)"].type,
  "escaramuza naval"
);
assert.equal(JAPAN_KOREA_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla naval de Busan (1592)"].sourceDispute, true);
assert.equal(JAPAN_KOREA_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla naval de Jeolido (1598)"].sourceDispute, true);
assert.deepEqual(
  JAPAN_KOREA_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla naval de Noryang (1598)"].participants[0].members,
  ["Reino de Joseon", "Imperio Ming"]
);
assert.ok(
  Object.values(JAPAN_KOREA_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent === "Invasiones japonesas de Corea (1592-1598)"
      && detail.war === detail.parent
      && detail.campaign
      && detail.region
      && detail.normalizedRegion === detail.region
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.chronology?.length >= 1
      && detail.chronology.every(event => event.year === detail.startYear && event.event)
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 2
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
      && detail.curationBatch === "source-backed-japan-korea-naval-followup-2026-07"
      && detail.curationNote
  ),
  "la tanda naval de Imjin debe conservar fechas, jerarquia, fuentes, participantes y cautelas editoriales"
);
assert.equal(Object.keys(FRANCE_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 12);
assert.equal(Object.keys(FRANCE_FOLLOWUP_SAFE_CONFLICT_RENAMES).length, 12);
assert.equal(FRANCE_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS["Reino Unido"].length, 9);
assert.deepEqual(FRANCE_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS.Rusia, [
  "Sitio de Bomarsund (1854)",
  "Batalla de Craonne (1814)",
  "Batalla de Golymin (1806)",
  "Batalla de Heilsberg (1807)"
]);
assert.equal(
  FRANCE_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Bantry Bay"],
  "Batalla naval de la bahía de Bantry (1689)"
);
assert.equal(
  FRANCE_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Chandannagar"],
  "Asedio y captura de Chandannagar (1757)"
);
assert.equal(FRANCE_FOLLOWUP_CONFLICT_DETAIL_FIXES["Sitio de Bomarsund (1854)"].type, "sitio y operación anfibia");
assert.equal(FRANCE_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Camaret (1694)"].type, "asalto anfibio");
assert.equal(FRANCE_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla naval de la bahía de Bantry (1689)"].sourceDispute, true);
assert.equal(FRANCE_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Heilsberg (1807)"].sourceDispute, true);
assert.equal(FRANCE_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla naval de la bahía de Chesapeake (1781)"].sourceDispute, true);
assert.ok(
  Object.values(FRANCE_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent
      && detail.war === detail.parent
      && !/^Conflicto regional de /i.test(detail.parent)
      && detail.campaign
      && detail.region
      && detail.normalizedRegion === detail.region
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.chronology?.length >= 2
      && detail.chronology.every(event => event.year === detail.startYear && event.event)
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 2
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
      && detail.curationBatch === "source-backed-france-followup-2026-07"
      && detail.curationNote
  ),
  "la tanda francesa debe conservar fecha, jerarquia, fuentes, participantes, narrativa y cautelas editoriales"
);
assert.equal(Object.keys(US_GLOBAL_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 9);
assert.equal(Object.keys(US_GLOBAL_FOLLOWUP_SAFE_CONFLICT_RENAMES).length, 10);
assert.deepEqual(US_GLOBAL_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS.México, [
  "Combate de Carrizal (1916)",
  "Batalla de Ambos Nogales (1918)"
]);
assert.equal(
  US_GLOBAL_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Shimonoseki Straits"],
  "Batalla naval del estrecho de Shimonoseki (1863)"
);
assert.equal(
  US_GLOBAL_FOLLOWUP_SAFE_CONFLICT_RENAMES["Bombardeo de Shimonoseki"],
  "Bombardeo multinacional de Shimonoseki (1864)"
);
assert.equal(
  US_GLOBAL_FOLLOWUP_SAFE_CONFLICT_RENAMES["Segunda batalla de San Juan"],
  "Bombardeo de San Juan de Puerto Rico (1898)"
);
assert.equal(
  US_GLOBAL_FOLLOWUP_SAFE_CONFLICT_RENAMES["Bombardeo de San Juan"],
  "Bombardeo de San Juan de Puerto Rico (1898)"
);
assert.equal(US_GLOBAL_FOLLOWUP_CONFLICT_DETAIL_FIXES["Combate de Carrizal (1916)"].type, "combate fronterizo");
assert.equal(US_GLOBAL_FOLLOWUP_CONFLICT_DETAIL_FIXES["Combate naval del lago Pontchartrain (1779)"].type, "combate naval");
assert.equal(US_GLOBAL_FOLLOWUP_CONFLICT_DETAIL_FIXES["Bombardeo de San Juan de Puerto Rico (1898)"].type, "bombardeo naval");
assert.equal(US_GLOBAL_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de la colina 282 (1950)"].sourceDispute, true);
assert.equal(US_GLOBAL_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Ambos Nogales (1918)"].sourceDispute, true);
assert.equal(US_GLOBAL_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Puerto Príncipe (1919)"].sourceDispute, true);
assert.ok(
  Object.values(US_GLOBAL_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent
      && detail.war === detail.parent
      && !/^Conflicto regional de /i.test(detail.parent)
      && detail.campaign
      && detail.region
      && detail.normalizedRegion === detail.region
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.chronology?.length >= 2
      && detail.chronology.every(event => event.year === detail.startYear && event.event)
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 2
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
      && detail.curationBatch === "source-backed-us-global-followup-2026-07"
      && detail.curationNote
  ),
  "la tanda estadounidense global debe conservar fecha, jerarquia, fuentes, participantes, narrativa y cautelas editoriales"
);
assert.equal(Object.keys(BRITISH_GLOBAL_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 8);
assert.equal(Object.keys(BRITISH_GLOBAL_FOLLOWUP_SAFE_CONFLICT_RENAMES).length, 10);
assert.deepEqual(BRITISH_GLOBAL_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS.Francia, [
  "Batalla de Carillon (1758)",
  "Batalla de Monongahela (1755)",
  "Batalla de Wandiwash (1760)"
]);
assert.equal(
  BRITISH_GLOBAL_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de la bahía de Heligoland"],
  "Batalla de la bahía de Heligoland (1914)"
);
assert.equal(
  BRITISH_GLOBAL_FOLLOWUP_SAFE_CONFLICT_RENAMES["Primera Batalla de Maryang San"],
  "Primera batalla de Maryang San (1951)"
);
assert.equal(BRITISH_GLOBAL_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Carillon (1758)"].type, "asalto a fortificacion");
assert.equal(BRITISH_GLOBAL_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Qurna (1914)"].type, "batalla fluvial");
assert.equal(BRITISH_GLOBAL_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla naval de Jumunjin (1950)"].type, "batalla naval");
assert.equal(BRITISH_GLOBAL_FOLLOWUP_CONFLICT_DETAIL_FIXES["Primera batalla de Maryang San (1951)"].parent, "Guerra de Corea");
assert.ok(
  Object.values(BRITISH_GLOBAL_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent
      && detail.war === detail.parent
      && !/^Conflicto regional de /i.test(detail.parent)
      && detail.campaign
      && detail.region
      && detail.normalizedRegion === detail.region
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.chronology?.length >= 2
      && detail.chronology.every(event => event.year === detail.startYear && event.event)
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 2
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
      && detail.curationBatch === "source-backed-british-global-followup-2026-07"
      && detail.curationNote
  ),
  "la tanda britanica global debe conservar fecha, jerarquia, fuentes, participantes, narrativa y notas editoriales"
);
assert.equal(Object.keys(PROVISIONAL_FOUNDATION_CONFLICT_DETAIL_FIXES).length, 7);
assert.equal(Object.keys(PROVISIONAL_FOUNDATION_SAFE_CONFLICT_RENAMES).length, 7);
assert.deepEqual(PROVISIONAL_FOUNDATION_COUNTRY_CONFLICT_ADDITIONS.Brasil, [
  "Asalto a los acorazados Cabral y Lima Barros (1868)"
]);
assert.equal(
  PROVISIONAL_FOUNDATION_SAFE_CONFLICT_RENAMES["Batalla de Heligoland"],
  "Batalla de Heligoland (1864)"
);
assert.equal(
  PROVISIONAL_FOUNDATION_SAFE_CONFLICT_RENAMES["Batalla de Solebay"],
  "Batalla de Solebay (1672)"
);
assert.equal(PROVISIONAL_FOUNDATION_CONFLICT_DETAIL_FIXES["Batalla de Dieppe (1942)"].parent, "Segunda Guerra Mundial");
assert.equal(PROVISIONAL_FOUNDATION_CONFLICT_DETAIL_FIXES["Batalla de Heligoland (1864)"].type, "batalla naval");
assert.equal(PROVISIONAL_FOUNDATION_CONFLICT_DETAIL_FIXES["Batalla de Rumaila (1991)"].sourceDispute, true);
assert.ok(
  Object.values(PROVISIONAL_FOUNDATION_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent
      && detail.war === detail.parent
      && !/^Conflicto regional de /i.test(detail.parent)
      && detail.campaign
      && detail.region
      && detail.normalizedRegion === detail.region
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.chronology?.length >= 2
      && detail.chronology.every(event => event.year === detail.startYear && event.event)
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 2
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
      && detail.curationBatch === "source-backed-provisional-foundation-2026-07"
      && detail.curationNote
  ),
  "la tanda provisional debe conservar fecha, jerarquia, fuentes, participantes, narrativa y cautelas editoriales"
);
assert.equal(Object.keys(NORDIC_BALTIC_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 8);
assert.equal(Object.keys(NORDIC_BALTIC_FOLLOWUP_SAFE_CONFLICT_RENAMES).length, 8);
assert.deepEqual(NORDIC_BALTIC_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS.Dinamarca, [
  "Batalla de Colberger Heide (1644)",
  "Batalla de Fehmarn (1644)",
  "Batalla de Dynekilen (1716)"
]);
assert.equal(
  NORDIC_BALTIC_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Klisz\u00f3w"],
  "Batalla de Klisz\u00f3w (1702)"
);
assert.equal(
  NORDIC_BALTIC_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de G\u00f3rzno (1629)"].parent,
  "Guerra polaco-sueca de 1626-1629"
);
assert.equal(
  NORDIC_BALTIC_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Hogland (1788)"].sourceDispute,
  true
);
assert.ok(
  Object.values(NORDIC_BALTIC_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent
      && detail.war === detail.parent
      && !/^Conflicto regional de /i.test(detail.parent)
      && detail.campaign
      && detail.region
      && detail.normalizedRegion === detail.region
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.chronology?.length >= 2
      && detail.chronology.every(event => event.year === detail.startYear && event.event)
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 2
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
      && detail.curationBatch === "source-backed-nordic-baltic-followup-2026-08"
      && detail.curationNote
  ),
  "la tanda nordica y baltica debe conservar fecha, jerarquia, fuentes, participantes, narrativa y cautelas editoriales"
);
assert.equal(Object.keys(POLISH_SWEDISH_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 6);
assert.equal(Object.keys(POLISH_SWEDISH_FOLLOWUP_SAFE_CONFLICT_RENAMES).length, 6);
assert.deepEqual(POLISH_SWEDISH_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS.Polonia, [
  "Batalla de Kokenhausen (1601)",
  "Batalla naval de Oliwa (1627)",
  "Batalla de Trzciana (1629)",
  "Batalla de Wojnicz (1655)",
  "Batalla de Warka (1656)",
  "Batalla de Prostki (1656)"
]);
assert.equal(
  POLISH_SWEDISH_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Prostken"],
  "Batalla de Prostki (1656)"
);
assert.equal(
  POLISH_SWEDISH_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla naval de Oliwa (1627)"].type,
  "batalla naval"
);
assert.equal(
  POLISH_SWEDISH_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Wojnicz (1655)"].parent,
  "Segunda Guerra N\u00f3rdica"
);
assert.equal(
  POLISH_SWEDISH_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Prostki (1656)"].sourceDispute,
  true
);
assert.ok(
  Object.values(POLISH_SWEDISH_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent
      && detail.war === detail.parent
      && !/^Conflicto regional de /i.test(detail.parent)
      && detail.campaign
      && detail.region
      && detail.normalizedRegion === detail.region
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.chronology?.length >= 2
      && detail.chronology.every(event => event.year === detail.startYear && event.event)
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 2
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
      && detail.curationBatch === "source-backed-polish-swedish-followup-2026-08"
      && detail.curationNote
  ),
  "la tanda polaco-sueca debe conservar fecha, jerarquia, fuentes, participantes, narrativa y cautelas editoriales"
);
assert.equal(Object.keys(POLISH_DELUGE_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 6);
assert.equal(Object.keys(POLISH_DELUGE_FOLLOWUP_SAFE_CONFLICT_RENAMES).length, 6);
assert.deepEqual(POLISH_DELUGE_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS.Polonia, [
  "Batalla de \u017barn\u00f3w (1655)",
  "Batalla de Krosno (1655)",
  "Batalla de Jaroslaw (1656)",
  "Batalla de Kozienice (1656)",
  "Batalla de Kcynia (1656)",
  "Batalla de Lubrze (1656)"
]);
assert.equal(
  POLISH_DELUGE_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Jaroslaw"],
  "Batalla de Jaroslaw (1656)"
);
assert.equal(
  POLISH_DELUGE_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Kozienice (1656)"].type,
  "combate de retaguardia"
);
assert.equal(
  POLISH_DELUGE_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Kcynia (1656)"].parent,
  "Segunda Guerra N\u00f3rdica"
);
assert.equal(
  POLISH_DELUGE_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Lubrze (1656)"].sourceDispute,
  true
);
assert.ok(
  Object.values(POLISH_DELUGE_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent
      && detail.war === detail.parent
      && !/^Conflicto regional de /i.test(detail.parent)
      && detail.campaign
      && detail.region
      && detail.normalizedRegion === detail.region
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.chronology?.length >= 2
      && detail.chronology.every(event => event.year === detail.startYear && event.event)
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 2
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
      && detail.curationBatch === "source-backed-polish-deluge-followup-2026-08"
      && detail.curationNote
  ),
  "la tanda del Diluvio debe conservar fecha, jerarquia, fuentes, participantes, narrativa y cautelas editoriales"
);
assert.equal(Object.keys(POLISH_DELUGE_SWEDISH_OPERATIONS_CONFLICT_DETAIL_FIXES).length, 6);
assert.equal(Object.keys(POLISH_DELUGE_SWEDISH_OPERATIONS_SAFE_CONFLICT_RENAMES).length, 6);
assert.deepEqual(POLISH_DELUGE_SWEDISH_OPERATIONS_COUNTRY_CONFLICT_ADDITIONS.Polonia, [
  "Batalla de Chojnice (1657)",
  "Batalla de Filip\u00f3w (1656)",
  "Batalla de Klecko (1656)",
  "Batalla de Lowicz (1656)",
  "Batalla de Nisko (1656)",
  "Batalla de Tykocin (1656)"
]);
assert.equal(
  POLISH_DELUGE_SWEDISH_OPERATIONS_SAFE_CONFLICT_RENAMES["Batalla de Klecko"],
  "Batalla de Klecko (1656)"
);
assert.equal(
  POLISH_DELUGE_SWEDISH_OPERATIONS_CONFLICT_DETAIL_FIXES["Batalla de Chojnice (1657)"].parent,
  "Segunda Guerra N\u00f3rdica"
);
assert.equal(
  POLISH_DELUGE_SWEDISH_OPERATIONS_CONFLICT_DETAIL_FIXES["Batalla de Tykocin (1656)"].type,
  "batalla de socorro"
);
assert.equal(
  POLISH_DELUGE_SWEDISH_OPERATIONS_CONFLICT_DETAIL_FIXES["Batalla de Nisko (1656)"].sourceDispute,
  true
);
assert.ok(
  Object.values(POLISH_DELUGE_SWEDISH_OPERATIONS_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent
      && detail.war === detail.parent
      && !/^Conflicto regional de /i.test(detail.parent)
      && detail.campaign
      && detail.region
      && detail.normalizedRegion === detail.region
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.chronology?.length >= 2
      && detail.chronology.every(event => event.year === detail.startYear && event.event)
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 2
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
      && detail.curationBatch === "source-backed-polish-deluge-swedish-operations-2026-08"
      && detail.curationNote
  ),
  "la tanda operativa sueco-polaca del Diluvio debe conservar fecha, jerarquia, fuentes, participantes, narrativa y cautelas editoriales"
);
assert.equal(Object.keys(SWEDISH_LIVONIAN_OPERATIONS_CONFLICT_DETAIL_FIXES).length, 6);
assert.equal(Object.keys(SWEDISH_LIVONIAN_OPERATIONS_SAFE_CONFLICT_RENAMES).length, 6);
assert.deepEqual(SWEDISH_LIVONIAN_OPERATIONS_COUNTRY_CONFLICT_ADDITIONS.Polonia, [
  "Batalla de Karksi (1600)",
  "Batalla de Daugavgriva (1609)",
  "Batalla de Weissenstein (1604)",
  "Batalla de Reval (1602)",
  "Batalla de Kroppenhof (1621)",
  "Batalla de Wallhof (1626)"
]);
assert.equal(
  SWEDISH_LIVONIAN_OPERATIONS_SAFE_CONFLICT_RENAMES["Batalla de Reval"],
  "Batalla de Reval (1602)"
);
assert.equal(
  SWEDISH_LIVONIAN_OPERATIONS_CONFLICT_DETAIL_FIXES["Batalla de Karksi (1600)"].parent,
  "Guerra polaco-sueca de 1600-1611"
);
assert.equal(
  SWEDISH_LIVONIAN_OPERATIONS_CONFLICT_DETAIL_FIXES["Batalla de Wallhof (1626)"].type,
  "emboscada"
);
assert.equal(
  SWEDISH_LIVONIAN_OPERATIONS_CONFLICT_DETAIL_FIXES["Batalla de Daugavgriva (1609)"].sourceDispute,
  true
);
assert.ok(
  Object.values(SWEDISH_LIVONIAN_OPERATIONS_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent
      && detail.war === detail.parent
      && !/^Conflicto regional de /i.test(detail.parent)
      && detail.campaign
      && detail.region
      && detail.normalizedRegion === detail.region
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.chronology?.length >= 2
      && detail.chronology.every(event => event.year === detail.startYear && event.event)
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 2
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
      && detail.curationBatch === "source-backed-swedish-livonian-operations-2026-08"
      && detail.curationNote
  ),
  "la tanda sueco-livonia debe conservar fecha, jerarquia, fuentes, participantes, narrativa y cautelas editoriales"
);
assert.equal(Object.keys(FINNISH_THEATER_OPERATIONS_CONFLICT_DETAIL_FIXES).length, 5);
assert.equal(Object.keys(FINNISH_THEATER_OPERATIONS_SAFE_CONFLICT_RENAMES).length, 5);
assert.deepEqual(FINNISH_THEATER_OPERATIONS_COUNTRY_CONFLICT_ADDITIONS.Finlandia, [
  "Batalla de Bockholmssund (1808)",
  "Batalla de Gr\u00f6nvikssund (1808)",
  "Batalla del estrecho de Kimito (1808)",
  "Batalla de Siikajoki (1808)",
  "Batalla de Napue (1714)"
]);
assert.deepEqual(
  FINNISH_THEATER_OPERATIONS_COUNTRY_CONFLICT_ADDITIONS.Rusia,
  FINNISH_THEATER_OPERATIONS_COUNTRY_CONFLICT_ADDITIONS.Finlandia
);
assert.equal(
  FINNISH_THEATER_OPERATIONS_SAFE_CONFLICT_RENAMES["Batalla de Kimito Strait"],
  "Batalla del estrecho de Kimito (1808)"
);
assert.equal(
  FINNISH_THEATER_OPERATIONS_CONFLICT_DETAIL_FIXES["Batalla de Siikajoki (1808)"].parent,
  "Guerra de Finlandia (1808-1809)"
);
assert.equal(
  FINNISH_THEATER_OPERATIONS_CONFLICT_DETAIL_FIXES["Batalla de Napue (1714)"].parent,
  "Gran Guerra del Norte"
);
assert.equal(
  FINNISH_THEATER_OPERATIONS_CONFLICT_DETAIL_FIXES["Batalla de Napue (1714)"].sourceDispute,
  true
);
assert.ok(
  Object.values(FINNISH_THEATER_OPERATIONS_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent
      && detail.war === detail.parent
      && !/^Conflicto regional de /i.test(detail.parent)
      && detail.campaign
      && detail.region
      && detail.normalizedRegion === detail.region
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.chronology?.length >= 2
      && detail.chronology.every(event => event.year === detail.startYear && event.event)
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 2
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
      && detail.curationBatch === "source-backed-finnish-theater-operations-2026-08"
      && detail.curationNote
  ),
  "la tanda del teatro finlandes debe conservar fecha, jerarquia, fuentes, participantes, narrativa y cautelas editoriales"
);
assert.equal(
  (await resolveWikipediaConflictTitle("Batalla de Gr\u00f6nvikssund (1808)")).pageTitle,
  "Battle_of_Gr\u00f6nvikssund"
);
assert.equal(
  (await resolveWikipediaConflictTitle("Batalla de Siikajoki (1808)")).pageTitle,
  "Battle_of_Siikajoki"
);
assert.equal(
  (await resolveWikipediaConflictTitle("Batalla de Napue (1714)")).pageTitle,
  "Battle_of_Napue"
);
assert.equal(Object.keys(NORDIC_SOVEREIGNTY_CONFLICT_DETAIL_FIXES).length, 5);
assert.equal(Object.keys(NORDIC_SOVEREIGNTY_SAFE_CONFLICT_RENAMES).length, 5);
assert.deepEqual(NORDIC_SOVEREIGNTY_COUNTRY_CONFLICT_ADDITIONS.Dinamarca, [
  "Batalla de Assandun (1016)",
  "Batalla de Helge\u00e5 (1026)",
  "Batalla de Kringen (1612)",
  "Rebeli\u00f3n de Bornholm (1658)"
]);
assert.equal(
  NORDIC_SOVEREIGNTY_SAFE_CONFLICT_RENAMES["Batalla de Bornholm"],
  "Rebeli\u00f3n de Bornholm (1658)"
);
assert.equal(
  NORDIC_SOVEREIGNTY_CONFLICT_DETAIL_FIXES["Batalla de Kringen (1612)"].parent,
  "Guerra de Kalmar (1611-1613)"
);
assert.equal(
  NORDIC_SOVEREIGNTY_CONFLICT_DETAIL_FIXES["Batalla de Helge\u00e5 (1026)"].sourceDispute,
  true
);
assert.ok(
  Object.values(NORDIC_SOVEREIGNTY_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent
      && detail.war === detail.parent
      && !/^Conflicto regional de /i.test(detail.parent)
      && detail.campaign
      && detail.region
      && detail.normalizedRegion === detail.region
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.chronology?.length >= 2
      && detail.chronology.every(event => event.year === detail.startYear && event.event)
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 2
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
      && detail.curationBatch === "source-backed-nordic-sovereignty-2026-08"
      && detail.curationNote
  ),
  "la tanda nordica de soberania debe conservar fecha, jerarquia, fuentes, participantes, narrativa y cautelas editoriales"
);
for (const [name, pageTitle] of [
  ["Batalla de Assandun (1016)", "Battle_of_Assandun"],
  ["Batalla de Helge\u00e5 (1026)", "Battle_of_Helge\u00e5"],
  ["Batalla de Largs (1263)", "Battle_of_Largs"],
  ["Batalla de Kringen (1612)", "Battle_of_Kringen"],
  ["Rebeli\u00f3n de Bornholm (1658)", "Bornholm_uprising"]
]) {
  assert.equal((await resolveWikipediaConflictTitle(name)).pageTitle, pageTitle);
}
assert.equal(Object.keys(GLOBAL_LANDMARKS_CONFLICT_DETAIL_FIXES).length, 5);
assert.equal(Object.keys(GLOBAL_LANDMARKS_SAFE_CONFLICT_RENAMES).length, 5);
assert.deepEqual(GLOBAL_LANDMARKS_COUNTRY_CONFLICT_ADDITIONS.Irak, [
  "Batalla a\u00e9rea de Samurra (1991)",
  "Batalla de Danny Boy (2004)"
]);
assert.equal(
  GLOBAL_LANDMARKS_SAFE_CONFLICT_RENAMES["Combate de Top Malo House"],
  "Combate de Top Malo House (1982)"
);
assert.equal(
  GLOBAL_LANDMARKS_CONFLICT_DETAIL_FIXES["Batalla de Pichincha (1822)"].parent,
  "Guerra de independencia de Quito (1820-1822)"
);
assert.equal(
  GLOBAL_LANDMARKS_CONFLICT_DETAIL_FIXES["Batalla a\u00e9rea de Samurra (1991)"].sourceDispute,
  true
);
assert.ok(
  Object.values(GLOBAL_LANDMARKS_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent
      && detail.war === detail.parent
      && !/^Conflicto regional de /i.test(detail.parent)
      && detail.campaign
      && detail.region
      && detail.normalizedRegion === detail.region
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.chronology?.length >= 2
      && detail.chronology.every(event => event.year === detail.startYear && event.event)
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 2
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
      && detail.curationBatch === "source-backed-global-landmarks-2026-08"
      && detail.curationNote
  ),
  "la tanda global debe conservar fecha, jerarquia, fuentes, participantes, narrativa y cautelas editoriales"
);
for (const [name, pageTitle] of [
  ["Batalla a\u00e9rea de Samurra (1991)", "Samurra_Air_Battle"],
  ["Batalla de Danny Boy (2004)", "Battle_of_Danny_Boy"],
  ["Batalla de Tafilah (1918)", "Battle_of_Tafilah"],
  ["Combate de Top Malo House (1982)", "Skirmish_at_Top_Malo_House"],
  ["Batalla de Pichincha (1822)", "Battle_of_Pichincha"]
]) {
  assert.equal((await resolveWikipediaConflictTitle(name)).pageTitle, pageTitle);
}
assert.equal(Object.keys(GLOBAL_HISTORICAL_OPERATIONS_CONFLICT_DETAIL_FIXES).length, 5);
assert.equal(Object.keys(GLOBAL_HISTORICAL_OPERATIONS_SAFE_CONFLICT_RENAMES).length, 5);
assert.deepEqual(GLOBAL_HISTORICAL_OPERATIONS_COUNTRY_CONFLICT_ADDITIONS["Rep\u00fablica Popular China"], [
  "Batalla de Palikao (1860)",
  "Batalla de Tamsui (1884)"
]);
assert.equal(
  GLOBAL_HISTORICAL_OPERATIONS_SAFE_CONFLICT_RENAMES["Batalla de Diu"],
  "Batalla de Diu (1509)"
);
assert.equal(
  GLOBAL_HISTORICAL_OPERATIONS_CONFLICT_DETAIL_FIXES["Batalla de San Jacinto (1836)"].parent,
  "Revoluci\u00f3n de Texas (1835-1836)"
);
assert.equal(
  GLOBAL_HISTORICAL_OPERATIONS_CONFLICT_DETAIL_FIXES["Batalla de Diu (1509)"].sourceDispute,
  true
);
assert.ok(
  Object.values(GLOBAL_HISTORICAL_OPERATIONS_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent
      && detail.war === detail.parent
      && !/^Conflicto regional de /i.test(detail.parent)
      && detail.campaign
      && detail.region
      && detail.normalizedRegion === detail.region
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.chronology?.length >= 2
      && detail.chronology.every(event => event.year === detail.startYear && event.event)
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 2
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
      && detail.curationBatch === "source-backed-global-historical-operations-2026-08"
      && detail.curationNote
  ),
  "la tanda global historica debe conservar fecha, jerarquia, fuentes, participantes, narrativa y cautelas editoriales"
);
for (const [name, pageTitle] of [
  ["Batalla de Diu (1509)", "Battle_of_Diu"],
  ["Batalla de Palikao (1860)", "Battle_of_Palikao"],
  ["Batalla de Tamsui (1884)", "Battle_of_Tamsui"],
  ["Batalla de San Jacinto (1836)", "Battle_of_San_Jacinto"],
  ["Segunda batalla de Schooneveld (1673)", "Battle_of_Schooneveld"]
]) {
  assert.equal((await resolveWikipediaConflictTitle(name)).pageTitle, pageTitle);
}
assert.equal(Object.keys(GLOBAL_SOURCE_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 6);
assert.equal(Object.keys(GLOBAL_SOURCE_FOLLOWUP_SAFE_CONFLICT_RENAMES).length, 6);
assert.deepEqual(GLOBAL_SOURCE_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS.India, [
  "Batalla de Sadras (1782)",
  "Batalla de Negapatam (1782)"
]);
assert.equal(
  GLOBAL_SOURCE_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Gonz\u00e1lez"],
  "Batalla de Gonzales (1835)"
);
assert.equal(
  GLOBAL_SOURCE_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de los T\u00faneles Gemelos (1951)"].parent,
  "Guerra de Corea"
);
assert.ok(
  Object.values(GLOBAL_SOURCE_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent
      && detail.war === detail.parent
      && !/^Conflicto regional de /i.test(detail.parent)
      && detail.campaign
      && detail.region
      && detail.normalizedRegion === detail.region
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.chronology?.length >= 2
      && detail.chronology.every(event => event.year === detail.startYear && event.event)
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 2
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
      && detail.curationBatch === "source-backed-global-source-followup-2026-08"
      && detail.curationNote
  ),
  "la tanda global de seguimiento debe conservar fecha, jerarquia, fuentes, participantes, narrativa y cautelas editoriales"
);
for (const [name, pageTitle] of [
  ["Batalla de Gonzales (1835)", "Battle_of_Gonzales"],
  ["Batalla de los T\u00faneles Gemelos (1951)", "Battle_of_the_Twin_Tunnels"],
  ["Batalla de Sadras (1782)", "Battle_of_Sadras"],
  ["Batalla de Providien (1782)", "Battle_of_Providien"],
  ["Batalla de Negapatam (1782)", "Battle_of_Negapatam_(1782)"],
  ["Batalla de Pulo Aura (1804)", "Battle_of_Pulo_Aura"]
]) {
  assert.equal((await resolveWikipediaConflictTitle(name)).pageTitle, pageTitle);
}
assert.equal(Object.keys(NORDIC_ASIA_SOURCE_BATCH_CONFLICT_DETAIL_FIXES).length, 5);
assert.equal(Object.keys(NORDIC_ASIA_SOURCE_BATCH_SAFE_CONFLICT_RENAMES).length, 5);
assert.deepEqual(NORDIC_ASIA_SOURCE_BATCH_COUNTRY_CONFLICT_ADDITIONS.Finlandia, [
  "Primera batalla de Svensksund (1789)",
  "Batalla de Fredrikshamn (1790)",
  "Batalla de Pet\u00e4j\u00e4saari (1940)"
]);
assert.equal(
  NORDIC_ASIA_SOURCE_BATCH_SAFE_CONFLICT_RENAMES["Segunda batalla de Fredrikshamn"],
  "Batalla de Fredrikshamn (1790)"
);
assert.equal(
  NORDIC_ASIA_SOURCE_BATCH_CONFLICT_DETAIL_FIXES["Batalla de Pet\u00e4j\u00e4saari (1940)"].parent,
  "Guerra de Invierno"
);
assert.ok(
  Object.values(NORDIC_ASIA_SOURCE_BATCH_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent
      && detail.war === detail.parent
      && !/^Conflicto regional de /i.test(detail.parent)
      && detail.campaign
      && detail.region
      && detail.normalizedRegion === detail.region
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.chronology?.length >= 2
      && detail.chronology.every(event => event.year === detail.startYear && event.event)
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 2
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
      && detail.curationBatch === "source-backed-nordic-asia-followup-2026-08"
      && detail.curationNote
  ),
  "la tanda nordica y asiatica debe conservar fecha, jerarquia, fuentes, participantes, narrativa y cautelas editoriales"
);
for (const [name, pageTitle] of [
  ["Primera batalla de Svensksund (1789)", "Battle_of_Svensksund_(1789)"],
  ["Batalla de Fredrikshamn (1790)", "Battle_of_Fredrikshamn"],
  ["Batalla de Nui Le (1971)", "Battle_of_Nui_Le"],
  ["Batalla de Long Jawai (1963)", "Battle_of_Long_Jawai"]
]) {
  assert.equal((await resolveWikipediaConflictTitle(name)).pageTitle, pageTitle);
}
assert.equal(Object.keys(ASIA_AFRICA_HISTORICAL_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 6);
assert.equal(Object.keys(ASIA_AFRICA_HISTORICAL_FOLLOWUP_SAFE_CONFLICT_RENAMES).length, 5);
assert.deepEqual(ASIA_AFRICA_HISTORICAL_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS.Rusia, [
  "Conflicto fronterizo sino-sovi\u00e9tico",
  "Primera batalla de Zhenbao (1969)",
  "Segunda batalla de Zhenbao (1969)"
]);
assert.equal(
  ASIA_AFRICA_HISTORICAL_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Kouss\u00e9ri"],
  "Batalla de Kouss\u00e9ri (1900)"
);
assert.equal(
  ASIA_AFRICA_HISTORICAL_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Thu\u1eadn An (1883)"].parent,
  "Campa\u00f1a de Tonkin (1883-1886)"
);
assert.equal(
  ASIA_AFRICA_HISTORICAL_FOLLOWUP_CONFLICT_DETAIL_FIXES["Conflicto fronterizo sino-sovi\u00e9tico"].parent,
  "Ruptura sino-sovi\u00e9tica"
);
assert.ok(
  Object.values(ASIA_AFRICA_HISTORICAL_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent
      && detail.war === detail.parent
      && !/^Conflicto regional de /i.test(detail.parent)
      && detail.campaign
      && detail.region
      && detail.normalizedRegion === detail.region
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.chronology?.length >= 2
      && detail.chronology.every(event => event.year === detail.startYear && event.event)
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 2
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
      && detail.curationBatch === "source-backed-asia-africa-historical-followup-2026-08"
      && detail.curationNote
  ),
  "la tanda asiatica y africana debe conservar fecha, jerarquia, fuentes, participantes, narrativa y cautelas editoriales"
);
for (const [name, pageTitle] of [
  ["Batalla de Suoi Chau Pha (1967)", "Battle_of_Suoi_Chau_Pha"],
  ["Primera batalla de Zhenbao (1969)", "Conflicto_fronterizo_sino-sovi\u00e9tico"],
  ["Segunda batalla de Zhenbao (1969)", "Conflicto_fronterizo_sino-sovi\u00e9tico"],
  ["Batalla de Kouss\u00e9ri (1900)", "Battle_of_Kouss\u00e9ri"],
  ["Batalla de Thu\u1eadn An (1883)", "Battle_of_Thu\u1eadn_An"]
]) {
  assert.equal((await resolveWikipediaConflictTitle(name)).pageTitle, pageTitle);
}
assert.equal(Object.keys(EUROPEAN_HISTORICAL_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 4);
assert.equal(Object.keys(EUROPEAN_HISTORICAL_FOLLOWUP_SAFE_CONFLICT_RENAMES).length, 4);
assert.deepEqual(EUROPEAN_HISTORICAL_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS.Polonia, [
  "Batalla de Sejny (1920)"
]);
assert.deepEqual(EUROPEAN_HISTORICAL_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS.Alemania, [
  "Batalla de Vlotho (1638)"
]);
assert.equal(
  EUROPEAN_HISTORICAL_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla de Sejny"],
  "Batalla de Sejny (1920)"
);
assert.equal(
  EUROPEAN_HISTORICAL_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de \u015awiecino (1462)"].parent,
  "Guerra de los Trece A\u00f1os polaco-teut\u00f3nica (1454-1466)"
);
assert.equal(
  EUROPEAN_HISTORICAL_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Zawichost (1205)"].treaties.length,
  0
);
assert.ok(
  Object.values(EUROPEAN_HISTORICAL_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent
      && detail.war === detail.parent
      && !/^Conflicto regional de /i.test(detail.parent)
      && detail.campaign
      && detail.region
      && detail.normalizedRegion === detail.region
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.chronology?.length >= 2
      && detail.chronology.every(event => event.year === detail.startYear && event.event)
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 2
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
      && detail.curationBatch === "source-backed-european-historical-followup-2026-08"
      && detail.curationNote
  ),
  "la tanda europea debe conservar fecha, jerarquia, fuentes, participantes, narrativa y cautelas editoriales"
);
for (const [name, pageTitle] of [
  ["Batalla de Sejny (1920)", "Battle_of_Sejny"],
  ["Batalla de \u015awiecino (1462)", "Battle_of_\u015awiecino"],
  ["Batalla de Vlotho (1638)", "Battle_of_Vlotho"],
  ["Batalla de Zawichost (1205)", "Battle_of_Zawichost"]
]) {
  assert.equal((await resolveWikipediaConflictTitle(name)).pageTitle, pageTitle);
}
assert.equal(Object.keys(MARITIME_AMERICAS_FOLLOWUP_CONFLICT_DETAIL_FIXES).length, 4);
assert.equal(Object.keys(MARITIME_AMERICAS_FOLLOWUP_SAFE_CONFLICT_RENAMES).length, 4);
assert.deepEqual(MARITIME_AMERICAS_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS["Reino Unido"], [
  "Batalla del cabo Henry (1781)",
  "Batalla de Tory Island (1798)",
  "Batalla del cabo Ortegal (1805)"
]);
assert.deepEqual(MARITIME_AMERICAS_FOLLOWUP_COUNTRY_CONFLICT_ADDITIONS["M\u00e9xico"], [
  "Primera batalla de Agua Prieta (1911)"
]);
assert.equal(
  MARITIME_AMERICAS_FOLLOWUP_SAFE_CONFLICT_RENAMES["Batalla del Cabo Ortegal"],
  "Batalla del cabo Ortegal (1805)"
);
assert.equal(
  MARITIME_AMERICAS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla de Tory Island (1798)"].parent,
  "Guerras revolucionarias francesas (1792-1802)"
);
assert.equal(
  MARITIME_AMERICAS_FOLLOWUP_CONFLICT_DETAIL_FIXES["Batalla del cabo Ortegal (1805)"].treaties.length,
  0
);
assert.ok(
  Object.values(MARITIME_AMERICAS_FOLLOWUP_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent
      && detail.war === detail.parent
      && !/^Conflicto regional de /i.test(detail.parent)
      && detail.campaign
      && detail.region
      && detail.normalizedRegion === detail.region
      && detail.cause
      && detail.outcome
      && detail.consequences
      && detail.chronology?.length >= 2
      && detail.chronology.every(event => event.year === detail.startYear && event.event)
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 2
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties)
      && detail.curationBatch === "source-backed-maritime-americas-followup-2026-08"
      && detail.curationNote
      && detail.sourceDispute
  ),
  "la tanda maritima y americana debe conservar fecha, jerarquia, fuentes, participantes, narrativa y cautelas editoriales"
);
for (const [name, pageTitle] of [
  ["Batalla del cabo Henry (1781)", "Battle_of_Cape_Henry"],
  ["Batalla de Tory Island (1798)", "Battle_of_Tory_Island"],
  ["Batalla del cabo Ortegal (1805)", "Battle_of_Cape_Ortegal"],
  ["Primera batalla de Agua Prieta (1911)", "First_Battle_of_Agua_Prieta"]
]) {
  assert.equal((await resolveWikipediaConflictTitle(name)).pageTitle, pageTitle);
}
assert.equal(Object.keys(DEBRECEN_1944_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(DEBRECEN_1944_SAFE_CONFLICT_RENAMES["Batalla de Debrecen"], "Batalla de Debrecen (1944)");
assert.deepEqual(DEBRECEN_1944_COUNTRY_CONFLICT_ADDITIONS.Rusia, ["Batalla de Debrecen (1944)"]);
assert.equal(DEBRECEN_1944_CONFLICT_DETAIL_FIXES["Batalla de Debrecen (1944)"].parent, "Segunda Guerra Mundial");
assert.ok(
  DEBRECEN_1944_CONFLICT_DETAIL_FIXES["Batalla de Debrecen (1944)"].hierarchySources?.length >= 2
    && DEBRECEN_1944_CONFLICT_DETAIL_FIXES["Batalla de Debrecen (1944)"].sourceDispute,
  "Debrecen debe conservar fuentes y cautela sobre su resultado operacional"
);
assert.equal((await resolveWikipediaConflictTitle("Batalla de Debrecen (1944)")).pageTitle, "Batalla_de_Debrecen");
assert.equal(Object.keys(PRIORITY_SAFE_BATCH_CONFLICT_DETAIL_FIXES).length, 3);
assert.equal(
  PRIORITY_SAFE_BATCH_CONFLICT_RENAMES["Batalla de las Islas Paracelso"],
  "Batalla de las Islas Paracelso (1974)"
);
assert.deepEqual(PRIORITY_SAFE_BATCH_COUNTRY_CONFLICT_ADDITIONS.Rusia, ["Batalla de St\u00e4ket (1719)"]);
assert.equal(
  PRIORITY_SAFE_BATCH_CONFLICT_DETAIL_FIXES["Batalla de St\u00e4ket (1719)"].parent,
  "Gran Guerra del Norte"
);
assert.equal(
  PRIORITY_SAFE_BATCH_CONFLICT_DETAIL_FIXES["Batalla por el Castillo Itter (1945)"].parent,
  "Segunda Guerra Mundial"
);
assert.ok(
  Object.values(PRIORITY_SAFE_BATCH_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent === detail.war
      && detail.campaign
      && detail.hierarchySources?.length >= 1
      && detail.participants?.length === 2
      && detail.chronology?.length >= 2
      && detail.sourceDispute
  ),
  "la tanda prioritaria debe conservar fecha, jerarquia, fuentes, participantes y cautelas"
);
for (const [name, pageTitle] of [
  ["Batalla de las Islas Paracelso (1974)", "Battle_of_the_Paracel_Islands"],
  ["Batalla de St\u00e4ket (1719)", "Battle_of_St\u00e4ket"],
  ["Batalla por el Castillo Itter (1945)", "Battle_for_Castle_Itter"]
]) {
  assert.equal((await resolveWikipediaConflictTitle(name)).pageTitle, pageTitle);
}
assert.equal(Object.keys(PROVISIONAL_SOURCE_BATCH_CONFLICT_DETAIL_FIXES).length, 3);
assert.equal(
  PROVISIONAL_SOURCE_BATCH_CONFLICT_RENAMES["Combate naval de Casma"],
  "Combate naval de Casma (1839)"
);
assert.equal(
  PROVISIONAL_SOURCE_BATCH_CONFLICT_RENAMES["Batalla de Predeal Pass"],
  "Batalla del paso de Predeal (1916)"
);
assert.deepEqual(
  PROVISIONAL_SOURCE_BATCH_COUNTRY_CONFLICT_ADDITIONS["Per\u00fa"],
  ["Combate naval de Casma (1839)"]
);
assert.equal(
  PROVISIONAL_SOURCE_BATCH_CONFLICT_DETAIL_FIXES["Batalla de Rabos\u00e9e (1914)"].parent,
  "Primera Guerra Mundial"
);
assert.match(
  PROVISIONAL_SOURCE_BATCH_CONFLICT_DETAIL_FIXES["Combate naval de Casma (1839)"].hierarchySources[0].url,
  /confederaci%6Fn-peru-boliviana/,
  "las URLs de fuente no deben ser alteradas por la normalizacion visible"
);
assert.ok(
  Object.values(PROVISIONAL_SOURCE_BATCH_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent === detail.war
      && detail.campaign
      && detail.hierarchySources?.length >= 2
      && detail.participants?.length === 2
      && detail.chronology?.length >= 2
      && detail.sourceDispute
  ),
  "la tanda de fuentes provisionales debe conservar fecha, jerarquia, fuentes, participantes y cautelas"
);
for (const [name, pageTitle] of [
  ["Combate naval de Casma (1839)", "Combate_naval_de_Casma"],
  ["Batalla del paso de Predeal (1916)", "Battle_of_Predeal_Pass"]
]) {
  assert.equal((await resolveWikipediaConflictTitle(name)).pageTitle, pageTitle);
}
assert.equal(Object.keys(NORTH_ATLANTIC_PROVISIONAL_CONFLICT_DETAIL_FIXES).length, 2);
assert.equal(
  NORTH_ATLANTIC_PROVISIONAL_CONFLICT_RENAMES["Batalla de Signal Hill"],
  "Batalla de Signal Hill (1762)"
);
assert.equal(
  NORTH_ATLANTIC_PROVISIONAL_CONFLICT_RENAMES["Batalla de Zealand Point"],
  "Batalla de Sjaellands Odde (1808)"
);
assert.deepEqual(
  NORTH_ATLANTIC_PROVISIONAL_COUNTRY_CONFLICT_ADDITIONS["Reino Unido"],
  ["Batalla de Signal Hill (1762)", "Batalla de Sjaellands Odde (1808)"]
);
assert.equal(
  NORTH_ATLANTIC_PROVISIONAL_CONFLICT_DETAIL_FIXES["Batalla de Signal Hill (1762)"].parent,
  "Guerra de los Siete A\u00f1os (1756-1763)"
);
assert.equal(
  NORTH_ATLANTIC_PROVISIONAL_CONFLICT_DETAIL_FIXES["Batalla de Sjaellands Odde (1808)"].parent,
  "Guerra de las Ca\u00f1oneras (1807-1814)"
);
assert.ok(
  Object.values(NORTH_ATLANTIC_PROVISIONAL_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent === detail.war
      && detail.campaign
      && detail.hierarchySources?.length >= 2
      && detail.participants?.length === 2
      && detail.chronology?.length >= 2
      && detail.sourceDispute
  ),
  "la tanda del Atlantico norte debe conservar fecha, jerarquia, fuentes, participantes y cautelas"
);
for (const [name, pageTitle] of [
  ["Batalla de Signal Hill (1762)", "Battle_of_Signal_Hill"],
  ["Batalla de Sjaellands Odde (1808)", "Battle_of_Zealand_Point"]
]) {
  assert.equal((await resolveWikipediaConflictTitle(name)).pageTitle, pageTitle);
}
assert.equal(Object.keys(CAMPECHE_ANTIVARI_CONFLICT_DETAIL_FIXES).length, 2);
assert.equal(
  CAMPECHE_ANTIVARI_CONFLICT_RENAMES["Batalla de Campeche"],
  "Batalla naval de Campeche (1843)"
);
assert.equal(
  CAMPECHE_ANTIVARI_CONFLICT_RENAMES["Batalla de Antivari"],
  "Batalla de Antivari (1914)"
);
assert.deepEqual(
  CAMPECHE_ANTIVARI_COUNTRY_CONFLICT_ADDITIONS["Reino Unido"],
  ["Batalla de Antivari (1914)"]
);
assert.equal(
  CAMPECHE_ANTIVARI_CONFLICT_DETAIL_FIXES["Batalla naval de Campeche (1843)"].parent,
  "Conflicto entre el gobierno central de M\u00e9xico y Yucat\u00e1n"
);
assert.equal(
  CAMPECHE_ANTIVARI_CONFLICT_DETAIL_FIXES["Batalla de Antivari (1914)"].parent,
  "Primera Guerra Mundial"
);
assert.ok(
  Object.values(CAMPECHE_ANTIVARI_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent === detail.war
      && detail.campaign
      && detail.hierarchySources?.length >= 2
      && detail.participants?.length === 2
      && detail.chronology?.length >= 2
      && detail.sourceDispute
  ),
  "la tanda Campeche-Antivari debe conservar fecha, jerarquia, fuentes, participantes y cautelas"
);
for (const [name, pageTitle] of [
  ["Batalla naval de Campeche (1843)", "Naval_Battle_of_Campeche"],
  ["Batalla de Antivari (1914)", "Battle_of_Antivari"]
]) {
  assert.equal((await resolveWikipediaConflictTitle(name)).pageTitle, pageTitle);
}
assert.equal(Object.keys(FLINT_DOGGER_CONFLICT_DETAIL_FIXES).length, 2);
assert.equal(
  FLINT_DOGGER_CONFLICT_RENAMES["Batalla de Flint Creek"],
  "Batalla de Flint Creek (1789)"
);
assert.equal(
  FLINT_DOGGER_CONFLICT_RENAMES["Batalla de Dogger Bank"],
  "Batalla de Dogger Bank (1781)"
);
assert.deepEqual(
  FLINT_DOGGER_COUNTRY_CONFLICT_ADDITIONS["Reino de los Pa\u00edses Bajos"],
  ["Batalla de Dogger Bank (1781)"]
);
assert.deepEqual(
  FLINT_DOGGER_COUNTRY_CONFLICT_EXCLUSIONS.Dinamarca,
  ["Batalla de Dogger Bank", "Batalla de Dogger Bank (1781)"]
);
assert.equal(
  FLINT_DOGGER_CONFLICT_DETAIL_FIXES["Batalla de Flint Creek (1789)"].parent,
  "Guerras cheroqui-estadounidenses (1776-1794)"
);
assert.equal(
  FLINT_DOGGER_CONFLICT_DETAIL_FIXES["Batalla de Dogger Bank (1781)"].parent,
  "Cuarta guerra anglo-neerlandesa (1780-1784)"
);
assert.ok(
  Object.values(FLINT_DOGGER_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent === detail.war
      && detail.campaign
      && detail.hierarchySources?.length >= 2
      && detail.participants?.length === 2
      && detail.chronology?.length >= 2
      && detail.sourceDispute
  ),
  "la tanda Flint-Dogger debe conservar fecha, jerarquia, fuentes, participantes y cautelas"
);
for (const [name, pageTitle] of [
  ["Batalla de Flint Creek (1789)", "Battle_of_Flint_Creek"],
  ["Batalla de Dogger Bank (1781)", "Battle_of_Dogger_Bank_(1781)"]
]) {
  assert.equal((await resolveWikipediaConflictTitle(name)).pageTitle, pageTitle);
}
assert.equal(Object.keys(DASMAN_RACHADO_CONFLICT_DETAIL_FIXES).length, 2);
assert.equal(
  DASMAN_RACHADO_CONFLICT_RENAMES["Batalla de Dasman Palace"],
  "Batalla del palacio Dasman (1990)"
);
assert.equal(
  DASMAN_RACHADO_CONFLICT_RENAMES["Batalla de Cabo Rachado"],
  "Batalla de Cabo Rachado (1606)"
);
assert.deepEqual(
  DASMAN_RACHADO_COUNTRY_CONFLICT_ADDITIONS.Irak,
  ["Batalla del palacio Dasman (1990)"]
);
assert.deepEqual(
  DASMAN_RACHADO_COUNTRY_CONFLICT_ADDITIONS["Reino de los Pa\u00edses Bajos"],
  ["Batalla de Cabo Rachado (1606)"]
);
assert.deepEqual(
  DASMAN_RACHADO_COUNTRY_CONFLICT_EXCLUSIONS["Estados Unidos"],
  ["Batalla de Dasman Palace", "Batalla del palacio Dasman (1990)"]
);
assert.equal(
  DASMAN_RACHADO_CONFLICT_DETAIL_FIXES["Batalla del palacio Dasman (1990)"].parent,
  "Invasi\u00f3n iraqu\u00ed de Kuwait (1990)"
);
assert.equal(
  DASMAN_RACHADO_CONFLICT_DETAIL_FIXES["Batalla de Cabo Rachado (1606)"].parent,
  "Guerra luso-neerlandesa (1602-1663)"
);
assert.ok(
  Object.values(DASMAN_RACHADO_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent === detail.war
      && detail.campaign
      && detail.hierarchySources?.length >= 2
      && detail.participants?.length === 2
      && detail.chronology?.length >= 2
      && detail.sourceDispute
  ),
  "la tanda Dasman-Rachado debe conservar fecha, jerarquia, fuentes, participantes y cautelas"
);
for (const [name, pageTitle] of [
  ["Batalla del palacio Dasman (1990)", "Battle_of_Dasman_Palace"],
  ["Batalla de Cabo Rachado (1606)", "Battle_of_Cape_Rachado"]
]) {
  assert.equal((await resolveWikipediaConflictTitle(name)).pageTitle, pageTitle);
}
assert.equal(Object.keys(BEITANG_TEACAPAN_CONFLICT_DETAIL_FIXES).length, 2);
assert.equal(
  BEITANG_TEACAPAN_CONFLICT_RENAMES["Batalla de Beitang"],
  "Batalla de Beitang (1900)"
);
assert.equal(
  BEITANG_TEACAPAN_CONFLICT_RENAMES["Batalla de Boca Teacapan"],
  "Batalla de Boca Teacapan (1870)"
);
assert.deepEqual(
  BEITANG_TEACAPAN_COUNTRY_CONFLICT_ADDITIONS["Rep\u00fablica Popular China"],
  ["Batalla de Beitang (1900)"]
);
assert.deepEqual(
  BEITANG_TEACAPAN_COUNTRY_CONFLICT_ADDITIONS["M\u00e9xico"],
  ["Batalla de Boca Teacapan (1870)"]
);
assert.deepEqual(
  BEITANG_TEACAPAN_COUNTRY_CONFLICT_EXCLUSIONS["Estados Unidos"],
  ["Batalla de Beitang", "Batalla de Beitang (1900)"]
);
assert.equal(
  BEITANG_TEACAPAN_CONFLICT_DETAIL_FIXES["Batalla de Beitang (1900)"].parent,
  "Rebelion de los Boxers"
);
assert.equal(
  BEITANG_TEACAPAN_CONFLICT_DETAIL_FIXES["Batalla de Boca Teacapan (1870)"].parent,
  "Pirater\u00eda en Am\u00e9rica del Norte"
);
assert.ok(
  Object.values(BEITANG_TEACAPAN_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent === detail.war
      && detail.campaign
      && detail.hierarchySources?.length >= 2
      && detail.participants?.length === 2
      && detail.chronology?.length >= 2
      && detail.sourceDispute
  ),
  "la tanda Beitang-Teacapan debe conservar fecha, jerarquia, fuentes, participantes y cautelas"
);
for (const [name, pageTitle] of [
  ["Batalla de Beitang (1900)", "Battle_of_Beitang"],
  ["Batalla de Boca Teacapan (1870)", "Battle_of_Boca_Teacapan"]
]) {
  assert.equal((await resolveWikipediaConflictTitle(name)).pageTitle, pageTitle);
}
assert.equal(Object.keys(OSEL_VAILELE_CONFLICT_DETAIL_FIXES).length, 2);
assert.equal(
  OSEL_VAILELE_CONFLICT_RENAMES["Batalla de \u00d6sel Island"],
  "Batalla de \u00d6sel (1719)"
);
assert.equal(
  OSEL_VAILELE_CONFLICT_RENAMES["Primera batalla de Vailele"],
  "Primera batalla de Vailele (1888)"
);
assert.deepEqual(
  OSEL_VAILELE_COUNTRY_CONFLICT_ADDITIONS.Rusia,
  ["Batalla de \u00d6sel (1719)"]
);
assert.deepEqual(
  OSEL_VAILELE_COUNTRY_CONFLICT_ADDITIONS.Alemania,
  ["Primera batalla de Vailele (1888)"]
);
assert.deepEqual(
  OSEL_VAILELE_COUNTRY_CONFLICT_EXCLUSIONS["Estados Unidos"],
  ["Primera batalla de Vailele", "Primera batalla de Vailele (1888)"]
);
assert.equal(
  OSEL_VAILELE_CONFLICT_DETAIL_FIXES["Batalla de \u00d6sel (1719)"].parent,
  "Gran Guerra del Norte"
);
assert.equal(
  OSEL_VAILELE_CONFLICT_DETAIL_FIXES["Primera batalla de Vailele (1888)"].parent,
  "Primera guerra civil de Samoa"
);
assert.ok(
  Object.values(OSEL_VAILELE_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent === detail.war
      && detail.campaign
      && detail.hierarchySources?.length >= 2
      && detail.participants?.length === 2
      && detail.chronology?.length >= 2
      && detail.sourceDispute
  ),
  "la tanda Osel-Vailele debe conservar fecha, jerarquia, fuentes, participantes y cautelas"
);
for (const [name, pageTitle] of [
  ["Batalla de \u00d6sel (1719)", "Battle_of_\u00d6sel_Island"],
  ["Primera batalla de Vailele (1888)", "First_Battle_of_Vailele"]
]) {
  assert.equal((await resolveWikipediaConflictTitle(name)).pageTitle, pageTitle);
}
assert.equal(Object.keys(NEVA_SHANHAIGUAN_CONFLICT_DETAIL_FIXES).length, 2);
assert.equal(
  NEVA_SHANHAIGUAN_CONFLICT_RENAMES["Batalla del Neva"],
  "Batalla del Neva (1240)"
);
assert.equal(
  NEVA_SHANHAIGUAN_CONFLICT_RENAMES["Batalla de Shanhaiguan"],
  "Campana de Shanhaiguan-Rehe (1924)"
);
assert.deepEqual(
  NEVA_SHANHAIGUAN_COUNTRY_CONFLICT_ADDITIONS.Rusia,
  ["Batalla del Neva (1240)"]
);
assert.deepEqual(
  NEVA_SHANHAIGUAN_COUNTRY_CONFLICT_ADDITIONS["Republica Popular China"],
  ["Campana de Shanhaiguan-Rehe (1924)"]
);
assert.equal(
  normalizeCountryConflictKey("Rep\u00fablica Popular China"),
  "republica popular china"
);
const accentInsensitiveCountryTargets = mergeCountryConflictBatches([
  NEVA_SHANHAIGUAN_COUNTRY_CONFLICT_ADDITIONS
]);
assert.deepEqual(
  getCountryConflictNames(accentInsensitiveCountryTargets, "Rep\u00fablica Popular China"),
  ["Campana de Shanhaiguan-Rehe (1924)"],
  "las tandas de pais deben seguir aplicandose aunque la ficha use tildes"
);
assert.deepEqual(
  NEVA_SHANHAIGUAN_COUNTRY_CONFLICT_EXCLUSIONS["Estados Unidos"],
  ["Batalla de Shanhaiguan", "Campana de Shanhaiguan-Rehe (1924)"]
);
assert.equal(
  NEVA_SHANHAIGUAN_CONFLICT_DETAIL_FIXES["Batalla del Neva (1240)"].parent,
  "Guerras sueco-novgorodenses"
);
assert.equal(
  NEVA_SHANHAIGUAN_CONFLICT_DETAIL_FIXES["Campana de Shanhaiguan-Rehe (1924)"].parent,
  "Segunda guerra Zhili-Fengtian"
);
assert.ok(
  Object.values(NEVA_SHANHAIGUAN_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent === detail.war
      && detail.campaign
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 2
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
  ),
  "la tanda Neva-Shanhaiguan debe conservar fecha, jerarquia, fuentes y participantes"
);
assert.equal(Object.keys(GUERRERO_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  GUERRERO_CONFLICT_RENAMES["Batalla de Guerrero"],
  "Batalla de Guerrero (1916)"
);
assert.deepEqual(
  GUERRERO_COUNTRY_CONFLICT_ADDITIONS.Mexico,
  ["Batalla de Guerrero (1916)"]
);
assert.equal(
  GUERRERO_CONFLICT_DETAIL_FIXES["Batalla de Guerrero (1916)"].parent,
  "Expedicion punitiva estadounidense en Mexico (1916-1917)"
);
assert.ok(
  Object.values(GUERRERO_CONFLICT_DETAIL_FIXES).every(detail =>
    Number.isInteger(detail.startYear)
      && detail.startYear === detail.endYear
      && detail.parent === detail.war
      && detail.campaign
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 3
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && detail.sourceDispute
      && /no permiten fijar una victoria tactica unica/i.test(detail.outcome)
  ),
  "la curaduria de Guerrero debe conservar jerarquia, fuentes y cautela sobre el resultado"
);
assert.equal((await resolveWikipediaConflictTitle("Batalla de Guerrero (1916)")).pageTitle, "Batalla de Guerrero");
assert.equal(Object.keys(HYERES_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  HYERES_CONFLICT_RENAMES["Batalla de Hyeres Islands"],
  "Batalla de las islas Hyères (1795)"
);
assert.deepEqual(
  HYERES_COUNTRY_CONFLICT_ADDITIONS["Reino Unido"],
  ["Batalla de las islas Hyères (1795)"]
);
assert.deepEqual(
  HYERES_COUNTRY_CONFLICT_ADDITIONS.Italia,
  ["Batalla de las islas Hyères (1795)"]
);
assert.equal(
  HYERES_CONFLICT_DETAIL_FIXES["Batalla de las islas Hyères (1795)"].parent,
  "Guerra de la Primera Coalición (1792-1797)"
);
assert.ok(
  Object.values(HYERES_CONFLICT_DETAIL_FIXES).every(detail =>
    detail.startYear === 1795
      && detail.startYear === detail.endYear
      && detail.parent === detail.war
      && detail.campaign
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 3
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && detail.sourceDispute
      && /ventaja t.ctica/i.test(detail.outcome)
  ),
  "la curaduria de Hyeres debe conservar fecha, jerarquia, fuentes, participantes y cautela sobre el desenlace"
);
const hyeresWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de las islas Hyères (1795)");
assert.equal(hyeresWikipediaOverride.language, "en");
assert.equal(hyeresWikipediaOverride.pageTitle, "Battle_of_the_Hyères_Islands");
assert.equal(Object.keys(MOCIMBOA_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  MOCIMBOA_CONFLICT_RENAMES["Batalla de Mocímboa da Praia"],
  "Ofensiva de Mocímboa da Praia (agosto de 2020)"
);
assert.ok(
  Object.values(MOCIMBOA_CONFLICT_DETAIL_FIXES).every(detail =>
    detail.startYear === 2020
      && detail.startYear === detail.endYear
      && detail.parent === detail.war
      && detail.campaign
      && detail.conflictType === "insurgencia"
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 3
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && detail.sourceDispute
      && /no se consolidan bajas/i.test(detail.outcome)
  ),
  "la curaduria de Mocimboa debe conservar fecha, jerarquia, fuentes, participantes y cautela sobre bajas"
);
const mocimboaWikipediaOverride = await resolveWikipediaConflictTitle("Ofensiva de Mocímboa da Praia (agosto de 2020)");
assert.equal(mocimboaWikipediaOverride.language, "en");
assert.equal(mocimboaWikipediaOverride.pageTitle, "Mocímboa_da_Praia_offensive");
assert.equal(
  hasReasonableTemporalMatch(
    "Ofensiva de Mocímboa da Praia (agosto de 2020)",
    "Mocímboa da Praia offensive",
    "5-11 August 2020"
  ),
  true,
  "la validacion temporal debe reconocer meses equivalentes entre espanol e ingles"
);
assert.equal(Object.keys(BARBADOS_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  BARBADOS_CONFLICT_RENAMES["Batalla de Barbados"],
  "Combate naval frente a Barbados (1778)"
);
assert.deepEqual(
  BARBADOS_COUNTRY_CONFLICT_ADDITIONS["Reino Unido"],
  ["Combate naval frente a Barbados (1778)"]
);
assert.ok(
  Object.values(BARBADOS_CONFLICT_DETAIL_FIXES).every(detail =>
    detail.startYear === 1778
      && detail.startYear === detail.endYear
      && detail.parent === "Guerra de Independencia de Estados Unidos"
      && detail.campaign
      && detail.type === "combate naval"
      && detail.conflictType === "independencia"
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 3
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && detail.sourceDispute
      && /311 muertos/i.test(detail.outcome)
  ),
  "la curaduria de Barbados debe conservar fecha, jerarquia, fuentes, participantes y bajas verificables"
);
const barbadosWikipediaOverride = await resolveWikipediaConflictTitle("Combate naval frente a Barbados (1778)");
assert.equal(barbadosWikipediaOverride.language, "en");
assert.equal(barbadosWikipediaOverride.pageTitle, "Battle_off_Barbados");
assert.equal(Object.keys(CHEF_DE_CAUX_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  CHEF_DE_CAUX_CONFLICT_RENAMES["Batalla de Chef-de-Caux"],
  "Batalla naval de Chef-de-Caux (1417)"
);
assert.deepEqual(
  CHEF_DE_CAUX_COUNTRY_CONFLICT_ADDITIONS["Reino Unido"],
  ["Batalla naval de Chef-de-Caux (1417)"]
);
assert.ok(
  Object.values(CHEF_DE_CAUX_CONFLICT_DETAIL_FIXES).every(detail =>
    detail.startYear === 1417
      && detail.startYear === detail.endYear
      && detail.parent === "Guerra de los Cien Años (1337-1453)"
      && detail.campaign
      && detail.type === "batalla naval"
      && detail.conflictType === "interestatal"
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 3
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && detail.sourceDispute
      && /no permiten consolidar/i.test(detail.outcome)
  ),
  "la curaduria de Chef-de-Caux debe conservar fecha anual, jerarquia, fuentes, participantes y cautela sobre detalles discutidos"
);
assert.equal(Object.keys(BIR_ENZARAN_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  BIR_ENZARAN_CONFLICT_RENAMES["Batalla de Bir Enzarán"],
  "Batalla de Bir Enzaran (1979)"
);
assert.deepEqual(
  BIR_ENZARAN_COUNTRY_CONFLICT_ADDITIONS["Sahara Occidental"],
  ["Batalla de Bir Enzaran (1979)"]
);
assert.ok(
  Object.values(BIR_ENZARAN_CONFLICT_DETAIL_FIXES).every(detail =>
    detail.startYear === 1979
      && detail.startYear === detail.endYear
      && detail.parent === "Guerra del Sahara Occidental"
      && detail.campaign === "Ofensivas del Frente Polisario de 1979"
      && detail.type === "batalla"
      && detail.conflictType === "independencia"
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 3
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && detail.sourceDispute
      && /no atribuye una victoria tactica/i.test(detail.outcome)
  ),
  "la curaduria de Bir Enzaran debe conservar fecha anual, jerarquia, fuentes, participantes y cautela sobre bajas y resultado"
);
const birEnzaranWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Bir Enzaran (1979)");
assert.equal(birEnzaranWikipediaOverride.language, "en");
assert.equal(birEnzaranWikipediaOverride.pageTitle, "Battle_of_Bir_Anzarane_(1979)");
assert.equal(Object.keys(LEBOUIRATE_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  LEBOUIRATE_CONFLICT_RENAMES["Batalla de Lebouirate"],
  "Ataque a Lebouirate (1979)"
);
assert.deepEqual(
  LEBOUIRATE_COUNTRY_CONFLICT_ADDITIONS["Sahara Occidental"],
  ["Ataque a Lebouirate (1979)"]
);
assert.ok(
  Object.values(LEBOUIRATE_CONFLICT_DETAIL_FIXES).every(detail =>
    detail.startYear === 1979
      && detail.startYear === detail.endYear
      && detail.parent === "Guerra del Sahara Occidental"
      && detail.campaign === "Ofensivas del Frente Polisario de 1979"
      && detail.type === "ataque a guarnicion"
      && detail.conflictType === "independencia"
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 3
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && detail.sourceDispute
      && /no permiten consolidar/i.test(detail.outcome)
  ),
  "la curaduria de Lebouirate debe conservar fecha, jerarquia, fuentes, participantes y cautela sobre el control y las bajas"
);
const lebouirateWikipediaOverride = await resolveWikipediaConflictTitle("Ataque a Lebouirate (1979)");
assert.equal(lebouirateWikipediaOverride.language, "en");
assert.equal(lebouirateWikipediaOverride.pageTitle, "Attack_on_Lebouirate");
assert.equal(Object.keys(KALYAZIN_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  KALYAZIN_CONFLICT_RENAMES["Batalla de Kalyazin"],
  "Combate de Kalyazin (1609)"
);
assert.deepEqual(
  KALYAZIN_COUNTRY_CONFLICT_ADDITIONS,
  {
    "Polonia": ["Combate de Kalyazin (1609)"],
    "Rusia": ["Combate de Kalyazin (1609)"]
  }
);
assert.ok(
  Object.values(KALYAZIN_CONFLICT_DETAIL_FIXES).every(detail =>
    detail.startYear === 1609
      && detail.startYear === detail.endYear
      && detail.datePrecision === "agosto de 1609"
      && detail.parent === "Periodo Tumultuoso de Rusia"
      && detail.campaign === "Operaciones de Kalyazin de 1609"
      && detail.type === "combate"
      && detail.conflictType === "civil"
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 4
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && detail.sourceDispute
      && /no permiten fijar un dia unico/i.test(detail.outcome)
  ),
  "la curaduria de Kalyazin debe conservar fecha mensual, jerarquia, fuentes, participantes y cautela sobre el resultado"
);
assert.equal(Object.keys(SANTO_DOMINGO_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  SANTO_DOMINGO_CONFLICT_RENAMES["Batalla de San Domingo"],
  "Batalla naval de Santo Domingo (1806)"
);
assert.deepEqual(
  SANTO_DOMINGO_COUNTRY_CONFLICT_ADDITIONS,
  {
    "Reino Unido": ["Batalla naval de Santo Domingo (1806)"],
    "República Dominicana": ["Batalla naval de Santo Domingo (1806)"]
  }
);
assert.ok(
  Object.values(SANTO_DOMINGO_CONFLICT_DETAIL_FIXES).every(detail =>
    detail.startYear === 1806
      && detail.startYear === detail.endYear
      && detail.datePrecision === "6 de febrero de 1806"
      && detail.parent === "Guerras napole\u00f3nicas (1803-1815)"
      && detail.campaign === "Campa\u00f1a atl\u00e1ntica de 1806"
      && detail.type === "batalla naval"
      && detail.conflictType === "interestatal"
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 3
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && /Victoria brit\u00e1nica/i.test(detail.outcome)
      && /no consolida una cifra \u00fanica/i.test(detail.outcome)
  ),
  "la curaduria de Santo Domingo debe conservar fecha, jerarquia, fuentes, participantes y cautela sobre las bajas"
);
const santoDomingoWikipediaOverride = await resolveWikipediaConflictTitle("Batalla naval de Santo Domingo (1806)");
assert.equal(santoDomingoWikipediaOverride.language, "en");
assert.equal(santoDomingoWikipediaOverride.pageTitle, "Battle_of_San_Domingo");
assert.equal(Object.keys(SANTA_LUCIA_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  SANTA_LUCIA_CONFLICT_RENAMES["Batalla de St. Lucia"],
  "Batalla naval de Santa Luc\u00eda (1778)"
);
assert.equal(
  SANTA_LUCIA_CONFLICT_RENAMES["Battle of Saint Lucia"],
  "Batalla naval de Santa Luc\u00eda (1778)"
);
assert.deepEqual(
  SANTA_LUCIA_COUNTRY_CONFLICT_ADDITIONS,
  {
    "Reino Unido": ["Batalla naval de Santa Luc\u00eda (1778)"]
  }
);
assert.ok(
  Object.values(SANTA_LUCIA_CONFLICT_DETAIL_FIXES).every(detail =>
    detail.startYear === 1778
      && detail.startYear === detail.endYear
      && detail.datePrecision === "15 de diciembre de 1778"
      && detail.parent === "Guerra de Independencia de Estados Unidos"
      && detail.campaign === "Campa\u00f1a de las Antillas de 1778-1783"
      && detail.type === "batalla naval"
      && detail.conflictType === "independencia"
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 3
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && /\u00c9xito defensivo brit\u00e1nico/i.test(detail.outcome)
      && /no resolvi\u00f3 por s\u00ed sola/i.test(detail.outcome)
  ),
  "la curaduria de Santa Lucia debe conservar fecha, jerarquia, fuentes, participantes y distinguir el combate naval de la rendicion posterior"
);
const santaLuciaWikipediaOverride = await resolveWikipediaConflictTitle("Batalla naval de Santa Luc\u00eda (1778)");
assert.equal(santaLuciaWikipediaOverride.language, "en");
assert.equal(santaLuciaWikipediaOverride.pageTitle, "Battle_of_St._Lucia");
assert.equal(Object.keys(HIDDENSEE_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  HIDDENSEE_CONFLICT_RENAMES["Batalla de Hiddensee"],
  "Combate naval frente a Hiddensee (1870)"
);
assert.equal(
  HIDDENSEE_CONFLICT_RENAMES["Seegefecht vor Hiddensee"],
  "Combate naval frente a Hiddensee (1870)"
);
assert.deepEqual(
  HIDDENSEE_COUNTRY_CONFLICT_ADDITIONS,
  {
    Alemania: ["Combate naval frente a Hiddensee (1870)"]
  }
);
assert.ok(
  Object.values(HIDDENSEE_CONFLICT_DETAIL_FIXES).every(detail =>
    detail.startYear === 1870
      && detail.startYear === detail.endYear
      && detail.datePrecision === "17 de agosto de 1870"
      && detail.parent === "Guerra franco-prusiana (1870-1871)"
      && detail.campaign === "Operaciones navales del B\u00e1ltico de 1870"
      && detail.type === "combate naval"
      && detail.conflictType === "interestatal"
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 3
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && detail.participants[0].members.includes("Ca\u00f1onera Blitz")
      && !detail.participants.flatMap(side => side.members).includes("Bombardeos a\u00e9reos sobre el Reino Unido")
      && /inconcluso/i.test(detail.outcome)
      && /no registran impactos, bajas ni da\u00f1os/i.test(detail.outcome)
      && /no coinciden por completo/i.test(detail.sourceDispute)
  ),
  "la curaduria de Hiddensee debe conservar fecha, jerarquia, fuentes, participantes y cautela sobre el orden de batalla"
);
assert.equal(Object.keys(HAVANA_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  HAVANA_CONFLICT_RENAMES["Batalla de Havana"],
  "Combate naval frente a La Habana (1870)"
);
assert.equal(
  HAVANA_CONFLICT_RENAMES["Battle of Havana (1870)"],
  "Combate naval frente a La Habana (1870)"
);
assert.deepEqual(
  HAVANA_COUNTRY_CONFLICT_ADDITIONS,
  {
    Alemania: ["Combate naval frente a La Habana (1870)"]
  }
);
assert.ok(
  Object.values(HAVANA_CONFLICT_DETAIL_FIXES).every(detail =>
    detail.startYear === 1870
      && detail.startYear === detail.endYear
      && detail.datePrecision === "9 de noviembre de 1870"
      && detail.parent === "Guerra franco-prusiana (1870-1871)"
      && detail.campaign === "Operaciones navales transatl\u00e1nticas de 1870"
      && detail.type === "combate naval"
      && detail.conflictType === "interestatal"
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 3
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && /inconcluso/i.test(detail.outcome)
      && /no consolida bajas/i.test(detail.outcome)
      && /difieren/i.test(detail.sourceDispute)
  ),
  "la curaduria de La Habana debe conservar fecha, jerarquia, fuentes, participantes y cautela sobre bajas y resultado"
);
const havanaWikipediaOverride = await resolveWikipediaConflictTitle("Combate naval frente a La Habana (1870)");
assert.equal(havanaWikipediaOverride.language, "en");
assert.equal(havanaWikipediaOverride.pageTitle, "Battle_of_Havana_(1870)");
assert.equal(Object.keys(JABRAYIL_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  JABRAYIL_CONFLICT_RENAMES["Batalla de Jabrayil"],
  "Operaciones de Jabrayil (2020)"
);
assert.equal(
  JABRAYIL_CONFLICT_RENAMES["Battle of Jabrayil (2020)"],
  "Operaciones de Jabrayil (2020)"
);
assert.deepEqual(
  JABRAYIL_COUNTRY_CONFLICT_ADDITIONS,
  {
    Armenia: ["Operaciones de Jabrayil (2020)"]
  }
);
assert.ok(
  Object.values(JABRAYIL_CONFLICT_DETAIL_FIXES).every(detail =>
    detail.startYear === 2020
      && detail.startYear === detail.endYear
      && detail.parent === "Segunda guerra de Nagorno-Karabaj"
      && detail.campaign === "Ofensiva meridional de Nagorno-Karabaj de 2020"
      && detail.type === "ofensiva"
      && detail.conflictType === "interestatal"
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 4
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && detail.treaties?.some(item => /9 de noviembre de 2020/i.test(item))
      && /impugnado/i.test(detail.outcome)
      && /no fija bajas/i.test(detail.sourceDispute)
  ),
  "la curaduria de Jabrayil debe conservar fecha, jerarquia, fuentes, participantes y la controversia sobre el anuncio inicial"
);
assert.equal(Object.keys(LISSA_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  LISSA_CONFLICT_RENAMES["Batalla de Lissa"],
  "Batalla naval de Lissa (1811)"
);
assert.equal(
  LISSA_CONFLICT_RENAMES["Battle of Lissa (1811)"],
  "Batalla naval de Lissa (1811)"
);
assert.deepEqual(
  LISSA_COUNTRY_CONFLICT_ADDITIONS,
  {
    "Reino Unido": ["Batalla naval de Lissa (1811)"],
    Italia: ["Batalla naval de Lissa (1811)"],
    Croacia: ["Batalla naval de Lissa (1811)"]
  }
);
assert.ok(
  Object.values(LISSA_CONFLICT_DETAIL_FIXES).every(detail =>
    detail.startYear === 1811
      && detail.startYear === detail.endYear
      && detail.datePrecision === "13 de marzo de 1811"
      && detail.parent === "Guerras napole\u00f3nicas (1803-1815)"
      && detail.campaign === "Campa\u00f1a del Adri\u00e1tico (1807-1814)"
      && detail.type === "batalla naval"
      && detail.conflictType === "interestatal"
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 3
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && /Victoria brit\u00e1nica/i.test(detail.outcome)
      && /no fija un total/i.test(detail.outcome)
      && /no publica un total cerrado/i.test(detail.sourceDispute)
  ),
  "la curaduria de Lissa debe conservar fecha, jerarquia, fuentes, participantes y cautela sobre bajas"
);
const lissaWikipediaOverride = await resolveWikipediaConflictTitle("Batalla naval de Lissa (1811)");
assert.equal(lissaWikipediaOverride.language, "en");
assert.equal(lissaWikipediaOverride.pageTitle, "Battle_of_Lissa_(1811)");
assert.equal(Object.keys(VIZAKNA_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  VIZAKNA_CONFLICT_RENAMES["Batalla de V\u00edzakna"],
  "Batalla de V\u00edzakna (1849)"
);
assert.equal(
  VIZAKNA_CONFLICT_RENAMES["Battle of Vizakna"],
  "Batalla de V\u00edzakna (1849)",
  "la variante inglesa sin tilde debe llegar a la ficha curada"
);
assert.deepEqual(
  VIZAKNA_COUNTRY_CONFLICT_ADDITIONS,
  {
    Austria: ["Batalla de V\u00edzakna (1849)"],
    Rumania: ["Batalla de V\u00edzakna (1849)"]
  }
);
assert.ok(
  Object.values(VIZAKNA_CONFLICT_DETAIL_FIXES).every(detail =>
    detail.startYear === 1849
      && detail.startYear === detail.endYear
      && detail.datePrecision === "4 de febrero de 1849"
      && detail.parent === "Revoluci\u00f3n h\u00fangara de 1848-1849"
      && detail.campaign === "Campa\u00f1a de Transilvania de 1848-1849"
      && detail.type === "batalla terrestre"
      && detail.conflictType === "independencia"
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 3
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && /Victoria imperial/i.test(detail.outcome)
      && /no se registra como beligerante/i.test(detail.sourceDispute)
  ),
  "la curaduria de Vizakna debe conservar fecha, jerarquia, fuentes, participantes y cautela sobre Rusia y bajas"
);
const vizaknaWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de V\u00edzakna (1849)");
assert.equal(vizaknaWikipediaOverride.language, "en");
assert.equal(vizaknaWikipediaOverride.pageTitle, "Battle_of_V\u00edzakna");
assert.equal(Object.keys(SAINT_MARCOUF_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  SAINT_MARCOUF_CONFLICT_RENAMES["Battle of the \u00celes Saint-Marcouf"],
  "Batalla de las islas Saint-Marcouf (1798)"
);
assert.equal(
  SAINT_MARCOUF_CONFLICT_RENAMES["Batalla de \u00celes Saint-Marcouf"],
  "Batalla de las islas Saint-Marcouf (1798)",
  "la variante hibrida previa debe llegar a la ficha curada"
);
assert.deepEqual(
  SAINT_MARCOUF_COUNTRY_CONFLICT_ADDITIONS,
  {
    Francia: ["Batalla de las islas Saint-Marcouf (1798)"],
    "Reino Unido": ["Batalla de las islas Saint-Marcouf (1798)"]
  }
);
assert.ok(
  Object.values(SAINT_MARCOUF_CONFLICT_DETAIL_FIXES).every(detail =>
    detail.startYear === 1798
      && detail.startYear === detail.endYear
      && detail.datePrecision === "7 de mayo de 1798"
      && detail.parent === "Guerras revolucionarias francesas (1792-1802)"
      && detail.campaign === "Operaciones navales anglo-francesas en el canal de la Mancha (1798)"
      && detail.type === "asalto anfibio y combate naval"
      && detail.conflictType === "interestatal"
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 3
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && /Victoria brit\u00e1nica/i.test(detail.outcome)
      && /no fija un balance \u00fanico/i.test(detail.outcome)
      && /no convierte los datos de un solo relato/i.test(detail.sourceDispute)
  ),
  "la curaduria de Saint-Marcouf debe conservar fecha, jerarquia, fuentes, participantes y cautela sobre bajas"
);
const saintMarcoufWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de las islas Saint-Marcouf (1798)");
assert.equal(saintMarcoufWikipediaOverride.language, "en");
assert.equal(saintMarcoufWikipediaOverride.pageTitle, "Battle_of_the_\u00celes_Saint-Marcouf");
assert.equal(Object.keys(GYANAFALVA_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  GYANAFALVA_CONFLICT_RENAMES["Battle of Gyanafalva"],
  "Combates de Gyanafalva (1921)"
);
assert.equal(
  GYANAFALVA_CONFLICT_RENAMES["Batalla de Gyanafalva"],
  "Combates de Gyanafalva (1921)",
  "la variante traducida debe llegar a la ficha curada"
);
assert.deepEqual(
  GYANAFALVA_COUNTRY_CONFLICT_ADDITIONS,
  {
    Austria: ["Combates de Gyanafalva (1921)"],
    Hungr\u00eda: ["Combates de Gyanafalva (1921)"]
  }
);
assert.ok(
  Object.values(GYANAFALVA_CONFLICT_DETAIL_FIXES).every(detail =>
    detail.startYear === 1921
      && detail.startYear === detail.endYear
      && detail.datePrecision === "Finales de agosto y comienzos de septiembre de 1921"
      && detail.parent === "Levantamiento de Hungr\u00eda occidental de 1921"
      && detail.campaign === "Operaciones de la frontera occidental de Hungr\u00eda (agosto-septiembre de 1921)"
      && detail.type === "combate fronterizo e insurrecci\u00f3n"
      && detail.conflictType === "frontera"
      && detail.hierarchyConfidence === "media"
      && detail.hierarchySources?.length >= 3
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && /Ventaja t\u00e1ctica local/i.test(detail.outcome)
      && /nombre plural/i.test(detail.sourceDispute)
  ),
  "la curaduria de Gyanafalva debe conservar jerarquia, fuentes y cautela sobre fechas, actores y bajas"
);
assert.equal(Object.keys(JUPITER_INLET_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  JUPITER_INLET_CONFLICT_RENAMES["Battle of Jupiter Inlet"],
  "Primera batalla de Loxahatchee (1838)"
);
assert.equal(
  JUPITER_INLET_CONFLICT_RENAMES["Powell's Battle"],
  "Primera batalla de Loxahatchee (1838)",
  "el alias historico de Powell debe llegar a la ficha curada"
);
assert.deepEqual(
  JUPITER_INLET_COUNTRY_CONFLICT_ADDITIONS,
  {
    "Estados Unidos": ["Primera batalla de Loxahatchee (1838)"]
  }
);
assert.ok(
  Object.values(JUPITER_INLET_CONFLICT_DETAIL_FIXES).every(detail =>
    detail.startYear === 1838
      && detail.startYear === detail.endYear
      && detail.datePrecision === "15 de enero de 1838"
      && detail.parent === "Segunda Guerra Seminola (1835-1842)"
      && detail.campaign === "Operaciones de Loxahatchee de enero de 1838"
      && detail.type === "emboscada y combate en humedal"
      && detail.conflictType === "colonial"
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 4
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && /Ventaja t\u00e1ctica/i.test(detail.outcome)
      && /denominaci\u00f3n heredada no es uniforme/i.test(detail.sourceDispute)
  ),
  "la curaduria de Jupiter Inlet debe preservar fecha, jerarquia, actores y cautela sobre nombres y cifras"
);
assert.equal(Object.keys(KIRCHSCHLAG_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  KIRCHSCHLAG_CONFLICT_RENAMES["Battle of Kirchschlag"],
  "Combate de Kirchschlag (1921)"
);
assert.equal(
  KIRCHSCHLAG_CONFLICT_RENAMES["Gefecht von Kirchschlag"],
  "Combate de Kirchschlag (1921)",
  "el alias aleman debe llegar a la ficha curada"
);
assert.deepEqual(
  KIRCHSCHLAG_COUNTRY_CONFLICT_ADDITIONS,
  {
    Austria: ["Combate de Kirchschlag (1921)"],
    "Hungr\u00eda": ["Combate de Kirchschlag (1921)"]
  }
);
assert.ok(
  Object.values(KIRCHSCHLAG_CONFLICT_DETAIL_FIXES).every(detail =>
    detail.startYear === 1921
      && detail.startYear === detail.endYear
      && detail.datePrecision === "5 de septiembre de 1921"
      && detail.parent === "Levantamiento de Hungr\u00eda occidental de 1921"
      && detail.campaign === "Operaciones de la frontera occidental de Hungr\u00eda (agosto-septiembre de 1921)"
      && detail.type === "combate fronterizo e insurrecci\u00f3n"
      && detail.conflictType === "frontera"
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 4
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && /Defensa austr\u00edaca/i.test(detail.outcome)
      && /procedencia es predominantemente institucional austr\u00edaca/i.test(detail.sourceDispute)
  ),
  "la curaduria de Kirchschlag debe preservar fecha, jerarquia, fuentes, participantes y cautela sobre bajas"
);
assert.equal(Object.keys(MAHE_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  MAHE_CONFLICT_RENAMES["Batalla de Mah\u00e9"],
  "Combate naval de Mah\u00e9 (1801)"
);
assert.equal(
  MAHE_CONFLICT_RENAMES["Action at Mahe"],
  "Combate naval de Mah\u00e9 (1801)",
  "el alias ingles sin tilde debe llegar a la ficha curada"
);
assert.deepEqual(
  MAHE_COUNTRY_CONFLICT_ADDITIONS,
  {
    Francia: ["Combate naval de Mah\u00e9 (1801)"],
    "Reino Unido": ["Combate naval de Mah\u00e9 (1801)"]
  }
);
assert.ok(
  Object.values(MAHE_CONFLICT_DETAIL_FIXES).every(detail =>
    detail.startYear === 1801
      && detail.startYear === detail.endYear
      && detail.datePrecision === "19 de agosto de 1801"
      && detail.parent === "Guerras revolucionarias francesas (1792-1802)"
      && detail.campaign === "Operaciones navales anglo-francesas en el oc\u00e9ano \u00cdndico (1801)"
      && detail.type === "combate naval"
      && detail.conflictType === "interestatal"
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 3
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && /Victoria t\u00e1ctica brit\u00e1nica/i.test(detail.outcome)
      && /evidencia directa disponible procede principalmente de colecciones mar\u00edtimas brit\u00e1nicas/i.test(detail.sourceDispute)
  ),
  "la curaduria de Mahe debe preservar fecha, jerarquia, fuentes, participantes y cautela sobre bajas"
);
assert.equal(Object.keys(FUNDY_BAY_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  FUNDY_BAY_CONFLICT_RENAMES["Batalla de Fundy Bay"],
  "Combate naval de la bah\u00eda de Fundy (1696)"
);
assert.equal(
  FUNDY_BAY_CONFLICT_RENAMES["Battle of the Bay of Fundy"],
  "Combate naval de la bah\u00eda de Fundy (1696)",
  "el alias ingles debe llegar a la ficha curada"
);
assert.deepEqual(
  FUNDY_BAY_COUNTRY_CONFLICT_ADDITIONS,
  {
    "Canad\u00e1": ["Combate naval de la bah\u00eda de Fundy (1696)"],
    Francia: ["Combate naval de la bah\u00eda de Fundy (1696)"],
    "Reino Unido": ["Combate naval de la bah\u00eda de Fundy (1696)"]
  }
);
assert.ok(
  Object.values(FUNDY_BAY_CONFLICT_DETAIL_FIXES).every(detail =>
    detail.startYear === 1696
      && detail.startYear === detail.endYear
      && detail.datePrecision === "14 de julio de 1696"
      && detail.parent === "Guerra de los Nueve A\u00f1os (1688-1697)"
      && detail.campaign === "Operaciones franco-inglesas en Acadia y Pemaquid (1696)"
      && detail.type === "combate naval"
      && detail.conflictType === "colonial"
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 3
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && /capturaron la fragata inglesa Newport/i.test(detail.outcome)
      && /sit\u00faan expl\u00edcitamente la captura de Newport el 14 de julio/i.test(detail.sourceDispute)
  ),
  "la curaduria de Fundy Bay debe preservar fecha, jerarquia, fuentes, participantes y cautela sobre bajas"
);
assert.equal(Object.keys(LAGOS_1759_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  LAGOS_1759_CONFLICT_RENAMES["Batalla de Lagos"],
  "Batalla naval de Lagos (1759)"
);
assert.equal(
  LAGOS_1759_CONFLICT_RENAMES["Battle of Lagos (1759)"],
  "Batalla naval de Lagos (1759)",
  "el alias ingles fechado debe llegar a la ficha curada"
);
assert.deepEqual(
  LAGOS_1759_COUNTRY_CONFLICT_ADDITIONS,
  {
    "Espa\u00f1a": ["Batalla naval de Lagos (1759)"],
    Francia: ["Batalla naval de Lagos (1759)"],
    Portugal: ["Batalla naval de Lagos (1759)"],
    "Reino Unido": ["Batalla naval de Lagos (1759)"]
  }
);
assert.deepEqual(
  LAGOS_1759_COUNTRY_CONFLICT_EXCLUSIONS,
  {
    Francia: ["Batalla naval de Lagos (1693)"],
    Portugal: ["Batalla naval de Lagos (1693)"],
    "Reino Unido": ["Batalla naval de Lagos (1693)"],
    "Reino de los Pa\u00edses Bajos": ["Batalla naval de Lagos (1693)"]
  },
  "la correccion de Lagos debe retirar los enlaces de paises derivados de la asociacion de 1693"
);
assert.deepEqual(
  LAGOS_1759_GENERATED_DETAIL_EXCLUSIONS,
  ["Batalla naval de Lagos (1693)"],
  "la correccion de Lagos debe retirar la ficha generada con la identidad equivocada"
);
assert.ok(
  Object.values(LAGOS_1759_CONFLICT_DETAIL_FIXES).every(detail =>
    detail.startYear === 1759
      && detail.startYear === detail.endYear
      && detail.datePrecision === "18-19 de agosto de 1759"
      && detail.parent === "Guerra de los Siete A\u00f1os (1756-1763)"
      && detail.campaign === "Operaciones navales franco-brit\u00e1nicas en el Mediterr\u00e1neo occidental (1759)"
      && detail.type === "batalla naval"
      && detail.conflictType === "interestatal"
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 4
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && /Victoria brit\u00e1nica/i.test(detail.outcome)
      && /secuencia naval de dos d\u00edas/i.test(detail.sourceDispute)
  ),
  "la correccion de Lagos debe preservar fecha, jerarquia, fuentes, participantes y cautela sobre bajas"
);
assert.equal(Object.keys(KAIPIAIS_1789_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  KAIPIAIS_1789_SAFE_CONFLICT_RENAMES["Batalla de Kaipiais"],
  "Batalla de Kaipiais (1789)"
);
assert.equal(
  KAIPIAIS_1789_SAFE_CONFLICT_RENAMES["Battle of Kaipiais"],
  "Batalla de Kaipiais (1789)",
  "el alias ingles de Kaipiais debe llegar a la ficha curada"
);
assert.deepEqual(
  KAIPIAIS_1789_COUNTRY_CONFLICT_ADDITIONS,
  {
    Finlandia: ["Batalla de Kaipiais (1789)"],
    Rusia: ["Batalla de Kaipiais (1789)"],
    Suecia: ["Batalla de Kaipiais (1789)"]
  }
);
assert.ok(
  Object.values(KAIPIAIS_1789_CONFLICT_DETAIL_FIXES).every(detail =>
    detail.startYear === 1789
      && detail.startYear === detail.endYear
      && detail.datePrecision === "15 de julio de 1789"
      && detail.parent === "Guerra ruso-sueca (1788-1790)"
      && detail.campaign === "Operaciones terrestres en Finlandia durante la guerra ruso-sueca (1789)"
      && detail.type === "batalla terrestre"
      && detail.conflictType === "interestatal"
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 3
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && /fue rechazada/i.test(detail.outcome)
      && /no fija efectivos exactos/i.test(detail.sourceDispute)
  ),
  "la curaduria de Kaipiais debe preservar fecha, jerarquia, fuentes, participantes y cautela sobre bajas"
);
assert.equal(Object.keys(TIGER_MOUTH_1809_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  TIGER_MOUTH_1809_CONFLICT_RENAMES["Batalla de la Boca del Tigre"],
  "Combates navales de la Boca del Tigre (1809-1810)"
);
assert.equal(
  TIGER_MOUTH_1809_CONFLICT_RENAMES["Battle of the Tiger's Mouth"],
  "Combates navales de la Boca del Tigre (1809-1810)",
  "el alias ingles debe llegar a la ficha curada de la Boca del Tigre"
);
assert.deepEqual(
  TIGER_MOUTH_1809_COUNTRY_CONFLICT_ADDITIONS,
  {
    "Rep\u00fablica Popular China": ["Combates navales de la Boca del Tigre (1809-1810)"],
    Portugal: ["Combates navales de la Boca del Tigre (1809-1810)"]
  }
);
assert.ok(
  Object.values(TIGER_MOUTH_1809_CONFLICT_DETAIL_FIXES).every(detail =>
    detail.startYear === 1809
      && detail.endYear === 1810
      && /15 de septiembre de 1809/i.test(detail.datePrecision)
      && detail.parent === "Pirater\u00eda de la Flota de la Bandera Roja en el delta del r\u00edo de las Perlas (1809-1810)"
      && detail.campaign === "Operaciones de Macao y la Boca del Tigre (septiembre de 1809-febrero de 1810)"
      && detail.type === "serie de combates navales antipirater\u00eda"
      && detail.conflictType === "pirateria"
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 3
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length && side.casualties)
      && /capitulaci\u00f3n/i.test(detail.outcome)
      && /no consolida esas cifras/i.test(detail.sourceDispute)
  ),
  "la curaduria de la Boca del Tigre debe preservar serie, fuentes, participantes y cautela sobre cifras de flota y bajas"
);
assert.equal(Object.keys(IMBROS_1918_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  IMBROS_1918_CONFLICT_RENAMES["Batalla de Imbros"],
  "Batalla naval de Imbros (1918)"
);
assert.equal(
  IMBROS_1918_CONFLICT_RENAMES["Battle of Imbros (1918)"],
  "Batalla naval de Imbros (1918)",
  "el alias ingles de Imbros debe llegar a la ficha curada"
);
assert.deepEqual(
  IMBROS_1918_COUNTRY_CONFLICT_ADDITIONS,
  {
    "Reino Unido": ["Batalla naval de Imbros (1918)"],
    "Turqu\u00eda": ["Batalla naval de Imbros (1918)"]
  }
);
assert.deepEqual(
  IMBROS_1918_COUNTRY_CONFLICT_EXCLUSIONS,
  {
    Grecia: ["Batalla naval de Imbros (1918)"]
  },
  "la correccion de Imbros debe retirar el enlace griego heredado de una ubicacion mal interpretada"
);
assert.ok(
  Object.values(IMBROS_1918_CONFLICT_DETAIL_FIXES).every(detail =>
    detail.startYear === 1918
      && detail.startYear === detail.endYear
      && detail.datePrecision === "20 de enero de 1918"
      && detail.parent === "Primera Guerra Mundial"
      && detail.campaign === "Operaciones navales en los Dardanelos y el Egeo (1918)"
      && detail.type === "batalla naval"
      && detail.conflictType === "interestatal"
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 3
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length && side.casualties)
      && /HMS Raglan y HMS M28 fueron hundidos/i.test(detail.outcome)
      && /no consolida cifras personales/i.test(detail.sourceDispute)
  ),
  "la curaduria de Imbros debe preservar fecha, jerarquia, fuentes, participantes y cautela sobre bajas"
);
assert.equal(Object.keys(PULANG_LUPA_1900_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  PULANG_LUPA_1900_CONFLICT_RENAMES["Batalla de la Monta\u00f1a Roja"],
  "Batalla de Pulang Lupa (1900)"
);
assert.equal(
  PULANG_LUPA_1900_CONFLICT_RENAMES["Battle of Pulang Lupa"],
  "Batalla de Pulang Lupa (1900)",
  "el alias ingles de Pulang Lupa debe llegar a la ficha curada"
);
assert.deepEqual(
  PULANG_LUPA_1900_COUNTRY_CONFLICT_ADDITIONS,
  {
    Filipinas: ["Batalla de Pulang Lupa (1900)"]
  }
);
assert.ok(
  Object.values(PULANG_LUPA_1900_CONFLICT_DETAIL_FIXES).every(detail =>
    detail.startYear === 1900
      && detail.startYear === detail.endYear
      && detail.datePrecision === "13 de septiembre de 1900"
      && detail.parent === "Guerra filipino-estadounidense"
      && detail.campaign === "Operaciones de Marinduque (1900)"
      && detail.type === "batalla terrestre"
      && detail.conflictType === "independencia"
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 3
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length && side.casualties)
      && /M\u00e1ximo Abad derrot\u00f3/i.test(detail.outcome)
      && /no aportan una tabla bilateral verificable/i.test(detail.sourceDispute)
  ),
  "la curaduria de Pulang Lupa debe preservar fecha, jerarquia, fuentes, participantes y cautela sobre bajas"
);
const pulangLupaWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de la Monta\u00f1a Roja");
assert.equal(pulangLupaWikipediaOverride.language, "en");
assert.equal(pulangLupaWikipediaOverride.pageTitle, "Battle_of_Pulang_Lupa");
assert.equal(Object.keys(MARSHES_1984_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  MARSHES_1984_CONFLICT_RENAMES["Batalla de las Marismas"],
  "Batalla de las marismas (1984)"
);
assert.equal(
  MARSHES_1984_CONFLICT_RENAMES["Battle of the Marshes"],
  "Batalla de las marismas (1984)",
  "el alias ingles de las marismas debe llegar a la ficha curada"
);
assert.deepEqual(
  MARSHES_1984_COUNTRY_CONFLICT_ADDITIONS,
  {
    Irak: ["Batalla de las marismas (1984)"]
  }
);
assert.ok(
  Object.values(MARSHES_1984_CONFLICT_DETAIL_FIXES).every(detail =>
    detail.startYear === 1984
      && detail.startYear === detail.endYear
      && detail.datePrecision === "febrero y marzo de 1984"
      && detail.parent === "Guerra entre Iran e Irak"
      && detail.campaign === "Operacion Kheibar (1984)"
      && detail.type === "batalla terrestre"
      && detail.conflictType === "interestatal"
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 3
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length && side.casualties)
      && /Resultado operacional mixto/i.test(detail.outcome)
      && /no se fija un ganador absoluto/i.test(detail.sourceDispute)
  ),
  "la curaduria de las marismas debe preservar fecha, jerarquia, fuentes, participantes y cautela sobre resultado y bajas"
);
const marshesWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de las Marismas");
assert.equal(marshesWikipediaOverride.language, "en");
assert.equal(marshesWikipediaOverride.pageTitle, "Battle_of_the_Marshes");
assert.equal(Object.keys(STEGEBORG_1598_CONFLICT_DETAIL_FIXES).length, 2);
assert.equal(
  STEGEBORG_1598_CONFLICT_RENAMES["Batalla de Stegeborg"],
  "Batalla de Stegeborg (1598)"
);
assert.equal(
  STEGEBORG_1598_CONFLICT_RENAMES["Slaget vid Stegeborg"],
  "Batalla de Stegeborg (1598)",
  "el alias sueco de Stegeborg debe llegar a la ficha curada"
);
assert.deepEqual(
  STEGEBORG_1598_COUNTRY_CONFLICT_ADDITIONS,
  {
    Polonia: ["Guerra contra Segismundo", "Batalla de Stegeborg (1598)"]
  }
);
const stegeborgWarDetail = STEGEBORG_1598_CONFLICT_DETAIL_FIXES["Guerra contra Segismundo"];
assert.ok(
  stegeborgWarDetail
    && stegeborgWarDetail.startYear === 1598
    && stegeborgWarDetail.endYear === 1599
    && stegeborgWarDetail.conflictType === "civil"
    && stegeborgWarDetail.hierarchyConfidence === "alta"
    && stegeborgWarDetail.hierarchySources?.length >= 4
    && stegeborgWarDetail.participants?.length === 2
    && /union personal polaco-sueca/i.test(stegeborgWarDetail.outcome)
    && /1597-1599 o como su fase armada principal/i.test(stegeborgWarDetail.sourceDispute),
  "la guerra contra Segismundo debe conservar sus fuentes y su contexto dinastico"
);
const stegeborgBattleDetail = STEGEBORG_1598_CONFLICT_DETAIL_FIXES["Batalla de Stegeborg (1598)"];
assert.ok(
  stegeborgBattleDetail
    && stegeborgBattleDetail.startYear === 1598
    && stegeborgBattleDetail.startYear === stegeborgBattleDetail.endYear
    && stegeborgBattleDetail.parent === "Guerra contra Segismundo"
    && stegeborgBattleDetail.campaign === "Campa\u00f1a de Segismundo en Suecia (1598)"
    && stegeborgBattleDetail.type === "batalla terrestre"
    && stegeborgBattleDetail.conflictType === "civil"
    && stegeborgBattleDetail.hierarchyConfidence === "alta"
    && stegeborgBattleDetail.hierarchySources?.length >= 4
    && stegeborgBattleDetail.hierarchySources.every(item => item.label && item.url)
    && stegeborgBattleDetail.participants?.length === 2
    && stegeborgBattleDetail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /Victoria tactica de los partidarios de Segismundo/i.test(stegeborgBattleDetail.outcome)
    && /calendario juliano[\s\S]*calendario gregoriano/i.test(stegeborgBattleDetail.sourceDispute),
  "la curaduria de Stegeborg debe preservar fecha, jerarquia, fuentes, participantes y cautela de calendario"
);
const stegeborgWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Stegeborg");
assert.equal(stegeborgWikipediaOverride.language, "en");
assert.equal(stegeborgWikipediaOverride.pageTitle, "Battle_of_Stegeborg");
assert.equal(Object.keys(RAKVERE_1603_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  RAKVERE_1603_CONFLICT_RENAMES["Batalla de Rakvere"],
  "Batalla de Rakvere (1603)"
);
assert.equal(
  RAKVERE_1603_CONFLICT_RENAMES["Battle of Rakvere (1603)"],
  "Batalla de Rakvere (1603)",
  "el alias ingles fechado de Rakvere debe llegar a la ficha curada"
);
assert.deepEqual(
  RAKVERE_1603_COUNTRY_CONFLICT_ADDITIONS,
  {
    Polonia: ["Batalla de Rakvere (1603)"],
    Estonia: ["Batalla de Rakvere (1603)"]
  }
);
const rakvereBattleDetail = RAKVERE_1603_CONFLICT_DETAIL_FIXES["Batalla de Rakvere (1603)"];
assert.ok(
  rakvereBattleDetail
    && rakvereBattleDetail.startYear === 1603
    && rakvereBattleDetail.startYear === rakvereBattleDetail.endYear
    && rakvereBattleDetail.datePrecision === "5 de marzo de 1603"
    && rakvereBattleDetail.parent === "Guerra polaco-sueca de 1600-1611"
    && rakvereBattleDetail.campaign === "Campa\u00f1a de Livonia de 1603"
    && rakvereBattleDetail.type === "batalla terrestre"
    && rakvereBattleDetail.conflictType === "interestatal"
    && rakvereBattleDetail.hierarchyConfidence === "alta"
    && rakvereBattleDetail.hierarchySources?.length >= 4
    && rakvereBattleDetail.hierarchySources.every(item => item.label && item.url)
    && rakvereBattleDetail.participants?.length === 2
    && rakvereBattleDetail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /Victoria polaco-lituana/i.test(rakvereBattleDetail.outcome)
    && /batalla medieval de 1268/i.test(rakvereBattleDetail.sourceDispute),
  "la curaduria de Rakvere debe preservar fecha, jerarquia, fuentes, participantes y el control del homonimo medieval"
);
const rakvereWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Rakvere");
assert.equal(rakvereWikipediaOverride.language, "en");
assert.equal(rakvereWikipediaOverride.pageTitle, "Battle_of_Rakvere_(1603)");
assert.equal(Object.keys(HREBIONKA_1920_CONFLICT_DETAIL_FIXES).length, 2);
assert.equal(
  HREBIONKA_1920_CONFLICT_RENAMES["Batalla de Hrebionka"],
  "Carga de Hrebionka (1920)"
);
assert.equal(
  HREBIONKA_1920_CONFLICT_RENAMES["Battle of Hrebionka"],
  "Carga de Hrebionka (1920)",
  "el alias ingles de Hrebionka debe llegar a la ficha curada"
);
assert.deepEqual(
  HREBIONKA_1920_COUNTRY_CONFLICT_ADDITIONS,
  {
    Polonia: ["Guerra polaco-sovietica (1919-1921)", "Carga de Hrebionka (1920)"],
    Rusia: ["Guerra polaco-sovietica (1919-1921)"],
    Bielorrusia: ["Carga de Hrebionka (1920)"]
  }
);
const polishSovietWarDetail = HREBIONKA_1920_CONFLICT_DETAIL_FIXES["Guerra polaco-sovietica (1919-1921)"];
assert.ok(
  polishSovietWarDetail
    && polishSovietWarDetail.startYear === 1919
    && polishSovietWarDetail.endYear === 1921
    && polishSovietWarDetail.conflictType === "interestatal"
    && polishSovietWarDetail.hierarchyConfidence === "alta"
    && polishSovietWarDetail.hierarchySources?.length >= 3
    && polishSovietWarDetail.participants?.length === 2
    && /Tratado de Riga/i.test(polishSovietWarDetail.outcome)
    && /1919-1921/i.test(polishSovietWarDetail.sourceDispute),
  "la guerra polaco-sovietica debe conservar su alcance temporal, fuentes y cierre diplomatico"
);
const hrebionkaBattleDetail = HREBIONKA_1920_CONFLICT_DETAIL_FIXES["Carga de Hrebionka (1920)"];
assert.ok(
  hrebionkaBattleDetail
    && hrebionkaBattleDetail.startYear === 1920
    && hrebionkaBattleDetail.startYear === hrebionkaBattleDetail.endYear
    && hrebionkaBattleDetail.datePrecision === "9 de julio de 1920"
    && hrebionkaBattleDetail.parent === "Guerra polaco-sovietica (1919-1921)"
    && hrebionkaBattleDetail.campaign === "Ofensiva sovietica de julio de 1920"
    && hrebionkaBattleDetail.type === "carga de caballeria"
    && hrebionkaBattleDetail.conflictType === "interestatal"
    && hrebionkaBattleDetail.hierarchyConfidence === "alta"
    && hrebionkaBattleDetail.hierarchySources?.length >= 4
    && hrebionkaBattleDetail.hierarchySources.every(item => item.label && item.url)
    && hrebionkaBattleDetail.participants?.length === 2
    && hrebionkaBattleDetail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /Victoria tactica polaca/i.test(hrebionkaBattleDetail.outcome)
    && /2 de julio/i.test(hrebionkaBattleDetail.sourceDispute),
  "la curaduria de Hrebionka debe preservar fecha, jerarquia, fuentes, participantes y cautela sobre relatos regimentalistas"
);
assert.equal(Object.keys(KAMANI_1993_CONFLICT_DETAIL_FIXES).length, 2);
assert.equal(
  KAMANI_1993_CONFLICT_RENAMES["Batalla de Kamani"],
  "Batalla de Kamani (1993)"
);
assert.equal(
  KAMANI_1993_CONFLICT_RENAMES["Battle of Kamani"],
  "Batalla de Kamani (1993)",
  "el alias ingles de Kamani debe llegar a la ficha curada"
);
const abkhaziaWarDetail = KAMANI_1993_CONFLICT_DETAIL_FIXES["Guerra de Abjasia"];
assert.ok(
  abkhaziaWarDetail
    && abkhaziaWarDetail.startYear === 1992
    && abkhaziaWarDetail.endYear === 1993
    && abkhaziaWarDetail.type === "guerra secesionista"
    && abkhaziaWarDetail.conflictType === "civil"
    && abkhaziaWarDetail.hierarchyConfidence === "alta"
    && abkhaziaWarDetail.hierarchySources?.length >= 3
    && abkhaziaWarDetail.hierarchySources.every(item => item.label && item.url)
    && abkhaziaWarDetail.participants?.length === 2
    && abkhaziaWarDetail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /Sujumi/i.test(abkhaziaWarDetail.outcome)
    && /estatus de Abjasia/i.test(abkhaziaWarDetail.sourceDispute),
  "la Guerra de Abjasia debe conservar alcance, fuentes, bandos y cautela sobre estatus y actores externos"
);
const kamaniBattleDetail = KAMANI_1993_CONFLICT_DETAIL_FIXES["Batalla de Kamani (1993)"];
assert.ok(
  kamaniBattleDetail
    && kamaniBattleDetail.startYear === 1993
    && kamaniBattleDetail.startYear === kamaniBattleDetail.endYear
    && kamaniBattleDetail.datePrecision === "julio de 1993"
    && kamaniBattleDetail.parent === "Guerra de Abjasia"
    && kamaniBattleDetail.campaign === "Ofensivas abjasias sobre Sujumi de 1993"
    && kamaniBattleDetail.type === "combate por localidad"
    && kamaniBattleDetail.conflictType === "civil"
    && kamaniBattleDetail.hierarchyConfidence === "alta"
    && kamaniBattleDetail.hierarchySources?.length >= 3
    && kamaniBattleDetail.hierarchySources.every(item => item.label && item.url)
    && kamaniBattleDetail.participants?.length === 2
    && kamaniBattleDetail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /aseguraron Kamani/i.test(kamaniBattleDetail.outcome)
    && /precision mensual/i.test(kamaniBattleDetail.sourceDispute),
  "la curaduria de Kamani debe preservar fecha mensual, jerarquia, fuentes, participantes y cautela sobre bajas"
);
assert.equal(Object.keys(CEDAR_MOUNTAIN_1862_CONFLICT_DETAIL_FIXES).length, 2);
assert.equal(
  CEDAR_MOUNTAIN_1862_CONFLICT_RENAMES["Batalla de Little Mountain"],
  "Batalla de Cedar Mountain (1862)"
);
assert.equal(
  CEDAR_MOUNTAIN_1862_CONFLICT_RENAMES["Battle of Cedar Mountain"],
  "Batalla de Cedar Mountain (1862)",
  "el alias ingles de Cedar Mountain debe llegar a la ficha curada"
);
assert.deepEqual(
  CEDAR_MOUNTAIN_1862_COUNTRY_CONFLICT_ADDITIONS,
  {
    "Estados Unidos": ["Guerra Civil estadounidense", "Batalla de Cedar Mountain (1862)"]
  }
);
const usCivilWarDetail = CEDAR_MOUNTAIN_1862_CONFLICT_DETAIL_FIXES["Guerra Civil estadounidense"];
assert.ok(
  usCivilWarDetail
    && usCivilWarDetail.startYear === 1861
    && usCivilWarDetail.endYear === 1865
    && usCivilWarDetail.type === "guerra civil"
    && usCivilWarDetail.conflictType === "civil"
    && usCivilWarDetail.hierarchyConfidence === "alta"
    && usCivilWarDetail.hierarchySources?.length >= 3
    && usCivilWarDetail.hierarchySources.every(item => item.label && item.url)
    && usCivilWarDetail.participants?.length === 2
    && usCivilWarDetail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /Appomattox/i.test(usCivilWarDetail.outcome)
    && /cifras de muertos/i.test(usCivilWarDetail.sourceDispute),
  "la Guerra Civil estadounidense debe quedar navegable con alcance, fuentes, bandos y cautela sobre cierres y bajas"
);
const cedarMountainDetail = CEDAR_MOUNTAIN_1862_CONFLICT_DETAIL_FIXES["Batalla de Cedar Mountain (1862)"];
assert.ok(
  cedarMountainDetail
    && cedarMountainDetail.startYear === 1862
    && cedarMountainDetail.startYear === cedarMountainDetail.endYear
    && cedarMountainDetail.datePrecision === "9 de agosto de 1862"
    && cedarMountainDetail.parent === "Guerra Civil estadounidense"
    && cedarMountainDetail.campaign === "Campa\u00f1a de Virginia del Norte de 1862"
    && cedarMountainDetail.type === "batalla terrestre"
    && cedarMountainDetail.conflictType === "civil"
    && cedarMountainDetail.hierarchyConfidence === "alta"
    && cedarMountainDetail.hierarchySources?.length >= 3
    && cedarMountainDetail.hierarchySources.every(item => item.label && item.url)
    && cedarMountainDetail.participants?.length === 2
    && cedarMountainDetail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /Victoria tactica confederada/i.test(cedarMountainDetail.outcome)
    && /Little Mountain era ambigua/i.test(cedarMountainDetail.sourceDispute),
  "la curaduria de Cedar Mountain debe preservar fecha, jerarquia, fuentes, participantes y cautela sobre alias y bajas"
);
const cedarMountainWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Little Mountain");
assert.equal(cedarMountainWikipediaOverride.language, "es");
assert.equal(cedarMountainWikipediaOverride.pageTitle, "Batalla de Cedar Mountain");
assert.equal(Object.keys(MANI_MANI_1898_CONFLICT_DETAIL_FIXES).length, 2);
assert.equal(
  MANI_MANI_1898_CONFLICT_RENAMES["Batalla de Mani-Mani"],
  "Batalla de Mani-Mani (1898)"
);
assert.equal(
  MANI_MANI_1898_CONFLICT_RENAMES["Battle of Manimani"],
  "Batalla de Mani-Mani (1898)",
  "el alias ingles de Mani-Mani debe llegar a la ficha curada"
);
assert.deepEqual(
  MANI_MANI_1898_COUNTRY_CONFLICT_ADDITIONS,
  {
    "Estados Unidos": ["Guerra hispano-estadounidense", "Batalla de Mani-Mani (1898)"],
    "Espa\u00f1a": ["Guerra hispano-estadounidense", "Batalla de Mani-Mani (1898)"],
    Cuba: ["Guerra hispano-estadounidense", "Batalla de Mani-Mani (1898)"]
  }
);
const spanishAmericanWarDetail = MANI_MANI_1898_CONFLICT_DETAIL_FIXES["Guerra hispano-estadounidense"];
assert.ok(
  spanishAmericanWarDetail
    && spanishAmericanWarDetail.startYear === 1898
    && spanishAmericanWarDetail.endYear === 1898
    && spanishAmericanWarDetail.type === "guerra interestatal"
    && spanishAmericanWarDetail.conflictType === "interestatal"
    && spanishAmericanWarDetail.hierarchyConfidence === "alta"
    && spanishAmericanWarDetail.hierarchySources?.length >= 3
    && spanishAmericanWarDetail.hierarchySources.every(item => item.label && item.url)
    && spanishAmericanWarDetail.participants?.length === 3
    && spanishAmericanWarDetail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /Tratado de Paris/i.test(spanishAmericanWarDetail.outcome)
    && /Espa\u00f1a/i.test(spanishAmericanWarDetail.outcome)
    && /clasificaci\u00f3n interestatal/i.test(spanishAmericanWarDetail.sourceDispute),
  "la Guerra hispano-estadounidense debe conservar alcance, fuentes, bandos y el matiz colonial e independentista"
);
const maniManiDetail = MANI_MANI_1898_CONFLICT_DETAIL_FIXES["Batalla de Mani-Mani (1898)"];
assert.ok(
  maniManiDetail
    && maniManiDetail.startYear === 1898
    && maniManiDetail.startYear === maniManiDetail.endYear
    && maniManiDetail.datePrecision === "23 de julio de 1898"
    && maniManiDetail.parent === "Guerra hispano-estadounidense"
    && maniManiDetail.campaign === "Operaciones en el occidente de Cuba de julio de 1898"
    && maniManiDetail.type === "combate de desembarco"
    && maniManiDetail.conflictType === "interestatal"
    && maniManiDetail.hierarchyConfidence === "alta"
    && maniManiDetail.hierarchySources?.length >= 3
    && maniManiDetail.hierarchySources.every(item => item.label && item.url)
    && maniManiDetail.participants?.length === 2
    && maniManiDetail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /Wanderer qued\u00f3 averiado/i.test(maniManiDetail.outcome)
    && /espa\u00f1ola/i.test(maniManiDetail.outcome)
    && /no fija cifras cerradas/i.test(maniManiDetail.sourceDispute),
  "la curaduria de Mani-Mani debe preservar fecha, jerarquia, fuentes, participantes y cautela sobre lugar, desembarco y bajas"
);
const maniManiWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Mani-Mani");
assert.equal(maniManiWikipediaOverride.language, "es");
assert.equal(maniManiWikipediaOverride.pageTitle, "Batalla de Mani-Mani");
assert.equal(Object.keys(MOUNT_GRAY_1864_CONFLICT_DETAIL_FIXES).length, 2);
assert.equal(
  MOUNT_GRAY_1864_CONFLICT_RENAMES["Batalla de Mount Gray"],
  "Batalla de Mount Gray (1864)"
);
assert.equal(
  MOUNT_GRAY_1864_CONFLICT_RENAMES["Battle of Mount Gray"],
  "Batalla de Mount Gray (1864)",
  "el alias ingles de Mount Gray debe llegar a la ficha curada"
);
assert.deepEqual(
  MOUNT_GRAY_1864_COUNTRY_CONFLICT_ADDITIONS,
  {
    "Estados Unidos": ["Guerras apaches", "Batalla de Mount Gray (1864)"]
  }
);
const apacheWarsDetail = MOUNT_GRAY_1864_CONFLICT_DETAIL_FIXES["Guerras apaches"];
assert.ok(
  apacheWarsDetail
    && apacheWarsDetail.startYear === 1849
    && apacheWarsDetail.endYear === 1924
    && apacheWarsDetail.type === "guerras y campa\u00f1as de frontera"
    && apacheWarsDetail.conflictType === "frontera"
    && apacheWarsDetail.hierarchyConfidence === "alta"
    && apacheWarsDetail.hierarchySources?.length >= 3
    && apacheWarsDetail.hierarchySources.every(item => item.label && item.url)
    && apacheWarsDetail.participants?.length === 2
    && apacheWarsDetail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /no existe un unico desenlace/i.test(apacheWarsDetail.outcome)
    && /etiqueta paraguas/i.test(apacheWarsDetail.sourceDispute),
  "las Guerras apaches deben distinguir su alcance heterogeneo, fuentes y actores sin tratarlos como una guerra estatal unica"
);
const mountGrayDetail = MOUNT_GRAY_1864_CONFLICT_DETAIL_FIXES["Batalla de Mount Gray (1864)"];
assert.ok(
  mountGrayDetail
    && mountGrayDetail.startYear === 1864
    && mountGrayDetail.startYear === mountGrayDetail.endYear
    && mountGrayDetail.datePrecision === "7 de abril de 1864"
    && mountGrayDetail.parent === "Guerras apaches"
    && mountGrayDetail.campaign === "Operaciones de la Columna de California en el suroeste de 1864"
    && mountGrayDetail.type === "combate de frontera"
    && mountGrayDetail.conflictType === "frontera"
    && mountGrayDetail.hierarchyConfidence === "alta"
    && mountGrayDetail.hierarchySources?.length >= 3
    && mountGrayDetail.hierarchySources.every(item => item.label && item.url)
    && mountGrayDetail.participants?.length === 2
    && mountGrayDetail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /45 caballos y mulas/i.test(mountGrayDetail.outcome)
    && /parte federal/i.test(mountGrayDetail.sourceDispute)
    && /no hay en las fuentes consultadas un parte apache equivalente/i.test(mountGrayDetail.participants[1].casualties),
  "la curaduria de Mount Gray debe preservar fecha, jerarquia, fuentes y cautela sobre la asimetria documental"
);
const mountGrayWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Mount Gray (1864)");
assert.equal(mountGrayWikipediaOverride.language, "en");
assert.equal(mountGrayWikipediaOverride.pageTitle, "Battle_of_Mount_Gray");
assert.equal(Object.keys(MIMBRES_RIVER_1860_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  MIMBRES_RIVER_1860_CONFLICT_RENAMES["Batalla de Mimbres River"],
  "Ataque del rio Mimbres (1860)"
);
assert.equal(
  MIMBRES_RIVER_1860_CONFLICT_RENAMES["Battle of the Mimbres River"],
  "Ataque del rio Mimbres (1860)",
  "el alias ingles de Mimbres debe llegar a la ficha curada"
);
assert.deepEqual(
  MIMBRES_RIVER_1860_COUNTRY_CONFLICT_ADDITIONS,
  {
    "Estados Unidos": ["Guerras apaches", "Ataque del rio Mimbres (1860)"]
  }
);
const mimbresRiverDetail = MIMBRES_RIVER_1860_CONFLICT_DETAIL_FIXES["Ataque del rio Mimbres (1860)"];
assert.ok(
  mimbresRiverDetail
    && mimbresRiverDetail.startYear === 1860
    && mimbresRiverDetail.startYear === mimbresRiverDetail.endYear
    && mimbresRiverDetail.datePrecision === "4 de diciembre de 1860"
    && mimbresRiverDetail.parent === "Guerras apaches"
    && mimbresRiverDetail.campaign === "Conflictos mineros y de frontera en el Mimbres (1860)"
    && mimbresRiverDetail.type === "ataque de frontera"
    && mimbresRiverDetail.conflictType === "frontera"
    && mimbresRiverDetail.hierarchyConfidence === "alta"
    && mimbresRiverDetail.hierarchySources?.length >= 3
    && mimbresRiverDetail.hierarchySources.every(item => item.label && item.url)
    && mimbresRiverDetail.participants?.length === 2
    && mimbresRiverDetail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /28 mineros/i.test(mimbresRiverDetail.chronology[0].event)
    && /bibliografia secundaria no coincide/i.test(mimbresRiverDetail.sourceDispute),
  "la curaduria del rio Mimbres debe preservar fecha, jerarquia, fuentes, bandos y cautela sobre las discrepancias"
);
const mimbresRiverWikipediaOverride = await resolveWikipediaConflictTitle("Ataque del rio Mimbres (1860)");
assert.equal(mimbresRiverWikipediaOverride.language, "en");
assert.equal(mimbresRiverWikipediaOverride.pageTitle, "Battle_of_the_Mimbres_River");
assert.equal(Object.keys(FLORIDA_MOUNTAINS_1861_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  FLORIDA_MOUNTAINS_1861_CONFLICT_RENAMES["Batalla de Florida Mountains"],
  "Combate de las monta\u00f1as Florida (1861)"
);
assert.equal(
  FLORIDA_MOUNTAINS_1861_CONFLICT_RENAMES["Battle of the Florida Mountains"],
  "Combate de las monta\u00f1as Florida (1861)",
  "el alias ingles de Florida Mountains debe llegar a la ficha curada"
);
assert.equal(
  FLORIDA_MOUNTAINS_1861_CONFLICT_RENAMES["Combate de las montanas Florida (1861)"],
  "Combate de las monta\u00f1as Florida (1861)",
  "la variante ASCII previa debe fusionarse con el nombre visible acentuado"
);
assert.deepEqual(
  FLORIDA_MOUNTAINS_1861_COUNTRY_CONFLICT_ADDITIONS,
  {
    "Estados Unidos": ["Guerras apaches", "Combate de las monta\u00f1as Florida (1861)"]
  }
);
const floridaMountainsDetail = FLORIDA_MOUNTAINS_1861_CONFLICT_DETAIL_FIXES["Combate de las monta\u00f1as Florida (1861)"];
assert.ok(
  floridaMountainsDetail
    && floridaMountainsDetail.startYear === 1861
    && floridaMountainsDetail.startYear === floridaMountainsDetail.endYear
    && floridaMountainsDetail.datePrecision === "agosto de 1861; el dia exacto no esta consolidado"
    && floridaMountainsDetail.parent === "Guerras apaches"
    && floridaMountainsDetail.campaign === "Operaciones de Cooke's Canyon de 1861"
    && floridaMountainsDetail.type === "combate de frontera"
    && floridaMountainsDetail.conflictType === "frontera"
    && floridaMountainsDetail.hierarchyConfidence === "media"
    && floridaMountainsDetail.hierarchySources?.length >= 3
    && floridaMountainsDetail.hierarchySources.every(item => item.label && item.url)
    && floridaMountainsDetail.participants?.length === 2
    && floridaMountainsDetail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /Smith afirmo/i.test(floridaMountainsDetail.outcome)
    && /dia exacto no esta consolidado/i.test(floridaMountainsDetail.sourceDispute),
  "la curaduria de Florida Mountains debe preservar fecha mensual, jerarquia, fuentes, bandos y cautela sobre bajas"
);
const floridaMountainsWikipediaOverride = await resolveWikipediaConflictTitle("Combate de las monta\u00f1as Florida (1861)");
assert.equal(floridaMountainsWikipediaOverride.language, "en");
assert.equal(floridaMountainsWikipediaOverride.pageTitle, "Battle_of_the_Florida_Mountains");
assert.equal(Object.keys(ILE_RONDE_1794_CONFLICT_DETAIL_FIXES).length, 2);
assert.equal(
  ILE_RONDE_1794_CONFLICT_RENAMES["Batalla de \u00cele Ronde"],
  "Batalla naval de \u00cele Ronde (1794)"
);
assert.equal(
  ILE_RONDE_1794_CONFLICT_RENAMES["Guerras revolucionarias francesas"],
  "Guerras revolucionarias francesas (1792-1802)",
  "la ficha padre breve debe migrar al nombre periodizado"
);
assert.equal(
  ILE_RONDE_1794_CONFLICT_REFERENCE_RENAMES["Guerras revolucionarias francesas"],
  "Guerras revolucionarias francesas (1792-1802)",
  "las referencias hijas deben usar la misma ficha padre periodizada"
);
assert.equal(
  ILE_RONDE_1794_CONFLICT_RENAMES["Batalla naval de Ile Ronde (1794)"],
  "Batalla naval de \u00cele Ronde (1794)",
  "la variante sin acento debe llegar a la ficha curada de Ile Ronde"
);
assert.deepEqual(
  ILE_RONDE_1794_COUNTRY_CONFLICT_ADDITIONS,
  {
    Francia: ["Guerras revolucionarias francesas (1792-1802)", "Batalla naval de \u00cele Ronde (1794)"],
    "Reino Unido": ["Guerras revolucionarias francesas (1792-1802)", "Batalla naval de \u00cele Ronde (1794)"]
  }
);
const frenchRevolutionaryWarsDetail = ILE_RONDE_1794_CONFLICT_DETAIL_FIXES["Guerras revolucionarias francesas (1792-1802)"];
assert.ok(
  frenchRevolutionaryWarsDetail
    && frenchRevolutionaryWarsDetail.startYear === 1792
    && frenchRevolutionaryWarsDetail.endYear === 1802
    && frenchRevolutionaryWarsDetail.type === "guerra"
    && frenchRevolutionaryWarsDetail.conflictType === "interestatal"
    && frenchRevolutionaryWarsDetail.hierarchySources?.length >= 2
    && frenchRevolutionaryWarsDetail.hierarchySources.every(item => item.label && item.url)
    && frenchRevolutionaryWarsDetail.participants?.length === 2
    && /periodizaci\u00f3n no es \u00fanica/i.test(frenchRevolutionaryWarsDetail.sourceDispute),
  "la guerra padre debe poder abrirse con periodo, fuentes, bandos y limites de la periodizacion"
);
const ileRondeDetail = ILE_RONDE_1794_CONFLICT_DETAIL_FIXES["Batalla naval de \u00cele Ronde (1794)"];
assert.ok(
  ileRondeDetail
    && ileRondeDetail.startYear === 1794
    && ileRondeDetail.startYear === ileRondeDetail.endYear
    && ileRondeDetail.datePrecision === "22 de octubre de 1794"
    && ileRondeDetail.parent === "Guerras revolucionarias francesas (1792-1802)"
    && ileRondeDetail.campaign === "Operaciones navales anglo-francesas en el oc\u00e9ano \u00cdndico (1794)"
    && ileRondeDetail.type === "batalla naval"
    && ileRondeDetail.conflictType === "interestatal"
    && ileRondeDetail.hierarchyConfidence === "alta"
    && ileRondeDetail.hierarchySources?.length >= 3
    && ileRondeDetail.hierarchySources.every(item => item.label && item.url)
    && ileRondeDetail.participants?.length === 2
    && ileRondeDetail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /no concluyente/i.test(ileRondeDetail.outcome)
    && /no coinciden por completo/i.test(ileRondeDetail.sourceDispute),
  "la curaduria de Ile Ronde debe preservar fecha, jerarquia, fuentes, bandos y cautela sobre resultado y bajas"
);
const ileRondeWikipediaOverride = await resolveWikipediaConflictTitle("Batalla naval de \u00cele Ronde (1794)");
assert.equal(ileRondeWikipediaOverride.language, "en");
assert.equal(ileRondeWikipediaOverride.pageTitle, "Battle_of_\u00cele_Ronde");
assert.equal(Object.keys(DRAGOON_SPRINGS_1862_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  DRAGOON_SPRINGS_1862_CONFLICT_RENAMES["Primera batalla de Dragoon Springs"],
  "Primera batalla de Dragoon Springs (1862)"
);
assert.equal(
  DRAGOON_SPRINGS_1862_CONFLICT_RENAMES["First Battle of Dragoon Springs"],
  "Primera batalla de Dragoon Springs (1862)",
  "el alias ingles debe llegar a la ficha curada de Dragoon Springs"
);
assert.deepEqual(
  DRAGOON_SPRINGS_1862_COUNTRY_CONFLICT_ADDITIONS,
  {
    "Estados Unidos": ["Guerras apaches", "Primera batalla de Dragoon Springs (1862)"]
  }
);
const dragoonSpringsDetail = DRAGOON_SPRINGS_1862_CONFLICT_DETAIL_FIXES["Primera batalla de Dragoon Springs (1862)"];
assert.ok(
  dragoonSpringsDetail
    && dragoonSpringsDetail.startYear === 1862
    && dragoonSpringsDetail.startYear === dragoonSpringsDetail.endYear
    && dragoonSpringsDetail.datePrecision === "5 de mayo de 1862"
    && dragoonSpringsDetail.parent === "Guerras apaches"
    && dragoonSpringsDetail.campaign === "Operaciones confederadas y apaches en Dragoon Springs (1862)"
    && dragoonSpringsDetail.type === "combate de frontera"
    && dragoonSpringsDetail.conflictType === "frontera"
    && dragoonSpringsDetail.hierarchyConfidence === "media"
    && dragoonSpringsDetail.hierarchySources?.length >= 3
    && dragoonSpringsDetail.hierarchySources.every(item => item.label && item.url)
    && dragoonSpringsDetail.participants?.length === 2
    && dragoonSpringsDetail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /ventaja tactica apache/i.test(dragoonSpringsDetail.outcome)
    && /difieren sobre si la partida estaba en retirada/i.test(dragoonSpringsDetail.sourceDispute),
  "la curaduria de Dragoon Springs debe separar la accion apache de la jerarquia generica, con fecha, fuentes y limites claros"
);
const dragoonSpringsWikipediaOverride = await resolveWikipediaConflictTitle("Primera batalla de Dragoon Springs (1862)");
assert.equal(dragoonSpringsWikipediaOverride.language, "en");
assert.equal(dragoonSpringsWikipediaOverride.pageTitle, "First_Battle_of_Dragoon_Springs");
assert.equal(Object.keys(LITTLE_DRY_CREEK_1885_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  LITTLE_DRY_CREEK_1885_CONFLICT_RENAMES["Batalla de Little Dry Creek"],
  "Combate de Little Dry Creek (1885)"
);
assert.equal(
  LITTLE_DRY_CREEK_1885_CONFLICT_RENAMES["Battle of Little Dry Creek"],
  "Combate de Little Dry Creek (1885)",
  "el alias ingles debe llegar a la ficha curada de Little Dry Creek"
);
assert.deepEqual(
  LITTLE_DRY_CREEK_1885_COUNTRY_CONFLICT_ADDITIONS,
  {
    "Estados Unidos": ["Guerras apaches", "Combate de Little Dry Creek (1885)"]
  }
);
const littleDryCreekDetail = LITTLE_DRY_CREEK_1885_CONFLICT_DETAIL_FIXES["Combate de Little Dry Creek (1885)"];
assert.ok(
  littleDryCreekDetail
    && littleDryCreekDetail.startYear === 1885
    && littleDryCreekDetail.startYear === littleDryCreekDetail.endYear
    && littleDryCreekDetail.datePrecision === "19 de diciembre de 1885"
    && littleDryCreekDetail.parent === "Guerras apaches"
    && littleDryCreekDetail.campaign === "Campa\u00f1a de Ger\u00f3nimo de 1885-1886"
    && littleDryCreekDetail.type === "combate de frontera"
    && littleDryCreekDetail.conflictType === "colonial"
    && littleDryCreekDetail.hierarchyConfidence === "alta"
    && littleDryCreekDetail.hierarchySources?.length >= 3
    && littleDryCreekDetail.hierarchySources.every(item => item.label && item.url)
    && littleDryCreekDetail.participants?.length === 2
    && littleDryCreekDetail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /emboscada eficaz/i.test(littleDryCreekDetail.outcome)
    && /perspectiva de la columna estadounidense/i.test(littleDryCreekDetail.sourceDispute),
  "la curaduria de Little Dry Creek debe fijar fecha, jerarquia y fuentes sin convertir los partes militares en cifras cerradas"
);
const littleDryCreekWikipediaOverride = await resolveWikipediaConflictTitle("Combate de Little Dry Creek (1885)");
assert.equal(littleDryCreekWikipediaOverride.language, "en");
assert.equal(littleDryCreekWikipediaOverride.pageTitle, "Battle_of_Little_Dry_Creek");
assert.equal(Object.keys(FAYETTEVILLE_1863_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  FAYETTEVILLE_1863_CONFLICT_RENAMES["Batalla de Fayetteville"],
  "Batalla de Fayetteville (Arkansas, 1863)"
);
assert.equal(
  FAYETTEVILLE_1863_CONFLICT_RENAMES["Action at Fayetteville"],
  "Batalla de Fayetteville (Arkansas, 1863)",
  "el alias historico Action at Fayetteville debe llegar a la ficha curada"
);
assert.deepEqual(
  FAYETTEVILLE_1863_COUNTRY_CONFLICT_ADDITIONS,
  {
    "Estados Unidos": ["Guerra Civil estadounidense", "Batalla de Fayetteville (Arkansas, 1863)"]
  }
);
const fayettevilleDetail = FAYETTEVILLE_1863_CONFLICT_DETAIL_FIXES["Batalla de Fayetteville (Arkansas, 1863)"];
assert.ok(
  fayettevilleDetail
    && fayettevilleDetail.startYear === 1863
    && fayettevilleDetail.startYear === fayettevilleDetail.endYear
    && fayettevilleDetail.datePrecision === "18 de abril de 1863"
    && fayettevilleDetail.parent === "Guerra Civil estadounidense"
    && fayettevilleDetail.campaign === "Operaciones de Arkansas noroccidental de 1863"
    && fayettevilleDetail.type === "batalla terrestre"
    && fayettevilleDetail.conflictType === "civil"
    && fayettevilleDetail.hierarchyConfidence === "alta"
    && fayettevilleDetail.hierarchySources?.length >= 3
    && fayettevilleDetail.hierarchySources.every(item => item.label && item.url)
    && fayettevilleDetail.participants?.length === 2
    && fayettevilleDetail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /no reduce esa secuencia a una victoria unica/i.test(fayettevilleDetail.outcome)
    && /distingue la retirada del 18 de abril/i.test(fayettevilleDetail.sourceDispute),
  "la curaduria de Fayetteville debe distinguir la accion de 1863, su jerarquia civil y los resultados que las fuentes discuten"
);
const fayettevilleWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Fayetteville (Arkansas, 1863)");
assert.equal(fayettevilleWikipediaOverride.language, "en");
assert.equal(fayettevilleWikipediaOverride.pageTitle, "Battle_of_Fayetteville_(1863)");
assert.equal(Object.keys(OSTRODA_1628_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  OSTRODA_1628_CONFLICT_RENAMES["Batalla de Ostróda"],
  "Batalla de Ostróda (1628)"
);
assert.equal(
  OSTRODA_1628_CONFLICT_RENAMES["Battle of Ostroda"],
  "Batalla de Ostróda (1628)",
  "el alias sin diacriticos debe llegar a la ficha curada de Ostroda"
);
assert.deepEqual(
  OSTRODA_1628_COUNTRY_CONFLICT_ADDITIONS,
  {
    Polonia: ["Batalla de Ostróda (1628)"]
  }
);
const ostrodaDetail = OSTRODA_1628_CONFLICT_DETAIL_FIXES["Batalla de Ostróda (1628)"];
assert.ok(
  ostrodaDetail
    && ostrodaDetail.startYear === 1628
    && ostrodaDetail.startYear === ostrodaDetail.endYear
    && ostrodaDetail.parent === "Guerra polaco-sueca de 1626-1629"
    && ostrodaDetail.campaign === "Operaciones de Prusia de 1628"
    && ostrodaDetail.type === "batalla terrestre"
    && ostrodaDetail.conflictType === "interestatal"
    && ostrodaDetail.scale === "regional"
    && ostrodaDetail.hierarchySources?.length >= 2
    && ostrodaDetail.participants?.length === 2
    && ostrodaDetail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /Baudissin fue capturado/i.test(ostrodaDetail.outcome)
    && /no fija bajas ni interpreta el episodio/i.test(ostrodaDetail.sourceDispute),
  "la curaduria de Ostroda debe fijar fecha, jerarquia y captura sin inventar bajas"
);
const ostrodaWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Ostróda (1628)");
assert.equal(ostrodaWikipediaOverride.language, "en");
assert.equal(ostrodaWikipediaOverride.pageTitle, "Battle_of_Ostróda");
assert.equal(Object.keys(MONA_PASSAGE_1782_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  MONA_PASSAGE_1782_CONFLICT_RENAMES["Batalla de Mona Passage"],
  "Batalla del canal de la Mona (1782)"
);
assert.equal(
  MONA_PASSAGE_1782_CONFLICT_RENAMES["Battle of the Mona Passage"],
  "Batalla del canal de la Mona (1782)",
  "el alias ingles debe llegar a la ficha curada del canal de la Mona"
);
assert.deepEqual(
  MONA_PASSAGE_1782_COUNTRY_CONFLICT_ADDITIONS,
  {
    Francia: ["Guerra de Independencia de Estados Unidos", "Batalla del canal de la Mona (1782)"],
    "Reino Unido": ["Guerra de Independencia de Estados Unidos", "Batalla del canal de la Mona (1782)"]
  }
);
const monaPassageDetail = MONA_PASSAGE_1782_CONFLICT_DETAIL_FIXES["Batalla del canal de la Mona (1782)"];
assert.ok(
  monaPassageDetail
    && monaPassageDetail.startYear === 1782
    && monaPassageDetail.startYear === monaPassageDetail.endYear
    && monaPassageDetail.parent === "Guerra de Independencia de Estados Unidos"
    && monaPassageDetail.campaign === "Persecucion britanica en el canal de la Mona (1782)"
    && monaPassageDetail.type === "batalla naval"
    && monaPassageDetail.conflictType === "interestatal"
    && monaPassageDetail.scale === "internacional"
    && monaPassageDetail.hierarchySources?.length >= 2
    && monaPassageDetail.participants?.length === 2
    && monaPassageDetail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /Caton y Jason/i.test(monaPassageDetail.outcome)
    && /no fija efectivos, bajas ni un total/i.test(monaPassageDetail.sourceDispute),
  "la curaduria del canal de la Mona debe fijar fecha, jerarquia y capturas verificadas sin inventar bajas"
);
const monaPassageWikipediaOverride = await resolveWikipediaConflictTitle("Batalla del canal de la Mona (1782)");
assert.equal(monaPassageWikipediaOverride.language, "en");
assert.equal(monaPassageWikipediaOverride.pageTitle, "Battle_of_the_Mona_Passage");
assert.equal(Object.keys(NEUVILLE_1760_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  NEUVILLE_1760_CONFLICT_RENAMES["Batalla de Neuville"],
  "Batalla de Neuville (1760)"
);
assert.equal(
  NEUVILLE_1760_CONFLICT_RENAMES["Battle of Pointe-aux-Trembles"],
  "Batalla de Neuville (1760)",
  "el alias ingles debe resolver la batalla naval de Neuville"
);
assert.deepEqual(
  NEUVILLE_1760_COUNTRY_CONFLICT_ADDITIONS,
  {
    "Canadá": ["Batalla de Neuville (1760)"],
    Francia: ["Batalla de Neuville (1760)"],
    "Reino Unido": ["Batalla de Neuville (1760)"]
  }
);
assert.deepEqual(
  NEUVILLE_1760_COUNTRY_CONFLICT_EXCLUSIONS,
  {
    "Canadá": ["Guerra franco-india (1754-1763)"],
    Francia: ["Guerra franco-india (1754-1763)"],
    "Reino Unido": ["Guerra franco-india (1754-1763)"]
  },
  "el padre sin ficha completa no debe exponerse como entrada de país"
);
const neuvilleDetail = NEUVILLE_1760_CONFLICT_DETAIL_FIXES["Batalla de Neuville (1760)"];
assert.ok(
  neuvilleDetail
    && neuvilleDetail.startYear === 1760
    && neuvilleDetail.startYear === neuvilleDetail.endYear
    && neuvilleDetail.parent === "Guerra franco-india (1754-1763)"
    && neuvilleDetail.campaign === "Socorro naval británico y levantamiento del asedio de Quebec (mayo de 1760)"
    && neuvilleDetail.type === "batalla naval"
    && neuvilleDetail.conflictType === "colonial"
    && neuvilleDetail.scale === "internacional"
    && neuvilleDetail.hierarchySources?.length >= 2
    && neuvilleDetail.participants?.length === 2
    && neuvilleDetail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /Atalante termino encallada/i.test(neuvilleDetail.outcome)
    && /no fija bajas ni convierte el episodio/i.test(neuvilleDetail.sourceDispute),
  "la curaduria de Neuville debe fijar fecha, jerarquia y encallamiento de Atalante sin inventar bajas"
);
const neuvilleWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Neuville (1760)");
assert.equal(neuvilleWikipediaOverride.language, "en");
assert.equal(neuvilleWikipediaOverride.pageTitle, "Battle_of_Pointe-aux-Trembles");
assert.equal(Object.keys(ORFORD_NESS_1704_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  ORFORD_NESS_1704_CONFLICT_RENAMES["Batalla de Orford Ness"],
  "Batalla naval de Orford Ness (1704)"
);
assert.equal(
  ORFORD_NESS_1704_CONFLICT_RENAMES["Slaget vid Orford Ness"],
  "Batalla naval de Orford Ness (1704)",
  "el alias sueco debe resolver la ficha naval de Orford Ness"
);
assert.deepEqual(
  ORFORD_NESS_1704_COUNTRY_CONFLICT_ADDITIONS,
  {
    "Reino Unido": ["Batalla naval de Orford Ness (1704)"]
  }
);
const orfordNessDetail = ORFORD_NESS_1704_CONFLICT_DETAIL_FIXES["Batalla naval de Orford Ness (1704)"];
assert.ok(
  orfordNessDetail
    && orfordNessDetail.startYear === 1704
    && orfordNessDetail.startYear === orfordNessDetail.endYear
    && orfordNessDetail.parent === "Incidente naval anglo-sueco de Orford Ness (1704)"
    && orfordNessDetail.campaign === "Escolta sueca del convoy hacia Europa occidental (1704)"
    && orfordNessDetail.type === "batalla naval"
    && orfordNessDetail.conflictType === "interestatal"
    && orfordNessDetail.scale === "internacional"
    && orfordNessDetail.hierarchySources?.length >= 2
    && orfordNessDetail.participants?.length === 2
    && orfordNessDetail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /cuatro horas de combate/i.test(orfordNessDetail.outcome)
    && /no coloca el combate bajo la Gran Guerra del Norte/i.test(orfordNessDetail.sourceDispute),
  "la curaduria de Orford Ness debe conservar calendarios y neutralidad bilateral sin forzar una guerra mayor"
);
const orfordNessWikipediaOverride = await resolveWikipediaConflictTitle("Batalla naval de Orford Ness (1704)");
assert.equal(orfordNessWikipediaOverride.language, "en");
assert.equal(orfordNessWikipediaOverride.pageTitle, "Battle_of_Orford_Ness_(1704)");
assert.equal(Object.keys(NEWRY_ROAD_1993_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  NEWRY_ROAD_1993_CONFLICT_RENAMES["Battle of Newry Road"],
  "Batalla de Newry Road (1993)",
  "el alias en ingles debe resolver la ficha curada de Newry Road"
);
const newryRoadDetail = NEWRY_ROAD_1993_CONFLICT_DETAIL_FIXES["Batalla de Newry Road (1993)"];
assert.ok(
  newryRoadDetail
    && newryRoadDetail.startYear === 1993
    && newryRoadDetail.startYear === newryRoadDetail.endYear
    && newryRoadDetail.parent === "Conflicto de Irlanda del Norte"
    && newryRoadDetail.campaign === "Operacion Banner: operaciones aereas en South Armagh (1993)"
    && newryRoadDetail.type === "combate aereo-terrestre"
    && newryRoadDetail.conflictType === "insurgencia"
    && newryRoadDetail.scale === "local"
    && newryRoadDetail.hierarchySources?.length >= 4
    && newryRoadDetail.hierarchySources.some(source => /An Phoblacht/i.test(source.label))
    && newryRoadDetail.participants?.length === 2
    && newryRoadDetail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /Sin resultado tactico concluyente/i.test(newryRoadDetail.outcome)
    && /CAIN contextualiza/i.test(newryRoadDetail.sourceDispute)
    && newryRoadDetail.datePrecision === "23 de septiembre de 1993",
  "la curaduria de Newry Road debe reemplazar la jerarquia interestatal generica por una ficha fechada, localizada y prudente"
);
const newryRoadWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Newry Road (1993)");
assert.equal(newryRoadWikipediaOverride.language, "es");
assert.equal(newryRoadWikipediaOverride.pageTitle, "Batalla_de_Newry_Road");
assert.equal(Object.keys(CALLAO_1866_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  CALLAO_1866_CONFLICT_RENAMES["Combate naval del Callao"],
  "Combate del Callao (1866)",
  "los aliases del Callao deben consolidarse en una sola ficha fechada"
);
assert.deepEqual(
  CALLAO_1866_COUNTRY_CONFLICT_ADDITIONS,
  {
    "Espa\u00f1a": ["Combate del Callao (1866)"]
  }
);
const callaoDetail = CALLAO_1866_CONFLICT_DETAIL_FIXES["Combate del Callao (1866)"];
assert.ok(
  callaoDetail
    && callaoDetail.startYear === 1866
    && callaoDetail.startYear === callaoDetail.endYear
    && callaoDetail.parent === "Guerra hispano-sudamericana"
    && callaoDetail.campaign === "Operaciones navales de la Escuadra del Pacifico (1865-1866)"
    && callaoDetail.type === "combate naval y costero"
    && callaoDetail.conflictType === "interestatal"
    && callaoDetail.scale === "internacional"
    && callaoDetail.hierarchyConfidence === "alta"
    && callaoDetail.hierarchySources?.length >= 3
    && callaoDetail.participants?.length === 2
    && callaoDetail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /Resultado tactico y politico discutido/i.test(callaoDetail.outcome)
    && /nombres del mismo hecho/i.test(callaoDetail.sourceDispute)
    && callaoDetail.datePrecision === "2 de mayo de 1866",
  "la curaduria del Callao debe fusionar aliases y conservar una jerarquia, fuentes y resultado historicamente prudente"
);
const callaoWikipediaOverride = await resolveWikipediaConflictTitle("Combate del Callao (1866)");
assert.equal(callaoWikipediaOverride.language, "es");
assert.equal(callaoWikipediaOverride.pageTitle, "Combate_del_Callao");
assert.equal(Object.keys(LAKE_PEI_PUS_1242_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  LAKE_PEI_PUS_1242_CONFLICT_RENAMES["Battle on the Ice"],
  "Batalla del lago Peipus (1242)",
  "el alias en ingles debe resolver la ficha curada del lago Peipus"
);
assert.deepEqual(
  LAKE_PEI_PUS_1242_COUNTRY_CONFLICT_ADDITIONS,
  {
    Rusia: ["Batalla del lago Peipus (1242)"],
    Estonia: ["Batalla del lago Peipus (1242)"]
  }
);
assert.deepEqual(
  LAKE_PEI_PUS_1242_COUNTRY_CONFLICT_EXCLUSIONS,
  {
    Dinamarca: ["Batalla del lago Peipus (1242)"]
  }
);
const lakePeipusDetail = LAKE_PEI_PUS_1242_CONFLICT_DETAIL_FIXES["Batalla del lago Peipus (1242)"];
assert.ok(
  lakePeipusDetail
    && lakePeipusDetail.startYear === 1242
    && lakePeipusDetail.startYear === lakePeipusDetail.endYear
    && lakePeipusDetail.parent === "Guerra fronteriza entre Novgorod y la Orden Livona (1240-1242)"
    && lakePeipusDetail.war === "Guerra fronteriza entre Novgorod y la Orden Livona (1240-1242)"
    && lakePeipusDetail.campaign === "Contraofensiva de Pskov y el lago Peipus (1242)"
    && lakePeipusDetail.conflictType === "frontera"
    && lakePeipusDetail.scale === "regional"
    && lakePeipusDetail.hierarchyConfidence === "alta"
    && lakePeipusDetail.hierarchySources?.length >= 3
    && lakePeipusDetail.participants?.length === 2
    && lakePeipusDetail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /no fija un total de bajas/i.test(lakePeipusDetail.outcome)
    && /hundimiento masivo bajo el hielo/i.test(lakePeipusDetail.sourceDispute)
    && /Rusia y Estonia se usan solo como referencias/i.test(lakePeipusDetail.sourceDispute)
    && lakePeipusDetail.datePrecision === "5 de abril de 1242, fecha indicada por la Cronica de Novgorod",
  "la curaduria del lago Peipus debe reemplazar la ficha danesa generica por una jerarquia fechada y prudente"
);
const lakePeipusWikipediaOverride = await resolveWikipediaConflictTitle("Batalla del lago Peipus (1242)");
assert.equal(lakePeipusWikipediaOverride.language, "es");
assert.equal(lakePeipusWikipediaOverride.pageTitle, "Batalla_del_Lago_Peipus");
assert.equal(Object.keys(VIZAGAPATAM_1804_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  VIZAGAPATAM_1804_CONFLICT_RENAMES["Battle of Visakhapatnam"],
  "Batalla naval de Vizagapatam (1804)",
  "el alias ingles debe resolver la ficha curada de Vizagapatam"
);
assert.deepEqual(
  VIZAGAPATAM_1804_COUNTRY_CONFLICT_ADDITIONS,
  {
    "Reino Unido": ["Batalla naval de Vizagapatam (1804)"],
    India: ["Batalla naval de Vizagapatam (1804)"]
  }
);
const vizagapatamDetail = VIZAGAPATAM_1804_CONFLICT_DETAIL_FIXES["Batalla naval de Vizagapatam (1804)"];
assert.ok(
  vizagapatamDetail
    && vizagapatamDetail.startYear === 1804
    && vizagapatamDetail.startYear === vizagapatamDetail.endYear
    && vizagapatamDetail.parent === "Guerras napole\u00f3nicas (1803-1815)"
    && vizagapatamDetail.war === "Guerras napole\u00f3nicas (1803-1815)"
    && vizagapatamDetail.campaign === "Operaciones de la escuadra de Linois en el oceano Indico (1804)"
    && vizagapatamDetail.type === "combate naval"
    && vizagapatamDetail.conflictType === "interestatal"
    && vizagapatamDetail.scale === "internacional"
    && vizagapatamDetail.hierarchyConfidence === "alta"
    && vizagapatamDetail.hierarchySources?.length === 2
    && vizagapatamDetail.participants?.length === 2
    && vizagapatamDetail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /captura francesa de Princess Charlotte/i.test(vizagapatamDetail.outcome)
    && /fecha del 18,? grabada/i.test(vizagapatamDetail.sourceDispute)
    && /India se usa como referencia geografica actual/i.test(vizagapatamDetail.sourceDispute)
    && /15 de septiembre de 1804/.test(vizagapatamDetail.datePrecision),
  "la curaduria de Vizagapatam debe reemplazar la ficha francesa generica por un combate naval fechado y trazable"
);
const vizagapatamWikipediaOverride = await resolveWikipediaConflictTitle("Batalla naval de Vizagapatam (1804)");
assert.equal(vizagapatamWikipediaOverride.language, "en");
assert.equal(vizagapatamWikipediaOverride.pageTitle, "Battle_of_Visakhapatnam");
assert.equal(Object.keys(YERBA_BUENA_1846_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  YERBA_BUENA_1846_CONFLICT_RENAMES["Batalla de Yerba Buena"],
  "Captura de Yerba Buena (1846)",
  "el nombre historico de batalla debe resolver la captura curada de Yerba Buena"
);
assert.deepEqual(
  YERBA_BUENA_1846_COUNTRY_CONFLICT_ADDITIONS,
  {
    "M\u00e9xico": ["Captura de Yerba Buena (1846)"]
  }
);
const yerbaBuenaDetail = YERBA_BUENA_1846_CONFLICT_DETAIL_FIXES["Captura de Yerba Buena (1846)"];
assert.ok(
  yerbaBuenaDetail
    && yerbaBuenaDetail.startYear === 1846
    && yerbaBuenaDetail.startYear === yerbaBuenaDetail.endYear
    && yerbaBuenaDetail.parent === "Guerra mexicano-estadounidense"
    && yerbaBuenaDetail.war === "Guerra mexicano-estadounidense"
    && yerbaBuenaDetail.campaign === "Campa\u00f1a de California de 1846-1847"
    && yerbaBuenaDetail.type === "ocupacion sin combate"
    && yerbaBuenaDetail.conflictType === "interestatal"
    && yerbaBuenaDetail.scale === "regional"
    && yerbaBuenaDetail.hierarchyConfidence === "alta"
    && yerbaBuenaDetail.hierarchySources?.length === 5
    && yerbaBuenaDetail.participants?.length === 2
    && yerbaBuenaDetail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /ocupacion sin combate/i.test(yerbaBuenaDetail.outcome)
    && /discrepancia principal es de nomenclatura/i.test(yerbaBuenaDetail.sourceDispute)
    && /Mexico se incorpora como soberania/i.test(yerbaBuenaDetail.sourceDispute)
    && yerbaBuenaDetail.datePrecision === "9 de julio de 1846",
  "la curaduria de Yerba Buena debe sustituir una batalla generica por una captura fechada y trazable"
);
const yerbaBuenaWikipediaOverride = await resolveWikipediaConflictTitle("Captura de Yerba Buena (1846)");
assert.equal(yerbaBuenaWikipediaOverride.language, "es");
assert.equal(yerbaBuenaWikipediaOverride.pageTitle, "Batalla_de_Yerba_Buena");
assert.equal(Object.keys(CAPE_LIZARD_1707_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  CAPE_LIZARD_1707_CONFLICT_RENAMES["Batalla del cabo Lizard"],
  "Batalla naval del cabo Lizard (1707)",
  "el nombre historico del cabo Lizard debe resolver la ficha naval curada"
);
assert.deepEqual(
  CAPE_LIZARD_1707_COUNTRY_CONFLICT_ADDITIONS,
  {
    "Reino Unido": ["Batalla naval del cabo Lizard (1707)"]
  }
);
const capeLizardDetail = CAPE_LIZARD_1707_CONFLICT_DETAIL_FIXES["Batalla naval del cabo Lizard (1707)"];
assert.ok(
  capeLizardDetail
    && capeLizardDetail.startYear === 1707
    && capeLizardDetail.startYear === capeLizardDetail.endYear
    && capeLizardDetail.parent === "Guerra de Sucesi\u00f3n Espa\u00f1ola"
    && capeLizardDetail.war === "Guerra de Sucesi\u00f3n Espa\u00f1ola"
    && capeLizardDetail.campaign === "Operaciones francesas contra convoyes ingleses en el canal de la Mancha (1707)"
    && capeLizardDetail.type === "batalla naval"
    && capeLizardDetail.conflictType === "interestatal"
    && capeLizardDetail.scale === "internacional"
    && capeLizardDetail.hierarchyConfidence === "alta"
    && capeLizardDetail.hierarchySources?.length === 2
    && capeLizardDetail.participants?.length === 2
    && capeLizardDetail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /21 de octubre de 1707/i.test(capeLizardDetail.datePrecision)
    && /21 de septiembre/i.test(capeLizardDetail.sourceDispute)
    && /no fija un total/i.test(capeLizardDetail.outcome),
  "la curaduria del cabo Lizard debe sustituir un conflicto europeo generico por un combate naval fechado y trazable"
);
const capeLizardSpanishWikipediaOverride = await resolveWikipediaConflictTitle("Batalla naval del cabo Lizard (1707)");
assert.equal(capeLizardSpanishWikipediaOverride.language, "es");
assert.equal(capeLizardSpanishWikipediaOverride.pageTitle, "Batalla_del_cabo_Lizard");
const capeLizardEnglishWikipediaOverride = await resolveWikipediaConflictTitle("Battle at The Lizard");
assert.equal(capeLizardEnglishWikipediaOverride.language, "en");
assert.equal(capeLizardEnglishWikipediaOverride.pageTitle, "Battle_at_the_Lizard");
assert.equal(Object.keys(PONDICHERRY_1759_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  PONDICHERRY_1759_CONFLICT_RENAMES["Batalla de Pondicherry"],
  "Batalla naval de Pondicherry (1759)",
  "el nombre generico de Pondicherry debe resolver la ficha naval curada"
);
assert.deepEqual(
  PONDICHERRY_1759_COUNTRY_CONFLICT_ADDITIONS,
  {
    "Reino Unido": ["Batalla naval de Pondicherry (1759)"],
    India: ["Batalla naval de Pondicherry (1759)"]
  }
);
const pondicherryDetail = PONDICHERRY_1759_CONFLICT_DETAIL_FIXES["Batalla naval de Pondicherry (1759)"];
assert.ok(
  pondicherryDetail
    && pondicherryDetail.startYear === 1759
    && pondicherryDetail.startYear === pondicherryDetail.endYear
    && pondicherryDetail.parent === "Guerra de los Siete A\u00f1os (1756-1763)"
    && pondicherryDetail.war === "Guerra de los Siete A\u00f1os (1756-1763)"
    && pondicherryDetail.campaign === "Operaciones navales franco-brit\u00e1nicas en la costa de Coromandel (1759)"
    && pondicherryDetail.type === "batalla naval"
    && pondicherryDetail.conflictType === "colonial"
    && pondicherryDetail.scale === "internacional"
    && pondicherryDetail.hierarchyConfidence === "alta"
    && pondicherryDetail.hierarchySources?.length === 3
    && pondicherryDetail.participants?.length === 2
    && pondicherryDetail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /10 de septiembre de 1759/i.test(pondicherryDetail.datePrecision)
    && /Tranquebar/i.test(pondicherryDetail.sourceDispute)
    && /no decisivo/i.test(pondicherryDetail.outcome),
  "la curaduria de Pondicherry debe sustituir un conflicto europeo generico por una accion naval colonial fechada y trazable"
);
const pondicherryWikipediaOverride = await resolveWikipediaConflictTitle("Batalla naval de Pondicherry (1759)");
assert.equal(pondicherryWikipediaOverride.language, "en");
assert.equal(pondicherryWikipediaOverride.pageTitle, "Battle_of_Pondicherry");
assert.equal(Object.keys(MATAMOROS_1836_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  MATAMOROS_1836_CONFLICT_RENAMES["Batalla de Matamoros"],
  "Acci\u00f3n naval de Matamoros (3 de abril de 1836)",
  "el nombre generico de Matamoros debe resolver la accion naval curada"
);
assert.deepEqual(
  MATAMOROS_1836_COUNTRY_CONFLICT_ADDITIONS,
  {
    "Estados Unidos": ["Acci\u00f3n naval de Matamoros (3 de abril de 1836)"]
  }
);
const matamorosDetail = MATAMOROS_1836_CONFLICT_DETAIL_FIXES["Acci\u00f3n naval de Matamoros (3 de abril de 1836)"];
assert.ok(
  matamorosDetail
    && matamorosDetail.startYear === 1836
    && matamorosDetail.startYear === matamorosDetail.endYear
    && matamorosDetail.parent === "Revoluci\u00f3n de Texas (1835-1836)"
    && matamorosDetail.war === "Revoluci\u00f3n de Texas (1835-1836)"
    && matamorosDetail.campaign === "Operaciones navales texanas en el golfo de M\u00e9xico (1836)"
    && matamorosDetail.type === "acci\u00f3n naval"
    && matamorosDetail.conflictType === "independencia"
    && matamorosDetail.scale === "regional"
    && matamorosDetail.hierarchyConfidence === "alta"
    && matamorosDetail.hierarchySources?.length === 2
    && matamorosDetail.participants?.length === 2
    && matamorosDetail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /3 de abril de 1836/i.test(matamorosDetail.datePrecision)
    && /Pocket/i.test(matamorosDetail.sourceDispute)
    && /varo/i.test(matamorosDetail.outcome),
  "la curaduria de Matamoros debe separar el combate naval de la captura posterior del Pocket y conservar su jerarquia verificable"
);
const matamorosWikipediaOverride = await resolveWikipediaConflictTitle("Acci\u00f3n naval de Matamoros (3 de abril de 1836)");
assert.equal(matamorosWikipediaOverride.language, "en");
assert.equal(matamorosWikipediaOverride.pageTitle, "Action_of_April_3,_1836");
assert.equal(Object.keys(HUITE_1866_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  HUITE_1866_CONFLICT_RENAMES["Combate de Huite"],
  "Combate de Huite (2 de marzo de 1866)",
  "el nombre de Huite debe resolver el combate costero curado"
);
assert.deepEqual(
  HUITE_1866_COUNTRY_CONFLICT_ADDITIONS,
  {
    "Espa\u00f1a": ["Combate de Huite (2 de marzo de 1866)"]
  }
);
const huiteDetail = HUITE_1866_CONFLICT_DETAIL_FIXES["Combate de Huite (2 de marzo de 1866)"];
assert.ok(
  huiteDetail
    && huiteDetail.startYear === 1866
    && huiteDetail.startYear === huiteDetail.endYear
    && huiteDetail.parent === "Guerra hispano-sudamericana"
    && huiteDetail.war === "Guerra hispano-sudamericana"
    && huiteDetail.campaign === "Segunda expedici\u00f3n a Chilo\u00e9 (1866)"
    && huiteDetail.type === "combate naval y costero"
    && huiteDetail.conflictType === "interestatal"
    && huiteDetail.scale === "internacional"
    && huiteDetail.hierarchyConfidence === "alta"
    && huiteDetail.hierarchySources?.length === 4
    && huiteDetail.participants?.length === 2
    && huiteDetail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /2 de marzo de 1866/i.test(huiteDetail.datePrecision)
    && /Huito/i.test(huiteDetail.sourceDispute)
    && /Tubildad/i.test(huiteDetail.sourceDispute)
    && /sin resultado estrategico decisivo/i.test(huiteDetail.outcome),
  "la curaduria de Huite debe distinguir los top\u00f3nimos, los bandos y las bajas incompatibles dentro de la Guerra hispano-sudamericana"
);
const huiteWikipediaOverride = await resolveWikipediaConflictTitle("Combate de Huite (2 de marzo de 1866)");
assert.equal(huiteWikipediaOverride.language, "es");
assert.equal(huiteWikipediaOverride.pageTitle, "Combate_de_Huite");
assert.equal(Object.keys(TAMAO_1521_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  TAMAO_1521_CONFLICT_RENAMES["Primera batalla de Tamao"],
  "Primera batalla de Tam\u00e3o (1521)",
  "el nombre generico de Tamao debe resolver la ficha naval curada"
);
assert.deepEqual(
  TAMAO_1521_COUNTRY_CONFLICT_ADDITIONS,
  {
    "Rep\u00fablica Popular China": ["Primera batalla de Tam\u00e3o (1521)"]
  }
);
const tamaoDetail = TAMAO_1521_CONFLICT_DETAIL_FIXES["Primera batalla de Tam\u00e3o (1521)"];
assert.ok(
  tamaoDetail
    && tamaoDetail.startYear === 1521
    && tamaoDetail.startYear === tamaoDetail.endYear
    && tamaoDetail.parent === "Conflictos sino-portugueses (1521-1522)"
    && tamaoDetail.war === "Conflictos sino-portugueses (1521-1522)"
    && tamaoDetail.campaign === "Operaciones navales de Tam\u00e3o/Tunmen (1521)"
    && tamaoDetail.type === "batalla naval"
    && tamaoDetail.conflictType === "colonial"
    && tamaoDetail.scale === "internacional"
    && tamaoDetail.hierarchyConfidence === "alta"
    && tamaoDetail.hierarchySources?.length === 3
    && tamaoDetail.participants?.length === 2
    && tamaoDetail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /mayo-septiembre de 1521/i.test(tamaoDetail.datePrecision)
    && /1522/i.test(tamaoDetail.sourceDispute)
    && /cuatro de las cinco/i.test(tamaoDetail.outcome),
  "la curaduria de Tamao debe corregir la geografia, separar 1521 de 1522 y conservar la disputa sobre la salida portuguesa"
);
const tamaoWikipediaOverride = await resolveWikipediaConflictTitle("Primera batalla de Tam\u00e3o (1521)");
assert.equal(tamaoWikipediaOverride.language, "en");
assert.equal(tamaoWikipediaOverride.pageTitle, "Battle_of_Tunmen");
assert.equal(Object.keys(TATAMAGOUCHE_1745_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  TATAMAGOUCHE_1745_CONFLICT_RENAMES["Batalla naval de Tatamagouche"],
  "Acci\u00f3n naval de Tatamagouche (15 de junio de 1745)",
  "el nombre generico de Tatamagouche debe resolver la accion naval curada"
);
assert.deepEqual(
  TATAMAGOUCHE_1745_COUNTRY_CONFLICT_ADDITIONS,
  {
    "Canad\u00e1": ["Acci\u00f3n naval de Tatamagouche (15 de junio de 1745)"],
    "Estados Unidos": ["Acci\u00f3n naval de Tatamagouche (15 de junio de 1745)"]
  }
);
const tatamagoucheDetail = TATAMAGOUCHE_1745_CONFLICT_DETAIL_FIXES["Acci\u00f3n naval de Tatamagouche (15 de junio de 1745)"];
assert.ok(
  tatamagoucheDetail
    && tatamagoucheDetail.startYear === 1745
    && tatamagoucheDetail.startYear === tatamagoucheDetail.endYear
    && tatamagoucheDetail.parent === "Guerra del rey Jorge (1744-1748)"
    && tatamagoucheDetail.war === "Guerra del rey Jorge (1744-1748)"
    && tatamagoucheDetail.campaign === "Operaciones de socorro de Louisbourg desde Acadia (junio de 1745)"
    && tatamagoucheDetail.type === "accion naval y costera"
    && tatamagoucheDetail.conflictType === "colonial"
    && tatamagoucheDetail.scale === "regional"
    && tatamagoucheDetail.hierarchyConfidence === "alta"
    && tatamagoucheDetail.hierarchySources?.length === 3
    && tatamagoucheDetail.participants?.length === 2
    && tatamagoucheDetail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /15 de junio de 1745/i.test(tatamagoucheDetail.datePrecision)
    && /Fones/i.test(tatamagoucheDetail.sourceDispute)
    && /Mi'kmaq/i.test(tatamagoucheDetail.sourceDispute)
    && /Exito operativo anglo-americano/i.test(tatamagoucheDetail.outcome),
  "la curaduria de Tatamagouche debe corregir lugar, jerarquia, bandos y limites de bajas con fuentes verificables"
);
const tatamagoucheWikipediaOverride = await resolveWikipediaConflictTitle("Acci\u00f3n naval de Tatamagouche (15 de junio de 1745)");
assert.equal(tatamagoucheWikipediaOverride.language, "en");
assert.equal(tatamagoucheWikipediaOverride.pageTitle, "Naval_battle_off_Tatamagouche");
assert.equal(Object.keys(PORT_LOUIS_1799_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  PORT_LOUIS_1799_CONFLICT_RENAMES["Batalla de Port Louis"],
  "Batalla naval de Port Louis (11 de diciembre de 1799)",
  "la entrada ambigua de Port Louis debe resolver la accion naval de 1799"
);
assert.deepEqual(
  PORT_LOUIS_1799_COUNTRY_CONFLICT_ADDITIONS,
  {
    "Reino Unido": ["Batalla naval de Port Louis (11 de diciembre de 1799)"]
  }
);
const portLouisDetail = PORT_LOUIS_1799_CONFLICT_DETAIL_FIXES["Batalla naval de Port Louis (11 de diciembre de 1799)"];
assert.ok(
  portLouisDetail
    && portLouisDetail.startYear === 1799
    && portLouisDetail.startYear === portLouisDetail.endYear
    && portLouisDetail.parent === "Guerras revolucionarias francesas (1792-1802)"
    && portLouisDetail.war === "Guerras revolucionarias francesas (1792-1802)"
    && portLouisDetail.campaign === "Teatro de las Indias Orientales de las Guerras revolucionarias francesas (1793-1801)"
    && portLouisDetail.type === "accion naval"
    && portLouisDetail.conflictType === "interestatal"
    && portLouisDetail.scale === "internacional"
    && portLouisDetail.hierarchyConfidence === "alta"
    && portLouisDetail.hierarchySources?.length === 3
    && portLouisDetail.participants?.length === 2
    && portLouisDetail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /11 de diciembre de 1799/i.test(portLouisDetail.datePrecision)
    && /Saint-Louis-du-Sud de 1748/i.test(portLouisDetail.sourceDispute)
    && /Victoria tactica britanica/i.test(portLouisDetail.outcome),
  "la curaduria de Port Louis debe distinguir 1799 de 1748 y conservar fecha, jerarquia, bandos y cautela sobre bajas"
);
const portLouisWikipediaOverride = await resolveWikipediaConflictTitle("Batalla naval de Port Louis (11 de diciembre de 1799)");
assert.equal(portLouisWikipediaOverride.language, "en");
assert.equal(portLouisWikipediaOverride.pageTitle, "Battle_of_Port_Louis");
assert.equal(Object.keys(SAINT_MARTIN_RE_1622_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  SAINT_MARTIN_RE_1622_CONFLICT_RENAMES["Naval Batalla de Saint-Martin-de-Re"],
  "Batalla naval de Saint-Martin-de-R\u00e9 (26-27 de octubre de 1622)",
  "el nombre mixto de Saint-Martin-de-Re debe resolver la ficha naval curada"
);
const saintMartinReDetail = SAINT_MARTIN_RE_1622_CONFLICT_DETAIL_FIXES["Batalla naval de Saint-Martin-de-R\u00e9 (26-27 de octubre de 1622)"];
assert.ok(
  saintMartinReDetail
    && saintMartinReDetail.startYear === 1622
    && saintMartinReDetail.startYear === saintMartinReDetail.endYear
    && saintMartinReDetail.parent === "Primera rebeli\u00f3n hugonote (1621-1622)"
    && saintMartinReDetail.war === "Primera rebeli\u00f3n hugonote (1621-1622)"
    && saintMartinReDetail.campaign === "Operaciones navales de La Rochelle e isla de R\u00e9 (octubre de 1622)"
    && saintMartinReDetail.type === "batalla naval"
    && saintMartinReDetail.conflictType === "civil"
    && saintMartinReDetail.scale === "regional"
    && saintMartinReDetail.hierarchyConfidence === "alta"
    && saintMartinReDetail.hierarchySources?.length === 3
    && saintMartinReDetail.participants?.length === 2
    && saintMartinReDetail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /26-27 de octubre de 1622/i.test(saintMartinReDetail.datePrecision)
    && /inconcluso/i.test(saintMartinReDetail.sourceDispute)
    && /Ventaja tactica real/i.test(saintMartinReDetail.outcome),
  "la curaduria de Saint-Martin-de-Re debe corregir fecha, guerra, bandos y cautela sobre resultado y bajas"
);
const saintMartinReWikipediaOverride = await resolveWikipediaConflictTitle("Batalla naval de Saint-Martin-de-R\u00e9 (26-27 de octubre de 1622)");
assert.equal(saintMartinReWikipediaOverride.language, "en");
assert.equal(saintMartinReWikipediaOverride.pageTitle, "Naval_battle_of_Saint-Martin-de-R\u00e9");
assert.equal(Object.keys(SAINT_LOUIS_DU_SUD_1748_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  SAINT_LOUIS_DU_SUD_1748_CONFLICT_RENAMES["Batalla de Saint-Louis-du-Sud"],
  "Acci\u00f3n naval de Saint-Louis-du-Sud (marzo de 1748)",
  "la entrada de Saint-Louis-du-Sud debe mantener una fecha cauta y separada de Port Louis de 1799"
);
assert.deepEqual(
  SAINT_LOUIS_DU_SUD_1748_COUNTRY_CONFLICT_ADDITIONS,
  {
    "Hait\u00ed": ["Acci\u00f3n naval de Saint-Louis-du-Sud (marzo de 1748)"],
    "Reino Unido": ["Acci\u00f3n naval de Saint-Louis-du-Sud (marzo de 1748)"]
  }
);
const saintLouisDuSudDetail = SAINT_LOUIS_DU_SUD_1748_CONFLICT_DETAIL_FIXES["Acci\u00f3n naval de Saint-Louis-du-Sud (marzo de 1748)"];
assert.ok(
  saintLouisDuSudDetail
    && saintLouisDuSudDetail.startYear === 1748
    && saintLouisDuSudDetail.startYear === saintLouisDuSudDetail.endYear
    && saintLouisDuSudDetail.parent === "Guerra de Sucesi\u00f3n Austriaca (1740-1748)"
    && saintLouisDuSudDetail.war === "Guerra de Sucesi\u00f3n Austriaca (1740-1748)"
    && saintLouisDuSudDetail.campaign === "Campa\u00f1a de Charles Knowles en el Caribe (marzo-abril de 1748)"
    && saintLouisDuSudDetail.type === "accion naval y costera"
    && saintLouisDuSudDetail.conflictType === "colonial"
    && saintLouisDuSudDetail.scale === "internacional"
    && saintLouisDuSudDetail.hierarchyConfidence === "alta"
    && saintLouisDuSudDetail.hierarchySources?.length === 3
    && saintLouisDuSudDetail.participants?.length === 2
    && saintLouisDuSudDetail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /marzo de 1748/i.test(saintLouisDuSudDetail.datePrecision)
    && /19.*22/i.test(saintLouisDuSudDetail.sourceDispute)
    && /Port Louis de 1799/i.test(saintLouisDuSudDetail.sourceDispute)
    && /Exito tactico britanico/i.test(saintLouisDuSudDetail.outcome),
  "la curaduria de Saint-Louis-du-Sud debe corregir jerarquia, fecha cauta, bandos y desambiguacion frente a Port Louis de 1799"
);
const saintLouisDuSudWikipediaOverride = await resolveWikipediaConflictTitle("Acci\u00f3n naval de Saint-Louis-du-Sud (marzo de 1748)");
assert.equal(saintLouisDuSudWikipediaOverride.language, "en");
assert.equal(saintLouisDuSudWikipediaOverride.pageTitle, "Battle_of_Saint-Louis-du-Sud");
assert.equal(Object.keys(PIERRES_NOIRES_1944_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  PIERRES_NOIRES_1944_CONFLICT_RENAMES["Battle of Pierres Noires"],
  "Batalla naval de Pierres Noires (5-6 de julio de 1944)",
  "la entrada inglesa de Pierres Noires debe conservar fecha, idioma y distincion de Dredger"
);
assert.deepEqual(
  PIERRES_NOIRES_1944_COUNTRY_CONFLICT_ADDITIONS,
  {
    Alemania: ["Batalla naval de Pierres Noires (5-6 de julio de 1944)"],
    Francia: ["Batalla naval de Pierres Noires (5-6 de julio de 1944)"]
  }
);
const pierresNoiresDetail = PIERRES_NOIRES_1944_CONFLICT_DETAIL_FIXES["Batalla naval de Pierres Noires (5-6 de julio de 1944)"];
assert.ok(
  pierresNoiresDetail
    && pierresNoiresDetail.startYear === 1944
    && pierresNoiresDetail.startYear === pierresNoiresDetail.endYear
    && pierresNoiresDetail.parent === "Segunda Guerra Mundial"
    && pierresNoiresDetail.war === "Segunda Guerra Mundial"
    && pierresNoiresDetail.campaign === "Operacion Dredger en los accesos de Brest (5-6 de julio de 1944)"
    && pierresNoiresDetail.type === "batalla naval"
    && pierresNoiresDetail.conflictType === "interestatal"
    && pierresNoiresDetail.scale === "mundial"
    && pierresNoiresDetail.hierarchyConfidence === "alta"
    && pierresNoiresDetail.hierarchySources?.length === 3
    && pierresNoiresDetail.participants?.length === 2
    && pierresNoiresDetail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /5 al 6 de julio de 1944/i.test(pierresNoiresDetail.datePrecision)
    && /exito tactico limitado/i.test(pierresNoiresDetail.sourceDispute)
    && /submarinos escaparon/i.test(pierresNoiresDetail.sourceDispute)
    && /Exito tactico canadiense limitado/i.test(pierresNoiresDetail.outcome)
    && /Grupo de Escolta 12/i.test(pierresNoiresDetail.participants?.[0]?.side || ""),
  "la curaduria de Pierres Noires debe corregir fecha, jerarquia, paises y resultado limitado de Operation Dredger"
);
const pierresNoiresWikipediaOverride = await resolveWikipediaConflictTitle("Batalla naval de Pierres Noires (5-6 de julio de 1944)");
assert.equal(pierresNoiresWikipediaOverride.language, "en");
assert.equal(pierresNoiresWikipediaOverride.pageTitle, "Battle_of_Pierres_Noires");
assert.equal(Object.keys(NEVA_MOUTH_1703_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  NEVA_MOUTH_1703_CONFLICT_RENAMES["Battle at the Mouth of the Neva"],
  "Combate naval en la desembocadura del Neva (7/18 de mayo de 1703)",
  "la entrada inglesa del combate del Neva de 1703 debe separar fecha, idioma y periodo del combate medieval"
);
assert.deepEqual(
  NEVA_MOUTH_1703_COUNTRY_CONFLICT_ADDITIONS,
  {
    Rusia: ["Combate naval en la desembocadura del Neva (7/18 de mayo de 1703)"]
  }
);
const nevaMouth1703Detail = NEVA_MOUTH_1703_CONFLICT_DETAIL_FIXES["Combate naval en la desembocadura del Neva (7/18 de mayo de 1703)"];
assert.ok(
  nevaMouth1703Detail
    && nevaMouth1703Detail.startYear === 1703
    && nevaMouth1703Detail.startYear === nevaMouth1703Detail.endYear
    && nevaMouth1703Detail.parent === "Gran Guerra del Norte"
    && nevaMouth1703Detail.war === "Gran Guerra del Norte"
    && nevaMouth1703Detail.campaign === "Operaciones rusas en la desembocadura del Neva (mayo de 1703)"
    && nevaMouth1703Detail.type === "combate naval de abordaje"
    && nevaMouth1703Detail.conflictType === "interestatal"
    && nevaMouth1703Detail.scale === "regional"
    && nevaMouth1703Detail.hierarchyConfidence === "alta"
    && nevaMouth1703Detail.hierarchySources?.length === 3
    && nevaMouth1703Detail.participants?.length === 2
    && nevaMouth1703Detail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /7\/18 de mayo de 1703/i.test(nevaMouth1703Detail.datePrecision)
    && /calendario juliano/i.test(nevaMouth1703Detail.sourceDispute)
    && /Victoria t\u00e1ctica rusa/i.test(nevaMouth1703Detail.outcome)
    && /Batalla del Neva de 1240/i.test(nevaMouth1703Detail.curationNote),
  "la curaduria del combate del Neva de 1703 debe corregir fecha, guerra, bandos, lugar y distincion frente a 1240"
);
assert.equal(Object.keys(REMADA_1958_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  REMADA_1958_CONFLICT_RENAMES["batalla de Remada"],
  "Batalla de Remada (mayo de 1958)",
  "la entrada en minusculas de Remada debe llegar a la ficha curada"
);
assert.deepEqual(
  REMADA_1958_COUNTRY_CONFLICT_ADDITIONS,
  {
    Francia: ["Batalla de Remada (mayo de 1958)"]
  }
);
const remada1958Detail = REMADA_1958_CONFLICT_DETAIL_FIXES["Batalla de Remada (mayo de 1958)"];
assert.ok(
  remada1958Detail
    && remada1958Detail.startYear === 1958
    && remada1958Detail.startYear === remada1958Detail.endYear
    && remada1958Detail.parent === "Crisis franco-tunecina de mayo de 1958"
    && remada1958Detail.war === "Crisis franco-tunecina de mayo de 1958"
    && remada1958Detail.campaign === "Enfrentamientos de Remada, Bir Amir y Oued Dekouk (mayo de 1958)"
    && remada1958Detail.type === "combates terrestres y de guarnici\u00f3n"
    && remada1958Detail.conflictType === "interestatal"
    && remada1958Detail.scale === "regional"
    && remada1958Detail.hierarchyConfidence === "alta"
    && remada1958Detail.hierarchySources?.length === 4
    && remada1958Detail.participants?.length === 2
    && remada1958Detail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /18-29 de mayo de 1958/i.test(remada1958Detail.datePrecision)
    && /denuncias diplom\u00e1ticas opuestas/i.test(remada1958Detail.sourceDispute)
    && /Resultado t\u00e1ctico disputado/i.test(remada1958Detail.outcome)
    && /No se anexa Argelia como beligerante/i.test(remada1958Detail.curationNote),
  "la curaduria de Remada debe corregir fecha, crisis, bandos, resultado y prudencia sobre Argelia y bajas"
);
const remadaWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Remada (mayo de 1958)");
assert.equal(remadaWikipediaOverride.language, "en");
assert.equal(remadaWikipediaOverride.pageTitle, "Battle_of_Remada");
assert.equal(Object.keys(TREIDEN_1628_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  TREIDEN_1628_CONFLICT_RENAMES["Battle of Treiden"],
  "Batalla de Treiden (1628)",
  "la entrada inglesa de Treiden debe llegar a la ficha curada"
);
assert.deepEqual(
  TREIDEN_1628_COUNTRY_CONFLICT_ADDITIONS,
  {
    Polonia: ["Batalla de Treiden (1628)"],
    Letonia: ["Batalla de Treiden (1628)"]
  }
);
const treiden1628Detail = TREIDEN_1628_CONFLICT_DETAIL_FIXES["Batalla de Treiden (1628)"];
assert.ok(
  treiden1628Detail
    && treiden1628Detail.startYear === 1628
    && treiden1628Detail.startYear === treiden1628Detail.endYear
    && treiden1628Detail.parent === "Guerra polaco-sueca de 1626-1629"
    && treiden1628Detail.war === "Guerra polaco-sueca de 1626-1629"
    && treiden1628Detail.campaign === "Operaciones de Livonia en el invierno de 1628"
    && treiden1628Detail.type === "batalla terrestre"
    && treiden1628Detail.conflictType === "interestatal"
    && treiden1628Detail.scale === "regional"
    && treiden1628Detail.hierarchyConfidence === "alta"
    && treiden1628Detail.hierarchySources?.length === 3
    && treiden1628Detail.participants?.length === 2
    && treiden1628Detail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /Finales de enero o inicios de febrero de 1628/i.test(treiden1628Detail.datePrecision)
    && /22 de enero\/2 de febrero/i.test(treiden1628Detail.sourceDispute)
    && /Victoria polaco-lituana local/i.test(treiden1628Detail.outcome)
    && /sin fecha, contraparte, jerarqu\u00eda ni fuentes/i.test(treiden1628Detail.curationNote),
  "la curaduria de Treiden debe corregir idioma, guerra, bandos, lugar y la incertidumbre de fecha y mando"
);
const treidenWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Treiden (1628)");
assert.equal(treidenWikipediaOverride.language, "en");
assert.equal(treidenWikipediaOverride.pageTitle, "Battle_of_Treiden_(1628)");
assert.equal(Object.keys(TELLICHERRY_1791_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  TELLICHERRY_1791_CONFLICT_RENAMES["Batalla de Tellicherry"],
  "Combate naval de Tellicherry (1791)",
  "la entrada de Tellicherry debe llegar a la ficha naval curada"
);
assert.deepEqual(
  TELLICHERRY_1791_COUNTRY_CONFLICT_ADDITIONS,
  {
    "Reino Unido": ["Combate naval de Tellicherry (1791)"],
    India: ["Combate naval de Tellicherry (1791)"]
  }
);
const tellicherry1791Detail = TELLICHERRY_1791_CONFLICT_DETAIL_FIXES["Combate naval de Tellicherry (1791)"];
assert.ok(
  tellicherry1791Detail
    && tellicherry1791Detail.startYear === 1791
    && tellicherry1791Detail.startYear === tellicherry1791Detail.endYear
    && tellicherry1791Detail.parent === "Tercera guerra anglo-mysore (1790-1792)"
    && tellicherry1791Detail.war === "Tercera guerra anglo-mysore (1790-1792)"
    && tellicherry1791Detail.campaign === "Operaciones navales de interdiccion frente a Malabar (1791)"
    && tellicherry1791Detail.type === "combate naval"
    && tellicherry1791Detail.conflictType === "interestatal"
    && tellicherry1791Detail.scale === "regional"
    && tellicherry1791Detail.hierarchyConfidence === "alta"
    && tellicherry1791Detail.hierarchySources?.length === 3
    && tellicherry1791Detail.participants?.length === 2
    && tellicherry1791Detail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /^Noviembre de 1791/i.test(tellicherry1791Detail.datePrecision)
    && /no permiten fijar un dia unico/i.test(tellicherry1791Detail.datePrecision)
    && /no hallo contrabando/i.test(tellicherry1791Detail.sourceDispute)
    && /no como combatiente directo/i.test(tellicherry1791Detail.curationNote),
  "la curaduria de Tellicherry debe corregir lugar, guerra, bandos y la incertidumbre de fecha, bajas y contrabando"
);
const tellicherryWikipediaOverride = await resolveWikipediaConflictTitle("Combate naval de Tellicherry (1791)");
assert.equal(tellicherryWikipediaOverride.language, "en");
assert.equal(tellicherryWikipediaOverride.pageTitle, "Battle_of_Tellicherry");
assert.equal(Object.keys(WESTTIEF_1712_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  WESTTIEF_1712_CONFLICT_RENAMES["Battle of Westtief"],
  "Combates navales de Westtief y el Greifswalder Bodden (julio-agosto de 1712)",
  "la variante inglesa de Westtief debe llegar a la ficha naval curada"
);
assert.equal(
  WESTTIEF_1712_CONFLICT_RENAMES["Batallas navales en Greifswalder Bodden"],
  "Combates navales de Westtief y el Greifswalder Bodden (julio-agosto de 1712)",
  "la variante duplicada del Bodden debe consolidarse con Westtief"
);
assert.deepEqual(
  WESTTIEF_1712_COUNTRY_CONFLICT_ADDITIONS,
  {
    Dinamarca: ["Combates navales de Westtief y el Greifswalder Bodden (julio-agosto de 1712)"],
    Suecia: ["Combates navales de Westtief y el Greifswalder Bodden (julio-agosto de 1712)"],
    Alemania: ["Combates navales de Westtief y el Greifswalder Bodden (julio-agosto de 1712)"]
  }
);
const westtief1712Detail = WESTTIEF_1712_CONFLICT_DETAIL_FIXES["Combates navales de Westtief y el Greifswalder Bodden (julio-agosto de 1712)"];
assert.ok(
  westtief1712Detail
    && westtief1712Detail.startYear === 1712
    && westtief1712Detail.startYear === westtief1712Detail.endYear
    && westtief1712Detail.parent === "Gran Guerra del Norte"
    && westtief1712Detail.war === "Gran Guerra del Norte"
    && westtief1712Detail.campaign === "Operaciones danesas contra Stralsund y R\u00fcgen (1712)"
    && westtief1712Detail.type === "combates navales"
    && westtief1712Detail.conflictType === "interestatal"
    && westtief1712Detail.scale === "regional"
    && westtief1712Detail.hierarchyConfidence === "alta"
    && westtief1712Detail.hierarchySources?.length === 3
    && westtief1712Detail.participants?.length === 2
    && westtief1712Detail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /fines de julio/i.test(westtief1712Detail.datePrecision)
    && /no se fusiona/i.test(westtief1712Detail.curationNote),
  "la curaduria de Westtief debe consolidar duplicados sin absorber la accion distinta frente a Rugen"
);
assert.equal(Object.keys(PROCIDA_CANAL_1809_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  PROCIDA_CANAL_1809_CONFLICT_RENAMES["Battle of the Procida Canal"],
  "Batalla naval del canal de Procida (26 de junio de 1809)",
  "la entrada inglesa de Procida debe llegar a la ficha naval curada"
);
assert.equal(
  PROCIDA_CANAL_1809_CONFLICT_RENAMES["Batalla de Procida Canal"],
  "Batalla naval del canal de Procida (26 de junio de 1809)",
  "la variante traducida sin fecha debe resolver el episodio de 1809"
);
assert.deepEqual(
  PROCIDA_CANAL_1809_COUNTRY_CONFLICT_ADDITIONS,
  {
    "Reino Unido": ["Batalla naval del canal de Procida (26 de junio de 1809)"],
    Italia: ["Batalla naval del canal de Procida (26 de junio de 1809)"]
  }
);
const procidaCanal1809Detail = PROCIDA_CANAL_1809_CONFLICT_DETAIL_FIXES["Batalla naval del canal de Procida (26 de junio de 1809)"];
assert.ok(
  procidaCanal1809Detail
    && procidaCanal1809Detail.startYear === 1809
    && procidaCanal1809Detail.startYear === procidaCanal1809Detail.endYear
    && procidaCanal1809Detail.parent === "Guerra de la Quinta Coalici\u00f3n (1809)"
    && procidaCanal1809Detail.war === "Guerra de la Quinta Coalici\u00f3n (1809)"
    && procidaCanal1809Detail.campaign === "Expedici\u00f3n anglo-siciliana a Ischia y Procida (junio-julio de 1809)"
    && procidaCanal1809Detail.type === "combate naval"
    && procidaCanal1809Detail.conflictType === "interestatal"
    && procidaCanal1809Detail.scale === "regional"
    && procidaCanal1809Detail.hierarchyConfidence === "alta"
    && procidaCanal1809Detail.hierarchySources?.length === 3
    && procidaCanal1809Detail.participants?.length === 2
    && procidaCanal1809Detail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /26 de junio de 1809/i.test(procidaCanal1809Detail.datePrecision)
    && /1799/i.test(procidaCanal1809Detail.sourceDispute)
    && /No se absorbe la batalla de 1799/i.test(procidaCanal1809Detail.curationNote),
  "la curaduria de Procida debe fijar el episodio de 1809 sin mezclar la accion distinta de 1799"
);
assert.equal(Object.keys(ANABTA_NUR_SHAMS_1936_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  ANABTA_NUR_SHAMS_1936_CONFLICT_RENAMES["Batalla de Nur Shams"],
  "Batalla de Anabta (Nur Shams, 21 de junio de 1936)",
  "la entrada de Nur Shams debe llegar a la ficha curada de Anabta"
);
assert.equal(
  ANABTA_NUR_SHAMS_1936_CONFLICT_RENAMES["Battle of Anabta"],
  "Batalla de Anabta (Nur Shams, 21 de junio de 1936)",
  "el alias ingles de Anabta debe resolver la ficha curada"
);
assert.deepEqual(
  ANABTA_NUR_SHAMS_1936_COUNTRY_CONFLICT_ADDITIONS,
  {
    Cisjordania: ["Batalla de Anabta (Nur Shams, 21 de junio de 1936)"]
  }
);
const anabtaNurShams1936Detail = ANABTA_NUR_SHAMS_1936_CONFLICT_DETAIL_FIXES["Batalla de Anabta (Nur Shams, 21 de junio de 1936)"];
assert.ok(
  anabtaNurShams1936Detail
    && anabtaNurShams1936Detail.startYear === 1936
    && anabtaNurShams1936Detail.startYear === anabtaNurShams1936Detail.endYear
    && anabtaNurShams1936Detail.parent === "Revuelta \u00e1rabe en Palestina (1936-1939)"
    && anabtaNurShams1936Detail.war === "Revuelta \u00e1rabe en Palestina (1936-1939)"
    && anabtaNurShams1936Detail.campaign === "Fase inicial de la Revuelta \u00e1rabe en Palestina (abril-junio de 1936)"
    && anabtaNurShams1936Detail.type === "emboscada y combate terrestre"
    && anabtaNurShams1936Detail.conflictType === "insurgencia"
    && anabtaNurShams1936Detail.scale === "local"
    && anabtaNurShams1936Detail.hierarchyConfidence === "alta"
    && anabtaNurShams1936Detail.hierarchySources?.length === 4
    && anabtaNurShams1936Detail.participants?.length === 2
    && anabtaNurShams1936Detail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /21 de junio de 1936/i.test(anabtaNurShams1936Detail.datePrecision)
    && /15 de abril/i.test(anabtaNurShams1936Detail.sourceDispute)
    && /no sustituye/i.test(anabtaNurShams1936Detail.curationNote),
  "la curaduria de Anabta/Nur Shams debe conservar los nombres, la fecha y las incertidumbres sin mezclar el episodio de abril"
);
assert.equal(Object.keys(PUTZIGER_WIEK_1870_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  PUTZIGER_WIEK_1870_CONFLICT_RENAMES["Battle of Putziger Wiek"],
  "Combate naval en Putziger Wiek (23 de agosto de 1870)",
  "la entrada inglesa de Putziger Wiek debe llegar a la ficha naval curada"
);
assert.equal(
  PUTZIGER_WIEK_1870_CONFLICT_RENAMES["Seegefecht in der Putziger Wiek"],
  "Combate naval en Putziger Wiek (23 de agosto de 1870)",
  "el alias aleman debe resolver el combate naval curado"
);
assert.deepEqual(
  PUTZIGER_WIEK_1870_COUNTRY_CONFLICT_ADDITIONS,
  {
    Alemania: ["Combate naval en Putziger Wiek (23 de agosto de 1870)"],
    Polonia: ["Combate naval en Putziger Wiek (23 de agosto de 1870)"]
  }
);
const putzigerWiek1870Detail = PUTZIGER_WIEK_1870_CONFLICT_DETAIL_FIXES["Combate naval en Putziger Wiek (23 de agosto de 1870)"];
assert.ok(
  putzigerWiek1870Detail
    && putzigerWiek1870Detail.startYear === 1870
    && putzigerWiek1870Detail.startYear === putzigerWiek1870Detail.endYear
    && putzigerWiek1870Detail.parent === "Guerra franco-prusiana (1870-1871)"
    && putzigerWiek1870Detail.war === "Guerra franco-prusiana (1870-1871)"
    && putzigerWiek1870Detail.campaign === "Operaciones navales del B\u00e1ltico de 1870"
    && putzigerWiek1870Detail.type === "combate naval"
    && putzigerWiek1870Detail.conflictType === "interestatal"
    && putzigerWiek1870Detail.scale === "regional"
    && putzigerWiek1870Detail.hierarchyConfidence === "alta"
    && putzigerWiek1870Detail.hierarchySources?.length === 3
    && putzigerWiek1870Detail.participants?.length === 2
    && putzigerWiek1870Detail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /23 de agosto de 1870/i.test(putzigerWiek1870Detail.datePrecision)
    && /dieciocho/i.test(putzigerWiek1870Detail.sourceDispute)
    && /no mezcla este episodio con el combate de Hiddensee/i.test(putzigerWiek1870Detail.curationNote),
  "la curaduria de Putziger Wiek debe fijar 1870 sin inventar bajas ni mezclar Hiddensee"
);
assert.equal(Object.keys(JACKSON_1863_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  JACKSON_1863_CONFLICT_RENAMES["Batalla de jackson"],
  "Batalla de Jackson (Misisipi, 14 de mayo de 1863)",
  "la entrada ambigua de Jackson debe llegar a la ficha curada de Misisipi"
);
assert.equal(
  JACKSON_1863_CONFLICT_RENAMES["Battle of Jackson, Mississippi"],
  "Batalla de Jackson (Misisipi, 14 de mayo de 1863)",
  "el alias ingles de Jackson debe llegar a la ficha curada"
);
assert.deepEqual(
  JACKSON_1863_COUNTRY_CONFLICT_ADDITIONS,
  {
    "Estados Unidos": ["Batalla de Jackson (Misisipi, 14 de mayo de 1863)"]
  }
);
const jackson1863Detail = JACKSON_1863_CONFLICT_DETAIL_FIXES["Batalla de Jackson (Misisipi, 14 de mayo de 1863)"];
assert.ok(
  jackson1863Detail
    && jackson1863Detail.startYear === 1863
    && jackson1863Detail.startYear === jackson1863Detail.endYear
    && jackson1863Detail.parent === "Guerra Civil estadounidense"
    && jackson1863Detail.war === "Guerra Civil estadounidense"
    && jackson1863Detail.campaign === "Campa\u00f1a de Vicksburg de 1863"
    && jackson1863Detail.type === "batalla terrestre"
    && jackson1863Detail.conflictType === "civil"
    && jackson1863Detail.scale === "regional"
    && jackson1863Detail.hierarchyConfidence === "alta"
    && jackson1863Detail.hierarchySources?.length >= 4
    && jackson1863Detail.participants?.length === 2
    && jackson1863Detail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /14 de mayo de 1863/i.test(jackson1863Detail.datePrecision)
    && /286 bajas federales y 850 confederadas/i.test(jackson1863Detail.sourceDispute)
    && /otras acciones denominadas Jackson/i.test(jackson1863Detail.curationNote),
  "la curaduria de Jackson debe fijar fecha, campana, fuentes y cautela ante las cifras divergentes"
);
assert.equal(Object.keys(SPRINGFIELD_1863_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  SPRINGFIELD_1863_CONFLICT_RENAMES["Batalla de Springfield"],
  "Segunda batalla de Springfield (Misuri, 8 de enero de 1863)",
  "la entrada generica de Springfield debe llegar a la segunda batalla de Misuri"
);
assert.equal(
  SPRINGFIELD_1863_CONFLICT_RENAMES["Second Battle of Springfield"],
  "Segunda batalla de Springfield (Misuri, 8 de enero de 1863)",
  "el alias ingles de Springfield debe llegar a la ficha curada"
);
assert.deepEqual(
  SPRINGFIELD_1863_COUNTRY_CONFLICT_ADDITIONS,
  {
    "Estados Unidos": ["Segunda batalla de Springfield (Misuri, 8 de enero de 1863)"]
  }
);
const springfield1863Detail = SPRINGFIELD_1863_CONFLICT_DETAIL_FIXES["Segunda batalla de Springfield (Misuri, 8 de enero de 1863)"];
assert.ok(
  springfield1863Detail
    && springfield1863Detail.startYear === 1863
    && springfield1863Detail.startYear === springfield1863Detail.endYear
    && springfield1863Detail.parent === "Guerra Civil estadounidense"
    && springfield1863Detail.war === "Guerra Civil estadounidense"
    && springfield1863Detail.campaign === "Incursi\u00f3n de Marmaduke en Misuri (1862-1863)"
    && springfield1863Detail.type === "batalla urbana"
    && springfield1863Detail.conflictType === "civil"
    && springfield1863Detail.scale === "regional"
    && springfield1863Detail.hierarchyConfidence === "alta"
    && springfield1863Detail.hierarchySources?.length >= 4
    && springfield1863Detail.participants?.length === 2
    && springfield1863Detail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /8 de enero de 1863/i.test(springfield1863Detail.datePrecision)
    && /Nueva Jersey de 1780/i.test(springfield1863Detail.sourceDispute)
    && /Wilson's Creek/i.test(springfield1863Detail.curationNote),
  "la curaduria de Springfield debe fijar la fecha, la incursion y la desambiguacion historica"
);
assert.equal(Object.keys(KUMBO_2024_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  KUMBO_2024_CONFLICT_RENAMES["batalla de Kumbo"],
  "Batalla de Kumbo (10 de abril de 2024)",
  "la entrada de Kumbo debe llegar a la ficha curada con fecha"
);
assert.equal(
  KUMBO_2024_CONFLICT_RENAMES["Battle of Kumbo"],
  "Batalla de Kumbo (10 de abril de 2024)",
  "el alias ingles de Kumbo debe llegar a la ficha curada"
);
assert.deepEqual(
  KUMBO_2024_COUNTRY_CONFLICT_ADDITIONS,
  {
    "Camer\u00fan": ["Batalla de Kumbo (10 de abril de 2024)"]
  }
);
const kumbo2024Detail = KUMBO_2024_CONFLICT_DETAIL_FIXES["Batalla de Kumbo (10 de abril de 2024)"];
assert.ok(
  kumbo2024Detail
    && kumbo2024Detail.startYear === 2024
    && kumbo2024Detail.startYear === kumbo2024Detail.endYear
    && kumbo2024Detail.parent === "Crisis angl\u00f3fona de Camer\u00fan"
    && kumbo2024Detail.war === "Crisis angl\u00f3fona de Camer\u00fan"
    && kumbo2024Detail.campaign === "Operaciones en Bui de 2024"
    && kumbo2024Detail.type === "ataque a base y combate urbano"
    && kumbo2024Detail.conflictType === "insurgencia"
    && kumbo2024Detail.scale === "local"
    && kumbo2024Detail.hierarchyConfidence === "media"
    && kumbo2024Detail.hierarchySources?.length === 4
    && kumbo2024Detail.participants?.length === 2
    && kumbo2024Detail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /10 de abril de 2024/i.test(kumbo2024Detail.datePrecision)
    && /versi\u00f3n de autoridades/i.test(kumbo2024Detail.sourceDispute)
    && /categor\u00eda organizativa de GeoRisk/i.test(kumbo2024Detail.curationNote),
  "la curaduria de Kumbo debe fijar su fecha y jerarquia sin cerrar como hechos las bajas o una victoria disputadas"
);
assert.equal(Object.keys(REIM_2023_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  REIM_2023_CONFLICT_RENAMES["batalla de Re'im"],
  "Batalla por la base de Re'im (7 de octubre de 2023)",
  "la entrada de Re'im debe llegar a la ficha de la base de la Division de Gaza"
);
assert.equal(
  REIM_2023_CONFLICT_RENAMES["Battle of Gaza Division HQ"],
  "Batalla por la base de Re'im (7 de octubre de 2023)",
  "el alias de la sede de la Division de Gaza debe mantener la ficha curada"
);
assert.deepEqual(
  REIM_2023_COUNTRY_CONFLICT_ADDITIONS,
  {
    Israel: ["Batalla por la base de Re'im (7 de octubre de 2023)"]
  }
);
const reim2023Detail = REIM_2023_CONFLICT_DETAIL_FIXES["Batalla por la base de Re'im (7 de octubre de 2023)"];
assert.ok(
  reim2023Detail
    && reim2023Detail.startYear === 2023
    && reim2023Detail.startYear === reim2023Detail.endYear
    && reim2023Detail.parent === "Guerra de Gaza"
    && reim2023Detail.war === "Guerra de Gaza"
    && reim2023Detail.campaign === "Ataques del 7 de octubre de 2023 en Israel"
    && reim2023Detail.type === "asalto a base militar"
    && reim2023Detail.conflictType === "insurgencia"
    && reim2023Detail.scale === "local"
    && reim2023Detail.hierarchyConfidence === "alta"
    && reim2023Detail.hierarchySources?.length === 4
    && reim2023Detail.participants?.length === 2
    && reim2023Detail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /7 de octubre de 2023/i.test(reim2023Detail.datePrecision)
    && /kibutz y el \u00e1rea cercana al festival Nova/i.test(reim2023Detail.sourceDispute)
    && /no sustituye ni fusiona/i.test(reim2023Detail.curationNote),
  "la curaduria de Re'im debe fijar la base, la fecha y la guerra sin absorber las victimas civiles de sitios cercanos"
);
assert.equal(Object.keys(RIO_GRANDE_CITY_1859_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  RIO_GRANDE_CITY_1859_CONFLICT_RENAMES["Batalla de Rio Grande City"],
  "Batalla de R\u00edo Grande City (27 de diciembre de 1859)",
  "la entrada de Rio Grande City debe llegar a la ficha curada de 1859"
);
assert.equal(
  RIO_GRANDE_CITY_1859_CONFLICT_RENAMES["Battle of Rio Grande City (1859)"],
  "Batalla de R\u00edo Grande City (27 de diciembre de 1859)",
  "el alias ingles debe mantener la ficha historica curada"
);
assert.deepEqual(
  RIO_GRANDE_CITY_1859_COUNTRY_CONFLICT_ADDITIONS,
  {
    "Estados Unidos": ["Batalla de R\u00edo Grande City (27 de diciembre de 1859)"]
  }
);
const rioGrandeCity1859Detail = RIO_GRANDE_CITY_1859_CONFLICT_DETAIL_FIXES["Batalla de R\u00edo Grande City (27 de diciembre de 1859)"];
assert.ok(
  rioGrandeCity1859Detail
    && rioGrandeCity1859Detail.startYear === 1859
    && rioGrandeCity1859Detail.startYear === rioGrandeCity1859Detail.endYear
    && rioGrandeCity1859Detail.parent === "Primera guerra de Cortina (1859-1860)"
    && rioGrandeCity1859Detail.war === "Primera guerra de Cortina (1859-1860)"
    && rioGrandeCity1859Detail.campaign === "Operaciones del bajo R\u00edo Grande de diciembre de 1859"
    && rioGrandeCity1859Detail.type === "batalla terrestre"
    && rioGrandeCity1859Detail.conflictType === "insurgencia"
    && rioGrandeCity1859Detail.scale === "local"
    && rioGrandeCity1859Detail.hierarchyConfidence === "alta"
    && rioGrandeCity1859Detail.hierarchySources?.length === 4
    && rioGrandeCity1859Detail.participants?.length === 2
    && rioGrandeCity1859Detail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /27 de diciembre de 1859/i.test(rioGrandeCity1859Detail.datePrecision)
    && /Guerra entre M\u00e9xico y Estados Unidos/i.test(rioGrandeCity1859Detail.sourceDispute)
    && /no mezcla La Bolsa/i.test(rioGrandeCity1859Detail.curationNote),
  "la curaduria de Rio Grande City debe fijar su fecha y jerarquia sin mezclar guerras fronterizas ni cerrar bajas contradictorias"
);
assert.equal(Object.keys(MALTA_CONVOY_1800_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  MALTA_CONVOY_1800_CONFLICT_RENAMES["Batalla del Convoy de Malta"],
  "Batalla del convoy de Malta (18 de febrero de 1800)",
  "la entrada del convoy de Malta debe llegar a la ficha naval curada de 1800"
);
assert.equal(
  MALTA_CONVOY_1800_CONFLICT_RENAMES["Battle of the Malta Convoy"],
  "Batalla del convoy de Malta (18 de febrero de 1800)",
  "el alias ingles debe conservar la ficha naval curada"
);
assert.deepEqual(
  MALTA_CONVOY_1800_COUNTRY_CONFLICT_ADDITIONS,
  {
    "Reino Unido": ["Batalla del convoy de Malta (18 de febrero de 1800)"],
    Malta: ["Batalla del convoy de Malta (18 de febrero de 1800)"]
  }
);
const maltaConvoy1800Detail = MALTA_CONVOY_1800_CONFLICT_DETAIL_FIXES["Batalla del convoy de Malta (18 de febrero de 1800)"];
assert.ok(
  maltaConvoy1800Detail
    && maltaConvoy1800Detail.startYear === 1800
    && maltaConvoy1800Detail.startYear === maltaConvoy1800Detail.endYear
    && maltaConvoy1800Detail.parent === "Guerra de la Segunda Coalici\u00f3n (1798-1802)"
    && maltaConvoy1800Detail.war === "Guerra de la Segunda Coalici\u00f3n (1798-1802)"
    && maltaConvoy1800Detail.campaign === "Operaciones navales del sitio de Malta (febrero de 1800)"
    && maltaConvoy1800Detail.type === "combate naval"
    && maltaConvoy1800Detail.conflictType === "interestatal"
    && maltaConvoy1800Detail.scale === "regional"
    && maltaConvoy1800Detail.hierarchyConfidence === "alta"
    && maltaConvoy1800Detail.hierarchySources?.length === 3
    && maltaConvoy1800Detail.participants?.length === 2
    && maltaConvoy1800Detail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /18 de febrero de 1800/i.test(maltaConvoy1800Detail.datePrecision)
    && /Operaci\u00f3n Pedestal/i.test(maltaConvoy1800Detail.sourceDispute)
    && /no mezcla esta acci\u00f3n de 1800/i.test(maltaConvoy1800Detail.curationNote),
  "la curaduria del convoy de Malta debe fijar la fecha y jerarquia sin fusionarlo con los convoyes de la Segunda Guerra Mundial"
);
assert.equal(Object.keys(WADDAMS_GROVE_1832_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  WADDAMS_GROVE_1832_CONFLICT_RENAMES["Batalla de Waddams Grove"],
  "Combate de Yellow Creek (Waddams Grove, 18 de junio de 1832)",
  "la entrada de Waddams Grove debe llegar a la ficha curada de Yellow Creek"
);
assert.equal(
  WADDAMS_GROVE_1832_CONFLICT_RENAMES["Captain Stephenson's Fight"],
  "Combate de Yellow Creek (Waddams Grove, 18 de junio de 1832)",
  "el alias historico de Stephenson debe conservar la ficha de Yellow Creek"
);
const waddamsGrove1832Detail = WADDAMS_GROVE_1832_CONFLICT_DETAIL_FIXES["Combate de Yellow Creek (Waddams Grove, 18 de junio de 1832)"];
assert.ok(
  waddamsGrove1832Detail
    && waddamsGrove1832Detail.startYear === 1832
    && waddamsGrove1832Detail.startYear === waddamsGrove1832Detail.endYear
    && waddamsGrove1832Detail.parent === "Guerra de Black Hawk"
    && waddamsGrove1832Detail.war === "Guerra de Black Hawk"
    && waddamsGrove1832Detail.campaign === "Operaciones de Yellow Creek y Apple River de junio de 1832"
    && waddamsGrove1832Detail.type === "combate terrestre"
    && waddamsGrove1832Detail.conflictType === "colonial"
    && waddamsGrove1832Detail.scale === "local"
    && waddamsGrove1832Detail.hierarchyConfidence === "alta"
    && waddamsGrove1832Detail.hierarchySources?.length === 4
    && waddamsGrove1832Detail.participants?.length === 2
    && waddamsGrove1832Detail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /18 de junio de 1832/i.test(waddamsGrove1832Detail.datePrecision)
    && /referencia geogr\u00e1fica retrospectiva/i.test(waddamsGrove1832Detail.sourceDispute)
    && /no mezcla este choque con la primera o segunda batalla de Kellogg's Grove/i.test(waddamsGrove1832Detail.curationNote),
  "la curaduria de Waddams Grove debe fijar fecha, jerarquia y alias sin confundir el nombre posterior del sitio con una denominacion contemporanea"
);
assert.equal(Object.keys(SIDELING_HILL_1756_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  SIDELING_HILL_1756_CONFLICT_RENAMES["Batalla de Sideling Hill"],
  "Batalla de Sideling Hill (abril de 1756)",
  "la entrada de Sideling Hill debe llegar a la ficha curada de 1756"
);
assert.equal(
  SIDELING_HILL_1756_CONFLICT_RENAMES["Battle of Sidling Hill"],
  "Batalla de Sideling Hill (abril de 1756)",
  "la variante historica Sidling debe conservar la ficha curada"
);
const sidelingHill1756Detail = SIDELING_HILL_1756_CONFLICT_DETAIL_FIXES["Batalla de Sideling Hill (abril de 1756)"];
assert.ok(
  sidelingHill1756Detail
    && sidelingHill1756Detail.startYear === 1756
    && sidelingHill1756Detail.startYear === sidelingHill1756Detail.endYear
    && sidelingHill1756Detail.parent === "Guerra franco-india (1754-1763)"
    && sidelingHill1756Detail.war === "Guerra franco-india (1754-1763)"
    && sidelingHill1756Detail.campaign === "Guerra de frontera de Pensilvania de 1756"
    && sidelingHill1756Detail.type === "combate terrestre"
    && sidelingHill1756Detail.conflictType === "colonial"
    && sidelingHill1756Detail.scale === "local"
    && sidelingHill1756Detail.hierarchyConfidence === "alta"
    && sidelingHill1756Detail.hierarchySources?.length === 4
    && sidelingHill1756Detail.participants?.length === 2
    && sidelingHill1756Detail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /Abril de 1756/i.test(sidelingHill1756Detail.datePrecision)
    && /no fija un d\u00eda definitivo/i.test(sidelingHill1756Detail.datePrecision)
    && /La fecha y el lugar fino, sin embargo, siguen discutidos/i.test(sidelingHill1756Detail.sourceDispute)
    && /no confunde este combate con el ataque al fuerte McCord/i.test(sidelingHill1756Detail.curationNote),
  "la curaduria de Sideling Hill debe fijar jerarquia y mes sin presentar como cerrados el lugar, la fecha diaria o las bajas"
);
assert.equal(Object.keys(ROMANOVKA_1919_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  ROMANOVKA_1919_CONFLICT_RENAMES["Batalla de Romanovka"],
  "Batalla de Romanovka (25 de junio de 1919)",
  "la entrada de Romanovka debe llegar a la ficha curada de 1919"
);
assert.equal(
  ROMANOVKA_1919_CONFLICT_RENAMES["Romanovka Battle"],
  "Batalla de Romanovka (25 de junio de 1919)",
  "el alias ingles de Romanovka debe conservar la ficha curada"
);
assert.deepEqual(
  ROMANOVKA_1919_COUNTRY_CONFLICT_ADDITIONS,
  {
    Rusia: ["Batalla de Romanovka (25 de junio de 1919)"]
  },
  "Romanovka debe poder explorarse desde la ubicacion rusa actual sin atribuir el bando a la Rusia contemporanea"
);
const romanovka1919Detail = ROMANOVKA_1919_CONFLICT_DETAIL_FIXES["Batalla de Romanovka (25 de junio de 1919)"];
assert.ok(
  romanovka1919Detail
    && romanovka1919Detail.startYear === 1919
    && romanovka1919Detail.startYear === romanovka1919Detail.endYear
    && romanovka1919Detail.parent === "Guerra civil rusa"
    && romanovka1919Detail.war === "Guerra civil rusa"
    && romanovka1919Detail.campaign === "Intervenci\u00f3n aliada en Siberia"
    && romanovka1919Detail.type === "combate terrestre"
    && romanovka1919Detail.conflictType === "intervencion"
    && romanovka1919Detail.scale === "regional"
    && romanovka1919Detail.hierarchyConfidence === "alta"
    && romanovka1919Detail.hierarchySources?.length === 4
    && romanovka1919Detail.participants?.length === 2
    && romanovka1919Detail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /25 de junio de 1919/i.test(romanovka1919Detail.datePrecision)
    && /no son id\u00e9nticas/i.test(romanovka1919Detail.sourceDispute)
    && /no la presenta como una guerra declarada bilateral/i.test(romanovka1919Detail.curationNote),
  "la curaduria de Romanovka debe fijar fecha y jerarquia sin cerrar cifras de bajas o convertir el hecho en una guerra bilateral"
);
assert.equal(Object.keys(TOLDOS_VIEJOS_1826_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  TOLDOS_VIEJOS_1826_CONFLICT_RENAMES["Batalla de Toldos Viejos"],
  "Combate de Toldos Viejos (11 de septiembre de 1826)",
  "la entrada de Toldos Viejos debe llegar a la ficha curada de 1826"
);
assert.equal(
  TOLDOS_VIEJOS_1826_CONFLICT_RENAMES["Battle of Toldos Viejos"],
  "Combate de Toldos Viejos (11 de septiembre de 1826)",
  "el alias ingles de Toldos Viejos debe conservar la ficha curada"
);
const toldosViejos1826Detail = TOLDOS_VIEJOS_1826_CONFLICT_DETAIL_FIXES["Combate de Toldos Viejos (11 de septiembre de 1826)"];
assert.ok(
  toldosViejos1826Detail
    && toldosViejos1826Detail.startYear === 1826
    && toldosViejos1826Detail.startYear === toldosViejos1826Detail.endYear
    && toldosViejos1826Detail.parent === "Conflictos de frontera del sur bonaerense (1820-1829)"
    && toldosViejos1826Detail.war === "Conflictos de frontera del sur bonaerense (1820-1829)"
    && toldosViejos1826Detail.campaign === "Violencia de frontera y operaciones de 1826 en el sur bonaerense"
    && toldosViejos1826Detail.type === "combate terrestre"
    && toldosViejos1826Detail.conflictType === "frontera"
    && toldosViejos1826Detail.scale === "regional"
    && toldosViejos1826Detail.hierarchyConfidence === "alta"
    && toldosViejos1826Detail.hierarchySources?.length === 4
    && toldosViejos1826Detail.participants?.length === 2
    && toldosViejos1826Detail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /11 de septiembre de 1826/i.test(toldosViejos1826Detail.datePrecision)
    && /no reduce esas redes a dos bloques nacionales homogeneos/i.test(toldosViejos1826Detail.cause)
    && /no para atribuir el bando de 1826 a un Estado argentino moderno/i.test(toldosViejos1826Detail.sourceDispute)
    && /no describe los territorios indigenas como un vacio/i.test(toldosViejos1826Detail.curationNote),
  "la curaduria de Toldos Viejos debe fijar jerarquia y fecha sin convertir la frontera de 1826 en una guerra entre Estados modernos"
);
assert.equal(Object.keys(WILDCAT_CREEK_1812_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  WILDCAT_CREEK_1812_CONFLICT_RENAMES["Batalla de Wild Cat Creek"],
  "Combate de Wildcat Creek (Spur's Defeat, 22 de noviembre de 1812)",
  "la entrada de Wild Cat Creek debe llegar a la ficha curada de 1812"
);
assert.equal(
  WILDCAT_CREEK_1812_CONFLICT_RENAMES["Spur's Defeat"],
  "Combate de Wildcat Creek (Spur's Defeat, 22 de noviembre de 1812)",
  "el alias historico Spur's Defeat debe conservar la ficha curada"
);
const wildcatCreek1812Detail = WILDCAT_CREEK_1812_CONFLICT_DETAIL_FIXES["Combate de Wildcat Creek (Spur's Defeat, 22 de noviembre de 1812)"];
assert.ok(
  wildcatCreek1812Detail
    && wildcatCreek1812Detail.startYear === 1812
    && wildcatCreek1812Detail.startYear === wildcatCreek1812Detail.endYear
    && wildcatCreek1812Detail.parent === "Guerra anglo-estadounidense de 1812"
    && wildcatCreek1812Detail.war === "Guerra anglo-estadounidense de 1812"
    && wildcatCreek1812Detail.campaign === "Expedicion de Samuel Hopkins a Prophetstown (noviembre de 1812)"
    && wildcatCreek1812Detail.type === "combate terrestre"
    && wildcatCreek1812Detail.conflictType === "colonial"
    && wildcatCreek1812Detail.scale === "local"
    && wildcatCreek1812Detail.hierarchyConfidence === "alta"
    && wildcatCreek1812Detail.hierarchySources?.length === 4
    && wildcatCreek1812Detail.participants?.length === 2
    && wildcatCreek1812Detail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /22 de noviembre de 1812/i.test(wildcatCreek1812Detail.datePrecision)
    && /no reduce a los participantes indigenas a un unico bloque nacional/i.test(wildcatCreek1812Detail.cause)
    && /no se le asigna como beligerante directo/i.test(wildcatCreek1812Detail.sourceDispute)
    && /no confunde este combate con la batalla de Tippecanoe de 1811/i.test(wildcatCreek1812Detail.curationNote),
  "la curaduria de Wildcat Creek debe fijar fecha y jerarquia sin cerrar el lugar, las bajas o los bandos indigenas como un bloque unico"
);
assert.equal(Object.keys(TY_HO_BAY_1855_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  TY_HO_BAY_1855_CONFLICT_RENAMES["Batalla de Ty-ho Bay"],
  "Batalla de Ty-ho Bay (4 de agosto de 1855)",
  "Ty-ho Bay debe llegar a la ficha curada con su fecha precisa"
);
assert.equal(
  TY_HO_BAY_1855_CONFLICT_RENAMES["Battle of Ty Ho Bay"],
  "Batalla de Ty-ho Bay (4 de agosto de 1855)",
  "el alias ingles sin guion debe conservar la ficha curada de Ty-ho Bay"
);
const tyHoBay1855Detail = TY_HO_BAY_1855_CONFLICT_DETAIL_FIXES["Batalla de Ty-ho Bay (4 de agosto de 1855)"];
assert.ok(
  tyHoBay1855Detail
    && tyHoBay1855Detail.startYear === 1855
    && tyHoBay1855Detail.startYear === tyHoBay1855Detail.endYear
    && tyHoBay1855Detail.parent === "Operaciones antipirater\u00eda anglo-estadounidenses en el mar de China Meridional (1855)"
    && tyHoBay1855Detail.war === tyHoBay1855Detail.parent
    && tyHoBay1855Detail.campaign === "Operaci\u00f3n de rescate de mercantes en Ty-ho Bay (agosto de 1855)"
    && tyHoBay1855Detail.type === "batalla naval antipirater\u00eda"
    && tyHoBay1855Detail.conflictType === "pirateria"
    && tyHoBay1855Detail.scale === "internacional"
    && tyHoBay1855Detail.hierarchyConfidence === "alta"
    && tyHoBay1855Detail.hierarchySources?.length === 2
    && tyHoBay1855Detail.participants?.length === 2
    && tyHoBay1855Detail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /4 de agosto de 1855/i.test(tyHoBay1855Detail.datePrecision)
    && /no presenta al Estado Qing ni a la poblaci\u00f3n china como un bando homog\u00e9neo/i.test(tyHoBay1855Detail.cause)
    && /(?:ni|no) atribuye la flota al Estado Qing/i.test(tyHoBay1855Detail.participants[1].casualties)
    && /solo como referencia geogr\u00e1fica contempor\u00e1nea/i.test(tyHoBay1855Detail.curationNote),
  "la curaduria de Ty-ho Bay debe corregir fecha, jerarquia y geografia sin transformar la pirateria en una guerra estatal con China"
);
assert.ok(
  TY_HO_BAY_1855_COUNTRY_CONFLICT_ADDITIONS["Reino Unido"]?.includes("Batalla de Ty-ho Bay (4 de agosto de 1855)")
    && TY_HO_BAY_1855_COUNTRY_CONFLICT_ADDITIONS["Rep\u00fablica Popular China"]?.includes("Batalla de Ty-ho Bay (4 de agosto de 1855)"),
  "Ty-ho Bay debe aparecer para Reino Unido por participacion y para China como referencia geografica"
);
assert.equal(Object.keys(WENDEN_1577_1578_CONFLICT_DETAIL_FIXES).length, 2);
assert.equal(
  WENDEN_1577_1578_CONFLICT_RENAMES["Batallas de Wenden"],
  "Batallas de Wenden (1577-1578)",
  "la entrada plural debe conservar la serie de asedios y socorro de Wenden"
);
assert.equal(
  WENDEN_1577_1578_CONFLICT_RENAMES["Battles de Wenden"],
  "Batallas de Wenden (1577-1578)",
  "el alias hibrido de la serie debe llegar a la ficha curada"
);
assert.equal(
  WENDEN_1577_1578_CONFLICT_RENAMES["Batalla de Wenden"],
  "Batalla de Wenden (21-22 de octubre de 1578)",
  "la entrada singular debe conservar el combate de octubre separado de la serie"
);
assert.equal(
  WENDEN_1577_1578_CONFLICT_RENAMES["Battle of Wenden (1578)"],
  "Batalla de Wenden (21-22 de octubre de 1578)",
  "el alias ingles de la batalla debe llegar a la ficha curada"
);
const wendenSeriesDetail = WENDEN_1577_1578_CONFLICT_DETAIL_FIXES["Batallas de Wenden (1577-1578)"];
const wendenBattleDetail = WENDEN_1577_1578_CONFLICT_DETAIL_FIXES["Batalla de Wenden (21-22 de octubre de 1578)"];
assert.ok(
  wendenSeriesDetail
    && wendenSeriesDetail.startYear === 1577
    && wendenSeriesDetail.endYear === 1578
    && wendenSeriesDetail.parent === "Guerra de Livonia (1558-1583)"
    && wendenSeriesDetail.war === wendenSeriesDetail.parent
    && wendenSeriesDetail.campaign === "Operaciones por Wenden/C\u0113sis (1577-1578)"
    && wendenSeriesDetail.type === "serie de asedios y batalla de socorro"
    && wendenSeriesDetail.conflictType === "interestatal"
    && wendenSeriesDetail.scale === "regional"
    && wendenSeriesDetail.hierarchyConfidence === "alta"
    && wendenSeriesDetail.hierarchySources?.length === 3
    && wendenSeriesDetail.participants?.length === 3
    && wendenSeriesDetail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /Letonia se enlaza solo como ubicacion geografica contemporanea/i.test(wendenSeriesDetail.curationNote)
    && /(?:no|ni) nacionaliza a la poblacion local/i.test(wendenSeriesDetail.participants[2].casualties),
  "la serie de Wenden debe separar los asedios de 1577-1578 y conservar a Letonia solo como referencia geografica actual"
);
assert.ok(
  wendenBattleDetail
    && wendenBattleDetail.startYear === 1578
    && wendenBattleDetail.startYear === wendenBattleDetail.endYear
    && wendenBattleDetail.parent === "Guerra de Livonia (1558-1583)"
    && wendenBattleDetail.war === wendenBattleDetail.parent
    && wendenBattleDetail.campaign === "Socorro aliado de Wenden (octubre de 1578)"
    && wendenBattleDetail.type === "batalla campal y socorro de plaza"
    && wendenBattleDetail.conflictType === "interestatal"
    && wendenBattleDetail.scale === "regional"
    && wendenBattleDetail.hierarchyConfidence === "alta"
    && wendenBattleDetail.hierarchySources?.length === 2
    && wendenBattleDetail.participants?.length === 2
    && wendenBattleDetail.participants.every(side => side.side && side.members?.length && side.casualties)
    && /21 y 22 de octubre de 1578/i.test(wendenBattleDetail.datePrecision)
    && /no armonizan fuerzas ni bajas/i.test(wendenBattleDetail.participants[1].casualties)
    && /se distingue de la serie de asedios/i.test(wendenBattleDetail.curationNote),
  "la batalla de Wenden debe fijar el socorro de octubre sin cerrar cifras que las fuentes historicas no concilian"
);
assert.ok(
  ["Letonia", "Polonia", "Rusia", "Suecia"].every(country =>
    WENDEN_1577_1578_COUNTRY_CONFLICT_ADDITIONS[country]?.includes("Batallas de Wenden (1577-1578)")
      && WENDEN_1577_1578_COUNTRY_CONFLICT_ADDITIONS[country]?.includes("Batalla de Wenden (21-22 de octubre de 1578)")
  ),
  "Wenden debe poder navegarse desde los paises contemporaneos enlazados sin convertirlos en bandos historicos automaticos"
);
assert.equal(Object.keys(PHASE_LINE_BULLET_1991_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  PHASE_LINE_BULLET_1991_CONFLICT_RENAMES["Batalla de la l\u00ednea Bullet"],
  "Batalla de la l\u00ednea Bullet (26 de febrero de 1991)",
  "la variante visible en espanol debe llegar a la ficha curada de Phase Line Bullet"
);
assert.equal(
  PHASE_LINE_BULLET_1991_CONFLICT_RENAMES["Battle of Phase Line Bullet"],
  "Batalla de la l\u00ednea Bullet (26 de febrero de 1991)",
  "el alias ingles debe llegar a la ficha curada de Phase Line Bullet"
);
const phaseLineBullet1991Detail = PHASE_LINE_BULLET_1991_CONFLICT_DETAIL_FIXES["Batalla de la l\u00ednea Bullet (26 de febrero de 1991)"];
assert.ok(
  phaseLineBullet1991Detail
    && phaseLineBullet1991Detail.startYear === 1991
    && phaseLineBullet1991Detail.startYear === phaseLineBullet1991Detail.endYear
    && phaseLineBullet1991Detail.parent === "Guerra del Golfo"
    && phaseLineBullet1991Detail.war === phaseLineBullet1991Detail.parent
    && phaseLineBullet1991Detail.campaign === "Ofensiva terrestre de la Operaci\u00f3n Tormenta del Desierto (febrero de 1991)"
    && phaseLineBullet1991Detail.type === "batalla terrestre acorazada"
    && phaseLineBullet1991Detail.conflictType === "interestatal"
    && phaseLineBullet1991Detail.scale === "internacional"
    && phaseLineBullet1991Detail.hierarchyConfidence === "alta"
    && phaseLineBullet1991Detail.hierarchySources?.length === 3
    && phaseLineBullet1991Detail.participants?.length === 2
    && phaseLineBullet1991Detail.participants.every(side => side.side && side.members?.length && side.casualties)
    && phaseLineBullet1991Detail.participants[0].side === "3.\u00aa Divisi\u00f3n Acorazada de Estados Unidos"
    && phaseLineBullet1991Detail.participants[1].side === "Fuerzas iraqu\u00edes de la Guardia Republicana"
    && /26 de febrero de 1991/i.test(phaseLineBullet1991Detail.datePrecision)
    && /sur de Irak/i.test(phaseLineBullet1991Detail.region)
    && /no mezcla sus bajas ni resultado con los de esas acciones vecinas/i.test(phaseLineBullet1991Detail.sourceDispute)
    && /no una localidad que permita fijar coordenadas exactas/i.test(phaseLineBullet1991Detail.curationNote),
  "Phase Line Bullet debe salir de America y quedar como combate acorazado de la Guerra del Golfo sin fusionarse con 73 Easting u Objective Norfolk"
);
assert.ok(
  PHASE_LINE_BULLET_1991_COUNTRY_CONFLICT_ADDITIONS.Irak?.includes("Batalla de la l\u00ednea Bullet (26 de febrero de 1991)"),
  "Phase Line Bullet debe poder navegarse desde Irak por participacion directa"
);
assert.equal(Object.keys(COCKLE_CREEK_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  COCKLE_CREEK_CONFLICT_RENAMES["Batalla de Cockle Creek"],
  "Acción naval de Chincoteague Inlet (1861)"
);
assert.equal(
  COCKLE_CREEK_CONFLICT_RENAMES["Accion naval de Chincoteague Inlet (1861)"],
  "Acción naval de Chincoteague Inlet (1861)",
  "la variante sin tilde debe mantener la ficha curada al regenerar"
);
assert.ok(
  Object.values(COCKLE_CREEK_CONFLICT_DETAIL_FIXES).every(detail =>
    detail.startYear === 1861
      && detail.startYear === detail.endYear
      && detail.parent === "Guerra Civil estadounidense"
      && detail.campaign
      && detail.type === "acción naval"
      && detail.conflictType === "civil"
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 3
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && detail.sourceDispute
      && /no consolida cifras/i.test(detail.outcome)
  ),
  "la curaduria de Chincoteague Inlet debe conservar jerarquia, fuentes, participantes y cautela sobre fecha y bajas"
);
const cockleCreekWikipediaOverride = await resolveWikipediaConflictTitle("Acción naval de Chincoteague Inlet (1861)");
assert.equal(cockleCreekWikipediaOverride.language, "en");
assert.equal(cockleCreekWikipediaOverride.pageTitle, "Battle_of_Cockle_Creek");
assert.equal(Object.keys(CLOUDS_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  CLOUDS_CONFLICT_RENAMES["Batalla de Clouds"],
  "Batalla de las Nubes (1777)"
);
assert.ok(
  Object.values(CLOUDS_CONFLICT_DETAIL_FIXES).every(detail =>
    detail.startYear === 1777
      && detail.startYear === detail.endYear
      && detail.parent === "Guerra de Independencia de Estados Unidos"
      && detail.campaign === "Campaña de Filadelfia de 1777"
      && detail.type === "batalla"
      && detail.conflictType === "independencia"
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 4
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && detail.sourceDispute
      && /no atribuye una victoria táctica/i.test(detail.outcome)
  ),
  "la curaduria de la Batalla de las Nubes debe conservar jerarquia, fuentes, participantes y cautela sobre bajas y resultado"
);
const cloudsWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de las Nubes (1777)");
assert.equal(cloudsWikipediaOverride.language, "en");
assert.equal(cloudsWikipediaOverride.pageTitle, "Battle_of_the_Clouds");
assert.equal(Object.keys(COLSONS_MILL_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  COLSONS_MILL_CONFLICT_RENAMES["Batalla de Colson's Mill"],
  "Batalla de Colson's Mill (1780)"
);
assert.ok(
  Object.values(COLSONS_MILL_CONFLICT_DETAIL_FIXES).every(detail =>
    detail.startYear === 1780
      && detail.startYear === detail.endYear
      && detail.parent === "Guerra de Independencia de Estados Unidos"
      && detail.campaign === "Campaña del sur de 1780"
      && detail.type === "batalla"
      && detail.conflictType === "independencia"
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 2
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length && side.casualties)
      && detail.sourceDispute
      && /no le adjudica ese mando/i.test(detail.curationNote)
  ),
  "la curaduria de Colson's Mill debe conservar jerarquia, fuentes, bajas atribuidas y la correccion del mando lealista"
);
assert.equal(Object.keys(CHILLICOTHE_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  CHILLICOTHE_CONFLICT_RENAMES["Batalla de Chillicothe"],
  "Batalla de Chillicothe (1779)"
);
assert.ok(
  Object.values(CHILLICOTHE_CONFLICT_DETAIL_FIXES).every(detail =>
    detail.startYear === 1779
      && detail.startYear === detail.endYear
      && detail.parent === "Guerra de Independencia de Estados Unidos"
      && detail.campaign === "Expedición de Bowman contra Chillicothe de 1779"
      && detail.type === "incursión y combate"
      && detail.conflictType === "frontera"
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 3
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && detail.sourceDispute
      && /no consolida bajas/i.test(detail.curationNote)
  ),
  "la curaduria de Chillicothe debe conservar fecha anual, jerarquia, fuentes y cautela sobre bajas y resultado"
);
const chillicotheWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Chillicothe (1779)");
assert.equal(chillicotheWikipediaOverride.language, "en");
assert.equal(chillicotheWikipediaOverride.pageTitle, "Battle_of_Chillicothe");
assert.equal(Object.keys(ASINARA_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  ASINARA_CONFLICT_RENAMES["Batalla de Asinara"],
  "Batalla naval de Asinara (1409)"
);
assert.ok(
  Object.values(ASINARA_CONFLICT_DETAIL_FIXES).every(detail =>
    detail.startYear === 1409
      && detail.startYear === detail.endYear
      && detail.parent === "Expedición de Martín el Joven en Cerdeña (1408-1410)"
      && detail.campaign === "Operaciones navales del norte de Cerdeña (1409)"
      && detail.type === "batalla naval"
      && detail.conflictType === "sucesion"
      && detail.hierarchyConfidence === "media"
      && detail.hierarchySources?.length >= 2
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties) && detail.treaties.length === 0
      && /no identifica mandos individuales/i.test(detail.curationNote)
  ),
  "la curaduria de Asinara debe conservar fecha anual, jerarquia, fuentes, participantes y cautela sobre bajas y mandos"
);
assert.equal(Object.keys(BAU_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  BAU_CONFLICT_RENAMES["Batalla de Bau"],
  "Batalla de Bau (1965)"
);
assert.deepEqual(
  BAU_COUNTRY_CONFLICT_ADDITIONS.Indonesia,
  ["Batalla de Bau (1965)"]
);
assert.deepEqual(
  BAU_COUNTRY_CONFLICT_ADDITIONS.Malasia,
  ["Batalla de Bau (1965)"]
);
assert.ok(
  Object.values(BAU_CONFLICT_DETAIL_FIXES).every(detail =>
    detail.startYear === 1965
      && detail.startYear === detail.endYear
      && detail.parent === "Confrontación Indonesia-Malasia"
      && detail.campaign === "Operaciones Claret en Borneo (1965)"
      && detail.type === "combate de selva"
      && detail.conflictType === "interestatal"
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 3
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties) && detail.treaties.length === 0
      && /no consolida esas cifras/i.test(detail.curationNote)
  ),
  "la curaduria de Bau debe conservar fecha, jerarquia, fuentes, paises vinculados y cautela sobre bajas y resultado"
);
const bauWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Bau (1965)");
assert.equal(bauWikipediaOverride.language, "en");
assert.equal(bauWikipediaOverride.pageTitle, "Battle_of_Bau");
assert.equal(Object.keys(ARANAS_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  ARANAS_CONFLICT_RENAMES["Batalla de Aranas"],
  "Batalla de Aranas (2007)"
);
assert.deepEqual(
  ARANAS_COUNTRY_CONFLICT_ADDITIONS["Afganistán"],
  ["Batalla de Aranas (2007)"]
);
assert.ok(
  Object.values(ARANAS_CONFLICT_DETAIL_FIXES).every(detail =>
    detail.startYear === 2007
      && detail.startYear === detail.endYear
      && detail.parent === "Guerra de Afganistán"
      && detail.campaign === "Operaciones en Nuristán"
      && detail.type === "batalla"
      && detail.conflictType === "insurgencia"
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 3
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties) && detail.treaties.length === 0
      && /no se adjudica una victoria táctica/i.test(detail.curationNote)
  ),
  "la curaduria de Aranas debe conservar fecha, jerarquia, fuentes, participantes y cautela sobre bajas y resultado"
);
const aranasWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Aranas (2007)");
assert.equal(aranasWikipediaOverride.language, "en");
assert.equal(aranasWikipediaOverride.pageTitle, "Battle_of_Aranas");
assert.equal(Object.keys(ALEGRE_CONFLICT_DETAIL_FIXES).length, 1);
assert.equal(
  ALEGRE_CONFLICT_RENAMES["Batalla de Alegre"],
  "Combate naval de Alegre (1867)"
);
assert.deepEqual(
  ALEGRE_COUNTRY_CONFLICT_ADDITIONS.Brasil,
  ["Combate naval de Alegre (1867)"]
);
assert.ok(
  Object.values(ALEGRE_CONFLICT_DETAIL_FIXES).every(detail =>
    detail.startYear === 1867
      && detail.startYear === detail.endYear
      && detail.parent === "Guerra de la Triple Alianza"
      && detail.campaign === "Operaciones de la retomada de Corumbá (1867)"
      && detail.type === "combate naval"
      && detail.conflictType === "interestatal"
      && detail.hierarchyConfidence === "alta"
      && detail.hierarchySources?.length >= 3
      && detail.hierarchySources.every(item => item.label && item.url)
      && detail.participants?.length === 2
      && detail.participants.every(side => side.side && side.members?.length)
      && Array.isArray(detail.treaties) && detail.treaties.length === 0
      && /no consolida un total de bajas/i.test(detail.curationNote)
  ),
  "la curaduria de Alegre debe conservar fecha, jerarquia, fuentes, participantes y cautela sobre bajas"
);
const alegreWikipediaOverride = await resolveWikipediaConflictTitle("Combate naval de Alegre (1867)");
assert.equal(alegreWikipediaOverride.language, "en");
assert.equal(alegreWikipediaOverride.pageTitle, "Battle_of_Alegre");
assert.deepEqual(
  CABO_BOJADOR_COUNTRY_CONFLICT_EXCLUSIONS.Marruecos,
  ["Batalla de Cabo Bojador"]
);
assert.equal(CABO_BOJADOR_CURATORIAL_NOTES["Batalla de Cabo Bojador"].action, "eliminar");
assert.ok(
  CABO_BOJADOR_CURATORIAL_NOTES["Batalla de Cabo Bojador"].sources.length >= 2
    && /no documentan una batalla/i.test(CABO_BOJADOR_CURATORIAL_NOTES["Batalla de Cabo Bojador"].reason),
  "la exclusion de Cabo Bojador debe conservar la razon y fuentes que evitan convertir una exploracion en conflicto"
);
assert.deepEqual(
  CERRO_DEL_GALLO_COUNTRY_CONFLICT_EXCLUSIONS["México"],
  ["Batalla de Cerro del Gallo"]
);
assert.equal(CERRO_DEL_GALLO_CURATORIAL_NOTES["Batalla de Cerro del Gallo"].action, "eliminar");
assert.ok(
  CERRO_DEL_GALLO_CURATORIAL_NOTES["Batalla de Cerro del Gallo"].sources.length >= 2
    && /Batalla de Cerro Grande/i.test(CERRO_DEL_GALLO_CURATORIAL_NOTES["Batalla de Cerro del Gallo"].reason)
    && /Chile/i.test(CERRO_DEL_GALLO_CURATORIAL_NOTES["Batalla de Cerro del Gallo"].reason),
  "la exclusion debe impedir que la fuente chilena de Cerro Grande contamine el historial de Mexico"
);
const explicitBattleWithoutTreaty = curateConflictEntry({
  name: "Batalla de prueba sin tratado",
  startYear: 1944,
  endYear: 1944,
  parent: "Segunda Guerra Mundial",
  campaign: "Campaña de prueba",
  type: "batalla",
  treaties: []
});
assert.deepEqual(explicitBattleWithoutTreaty.treaties, [], "una lista vacia curada no debe convertirse en un tratado ficticio");
const englishWikipediaOverride = await resolveWikipediaConflictTitle("Segunda batalla de Fort McAllister");
assert.equal(englishWikipediaOverride.language, "en");
assert.match(englishWikipediaOverride.apiUrl, /^https:\/\/en\.wikipedia\.org\//);
assert.equal(englishWikipediaOverride.pageTitle, "Second_Battle_of_Fort_McAllister");
const stephenHopkinsWikipediaOverride = await resolveWikipediaConflictTitle("Combate naval del SS Stephen Hopkins");
assert.equal(stephenHopkinsWikipediaOverride.language, "en");
assert.match(stephenHopkinsWikipediaOverride.apiUrl, /^https:\/\/en\.wikipedia\.org\//);
assert.equal(stephenHopkinsWikipediaOverride.pageTitle, "SS_Stephen_Hopkins");
const littleBighornWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Little Bighorn");
assert.equal(littleBighornWikipediaOverride.language, "en");
assert.match(littleBighornWikipediaOverride.apiUrl, /^https:\/\/en\.wikipedia\.org\//);
assert.equal(littleBighornWikipediaOverride.pageTitle, "Battle_of_the_Little_Bighorn");
const fortSlongoWikipediaOverride = await resolveWikipediaConflictTitle("Asalto a Fort Slongo (1781)");
assert.equal(fortSlongoWikipediaOverride.language, "en");
assert.equal(fortSlongoWikipediaOverride.pageTitle, "Battle_of_Fort_Slongo");
const barentsWikipediaOverride = await resolveWikipediaConflictTitle("Batalla del mar de Barents");
assert.equal(barentsWikipediaOverride.language, "en");
assert.match(barentsWikipediaOverride.apiUrl, /^https:\/\/en\.wikipedia\.org\//);
assert.equal(barentsWikipediaOverride.pageTitle, "Battle_of_the_Barents_Sea");
const hiepHoaWikipediaOverride = await resolveWikipediaConflictTitle("Ataque al campamento de Hiep Hoa");
assert.equal(hiepHoaWikipediaOverride.language, "en");
assert.equal(hiepHoaWikipediaOverride.pageTitle, "Battle_of_Hiep_Hoa");
const biapWikipediaOverride = await resolveWikipediaConflictTitle("Batalla del Aeropuerto Internacional de Bagdad");
assert.equal(biapWikipediaOverride.language, "en");
assert.equal(biapWikipediaOverride.pageTitle, "Battle_of_Baghdad_International_Airport");
const doAbWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Do Ab");
assert.equal(doAbWikipediaOverride.language, "en");
assert.equal(doAbWikipediaOverride.pageTitle, "Battle_of_Do_Ab");
const rasKamboniWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Ras Kamboni (2024)");
assert.equal(rasKamboniWikipediaOverride.language, "en");
assert.equal(rasKamboniWikipediaOverride.pageTitle, "Battle_of_Ras_Kamboni_(2024)");
const tinzawateneWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Tinzawatène (2024)");
assert.equal(tinzawateneWikipediaOverride.language, "es");
assert.equal(tinzawateneWikipediaOverride.pageTitle, "Batalla_de_Tinzawatène_(2024)");
const amharaWikipediaOverride = await resolveWikipediaConflictTitle("Ofensiva de Fano en Amhara de 2024");
assert.equal(amharaWikipediaOverride.language, "en");
assert.equal(amharaWikipediaOverride.pageTitle, "Amhara_offensive");
const boulikessiWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Boulikessi (2025)");
assert.equal(boulikessiWikipediaOverride.language, "en");
assert.equal(boulikessiWikipediaOverride.pageTitle, "Battle_of_Boulikessi_(2025)");
const dieppeWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Dieppe (1942)");
assert.equal(dieppeWikipediaOverride.language, "en");
assert.equal(dieppeWikipediaOverride.pageTitle, "Battle_of_Dieppe");
const cabralWikipediaOverride = await resolveWikipediaConflictTitle("Asalto a los acorazados Cabral y Lima Barros (1868)");
assert.equal(cabralWikipediaOverride.language, "es");
assert.equal(cabralWikipediaOverride.pageTitle, "Asalto_a_los_acorazados_Cabral_y_Lima_Barros");
const solebayWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Solebay (1672)");
assert.equal(solebayWikipediaOverride.language, "en");
assert.equal(solebayWikipediaOverride.pageTitle, "Battle_of_Solebay");
const dynekilenWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Dynekilen (1716)");
assert.equal(dynekilenWikipediaOverride.language, "en");
assert.equal(dynekilenWikipediaOverride.pageTitle, "Battle_of_Dynekilen");
const kircholmWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Kircholm (1605)");
assert.equal(kircholmWikipediaOverride.language, "en");
assert.equal(kircholmWikipediaOverride.pageTitle, "Battle_of_Kircholm");
const oliwaWikipediaOverride = await resolveWikipediaConflictTitle("Batalla naval de Oliwa (1627)");
assert.equal(oliwaWikipediaOverride.language, "en");
assert.equal(oliwaWikipediaOverride.pageTitle, "Battle_of_Oliwa");
const prostkiWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Prostki (1656)");
assert.equal(prostkiWikipediaOverride.language, "en");
assert.equal(prostkiWikipediaOverride.pageTitle, "Battle_of_Prostki");
const kcyniaWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Kcynia (1656)");
assert.equal(kcyniaWikipediaOverride.language, "en");
assert.equal(kcyniaWikipediaOverride.pageTitle, "Battle_of_Kcynia");
const lubrzeWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Lubrze (1656)");
assert.equal(lubrzeWikipediaOverride.language, "en");
assert.equal(lubrzeWikipediaOverride.pageTitle, "Battle_of_Lubrze");
const chojniceWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Chojnice (1657)");
assert.equal(chojniceWikipediaOverride.language, "en");
assert.equal(chojniceWikipediaOverride.pageTitle, "Battle_of_Chojnice_(1656)");
const tykocinWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Tykocin (1656)");
assert.equal(tykocinWikipediaOverride.language, "en");
assert.equal(tykocinWikipediaOverride.pageTitle, "Battle_of_Tykocin");
const karksiWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Karksi (1600)");
assert.equal(karksiWikipediaOverride.language, "en");
assert.equal(karksiWikipediaOverride.pageTitle, "Battle_of_Karksi_(1600)");
const daugavgrivaWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Daugavgriva (1609)");
assert.equal(daugavgrivaWikipediaOverride.language, "en");
assert.equal(daugavgrivaWikipediaOverride.pageTitle, "Battle_of_Daugavgr\u012bva_(1609)");
const revalWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Reval (1602)");
assert.equal(revalWikipediaOverride.language, "en");
assert.equal(revalWikipediaOverride.pageTitle, "Battle_of_Reval_(1602)");
const wallhofWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Wallhof (1626)");
assert.equal(wallhofWikipediaOverride.language, "en");
assert.equal(wallhofWikipediaOverride.pageTitle, "Battle_of_Wallhof");
const happoWikipediaOverride = await resolveWikipediaConflictTitle("Acción naval de Happo (1592)");
assert.equal(happoWikipediaOverride.language, "en");
assert.equal(happoWikipediaOverride.pageTitle, "Battle_of_Happo");
const yulpoWikipediaOverride = await resolveWikipediaConflictTitle("Batalla naval de Yulpo (1592)");
assert.equal(yulpoWikipediaOverride.language, "en");
assert.equal(yulpoWikipediaOverride.pageTitle, "List_of_naval_battles_during_the_Imjin_War");
const jangnimpoWikipediaOverride = await resolveWikipediaConflictTitle("Acción naval de Jangnimpo (1592)");
assert.equal(jangnimpoWikipediaOverride.language, "en");
assert.equal(jangnimpoWikipediaOverride.pageTitle, "List_of_naval_battles_during_the_Imjin_War");
const cookesCanyonWikipediaOverride = await resolveWikipediaConflictTitle("Combate de Cooke's Canyon (1861)");
assert.equal(cookesCanyonWikipediaOverride.language, "en");
assert.equal(cookesCanyonWikipediaOverride.pageTitle, "Battle_of_Cookes_Canyon");
const devilsCreekWikipediaOverride = await resolveWikipediaConflictTitle("Combate de Devil's Creek (1885)");
assert.equal(devilsCreekWikipediaOverride.language, "en");
assert.equal(devilsCreekWikipediaOverride.pageTitle, "Battle_of_Devil's_Creek");
const diabloMountainsWikipediaOverride = await resolveWikipediaConflictTitle("Combate de Sierra Diablo (1854)");
assert.equal(diabloMountainsWikipediaOverride.language, "en");
assert.equal(diabloMountainsWikipediaOverride.pageTitle, "Battle_of_the_Diablo_Mountains");
const doloresRiverWikipediaOverride = await resolveWikipediaConflictTitle("Combate del rio Dolores (1904)");
assert.equal(doloresRiverWikipediaOverride.language, "en");
assert.equal(doloresRiverWikipediaOverride.pageTitle, "Battle_of_Dolores_River");
const doroPassageWikipediaOverride = await resolveWikipediaConflictTitle("Accion naval del paso de Doro (1827)");
assert.equal(doroPassageWikipediaOverride.language, "en");
assert.equal(doroPassageWikipediaOverride.pageTitle, "Battle_of_Doro_Passage");
const drohiczynWikipediaOverride = await resolveWikipediaConflictTitle("Combate de Drohiczyn (1192)");
assert.equal(drohiczynWikipediaOverride.language, "en");
assert.equal(drohiczynWikipediaOverride.pageTitle, "Battle_of_Drohiczyn");
const jaskWikipediaOverride = await resolveWikipediaConflictTitle("Combate naval de Jask (1620)");
assert.equal(jaskWikipediaOverride.language, "en");
assert.equal(jaskWikipediaOverride.pageTitle, "Battle_off_Jask");
const piranoWikipediaOverride = await resolveWikipediaConflictTitle("Batalla naval de Pirano (1812)");
assert.equal(piranoWikipediaOverride.language, "en");
assert.equal(piranoWikipediaOverride.pageTitle, "Battle_of_Pirano");
const czortkowWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Czortk\u00f3w (1919)");
assert.equal(czortkowWikipediaOverride.language, "es");
assert.equal(czortkowWikipediaOverride.pageTitle, "Chortkiv_offensive");
const bantryWikipediaOverride = await resolveWikipediaConflictTitle("Batalla naval de la bahía de Bantry (1689)");
assert.equal(bantryWikipediaOverride.language, "en");
assert.equal(bantryWikipediaOverride.pageTitle, "Battle_of_Bantry_Bay");
const chandannagarWikipediaOverride = await resolveWikipediaConflictTitle("Asedio y captura de Chandannagar (1757)");
assert.equal(chandannagarWikipediaOverride.language, "en");
assert.equal(chandannagarWikipediaOverride.pageTitle, "Battle_of_Chandannagar");
const chesapeakeWikipediaOverride = await resolveWikipediaConflictTitle("Batalla naval de la bahía de Chesapeake (1781)");
assert.equal(chesapeakeWikipediaOverride.language, "en");
assert.equal(chesapeakeWikipediaOverride.pageTitle, "Battle_of_the_Chesapeake");
const carrizalWikipediaOverride = await resolveWikipediaConflictTitle("Combate de Carrizal (1916)");
assert.equal(carrizalWikipediaOverride.language, "en");
assert.equal(carrizalWikipediaOverride.pageTitle, "Battle_of_Carrizal");
const hill282WikipediaOverride = await resolveWikipediaConflictTitle("Batalla de la colina 282 (1950)");
assert.equal(hill282WikipediaOverride.language, "en");
assert.equal(hill282WikipediaOverride.pageTitle, "Battle_of_Hill_282");
const shimonosekiWikipediaOverride = await resolveWikipediaConflictTitle("Batalla naval del estrecho de Shimonoseki (1863)");
assert.equal(shimonosekiWikipediaOverride.language, "en");
assert.equal(shimonosekiWikipediaOverride.pageTitle, "Battle_of_Shimonoseki_Straits");
const sanJuanWikipediaOverride = await resolveWikipediaConflictTitle("Bombardeo de San Juan de Puerto Rico (1898)");
assert.equal(sanJuanWikipediaOverride.language, "en");
assert.equal(sanJuanWikipediaOverride.pageTitle, "Bombardment_of_San_Juan");
const carillonWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Carillon (1758)");
assert.equal(carillonWikipediaOverride.language, "en");
assert.equal(carillonWikipediaOverride.pageTitle, "Battle_of_Carillon");
const qurnaWikipediaOverride = await resolveWikipediaConflictTitle("Batalla de Qurna (1914)");
assert.equal(qurnaWikipediaOverride.language, "en");
assert.equal(qurnaWikipediaOverride.pageTitle, "Battle_of_Qurna");
const jumunjinWikipediaOverride = await resolveWikipediaConflictTitle("Batalla naval de Jumunjin (1950)");
assert.equal(jumunjinWikipediaOverride.language, "en");
assert.equal(jumunjinWikipediaOverride.pageTitle, "Battle_of_Chumonchin_Chan");
const maryangWikipediaOverride = await resolveWikipediaConflictTitle("Primera batalla de Maryang San (1951)");
assert.equal(maryangWikipediaOverride.language, "en");
assert.equal(maryangWikipediaOverride.pageTitle, "First_Battle_of_Maryang_San");
const spanishWikipediaOverride = await resolveWikipediaConflictTitle("Guerra de Corea");
assert.equal(spanishWikipediaOverride.language, "es");
assert.match(spanishWikipediaOverride.apiUrl, /^https:\/\/es\.wikipedia\.org\//);

const curatedIntervention = curateConflictEntry({
  name: "Intervencion en Siberia",
  startYear: 1918,
  endYear: 1920,
  conflictType: "intervencion"
});
assert.equal(curatedIntervention.conflictType, "intervencion", "la curaduria no debe pisar tipos explicitos");
assert.equal(curatedIntervention.curationStatus, "estructural");
assert.equal(curatedIntervention.dataConfidence, "parcial");

const sourceBackedConflict = curateConflictEntry({
  name: "Batalla respaldada por fuentes",
  startYear: 1900,
  endYear: 1900,
  type: "batalla",
  curationPriority: "media",
  curationBatch: "source-backed-test"
});
assert.equal(sourceBackedConflict.curationPriority, "media", "la prioridad explicita debe conservarse");
assert.equal(sourceBackedConflict.curationBatch, "source-backed-test", "la procedencia de curaduria no debe reemplazarse");

const canonicalWarOf1812Parent = curateConflictEntry({
  name: "Batalla de prueba de 1812",
  startYear: 1812,
  endYear: 1812,
  type: "batalla",
  parent: "Guerra de 1812",
  war: "Guerra de 1812"
});
assert.equal(canonicalWarOf1812Parent.parent, "Guerra anglo-estadounidense de 1812");
assert.equal(canonicalWarOf1812Parent.war, "Guerra anglo-estadounidense de 1812");

const accentedCanonicalParent = curateConflictEntry({
  name: "Incursión naval de prueba",
  startYear: 1804,
  endYear: 1804,
  type: "incursión naval",
  parent: "Guerras napoleónicas",
  war: "Guerras napoleónicas"
});
assert.equal(accentedCanonicalParent.parent, "Guerras napoleónicas", "una jerarquia bien escrita no debe perder acentos");
assert.equal(accentedCanonicalParent.war, "Guerras napoleónicas", "la guerra canonica debe conservar su ortografia visible");

const structuralBattle = curateConflictEntry({
  name: "Batalla de Prueba",
  startYear: 1777,
  endYear: 1777,
  type: "batalla"
}, { country: { name: "Pais A", continent: "America" } });
assert.match(structuralBattle.cause, /Accion militar de 1777/);
assert.ok(!/pendiente|requiere ampliacion|disputa militar o politica/i.test(structuralBattle.cause));

const refreshedPlaceholder = curateConflictEntry({
  name: "Campana de Prueba",
  startYear: 1800,
  endYear: 1801,
  cause: "Disputa militar o politica asociada a America.",
  outcome: "Resultado pendiente de curaduria especifica; registrado como evento historico verificado por presencia en el dataset.",
  consequences: "Impacto militar y politico localizado en America; requiere ampliacion historiografica fina."
}, { country: { name: "Pais A", continent: "America" } });
assert.ok(!/resultado pendiente|requiere ampliacion|disputa militar o politica/i.test([
  refreshedPlaceholder.cause,
  refreshedPlaceholder.outcome,
  refreshedPlaceholder.consequences
].join(" ")));

const refreshedRegionalPlaceholder = curateConflictEntry({
  name: "Batalla de Prueba Actualizada",
  startYear: 1777,
  endYear: 1777,
  type: "batalla",
  parent: "Guerra de Independencia de Estados Unidos",
  war: "Guerra de Independencia de Estados Unidos",
  campaign: "Campana de prueba de 1777",
  region: "Nueva York, Estados Unidos",
  cause: "Accion militar de fecha no consolidada vinculada a Conflicto regional de America, centrada en control territorial.",
  outcome: "Desenlace tactico registrado dentro de Conflicto regional de America; las cifras especificas no estan consolidadas.",
  consequences: "Contribuyo a la evolucion operacional de Conflicto regional de America y a la lectura territorial de America."
});
assert.match(refreshedRegionalPlaceholder.cause, /Accion militar de 1777/);
assert.match(refreshedRegionalPlaceholder.cause, /Guerra de Independencia de Estados Unidos/);
assert.doesNotMatch([
  refreshedRegionalPlaceholder.cause,
  refreshedRegionalPlaceholder.outcome,
  refreshedRegionalPlaceholder.consequences
].join(" "), /Conflicto regional de America|fecha no consolidada/i);

const accentMatchedSpecialMetadata = curateConflictEntry({
  name: "Operaciones Temeraria y Persecución",
  ongoing: false
}, { country: { name: "Estados Unidos", continent: "America" } });
assert.equal(accentMatchedSpecialMetadata.startYear, 1944, "metadatos especiales deben matchear aunque varie el acento");
assert.equal(accentMatchedSpecialMetadata.parent, "Segunda Guerra Mundial");
assert.equal(accentMatchedSpecialMetadata.campaign, "Campaña de Nueva Guinea occidental");

const report = buildConflictAuditReport({
  countries: {
    USA: {
      name: "Estados Unidos",
      military: {
        conflicts: [
          { name: "Batalla de Saigon", startYear: 1955, endYear: 1955 },
          { name: "Batalla de Midway", startYear: 1942, endYear: 1942 },
          { name: "Batalla de Cheonpyeong Valley", startYear: 1951, endYear: 1951 },
          { name: "Batalla de Brandywine", curationBatch: "safe-structured-conflict-curation-2026-06" },
          { name: "Batalla de Galwan", startYear: 2020, endYear: 2020 },
          { name: "Combate en el valle del Galwan de 2020", startYear: 2020, endYear: 2020 },
          { name: "Batalla de Khaz Oruzgan", startYear: 2010, endYear: 2010 },
          { name: "Batalla de la cota 233", startYear: 1973, endYear: 1973 },
          { name: "Batalla de Battle Mountain", startYear: 1950, endYear: 1950 },
          { name: "Batalla de Douz", startYear: 2011, endYear: 2011 },
          { name: "Combate de la Junon contra el Fox", startYear: 1809, endYear: 1809 },
          { name: "Batalla del valle de Ia Drang", startYear: 1965, endYear: 1965 },
          { name: "Sitio de Khe Sanh", startYear: 1968, endYear: 1968 },
          { name: "Batalla de Lima Site 85", startYear: 1968, endYear: 1968 },
          { name: "Batalla de Monterey" },
          { name: "Batalla de Marilao River" },
          { name: "Batalla de Manila (1899)", startYear: 1899, endYear: 1899 },
          { name: "Batalla de Manila (1945)", startYear: 1945, endYear: 1945 },
          { name: "Batalla de Fort Wayne" },
          { name: "Batalla de River Canard" },
          { name: "Batalla de Horseshoe Bend" },
          { name: "Batalla de Norwalk" },
          { name: "Batalla de Fort Slongo" },
          { name: "Batalla de Happo" },
          { name: "Batalla de Bantry Bay" },
          { name: "Batalla de El Carrizal" },
          { name: "Segunda batalla de San Juan" },
          { name: "Adriatic Campaign de World War II", startYear: 1939, endYear: 1945 }
        ]
      }
    }
  },
  generatedDetails: { conflicts: {} },
  maxItems: 10000
});

const saigon = report.topIssues.find(item => item.name === "Batalla de Saigon");
assert.ok(!saigon?.issues.includes("battle_without_parent"), "Batalla de Saigon debe tener padre curado");

const adriatic = report.topIssues.find(item => item.name === "Adriatic Campaign de World War II");
assert.ok(!adriatic, "Los renombres seguros deben canonicalizarse antes de auditar duplicados");

const midway = report.topIssues.find(item => item.name === "Batalla de Midway");
assert.ok(!midway?.issues.includes("battle_without_parent"), "Batalla de Midway debe tener padre curado");

const cheonpyeong = [...report.topIssues, ...report.topAdvisories].find(item => item.name === "Batalla de Cheonpyeong");
assert.equal(cheonpyeong?.provisionalHierarchy, false, "Cheonpyeong debe dejar de usar una jerarquia provisional");
assert.equal(cheonpyeong?.hierarchyLabel, "Guerra de Corea", "Cheonpyeong debe auditarse bajo su guerra padre verificada");
assert.ok(!report.topAdvisories.some(item => item.name === "Batalla de Cheonpyeong"), "Cheonpyeong no debe seguir en la cola provisional");
assert.ok(!report.topAdvisories.some(item => item.name === "Batalla de Brandywine"), "Brandywine debe usar su jerarquia verificada");
assert.ok(
  ![...report.topIssues, ...report.topAdvisories].some(item => item.name === "Batalla de Galwan" || item.name === "Combate en el valle del Galwan de 2020"),
  "las dos variantes de Galwan deben converger al nombre canonico"
);
assert.ok(!report.topAdvisories.some(item => item.name === "Batalla de Battle Mountain"), "Battle Mountain debe usar Guerra de Corea");
assert.ok(!report.topAdvisories.some(item => item.name === "Escaramuza de Douz de 2011"), "Douz debe usar una jerarquia verificada");
const khazOruzgan = [...report.topIssues, ...report.topAdvisories].find(item => item.name === "Batalla de Khaz Oruzgan");
assert.equal(khazOruzgan?.startYear, 2008, "Khaz Oruzgan debe conservar su fecha historica de 2008");
const marker233 = [...report.topIssues, ...report.topAdvisories].find(item => item.name === "Batalla de la borne 233");
assert.equal(marker233?.startYear, 1961, "la batalla de la borne 233 debe reemplazar la fecha incorrecta de 1973");
const junonFox = [...report.topIssues, ...report.topAdvisories].find(item => item.name === "Combate naval de la Junon contra la Fox (1778)");
assert.equal(junonFox?.startYear, 1778, "el combate Junon-Fox debe reemplazar el año incorrecto de 1809");
assert.ok(!report.topAdvisories.some(item => item.name === "Batalla del valle de Ia Drang"), "Ia Drang debe usar Guerra de Vietnam");
assert.ok(!report.topAdvisories.some(item => item.name === "Sitio de Khe Sanh"), "Khe Sanh debe usar su campaña verificada");
assert.ok(!report.topAdvisories.some(item => item.name === "Batalla de Lima Site 85"), "Lima Site 85 debe usar la guerra civil de Laos");
assert.ok(!report.topAdvisories.some(item => item.name === "Batalla de Monterrey"), "Monterey debe converger a Monterrey y conservar su guerra padre");
assert.ok(!report.topAdvisories.some(item => item.name === "Batalla del río Marilao"), "Marilao debe quedar traducida y bajo su guerra padre");
assert.ok(!report.topAdvisories.some(item => item.name === "Incursión de Norwalk (1779)"), "Norwalk debe usar su campaña verificada de 1779");
assert.ok(!report.topAdvisories.some(item => item.name === "Asalto a Fort Slongo (1781)"), "Fort Slongo debe usar su jerarquía verificada de 1781");
assert.ok(
  !report.topAdvisories.some(item => item.name === "Batalla naval de la bahía de Bantry (1689)"),
  "Bantry debe usar su fecha y jerarquía verificadas"
);
assert.ok(
  !report.topAdvisories.some(item => item.name === "Combate de Carrizal (1916)"),
  "Carrizal debe usar su fecha y jerarquía verificadas"
);
assert.ok(
  !report.topAdvisories.some(item => item.name === "Bombardeo de San Juan de Puerto Rico (1898)"),
  "San Juan debe usar su fecha y jerarquía verificadas"
);
assert.ok(!report.topIssues.some(item => item.name === "Batalla de Manila"), "el nombre ambiguo de Manila no debe reaparecer en la auditoria");
assert.ok(!report.topAdvisories.some(item => item.name === "Sitio de Fort Wayne"), "Fort Wayne debe usar la guerra de 1812");
assert.ok(!report.topAdvisories.some(item => item.name === "Batalla del río Canard"), "River Canard debe quedar traducida y jerarquizada");
assert.ok(!report.topAdvisories.some(item => item.name === "Batalla de Horseshoe Bend"), "Horseshoe Bend debe usar Guerra Creek");
assert.ok(!report.topAdvisories.some(item => item.name === "Acción naval de Happo (1592)"), "Happo debe usar la guerra de Imjin verificada");

console.log("conflict-autofix.test.js ok");
