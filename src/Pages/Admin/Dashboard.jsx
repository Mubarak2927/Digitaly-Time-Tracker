import axios from "axios";
import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { FaUserTie, FaUsers, FaProjectDiagram, FaSignOutAlt, FaPlus } from "react-icons/fa";
import { RiTeamFill } from "react-icons/ri";
import Employee from "./Component/Employee";
import Project from "./Component/Project";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("employees");


  const navigate = useNavigate()

  const API = "https://timetracker-1-wix6.onrender.com";

  const userId = JSON.parse(localStorage.getItem("userId"));

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.post(`${API}/admin/`,
          {
            user_id: userId
          });
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


  const adminLogOut = () => navigate("/");
  const addEmployee = () => navigate("/Signup");



  return (
    <div className="flex h-screen font-sans">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="flex items-center gap-3 px-6 py-5.5 border-b border-gray-700">
          <FaUserTie className="text-2xl" />
          <h1 className="text-xl font-bold">ADMIN</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-4">
          <button
            onClick={() => setActiveTab("employees")}
            className={`flex items-center gap-3 w-full text-left px-3 py-2 cursor-pointer rounded hover:bg-gray-700 ${activeTab === "employees" ? "bg-gray-700" : ""
              }`}
          >
            <FaUsers /> Employees
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-3 w-full text-left px-3 py-2 cursor-pointer rounded hover:bg-gray-700 ${activeTab === "projects" ? "bg-gray-700" : ""
              }`}
          >
            <FaProjectDiagram /> Projects
          </button>
          <button
            onClick={() => setActiveTab("teams")}
            className={`flex items-center gap-3 w-full text-left px-3 py-2 cursor-pointer rounded hover:bg-gray-700 ${activeTab === "teams" ? "bg-gray-700" : ""
              }`}
          >
            <RiTeamFill /> Teams
          </button>
        </nav>
        <button
          onClick={adminLogOut}
          className="flex items-center gap-3 px-6 py-3 cursor-pointer bg-red-600 hover:bg-red-700"
        >
          <FaSignOutAlt /> Logout
        </button>
      </aside>
      <main className="flex-1 bg-gray-100 overflow-y-auto">
        {/* <header className="flex justify-between items-center px-6 py-4 bg-white shadow">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <div className="flex gap-3">
            <button
              onClick={() => setCreateForm(true)}
              className="bg-green-600 cursor-pointer px-4 py-2 rounded text-white hover:bg-green-700"
            >
              Create Project
            </button>

            <button
              onClick={addEmployee}
              className="flex items-center cursor-pointer gap-2 bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700"
            >
              <FaPlus /> Add Employee
            </button>
          </div>
        </header> */}

        {activeTab === "employees" && (
          <Employee loading={loading} data={data} user={user} groupEntriesByDate={groupEntriesByDate} handleViewDetails={handleViewDetails} />
        )}

        {activeTab === "projects" && (
          <Project />
        )}

        {activeTab === "teams" && (
          <section className="p-6">
            <h2 className="text-xl font-bold cursor-pointer">Teams</h2>
          </section>
        )}


      </main>
    </div>
  );
};

export default Dashboard;
