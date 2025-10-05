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

  // Fetch agents from API
  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://anvaya-crm-ebon.vercel.app/api/agent");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response (Agents):", data);

      if (Array.isArray(data)) {
        setAgents(data);
      } else if (Array.isArray(data.agents)) {
        setAgents(data.agents);
      } else if (data.data && Array.isArray(data.data)) {
        setAgents(data.data);
      } else {
        setAgents([]);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching agents:", err);
      setError("Failed to load agents. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="app-container">
        <Header />
        <div className="loading-container text-center my-5">
          <div className="spinner-border text-primary mb-3" role="status" />
          <p>Loading Sales Agents...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="app-container">
        <Header />
        <div className="error-container text-center my-5">
          <div className="alert alert-danger mb-3" role="alert">
            {error}
          </div>
          <button className="btn-add" onClick={fetchAgents}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Success State
  return (
    <div className="app-container">
      <Header />
      <div className="main-layout container py-4">
        {/* Filters */}
        <div className="d-flex flex-wrap gap-3 align-items-center mb-4">

          {/* Add Agent Button */}
          <button className="btn-add" onClick={() => navigate("/addAgents")}>
            Add New Agent
          </button>
        </div>

        {/* Agent List */}
        <div className="leads-list">
          {!filteredAgents.length ? (
            <div className="text-center text-muted py-5">
              <p>No agents found.</p>
            </div>
          ) : (
            filteredAgents.map((agent, index) => (
              <div
                key={agent._id || index}
                className="lead-item border rounded p-3 mb-3 shadow-sm"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/agents/${agent._id || agent.id}`)}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1">{agent.name || `Agent ${index + 1}`}</h5>
                    <small className="text-muted">
                      {agent.role || "No Role"} |{" "}
                      {agent.status || "Active"}
                    </small>
                  </div>
                  <div>
                    <span className="badge btn-add text-white fw-bolder">
                      {agent.source || "Internal"}
                    </span>
                  </div>
                </div>

                {agent.email && <p className="mb-0 mt-2">{agent.email}</p>}
                {agent.phone && <p className="mb-0">{agent.phone}</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
