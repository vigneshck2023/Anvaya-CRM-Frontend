import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "bootstrap/dist/css/bootstrap.min.css";

export default function SalesAgentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [agent, setAgent] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    fetchAgentDetails();
  }, []);

  const fetchAgentDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`https://anvaya-crm-ebon.vercel.app/api/agents/${id}`);
      if (!res.ok) throw new Error("Failed to fetch agent");
      const data = await res.json();

      setAgent(data.data);
      setLeads(data.data.leads || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Could not load sales agent. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Filtering + sorting
  const filteredLeads = leads
    .filter((lead) => (statusFilter ? lead.status === statusFilter : true))
    .filter((lead) => (priorityFilter ? lead.priority.includes(priorityFilter) : true))
    .sort((a, b) => (sortBy === "timeToClose" ? a.timeToClose - b.timeToClose : 0));

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error) return <p className="text-center mt-4 text-danger">{error}</p>;
  if (!agent) return null;

  return (
    <>
      <Header />
      <div className="container my-4">
        <h2 className="mb-4 text-primary">Sales Agent: {agent.name}</h2>

        <div className="row g-4">
          {/* Agent Details */}
          <div className="col-md-4">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-3">Agent Info</h5>
                <p><strong>Name:</strong> {agent.name}</p>
                <p><strong>Email:</strong> {agent.email}</p>
                <p><strong>Total Leads:</strong> {leads.length}</p>
                <button className="btn btn-secondary mt-2" onClick={() => navigate("/salesAgent")}>
                  Back to Agents
                </button>
              </div>
            </div>
          </div>

          {/* Leads List */}
          <div className="col-md-8">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-3">Leads by {agent.name}</h5>

                {/* Filters */}

                {/* Filters */}

                {/* Filters */}
<div className="d-flex justify-content-center align-items-center gap-3 mb-3">
  <select
    className="form-select flex-grow-1"
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
  >
    <option value="">Filter by Status</option>
    <option value="New">New</option>
    <option value="Qualified">Qualified</option>
    <option value="Contracted">Contracted</option>
  </select>

  <select
    className="form-select flex-grow-1"
    value={priorityFilter}
    onChange={(e) => setPriorityFilter(e.target.value)}
  >
    <option value="">Filter by Priority</option>
    <option value="High">High</option>
    <option value="Medium">Medium</option>
    <option value="Low">Low</option>
  </select>

  <select
    className="form-select flex-grow-1"
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
  >
    <option value="">Sort by</option>
    <option value="timeToClose">Time to Close</option>
  </select>
</div>


                {/* Leads List */}
                {filteredLeads.length === 0 ? (
                  <p className="text-muted">No leads available.</p>
                ) : (
                  filteredLeads.map((lead) => (
                    <div key={lead._id} className="mb-3 p-3 bg-light rounded">
                      <h6>{lead.name}</h6>
                      <p className="mb-1"><strong>Status:</strong> {lead.status}</p>
                      <p className="mb-1"><strong>Priority:</strong> {lead.priority.join(", ")}</p>
                      <p className="mb-0"><strong>Time to Close:</strong> {lead.timeToClose} days</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
