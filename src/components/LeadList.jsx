import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeads, deleteLead } from "../redux/feature/leadSlice";
import React from "react";

export default function LeadList() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.leads);

  useEffect(() => {
    dispatch(fetchLeads());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Leads</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Name</th>
            <th>Budget</th>
            <th>Score</th>
            <th>Stage</th>
            <th>Priority</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((lead) => (
            <tr key={lead._id} className="border-t">
              <td className="p-2">{lead.name}</td>
              <td>{lead.budget}</td>
              <td>{lead.score}</td>
              <td>{lead.stage}</td>
              <td className="font-semibold">{lead.priority}</td>
              <td>
                <button
                  onClick={() => dispatch(deleteLead(lead._id))}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
