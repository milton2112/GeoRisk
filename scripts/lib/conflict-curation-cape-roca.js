const name = "Batalla del cabo de la Roca (1703)";
const parent = "Guerra de Sucesi\u00f3n Espa\u00f1ola";
const region = "Frente al cabo de la Roca, costa de Portugal, Atl\u00e1ntico nororiental";

export const CAPE_ROCA_CONFLICT_RENAMES = {
  "Batalla del cabo de la Roca": name,
  "Battle of Cap de la Roque": name,
  "Bataille du cap de la Roque": name
};

export const CAPE_ROCA_COUNTRY_CONFLICT_ADDITIONS = {
  "Reino de los Pa\u00edses Bajos": [name]
};

export const CAPE_ROCA_CONFLICT_DETAIL_FIXES = {
  [name]: {
    parent, war: parent, campaign: "Operaciones navales frente a Portugal (1703)", related: [parent],
    startYear: 1703, endYear: 1703, datePrecision: "22 de mayo de 1703",
    type: "combate naval", conflictType: "interestatal", scale: "local",
    status: "historico", active: false, ongoing: false,
    region, normalizedRegion: region,
    cause: "Una escuadra francesa intercept\u00f3 un convoy mercante protegido por buques neerlandeses que hab\u00eda salido de Lisboa y Set\u00fabal, durante la Guerra de Sucesi\u00f3n Espa\u00f1ola.",
    outcome: "Victoria t\u00e1ctica francesa sobre la escolta. El parte franc\u00e9s reproducido en 1929 relata la rendici\u00f3n de cinco buques neerlandeses, uno de ellos incendiado despu\u00e9s de evacuar su tripulaci\u00f3n; no significa cinco buques conservados como presas.",
    consequences: "Los mercantes se alejaron durante el combate. La derrota de la escolta no equivale a la captura de todo el convoy ni al final de la guerra.",
    participants: [
      { side: "Escuadra francesa", members: ["Francia", "Alain-Emmanuel de Co\u00ebtlogon"], casualties: "Sin total de bajas humanas consolidado en las fuentes consultadas; no equivale a cero" },
      { side: "Escolta neerlandesa", members: ["Rep\u00fablica de los Siete Pa\u00edses Bajos Unidos", "Roemer Vlacq"], casualties: "Sin total de bajas humanas consolidado en las fuentes consultadas; no equivale a cero" }
    ],
    chronology: [
      { year: 1703, event: "El 21 de mayo, el convoy sali\u00f3 de Lisboa y Set\u00fabal, seg\u00fan el parte franc\u00e9s reproducido en 1929." },
      { year: 1703, event: "El 22 de mayo, la escolta neerlandesa combati\u00f3 frente al cabo de la Roca mientras los mercantes se alejaban." },
      { year: 1703, event: "Tras la rendici\u00f3n de la escolta, el parte franc\u00e9s describe la retirada de tripulaciones y el incendio de uno de los buques tomados." }
    ],
    treaties: [], hierarchyConfidence: "alta",
    hierarchySources: [
      { label: "SHAB, Carn\u00e9-Tr\u00e9cesson, estudio de 1929 sobre Co\u00ebtlogon, pp. 137 y 139-141: contexto y reproducci\u00f3n de un parte franc\u00e9s de 1703; PDF consultado", url: "https://m.shabretagne.com/scripts/files/669a4e7b24acc4.27558973/1929_07.pdf" },
      { label: "Service historique de la D\u00e9fense, cat\u00e1logo GR 1 A 1706 (1703): acci\u00f3n entre Set\u00fabal y el Tajo; aviso indexado, originales no consultados", url: "https://www.servicehistorique.sga.defense.gouv.fr/ark/1146999" },
      { label: "Referencia enciclop\u00e9dica Battle of Cap de la Roque: nombre actual, Roemer Vlacq y contraste de fecha; no balance independiente de bajas", url: "https://en.wikipedia.org/wiki/Battle_of_Cap_de_la_Roque" }
    ],
    sourceDispute: "La reproducci\u00f3n de 1929 atribuye el relato a Archives nationales, B 4, Marine 25. Es un parte franc\u00e9s, no un recuento independiente de ambos bandos; no se consult\u00f3 el manuscrito original. El cat\u00e1logo resume cinco tomas, mientras el relato distingue un incendio posterior. Los efectivos del cuadro de buques no se convierten en muertos, heridos o prisioneros confirmados.",
    curationPriority: "alta", curationBatch: "source-backed-cape-roca-2026-10",
    curationStatus: "estructural", dataConfidence: "parcial",
    curationNote: "El enlace a Pa\u00edses Bajos representa a la rep\u00fablica hist\u00f3rica, no el Estado moderno como beligerante de 1703. La presencia de mercantes ingleses no acredita una escolta brit\u00e1nica. Portugal es la referencia geogr\u00e1fica, no un beligerante confirmado de este combate. La campa\u00f1a es una agrupaci\u00f3n editorial; no se verific\u00f3 un tratado de cierre propio ni una coordenada exacta."
  }
};
