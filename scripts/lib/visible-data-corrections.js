const TECHNICAL_IDENTIFIER_RE = /^Q\d+$/i;

export const visibleStringReplacements = new Map([
  ["estado of Bahrain", "Protectorado británico de Baréin"],
  ["Protectorado britanico de Barein", "Protectorado británico de Baréin"],
  ["Cameroon", "Camerún francés"],
  ["Camerun frances", "Camerún francés"],
  ["People's Revolutionary república of Guinea", "Guinea Francesa"],
  ["Third Hellenic república", "Imperio otomano"],
  ["mancomunidad realm of Malawi", "Nyasalandia"],
  ["federación of Nigeria", "Federación de Nigeria"],
  ["Federacion de Nigeria", "Federación de Nigeria"],
  ["Slovak república", "Checoslovaquia"],
  ["república of South Africa (1961—1994)", "Colonia del Cabo, Natal, Transvaal y Colonia del Río Orange"],
  ["republica of South Africa (1961-1994)", "Colonia del Cabo, Natal, Transvaal y Colonia del Río Orange"],
  ["Colonia del Cabo, Natal, Transvaal y Colonia del Rio Orange", "Colonia del Cabo, Natal, Transvaal y Colonia del Río Orange"],
  ["British Swaziland", "Suazilandia británica"],
  ["Suazilandia britanica", "Suazilandia británica"],
  ["Organizacion for Cooperation of Railways", "Organización para la Cooperación de los Ferrocarriles"],
  ["Organización for Cooperation of Railways", "Organización para la Cooperación de los Ferrocarriles"],
  ["Organizacion para la Cooperacion de los Ferrocarriles", "Organización para la Cooperación de los Ferrocarriles"],
  ["The Technical Cooperation Program", "Programa de Cooperación Técnica"],
  ["Programa de Cooperacion Tecnica", "Programa de Cooperación Técnica"],
  ["Strategic Airlift Capability", "Capacidad de Transporte Aéreo Estratégico"],
  ["Capacidad de Transporte Aereo Estrategico", "Capacidad de Transporte Aéreo Estratégico"],
  ["Caribbean Free Comercio Asociacion", "Asociación de Libre Comercio del Caribe"],
  ["Asociacion de Libre Comercio del Caribe", "Asociación de Libre Comercio del Caribe"],
  ["Comunidad of Sahel-Saharan States", "Comunidad de Estados Sahelo-Saharianos"],
  ["Commission for the Conservation of Southern Bluefin Tuna", "Comisión para la Conservación del Atún Rojo del Sur"],
  ["Comision para la Conservacion del Atun Rojo del Sur", "Comisión para la Conservación del Atún Rojo del Sur"],
  ["Lake Chad Basin Commission", "Comisión de la Cuenca del Lago Chad"],
  ["Comision de la Cuenca del Lago Chad", "Comisión de la Cuenca del Lago Chad"],
  ["Second Cambodia Civil", "Segunda guerra civil camboyana"],
  ["Vietnam Counteroffensive Phase II", "Contraofensiva de Vietnam - fase II"],
  ["Vietnam Counteroffensive Phase III", "Contraofensiva de Vietnam - fase III"],
  ["Northern France Campana", "Campaña del norte de Francia"],
  ["Campana del norte de Francia", "Campaña del norte de Francia"],
  ["Batalla de Phase Line Bullet", "Batalla de la línea Bullet"],
  ["Batalla de la linea Bullet", "Batalla de la línea Bullet"],
  ["First Chad (FROLINAT) Rebellion", "Primera rebelión de Chad (FROLINAT)"],
  ["Primera rebelion de Chad (FROLINAT)", "Primera rebelión de Chad (FROLINAT)"],
  ["WIEN", "Viena"],
  ["PRAHA", "Praga"],
  ["KOBENHAVN", "Copenhague"],
  ["ATHINAI", "Atenas"],
  ["CUIDAD DE GUATEMALA", "Ciudad de Guatemala"],
  ["D.B. KUALA LUMPUR", "Kuala Lumpur"],
  ["ULAANBAATAR", "Ulán Bator"],
  ["Ulan Bator", "Ulán Bator"],
  ["NAY PYI TAW", "Naipyidó"],
  ["Naipyido", "Naipyidó"],
  ["BUCURESTI", "Bucarest"],
  ["COLOMBO", "Colombo"],
  ["Alho Skirmish", "Escaramuza de Alho"],
  ["Swirling Clash", "Choque de Swirling"],
  ["Felsőőri Skirmish", "Escaramuza de Felsőőr"],
  ["First skirmish at Ágfalva", "Primera escaramuza de Ágfalva"],
  ["Karácsfa Skirmish", "Escaramuza de Karácsfa"],
  ["Mosonbánfalvi Skirmish", "Escaramuza de Mosonbánfalva"],
  ["Pinkafői Skirmish", "Escaramuza de Pinkafő"],
  ["Internacional Conmemoracion del Holocausto Alianza", "Alianza Internacional para la Memoria del Holocausto"],
  ["Internacional Energy Forum", "Foro Internacional de Energía"],
  ["Foro Internacional de Energia", "Foro Internacional de Energía"],
  ["espacio Schengen", "Espacio Schengen"],
  ["ABCANZ Armies", "Ej\u00e9rcitos ABCANZ"],
  ["Air Force Interoperability Consejo", "Consejo de Interoperabilidad de Fuerzas A\u00e9reas"],
  ["ASEAN Regional Forum", "Foro Regional de la ASEAN"],
  ["Combined Communications-Electronics Board", "Junta Combinada de Comunicaciones y Electr\u00f3nica"],
  ["Multinational Joint Task Force", "Fuerza Multinacional Conjunta"],
  ["Commonwealth", "Mancomunidad de Naciones"],
  ["Francofonia", "Francofon\u00eda"],
  ["OIC", "OCI"],
  ["Alianza del Pacifico", "Alianza del Pac\u00edfico"],
  ["Tratado Antartico", "Tratado Ant\u00e1rtico"],
  ["Sistema del Tratado Antartico", "Sistema del Tratado Ant\u00e1rtico"],
  ["Organizacion de las Naciones Unidas", "Organizaci\u00f3n de las Naciones Unidas"],
  ["Organizacion de los Estados Americanos", "Organizaci\u00f3n de los Estados Americanos"],
  ["Organizacion de Paises Exportadores de Petroleo", "Organizaci\u00f3n de Pa\u00edses Exportadores de Petr\u00f3leo"],
  ["Fondo Monetario Internacional", "Fondo Monetario Internacional"],
  ["Union Africana", "Uni\u00f3n Africana"],
  ["Q4264", "Mercosur"],
  ["Catolicos", "Cat\u00f3licos"],
  ["Catolicos orientales", "Cat\u00f3licos orientales"],
  ["Catolicas", "Cat\u00f3licas"],
  ["Catolico", "Cat\u00f3lico"],
  ["Cristianos protestantes", "Protestantes y evang\u00e9licos"],
  ["Cristianos evangelicos", "Protestantes y evang\u00e9licos"],
  ["Cristianos evang\u00e9licos", "Protestantes y evang\u00e9licos"],
  ["Cristianismo protestante", "Protestantes y evang\u00e9licos"],
  ["Protestantismo", "Protestantes y evang\u00e9licos"],
  ["Protestantes", "Protestantes y evang\u00e9licos"],
  ["Protestantes y evangelicos", "Protestantes y evang\u00e9licos"],
  ["Evangelicos", "Protestantes y evang\u00e9licos"],
  ["Evang\u00e9licos", "Protestantes y evang\u00e9licos"],
  ["Otros cristianos", "Otras denominaciones cristianas"],
  ["Hindues", "Hind\u00faes"],
  ["Hindu", "Hind\u00fa"],
  ["Judaismo", "Juda\u00edsmo"],
  ["Judios", "Jud\u00edos"],
  ["Judio", "Jud\u00edo"],
  ["Sintoismo", "Sinto\u00edsmo"],
  ["Sintoistas", "Sinto\u00edstas"],
  ["Zoroastros", "Zoroastrianos"],
  ["Musulmanes alevies", "Musulmanes alev\u00edes"],
  ["No afiliados / ateos / agnosticos", "Ateos / agn\u00f3sticos / sin afiliaci\u00f3n"],
  ["Ateos / agnosticos / sin afiliacion", "Ateos / agn\u00f3sticos / sin afiliaci\u00f3n"],
  ["Sin afiliacion religiosa", "Sin afiliaci\u00f3n religiosa"],
  ["Sin religion predominante", "Sin religi\u00f3n predominante"],
  ["Sin religion dominante", "Sin religi\u00f3n dominante"],
  ["Sin religion", "Sin religi\u00f3n"],
  ["Sin poblacion permanente", "Sin poblaci\u00f3n permanente"],
  ["Religion tradicional china", "Religi\u00f3n tradicional china"],
  ["Religiones populares", "Religiones animistas y populares"],
  ["Islam (Suni)", "Islam (sunismo)"],
  ["Islam (Sunismo)", "Islam (sunismo)"],
  ["Islam (Sun\u00ed)", "Islam (sunismo)"],
  ["Islam (Chii)", "Islam (chiismo)"],
  ["Islam (Chiismo)", "Islam (chiismo)"],
  ["Islam (Chi\u00ed)", "Islam (chiismo)"],
  ["Islam (Sunismo y Chiismo)", "Islam (sunismo y chiismo)"],
  ["Islam (Sun\u00ed - Wahabismo)", "Islam (sunismo wahab\u00ed)"],
  ["Cristianismo (Catolicismo)", "Cristianismo (catolicismo)"],
  ["Cristianismo (Catolicismo y Protestantismo)", "Cristianismo (catolicismo y protestantismo)"],
  ["Cristianismo (Protestantismo)", "Cristianismo (protestantismo)"],
  ["Cristianismo (Protestantismo/Catolicismo)", "Cristianismo (protestantismo y catolicismo)"],
  ["Cristianismo (Protestantismo y Catolicismo)", "Cristianismo (protestantismo y catolicismo)"],
  ["Cristianismo (Protestante)", "Cristianismo (protestantismo)"],
  ["Cristianismo (Ortodoxo)", "Cristianismo ortodoxo"],
  ["Cristianismo (Anglicanismo)", "Cristianismo anglicano"],
  ["Cristianismo (Anglicanismo y Evangelicalismo)", "Cristianismo anglicano y evang\u00e9lico"],
  ["Cristianismo (Anglicanismo y Protestantismo)", "Cristianismo anglicano y protestante"],
  ["Cristianismo (Luteranismo)", "Cristianismo luterano"],
  ["Cristianismo (Metodismo) e Hinduismo", "Cristianismo metodista e hinduismo"],
  ["Religiones animistas y populares y budismo", "Religiones tradicionales y budismo"]
]);

