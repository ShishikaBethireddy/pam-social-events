import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Mail, MapPin, Phone, Users, BedDouble, FileText, MessageSquare } from "lucide-react";
import { getAgentClient } from "@/lib/travelAgentData";
import nobuLogo from "@/assets/logo-nobu-white.png";

const statusStyles: Record<string, string> = {
  Lead: "bg-secondary text-muted-foreground border-border",
  Proposal: "bg-copper/15 text-copper-active border-copper/40",
  Hold: "bg-accent/20 text-accent-foreground border-accent/40",
  Confirmed: "bg-emerald-100 text-emerald-900 border-emerald-300",
  Closed: "bg-muted text-muted-foreground border-border",
};

const TravelAgentClient = () => {
  const { id } = useParams<{ id: string }>();
  const client = id ? getAgentClient(id) : undefined;

  if (!client) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-muted-foreground">Client not found.</p>
        <Link to="/travel-agent" className="text-sm underline">Back to roster</Link>
      </div>
    );
  }

  const commission = Math.round(client.estimate * 0.1);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="w-full bg-sunset-gradient text-paper text-center text-[11px] tracking-[0.4em] py-1.5 font-sans font-semibold uppercase">
        Social Events · Travel Agent
      </div>
      <header className="bg-black">
        <div className="container flex items-center justify-between py-6">
          <Link
            to="/"
            className="flex h-[32px] items-center"
            aria-label="Nobu Hotel Los Cabos"
          >
            <img
              src={nobuLogo}
              alt="Nobu Hotel Los Cabos"
              className="h-[28px] w-auto object-contain"
            />
          </Link>
          <Link
            to="/travel-agent"
            className="flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Roster
          </Link>
        </div>
      </header>

      <main className="flex-1 container py-10 sm:py-14 max-w-5xl">
        <Link
          to="/travel-agent"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All clients
        </Link>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-accent">
              {client.eventType}
            </p>
            <h1 className="mt-2 font-serif text-3xl sm:text-4xl leading-tight">
              {client.clientName}
            </h1>
          </div>
          <span
            className={`inline-flex w-fit rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.2em] ${statusStyles[client.status]}`}
          >
            {client.status}
          </span>
        </div>

        {/* Key facts */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Fact icon={<Calendar className="h-4 w-4" />} label="Event date" value={client.eventDate} />
          <Fact icon={<Users className="h-4 w-4" />} label="Guests" value={`${client.guests}`} />
          <Fact icon={<MapPin className="h-4 w-4" />} label="Venue" value={client.venue} />
          <Fact
            icon={<BedDouble className="h-4 w-4" />}
            label="Room block"
            value={`${client.rooms} rooms · ${client.nights} nights`}
          />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {/* Left column */}
          <section className="lg:col-span-2 space-y-6">
            <Card title="Notes" icon={<FileText className="h-4 w-4" />}>
              <p className="text-sm leading-relaxed text-foreground">{client.notes}</p>
            </Card>

            <Card title="Activity" icon={<MessageSquare className="h-4 w-4" />}>
              <ul className="space-y-3 text-sm">
                <ActivityRow when={client.lastActivity} what={`Latest update on ${client.clientName.split(" ")[0]}'s file`} />
                <ActivityRow when="1 week ago" what="Site visit confirmation sent to client" />
                <ActivityRow when="2 weeks ago" what="Initial inquiry logged from agent portal" />
              </ul>
            </Card>
          </section>

          {/* Right column */}
          <aside className="space-y-6">
            <Card title="Contact">
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-foreground">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {client.clientEmail}
                </li>
                <li className="flex items-center gap-2 text-foreground">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {client.clientPhone}
                </li>
              </ul>
            </Card>

            <Card title="Estimate">
              <div className="flex items-baseline justify-between">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-serif text-2xl">${client.estimate.toLocaleString()}</span>
              </div>
              <div className="mt-2 flex items-baseline justify-between border-t border-border pt-3">
                <span className="text-sm text-muted-foreground">Est. commission (10%)</span>
                <span className="font-medium text-foreground">${commission.toLocaleString()}</span>
              </div>
            </Card>

            <div className="flex flex-col gap-2">
              <button className="rounded-full bg-foreground py-2.5 text-sm font-medium text-background hover:bg-foreground/90">
                Send proposal
              </button>
              <button className="rounded-full border border-border py-2.5 text-sm font-medium hover:bg-secondary/60">
                Request room block
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

const Fact = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="rounded-sm border border-border bg-secondary/30 p-4">
    <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
      {icon}
      {label}
    </div>
    <p className="mt-2 text-base text-foreground">{value}</p>
  </div>
);

const Card = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="rounded-sm border border-border bg-background p-5">
    <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground">
      {icon}
      {title}
    </div>
    <div className="mt-4">{children}</div>
  </div>
);

const ActivityRow = ({ when, what }: { when: string; what: string }) => (
  <li className="flex items-start gap-3">
    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
    <div>
      <p className="text-foreground">{what}</p>
      <p className="text-xs text-muted-foreground">{when}</p>
    </div>
  </li>
);

export default TravelAgentClient;