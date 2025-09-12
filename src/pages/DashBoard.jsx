import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { TrendingUp, Users, Bell, AlertTriangle } from "lucide-react";
import { fetchLeads } from "../redux/feature/leadSlice";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { items: leads, loading } = useSelector((state) => state.leads);

  useEffect(() => {
    dispatch(fetchLeads());
  }, [dispatch]);

  // Stats
  const totalLeads = leads.length;
  const highPriority = leads.filter((l) => l.priority === "High").length;
  const reminders = leads.flatMap((lead) => lead.reminders || []);
  const upcomingReminders = reminders.filter(
    (r) => new Date(r.date) > new Date()
  );

  const totalBudget = leads.reduce(
    (sum, lead) => sum + (parseInt(lead.budget) || 0),
    0
  );

  return (
    <div className="p-8 flex-1">
      <h1 className="text-3xl font-bold mb-6">📊 Dashboard</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white shadow rounded-lg flex items-center gap-4">
              <Users className="text-blue-900" size={32} />
              <div>
                <p className="text-sm text-gray-500">Total Leads</p>
                <h2 className="text-xl font-bold">{totalLeads}</h2>
              </div>
            </div>

            <div className="p-6 bg-white shadow rounded-lg flex items-center gap-4">
              <AlertTriangle className="text-red-600" size={32} />
              <div>
                <p className="text-sm text-gray-500">High Priority</p>
                <h2 className="text-xl font-bold">{highPriority}</h2>
              </div>
            </div>

            <div className="p-6 bg-white shadow rounded-lg flex items-center gap-4">
              <Bell className="text-yellow-600" size={32} />
              <div>
                <p className="text-sm text-gray-500">Upcoming Reminders</p>
                <h2 className="text-xl font-bold">{upcomingReminders.length}</h2>
              </div>
            </div>

            <div className="p-6 bg-white shadow rounded-lg flex items-center gap-4">
              <TrendingUp className="text-green-600" size={32} />
              <div>
                <p className="text-sm text-gray-500">Total Budget</p>
                <h2 className="text-xl font-bold">
                  ₹{totalBudget.toLocaleString()}
                </h2>
              </div>
            </div>
          </div>

          {/* Upcoming Reminders List */}
          <div className="mt-8 bg-white p-6 shadow rounded-lg">
            <h2 className="text-xl font-bold mb-4">⏰ Upcoming Reminders</h2>
            {upcomingReminders.length === 0 ? (
              <p className="text-gray-600">No upcoming reminders.</p>
            ) : (
              <ul className="space-y-3">
                {upcomingReminders
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .slice(0, 5)
                  .map((r) => (
                    <li
                      key={r._id}
                      className="p-3 bg-yellow-100 rounded flex justify-between"
                    >
                      <span>{r.message}</span>
                      <span className="text-sm text-gray-700">
                        {new Date(r.date).toLocaleString()}
                      </span>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
