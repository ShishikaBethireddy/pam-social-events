import { Navigate, useParams } from "react-router-dom";
import ClientDetail from "@/components/agent/ClientDetail";
import { getAgentClient } from "@/lib/agentClients";
import { CLIENTS_HREF } from "@/lib/agentNav";

export default function AgentClientDetail() {
  const { slug } = useParams<{ slug: string }>();
  const client = slug ? getAgentClient(slug) : undefined;
  if (!client) return <Navigate to={CLIENTS_HREF} replace />;
  return <ClientDetail client={client} />;
}
