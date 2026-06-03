export type ClientStatus = "Lead" | "Proposal" | "Hold" | "Confirmed" | "Closed";

export type AgentClient = {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  eventType: string;
  eventDate: string;
  guests: number;
  venue: string;
  estimate: number;
  status: ClientStatus;
  lastActivity: string;
  notes: string;
  rooms: number;
  nights: number;
};

export const TRAVEL_AGENT_CLIENTS: AgentClient[] = [
  {
    id: "okafor-reunion",
    clientName: "Adaeze & Tomi Okafor",
    clientEmail: "adaeze.okafor@example.com",
    clientPhone: "+1 (415) 555-0143",
    eventType: "Family reunion",
    eventDate: "Feb 14, 2026",
    guests: 80,
    venue: "Cielo Terrace",
    estimate: 64200,
    status: "Hold",
    lastActivity: "Proposal sent · 2 days ago",
    notes: "Hosts want a Japanese-Peruvian tasting menu and live sax during cocktail hour.",
    rooms: 24,
    nights: 3,
  },
  {
    id: "marin-anniversary",
    clientName: "Sofia Marín",
    clientEmail: "sofia@marinfamily.com",
    clientPhone: "+1 (305) 555-0192",
    eventType: "25th anniversary",
    eventDate: "Mar 02, 2026",
    guests: 42,
    venue: "Nobu Beach",
    estimate: 31800,
    status: "Confirmed",
    lastActivity: "Deposit received · 5 days ago",
    notes: "Sunset cocktail hour followed by a private beach dinner. Vegetarian table of 6.",
    rooms: 14,
    nights: 2,
  },
  {
    id: "patel-engagement",
    clientName: "Rohan Patel",
    clientEmail: "rohan.patel@example.com",
    clientPhone: "+44 20 7946 0021",
    eventType: "Engagement party",
    eventDate: "Apr 19, 2026",
    guests: 110,
    venue: "Garden Pavilion",
    estimate: 92500,
    status: "Proposal",
    lastActivity: "Awaiting feedback · 1 day ago",
    notes: "Mehndi-inspired décor with marigold installation. Mocktail bar required.",
    rooms: 38,
    nights: 4,
  },
  {
    id: "harper-bday",
    clientName: "Eleanor Harper",
    clientEmail: "e.harper@harpergroup.co",
    clientPhone: "+1 (212) 555-0167",
    eventType: "Milestone birthday",
    eventDate: "May 08, 2026",
    guests: 30,
    venue: "Sake Lounge",
    estimate: 18750,
    status: "Lead",
    lastActivity: "Inquiry received · today",
    notes: "Intimate 60th birthday, looking for omakase dinner experience.",
    rooms: 8,
    nights: 2,
  },
  {
    id: "delacroix-milestone",
    clientName: "Camille & Julien Delacroix",
    clientEmail: "camille@delacroix.fr",
    clientPhone: "+33 1 70 18 22 11",
    eventType: "Milestone anniversary",
    eventDate: "Jun 21, 2026",
    guests: 55,
    venue: "Cielo Terrace",
    estimate: 47200,
    status: "Hold",
    lastActivity: "Site visit booked · 3 days ago",
    notes: "Bilingual dinner program (FR/EN). Private chef tasting requested before contract.",
    rooms: 18,
    nights: 3,
  },
  {
    id: "yamamoto-corp",
    clientName: "Yamamoto Family Office",
    clientEmail: "events@yamamoto.jp",
    clientPhone: "+81 3 1234 5678",
    eventType: "Private gathering",
    eventDate: "Jul 12, 2026",
    guests: 24,
    venue: "Nobu Suite",
    estimate: 28400,
    status: "Confirmed",
    lastActivity: "Contract signed · 1 week ago",
    notes: "Full buyout of Nobu Suite. Kaiseki menu by Chef Matsuhisa team.",
    rooms: 12,
    nights: 5,
  },
  {
    id: "alvarez-quince",
    clientName: "Familia Alvarez",
    clientEmail: "lucia.alvarez@example.com",
    clientPhone: "+52 55 5555 0123",
    eventType: "Quinceañera",
    eventDate: "Aug 30, 2026",
    guests: 140,
    venue: "Garden Pavilion",
    estimate: 78900,
    status: "Proposal",
    lastActivity: "Revised quote sent · 4 days ago",
    notes: "Live mariachi band, gold and ivory palette. Photo booth + late-night taquiza.",
    rooms: 42,
    nights: 3,
  },
  {
    id: "rivers-retreat",
    clientName: "Rivers Wellness Retreat",
    clientEmail: "hello@riverswellness.com",
    clientPhone: "+1 (628) 555-0119",
    eventType: "Wellness retreat",
    eventDate: "Sep 18, 2026",
    guests: 28,
    venue: "Spa & Beach",
    estimate: 36500,
    status: "Lead",
    lastActivity: "Discovery call scheduled",
    notes: "Five-day wellness retreat, plant-based menu, daily yoga and sound bath.",
    rooms: 14,
    nights: 5,
  },
  {
    id: "khoury-closed",
    clientName: "Khoury Family Reunion",
    clientEmail: "n.khoury@example.com",
    clientPhone: "+961 1 555 089",
    eventType: "Welcome dinner",
    eventDate: "Nov 11, 2025",
    guests: 60,
    venue: "Nobu Beach",
    estimate: 41200,
    status: "Closed",
    lastActivity: "Event delivered · last month",
    notes: "Successfully delivered. Client requested testimonial follow-up.",
    rooms: 20,
    nights: 3,
  },
];

export const getAgentClient = (id: string) =>
  TRAVEL_AGENT_CLIENTS.find((c) => c.id === id);