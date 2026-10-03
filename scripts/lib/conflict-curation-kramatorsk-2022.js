const NAME = "Ataque a la estaci\u00f3n de Kramatorsk (2022)";
const PARENT = "Invasi\u00f3n rusa de Ucrania de 2022";

export const KRAMATORSK_2022_CONFLICT_RENAMES = {
  "Bombardeo de la estaci\u00f3n de tren de Kramatorsk": NAME,
  "Bombardeo de la estacion de tren de Kramatorsk": NAME,
  "Kramatorsk railway station attack": NAME
};

export const KRAMATORSK_2022_COUNTRY_CONFLICT_ADDITIONS = {
  Rusia: [NAME],
  Ucrania: [NAME]
};

export const KRAMATORSK_2022_CONFLICT_DETAIL_FIXES = {
  [NAME]: {
    parent: PARENT, war: PARENT, campaign: "Ofensiva en el Donb\u00e1s (2022)", related: [PARENT],
    startYear: 2022, endYear: 2022, datePrecision: "8 de abril de 2022",
    type: "bombardeo", conflictType: "interestatal", scale: "local",
    status: "historico", active: false, ongoing: false,
    region: "Estaci\u00f3n ferroviaria de Kramatorsk, regi\u00f3n de Donetsk, Ucrania, Europa oriental",
    normalizedRegion: "Estaci\u00f3n ferroviaria de Kramatorsk, regi\u00f3n de Donetsk, Ucrania, Europa oriental",
    cause: "Durante la invasi\u00f3n rusa, la estaci\u00f3n funcionaba como centro de evacuaci\u00f3n de civiles del Donb\u00e1s. Este contexto no demuestra un objetivo militar ni una motivaci\u00f3n individual del ataque.",
    outcome: "Un misil Tochka-U con submuniciones de racimo alcanz\u00f3 la estaci\u00f3n y caus\u00f3 numerosas v\u00edctimas civiles. No se describe como una batalla ganada ni como un cambio de control territorial.",
    consequences: "Personas que esperaban evacuar y personal de apoyo fueron alcanzados. Las investigaciones de OHCHR y HRW/SITU documentan el da\u00f1o civil; la ficha no presenta una sentencia judicial ni un cierre de la guerra.",
    participants: [
      {
        side: "Fuerzas rusas: atribuci\u00f3n de HRW/SITU",
        members: ["Rusia", "Fuerzas Armadas rusas, seg\u00fan la investigaci\u00f3n de HRW y SITU Research"],
        casualties: "Sin recuento documentado de bajas de esa fuerza para este episodio; no equivale a cero"
      },
      {
        side: "Civiles en evacuaci\u00f3n en Ucrania",
        members: ["Civiles en la estaci\u00f3n de Kramatorsk", "Personas evacuadas y personal de apoyo"],
        casualties: "OHCHR (septiembre de 2022): 60 civiles muertos y 111 heridos. HRW/SITU (febrero de 2023): al menos 58 civiles muertos y m\u00e1s de 100 heridos. Son recuentos distintos, no cifras que deban sumarse"
      }
    ],
    chronology: [
      { year: 2022, event: "El 8 de abril, el ataque con submuniciones alcanz\u00f3 a civiles que esperaban trenes de evacuaci\u00f3n en Kramatorsk." }
    ],
    treaties: [], hierarchyConfidence: "alta",
    hierarchySources: [
      { label: "OHCHR, informe 1 de febrero-31 de julio de 2022, publicado en septiembre, p. 7, p\u00e1rrafo 24: fecha, lugar y recuento de v\u00edctimas", url: "https://ukraine.un.org/sites/default/files/2022-09/ReportUkraine-1Feb-31Jul2022-en.pdf" },
      { label: "Human Rights Watch y SITU Research, Death at the Station (21 de febrero de 2023): investigaci\u00f3n del ataque, atribuci\u00f3n y recuento independiente", url: "https://www.hrw.org/video-photos/interactive/2023/02/21/death-at-the-station/russian-cluster-munition-attack-in-kramatorsk" }
    ],
    sourceDispute: "HRW/SITU atribuye el ataque a fuerzas rusas y recoge la negaci\u00f3n rusa. Su recuento no coincide con el de OHCHR; se conservan ambos con sus fechas y sin un total fusionado.",
    curationPriority: "alta", curationBatch: "source-backed-kramatorsk-2022-2026-10",
    curationStatus: "estructural", dataConfidence: "parcial",
    curationNote: "La campa\u00f1a es una agrupaci\u00f3n descriptiva. Ucrania se vincula por el lugar y las v\u00edctimas, no como un segundo bando militar en la estaci\u00f3n. No se confunde con los ataques a otros lugares de Kramatorsk en 2023, no se inventa un tratado y no se fija una unidad lanzadora concreta. Historico describe este episodio del 8 de abril, no el estado actual de la guerra madre."
  }
};
