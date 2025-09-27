import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import AddNewLead from "./pages/AddNewLead";
import Lead from "./pages/Lead";
import LeadDetails from "./pages/LeadDetails";
import Agent from "./pages/Agent";
import Sales from "./pages/Sales";
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles.css";

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/addNewLead" element={<AddNewLead />} />
      <Route path="/leads" element={<Lead/>} />
     <Route path="/leads/:id" element={<LeadDetails />} />
     <Route path="/addAgents" element={<Agent />} />
     <Route path="/salesAgent" element={<Sales/>} />
    </Routes>
  </BrowserRouter>
);
