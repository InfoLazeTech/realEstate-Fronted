// src/pages/RemindersPage.jsx
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { addReminder, getSingleLead } from "../redux/feature/leadSlice";
import { Clock, PlusCircle, BellOff, Loader2, Search } from "lucide-react";

const Button = ({ children, className = "", ...props }) => (
  <button
    className={`flex items-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:from-blue-600 hover:to-blue-700 active:scale-95 transition ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={`border-b-2 border-gray-300 focus:border-blue-500 px-2 py-1 bg-transparent w-full outline-none transition ${className}`}
    {...props}
  />
);

export default function RemindersPage() {
  const dispatch = useDispatch();
  const { items: leads, loading } = useSelector((state) => state.leads);

  const [selectedLead, setSelectedLead] = useState("");
  const [reminderData, setReminderData] = useState({ date: "", message: "" });
  const [leadReminders, setLeadReminders] = useState([]);

  // Fetch reminders when clicking Search icon
  const handleSearchLead = () => {
    if (!selectedLead) return;
    dispatch(getSingleLead(selectedLead))
      .unwrap()
      .then((lead) => setLeadReminders(lead.reminders || []))
      .catch(() => setLeadReminders([]));
  };

  // Add reminder handler
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
    <div className="p-6 flex-1 space-y-10">
      {/* Page Title */}
      <div>
        <h2 className="text-4xl font-bold flex items-center gap-3 text-gray-800">
          <Clock className="text-blue-600" size={36} /> Reminders
        </h2>
        <div className="h-1 w-28 bg-gradient-to-r from-blue-500 to-blue-600 mt-2 rounded-full"></div>
      </div>

      {/* Reminder Input Section */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Lead Select with Search icon */}
        <div className="flex-1 relative">
          <select
            value={selectedLead}
            onChange={(e) => setSelectedLead(e.target.value)}
            className="border-b-2 border-gray-300 focus:border-blue-500 px-2 py-2 bg-transparent w-full outline-none transition pr-10"
          >
            <option value="">Select Lead</option>
            {leads.map((lead) => (
              <option key={lead._id} value={lead._id}>
                {lead.name}
              </option>
            ))}
          </select>
          <Search
            size={20}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 cursor-pointer hover:text-blue-800 transition"
            onClick={handleSearchLead}
          />
        </div>

        {/* Date input */}
        <div className="flex-1">
          <Input
            type="datetime-local"
            value={reminderData.date}
            onChange={(e) =>
              setReminderData({ ...reminderData, date: e.target.value })
            }
          />
        </div>

        {/* Message input */}
        <div className="flex-1">
          <Input
            placeholder="Message"
            value={reminderData.message}
            onChange={(e) =>
              setReminderData({ ...reminderData, message: e.target.value })
            }
          />
        </div>

        {/* Add Reminder button */}
        <Button onClick={handleAddReminder}>
          <PlusCircle size={18} /> Add
        </Button>
      </div>

      {/* Reminders Table */}
      {loading ? (
        <div className="flex items-center justify-center gap-2 text-gray-500">
          <Loader2 className="animate-spin" /> Loading...
        </div>
      ) : !selectedLead ? (
        <div className="flex items-center justify-center gap-2 text-gray-500">
          <BellOff /> Please select a lead and click the search icon.
        </div>
      ) : leadReminders.length === 0 ? (
        <div className="flex items-center justify-center gap-2 text-gray-500">
          <BellOff /> No reminders for this lead.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Message</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Notified</th>
              </tr>
            </thead>
            <tbody>
              {[...leadReminders]
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((r) => (
                  <tr
                    key={r._id}
                    className="even:bg-gray-50 odd:bg-white hover:bg-blue-50 transition"
                  >
                    <td className="px-4 py-3">{r.message}</td>
                    <td className="px-4 py-3">
                      {new Date(r.date).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      {r.notified ? "✅ Yes" : "❌ No"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
