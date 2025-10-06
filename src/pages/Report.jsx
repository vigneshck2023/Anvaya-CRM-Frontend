import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import Header from "../components/Header";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Report() {
  const [leadData, setLeadData] = useState([]);

  useEffect(() => {
    fetch("https://anvaya-crm-ebon.vercel.app/leads")
      .then((res) => res.json())
      .then((res) => setLeadData(res.data || []))
      .catch((err) => console.error("API Error:", err));
  }, []);

  // Total Closed vs Pipeline
  const closedCount = leadData.filter((l) => l.status === "Closed").length;
  const pipelineCount = leadData.length - closedCount;

  const totalLeadsChart = {
    labels: ["Closed", "In Pipeline"],
    datasets: [
      {
        label: "Leads",
        data: [closedCount, pipelineCount],
        backgroundColor: ["#36A2EB", "#FFCE56"],
        borderWidth: 1,
      },
    ],
  };

  // Leads Closed by Sales Agent
  const agentCounts = {};
  leadData.forEach((lead) => {
    if (lead.status === "Closed") {
      const agent = lead.salesAgent || "Unknown";
      agentCounts[agent] = (agentCounts[agent] || 0) + 1;
    }
  });

  const leadsByAgentChart = {
    labels: Object.keys(agentCounts),
    datasets: [
      {
        label: "Leads Closed",
        data: Object.values(agentCounts),
        backgroundColor: "rgba(75, 192, 192, 0.7)",
        borderRadius: 6,
      },
    ],
  };

  // Lead Status Distribution
  const statusCounts = {};
  leadData.forEach((lead) => {
    statusCounts[lead.status] = (statusCounts[lead.status] || 0) + 1;
  });

  const statusChart = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: "Leads",
        data: Object.values(statusCounts),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
    },
  };

  return (
    <div>
      <Header />
      <div className="container py-4">
        <div className="row g-4">
          {/* Total Leads Closed vs Pipeline */}
          <div className="col-md-6">
            <div className="card shadow-sm border-0 rounded-3 p-3">
              <h5 className="text-center mb-3 text-primary">
                Total Leads Closed vs In Pipeline
              </h5>
              <div style={{ height: "300px" }}>
                <Pie data={totalLeadsChart} options={options} />
              </div>
            </div>
          </div>

          {/* Leads Closed by Sales Agent */}
          <div className="col-md-6">
            <div className="card shadow-sm border-0 rounded-3 p-3">
              <h5 className="text-center mb-3 text-success">
                Leads Closed by Sales Agent
              </h5>
              <div style={{ height: "300px" }}>
                <Bar data={leadsByAgentChart} options={options} />
              </div>
            </div>
          </div>

          {/* Lead Status Distribution */}
          <div className="col-md-12">
            <div className="card shadow-sm border-0 rounded-3 p-3">
              <h5 className="text-center mb-3 text-danger">
                Lead Status Distribution
              </h5>
              <div style={{ height: "350px" }}>
                <Pie data={statusChart} options={options} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
