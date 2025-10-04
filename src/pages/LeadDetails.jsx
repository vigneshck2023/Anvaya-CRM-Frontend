import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "bootstrap/dist/css/bootstrap.min.css";

export default function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchLead();
  }, []);

  const fetchLead = async () => {
    try {
      setLoading(true);
      const res = await fetch(`https://anvaya-crm-ebon.vercel.app/leads/${id}`);
      if (!res.ok) throw new Error("Failed to fetch lead");
      const data = await res.json();
      setLead(data.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Could not load lead. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      const res = await fetch(`https://anvaya-crm-ebon.vercel.app/leads/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author: "You", text: newComment })
      });

      if (!res.ok) throw new Error("Failed to add comment");
      const data = await res.json();

      setLead({ ...lead, comments: data.data });
      setNewComment("");
    } catch (err) {
      console.error(err);
      alert("Failed to post comment");
    }
  };

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error) return <p className="text-center mt-4 text-danger">{error}</p>;
  if (!lead) return null;

  return (
    <>
      <Header />
      <div className="container my-4">
        <h2 className="mb-4 text-primary">Lead Management: {lead.name}</h2>

        <div className="row g-4">
          {/* Lead Details */}
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-3">Lead Details</h5>
                <p><strong>Lead Name:</strong> {lead.name}</p>
                <p>
                  <strong>Sales Agents:</strong>{" "}
                  {lead.salesAgent && lead.salesAgent.length > 0
                    ? lead.salesAgent.map((agent, idx) => (
                        <span key={agent._id}>
                          {agent.name}{idx < lead.salesAgent.length - 1 ? ", " : ""}
                        </span>
                      ))
                    : "No agents assigned"}
                </p>
                <p><strong>Source:</strong> {lead.source}</p>
                <p><strong>Status:</strong> {lead.status}</p>
                <p><strong>Priority:</strong> {lead.priority}</p>
                <p><strong>Time to Close:</strong> {lead.timeToClose} days</p>
                <button className="btn btn-secondary mt-2" onClick={() => navigate("/leads")}>
                  Back to Leads
                </button>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="col-md-6">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="card-title mb-3">Comments</h5>

                {(!lead.comments || lead.comments.length === 0) && (
                  <p className="text-muted">No comments yet.</p>
                )}

                {lead.comments?.map((c, idx) => (
                  <div key={idx} className="mb-3 p-3 bg-light rounded">
                    <p className="mb-1"><strong>{c.author}</strong> - {new Date(c.date).toLocaleString()}</p>
                    <p className="mb-0">{c.text}</p>
                  </div>
                ))}

                {/* Add New Comment */}
                <div className="mt-3">
                  <textarea
                    className="form-control mb-2"
                    placeholder="Add a new comment..."
                    rows="3"
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
        </div>
      </div>
    </>
  );
}
