export interface MobileEvent {
  id: string;
  title: string;
  eyebrow: string;
  venue: string;
  location: string;
  date: string;
  access: string;
  price: string;
  status: string;
  category: string;
  lineup: string;
  description: string;
  gradientClassName: string;
}

export const mobileEvents: MobileEvent[] = [
  {
    id: "noche-indie-rock",
    title: "Noche de Indie Rock",
    eyebrow: "FORO INDIE ROCK",
    venue: "Foro Puebla",
    location: "Roma Nte",
    date: "Sáb 17 may",
    access: "21:00 hrs",
    price: "$450 MXN",
    status: "EN VENTA",
    category: "INDIE",
    lineup: "Triplete · Las Nubes · Fuente de Juventud",
    description:
      "Una fecha para perder la voz entre guitarras crudas, synths melancólicos y pogo elegante en el corazón de la Roma.",
    gradientClassName:
      "bg-[radial-gradient(circle_at_30%_80%,rgba(255,46,136,0.55),transparent_55%),radial-gradient(circle_at_80%_20%,rgba(198,255,46,0.35),transparent_52%),linear-gradient(180deg,#24112B_0%,#140C1A_100%)]",
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
    status: "ÚLTIMOS",
    category: "CUMBIA",
    lineup: "Sonido Gallo Negro · La Coreañera · Son Rompe Pera",
    description:
      "Percusión tropical, visuales calientes y una pista lista para zapatear hasta las tres de la mañana.",
    gradientClassName:
      "bg-[radial-gradient(circle_at_50%_100%,rgba(122,16,32,0.72),transparent_55%),radial-gradient(circle_at_20%_10%,rgba(255,158,0,0.28),transparent_58%),linear-gradient(180deg,#2B1112_0%,#12090B_100%)]",
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
    status: "GRATIS",
    category: "ELECTRÓNICA",
    lineup: "Margarita Solar · DJ Vértigo · Niebla Club",
    description:
      "House hipnótico bajo la luna con sistema de audio envolvente, visuales acuáticos y entrada libre antes de las 10.",
    gradientClassName:
      "bg-[radial-gradient(circle_at_70%_30%,rgba(0,179,199,0.35),transparent_60%),radial-gradient(circle_at_20%_80%,rgba(198,255,46,0.30),transparent_55%),linear-gradient(180deg,#0B171C_0%,#091116_100%)]",
  },
];

export const mobileStats = [
  { label: "Eventos", value: "284" },
  { label: "Venues", value: "147" },
  { label: "Pago", value: "T+3" },
];

export const mobileTickets = [
  {
    id: "tck-0412-0091",
    eventName: "Noche de Indie Rock",
    date: "Sáb 17 may · 21:00",
    status: "VÁLIDO",
    section: "GRAL A",
  },
];
