import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import AddNewLead from "./pages/AddNewLead";
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";


root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/addNewLead" element={<AddNewLead />} />
    </Routes>
  </BrowserRouter>
);
