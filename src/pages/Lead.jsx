import Header from "../components/Header";
import "../styles.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Lead() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [sortBy, setSortBy] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();
  }, []);

  // Fetch Leads from API
  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://anvaya-crm-ebon.vercel.app/leads");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      // Handle different API response structures
      if (Array.isArray(data)) {
        setLeads(data);
      } else if (Array.isArray(data.leads)) {
        setLeads(data.leads);
      } else if (data.data && Array.isArray(data.data)) {
        setLeads(data.data);
      } else {
        setLeads([]);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching leads:", err);
      setError("Failed to load leads. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Unified Filter + Sort Logic
  const getFilteredLeads = () => {
    if (!Array.isArray(leads)) return [];

    return leads
      .filter((lead) =>
        statusFilter === "all" ? true : lead.status === statusFilter
      )
      .filter((lead) =>
        priorityFilter
          ? lead.priority && lead.priority.includes(priorityFilter)
          : true
      )
      .sort((a, b) => {
        if (sortBy === "timeToClose") {
          return (a.timeToClose || 0) - (b.timeToClose || 0);
        }
        return 0;
      });
  };

  const filteredLeads = getFilteredLeads();

  // Loading State
  if (loading) {
    return (
      <div className="app-container">
        <Header />
        <div className="loading-container text-center my-5">
          <div className="spinner-border text-primary mb-3" role="status" />
          <p>Loading Data...</p>
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
          <button className="btn-add" onClick={fetchLeads}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Header />

      <div className="main-layout container py-4">
        {/* Filters */}
        <div className="d-flex flex-wrap gap-3 align-items-center mb-4">
          {/* Status Filter */}
          <select
            className="form-select w-auto"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Leads</option>
            <option value="New">New Lead</option>
            <option value="Contracted">Contracted Lead</option>
            <option value="Qualified">Qualified Lead</option>
          </select>

          {/* Priority Filter */}
          <select
            className="form-select w-auto"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="">Filter by Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Sort Filter */}
          <select
            className="form-select w-auto"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="">Sort by</option>
            <option value="timeToClose">Time to Close</option>
          </select>

          {/* Add Lead Button */}
          <button className="btn-add" onClick={() => navigate("/addNewLead")}>
            Add New Lead
          </button>
        </div>

        {/* Leads List */}
        <div className="leads-list">
          {!filteredLeads.length ? (
            <div className="text-center text-muted py-5">
              <p>No leads found.</p>
            </div>
          ) : (
            filteredLeads.map((lead, index) => (
              <div
                key={lead._id || lead.id || index}
                className="lead-item border rounded p-3 mb-3 shadow-sm"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/leads/${lead._id || lead.id}`)}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className="mb-1">{lead.name || `Lead ${index + 1}`}</h5>
                    <small className="text-muted">
                      {lead.status || "No Status"} |{" "}
                      {lead.priority?.join(", ") || "No Priority"}
                    </small>
                  </div>
                  <div>
                    <span className="badge btn-add text-white fw-bolder">
                      {lead.source || "Unknown Source"}
                    </span>
                  </div>
                </div>

                {lead.email && <p className="mb-0 mt-2">{lead.email}</p>}
                {lead.phone && <p className="mb-0">{lead.phone}</p>}
                {lead.company && <p className="mb-0">{lead.company}</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
