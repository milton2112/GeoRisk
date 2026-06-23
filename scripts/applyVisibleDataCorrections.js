import fs from "fs-extra";
import path from "node:path";

const projectRoot = path.resolve(process.cwd());
const fullPath = path.join(projectRoot, "data", "countries_full.json");
const countriesDir = path.join(projectRoot, "data", "countries");
const replacements = new Map([
  ["estado of Bahrain", "Protectorado británico de Baréin"],
  ["Cameroon", "Camerún francés"],
  ["People's Revolutionary república of Guinea", "Guinea Francesa"],
  ["Third Hellenic república", "Imperio otomano"],
  ["mancomunidad realm of Malawi", "Nyasalandia"],
  ["federación of Nigeria", "Federación de Nigeria"],
  ["Slovak república", "Checoslovaquia"],
  ["república of South Africa (1961—1994)", "Colonia del Cabo, Natal, Transvaal y Colonia del Río Orange"],
  ["British Swaziland", "Suazilandia británica"],
  ["Organizacion for Cooperation of Railways", "Organización para la Cooperación de los Ferrocarriles"],
  ["Organización for Cooperation of Railways", "Organización para la Cooperación de los Ferrocarriles"],
  ["The Technical Cooperation Program", "Programa de Cooperación Técnica"],
  ["Strategic Airlift Capability", "Capacidad de Transporte Aéreo Estratégico"],
  ["Caribbean Free Comercio Asociacion", "Asociación de Libre Comercio del Caribe"],
  ["Comunidad of Sahel-Saharan States", "Comunidad de Estados Sahelo-Saharianos"],
  ["Commission for the Conservation of Southern Bluefin Tuna", "Comisión para la Conservación del Atún Rojo del Sur"],
  ["Lake Chad Basin Commission", "Comisión de la Cuenca del Lago Chad"],
  ["Second Cambodia Civil", "Segunda guerra civil camboyana"],
  ["Vietnam Counteroffensive Phase II", "Contraofensiva de Vietnam - fase II"],
  ["Vietnam Counteroffensive Phase III", "Contraofensiva de Vietnam - fase III"],
  ["Northern France Campana", "Campaña del norte de Francia"],
  ["Batalla de Phase Line Bullet", "Batalla de la línea Bullet"],
  ["First Chad (FROLINAT) Rebellion", "Primera rebelión de Chad (FROLINAT)"],
  ["WIEN", "Viena"],
  ["Alho Skirmish", "Escaramuza de Alho"],
  ["Swirling Clash", "Choque de Swirling"],
  ["Felsőőri Skirmish", "Escaramuza de Felsőőr"],
  ["First skirmish at Ágfalva", "Primera escaramuza de Ágfalva"],
  ["Karácsfa Skirmish", "Escaramuza de Karácsfa"],
  ["Mosonbánfalvi Skirmish", "Escaramuza de Mosonbánfalva"],
  ["Pinkafői Skirmish", "Escaramuza de Pinkafő"],
  ["Internacional Conmemoracion del Holocausto Alianza", "Alianza Internacional para la Memoria del Holocausto"],
  ["Internacional Energy Forum", "Foro Internacional de Energia"],
  ["espacio Schengen", "Espacio Schengen"],
  ["Q4264", "Mercosur"]
]);

function replaceVisibleStrings(value) {
  if (typeof value === "string") return replacements.get(value) || value;
  if (Array.isArray(value)) return value.map(replaceVisibleStrings).filter(item => item !== null);
  if (!value || typeof value !== "object") return value;
  if (typeof value.name === "string" && /^Q\d+$/i.test(value.name)) {
    const abbreviation = typeof value.abbreviation === "string" && !/^Q\d+$/i.test(value.abbreviation)
      ? value.abbreviation
      : "";
    return abbreviation ? replaceVisibleStrings({ ...value, name: abbreviation }) : null;
  }
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, replaceVisibleStrings(item)]));
}

async function updateJson(filePath) {
  const current = await fs.readJson(filePath);
  const updated = replaceVisibleStrings(current);
  if (JSON.stringify(current) === JSON.stringify(updated)) return false;
  await fs.writeJson(filePath, updated, { spaces: 0 });
  return true;
}

let updatedFiles = Number(await updateJson(fullPath));
for (const fileName of (await fs.readdir(countriesDir)).filter(file => file.endsWith(".json"))) {
  updatedFiles += Number(await updateJson(path.join(countriesDir, fileName)));
}

console.log(`Correcciones visibles aplicadas: ${updatedFiles} archivos`);
