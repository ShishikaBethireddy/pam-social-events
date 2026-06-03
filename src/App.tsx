import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Landing from "./pages/Landing.tsx";
import TravelAgent from "./pages/TravelAgent.tsx";
import TravelAgentIntake from "./pages/TravelAgentIntake.tsx";
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
import Preview from "./pages/Preview.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* `/` is the Social Events marketing landing — the spinoff
              of the pam-brides marketing flow, retargeted at private
              celebrations. `/direct` is kept as an alias for guests
              deep-linking from the old persona-picker. */}
          <Route path="/" element={<Landing />} />
          <Route path="/direct" element={<Landing />} />
          <Route path="/travel-agent" element={<TravelAgent />} />
          <Route path="/travel-agent/:id" element={<TravelAgentIntake />} />
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
