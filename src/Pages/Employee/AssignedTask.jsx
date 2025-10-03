import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "https://timetracker-1-wix6.onrender.com";

const AssignedTask = () => {
    const [tasks, setTasks] = useState([]);
    const [runningEntry, setRunningEntry] = useState(null); // currently running task
    const [history, setHistory] = useState([]); // completed sessions

    const empId = JSON.parse(localStorage.getItem("userId"));

    useEffect(() => {
        fetchUserTasks();
    }, []);

    // ✅ Fetch tasks assigned to user
    const fetchUserTasks = async () => {
        try {
            const res = await axios.get(`${API}/projectmanagement/projects/usertask/${empId}/`);
            const formatted = res.data.projects.flatMap((project) =>
                project.tasks.map((task) => ({
                    id: task.task_id,
                    projectName: project.project_name,
                    taskName: task.task_name,
                }))
            );
            setTasks(formatted);
        } catch (err) {
            console.error("Error fetching user tasks", err);
        }
    };

    // ✅ Start task (clock in)
    const handleStartTask = async (taskId) => {
        try {
            const res = await axios.post(`${API}/clockin/${empId}/`, { task_id: taskId });
            if (res.data.message) {
                alert(res.data.message);
                setRunningEntry(res.data); // store current running entry
            }
        } catch (err) {
            console.error("Error starting task", err);
        }
    };

    // ✅ Stop task (clock out)
    const handleStopTask = async () => {
        try {
            const res = await axios.post(`${API}/clockout/${empId}/`, {
                entry_id: runningEntry.entry_id,
                comment: "Completed work",
            });
            if (res.data.message) {
                alert(res.data.message);
                setRunningEntry(null); // reset running task
                setHistory((prev) => [...prev, res.data]); // add to history table
            }
        } catch (err) {
            console.error("Error stopping task", err);
        }
    };

    return (
        <div className="px-6 py-10">
            <h2 className="text-xl font-bold mb-8 text-center">Assigned Tasks</h2>

            {/* Task Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <div
                            key={task.id}
                            className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700 hover:shadow-cyan-500/20 transition"
                        >
                            <h3 className="text-xl font-semibold text-cyan-400 mb-2">
                                {task.projectName}
                            </h3>
                            <p className="text-gray-300 mb-4">Task: {task.taskName}</p>

                            {runningEntry && runningEntry.task_id === task.id ? (
                                <button
                                    onClick={handleStopTask}
                                    className="mt-5 w-full py-2 bg-gradient-to-r from-red-500 to-red-700 rounded-xl text-white font-semibold hover:scale-105 transition"
                                >
                                    Stop Task
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleStartTask(task.id)}
                                    className="mt-5 w-full py-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl text-white font-semibold hover:scale-105 transition"
                                    disabled={!!runningEntry} // allow only 1 task running
                                >
                                    Start Task
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 text-center col-span-full">
                        No tasks assigned yet.
                    </p>
                )}
            </div>

            {/* History Table */}
            <div className="mt-10 bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-bold mb-4">Task History</h3>
                {history.length > 0 ? (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="p-3 border">Task Name</th>
                                <th className="p-3 border">Start Time</th>
                                <th className="p-3 border">End Time</th>
                                <th className="p-3 border">Total Hours</th>
                                <th className="p-3 border">Comment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((h, i) => (
                                <tr key={i} className="border-t">
                                    <td className="p-3 border">{h.task_name}</td>
                                    <td className="p-3 border">{h.start_time}</td>
                                    <td className="p-3 border">{h.end_time}</td>
                                    <td className="p-3 border">{h.total_hours}</td>
                                    <td className="p-3 border">{h.comment}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-500">No history yet.</p>
                )}
            </div>
        </div>
    );
};

export default AssignedTask;
