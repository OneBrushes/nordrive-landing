// Huecos de publicidad del blog (pensados para Google AdSense).
//
// Mientras ADSENSE_CLIENT esté vacío no se muestra ningún anuncio ni se carga ningún script.
// Para activarlos más adelante:
//   1. En AdSense, copia tu id de editor ("ca-pub-1234567890123456") en ADSENSE_CLIENT.
//   2. Crea un bloque de anuncios "Display" adaptable por cada hueco de abajo y pega su
//      "data-ad-slot" (solo números) en el hueco correspondiente.
//      Un hueco con el id vacío sigue sin mostrarse, así que puedes activarlos de uno en uno.
//   3. Añade public/ads.txt con la línea que te da AdSense ("google.com, pub-…, DIRECT, f08c47fec0942fa0").
//
// Para ver dónde caen los huecos sin anuncios reales, abre cualquier página del blog con ?anuncios=1
// (p. ej. /blog/mi-articulo/?anuncios=1): se dibuja un recuadro discontinuo con el nombre del hueco.

export const ADSENSE_CLIENT = ""

export type AdSlotName = "articleTop" | "articleMiddle" | "articleBottom" | "sidebar" | "listInFeed"

export const AD_SLOTS: Record<AdSlotName, string> = {
  /** Artículo: después de la introducción (tras el 2.º párrafo) */
  articleTop: "",
  /** Artículo: hacia la mitad, antes del apartado (##) más cercano al centro */
  articleMiddle: "",
  /** Artículo: al final del texto, antes de los artículos relacionados */
  articleBottom: "",
  /** Artículo (escritorio): barra lateral fija, debajo del índice */
  sidebar: "",
  /** Índice y categorías del blog: dentro de la rejilla, tras la 6.ª tarjeta */
  listInFeed: "",
}

/** Tamaño recomendado (se muestra en la vista previa) y alto mínimo reservado para no mover el contenido */
export const AD_SLOT_INFO: Record<AdSlotName, { size: string; minHeight: number }> = {
  articleTop: { size: "Adaptable · 728×90 / 336×280", minHeight: 280 },
  articleMiddle: { size: "Adaptable · 728×90 / 336×280", minHeight: 280 },
  articleBottom: { size: "Adaptable · 728×90 / 336×280", minHeight: 280 },
  sidebar: { size: "300×250 / 300×600", minHeight: 250 },
  listInFeed: { size: "In-feed adaptable · ancho completo", minHeight: 200 },
}

export function isAdSlotConfigured(name: AdSlotName) {
  return Boolean(ADSENSE_CLIENT && AD_SLOTS[name])
}
