import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaPlus, FaStop, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TIMEZONE = "Asia/Kolkata";
const api = "https://timetracker-1-wix6.onrender.com";

const TasksLists = ({ refresh }) => {
  const [tasks, setTasks] = useState();
  const [formOpen, setFormOpen] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [selectedEntryId, setSelectedEntryId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [newTask, setNewTask] = useState({ name: "", startDate: "" });
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedTime, setFormattedTime] = useState("");

  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("userId")) || [];

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
    fetchData();
  }, [refresh]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`${api}/user/${userId}/`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const openForm = () => {
    const { date } = getCurrentIndiaTime();
    const formatted = date.split("/").reverse().join("-");
    setNewTask({ name: "", startDate: formatted });
    setFormOpen(true);
  };

  const closeForm = () => setFormOpen(false);
  const handleChange = (e) =>
    setNewTask({ ...newTask, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.name) return alert("Please enter a task name");
    try {
      await axios.post(`${api}/clockin/${userId}/`, {
        task_name: newTask.name,
      });
      fetchData();
      setFormOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStop = (index) => {
    const selectedEntry = tasks.entries[index];
    if (selectedEntry && selectedEntry.entry_id) {
      setSelectedEntryId(selectedEntry.entry_id);
      setCommentOpen(true);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEntryId) return;
    try {
      await axios.post(`${api}/clockout/${userId}/`, {
        entry_id: selectedEntryId,
        comment: commentText,
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
    setCommentText("");
    setCommentOpen(false);
    setSelectedEntryId(null);
  };

  const extractDate = (dateTimeStr) =>
    dateTimeStr ? new Date(dateTimeStr).toISOString().split("T")[0] : "-";

  const extractTime = (dateTimeStr) =>
    dateTimeStr ? new Date(dateTimeStr).toTimeString().split(" ")[0] : "-";

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  const groupTasksByDate = (entries) => {
    if (!entries) return {};
    return entries.reduce((acc, task) => {
      const date = extractDate(task.start_time);
      if (!acc[date]) acc[date] = [];
      acc[date].push(task);
      return acc;
    }, {});
  };

  return (
    <div className="p-6 relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8 bg-gray-800/60 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-700">
        <div>
          <h2 className="text-2xl font-bold tracking-wide">
            Task Dashboard
          </h2>
          <p className="text-sm text-gray-400">
            {formattedDate} | {formattedTime}
          </p>
        </div>
        <div className="flex gap-3">
          {/* <button
            onClick={openForm}
            className="bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:scale-105 transition"
          >
            <FaPlus /> Add Task
          </button> */}
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-red-500 to-rose-600 px-4 py-2 rounded-xl font-medium flex items-center gap-2 hover:scale-105 transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* Task Table */}
      <div className="overflow-x-auto bg-gray-800/50 border border-gray-700 rounded-xl shadow-xl backdrop-blur-sm">
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
            {tasks?.entries?.length > 0 ? (
              Object.entries(groupTasksByDate(tasks.entries)).map(
                ([date, tasksForDate]) => (
                  <React.Fragment key={date}>
                    {tasksForDate.map((task, i) => (
                      <tr
                        key={task.entry_id || i}
                        className="text-center border-b border-gray-700 hover:bg-gray-700/30 transition"
                      >
                        <td className="px-4 py-2">{i + 1}</td>
                        <td className="px-4 py-2 font-medium text-cyan-300">
                          {task.task_name}
                        </td>
                        {i === 0 && (
                          <td
                            rowSpan={tasksForDate.length}
                            className="px-4 py-2 text-gray-400"
                          >
                            {date}
                          </td>
                        )}
                        <td className="px-4 py-2 text-gray-300">
                          {extractTime(task.start_time)}
                        </td>
                        <td className="px-4 py-2 text-gray-300">
                          {extractTime(task.end_time)}
                        </td>
                        <td className="px-4 py-2 text-gray-200">
                          {task.total_hours || "-"}
                        </td>
                        <td className="px-4 py-2 text-gray-400">
                          {task.comment || "-"}
                        </td>
                        <td className="px-4 py-2 flex justify-center gap-2">
                          {task.end_time ? (
                            <span className="text-green-400 font-semibold">
                              Completed
                            </span>
                          ) : (
                            <button
                              onClick={() => handleStop(i)}
                              className="bg-gradient-to-r from-yellow-500 to-amber-600 px-3 py-1.5 rounded-lg text-black font-medium flex items-center gap-2 hover:scale-105 transition"
                            >
                              <FaStop /> Stop
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                )
              )
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-6 text-gray-400 font-medium"
                >
                  No tasks available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Task Modal */}
      {formOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-gray-900 text-white rounded-2xl p-6 w-[90%] max-w-md border border-gray-700 shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-center text-cyan-400">
              Add New Task
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={newTask.name}
                onChange={handleChange}
                placeholder="Enter task name"
                className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:border-cyan-400"
              />
              <input
                type="date"
                name="startDate"
                value={newTask.startDate}
                readOnly
                className="w-full bg-gray-800 border border-gray-600 rounded-lg p-2 text-gray-400"
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:scale-105 transition"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Comment Modal */}
      {commentOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-gray-900 text-white rounded-2xl p-6 w-[90%] max-w-md border border-gray-700 shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-center text-amber-400">
              Add Comment
            </h2>
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
                <button
                  type="button"
                  onClick={() => setCommentOpen(false)}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 hover:scale-105 transition"
                >
                  Save Comment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksLists;
