const name = "Batalla de Petaling";
const parent = "Revolución indonesia";
const location = "Petaling, Bangka, Indonesia";

export const PETALING_CONFLICT_DETAIL_FIXES = {
  [name]: {
    parent,
    war: parent,
    campaign: undefined,
    related: [parent],
    startYear: 1946,
    endYear: 1946,
    datePrecision: "14 de febrero de 1946, fecha atribuida por ANTARA al historiador local Akhmad Elvian",
    type: "batalla",
    conflictType: "independencia",
    scale: "local",
    status: "historico",
    active: false,
    ongoing: false,
    region: location,
    normalizedRegion: location,
    cause: "El Tentara Rakyat Indonesia (TRI) local intentó impedir el avance de fuerzas aliadas y de la NICA neerlandesa desde Mentok hacia Pangkalpinang, durante el retorno de la administración neerlandesa tras la derrota japonesa.",
    outcome: "La fuente local relata que el TRI se replegó y que las fuerzas aliadas/NICA continuaron hacia Pangkalpinang; no se fija un balance bilateral completo de bajas.",
    consequences: "El episodio quedó conmemorado en Bangka como Pahlawan 12; la crónica local sitúa la entrada de fuerzas aliadas/NICA en Pangkalpinang ese mismo día.",
    participants: [
      {
        side: "Tentara Rakyat Indonesia (TRI)",
        members: ["TRI de Belinyu", "TRI de Pangkalpinang"],
        casualties: "No se agrega una cifra total: la fuente local describe las bajas de Pahlawan 12, no un balance completo de los contactos de la jornada."
      },
      {
        side: "Fuerzas aliadas y NICA neerlandesa",
        members: ["South East Asia Command (SEAC)", "Netherlands Indies Civil Administration (NICA)"],
        casualties: "Sin balance completo de bajas en las fuentes consultadas."
      }
    ],
    chronology: [
      { year: 1946, event: "14 de febrero: combate entre el TRI y fuerzas aliadas/NICA en Petaling, Bangka." }
    ],
    treaties: [],
    hierarchyConfidence: "media",
    hierarchySources: [
      {
        label: "ANTARA News (Irwan Arfa), “Pahlawan 12”, 9 de noviembre de 2019: cita al historiador Akhmad Elvian para la fecha y describe los bandos en Petaling.",
        url: "https://www.antaranews.com/berita/1155268/pahlawan-12-patriotisme-warga-bangka-mempertahankan-kemerdekaan"
      },
      {
        label: "BabelPos (Dato’ Akhmad Elvian), “Sungailiat atau Sungaileat (Bagian Sebelas)”, 25 de agosto de 2025: cronología local de la ofensiva y la retirada del TRI.",
        url: "https://babelpos.bacakoran.co/history/read/18502/sungailiat-atau-sungaileat-bagian-sebelas"
      }
    ],
    sourceDispute: "La columna local describe varios contactos en Bangka el 14 de febrero de 1946; sus recuentos corresponden a episodios y grupos distintos. No se suman como balance total de la batalla.",
    curationPriority: "media",
    curationBatch: "source-backed-petaling-2026-10",
    curationStatus: "estructural",
    dataConfidence: "parcial",
    curationNote: "ANTARA atribuye la fecha a una reconstrucción del historiador Akhmad Elvian; la columna posterior de Elvian detalla SEAC/NICA y la retirada del TRI. Se enlaza al conflicto padre existente “Revolución indonesia” y se elimina la campaña regional generada por defecto. Las dos publicaciones no son partes contemporáneos; no se añaden bajas bilaterales ni un tratado."
  }
};
