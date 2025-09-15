// src/pages/LeadDetailsPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "../redux/axiosconfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);

  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");

  const [reminders, setReminders] = useState([]);
  const [newReminder, setNewReminder] = useState({ date: "", message: "" });

  const [showNoteForm, setShowNoteForm] = useState(false);
  const [showReminderForm, setShowReminderForm] = useState(false);

  const [editingNote, setEditingNote] = useState(null);
  const [editingReminder, setEditingReminder] = useState(null);

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
        toast.error("Failed to load lead details ❌");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // ================= NOTES =================
  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    try {
      const res = await axios.post(`/leads/note/${id}`, { text: newNote });
      setNotes(res.data.notes);
      setNewNote("");
      setShowNoteForm(false);
      toast.success("Note added successfully ✅");
    } catch (err) {
      console.error("Error adding note", err);
      toast.error("Failed to add note ❌");
    }
  };

  const handleUpdateNote = async (noteId, text) => {
    try {
      const res = await axios.put(`/leads/note/${id}/${noteId}`, { text });
      setNotes(res.data.notes);
      setEditingNote(null);
      toast.success("Note updated successfully ✅");
    } catch (err) {
      console.error("Error updating note", err);
      toast.error("Failed to update note ❌");
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const res = await axios.delete(`/leads/note/${id}/${noteId}`);
      setNotes(res.data.notes);
      toast.success("Note deleted successfully 🗑️");
    } catch (err) {
      console.error("Error deleting note", err);
      toast.error("Failed to delete note ❌");
    }
  };

  // ================= REMINDERS =================
  const handleAddReminder = async () => {
    if (!newReminder.date || !newReminder.message) return;
    try {
      const res = await axios.post(`/leads/reminder/${id}`, newReminder);
      setReminders(res.data.reminders);
      setNewReminder({ date: "", message: "" });
      setShowReminderForm(false);
      toast.success("Reminder added successfully ✅");
    } catch (err) {
      console.error("Error adding reminder", err);
      toast.error("Failed to add reminder ❌");
    }
  };

  const handleUpdateReminder = async (reminderId, updated) => {
    try {
      const res = await axios.put(`/leads/reminder/${id}/${reminderId}`, updated);
      setReminders(res.data.reminders);
      setEditingReminder(null);
      toast.success("Reminder updated successfully ✅");
    } catch (err) {
      console.error("Error updating reminder", err);
      toast.error("Failed to update reminder ❌");
    }
  };

  const handleDeleteReminder = async (reminderId) => {
    try {
      const res = await axios.delete(`/leads/reminder/${id}/${reminderId}`);
      setReminders(res.data.reminders);
      toast.success("Reminder deleted successfully 🗑️");
    } catch (err) {
      console.error("Error deleting reminder", err);
      toast.error("Failed to delete reminder ❌");
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
              {notes.map((note) => (
                <li
                  key={note._id}
                  className="bg-gray-100 p-3 rounded-lg shadow-sm border flex justify-between items-start"
                >
                  {editingNote === note._id ? (
                    <div className="flex-1 mr-3">
                      <TextArea
                        value={note.text}
                        onChange={(e) =>
                          setNotes((prev) =>
                            prev.map((n) =>
                              n._id === note._id ? { ...n, text: e.target.value } : n
                            )
                          )
                        }
                      />
                      <div className="mt-2 flex gap-2">
                        <Button onClick={() => handleUpdateNote(note._id, note.text)}>Save</Button>
                        <Button
                          className="bg-gray-500 hover:bg-gray-600"
                          onClick={() => setEditingNote(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Only this div is clickable for navigation */}
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => navigate(`/note/${note._id}`)}
                      >
                        <p className="text-gray-700">{note.text}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Added on: {new Date(note.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => setEditingNote(note._id)}>Edit</Button>
                        <Button
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => handleDeleteNote(note._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </>
                  )}
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
              onChange={(e) => setNewReminder({ ...newReminder, date: e.target.value })}
            />
            <Input
              label="Message"
              value={newReminder.message}
              onChange={(e) => setNewReminder({ ...newReminder, message: e.target.value })}
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
              {reminders.map((reminder) => (
                <li
                  key={reminder._id}
                  className="bg-yellow-50 p-3 rounded-lg shadow-sm border flex justify-between items-start"
                >
                  {editingReminder === reminder._id ? (
                    <div className="flex-1 mr-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                      <Input
                        value={reminder.date.slice(0, 16)}
                        type="datetime-local"
                        onChange={(e) =>
                          setReminders((prev) =>
                            prev.map((r) =>
                              r._id === reminder._id ? { ...r, date: e.target.value } : r
                            )
                          )
                        }
                      />
                      <Input
                        value={reminder.message}
                        onChange={(e) =>
                          setReminders((prev) =>
                            prev.map((r) =>
                              r._id === reminder._id ? { ...r, message: e.target.value } : r
                            )
                          )
                        }
                      />
                      <div className="col-span-2 flex gap-2 mt-2">
                        <Button onClick={() => handleUpdateReminder(reminder._id, reminder)}>Save</Button>
                        <Button
                          className="bg-gray-500 hover:bg-gray-600"
                          onClick={() => setEditingReminder(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Only this div is clickable for navigation */}
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => navigate(`/reminder/${reminder._id}`)}
                      >
                        <p className="text-gray-700">{reminder.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Scheduled for: {new Date(reminder.date).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => setEditingReminder(reminder._id)}>Edit</Button>
                        <Button
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => handleDeleteReminder(reminder._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
