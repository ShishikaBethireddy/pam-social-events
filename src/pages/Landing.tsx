import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Nav } from "@/components/nobu/Nav";
import { Hero } from "@/components/nobu/Hero";
import { EventTypes } from "@/components/nobu/EventTypes";
import { Venues } from "@/components/nobu/Venues";
import { Stays } from "@/components/nobu/Stays";
import { Dining } from "@/components/nobu/Dining";
import { AllieConcierge } from "@/components/nobu/AllieConcierge";
import { Testimonials } from "@/components/nobu/Testimonials";
import { FAQ } from "@/components/nobu/FAQ";
import { ClosingCTA, Footer } from "@/components/nobu/ClosingCTA";
import { SpecialistSheet } from "@/components/nobu/SpecialistSheet";
import { MenuOverlay } from "@/components/nobu/MenuOverlay";

/**
 * Social Events landing — the conversion-driving entry point for the
 * Nobu Hotels Social Events Booking Concierge. Mirrors the pam-brides
 * marketing flow (hero → perks → suite-of-tools → close) but spun off
 * for private celebrations: milestone birthdays, anniversaries,
 * engagement parties, baby showers, bachelor / bachelorette weekends,
 * family reunions, graduations, private dinners and more.
 *
 * Every primary CTA hands off to `/plan` — the conversational concierge
 * (Allie) that captures the brief, builds an estimate, and ends in a
 * refundable deposit hold.
 */
const Landing = () => {
  const navigate = useNavigate();
  const [specialistOpen, setSpecialistOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const openPlanner = () => navigate("/plan");
  const openSpecialist = () => setSpecialistOpen(true);

  return (
    <div id="top" className="min-h-screen bg-canvas text-ink">
      <Nav
        onPlan={openPlanner}
        onSpecialist={openSpecialist}
        onMenu={() => setMenuOpen(true)}
      />

      <main>
        <Hero onPlan={openPlanner} onSpecialist={openSpecialist} />
        <EventTypes />
        <Venues />
        <Stays />
        <Dining />
        <AllieConcierge onPlan={openPlanner} />
        <Testimonials />
        <FAQ />
        <ClosingCTA onPlan={openPlanner} onSpecialist={openSpecialist} />
      </main>

      <Footer />

      <SpecialistSheet
        open={specialistOpen}
        onClose={() => setSpecialistOpen(false)}
        onChat={openPlanner}
      />
      <MenuOverlay
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onPlan={openPlanner}
        onSpecialist={openSpecialist}
      />
    </div>
  );
};

export default Landing;
