import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaStop, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TIMEZONE = "Asia/Kolkata";
const API_BASE = "https://timetracker-1-wix6.onrender.com";

const TasksLists = () => {
  const [tasks, setTasks] = useState([]);
  const [commentOpen, setCommentOpen] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [runningEntry, setRunningEntry] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedTime, setFormattedTime] = useState("");
  const [tablePage, setTablePage] = useState(1);
  const [cardPage, setCardPage] = useState(1);

  const entriesPerPage = 10;
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("userId"));

  // Get current India time
  const getCurrentIndiaTime = () => {
    const now = new Date();
    const date = new Intl.DateTimeFormat("en-GB", {
      timeZone: TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(now);
    const time = new Intl.DateTimeFormat("en-US", {
      timeZone: TIMEZONE,
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(now);
    return { date, time };
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const { date, time } = getCurrentIndiaTime();
      setFormattedDate(date);
      setFormattedTime(time);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchUserTasks();
    fetchAssignedTasks();
  }, [refreshTrigger]);

  const fetchUserTasks = async () => {
    try {
      const res = await axios.get(`${API_BASE}/user/${userId}/`);
      setTasks(res.data.entries || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAssignedTasks = async () => {
    try {
      const res = await axios.get(`${API_BASE}/projectmanagement/projects/usertask/${userId}/`);
      const formatted = res.data.projects.flatMap((project) =>
        project.tasks.map((task) => ({
          id: task.task_id,
          projectName: project.project_name,
          taskName: task.task_name,
          status: task.status,
        }))
      );
      setTaskList(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateTime) => (dateTime ? new Date(dateTime).toISOString().split("T")[0] : "-");
  const formatTime = (dateTime) => (dateTime ? new Date(dateTime).toTimeString().split(" ")[0] : "-");

  const handleStop = (entryId) => {
    setSelectedEntryId(entryId);
    setCommentOpen(true);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEntryId) return;
    try {
      await axios.post(`${API_BASE}/clockout/${userId}/`, {
        entry_id: selectedEntryId,
        comment: commentText,
      });
      setCommentText("");
      setSelectedEntryId(null);
      setCommentOpen(false);
      setRefreshTrigger((prev) => !prev);
      setRunningEntry(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartTask = async (taskId) => {
    try {
      const res = await axios.post(`${API_BASE}/clockin/${userId}/`, { task_id: taskId });
      if (res.data.message) {
        alert(res.data.message);
        setRunningEntry(res.data);
        setRefreshTrigger((prev) => !prev);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    navigate("/");
  };

  // Pagination logic for table
  const tableLastIndex = tablePage * entriesPerPage;
  const tableFirstIndex = tableLastIndex - entriesPerPage;
  const currentTasks = tasks.slice(tableFirstIndex, tableLastIndex);
  const totalTablePages = Math.ceil(tasks.length / entriesPerPage);

  // Pagination logic for cards
  const cardLastIndex = cardPage * entriesPerPage;
  const cardFirstIndex = cardLastIndex - entriesPerPage;
  const currentCards = taskList.slice(cardFirstIndex, cardLastIndex);
  const totalCardPages = Math.ceil(taskList.length / entriesPerPage);

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-gray-800/60 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-700">
        <div>
          <h2 className="text-2xl font-bold tracking-wide">Task Dashboard</h2>
          <p className="text-sm text-gray-400">{formattedDate} | {formattedTime}</p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-red-500 to-rose-600 px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:scale-105 transition"
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>

      {/* Task Table */}
      <div className="overflow-x-auto bg-gray-800/50 border border-gray-700 rounded-xl shadow-xl backdrop-blur-sm mb-4">
        <table className="table-auto w-full text-sm md:text-base">
          <thead>
            <tr className="bg-gray-700/80 text-gray-200 uppercase text-xs md:text-sm">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Task Name</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Start Time</th>
              <th className="px-4 py-3">End Time</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Comment</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentTasks.length > 0 ? (
              currentTasks.map((task, i) => (
                <tr key={task.entry_id || i} className="text-center border-b border-gray-700 hover:bg-gray-700/30 transition">
                  <td className="px-4 py-2">{i + 1 + (tablePage - 1) * entriesPerPage}</td>
                  <td className="px-4 py-2 font-medium text-cyan-300">{task.task_name}</td>
                  <td className="px-4 py-2 text-gray-400">{formatDate(task.start_time)}</td>
                  <td className="px-4 py-2 text-gray-300">{formatTime(task.start_time)}</td>
                  <td className="px-4 py-2 text-gray-300">{formatTime(task.end_time)}</td>
                  <td className="px-4 py-2 text-gray-200">{task.total_hours || "-"}</td>
                  <td className="px-4 py-2 text-gray-400">{task.comment || "-"}</td>
                  <td className="px-4 py-2 flex justify-center gap-2">
                    {task.end_time ? (
                      <span className="text-green-400 font-semibold">Completed</span>
                    ) : (
                      <button
                        onClick={() => handleStop(task.entry_id)}
                        className="bg-gradient-to-r from-yellow-500 to-amber-600 px-3 py-1.5 rounded-lg text-black font-medium flex items-center gap-2 hover:scale-105 transition"
                      >
                        <FaStop /> Stop
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-400 font-medium">
                  No tasks available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Pagination */}
      {totalTablePages > 1 && (
        <div className="flex justify-center gap-2 mb-10">
          <button onClick={() => setTablePage(prev => Math.max(prev - 1, 1))} className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600">Prev</button>
          {Array.from({ length: totalTablePages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setTablePage(i + 1)}
              className={`px-3 py-1 rounded ${tablePage === i + 1 ? "bg-cyan-400 text-black" : "bg-gray-700 hover:bg-gray-600"}`}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => setTablePage(prev => Math.min(prev + 1, totalTablePages))} className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600">Next</button>
        </div>
      )}

      {/* Comment Modal */}
      {commentOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-gray-900 text-white rounded-2xl p-6 w-[90%] max-w-md border border-gray-700 shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-center text-amber-400">Add Comment</h2>
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Enter your comment"
                className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:border-amber-400"
                rows="3"
                required
              />
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setCommentOpen(false)} className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 hover:scale-105 transition">
                  Save Comment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assigned Tasks */}
      <div className="px-6 py-10">
        <h2 className="text-3xl font-bold mb-10 text-center text-white">Assigned Tasks</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {currentCards.length > 0 ? (
            currentCards.map((task) => (
              <div key={task.id} className="relative bg-gray-800 border border-cyan-400 rounded-2xl p-6 shadow-lg hover:shadow-cyan-500/50 transition duration-300 group">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-10 transition duration-300"></div>
                <h3 className="text-xl font-semibold text-cyan-400 mb-2 z-10 relative">{task.projectName}</h3>
                <p className="text-gray-300 mb-5 z-10 relative">Task: {task.taskName}</p>
                {task.status === "running" ? (
                  <button className="w-full py-2 cursor-not-allowed rounded-xl text-white font-semibold bg-gradient-to-r from-red-500 to-red-700 hover:scale-105 transition duration-200 z-10 relative">
                    Running
                  </button>
                ) : (
                  <button
                    onClick={() => handleStartTask(task.id)}
                    className={`w-full py-2 rounded-xl text-white font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 hover:scale-105 transition duration-200 z-10 relative ${runningEntry ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={!!runningEntry}
                  >
                    Start Task
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center col-span-full">No tasks assigned yet.</p>
          )}
        </div>

        {/* Card Pagination */}
        {totalCardPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            <button onClick={() => setCardPage(prev => Math.max(prev - 1, 1))} className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600">Prev</button>
            {Array.from({ length: totalCardPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCardPage(i + 1)}
                className={`px-3 py-1 rounded ${cardPage === i + 1 ? "bg-cyan-400 text-black" : "bg-gray-700 hover:bg-gray-600"}`}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => setCardPage(prev => Math.min(prev + 1, totalCardPages))} className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600">Next</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksLists;
