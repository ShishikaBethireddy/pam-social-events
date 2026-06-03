import { useEffect, useState } from "react";

export type User = {
  email: string;
  name?: string;
  phone?: string;
};

export type SavedEstimate = {
  id: string;
  createdAt: number;
  eventType?: string;
  guests?: string;
  dates?: string;
  venue?: string;
  fnb?: string;
  subtotal?: number;
  deposit?: number;
  paidAt?: number;
  paymentRef?: string;
  cardLast4?: string;
  addOns?: string[];
  stayBlock?: {
    enabled: boolean;
    rooms?: number;
    nights?: number;
    confirmed?: number;
  };
  vendors?: {
    id: string;
    category: string;
    name: string;
    status: "added" | "proposal" | "contracted";
  }[];
  itinerary?: {
    id: string;
    day: number;
    time: string;
    title: string;
    location?: string;
    note?: string;
  }[];
  guestList?: {
    id: string;
    name: string;
    party?: number;
    invited?: boolean;
    rsvp?: "yes" | "no" | "pending";
    inRoomBlock?: boolean;
  }[];
};

const USERS_KEY = "nobu_users"; // { [email]: { password, name, phone } }
const SESSION_KEY = "nobu_session"; // email of logged-in user
const estimatesKey = (email: string) => `nobu_estimates_${email}`;
const progressKey = (email: string) => `nobu_progress_${email}`;

type UserRecord = { password?: string; name?: string; phone?: string };

const readUsers = (): Record<string, UserRecord> => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
  } catch {
    return {};
  }
};
const writeUsers = (u: Record<string, UserRecord>) =>
  localStorage.setItem(USERS_KEY, JSON.stringify(u));

const emit = () => window.dispatchEvent(new Event("nobu_auth_change"));

export const auth = {
  current(): User | null {
    const email = localStorage.getItem(SESSION_KEY);
    if (!email) return null;
    const rec = readUsers()[email] || {};
    return { email, name: rec.name, phone: rec.phone };
  },
  signUp(email: string, password: string, profile?: { name?: string; phone?: string }) {
    const users = readUsers();
    if (users[email]?.password) throw new Error("Account already exists. Try signing in.");
    users[email] = { password, name: profile?.name, phone: profile?.phone };
    writeUsers(users);
    localStorage.setItem(SESSION_KEY, email);
    emit();
    return this.current()!;
  },
  signIn(email: string, password: string) {
    const users = readUsers();
    const rec = users[email];
    if (!rec?.password || rec.password !== password) throw new Error("Wrong email or password.");
    localStorage.setItem(SESSION_KEY, email);
    emit();
    return this.current()!;
  },
  // Mock magic link — just signs you in (or creates account) without a password
  magicLink(email: string) {
    const users = readUsers();
    if (!users[email]) users[email] = {};
    writeUsers(users);
    localStorage.setItem(SESSION_KEY, email);
    emit();
    return this.current()!;
  },
  updateProfile(patch: { name?: string; phone?: string }) {
    const email = localStorage.getItem(SESSION_KEY);
    if (!email) return;
    const users = readUsers();
    users[email] = { ...(users[email] || {}), ...patch };
    writeUsers(users);
    emit();
  },
  signOut() {
    localStorage.removeItem(SESSION_KEY);
    emit();
  },
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(() => auth.current());
  useEffect(() => {
    const handler = () => setUser(auth.current());
    window.addEventListener("nobu_auth_change", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("nobu_auth_change", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);
  return user;
};

export const estimates = {
  list(email: string): SavedEstimate[] {
    try {
      return JSON.parse(localStorage.getItem(estimatesKey(email)) || "[]");
    } catch {
      return [];
    }
  },
  save(email: string, e: Omit<SavedEstimate, "id" | "createdAt">) {
    const list = this.list(email);
    const item: SavedEstimate = { ...e, id: crypto.randomUUID(), createdAt: Date.now() };
    list.unshift(item);
    localStorage.setItem(estimatesKey(email), JSON.stringify(list));
    return item;
  },
  remove(email: string, id: string) {
    const list = this.list(email).filter((x) => x.id !== id);
    localStorage.setItem(estimatesKey(email), JSON.stringify(list));
  },
  get(email: string, id: string): SavedEstimate | undefined {
    return this.list(email).find((x) => x.id === id);
  },
  update(email: string, id: string, patch: Partial<SavedEstimate>) {
    const list = this.list(email).map((x) => (x.id === id ? { ...x, ...patch } : x));
    localStorage.setItem(estimatesKey(email), JSON.stringify(list));
  },
  markLatestPaid(email: string, payment: { paymentRef: string; cardLast4?: string }) {
    const list = this.list(email);
    const target = list.find((x) => !x.paidAt);
    if (!target) return undefined;
    target.paidAt = Date.now();
    target.paymentRef = payment.paymentRef;
    target.cardLast4 = payment.cardLast4;
    localStorage.setItem(estimatesKey(email), JSON.stringify(list));
    return target;
  },
};

export const progress = {
  load(email: string) {
    try {
      return JSON.parse(localStorage.getItem(progressKey(email)) || "null");
    } catch {
      return null;
    }
  },
  save(email: string, data: unknown) {
    localStorage.setItem(progressKey(email), JSON.stringify(data));
  },
  clear(email: string) {
    localStorage.removeItem(progressKey(email));
  },
};