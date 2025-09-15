import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { TrendingUp, Users, Bell, AlertTriangle } from "lucide-react";
import { fetchLeads } from "../redux/feature/leadSlice";
import Loader from "./Loader";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { items: leads = [], loading } = useSelector((state) => state.leads || {});

  useEffect(() => {
    dispatch(fetchLeads());
  }, [dispatch]);

  const totalLeads = leads.length;
  const highPriority = leads.filter((l) => l.priority === "High").length;
  const reminders = leads.flatMap((lead) => lead.reminders || []);
  const upcomingReminders = reminders.filter((r) => new Date(r.date) > new Date());
  const totalBudget = leads.reduce((sum, lead) => sum + (parseInt(lead.budget) || 0), 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 flex items-center gap-2">
          📊 Dashboard
        </h1>
        <p className="text-gray-500 mt-2">
          Manage your leads, reminders, and budgets efficiently
        </p>
      </header>

      {/* Stats Cards */}
      <div className="relative mb-6">
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${loading ? "opacity-50 pointer-events-none" : ""}`}>
          <Card icon={<Users className="text-blue-600" size={20} />} title="Total Leads" value={totalLeads} />
          <Card icon={<AlertTriangle className="text-red-600" size={20} />} title="High Priority" value={highPriority} />
          <Card icon={<Bell className="text-yellow-600" size={20} />} title="Upcoming Reminders" value={upcomingReminders.length} />
          <Card icon={<TrendingUp className="text-green-600" size={20} />} title="Total Budget" value={`₹${totalBudget.toLocaleString()}`} />
        </div>
      </div>

      {/* Upcoming Reminders */}
      <div className="relative bg-white p-4 shadow-md rounded-xl">
        {loading && <Loader size={100} thickness={10} color="#399fac" message="" />}
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">⏰ Upcoming Reminders</h2>
        {upcomingReminders.length === 0 ? (
          <p className="text-gray-500">No upcoming reminders.</p>
        ) : (
          <ul className="space-y-4">
            {upcomingReminders
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .slice(0, 10)
              .map((r) => (
                <li
                  key={r._id}
                  className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg flex justify-between items-center shadow-sm hover:shadow-md transition"
                >
                  <span className="font-medium text-gray-700">{r.message}</span>
                  <span className="text-sm text-gray-500">{new Date(r.date).toLocaleString()}</span>
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// Card Component
function Card({ icon, title, value }) {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 flex items-center gap-5 hover:shadow-2xl transition relative">
      <div className="p-4 bg-gray-100 rounded-full">{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-2xl font-bold mt-1">{value}</h2>
      </div>
    </div>
  );
}
