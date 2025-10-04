import React, { useEffect, useState } from "react";
import axios from "axios";
import TasksLists from "../Tasklists";

const API = "https://timetracker-1-wix6.onrender.com";

const AssignedTask = () => {
    const [tasks, setTasks] = useState([]);
    const [runningEntry, setRunningEntry] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(false);

    const empId = JSON.parse(localStorage.getItem("userId"));

    useEffect(() => {
        fetchUserTasks();
    }, [refreshTrigger]);

    const fetchUserTasks = async () => {
        try {
            const res = await axios.get(`${API}/projectmanagement/projects/usertask/${empId}/`);
            const formatted = res.data.projects.flatMap((project) =>
                project.tasks.map((task) => ({
                    id: task.task_id,
                    projectName: project.project_name,
                    taskName: task.task_name,
                    status: task.status,
                }))
            );
            setTasks(formatted);

        } catch (err) {
            console.error(err);
        }
    };

    const handleStartTask = async (taskId) => {
        try {
            const res = await axios.post(`${API}/clockin/${empId}/`, { task_id: taskId });
            if (res.data.message) {
                alert(res.data.message);
                setRunningEntry(res.data);
                setRefreshTrigger((prev) => !prev);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleStopTask = async () => {
        try {
            const res = await axios.post(`${API}/clockout/${empId}/`, {
                entry_id: runningEntry.entry_id,
                comment: "Completed work",
            });
            if (res.data.message) {
                alert(res.data.message);
                setRunningEntry(null);
                setRefreshTrigger((prev) => !prev);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <TasksLists refresh={refreshTrigger} />
            <div className="px-6 py-10 bg-gray-900">
                <h2 className="text-3xl font-bold mb-10 text-center text-white">
                    Assigned Tasks
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {tasks.length > 0 ? (
                        tasks.map((task, index) => (
                            <div
                                key={task.id}
                                className="relative bg-gray-800 border border-cyan-400 rounded-2xl p-6 shadow-lg hover:shadow-cyan-500/50 transition duration-300 group"
                            >
                                {/* gradient overlay on hover */}
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-10 transition duration-300"></div>

                                <h3 className="text-xl font-semibold text-cyan-400 mb-2 z-10 relative">
                                    {task.projectName}
                                </h3>
                                <p className="text-gray-300 mb-5 z-10 relative">Task: {task.taskName}</p>

                                {task.status === "running" ? (
                                    <button
                                        // onClick={handleStopTask}
                                        className="w-full py-2 cursor-not-allowed rounded-xl text-white font-semibold bg-gradient-to-r from-red-500 to-red-700 hover:scale-105 transition duration-200 z-10 relative"
                                    >
                                        Running
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleStartTask(task.id)}
                                        className={`w-full py-2 rounded-xl text-white font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 hover:scale-105 transition duration-200 z-10 relative ${!!runningEntry ? "opacity-50 cursor-not-allowed" : ""
                                            }`}
                                        disabled={!!runningEntry}
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
            </div>
        </>
    );
};

export default AssignedTask;
