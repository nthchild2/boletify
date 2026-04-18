export type EventCategory =
  | "INDIE"
  | "CUMBIA"
  | "ELECTRÓNICA"
  | "ROCK"
  | "JAZZ";

export interface EventRecord {
  id: string;
  title: string;
  eyebrow: string;
  venue: string;
  location: string;
  date: string;
  access: string;
  price: string;
  priceValue: number;
  status: string;
  category: EventCategory;
  posterTitle: string;
  posterClassName: string;
  accent: "signal" | "rosa";
  lineup: string;
  description: string;
}

export const featuredEvents: EventRecord[] = [
  {
    id: "noche-indie-rock",
    title: "Noche de Indie Rock",
    eyebrow: "FORO INDIE ROCK",
    venue: "Foro Puebla",
    location: "Roma Nte",
    date: "Sáb 17 may",
    access: "21:00 hrs",
    price: "$450 MXN",
    priceValue: 450,
    status: "EN VENTA",
    category: "INDIE",
    posterTitle: "Nubes\nOscuras",
    posterClassName:
      "bg-[radial-gradient(circle_at_30%_80%,rgba(255,46,136,0.55),transparent_0%,transparent_55%),radial-gradient(circle_at_80%_20%,rgba(198,255,46,0.35),transparent_0%,transparent_52%),linear-gradient(180deg,#24112B_0%,#140C1A_100%)]",
    accent: "signal",
    lineup: "Triplete · Las Nubes · Fuente de Juventud",
    description:
      "Una fecha para perder la voz entre guitarras crudas, synths melancólicos y pogo elegante en el corazón de la Roma.",
  },
  {
    id: "sonido-del-valle",
    title: "Sonido Gallo Negro · Tributo",
    eyebrow: "CUMBIA SONIDERA",
    venue: "Salón Los Ángeles",
    location: "Obrera",
    date: "Vie 23 may",
    access: "22:30 hrs",
    price: "$350 MXN",
    priceValue: 350,
    status: "ÚLTIMOS",
    category: "CUMBIA",
    posterTitle: "Sonido\ndel Valle",
    posterClassName:
      "bg-[radial-gradient(circle_at_50%_100%,rgba(122,16,32,0.72),transparent_0%,transparent_55%),radial-gradient(circle_at_20%_10%,rgba(255,158,0,0.28),transparent_0%,transparent_58%),linear-gradient(180deg,#2B1112_0%,#12090B_100%)]",
    accent: "signal",
    lineup: "Sonido Gallo Negro · La Coreañera · Son Rompe Pera",
    description:
      "Percusión tropical, visuales calientes y una pista lista para zapatear hasta las tres de la mañana.",
  },
  {
    id: "cenote-club-full-moon",
    title: "Cenote Club · Full Moon",
    eyebrow: "FIESTA ELECTRÓNICA",
    venue: "Terraza Condesa",
    location: "Condesa",
    date: "Jue 29 may",
    access: "20:00 hrs",
    price: "GRATIS",
    priceValue: 0,
    status: "GRATIS",
    category: "ELECTRÓNICA",
    posterTitle: "Cenote\nClub",
    posterClassName:
      "bg-[radial-gradient(circle_at_70%_30%,rgba(0,179,199,0.35),transparent_0%,transparent_60%),radial-gradient(circle_at_20%_80%,rgba(198,255,46,0.30),transparent_0%,transparent_55%),linear-gradient(180deg,#0B171C_0%,#091116_100%)]",
    accent: "rosa",
    lineup: "Margarita Solar · DJ Vértigo · Niebla Club",
    description:
      "House hipnótico bajo la luna con sistema de audio envolvente, visuales acuáticos y entrada libre antes de las 10.",
  },
  {
    id: "gris-electrico-en-vivo",
    title: "Gris Eléctrico · En Vivo",
    eyebrow: "RESIDENCIA",
    venue: "El Plaza Condesa",
    location: "Condesa",
    date: "Sáb 31 may",
    access: "21:30 hrs",
    price: "$680 MXN",
    priceValue: 680,
    status: "ESTRENO",
    category: "ROCK",
    posterTitle: "Gris &\nEléctrico",
    posterClassName:
      "bg-[radial-gradient(circle_at_50%_50%,rgba(255,46,136,0.45),transparent_0%,transparent_60%),linear-gradient(180deg,#251416_0%,#120B0D_100%)]",
    accent: "signal",
    lineup: "Gris Eléctrico · Motor Fantasma · Pista Roja",
    description:
      "Una residencia nueva con guitarras afiladas, bajos saturados y un show visual diseñado para sentir cada golpe.",
  },
];

export const dashboardStats = [
  { label: "Venta bruta · 2026", value: "$1,247,830", delta: "+12.4%" },
  { label: "Boletos vendidos", value: "8,421", delta: "+284" },
  { label: "Eventos activos", value: "24" },
  { label: "Pago próximo", value: "T+3" },
];
