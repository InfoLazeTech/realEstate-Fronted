// src/pages/LeadsPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeads, createLead, deleteLead } from "../redux/feature/leadSlice";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

const Button = ({ children, className = "", ...props }) => (
  <button
    className={`px-3 py-1 rounded-md text-sm transition ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default function LeadsPage() {
  const dispatch = useDispatch();
  const {
    items: leads = [],
    total,
    page = 1,
    pages = 1,
    loading,
    error,
  } = useSelector((state) => state.leads || {});

  const [filters, setFilters] = useState({
    name: "",
    score: "",
    stage: "",
    priority: "",
  });
  const [importing, setImporting] = useState(false); // ✅ show loader while importing

  useEffect(() => {
    dispatch(fetchLeads({ ...filters, page: 1 }));
  }, [dispatch]);

  // ✅ Import Excel
  const [importMessage, setImportMessage] = useState(""); // ✅ inline message
  const getPriority = (budget) => {
    if (!budget) return "Medium"; // default
    const amount = parseInt(String(budget).replace(/[^0-9]/g, ""), 10);
    if (isNaN(amount)) return "Medium";
    if (amount >= 500000) return "High";
    if (amount >= 200000) return "Medium";
    return "Low";
  };
  // ✅ Normalize Score
  const normalizeScore = (val) => {
    if (!val) return "";
    const clean = String(val).trim().toLowerCase();
    if (clean.includes("hot")) return "Hot";
    if (clean.includes("warm")) return "Warm";
    if (clean.includes("cold")) return "Cold";
    return ""; // invalid values -> empty
  };

  const handleImportExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImporting(true); // show loader
    setImportMessage("");

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet);

        // Utility: calculate priority based on budget

        for (const row of rows) {
          const mapped = {
            name: row["Name"] || "",
            budget: row["Budget"] ? String(row["Budget"]) : "",
            location: row["Location"] || "",
            score: normalizeScore(row["Score"]),
            stage: row["Stage"] || "",
          };
          if (mapped.name) {
            await dispatch(createLead(mapped));
          }
        }

        // 🔄 Refetch leads so you see imported ones immediately
        await dispatch(fetchLeads({ ...filters, page: 1 }));
        setImportMessage("✅ Excel imported successfully");
      } catch (err) {
        console.error("Import failed:", err);
        setImportMessage("✅ Excel imported successfully");
      } finally {
        setImporting(false); // hide loader
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // ✅ Export Excel
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(leads);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    XLSX.writeFile(workbook, "leads.xlsx");
  };

  // ✅ Download Import Template
  const handleDownloadTemplate = () => {
    const headers = [["Name", "Budget", "Location", "Score", "Stage"]];
    const worksheet = XLSX.utils.aoa_to_sheet(headers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "LeadsTemplate.xlsx");
  };

  const applyFilters = () => dispatch(fetchLeads({...filters,page: 1}));
  const clearFilters = () => {
    setFilters({ name: "", score: "", stage: "", priority: "" });
   dispatch(fetchLeads({  page: 1 }));
  };
  const handleDelete = (id) => {
    if (!window.confirm("Delete this lead?")) return;
    dispatch(deleteLead(id));
  };
  const handlePageChange = (newPage) =>
    dispatch(fetchLeads({ ...filters, page: newPage }));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Leads</h1>
          <p className="text-sm text-gray-600">Manage and filter your leads</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/leads/new"
            className="px-4 py-2 bg-blue-500 rounded text-white hover:bg-blue-600 transition"
          >
            + New Lead
          </Link>
          <Button
            className="bg-green-500 text-white hover:bg-green-600"
            onClick={handleExportExcel}
          >
            Export Excel
          </Button>
          <label className="px-4 py-2 bg-orange-400 text-white rounded cursor-pointer hover:bg-orange-500 transition">
            Import Excel
            <input
              type="file"
              accept=".xlsx, .xls"
              className="hidden"
              onChange={handleImportExcel}
            />
          </label>
          <Button
            className="bg-blue-400 text-white hover:bg-blue-500"
            onClick={handleDownloadTemplate}
          >
            Download Template
          </Button>
          <Button
            className="bg-gray-300 hover:bg-gray-400"
            onClick={() => dispatch(fetchLeads({ ...filters, page: 1 }))}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* ✅ Import Loader */}
     {importing && (
  <div className="flex items-center gap-2 mb-4 text-blue-600 font-medium">
    <svg
      className="animate-spin h-5 w-5 text-blue-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      ></path>
    </svg>
    Importing leads... Please wait
  </div>
)}


      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col md:flex-row gap-3 md:items-center">
        <input
          placeholder="Search by name..."
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          className="border p-2 rounded-md flex-1"
        />
        <select
          value={filters.score}
          onChange={(e) => setFilters({ ...filters, score: e.target.value })}
          className="border p-2 rounded-md w-40"
        >
          <option value="">All Scores</option>
          <option value="Hot">Hot</option>
          <option value="Warm">Warm</option>
          <option value="Cold">Cold</option>
        </select>
        <select
          value={filters.stage}
          onChange={(e) => setFilters({ ...filters, stage: e.target.value })}
          className="border p-2 rounded-md w-48"
        >
          <option value="">All Stages</option>
          <option>New Lead</option>
          <option>Qualified</option>
          <option>Property Matching</option>
          <option>Contacted</option>
          <option>Visit Scheduled</option>
          <option>Negotiation</option>
          <option>Closing</option>
          <option>Post-Sale</option>
        </select>
        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          className="border p-2 rounded-md w-36"
        >
          <option value="">All Priorities</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <div className="ml-auto flex gap-2">
          <Button
            className="bg-blue-500 text-white hover:bg-blue-600"
            onClick={applyFilters}
          >
            Apply
          </Button>
          <Button
            className="bg-gray-200 hover:bg-gray-300"
            onClick={clearFilters}
          >
            Clear
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray shadow rounded overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm text-gray-600">No</th>
              <th className="px-4 py-3 text-left text-sm text-gray-600">
                Name
              </th>
              <th className="px-4 py-3 text-sm text-gray-600">Budget</th>
              <th className="px-4 py-3 text-sm text-gray-600">Location</th>
              <th className="px-4 py-3 text-sm text-gray-600">Score</th>
              <th className="px-4 py-3 text-sm text-gray-600">Stage</th>
              <th className="px-4 py-3 text-sm text-gray-600">Priority</th>
              <th className="px-4 py-3 text-sm text-gray-600">Notes</th>
              <th className="px-4 py-3 text-sm text-gray-600">Reminders</th>
              <th className="px-4 py-3 text-sm text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan="9" className="p-6 text-center text-gray-500">
                  No leads found
                </td>
              </tr>
            ) : (
              leads.map((lead, index) => (
                <tr key={lead._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{(page - 1) * 10 + index + 1}</td>
                  <td className="px-4 py-3">{lead.name}</td>
                  <td className="px-4 py-3">{lead.budget}</td>
                  <td className="px-4 py-3">{lead.location}</td>
                  <td className="px-4 py-3">{lead.score}</td>
                  <td className="px-4 py-3">{lead.stage}</td>
                  <td className="px-4 py-3">{lead.priority}</td>
                  <td className="px-4 py-3">{(lead.notes || []).length}</td>
                  <td className="px-4 py-3">{(lead.reminders || []).length}</td>
                  <td className="px-4 py-3 flex gap-2">
                    <Link
                      to={`/leads/${lead._id}`}
                      className="px-2 py-1 bg-gray-300 rounded text-sm hover:bg-gray-400"
                    >
                      View
                    </Link>
                    <Link
                      to={`/leads/${lead._id}/edit`}
                      className="px-2 py-1 bg-blue-300 rounded text-white text-sm hover:bg-blue-400"
                    >
                      Edit
                    </Link>
                    <Button
                      className="bg-red-400 text-white hover:bg-red-400 cursor-pointer"
                      onClick={() => handleDelete(lead._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="mt-6 flex justify-end gap-2 flex-wrap">
          <Button
            className={`px-3 py-1 ${
              page === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-400 hover:bg-gray-500"
            }`}
            onClick={() => page > 1 && handlePageChange(1)}
            disabled={page === 1}
          >
            {"<<"}
          </Button>
          <Button
            className={`px-3 py-1 ${
              page === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-400 hover:bg-gray-500"
            }`}
            onClick={() => page > 1 && handlePageChange(page - 1)}
            disabled={page === 1}
          >
            Prev
          </Button>
          {Array.from({ length: pages }, (_, i) => (
            <Button
              key={i + 1}
              className={`px-3 py-1 rounded ${
                page === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-400 hover:bg-gray-500"
              }`}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            className={`px-3 py-1 ${
              page === pages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-400 hover:bg-gray-500"
            }`}
            onClick={() => page < pages && handlePageChange(page + 1)}
            disabled={page === pages}
          >
            Next
          </Button>
          <Button
            className={`px-3 py-1 ${
              page === pages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gray-400 hover:bg-gray-500"
            }`}
            onClick={() => handlePageChange(pages)}
            disabled={page === pages}
          >
            {">>"}
          </Button>
        </div>
      )}

      {error && <div className="mt-3 text-red-500">{String(error)}</div>}
    </div>
  );
}
