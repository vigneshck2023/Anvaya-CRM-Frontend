import Header from "../components/Header";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Agent({ addAgent }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://anvaya-crm-ebon.vercel.app/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (!response.ok) {
        toast.error(data.message || "Error adding agent", {
          position: "bottom-right",
          theme: "colored",
          autoClose: 1700,
        });
        return;
      }

      toast.success("Agent added successfully!", {
        position: "bottom-right",
        theme: "colored",
        autoClose: 1700,
      });

      if (addAgent) addAgent();

      setTimeout(() => navigate("/salesAgent"), 1700);
    } catch (error) {
      console.error("Error adding agent:", error);
      toast.error("Network error. Please try again later.", {
        position: "bottom-right",
        theme: "colored",
        autoClose: 1700,
      });
    }
  };

  return (
    <div className="app-container">
      <Header />
      <ToastContainer />

      <div className="d-flex justify-content-center mt-5">
        <div className="card shadow p-4" style={{ maxWidth: "600px", width: "100%" }}>
          <h2 className="mb-4 text-center" style={{ color: "#223348" }}>
            Add New Sales Agent
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Agent Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Agent Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Agent Contact</label>
              <input
                type="text"
                className="form-control"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Agent Role</label>
              <input
                type="text"
                className="form-control"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              />
            </div>

            <div className="d-grid">
              <button type="submit" className="btn-add">
                Add New Agent
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
