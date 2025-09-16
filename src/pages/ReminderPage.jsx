// src/pages/RemindersPage.jsx
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { addReminder, getSingleLead, fetchLeads } from "../redux/feature/leadSlice";
import {
  Clock,
  PlusCircle,
  BellOff,
  Loader2,
  Search,
  Trash2,
} from "lucide-react";

const Button = ({ children, className = "", ...props }) => (
  <button
    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm 
      bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium 
      hover:from-blue-600 hover:to-blue-700 active:scale-95 transition ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Input = ({ label, className = "", ...props }) => (
  <div className="flex flex-col gap-0.5 flex-1">
    {label && (
      <label className="text-xs font-medium text-gray-600">{label}</label>
    )}
    <input
      className={`border border-gray-300 rounded-md px-2 py-1.5 text-sm 
        bg-white shadow-sm focus:ring-2 focus:ring-blue-500 
        focus:outline-none transition ${className}`}
      {...props}
    />
  </div>
);

export default function RemindersPage() {
  const dispatch = useDispatch();
  const { allItems: leads, loading } = useSelector((state) => state.leads);

  const [selectedLead, setSelectedLead] = useState("");
  const [reminderData, setReminderData] = useState({ date: "", message: "" });
  const [leadReminders, setLeadReminders] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  // ✅ Always fetch full leads list (ignore filters from LeadsPage)
  useEffect(() => {
    if (!leads || leads.length === 0) {
      dispatch(fetchLeads()); // no filters -> pure leads
    }
  }, [dispatch]);

  const handleSearchLead = () => {
    if (!selectedLead) return;
    setHasSearched(true);
    dispatch(getSingleLead(selectedLead))
      .unwrap()
      .then((lead) => setLeadReminders(lead.reminders || []))
      .catch(() => setLeadReminders(null));
  };

  const handleAddReminder = () => {
    if (!selectedLead || !reminderData.date || !reminderData.message) return;
    dispatch(addReminder({ id: selectedLead, reminder: reminderData }))
      .unwrap()
      .then((updatedLead) => {
        setLeadReminders(updatedLead.reminders || []);
        setReminderData({ date: "", message: "" });
      });
  };

  return (
    <div className="p-4 flex-1 space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
          <Clock className="text-blue-600" size={26} /> Reminders
        </h2>
        <div className="h-0.5 w-24 bg-gradient-to-r from-blue-500 to-blue-600 mt-1 rounded-full"></div>
      </div>

      {/* Create Reminder */}
      <div className="bg-white shadow rounded-lg p-4 flex flex-col gap-4">
        <h3 className="text-base font-semibold text-gray-800 border-b pb-1">
          Create Reminder
        </h3>
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Lead Search */}
          <div className="flex-1 relative">
            <label className="text-xs font-medium text-gray-600">
              Search Lead
            </label>
            <input
              type="text"
              value={
                selectedLead
                  ? leads.find((l) => l._id === selectedLead)?.name || ""
                  : searchQuery
              }
              onChange={(e) => {
                setSelectedLead(""); 
                setSearchQuery(e.target.value);
                setHasSearched(false);
              }}
              placeholder="Type lead name..."
              className="border border-gray-300 rounded-md px-2 py-1.5 text-sm w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <Search
              size={16}
              className="absolute right-6 bottom-2.5 text-blue-600 cursor-pointer hover:text-blue-800 transition"
              onClick={handleSearchLead}
            />
            {/* Cancel Icon */}
            {(searchQuery || selectedLead) && (
              <button
                className="absolute right-2 bottom-1.5 text-gray-500 hover:text-red-600"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedLead("");
                  setLeadReminders([]);
                  setHasSearched(false);
                }}
              >
                ✕
              </button>
            )}

            {/* Suggestions */}
            {searchQuery && !selectedLead && (
              <div className="absolute z-10 bg-white border border-gray-200 rounded-md mt-1 w-full max-h-40 overflow-y-auto shadow-lg">
                {leads
                  .filter((lead) =>
                    lead.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((lead) => (
                    <div
                      key={lead._id}
                      className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer"
                      onClick={() => {
                        setSelectedLead(lead._id);
                        setSearchQuery(""); 
                        setHasSearched(true); 
                        handleSearchLead();
                      }}
                    >
                      {lead.name}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Date */}
          <Input
            label="Date"
            type="datetime-local"
            value={reminderData.date}
            onChange={(e) =>
              setReminderData({ ...reminderData, date: e.target.value })
            }
          />

          {/* Message */}
          <Input
            label="Message"
            placeholder="Enter message"
            value={reminderData.message}
            onChange={(e) =>
              setReminderData({ ...reminderData, message: e.target.value })
            }
          />

          {/* Add */}
          <div className="flex items-end mt-5 md:mt-5">
            <Button onClick={handleAddReminder}>
              <PlusCircle size={16} /> Add
            </Button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white shadow rounded-lg p-4">
        <h3 className="text-base font-semibold text-gray-800 border-b pb-1 mb-3">
          Lead Reminders
        </h3>

        {loading ? (
          <div className="flex items-center justify-center gap-2 text-gray-500 py-8 text-sm">
            <Loader2 className="animate-spin" size={16} /> Loading...
          </div>
        ) : !hasSearched ? (
          <div className="flex items-center justify-center gap-2 text-gray-500 py-8 text-sm">
            <BellOff size={16} /> Please search and select a lead.
          </div>
        ) : leadReminders === null ? (
          <div className="flex items-center justify-center gap-2 text-gray-500 py-8 text-sm">
            <BellOff size={16} /> Lead not found.
          </div>
        ) : leadReminders.length === 0 ? (
          <div className="flex items-center justify-center gap-2 text-gray-500 py-8 text-sm">
            <BellOff size={16} /> No reminders for this lead.
          </div>
        ) : (
          <div className="space-y-2">
            {[...leadReminders]
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map((r) => (
                <div
                  key={r._id}
                  className="flex items-center justify-between bg-blue-50 border border-gray-200 rounded-md p-3 hover:shadow-sm transition"
                >
                  <div>
                    <p className="font-medium text-gray-800 text-sm">
                      {r.message}
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(r.date).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        r.notified
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {r.notified ? "Notified" : "Pending"}
                    </span>
                    <button className="text-red-500 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
