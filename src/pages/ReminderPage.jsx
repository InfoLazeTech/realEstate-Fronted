// src/pages/RemindersPage.jsx
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { addReminder, getSingleLead } from "../redux/feature/leadSlice";

const Button = ({ children, className = "", ...props }) => (
  <button
    className={`px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={`border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
    {...props}
  />
);

const Select = ({ className = "", children, ...props }) => (
  <select
    className={`border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
    {...props}
  >
    {children}
  </select>
);

export default function RemindersPage() {
  const dispatch = useDispatch();
  const { items: leads, loading } = useSelector((state) => state.leads);

  const [selectedLead, setSelectedLead] = useState("");
  const [reminderData, setReminderData] = useState({ date: "", message: "" });
  const [leadReminders, setLeadReminders] = useState([]);

  // Fetch reminders of selected lead
  useEffect(() => {
    if (!selectedLead) return;
    dispatch(getSingleLead(selectedLead))
      .unwrap()
      .then((lead) => setLeadReminders(lead.reminders || []))
      .catch(() => setLeadReminders([]));
  }, [selectedLead, dispatch]);

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
    <div className="p-6 flex-1">
      <h2 className="text-3xl font-bold mb-6">⏰ Reminders</h2>

      {/* Select Lead and Add Reminder */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow flex flex-col md:flex-row gap-3">
        <Select
          value={selectedLead}
          onChange={(e) => setSelectedLead(e.target.value)}
        >
          <option value="">Select Lead</option>
          {leads.map((lead) => (
            <option key={lead._id} value={lead._id}>
              {lead.name}
            </option>
          ))}
        </Select>

        <Input
          type="datetime-local"
          value={reminderData.date}
          onChange={(e) =>
            setReminderData({ ...reminderData, date: e.target.value })
          }
        />
        <Input
          placeholder="Message"
          value={reminderData.message}
          onChange={(e) =>
            setReminderData({ ...reminderData, message: e.target.value })
          }
        />
        <Button onClick={handleAddReminder}>Add Reminder</Button>
      </div>

      {/* Reminders Table */}
      {loading ? (
        <p>Loading...</p>
      ) : !selectedLead ? (
        <p className="text-gray-600">Please select a lead to view reminders.</p>
      ) : leadReminders.length === 0 ? (
        <p className="text-gray-600">No reminders for this lead.</p>
      ) : (
        <table className="min-w-full table-auto bg-white shadow rounded">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm text-gray-600">Message</th>
              <th className="px-4 py-3 text-left text-sm text-gray-600">Date</th>
              <th className="px-4 py-3 text-left text-sm text-gray-600">Notified</th>
            </tr>
          </thead>
          <tbody>
            {[...leadReminders].sort((a, b) => new Date(a.date) - new Date(b.date))

              .map((r) => (
                <tr key={r._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{r.message}</td>
                  <td className="px-4 py-3">{new Date(r.date).toLocaleString()}</td>
                  <td className="px-4 py-3">{r.notified ? "Yes" : "No"}</td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
