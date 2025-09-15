// src/pages/AddLeadPage.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createLead } from "../redux/feature/leadSlice";
import { User, DollarSign, MapPin, Star, Workflow, Loader2 } from "lucide-react";

const Input = ({ label, icon: Icon, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium text-gray-600">{label}</label>
    <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 transition">
      {Icon && <Icon className="text-gray-400 mr-2 h-4 w-4" />}
      <input
        className="bg-transparent flex-1 outline-none text-sm text-gray-700 placeholder-gray-400"
        {...props}
      />
    </div>
  </div>
);

const Select = ({ label, icon: Icon, options, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-medium text-gray-600">{label}</label>
    <div className="flex items-center border rounded-lg px-3 py-2 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 transition">
      {Icon && <Icon className="text-gray-400 mr-2 h-4 w-4" />}
      <select
        className="bg-transparent flex-1 outline-none text-sm text-gray-700"
        {...props}
      >
        <option value="">-- Select --</option>
        {options.map((opt) => (
          <option key={opt} value={opt.trim()}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default function AddLeadPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    budget: "",
    location: "",
    score: "",
    stage: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(createLead(formData)).unwrap();
      navigate("/leads");
    } catch (err) {
      alert("Error creating lead: " + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-gray-100 p-6 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <h1 className="text-xl font-bold mb-5 text-gray-800 flex items-center gap-2">
            ➕ Add Lead
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Name"
              icon={User}
              placeholder="Enter lead name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <Input
              label="Budget"
              icon={DollarSign}
              placeholder="Enter budget"
              value={formData.budget}
              onChange={(e) =>
                setFormData({ ...formData, budget: e.target.value })
              }
            />
            <Input
              label="Location"
              icon={MapPin}
              placeholder="Enter location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
            <Select
              label="Score"
              icon={Star}
              value={formData.score}
              onChange={(e) =>
                setFormData({ ...formData, score: e.target.value })
              }
              options={["Hot", "Warm", "Cold"]}
            />
            <Select
              label="Stage"
              icon={Workflow}
              value={formData.stage}
              onChange={(e) =>
                setFormData({ ...formData, stage: e.target.value })
              }
              options={[
                "New Lead",
                "Qualified",
                "Property Matching",
                "Contacted",
                "Visit Scheduled",
                "Negotiation",
                "Closing",
                "Post-Sale",
              ]}
            />

            {/* Buttons */}
            <div className="flex gap-3 justify-end pt-3">
              <button
                type="button"
                onClick={() => navigate("/leads")}
                disabled={loading}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 bg-white hover:bg-gray-100 transition text-sm disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition text-sm flex items-center gap-2 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Lead"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
