import Header from "../components/Header";
import "../styles.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Lead() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://anvaya-crm-ebon.vercel.app/leads");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data);

      if (Array.isArray(data)) {
        setLeads(data);
      } else if (data && Array.isArray(data.leads)) {
        setLeads(data.leads);
      } else if (data && data.data && Array.isArray(data.data)) {
        setLeads(data.data);
      } else {
        setLeads([data]);
      }

      setError(null);
    } catch (err) {
      console.error("Error fetching leads:", err);
      setError("Failed to load leads. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredLeads = () => {
    if (!Array.isArray(leads)) return [];

    if (filter === "all") {
      return leads;
    }

    return leads.filter((lead) => lead && lead.status === filter);
  };

  const filteredLeads = getFilteredLeads();

  // --- Loading State ---
  if (loading) {
    return (
      <div className="app-container">
        <Header />
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading Data...</p>
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
          <button className="btn btn-primary" onClick={fetchLeads}>
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
        {/* Row 2: Filters */}
        <div className="filters">
          <select
            className="filter-dropdown"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Leads</option>
            <option value="New">New Lead</option>
            <option value="Contracted">Contracted Lead</option>
            <option value="Qualified">Qualified Lead</option>
          </select>
          <button
            className="btn-add"
            onClick={() => navigate("/addNewLead")}
          >
            Add New Lead
          </button>
        </div>

        {/* Row 3: Leads List */}
        <div className="py-4">
          <div className="leads-list">
            {!Array.isArray(leads) || filteredLeads.length === 0 ? (
              <div className="no-leads">
                {!Array.isArray(leads)
                  ? "Invalid data format received"
                  : "No leads found"}
              </div>
            ) : (
              filteredLeads.map((lead, index) => (
                <div
                  key={lead.id || lead._id || index}
                  className="lead-item"
                  onClick={() =>
                    navigate(`/leads/${lead._id || lead.id}`)
                  }
                  style={{ cursor: "pointer" }}
                >
                  <div className="lead-info">
                    <div className="lead-name">
                      {lead.name ||
                        lead.fullName ||
                        `Lead ${index + 1}`}
                    </div>
                    <div className="lead-status">
                      ({lead.status || "No Status"})
                    </div>
                  </div>
                  {lead.email && (
                    <div className="lead-email">{lead.email}</div>
                  )}
                  {lead.phone && (
                    <div className="lead-phone">{lead.phone}</div>
                  )}
                  {lead.company && (
                    <div className="lead-company">{lead.company}</div>
                  )}
                  {index < filteredLeads.length - 1 && <hr />}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
