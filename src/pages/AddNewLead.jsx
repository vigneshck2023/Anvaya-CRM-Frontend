import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function AddNewLead({ onLeadAdded }) {
  const navigate = useNavigate();
  const [agents, setAgents] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const [formData, setFormData] = useState({
    name: "",
    source: "",
    salesAgent: [],
    status: "New",
    timeToClose: 0,
    priority: "",
  });

  // Fetch agents from backend
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch(
          "https://anvaya-crm-ebon.vercel.app/api/agent"
        );
        const data = await response.json();
        setAgents(data.data || []);
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };
    fetchAgents();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCheckboxChange = (agentId) => {
    setFormData((prev) => {
      const isSelected = prev.salesAgent.includes(agentId);
      if (isSelected) {
        return {
          ...prev,
          salesAgent: prev.salesAgent.filter((id) => id !== agentId),
        };
      } else {
        return { ...prev, salesAgent: [...prev.salesAgent, agentId] };
      }
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "timeToClose" ? parseInt(value, 10) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://anvaya-crm-ebon.vercel.app/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (!response.ok) {
        alert("Error adding lead: " + (data.message || "Unknown error"));
        return;
      }

      if (onLeadAdded) onLeadAdded();
      navigate("/");
    } catch (error) {
      console.error("Error adding lead:", error);
      alert("Error adding lead (network issue)");
    }
  };

  return (
    <div className="app-container">
      <Header />
      <div className="d-flex justify-content-center mt-5">
        <div className="card shadow p-4" style={{ maxWidth: "600px", width: "100%" }}>
          <h2 className="mb-4 text-center" style={{ color: "#223348" }}>
            Add New Lead
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Lead Name */}
            <div className="mb-3">
              <label className="form-label">Lead Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Lead Source */}
            <div className="mb-3">
              <label className="form-label">Lead Source</label>
              <select
                className="form-select"
                name="source"
                value={formData.source}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Referral">Referral</option>
                <option value="Website">Website</option>
                <option value="Cold Call">Cold Call</option>
              </select>
            </div>

            {/* Sales Agent - Multi Select Checkbox Dropdown */}
            {/* Sales Agent - Multi Select Checkbox Dropdown */}
<div className="mb-3" ref={dropdownRef} style={{ position: "relative" }}>
  <label className="form-label">Sales Agents</label>
  <div
    className="form-select d-flex align-items-center justify-content-between"
    onClick={() => setDropdownOpen(!dropdownOpen)}
    style={{ cursor: "pointer", minHeight: "38px" }}
  >
      {formData.salesAgent.length > 0
        ? agents
            .filter((a) => formData.salesAgent.includes(a._id))
            .map((a) => a.name)
            .join(", ")
        : "Select Agents"}
  </div>

  {dropdownOpen && (
    <div
      className="border rounded p-2 position-absolute bg-white shadow"
      style={{
        maxHeight: "150px",
        overflowY: "auto",
        zIndex: 1000,
        width: "100%",
      }}
    >
      {agents.map((agent) => (
        <div key={agent._id} className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id={agent._id}
            checked={formData.salesAgent.includes(agent._id)}
            onChange={() => handleCheckboxChange(agent._id)}
          />
          <label className="form-check-label" htmlFor={agent._id}>
            {agent.name}
          </label>
        </div>
      ))}
    </div>
  )}
</div>


            {/* Lead Status */}
            <div className="mb-3">
              <label className="form-label">Lead Status</label>
              <select
                className="form-select"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="New">New</option>
                <option value="Qualified">Qualified</option>
                <option value="Contracted">Contracted</option>
              </select>
            </div>

            {/* Time to Close */}
            <div className="mb-3">
              <label className="form-label">Time to Close (days)</label>
              <input
                type="number"
                className="form-control"
                name="timeToClose"
                value={formData.timeToClose}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            {/* Priority */}
            <div className="mb-4">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Submit button */}
            <div className="d-grid">
              <button type="submit" className="btn-add">
                Add New Lead
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
