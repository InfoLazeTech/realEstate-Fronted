// src/pages/LeadDetailsPage.jsx
import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "../redux/axiosconfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SquarePen, Trash, Loader2 } from "lucide-react";
import LoaderWave from "./Loader";

// --- Input Component ---
const Input = ({ label, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-gray-600">{label}</label>
    <input
      className="border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 transition bg-white"
      {...props}
    />
  </div>
);

// --- TextArea Component ---
const TextArea = ({ label, ...props }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-gray-600">{label}</label>
    <textarea
      className="border border-gray-200 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 transition bg-white"
      rows="3"
      {...props}
    />
  </div>
);

// --- Button Component ---
const Button = ({ children, className = "", ...props }) => (
  <button
    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${className}`}
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

  const [loadingAction, setLoadingAction] = useState({});

  const noteFormRef = useRef(null);
  const reminderFormRef = useRef(null);
  const noteInputRef = useRef(null);
  const reminderInputRef = useRef(null);

  // --- Fetch lead data ---
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

  // --- Auto-scroll & focus ---
  useEffect(() => {
    if (showNoteForm && noteFormRef.current) {
      noteFormRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => noteInputRef.current?.focus(), 200);
    }
  }, [showNoteForm]);

  useEffect(() => {
    if (showReminderForm && reminderFormRef.current) {
      reminderFormRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => reminderInputRef.current?.focus(), 200);
    }
  }, [showReminderForm]);

  // --- Notes Handlers ---
  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    setLoadingAction({ ...loadingAction, noteAdd: true });
    try {
      const res = await axios.post(`/leads/note/${id}`, { text: newNote });
      setNotes(res.data.notes);
      setNewNote("");
      setShowNoteForm(false);
      toast.success("Note added ✅");
    } catch (err) {
      console.error("Error adding note", err);
      toast.error("Failed to add note ❌");
    } finally {
      setLoadingAction({ ...loadingAction, noteAdd: false });
    }
  };

  const handleUpdateNote = async (noteId, text) => {
    setLoadingAction({ ...loadingAction, noteUpdate: noteId });
    try {
      const res = await axios.put(`/leads/note/${id}/${noteId}`, { text });
      setNotes(res.data.notes);
      setEditingNote(null);
      toast.success("Note updated ✅");
    } catch (err) {
      console.error("Error updating note", err);
      toast.error("Failed to update note ❌");
    } finally {
      setLoadingAction({ ...loadingAction, noteUpdate: null });
    }
  };

  const handleDeleteNote = async (noteId) => {
    setLoadingAction({ ...loadingAction, noteDelete: noteId });
    try {
      const res = await axios.delete(`/leads/note/${id}/${noteId}`);
      setNotes(res.data.notes);
      toast.success("Note deleted 🗑️");
    } catch (err) {
      console.error("Error deleting note", err);
      toast.error("Failed to delete note ❌");
    } finally {
      setLoadingAction({ ...loadingAction, noteDelete: null });
    }
  };

  // --- Reminder Handlers ---
  const handleAddReminder = async () => {
    if (!newReminder.date || !newReminder.message) return;
    setLoadingAction({ ...loadingAction, reminderAdd: true });
    try {
      const res = await axios.post(`/leads/reminder/${id}`, newReminder);
      setReminders(res.data.reminders);
      setNewReminder({ date: "", message: "" });
      setShowReminderForm(false);
      toast.success("Reminder added ✅");
    } catch (err) {
      console.error("Error adding reminder", err);
      toast.error("Failed to add reminder ❌");
    } finally {
      setLoadingAction({ ...loadingAction, reminderAdd: false });
    }
  };

  const handleUpdateReminder = async (reminderId, updated) => {
    setLoadingAction({ ...loadingAction, reminderUpdate: reminderId });
    try {
      const res = await axios.put(`/leads/reminder/${id}/${reminderId}`, updated);
      setReminders(res.data.reminders);
      setEditingReminder(null);
      toast.success("Reminder updated ✅");
    } catch (err) {
      console.error("Error updating reminder", err);
      toast.error("Failed to update reminder ❌");
    } finally {
      setLoadingAction({ ...loadingAction, reminderUpdate: null });
    }
  };

  const handleDeleteReminder = async (reminderId) => {
    setLoadingAction({ ...loadingAction, reminderDelete: reminderId });
    try {
      const res = await axios.delete(`/leads/reminder/${id}/${reminderId}`);
      setReminders(res.data.reminders);
      toast.success("Reminder deleted 🗑️");
    } catch (err) {
      console.error("Error deleting reminder", err);
      toast.error("Failed to delete reminder ❌");
    } finally {
      setLoadingAction({ ...loadingAction, reminderDelete: null });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoaderWave />
      </div>
    );
  }
  if (!lead) return <p className="p-6 text-center text-red-500 text-sm">Lead not found</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          to="/leads"
          className="inline-flex items-center text-teal-600 hover:text-teal-800 transition mb-4 text-sm"
        >
          <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Leads
        </Link>

        {/* Lead Info Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{lead.name}</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-gray-600 text-sm">
            <div className="flex items-center gap-1.5">
              <span className="text-teal-500">💰</span>
              <div>
                <p className="text-xs font-medium">Budget</p>
                <p>{lead.budget}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-teal-500">📍</span>
              <div>
                <p className="text-xs font-medium">Location</p>
                <p>{lead.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-teal-500">🔥</span>
              <div>
                <p className="text-xs font-medium">Score</p>
                <p>{lead.score}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-teal-500">📊</span>
              <div>
                <p className="text-xs font-medium">Stage</p>
                <p>{lead.stage}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-teal-500">⚡</span>
              <div>
                <p className="text-xs font-medium">Priority</p>
                <p>{lead.priority}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              onClick={() => setShowNoteForm(!showNoteForm)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {showNoteForm ? "Close" : "+ Add Note"}
            </Button>
            <Button
              onClick={() => setShowReminderForm(!showReminderForm)}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              {showReminderForm ? "Close" : "+ Add Reminder"}
            </Button>
          </div>
        </div>

        {/* Add Note Form */}
        {showNoteForm && (
          <div ref={noteFormRef} className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Add Note</h2>
            <TextArea
              ref={noteInputRef}
              label="Note"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
            />
            <div className="mt-3 flex gap-2">
              <Button
                onClick={handleAddNote}
                disabled={loadingAction.noteAdd}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                {loadingAction.noteAdd && <Loader2 className="animate-spin w-4 h-4 mr-1 inline" />}
                Save
              </Button>
              <Button
                onClick={() => setShowNoteForm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Notes List */}
        {Array.isArray(notes) && notes.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">📝 Notes</h2>
            <ul className="space-y-3">
              {notes.map((note) => (
                <li
                  key={note._id}
                  className="border border-gray-100 rounded-md p-3 hover:bg-gray-50 transition text-sm flex justify-between items-start"
                >
                  {editingNote === note._id ? (
                    <div className="flex flex-col gap-3 w-full">
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
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleUpdateNote(note._id, note.text)}
                          disabled={loadingAction.noteUpdate === note._id}
                          className="bg-teal-600 hover:bg-teal-700 text-white"
                        >
                          {loadingAction.noteUpdate === note._id && (
                            <Loader2 className="animate-spin w-4 h-4 mr-1 inline" />
                          )}
                          Save
                        </Button>
                        <Button
                          className="bg-gray-500 hover:bg-gray-600 text-white"
                          onClick={() => setEditingNote(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex-1 cursor-pointer" onClick={() => navigate(`/note/${note._id}`)}>
                        <p className="text-gray-800">{note.text}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(note.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => setEditingNote(note._id)}
                        >
                          <SquarePen size={18} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteNote(note._id)}
                          disabled={loadingAction.noteDelete === note._id}
                        >
                          {loadingAction.noteDelete === note._id ? (
                            <Loader2 className="animate-spin w-4 h-4 inline" />
                          ) : (
                            <Trash size={18} />
                          )}
                        </button>
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
          <div ref={reminderFormRef} className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Add Reminder</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                ref={reminderInputRef}
                label="Date"
                type="datetime-local"
                value={newReminder.date}
                onChange={(e) => setNewReminder({ ...newReminder, date: e.target.value })}
              />
              <Input
                label="Message"
                value={newReminder.message}
                onChange={(e) => setNewReminder({ ...newReminder, message: e.target.value })}
              />
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                onClick={handleAddReminder}
                disabled={loadingAction.reminderAdd}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                {loadingAction.reminderAdd && <Loader2 className="animate-spin w-4 h-4 mr-1 inline" />}
                Save
              </Button>
              <Button
                onClick={() => setShowReminderForm(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Reminders List */}
        {Array.isArray(reminders) && reminders.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">⏰ Reminders</h2>
            <ul className="space-y-3">
              {reminders.map((reminder) => (
                <li
                  key={reminder._id}
                  className="border border-gray-100 rounded-md p-3 hover:bg-amber-50 transition text-sm flex justify-between items-start"
                >
                  {editingReminder === reminder._id ? (
                    <div className="flex flex-col gap-3 w-full">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <Input
                          type="datetime-local"
                          value={reminder.date.slice(0, 16)}
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
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleUpdateReminder(reminder._id, reminder)}
                          disabled={loadingAction.reminderUpdate === reminder._id}
                          className="bg-teal-600 hover:bg-teal-700 text-white"
                        >
                          {loadingAction.reminderUpdate === reminder._id && (
                            <Loader2 className="animate-spin w-4 h-4 mr-1 inline" />
                          )}
                          Save
                        </Button>
                        <Button
                          className="bg-gray-500 hover:bg-gray-600 text-white"
                          onClick={() => setEditingReminder(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => navigate(`/reminder/${reminder._id}`)}
                      >
                        <p className="text-gray-800">{reminder.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(reminder.date).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => setEditingReminder(reminder._id)}
                        >
                          <SquarePen size={18} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteReminder(reminder._id)}
                          disabled={loadingAction.reminderDelete === reminder._id}
                        >
                          {loadingAction.reminderDelete === reminder._id ? (
                            <Loader2 className="animate-spin w-4 h-4 inline" />
                          ) : (
                            <Trash size={18} />
                          )}
                        </button>
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