export function isTechnicalIdentifier(value) {
  return TECHNICAL_IDENTIFIER_RE.test(String(value || "").trim());
}

export function applyVisibleStringReplacements(value) {
  if (typeof value !== "string") {
    return value;
  }
  return visibleStringReplacements.get(value) || value;
}

function normalizeVisibleKey(value) {
  return String(value || "")
    .replace(/\s*\([^)]*\)\s*$/g, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

const canonicalOrganizationAbbreviations = new Map([
  ["organizacion de las naciones unidas", "ONU"],
  ["organizacion de los estados americanos", "OEA"],
  ["organizacion de paises exportadores de petroleo", "OPEP"],
  ["organizacion mundial de aduanas", "OMA"],
  ["organizacion mundial de la salud", "OMS"],
  ["organizacion mundial del comercio", "OMC"],
  ["organizacion meteorologica mundial", "OMM"],
  ["organizacion para la prohibicion de armas quimicas", "OPAQ"],
  ["organizacion del tratado del atlantico norte", "OTAN"],
  ["otan", "OTAN"],
  ["agencia internacional de energia atomica", "OIEA"],
  ["fondo monetario internacional", "FMI"],
  ["banco internacional de reconstruccion y fomento", "BIRF"],
  ["union internacional de telecomunicaciones", "UIT"],
  ["union europea", "UE"],
  ["union africana", "UA"],
  ["organismo multilateral de garantia de inversiones", "OMGI"],
  ["tratado de no proliferacion nuclear", "TNP"],
  ["asociacion internacional de fomento", "AIF"],
  ["centro internacional de arreglo de diferencias relativas a inversiones", "CIADI"],
  ["organizacion hidrografica internacional", "OHI"],
  ["organizacion internacional de proteccion civil", "OIPC"],
  ["organizacion para la cooperacion islamica", "OCI"],
  ["banco asiatico de desarrollo", "BAsD"],
  ["grupo de abastecedores nucleares", "GSN"],
  ["consejo de europa", "CdE"],
  ["organizacion para la cooperacion y el desarrollo economico", "OCDE"],
  ["regimen de control de tecnologia misilistica", "RCTM"],
  ["comunidad del caribe", "CARICOM"],
  ["foro regional de la asean", "ARF"]
]);

export function normalizeVisibleOrganizationEntry(value) {
  if (!value || typeof value !== "object") {
    return value;
  }
  if (typeof value.name !== "string" && typeof value.abbreviation !== "string") {
    return value;
  }

  const name = applyVisibleStringReplacements(value.name);
  const abbreviation = applyVisibleStringReplacements(value.abbreviation || "");
  const canonicalAbbreviation = canonicalOrganizationAbbreviations.get(normalizeVisibleKey(name));
  const normalized = {
    ...value,
    name
  };

  if (canonicalAbbreviation) {
    normalized.abbreviation = canonicalAbbreviation;
  } else if (abbreviation) {
    normalized.abbreviation = abbreviation;
  }

  return normalized;
}

function normalizeTechnicalNamedObject(value) {
  const replacedName = applyVisibleStringReplacements(value.name);
  if (typeof replacedName === "string" && !isTechnicalIdentifier(replacedName)) {
    return normalizeVisibleOrganizationEntry({ ...value, name: replacedName });
  }
  const abbreviation = applyVisibleStringReplacements(value.abbreviation || "");
  if (typeof abbreviation === "string" && abbreviation && !isTechnicalIdentifier(abbreviation)) {
    return normalizeVisibleOrganizationEntry({ ...value, name: abbreviation });
  }
  return null;
}

export function normalizeVisibleValue(value) {
  if (typeof value === "string") {
    const replaced = applyVisibleStringReplacements(value);
    return isTechnicalIdentifier(replaced) ? null : replaced;
  }
  if (Array.isArray(value)) {
    return value.map(normalizeVisibleValue).filter(item => item !== null);
  }
  if (!value || typeof value !== "object") {
    return value;
  }
  if (typeof value.name === "string" && isTechnicalIdentifier(applyVisibleStringReplacements(value.name))) {
    return normalizeTechnicalNamedObject(value);
  }
  const normalizedObject = normalizeVisibleOrganizationEntry(value);
  return Object.fromEntries(
    Object.entries(normalizedObject)
      .map(([key, item]) => [key, normalizeVisibleValue(item)])
      .filter(([, item]) => item !== null)
  );
}
