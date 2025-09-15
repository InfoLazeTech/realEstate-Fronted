// src/pages/EditLeadPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getSingleLead, updateLead } from "../redux/feature/leadSlice";
import { Loader2 } from "lucide-react";

const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <input
      className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
      {...props}
    />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-700">{label}</label>
    <select
      className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
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

export default function EditLeadPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.leads);

  const existingLead = items.find((l) => l._id === id);

  const [formData, setFormData] = useState({
    name: "",
    budget: "",
    location: "",
    score: "",
    stage: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadLead = async () => {
      if (!existingLead) {
        const res = await dispatch(getSingleLead(id));
        if (res.payload) {
          const { name, budget, location, score, stage } = res.payload;
          setFormData({ name, budget, location, score, stage });
        }
      } else {
        const { name, budget, location, score, stage } = existingLead;
        setFormData({ name, budget, location, score, stage });
      }
    };
    loadLead();
  }, [dispatch, id, existingLead]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(updateLead({ id, lead: formData })).unwrap();
      navigate("/leads");
    } catch (err) {
      alert("Error updating lead: " + JSON.stringify(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
          ✏️ Edit Lead
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-4"
        >
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={() => navigate("/leads")}
              className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 text-sm bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Lead"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
