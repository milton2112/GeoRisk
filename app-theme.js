(() => {
  const MAP_LABEL_SETS = {
    continents: [
      { id: "continent-america", text: "America", lon: -95, lat: 13 },
      { id: "continent-europe", text: "Europa", lon: 15, lat: 53 },
      { id: "continent-asia", text: "Asia", lon: 92, lat: 35 },
      { id: "continent-africa", text: "Africa", lon: 22, lat: 4 },
      { id: "continent-oceania", text: "Oceania", lon: 142, lat: -24 },
      { id: "continent-antarctica", text: "Antartida", lon: 0, lat: -78 }
    ],
    oceans: [
      { id: "ocean-atlantic", text: "Atlantico", lon: -28, lat: 5 },
      { id: "ocean-pacific", text: "Pacifico", lon: -155, lat: -3 },
      { id: "ocean-indian", text: "Indico", lon: 82, lat: -18 },
      { id: "ocean-arctic", text: "Artico", lon: 0, lat: 84 },
      { id: "ocean-southern", text: "Oceano Austral", lon: 40, lat: -58 }
    ]
  };

  const DEFAULT_STYLE = { color: "#184b74", weight: 1.8, fillColor: "#2a3f5f", fillOpacity: 0.1 };
  const COUNTRY_HIGHLIGHT_STYLE = { color: "#c9eeff", weight: 3.4, fillColor: "#49b3ff", fillOpacity: 0.28 };
  const CONTINENT_HIGHLIGHT_STYLE = { color: "#f0ffb8", weight: 3.2, fillColor: "#8ddb48", fillOpacity: 0.3 };
  const RELIGION_HIGHLIGHT_STYLE = { color: "#ffd2d2", weight: 3.2, fillColor: "#ff6464", fillOpacity: 0.3 };

  const THEME_STYLES = {
    continent: {
      America: "#8ecae6",
      Europe: "#ffb703",
      Asia: "#fb8500",
      Africa: "#90be6d",
      Oceania: "#b388eb",
      Antarctica: "#adb5bd",
      Unknown: "#6c757d"
    },
    religion: {
      cristianismo: "#60a5fa",
      islam: "#f28482",
      hinduismo: "#f6bd60",
      budismo: "#84a59d",
      judaismo: "#cdb4db",
      sijismo: "#ffd166",
      sintoismo: "#43aa8b",
      zoroastrismo: "#bc6c25",
      animismo: "#6a994e",
      "no afiliados": "#8d99ae",
      vudu: "#b56576",
      otras: "#8ecae6"
    },
    politics: {
      presidencialismo: "#577590",
      semipresidencialismo: "#4cc9f0",
      parlamentarismo: "#a8dadc",
      teocracia: "#f3722c",
      monarquia_constitucional: "#ffd166",
      monarquia_absoluta: "#f94144",
      otros: "#7b8ea8"
    },
    historyType: {
      independencia: "#3a86ff",
      union: "#8338ec",
      "disolucion de otro estado": "#ff006e",
      revolucion: "#fb5607",
      "guerra civil": "#ef476f",
      "legal y pacifica": "#06d6a0",
      otros: "#8d99ae"
    },
    exportBreadth: [
      { min: 12, color: "#14213d", label: "12 sectores o mas" },
      { min: 8, color: "#1d3557", label: "8 a 11 sectores" },
      { min: 5, color: "#457b9d", label: "5 a 7 sectores" },
      { min: 3, color: "#7fb3d5", label: "3 a 4 sectores" },
      { min: 1, color: "#bde0fe", label: "1 a 2 sectores" },
      { min: 0, color: "#e9f5ff", label: "Sin datos" }
    ],
    industryBreadth: [
      { min: 12, color: "#283618", label: "12 ramas o mas" },
      { min: 8, color: "#4f772d", label: "8 a 11 ramas" },
      { min: 5, color: "#7aa95c", label: "5 a 7 ramas" },
      { min: 3, color: "#a7c957", label: "3 a 4 ramas" },
      { min: 1, color: "#d4e09b", label: "1 a 2 ramas" },
      { min: 0, color: "#eef5d2", label: "Sin datos" }
    ],
    capitalShare: [
      { min: 30, color: "#4a0d67", label: "30% o mas" },
      { min: 20, color: "#7b2cbf", label: "20% a 29,9%" },
      { min: 10, color: "#9d4edd", label: "10% a 19,9%" },
      { min: 5, color: "#c77dff", label: "5% a 9,9%" },
      { min: 1, color: "#e0aaff", label: "1% a 4,9%" },
      { min: 0, color: "#f5e9ff", label: "Sin datos" }
    ],
    population: [
      { min: 200000000, color: "#081c15", label: "200 M o mas" },
      { min: 100000000, color: "#1b4332", label: "100 M a 199,9 M" },
      { min: 50000000, color: "#2d6a4f", label: "50 M a 99,9 M" },
      { min: 10000000, color: "#40916c", label: "10 M a 49,9 M" },
      { min: 1000000, color: "#74c69d", label: "1 M a 9,9 M" },
      { min: 0, color: "#b7e4c7", label: "Menos de 1 M" }
    ],
    gdp: [
      { min: 5000000000000, color: "#081c15", label: "US$ 5 B o mas" },
      { min: 1000000000000, color: "#1b4332", label: "US$ 1 B a 4,9 B" },
      { min: 250000000000, color: "#2d6a4f", label: "US$ 250 mil M a 999 mil M" },
      { min: 50000000000, color: "#40916c", label: "US$ 50 mil M a 249 mil M" },
      { min: 10000000000, color: "#74c69d", label: "US$ 10 mil M a 49 mil M" },
      { min: 0, color: "#b7e4c7", label: "Menos de US$ 10 mil M" }
    ],
    gdpPerCapita: [
      { min: 60000, color: "#03045e", label: "US$ 60.000 o mas" },
      { min: 30000, color: "#0077b6", label: "US$ 30.000 a 59.999" },
      { min: 15000, color: "#00b4d8", label: "US$ 15.000 a 29.999" },
      { min: 5000, color: "#48cae4", label: "US$ 5.000 a 14.999" },
      { min: 1000, color: "#90e0ef", label: "US$ 1.000 a 4.999" },
      { min: 0, color: "#caf0f8", label: "Menos de US$ 1.000" }
    ],
    inflation: [
      { min: 100, color: "#7f0000", label: "100% o mas" },
      { min: 20, color: "#c1121f", label: "20% a 99,9%" },
      { min: 10, color: "#e85d04", label: "10% a 19,9%" },
      { min: 5, color: "#f48c06", label: "5% a 9,9%" },
      { min: 0, color: "#ffba08", label: "0% a 4,9%" },
      { min: -1000, color: "#adb5bd", label: "Deflacion" }
    ],
    militaryActive: [
      { min: 1000000, color: "#3d0c02", label: "1 M o mas" },
      { min: 500000, color: "#7f1d1d", label: "500 mil a 999 mil" },
      { min: 250000, color: "#b91c1c", label: "250 mil a 499 mil" },
      { min: 100000, color: "#dc2626", label: "100 mil a 249 mil" },
      { min: 10000, color: "#f87171", label: "10 mil a 99 mil" },
      { min: 0, color: "#fecaca", label: "Menos de 10 mil" }
    ],
    formationYear: [
      { min: 2000, color: "#5f0f40", label: "2000 en adelante" },
      { min: 1950, color: "#9a031e", label: "1950 a 1999" },
      { min: 1900, color: "#fb8b24", label: "1900 a 1949" },
      { min: 1800, color: "#e36414", label: "1800 a 1899" },
      { min: 1500, color: "#0f4c5c", label: "1500 a 1799" },
      { min: 0, color: "#6c757d", label: "Antes de 1500" }
    ],
    conflicts: [
      { min: 80, color: "#4a0404", label: "80 o mas" },
      { min: 40, color: "#7f1d1d", label: "40 a 79" },
      { min: 20, color: "#b91c1c", label: "20 a 39" },
      { min: 10, color: "#dc2626", label: "10 a 19" },
      { min: 1, color: "#f87171", label: "1 a 9" },
      { min: 0, color: "#fecaca", label: "Sin conflictos" }
    ],
    organizations: [
      { min: 40, color: "#1d3557", label: "40 o mas" },
      { min: 25, color: "#2a6f97", label: "25 a 39" },
      { min: 15, color: "#468faf", label: "15 a 24" },
      { min: 8, color: "#61a5c2", label: "8 a 14" },
      { min: 1, color: "#89c2d9", label: "1 a 7" },
      { min: 0, color: "#d9ed92", label: "Sin organizaciones" }
    ],
    rivals: [
      { min: 20, color: "#6a040f", label: "20 o mas" },
      { min: 10, color: "#9d0208", label: "10 a 19" },
      { min: 5, color: "#d00000", label: "5 a 9" },
      { min: 2, color: "#dc2f02", label: "2 a 4" },
      { min: 1, color: "#f48c06", label: "1" },
      { min: 0, color: "#ffd6a5", label: "Sin rivales" }
    ],
    religionDiversity: [
      { min: 8, color: "#3a0ca3", label: "8 o mas grupos" },
      { min: 6, color: "#7209b7", label: "6 a 7 grupos" },
      { min: 4, color: "#b5179e", label: "4 a 5 grupos" },
      { min: 2, color: "#f72585", label: "2 a 3 grupos" },
      { min: 1, color: "#ff99c8", label: "1 grupo" },
      { min: 0, color: "#ffc8dd", label: "Sin datos" }
    ],
    religionBranch: {
      cristianismo: "#60a5fa",
      islam: "#f28482",
      hinduismo: "#f6bd60",
      budismo: "#84a59d",
      judaismo: "#cdb4db",
      noafiliados: "#8d99ae",
      otras: "#8ecae6"
    },
    exMetropole: {
      "Reino Unido": "#4cc9f0",
      Francia: "#577590",
      Espana: "#ffb703",
      Portugal: "#f3722c",
      "Paises Bajos": "#fb8500",
      "Estados Unidos": "#8d99ae",
      "Sin datos": "#6c757d"
    },
    bloc: {
      OTAN: "#1d3557",
      "Union Europea": "#ffb703",
      Mercosur: "#2a9d8f",
      ASEAN: "#e76f51",
      Commonwealth: "#8ecae6",
      BRICS: "#6a994e",
      ONU: "#adb5bd",
      Otros: "#7b8ea8"
    }
  };

  const THEME_PROXY_KEYS = new Set([
    "urbanization",
    "lifeExpectancy",
    "gdpPpp",
    "inflationHistory",
    "unemployment",
    "debt",
    "militarySpending",
    "exportVolume",
    "naturalResources",
    "geopoliticalIndex"
  ]);

  window.GeoRiskTheme = {
    MAP_LABEL_SETS,
    DEFAULT_STYLE,
    COUNTRY_HIGHLIGHT_STYLE,
    CONTINENT_HIGHLIGHT_STYLE,
    RELIGION_HIGHLIGHT_STYLE,
    THEME_STYLES,
    THEME_PROXY_KEYS
  };
})();
