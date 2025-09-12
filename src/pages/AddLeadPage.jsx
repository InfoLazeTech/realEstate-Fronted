// src/pages/AddLeadPage.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createLead } from "../redux/feature/leadSlice";

const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      {...props}
    />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <select
      className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createLead(formData)).unwrap();
      navigate("/leads");
    } catch (err) {
      alert("Error creating lead: " + err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-200 p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-extrabold mb-6 text-gray-800 flex items-center gap-2">
          ➕ Add New Lead
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 space-y-5"
        >
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />
          <Input
            label="Budget"
            value={formData.budget}
            onChange={(e) =>
              setFormData({ ...formData, budget: e.target.value })
            }
          />
          <Input
            label="Location"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
          />
          <Select
            label="Score"
            value={formData.score}
            onChange={(e) =>
              setFormData({ ...formData, score: e.target.value })
            }
            options={["Hot", "Warm", "Cold"]}
          />
          <Select
            label="Stage"
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
          <div className="flex gap-4 justify-end">
            <button
              type="button"
              onClick={() => navigate("/leads")}
              className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              Add Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
