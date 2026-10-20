export interface StudioProject {
  slug: string;
  name: string;
  premise: string;
  world: string;
  focus: string;
  conceptImage: string;
}

/** Original game concepts in development; partner access is handled privately. */
export const studioProjects: StudioProject[] = [
  {
    slug: "aura",
    name: "AURA",
    premise: "Un concepto de slot mitológico ambientado en un santuario ancestral, donde una esfera de obsidiana encierra una fuerza celeste.",
    world: "Piedra negra, oro, luz violeta y una escala monumental definen su lenguaje visual.",
    focus: "Un universo propio en el que el juego y la campaña se desarrollan de forma conjunta.",
    conceptImage: "/games/aura/aura-keyart.webp",
  },
  {
    slug: "obsidian-the-lost-vault",
    name: "Obsidian: The Lost Vault",
    premise: "Un concepto original de slot entre reliquias, una cámara sellada y la luz de un eclipse.",
    world: "Una ambientación arqueológica oscura, con una identidad visual precisa y la apertura de la cámara como eje narrativo.",
    focus: "Una propuesta que une la dirección del juego y su presentación cinematográfica.",
    conceptImage: "/games/obsidian-concept.webp",
  },
  {
    slug: "dead-air-channel-13",
    name: "Dead Air: Channel 13",
    premise: "Un concepto original de slot de terror: una emisión de madrugada interrumpida por una señal desconocida.",
    world: "Emisiones analógicas, monitores de tubo y una intensidad de terror configurable.",
    focus: "Una premisa reconocible que cuida la atmósfera, la legibilidad y los controles del jugador.",
    conceptImage: "/games/dead-air-concept.webp",
  },
];
