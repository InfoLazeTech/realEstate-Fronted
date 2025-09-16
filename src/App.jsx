// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import LeadsPage from "./pages/LeadsPage";
import RemindersPage from "./pages/ReminderPage";
import FiltersPage from "./pages/FilterPage";
import Dashboard from "./pages/DashBoard";
import AddLeadPage from "./pages/AddLeadPage";
import EditLeadPage from "./pages/EditLeadPage";
import LeadDetailsPage from "./pages/LeadDetailPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 bg-gray-50">
          <Routes>
            <Route path="/leads" element={<LeadsPage />} />
            <Route path="/reminders" element={<RemindersPage />} />
            <Route path="/filters" element={<FiltersPage />} />
            <Route path="/" element={<Dashboard />} />{" "}
            <Route path="/leads/new" element={<AddLeadPage />} />
            <Route path="/leads/:id" element={<LeadDetailsPage />} />{" "}
            <Route path="/leads/:id/edit" element={<EditLeadPage />} />{" "}
            {/* ✅ Add this */}
          </Routes>
        </div>
      </div>
         <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
}
