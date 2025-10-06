import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserTie,
  FaUsers,
  FaProjectDiagram,
  FaSignOutAlt,
  FaPlus,
} from "react-icons/fa";
import { RiTeamFill } from "react-icons/ri";
import Employee from "./Component/Employee";
import Project from "./Component/Project";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("employees");

  const navigate = useNavigate();
  const API = "https://timetracker-1-wix6.onrender.com";
  const userId = JSON.parse(localStorage.getItem("userId"));

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.post(`${API}/admin/`, { user_id: userId });
        setData(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleViewDetails = async (user) => {
    try {
      const res = await axios.get(`${API}/admin/${user.user_id}/`);
      setUser(res.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const groupEntriesByDate = (entries) => {
    if (!entries) return {};
    return entries.reduce((acc, entry) => {
      const date = new Date(entry.start_time).toISOString().split("T")[0];
      if (!acc[date]) acc[date] = [];
      acc[date].push(entry);
      return acc;
    }, {});
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    navigate("/");
  };
  const addEmployee = () => navigate("/Signup");

  return (
    <div className="flex h-screen font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col shadow-xl">
        <div className="flex items-center gap-3 px-6 py-5.5 border-b border-gray-700">
          <FaUserTie className="text-2xl text-cyan-400" />
          <h1 className="text-xl font-bold tracking-wide">ADMIN</h1>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-4">
          {[
            { key: "employees", icon: <FaUsers />, label: "Employees" },
            { key: "projects", icon: <FaProjectDiagram />, label: "Projects" },
            { key: "teams", icon: <RiTeamFill />, label: "Teams" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-3 w-full text-left px-3 py-2 rounded 
                transition-all duration-200 hover:bg-gray-700 
                ${activeTab === tab.key ? "bg-gray-700 border-l-4 border-cyan-400" : ""}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-6 py-3 cursor-pointer bg-red-600 hover:bg-red-700 transition-all"
        >
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-100 overflow-y-auto">
        {/* Header */}

        {/* Content Section */}
        <section className="p-8 min-h-[calc(100vh-80px)]">
          {activeTab === "employees" && (
            <Employee
              loading={loading}
              data={data}
              user={user}
              groupEntriesByDate={groupEntriesByDate}
              handleViewDetails={handleViewDetails}
            />
          )}

          {activeTab === "projects" && <Project />}

          {activeTab === "teams" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-cyan-300 transition-all">
                <h3 className="text-xl font-semibold mb-2 text-cyan-500">Team Alpha</h3>
                <p className="text-gray-600">5 Members | Active Projects: 2</p>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-cyan-300 transition-all">
                <h3 className="text-xl font-semibold mb-2 text-cyan-500">Team Beta</h3>
                <p className="text-gray-600">3 Members | Active Projects: 1</p>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
