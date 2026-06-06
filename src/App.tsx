import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Gateway from "./pages/Gateway.tsx";
import Landing from "./pages/Landing.tsx";
import AgentDashboard from "./components/agent/AgentDashboard.tsx";
import ClientsList from "./components/agent/ClientsList.tsx";
import RequestsInbox from "./components/agent/RequestsInbox.tsx";
import CheckAvailability from "./components/agent/CheckAvailability.tsx";
import NewClientSetup from "./components/agent/NewClientSetup.tsx";
import AgentClientDetail from "./pages/AgentClientDetail.tsx";
import AgentClientVendors from "./pages/AgentClientVendors.tsx";
import NotFound from "./pages/NotFound.tsx";
import Plan from "./pages/Plan.tsx";
import Chat from "./pages/Chat.tsx";
import Estimate from "./pages/Estimate.tsx";
import Worldpay from "./pages/Worldpay.tsx";
import SavedDate from "./pages/SavedDate.tsx";
import Auth from "./pages/Auth.tsx";
import Account from "./pages/Account.tsx";
import EstimateDetail from "./pages/EstimateDetail.tsx";
import EventPortal from "./pages/EventPortal.tsx";
import EventPlanning from "./pages/EventPlanning.tsx";
import Preview from "./pages/Preview.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* `/` is the Gateway — the very first persona picker that asks
              how the visitor wants to book (Direct vs. Travel Agent).
              `/direct` is the guest-facing marketing landing (the current
              prototype) that Direct Booking hands off to. */}
          <Route path="/" element={<Gateway />} />
          <Route path="/direct" element={<Landing />} />
          {/* Travel-Agent Booking → the PAM Partner Portal (agent prototype).
              `/travel-agent` is the advisor dashboard; the rest of the tree is
              the clients book, client detail (with tabs), vendor marketplace,
              requests inbox, Ask-Allie availability, and new-client setup. */}
          <Route path="/travel-agent" element={<AgentDashboard />} />
          <Route path="/travel-agent/clients" element={<ClientsList />} />
          <Route path="/travel-agent/clients/:slug" element={<AgentClientDetail />} />
          <Route path="/travel-agent/clients/:slug/vendors" element={<AgentClientVendors />} />
          <Route path="/travel-agent/requests" element={<RequestsInbox />} />
          <Route path="/travel-agent/check-availability" element={<CheckAvailability />} />
          <Route path="/travel-agent/new-client" element={<NewClientSetup />} />
          {/* `/plan` is the pre-chat editorial landing (video hero +
              event-type + date pickers + trending venues). `/chat` is the
              Allie concierge — Plan funnels into Chat once a celebration
              type + date are chosen. */}
          <Route path="/plan" element={<Plan />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/estimate" element={<Estimate />} />
          <Route path="/worldpay" element={<Worldpay />} />
          <Route path="/saved" element={<SavedDate />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/account" element={<Account />} />
          <Route path="/estimate/:id" element={<EstimateDetail />} />
          <Route path="/portal/:id" element={<EventPortal />} />
          {/* Event Planning workspace (Direct Booking only). Hosts land here
              after submitting the deposit or tapping "Plan My Event" — a
              tracker-rail workspace for guests, rooms, catering, spaces,
              décor, schedule, entertainment and budget. */}
          <Route path="/planning/:id/*" element={<EventPlanning />} />
          {/* /preview/:kind renders the chat sub-pickers in isolation
              (spaces, fnb) for design iteration without driving the full
              chat flow. */}
          <Route path="/preview/:kind" element={<Preview />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
