import Header from "../components/Header";
import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";

export default function Agent({addAgent}){
    const navigate = useNavigate();
    const [formData,setFormData] = useState({
        name: "",
        email:"",
        phone: "",
        role: ""
});
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
      const response = await fetch("https://anvaya-crm-ebon.vercel.app/api/agents", {
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

      if (addAgent) addAgent();
      navigate("/");
    } catch (error) {
      console.error("Error adding lead:", error);
      alert("Error adding lead (network issue)");
    }
  };

    return (
    <div className="app-container">
      <Header />

      {/* Form section only */}
      <div className="d-flex justify-content-center mt-5">
        <div
          className="card shadow p-4"
          style={{ maxWidth: "600px", width: "100%" }}
        >
          <h2 className="mb-4 text-center" style={{ color: "#223348" }}>
            {" "}
            Add New Sales Agent
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Agent Name */}
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

            {/* Agent Email */}
            <div className="mb-3">
              <label className="form-label">Agent Email</label>
              <input
                type="text"
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
            
            {/* Submit button */}
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