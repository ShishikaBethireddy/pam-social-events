import { Navigate, useParams } from "react-router-dom";
import VendorMarketplace from "@/components/agent/VendorMarketplace";
import { getAgentClient } from "@/lib/agentClients";
import { CLIENTS_HREF } from "@/lib/agentNav";

export default function AgentClientVendors() {
  const { slug } = useParams<{ slug: string }>();
  const client = slug ? getAgentClient(slug) : undefined;
  if (!client) return <Navigate to={CLIENTS_HREF} replace />;
  return <VendorMarketplace client={client} />;
}
