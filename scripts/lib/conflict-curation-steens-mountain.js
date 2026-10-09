const name = "Batalla de Steens Mountain (1867)";
const parent = "Guerra Snake (1864-1868)";
const region = "Steens Mountain, localizacion habitual en el sureste de Oregon, oeste de Estados Unidos; emplazamiento exacto no consolidado";

export const STEENS_MOUNTAIN_CONFLICT_RENAMES = {
  "Batalla de Steen's Mountain": name,
  "Battle of Steen's Mountain": name
};

export const STEENS_MOUNTAIN_CONFLICT_DETAIL_FIXES = {
  [name]: {
    parent, war: parent, campaign: "Campana de invierno estadounidense de 1866-1867", related: [parent],
    startYear: 1867, endYear: 1867,
    datePrecision: "29 de enero de 1867, segun el registro regimental retrospectivo",
    type: "batalla", conflictType: "colonial", scale: "local",
    status: "historico", active: false, ongoing: false,
    region, normalizedRegion: region,
    cause: "La expansion de minas, caminos y asentamientos estadounidenses sobre territorios indigenas intensifico la Guerra Snake. La operacion se inscribe en la campana militar de invierno; no se acredita que el grupo atacado hubiera participado en una incursion concreta.",
    outcome: "El registro de Wainwright describe un ataque de la Compania M a un grupo de unos 90 combatientes y numerosas muertes y capturas. Es un relato militar retrospectivo, sin corroboracion independiente de esas cifras en las fuentes consultadas.",
    consequences: "La campana estadounidense y la resistencia indigena continuaron durante 1867 y 1868. Este encuentro no equivale al final de la guerra ni a un tratado.",
    participants: [
      {
        side: "Ejercito de Estados Unidos",
        members: ["Compania M del 1.er Regimiento de Caballeria de Estados Unidos"],
        casualties: "Sin balance consolidado para este encuentro en las fuentes consultadas; no equivale a cero"
      },
      {
        side: "Paiutes del norte, identificacion enciclopedica del grupo atacado",
        members: ["Grupo paiute local, sin mando individual consolidado"],
        casualties: "Wainwright registra 60 muertos y 27 capturados: cifras atribuidas al parte militar retrospectivo, no a un recuento independiente ni bilateral completo"
      }
    ],
    chronology: [
      { year: 1866, event: "Crook inicio la campana de invierno en diciembre; contexto regional descrito por la Idaho State Historical Society." },
      { year: 1867, event: "Wainwright registra el encuentro de la Compania M en Stein's Mountain el 29 de enero." },
      { year: 1868, event: "La guerra regional continuo hasta 1868, mas alla de esta accion." }
    ],
    treaties: [], hierarchyConfidence: "media",
    hierarchySources: [
      { label: "R. P. P. Wainwright, First Regiment of Cavalry, p. 165, U.S. Army Center of Military History: registro militar retrospectivo de fecha, unidad y cifras atribuidas", url: "https://history.army.mil/books/R%26H/R%26H-1CV.htm" },
      { label: "Idaho State Historical Society, Reference Series 236, The Snake War, 1864-1868 (1966): contexto regional y campana, no prueba independiente del encuentro del 29 de enero", url: "https://history.idaho.gov/wp-content/uploads/0236.pdf" },
      { label: "Wikipedia, Battle of Steen's Mountain: identificacion enciclopedica de lugar y grupo paiute; no fuente primaria independiente", url: "https://en.wikipedia.org/wiki/Battle_of_Steen%27s_Mountain" }
    ],
    sourceDispute: "Wainwright escribe Stein's Mountain, I. T.; la ficha enciclopedica situa el episodio en Oregon. La discrepancia geografica no se resuelve con estas fuentes: se conserva la localizacion habitual sin fijar coordenadas ni equiparar I. T. con Oregon.",
    curationPriority: "alta", curationBatch: "source-backed-steens-mountain-2026-10",
    curationStatus: "estructural", dataConfidence: "parcial",
    curationNote: "No se acredita la presencia personal de Crook o Paulina en este encuentro. La campana es descriptiva; no se identifica con el ataque de enero cerca de Owyhee Ferry descrito por la sociedad historica. No se consultaron los partes originales ni testimonios paiutes; las cifras militares no son un balance consensuado. Se conservan incertidumbres de localizacion, mando y bajas estadounidenses. La etiqueta Snake es historica y no designa un unico pueblo homogeneo."
  }
};
