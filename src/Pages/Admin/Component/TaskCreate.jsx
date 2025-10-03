import React, { useEffect, useState } from "react";
import { data, useLocation, useParams } from "react-router-dom";
import axios from "axios";

const API = "https://timetracker-1-wix6.onrender.com";

const TaskCreate = () => {
    const { id } = useParams(); // project_id
    const { state } = useLocation(); // project object passed
    const project = state;

    const [tasks, setTasks] = useState([]);
    const [taskInput, setTaskInput] = useState("");
    const [employees, setEmployees] = useState([]);
    const [assignModal, setAssignModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [selectedEmp, setSelectedEmp] = useState("");


    const userId = JSON.parse(localStorage.getItem("userId"));

    useEffect(() => {
        fetchTasks();
        fetchEmployees();
    }, []);

    // ✅ Fetch tasks for this project
    const fetchTasks = async () => {
        try {
            const res = await axios.get(`${API}/projectmanagement/projects/${id}/tasks/`);
            setTasks(res.data.tasks || []);
            console.log(res.data.tasks);

        } catch (err) {
            console.error("Error fetching tasks", err);
        }
    };

    // ✅ Fetch employees (mock endpoint, replace with your API)
    const fetchEmployees = async () => {
        try {
            const res = await axios.post(`${API}/admin/`,
                {
                    user_id: userId
                }
            );
            console.log(res.data, "employeeeeeee");

            setEmployees(res.data || []);
        } catch (err) {
            console.error("Error fetching employees", err);
        }
    };

    // ✅ Create new task
    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const adminId = JSON.parse(localStorage.getItem("userId"));
            const payload = {
                admin_id: adminId,
                project_id: id,
                task: taskInput,
            };

            const res = await axios.post(`${API}/projectmanagement/projects/tasks/`, payload);
            if (res.data.message) {
                setTaskInput("");
                fetchTasks(); // refresh list
            }
        } catch (err) {
            console.error("Error creating task", err);
        }
    };

    // ✅ Assign task to employee
    const handleAssign = async (e) => {
        e.preventDefault();
        try {
            const adminId = JSON.parse(localStorage.getItem("userId"));

            const payload = {
                admin_id: adminId,
                task_id: selectedTask.task_id,
                emp_id: selectedEmp,
            };

            const res = await axios.post(`${API}/projectmanagement/projects/tasks/assign/`, payload);

            if (res.data.message) {
                alert(`✅ ${res.data.message} - ${res.data.data.emp_name}`);
                setAssignModal(false);
                setSelectedEmp("");
                fetchTasks(); // refresh tasks immediately
            }
        } catch (err) {
            console.error("Error assigning task", err);
        }
    };

    return (
        <div className="p-6">
            {/* Project Details */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <h1 className="text-2xl font-bold">{project.project_name}</h1>
                <p className="text-gray-600">Admin: {project.admin_email}</p>
            </div>

            {/* Task Form */}
            <form onSubmit={handleCreateTask} className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    placeholder="Enter task name"
                    className="flex-1 border rounded-lg px-3 py-2"
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                    Create
                </button>
            </form>

            {/* Task List */}
            <h2 className="text-xl font-bold mb-3">Tasks</h2>
            {tasks.length > 0 ? (
                <div className="space-y-3">
                    {tasks.map((task) => (
                        <div
                            key={task.task_id}
                            className="p-4 bg-gray-50 rounded-lg shadow flex justify-between items-center"
                        >
                            <div>
                                <h3 className="font-semibold">{task.task_name}</h3>
                                <p className="text-sm text-gray-500">
                                    Time Used: {task.total_time_minutes} min
                                </p>
                            </div>
                            <div className="flex gap-2 items-center">
                                {task.assigned_employees && task.assigned_employees.length > 0 ? (
                                    <div className="flex flex-col gap-1">
                                        {task.assigned_employees.map((emp) => (
                                            <span
                                                key={emp.emp_id}
                                                className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded"
                                            >
                                                Assigned to: {emp.emp_name} (by {emp.assigned_by_admin_name})
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setSelectedTask(task);
                                            setAssignModal(true);
                                        }}
                                        className="bg-purple-500 text-white px-3 py-1 rounded"
                                    >
                                        Assign
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No tasks yet. Create one above.</p>
            )}

            {/* Assign Modal */}
            {assignModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">
                            Assign "{selectedTask.task_name}" to Employee
                        </h2>
                        <form onSubmit={handleAssign} className="space-y-4">
                            <select
                                value={selectedEmp}
                                onChange={(e) => setSelectedEmp(e.target.value)}
                                className="w-full border rounded px-3 py-2"
                                required
                            >
                                <option value="">Select Employee</option>
                                {employees.map((emp) => (
                                    <option key={emp.user_id} value={emp.user_id}>
                                        {emp.e_name}
                                    </option>
                                ))}
                            </select>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setAssignModal(false)}
                                    className="px-4 py-2 bg-gray-300 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded"
                                >
                                    Assign
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskCreate;
