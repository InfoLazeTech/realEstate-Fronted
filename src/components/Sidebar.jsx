// src/components/Sidebar.jsx
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Users, Bell, PanelRightOpen, PanelLeftClose,ChevronLeft, ChevronRight, Menu } from "lucide-react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    { to: "/", label: "Dashboard", icon: Home },
    { to: "/leads", label: "Leads", icon: Users },
    { to: "/reminders", label: "Reminders", icon: Bell },
  ];

  return (
    <div
      className={`${collapsed ? "w-20" : "w-64"
        } bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 h-screen p-4 flex flex-col sticky top-0 transition-all duration-300 shadow-xl`}
    >
      {/* Toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mb-6 p-2 rounded-lg hover:bg-gray-700 transition-colors"
      >
        {collapsed ? <Menu   size={22} /> : <PanelLeftClose size={22} />}
      </button>


      {/* Title / Logo */}
      {!collapsed && (
        <h1 className="text-xl font-extrabold mb-8 tracking-wide flex items-center gap-2">
          🏡 <span className="text-blue-400">CRM</span>
        </h1>
      )}

      {/* Navigation */}
      <nav className="flex flex-col space-y-3">
        {navItems.map(({ to, label, icon: Icon }) => {
          const isActive = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
            >
              <Icon size={20} />
              {!collapsed && <span className="font-medium">{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="mt-auto pt-6 border-t border-gray-700">
          <p className="text-sm text-gray-400">© 2025 MyCRM</p>
        </div>
      )}
    </div>
  );
}
