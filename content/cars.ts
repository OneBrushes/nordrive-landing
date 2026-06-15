export type Car = {
  id: string
  name: string
  year: number
  km: number
  ourPrice: number
  spainPrice: number
  image: string // path inside public
}

// Puedes añadir, quitar o modificar los coches aquí de forma sencilla.
export const carsForSale: Car[] = [
  {
    id: "audi-a4",
    name: "Audi A4 Avant S-Line",
    year: 2019,
    km: 78000,
    ourPrice: 24900,
    spainPrice: 31200,
    image: "/client-with-audi.jpg"
  },
  {
    id: "bmw-3series",
    name: "BMW Serie 3 320d",
    year: 2020,
    km: 64000,
    ourPrice: 28500,
    spainPrice: 34900,
    image: "/client-with-bmw.jpg"
  },
  {
    id: "mercedes-cclass",
    name: "Mercedes Clase C Coupe",
    year: 2018,
    km: 85000,
    ourPrice: 26900,
    spainPrice: 32800,
    image: "/client-with-mercedes.jpg"
  },
  {
    id: "vw-golf",
    name: "Volkswagen Golf R-Line",
    year: 2019,
    km: 55000,
    ourPrice: 19800,
    spainPrice: 24500,
    image: "/client-with-vw.jpg"
  }
]
