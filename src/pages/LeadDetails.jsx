import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchLead();
    fetchAgents();
  }, []);

  const fetchLead = async () => {
    try {
      setLoading(true);
      const res = await fetch(`https://anvaya-crm-ebon.vercel.app/leads/${id}`);
      const data = await res.json();
      const leadData = data.data;

      setLead({
        ...leadData,
        salesAgent: leadData.salesAgent || [],
        priority: leadData.priority || [],
        comments: leadData.comments || [],
      });

      setFormData({
        name: leadData.name || "",
        source: leadData.source || "",
        status: leadData.status || "New",
        timeToClose: leadData.timeToClose || 0,
        priority: leadData.priority || [],
        salesAgent: (leadData.salesAgent || []).map((a) => a._id),
      });
    } catch (err) {
      toast.error("Failed to fetch lead", { position: "bottom-right" });
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await fetch("https://anvaya-crm-ebon.vercel.app/api/agent");
      const data = await res.json();
      setAgents(data.data || []);
    } catch (err) {
      toast.error("Failed to fetch agents", { position: "bottom-right" });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "timeToClose" ? parseInt(value) : value,
    }));
  };

  const handleCheckboxChange = (agentId) => {
    setFormData((prev) => ({
      ...prev,
      salesAgent: prev.salesAgent.includes(agentId)
        ? prev.salesAgent.filter((id) => id !== agentId)
        : [...prev.salesAgent, agentId],
    }));
  };

  const handlePriorityChange = (p) => {
    setFormData((prev) => ({
      ...prev,
      priority: prev.priority.includes(p)
        ? prev.priority.filter((pr) => pr !== p)
        : [...prev.priority, p],
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const selectedAgents = agents.filter((a) =>
        formData.salesAgent.includes(a._id),
      );
      const payload = {
        ...formData,
        salesAgent: selectedAgents.map((a) => a._id),
      };

      const res = await fetch(
        `https://anvaya-crm-ebon.vercel.app/api/lead/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) throw new Error("Failed to update lead");
      const data = await res.json();
      setLead(data.data);
      setIsEditing(false);
      toast.success("Lead updated successfully", {
        position: "bottom-right",
        autoClose: 1700,
        theme: "colored",
      });
    } catch (err) {
      console.error(err);
      toast.error("Error updating lead", {
        position: "bottom-right",
        autoClose: 1700,
        theme: "colored",
      });
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await fetch(
        `https://anvaya-crm-ebon.vercel.app/leads/${id}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ author: "You", text: newComment }),
        },
      );

      if (!res.ok) throw new Error("Failed to add comment");
      const data = await res.json();
      setLead((prev) => ({ ...prev, comments: data.data || [] }));
      setNewComment("");
    } catch (err) {
      toast.error("Failed to add comment", {
        position: "bottom-right",
        theme: "colored",
      });
    }
  };

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (!lead) return <p className="text-center mt-4">Lead not found</p>;

  return (
    <>
      <Header />
      <ToastContainer />
      <div className="container my-4">
        <h2 className="mb-4 text-primary">Lead: {lead.name}</h2>

        <div className="row">
          {/* Lead Details Column */}
          <div className="col-md-6">
            <div className="card shadow-sm p-3 mb-4">
              {/* Name */}
              <div className="mb-2">
                <strong>Name: </strong>
                {isEditing ? (
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{lead.name}</span>
                )}
              </div>

              {/* Source */}
              <div className="mb-2">
                <strong>Source: </strong>
                {isEditing ? (
                  <select
                    className="form-select"
                    name="source"
                    value={formData.source}
                    onChange={handleChange}
                  >
                    <option value="Referral">Referral</option>
                    <option value="Website">Website</option>
                    <option value="Cold Call">Cold Call</option>
                  </select>
                ) : (
                  <span>{lead.source}</span>
                )}
              </div>

              {/* Status */}
              <div className="mb-2">
                <strong>Status: </strong>
                {isEditing ? (
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
                ) : (
                  <span>{lead.status}</span>
                )}
              </div>

              {/* Time to Close */}
              <div className="mb-2">
                <strong>Time to Close: </strong>
                {isEditing ? (
                  <input
                    type="number"
                    className="form-control"
                    name="timeToClose"
                    value={formData.timeToClose}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{lead.timeToClose} days</span>
                )}
              </div>

              {/* Priority */}
              <div className="mb-2">
                <strong>Priority: </strong>
                {isEditing ? (
                  <div>
                    {["High", "Medium", "Low"].map((p) => (
                      <div key={p} className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={formData.priority.includes(p)}
                          onChange={() => handlePriorityChange(p)}
                        />
                        <label className="form-check-label">{p}</label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span>{lead.priority.join(", ")}</span>
                )}
              </div>

              {/* Sales Agents */}
              <div className="mb-2">
                <strong>Sales Agents: </strong>
                {isEditing ? (
                  <div>
                    {agents.map((agent) => (
                      <div key={agent._id} className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={formData.salesAgent.includes(agent._id)}
                          onChange={() => handleCheckboxChange(agent._id)}
                        />
                        <label className="form-check-label">{agent.name}</label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span>{lead.salesAgent.map((a) => a.name).join(", ")}</span>
                )}
              </div>

              {/* Buttons */}
              <div className="mt-3 d-flex gap-2">
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate("/leads")}
                >
                  Back to Leads
                </button>
                <button
                  className={`btn ${isEditing ? "btn-success" : "btn-primary"}`}
                  onClick={
                    isEditing ? handleSaveChanges : () => setIsEditing(true)
                  }
                >
                  {isEditing ? "Save Changes" : "Edit Info"}
                </button>
              </div>
            </div>
          </div>

          {/* Comments Column */}
          <div className="col-md-6">
            <div className="card shadow-sm p-3 mb-4">
              <h5 className="mb-3">Comments</h5>

              {/* Scrollable comments list */}
              <div
                className="mb-2"
                style={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  paddingRight: "5px",
                }}
              >
                {lead.comments.length === 0 && (
                  <p className="text-muted">No comments yet.</p>
                )}

                {lead.comments.map((c, idx) => (
                  <div key={idx} className="mb-2 p-2 bg-light rounded">
                    <p className="mb-1">
                      <strong>{c.author}</strong> -{" "}
                      {new Date(c.date).toLocaleString()}
                    </p>
                    <p className="mb-0">{c.text}</p>
                  </div>
                ))}
              </div>

              {/* Comment input */}
              <textarea
                className="form-control mb-2"
                rows="3"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>
              <button className="btn btn-primary" onClick={handleCommentSubmit}>
                Submit Comment
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
