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
  ["Q4264", "Mercosur"]
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

function normalizeTechnicalNamedObject(value) {
  const replacedName = applyVisibleStringReplacements(value.name);
  if (typeof replacedName === "string" && !isTechnicalIdentifier(replacedName)) {
    return { ...value, name: replacedName };
  }
  const abbreviation = applyVisibleStringReplacements(value.abbreviation || "");
  if (typeof abbreviation === "string" && abbreviation && !isTechnicalIdentifier(abbreviation)) {
    return { ...value, name: abbreviation };
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
  return Object.fromEntries(
    Object.entries(value)
      .map(([key, item]) => [key, normalizeVisibleValue(item)])
      .filter(([, item]) => item !== null)
  );
}
