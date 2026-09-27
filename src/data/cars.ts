export type TipoAuto = 'Sedán' | 'SUV' | 'Pick-up'

export interface Auto {
  id: number
  marca: string
  modelo: string
  anio: number
  precio: number
  km: number
  tipo: TipoAuto
  imagen: string
}

export const autos: Auto[] = [
  {
    id: 1,
    marca: 'Toyota',
    modelo: 'Corolla XEI',
    anio: 2019,
    precio: 18900,
    km: 62000,
    tipo: 'Sedán',
    imagen: 'https://picsum.photos/seed/auto1/600/400',
  },
  {
    id: 2,
    marca: 'Chevrolet',
    modelo: 'Tracker LTZ',
    anio: 2021,
    precio: 24500,
    km: 34000,
    tipo: 'SUV',
    imagen: 'https://picsum.photos/seed/auto2/600/400',
  },
  {
    id: 3,
    marca: 'Volkswagen',
    modelo: 'Amarok Trendline',
    anio: 2018,
    precio: 27900,
    km: 81000,
    tipo: 'Pick-up',
    imagen: 'https://picsum.photos/seed/auto3/600/400',
  },
  {
    id: 4,
    marca: 'Fiat',
    modelo: 'Cronos Drive',
    anio: 2020,
    precio: 15900,
    km: 45000,
    tipo: 'Sedán',
    imagen: 'https://picsum.photos/seed/auto4/600/400',
  },
  {
    id: 5,
    marca: 'Nissan',
    modelo: 'Kicks Advance',
    anio: 2022,
    precio: 26900,
    km: 21000,
    tipo: 'SUV',
    imagen: 'https://picsum.photos/seed/auto5/600/400',
  },
  {
    id: 6,
    marca: 'Toyota',
    modelo: 'Hilux SRV',
    anio: 2020,
    precio: 34900,
    km: 58000,
    tipo: 'Pick-up',
    imagen: 'https://picsum.photos/seed/auto6/600/400',
  },
  {
    id: 7,
    marca: 'Honda',
    modelo: 'Civic EXL',
    anio: 2017,
    precio: 16500,
    km: 95000,
    tipo: 'Sedán',
    imagen: 'https://picsum.photos/seed/auto7/600/400',
  },
  {
    id: 8,
    marca: 'Jeep',
    modelo: 'Renegade Sport',
    anio: 2021,
    precio: 23900,
    km: 39000,
    tipo: 'SUV',
    imagen: 'https://picsum.photos/seed/auto8/600/400',
  },
]
