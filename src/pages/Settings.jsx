import { useState, useEffect } from "react";
import Header from "../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Settings() {
  const [agents, setAgents] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
    fetchLeads();
  }, []);

  // Fetch agents
  const fetchAgents = async () => {
    try {
      const res = await fetch("https://anvaya-crm-ebon.vercel.app/api/agent");
      const data = await res.json();
      setAgents(data.data || []);
    } catch (err) {
      toast.error("Failed to fetch agents", { position: "bottom-right", theme: "colored" });
    }
  };

  // Fetch leads
  const fetchLeads = async () => {
    try {
      const res = await fetch("https://anvaya-crm-ebon.vercel.app/leads");
      const data = await res.json();
      setLeads(data.data || []);
    } catch (err) {
      toast.error("Failed to fetch leads", { position: "bottom-right", theme: "colored" });
    } finally {
      setLoading(false);
    }
  };

  // Delete agent
  const handleDeleteAgent = async (id) => {
    try {
      const res = await fetch(`https://anvaya-crm-ebon.vercel.app/api/agents/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete agent");

      toast.success("Agent deleted!", { position: "bottom-right", theme: "colored" });
      // Refresh agent list
      fetchAgents();
    } catch (err) {
      console.error(err);
      toast.error(`Error deleting agent: ${err.message}`, { position: "bottom-right", theme: "colored" });
    }
  };

  // Delete lead
  const handleDeleteLead = async (id) => {
    try {
      const res = await fetch(`https://anvaya-crm-ebon.vercel.app/leads/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete lead");

      toast.success("Lead deleted!", { position: "bottom-right", theme: "colored" });
      // Refresh lead list
      fetchLeads();
    } catch (err) {
      console.error(err);
      toast.error(`Error deleting lead: ${err.message}`, { position: "bottom-right", theme: "colored" });
    }
  };

  if (loading) return <p className="text-center mt-4">Loading...</p>;

  return (
    <>
      <Header />
      <ToastContainer />
      <div className="container my-4">
        <h2 className="mb-4 text-primary">Settings</h2>

        {/* Sales Agents */}
        <div className="card shadow-sm p-3 mb-4">
          <h5 className="mb-3">Sales Agents</h5>
          {agents.length === 0 ? (
            <p className="text-muted">No sales agents found.</p>
          ) : (
            <ul className="list-group">
              {agents.map((agent) => {
                const agentId = agent._id || agent.id;
                return (
                  <li
                    key={agentId}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {agent.name} ({agent.email})
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteAgent(agentId)}
                    >
                      Delete
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Leads */}
        <div className="card shadow-sm p-3 mb-4">
          <h5 className="mb-3">Leads</h5>
          {leads.length === 0 ? (
            <p className="text-muted">No leads found.</p>
          ) : (
            <ul className="list-group">
              {leads.map((lead) => {
                const leadId = lead._id || lead.id;
                return (
                  <li
                    key={leadId}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {lead.name} - {lead.status}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteLead(leadId)}
                    >
                      Delete
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
