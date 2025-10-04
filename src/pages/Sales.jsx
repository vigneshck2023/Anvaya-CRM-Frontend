import Header from "../components/Header";
import "../styles.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Sales() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://anvaya-crm-ebon.vercel.app/api/agent"
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response (Agents):", data);

      if (Array.isArray(data)) {
        setAgents(data);
      } else if (data && Array.isArray(data.agents)) {
        setAgents(data.agents);
      } else if (data && data.data && Array.isArray(data.data)) {
        setAgents(data.data);
      } else {
        setAgents([data]);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching agents:", err);
      setError("Failed to load agents. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="app-container">
        <Header />
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading Sales Agents...</p>
        </div>
      </div>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <div className="app-container">
        <Header />
        <div className="error-container">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
          <button className="btn btn-primary" onClick={fetchAgents}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // --- Success State ---
  return (
    <div className="app-container">
      <Header />
      <div className="main-layout">
        {/* Top bar: Add Agent button */}
        <div className="filters">
          <button className="btn-add" onClick={() => navigate("/addAgents")}>
            Add New Agent
          </button>
        </div>

        {/* Agents List */}
        <div className="py-4">
          <div className="leads-list">
            {!Array.isArray(agents) || agents.length === 0 ? (
              <div className="no-leads">
                {!Array.isArray(agents)
                  ? "Invalid data format received"
                  : "No agents found"}
              </div>
            ) : (
              agents.map((agent, index) => (
                <div
                  key={agent.id || agent._id || index}
                  className="lead-item"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    navigate(`/agents/${agent._id || agent.id}`)
                  }
                >
                  <div className="lead-info">
                    <div className="lead-name">
                      {agent.name || `Agent ${index + 1}`}
                    </div>
                    <div className="lead-status">
                      ({agent.role || "No Role"})
                    </div>
                  </div>
                  {agent.email && <div className="lead-email">{agent.email}</div>}
                  {agent.phone && <div className="lead-phone">{agent.phone}</div>}
                  {index < agents.length - 1 && <hr />}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
