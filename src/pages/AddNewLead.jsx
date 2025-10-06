import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { ToastContainer, toast } from "react-toastify";

export default function AddNewLead({ onLeadAdded }) {
  const navigate = useNavigate();

  const [agents, setAgents] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [priorityDropdownOpen, setPriorityDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const priorityDropdownRef = useRef();

  const [formData, setFormData] = useState({
    name: "",
    source: "",
    salesAgent: [],
    status: "New",
    timeToClose: 0,
    priority: [],
  });

  // Fetch agents
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch("https://anvaya-crm-ebon.vercel.app/api/agent");
        const data = await res.json();
        setAgents(data.data || []);
      } catch (err) {
        console.error("Error fetching agents:", err);
      }
    };
    fetchAgents();
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (
        priorityDropdownRef.current &&
        !priorityDropdownRef.current.contains(event.target)
      ) {
        setPriorityDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle sales agent selection
  const handleCheckboxChange = (agentId) => {
    setFormData((prev) => ({
      ...prev,
      salesAgent: prev.salesAgent.includes(agentId)
        ? prev.salesAgent.filter((id) => id !== agentId)
        : [...prev.salesAgent, agentId],
    }));
  };

  // Toggle priority selection
  const handlePriorityChange = (p) => {
    setFormData((prev) => ({
      ...prev,
      priority: prev.priority.includes(p)
        ? prev.priority.filter((pr) => pr !== p)
        : [...prev.priority, p],
    }));
  };

  // Generic input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "timeToClose" ? parseInt(value, 10) : value,
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("https://anvaya-crm-ebon.vercel.app/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Error adding lead", {
          position: "bottom-right",
        });
        return;
      }

      toast.success("Lead added successfully!", {
        position: "bottom-right",
        theme: "colored",
        autoClose: 1700,
        onClose: () => navigate("/leads"),
      });

      if (onLeadAdded) onLeadAdded();
    } catch (err) {
      console.error("Error adding lead:", err);
      toast.error("Network error while adding lead", {
        position: "bottom-right",
      });
    }
  };

  return (
    <div className="app-container">
      <Header />
      <ToastContainer />
      <div className="d-flex justify-content-center mt-5">
        <div className="card shadow p-4" style={{ maxWidth: "600px", width: "100%" }}>
          <h2 className="mb-4 text-center">Add New Lead</h2>

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

            {/* Sales Agents Multi-Select */}
            <div className="mb-3" ref={dropdownRef} style={{ position: "relative" }}>
              <label className="form-label">Sales Agents</label>
              <div
                className="border rounded d-flex align-items-center justify-content-between p-2"
                style={{ cursor: "pointer", backgroundColor: "#fff" }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {formData.salesAgent.length > 0
                  ? agents
                      .filter((a) => formData.salesAgent.includes(a._id))
                      .map((a) => a.name)
                      .join(", ")
                  : "Select Agents"}
                <span>&#9662;</span>
              </div>

              {dropdownOpen && (
                <div
                  className="border rounded p-2 position-absolute shadow"
                  style={{
                    maxHeight: "150px",
                    overflowY: "auto",
                    zIndex: 1000,
                    width: "100%",
                    backgroundColor: "white",
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

            {/* Priority Multi-Select */}
            <div className="mb-4" ref={priorityDropdownRef} style={{ position: "relative" }}>
              <label className="form-label">Priority</label>
              <div
                className="border rounded d-flex align-items-center justify-content-between p-2"
                style={{ cursor: "pointer", backgroundColor: "#fff" }}
                onClick={() => setPriorityDropdownOpen(!priorityDropdownOpen)}
              >
                {formData.priority.length > 0
                  ? formData.priority.join(", ")
                  : "Select Priority"}
                <span>&#9662;</span>
              </div>

              {priorityDropdownOpen && (
                <div
                  className="border rounded p-2 position-absolute shadow"
                  style={{
                    maxHeight: "120px",
                    overflowY: "auto",
                    zIndex: 1000,
                    width: "100%",
                    backgroundColor: "white",
                  }}
                >
                  {["High", "Medium", "Low"].map((p) => (
                    <div key={p} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={p}
                        checked={formData.priority.includes(p)}
                        onChange={() => handlePriorityChange(p)}
                      />
                      <label className="form-check-label" htmlFor={p}>
                        {p}
                      </label>
                    </div>
                  ))}
                </div>
              )}
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
