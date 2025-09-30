import axios from "axios";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";
import { FaUserTie, FaUsers, FaProjectDiagram, FaSignOutAlt, FaPlus } from "react-icons/fa";
import { RiTeamFill } from "react-icons/ri";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("employees");
  const [createForm, setCreateForm] = useState(false);
  const [formData, setFormData] = useState({ projectName: "" });

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

  const handleDownloadExcel = () => {
    if (!user || !user.entries || user.entries.length === 0) {
      alert("No task entries to export.");
      return;
    }

    const excelData = user.entries.map((entry, index) => ({
      "#": index + 1,
      "Task Name": entry.task_name,
      "Start Time": new Date(entry.start_time).toLocaleString(),
      "End Time": entry.end_time ? new Date(entry.end_time).toLocaleString() : "-",
      "Total Hours": entry.total_hours || "-",
      Status: entry.status || "-",
      Comment: entry.comment || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Task Entries");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });

    saveAs(fileData, `${user.first_name}_${user.last_name}_Task_Entries.xlsx`);
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

  const rowColors = ["bg-gray-50", "bg-gray-100"];
  const adminLogOut = () => navigate("/");
  const addEmployee = () => navigate("/Signup");

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/projects/create`, formData);
      if (res.data.success) {
        alert(`Project "${formData.projectName}" created successfully!`);
        setFormData({ projectName: "" });
        setCreateForm(false);
      } else {
        alert("Failed to create project.");
      }
    } catch (err) {
      console.error(err);
      alert("Error creating project.");
    }
  };

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
        <header className="flex justify-between items-center px-6 py-4 bg-white shadow">
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
        </header>
        {activeTab === "employees" && (
          <>
            <h2 className="text-xl font-bold ml-7  mt-5">Employees</h2>
            <section className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {loading ? (
                <div className="flex justify-center h-[80vh] items-center col-span-full">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-2 text-blue-700">Loading...</span>
                </div>
              ) : (
                data?.map((user) => (
                  <div
                    key={user.user_id}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow hover:shadow-lg transition"
                  >
                    <h3 className="text-lg font-semibold capitalize">{user.e_name}</h3>
                    <p className="text-gray-600 text-sm">Email : {user.email}</p>
                    <p className="text-gray-600 text-sm mb-2">Task Entries: {user.entries.length}</p>
                    <button
                      onClick={() => handleViewDetails(user)}
                      className="px-3 py-1 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700"
                    >
                      View Details
                    </button>
                  </div>
                ))
              )}
            </section>
            {user && (
              <section className="p-6 ">
                <h2 className="text-xl font-bold mb-3">User Details</h2>
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="text-lg font-semibold">Name : <span className="font-normal capitalize">{user.e_name}</span></h3>
                  <p className="text-gray-600 mb-4">Email: {user.email}</p>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">Task Entries</h4>
                    <button
                      onClick={handleDownloadExcel}
                      className="bg-green-600 text-white px-4 py-2 top-2 rounded hover:bg-green-700 cursor-pointer"
                    >
                      Download Excel
                    </button>
                  </div>
                  {user.entries.length === 0 ? (
                    <p className="text-gray-600">No task entries available.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full border border-gray-300 divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-200">
                          <tr>
                            <th className="px-4 py-2 border">#</th>
                            <th className="px-4 py-2 border">Task Name</th>
                            <th className="px-4 py-2 border">Date</th>
                            <th className="px-4 py-2 border">Start Time</th>
                            <th className="px-4 py-2 border">End Time</th>
                            <th className="px-4 py-2 border">Total Hours</th>
                            <th className="px-4 py-2 border">Status</th>
                            <th className="px-4 py-2 border">Comment</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(groupEntriesByDate(user.entries)).map(
                            ([date, entriesForDate], dateIdx) => {
                              const bgColor = rowColors[dateIdx % 2];
                              return (
                                <React.Fragment key={date}>
                                  {entriesForDate.map((entry, idx) => (
                                    <tr key={entry.entry_id || idx} className={bgColor}>
                                      <td className="px-4 py-2 border">{idx + 1}</td>
                                      <td className="px-4 py-2 border">{entry.task_name}</td>
                                      {idx === 0 && (
                                        <td className="px-4 py-2 border" rowSpan={entriesForDate.length}>{date}</td>
                                      )}
                                      <td className="px-4 py-2 border">{new Date(entry.start_time).toLocaleString()}</td>
                                      <td className="px-4 py-2 border">{entry.end_time ? new Date(entry.end_time).toLocaleString() : "-"}</td>
                                      <td className="px-4 py-2 border">{entry.total_hours || "-"}</td>
                                      <td className="px-4 py-2 border">{entry.status || "-"}</td>
                                      <td className="px-4 py-2 border">{entry.comment || "-"}</td>
                                    </tr>
                                  ))}
                                </React.Fragment>
                              );
                            }
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </section>
            )}
          </>
        )}

        {activeTab === "projects" && (
          <section className="p-6">
            <h2 className="text-xl font-bold cursor-pointer">Projects</h2>
          </section>
        )}

        {activeTab === "teams" && (
          <section className="p-6">
            <h2 className="text-xl font-bold cursor-pointer">Teams</h2>
          </section>
        )}

        {createForm && (
          <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-center">Create Project</h2>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <input
                  type="text"
                  placeholder="Project Name"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setCreateForm(false)}
                    className="px-4 py-2 rounded bg-gray-300 cursor-pointer hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-green-600 cursor-pointer text-white hover:bg-green-700"
                  >
                    Create Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
