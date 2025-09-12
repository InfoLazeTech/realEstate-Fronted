// src/pages/LeadDetailsPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../redux/axiosconfig";

const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-600">{label}</label>
    <input
      className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      {...props}
    />
  </div>
);

const TextArea = ({ label, ...props }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium text-gray-600">{label}</label>
    <textarea
      className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      rows="3"
      {...props}
    />
  </div>
);

const Button = ({ children, className = "", ...props }) => (
  <button
    className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default function LeadDetailsPage() {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);

  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState({ date: "", message: "" });

  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showReminderForm, setShowReminderForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const leadRes = await axios.get(`/leads/${id}`);
        setLead(leadRes.data);
        setNotes(leadRes.data.notes || []);

        const remindersRes = await axios.get(`/leads/reminder/${id}`);
        setReminders(remindersRes.data || []);
      } catch (err) {
        console.error("Error loading lead details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      const res = await axios.post(`/leads/note/${id}`, { text: newNote });
      setNotes(res.data.notes);
      setNewNote("");
      setShowNoteForm(false);
    } catch (err) {
      console.error("Error adding note", err);
    }
  };

  const handleAddReminder = async () => {
    if (!newReminder.date || !newReminder.message) return;
    try {
      const res = await axios.post(`/leads/reminder/${id}`, newReminder);
      setReminders(res.data.reminders);
      setNewReminder({ date: "", message: "" });
      setShowReminderForm(false);
    } catch (err) {
      console.error("Error adding reminder", err);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!lead) return <p className="p-6">Lead not found</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <Link to="/leads" className="text-blue-600 hover:underline">
        ← Back to Leads
      </Link>

      {/* Lead Info */}
      <div className="bg-white p-8 rounded-xl shadow-lg mt-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">{lead.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 text-lg">
          <p>💰 <strong>Budget:</strong> {lead.budget}</p>
          <p>📍 <strong>Location:</strong> {lead.location}</p>
          <p>🔥 <strong>Score:</strong> {lead.score}</p>
          <p>📊 <strong>Stage:</strong> {lead.stage}</p>
          <p>⚡ <strong>Priority:</strong> {lead.priority}</p>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <Button onClick={() => setShowNoteForm(!showNoteForm)}>
            {showNoteForm ? "Close Note Form" : "Add Note"}
          </Button>
          <Button onClick={() => setShowReminderForm(!showReminderForm)}>
            {showReminderForm ? "Close Reminder Form" : "Add Reminder"}
          </Button>
        </div>

        {/* Add Note Form */}
        {showNoteForm && (
          <div className="mt-6">
            <TextArea
              label="New Note"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
            <div className="mt-2">
              <Button onClick={handleAddNote}>Save Note</Button>
            </div>
          </div>
        )}

        {/* Notes List */}
        {notes.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">📝 Notes</h2>
            <ul className="space-y-3">
              {notes.map((note, index) => (
                <li
                  key={index}
                  className="bg-gray-100 p-3 rounded-lg shadow-sm border border-gray-200"
                >
                  <p className="text-gray-700">{note.text}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Added on: {new Date(note.date || note.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Add Reminder Form */}
        {showReminderForm && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              label="Reminder Date"
              type="datetime-local"
              value={newReminder.date}
              onChange={(e) =>
                setNewReminder({ ...newReminder, date: e.target.value })
              }
            />
            <Input
              label="Message"
              value={newReminder.message}
              onChange={(e) =>
                setNewReminder({ ...newReminder, message: e.target.value })
              }
            />
            <div className="flex items-end">
              <Button onClick={handleAddReminder}>Save Reminder</Button>
            </div>
          </div>
        )}

        {/* Reminders List */}
        {reminders.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-3 text-gray-800">⏰ Reminders</h2>
            <ul className="space-y-3">
              {reminders.map((reminder, index) => (
                <li
                  key={index}
                  className="bg-yellow-50 p-3 rounded-lg shadow-sm border border-yellow-200"
                >
                  <p className="text-gray-700">{reminder.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Scheduled for:{" "}
                    {new Date(reminder.date).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

