// src/pages/LeadsPage.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeads, createLead, deleteLead } from "../redux/feature/leadSlice";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";
import { Download, Eye, Filter, FolderDown, Loader2, Plus, RefreshCw, Search, SquarePen, Trash, Upload, X } from "lucide-react";

const Button = ({ children, className = "", ...props }) => (
  <button
    className={`px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm ${className}`}
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
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState("");
  const [deletingLeadId, setDeletingLeadId] = useState(null);


  useEffect(() => {
    dispatch(fetchLeads({ ...filters, page: 1 }));
  }, [dispatch]);

  // Import Excel
  const handleImportExcel = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImporting(true);
    setImportMessage("");
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
        for (const row of rows) {
          const mapped = {
            name: row["Name"] || "",
            budget: row["Budget"] || "",
            location: row["Location"] || "",
            score: row["Score"] || "",
            stage: row["Stage"] || "",
          };
          if (mapped.name) await dispatch(createLead(mapped));
        }
        await dispatch(fetchLeads({ ...filters, page: 1 }));
        setImportMessage("✅ Leads imported successfully!");
      } catch (err) {
        setImportMessage("❌ Import failed, please check the file.");
      } finally {
        setImporting(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(leads);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
    XLSX.writeFile(workbook, "leads.xlsx");
  };

  const handleDownloadTemplate = () => {
    const headers = [["Name", "Budget", "Location", "Score", "Stage"]];
    const worksheet = XLSX.utils.aoa_to_sheet(headers);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");
    XLSX.writeFile(workbook, "LeadsTemplate.xlsx");
  };

  const applyFilters = () => dispatch(fetchLeads({ ...filters, page: 1 }));
  const clearFilters = () => {
    setFilters({ name: "", score: "", stage: "", priority: "" });
    dispatch(fetchLeads({ page: 1 }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lead?")) return;

    try {
      setDeletingLeadId(id);
      await dispatch(deleteLead(id)).unwrap();
      alert("✅ Lead deleted successfully!");
    } catch (err) {
      alert("❌ Failed to delete lead: " + String(err));
    } finally {
      setDeletingLeadId(null);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Leads Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Track, manage, and filter your leads
          </p>
        </div>
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          <Link
            to="/leads/new"
            className="flex items-center gap-2 px-2.5 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            New Lead
          </Link>
          <Button
            className="flex items-center gap-2 bg-white border text-gray-700 rounded-lg px-2.5 py-1.5 hover:bg-gray-100"
            onClick={handleExportExcel}
          >
            <FolderDown className="h-4 w-4" />
            Export
          </Button>

          <label className="flex items-center gap-2 bg-white border text-gray-700 rounded-lg px-2.5 py-1.5 cursor-pointer hover:bg-gray-100">
            <Upload className="h-4 w-4" /> {/* Import icon */}
            Import
            <input
              type="file"
              accept=".xlsx, .xls"
              className="hidden"
              onChange={handleImportExcel}
            />
          </label>
          <Button
            className="flex items-center gap-2 bg-white border text-gray-700 rounded-lg px-2.5 py-1.5 hover:bg-gray-100"
            onClick={handleDownloadTemplate}
          >
            <Download className="h-4 w-4" />
            Download Template
          </Button>

          <Button
            className="flex items-center gap-2 bg-white border text-gray-700 rounded-lg px-2.5 py-1.5 hover:bg-gray-100"
            onClick={() => dispatch(fetchLeads({ ...filters, page: 1 }))}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Import Message */}
      {importing && (
        <div className="mb-4 text-sm text-indigo-600">Importing leads...</div>
      )}
      {importMessage && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${importMessage.includes("✅")
            ? "bg-green-50 text-green-700"
            : "bg-red-50 text-red-700"
            }`}
        >
          {importMessage}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row gap-3 md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <input
            placeholder="Search by name..."
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            className="w-full border rounded-lg pl-9 pr-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>

        {/* Score */}
        <select
          value={filters.score}
          onChange={(e) => setFilters({ ...filters, score: e.target.value })}
          className="border p-1.5 rounded-lg w-40 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Scores</option>
          <option>Hot</option>
          <option>Warm</option>
          <option>Cold</option>
        </select>

        {/* Stage */}
        <select
          value={filters.stage}
          onChange={(e) => setFilters({ ...filters, stage: e.target.value })}
          className="border p-1.5 rounded-lg w-48 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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

        {/* Priority */}
        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          className="border p-1.5 rounded-lg w-36 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Priorities</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        {/* Actions */}
        <div className="ml-auto flex gap-2">
          <Button
            className="flex items-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-1 rounded-lg text-sm"
            onClick={applyFilters}
          >
            <Filter className="h-4 w-4" />
            Apply
          </Button>
          <Button
            className="flex items-center gap-2 bg-white border text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm"
            onClick={clearFilters}
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>


      {/* Leads Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-collapse">
            {/* Header */}
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wide">
              <tr>
                {[
                  "No",
                  "Name",
                  "Budget",
                  "Location",
                  "Score",
                  "Stage",
                  "Priority",
                  "Notes",
                  "Reminders",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left font-medium border-b border-gray-200"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" className="p-6 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan="10" className="p-6 text-center text-gray-400">
                    No leads found
                  </td>
                </tr>
              ) : (
                leads.map((lead, index) => (
                  <tr
                    key={lead._id}
                    className="hover:bg-gray-50 even:bg-gray-50/30 transition-colors"
                  >
                    <td className="px-4 py-2 border-b border-gray-100">
                      {(page - 1) * 10 + index + 1}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-100 font-medium text-gray-800">
                      {lead.name}
                    </td>
                    <td className="px-4 py-2 border-b border-gray-100">{lead.budget}</td>
                    <td className="px-4 py-2 border-b border-gray-100">{lead.location}</td>
                    <td className="px-4 py-2 border-b border-gray-100">{lead.score}</td>
                    <td className="px-4 py-2 border-b border-gray-100">{lead.stage}</td>
                    <td className="px-4 py-2 border-b border-gray-100">{lead.priority}</td>
                    <td className="px-4 py-2 border-b border-gray-100">{(lead.notes || []).length}</td>
                    <td className="px-4 py-2 border-b border-gray-100">{(lead.reminders || []).length}</td>
                    <td className="px-4 py-2 border-b border-gray-100 flex gap-2">
                      <Link
                        to={`/leads/${lead._id}`}
                        className="p-2 text-gray-600 border rounded-lg hover:bg-gray-100"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        to={`/leads/${lead._id}/edit`}
                        className="p-2 text-indigo-600 border border-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors"
                      >
                        <SquarePen className="h-4 w-4" />
                      </Link>
                      <Button
                        onClick={() => handleDelete(lead._id)}
                        className={`p-2 text-red-600 border border-red-600 rounded-lg transition-colors flex items-center justify-center ${deletingLeadId === lead._id ? "bg-red-50" : "hover:bg-red-50"
                          }`}
                        disabled={deletingLeadId === lead._id}
                      >
                        {deletingLeadId === lead._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash className="h-4 w-4" />
                        )}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>


      {/* Pagination */}
      {pages > 1 && (
        <div className="mt-6 flex justify-end gap-2 flex-wrap">
          <Button
            className={`px-3 py-1 rounded-md ${page === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white border hover:bg-gray-100"
              }`}
            onClick={() =>
              page > 1 && dispatch(fetchLeads({ ...filters, page: page - 1 }))
            }
            disabled={page === 1}
          >
            Prev
          </Button>
          {Array.from({ length: pages }, (_, i) => (
            <Button
              key={i + 1}
              className={`px-3 py-1 rounded-md ${page === i + 1
                ? "bg-indigo-600 text-white"
                : "bg-white border text-gray-700 hover:bg-gray-100"
                }`}
              onClick={() => dispatch(fetchLeads({ ...filters, page: i + 1 }))}
            >
              {i + 1}
            </Button>
          ))}
          <Button
            className={`px-3 py-1 rounded-md ${page === pages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white border hover:bg-gray-100"
              }`}
            onClick={() =>
              page < pages &&
              dispatch(fetchLeads({ ...filters, page: page + 1 }))
            }
            disabled={page === pages}
          >
            Next
          </Button>
        </div>
      )}

      {error && (
        <div className="mt-4 text-red-600 text-sm">{String(error)}</div>
      )}
    </div>
  );
}
