// src/pages/FiltersPage.jsx
import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchLeads } from "../redux/feature/leadSlice";

const Button = ({ children, ...props }) => (
  <button
    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
    {...props}
  >
    {children}
  </button>
);

const Input = ({ ...props }) => (
  <input
    className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
    {...props}
  />
);

export default function FiltersPage() {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({ score: "", stage: "", priority: "" });

  const applyFilters = () => {
    dispatch(fetchLeads(filters));
  };

  return (
    <div className="p-6 flex-1">
      <h2 className="text-3xl font-bold mb-6">🔍 Filters</h2>
      <div className="space-y-4 bg-white p-6 rounded-lg shadow w-full max-w-md">
        <Input
          placeholder="Score (Hot/Warm/Cold)"
          value={filters.score}
          onChange={(e) => setFilters({ ...filters, score: e.target.value })}
        />
        <Input
          placeholder="Stage (Negotiation, Closing...)"
          value={filters.stage}
          onChange={(e) => setFilters({ ...filters, stage: e.target.value })}
        />
        <Input
          placeholder="Priority (High/Medium/Low)"
          value={filters.priority}
          onChange={(e) =>
            setFilters({ ...filters, priority: e.target.value })
          }
        />
        <Button onClick={applyFilters}>Apply Filters</Button>
      </div>
    </div>
  );
}
