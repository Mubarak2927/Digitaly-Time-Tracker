import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaPlus, FaStop } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TIMEZONE = "Asia/Kolkata";

const api = "https://timetracker-1-wix6.onrender.com";

const TasksLists = () => {
  const [tasks, setTasks] = useState();
  const [formOpen, setFormOpen] = useState(false);
  const [commentOpen, setCommentOpen] = useState(false);
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [newTask, setNewTask] = useState({ name: "", startDate: "" });
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedTime, setFormattedTime] = useState("");
  const [selectedEntryId, setSelectedEntryId] = useState(null);

  const navigate = useNavigate();

  const getCurrentIndiaTime = () => {
    const now = new Date();
    const optionsDate = {
      timeZone: TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    const optionsTime = {
      timeZone: TIMEZONE,
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };

    const date = new Intl.DateTimeFormat("en-GB", optionsDate).format(now);
    const time = new Intl.DateTimeFormat("en-US", optionsTime).format(now);

    return { date, time };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const { date, time } = getCurrentIndiaTime();
      setFormattedDate(date);
      setFormattedTime(time);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const userId = JSON.parse(localStorage.getItem("userId")) || [];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await axios.get(`${api}/user/${userId}/`);
      setTasks(data.data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const openForm = () => {
    const { date } = getCurrentIndiaTime();
    const formatted = date.split("/").reverse().join("-"); // dd/mm/yyyy -> yyyy-mm-dd
    setNewTask({
      name: "",
      startDate: formatted,
    });
    setFormOpen(true);
  };

  const closeForm = () => setFormOpen(false);

  const handleChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.name) {
      alert("Please enter Task Name");
      return;
    }

    const { time: startTime } = getCurrentIndiaTime();

    const userId = JSON.parse(localStorage.getItem("userId"));

    console.log(userId, "User ID");

    try {
      const createTask = await axios.post(`${api}/clockin/${userId}/`, {
        task_name: newTask.name,
      });
      console.log(createTask, "");
      fetchData();
    } catch (error) {
      console.log(error);
    }

    setFormOpen(false);
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
      const res = await axios.post(`${api}/clockout/${userId}/`, {
        entry_id: selectedEntryId,
        comment: commentText,
      });

      console.log("Clock out success:", res.data);

      // Optionally refresh task list
      fetchData();
    } catch (error) {
      console.error("Clock out failed:", error);
    }

    // Reset UI state
    setCommentText("");
    setCommentOpen(false);
    setSelectedEntryId(null);
  };

  const extractDate = (dateTimeStr) => {
    if (!dateTimeStr) return "-";
    return new Date(dateTimeStr).toISOString().split("T")[0]; // returns YYYY-MM-DD
  };

  const extractTime = (dateTimeStr) => {
    if (!dateTimeStr) return "-";
    const time = new Date(dateTimeStr).toTimeString().split(" ")[0]; // returns HH:MM:SS
    return time;
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          Tasks List{" "}
          <span className="ml-2 text-sm">
            {formattedDate} | {formattedTime}
          </span>
        </h2>
        <div className="flex gap-2">
        <button
          onClick={openForm}
          className="bg-green-600 cursor-pointer text-white px-3 py-1 rounded hover:bg-green-700 flex items-center gap-1"
        >
          <FaPlus /> Add Task
        </button>
        <button onClick={handleLogout} 
        className="bg-red-600 cursor-pointer text-white px-3 py-1 rounded hover:bg-red-700 flex items-center gap-1"
        >
          Logout
        </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-400">
          <thead>
            <tr className="bg-gray-200">
              <th className=" px-4 py-2">SI No</th>
              <th className=" px-4 py-2">Task Name</th>
              <th className=" px-4 py-2">Date</th>
              <th className=" px-4 py-2">Start Time</th>
              <th className=" px-4 py-2">End Time</th>
              <th className=" px-4 py-2">Total Timing</th>
              <th className=" px-4 py-2">Comments</th>
              <th className=" px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks?.entries?.length > 0 ? (
              tasks?.entries?.map((task, idx) => (
                <tr
                  key={idx}
                  className={`text-center ${
                    task.end_time ? "bg-green-100" : ""
                  }`}
                >
                  <td className=" px-4 py-2">{idx + 1}</td>
                  <td className=" px-4 py-2">{task.task_name}</td>
                  <td className=" px-4 py-2">{extractDate(task.start_time)}</td>
                  <td className=" px-4 py-2">{extractTime(task.start_time)}</td>
                  <td className=" px-4 py-2">{extractTime(task.end_time)}</td>
                  <td className=" px-4 py-2">{task.total_hours || "-"}</td>
                  <td className=" px-4 py-2">{task.comment || "-"}</td>
                  <td className=" px-4 py-2 flex justify-center gap-2">
                    {task.end_time ? (
                      <span className="text-green-700 font-bold">
                        Completed
                      </span>
                    ) : (
                      <button
                        onClick={() => handleStop(idx)}
                        className="bg-yellow-600 cursor-pointer text-white px-2 py-1 rounded hover:bg-yellow-700 flex items-center gap-1"
                      >
                        <FaStop /> Stop
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className=" px-4 py-2 text-center">
                  No tasks available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {formOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-[90%] max-w-md p-6 shadow-lg relative">
            <h2 className="text-xl text-center font-bold mb-4">Add Task</h2>
            <button
              onClick={closeForm}
              className="absolute text-2xl top-3 cursor-pointer right-3 text-gray-600 hover:text-gray-800"
            >
              ✖
            </button>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={newTask.name}
                onChange={handleChange}
                placeholder="Task Name"
                className="w-full border  rounded-md p-2"
                required
              />
              <input
                type="date"
                name="startDate"
                value={newTask.startDate}
                readOnly
                className="w-full border rounded-md p-2"
              />
              <button
                type="submit"
                className="w-full bg-green-600 cursor-pointer text-white rounded-md py-2 hover:bg-green-700 transition"
              >
                Add Task
              </button>
            </form>
          </div>
        </div>
      )}

      {commentOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-[90%] max-w-md p-6 shadow-lg relative">
            <h2 className="text-xl text-center font-bold mb-4">Add Comment</h2>
            <button
              onClick={() => setCommentOpen(false)}
              className="absolute text-2xl top-3 cursor-pointer right-3 text-gray-600 hover:text-gray-800"
            >
              ✖
            </button>

            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Enter your comment"
                className="w-full border rounded-md p-2"
                rows="3"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 cursor-pointer text-white rounded-md py-2 hover:bg-blue-700 transition"
              >
                Save Comment
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksLists;