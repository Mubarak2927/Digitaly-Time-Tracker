import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "https://timetracker-1-wix6.onrender.com";

const Project = () => {
    const [createForm, setCreateForm] = useState(false);
    const [projects, setProjects] = useState([]);
    const [formData, setFormData] = useState({ project: "" });
    const navigate = useNavigate();

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await axios.get(`${API}/projectmanagement/projects/`);
            setProjects(res.data.data);
        } catch (err) {
            console.error("Error fetching projects:", err);
        }
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            const adminId = JSON.parse(localStorage.getItem("userId"));
            const payload = { admin_id: adminId, project: formData.project };

            const res = await axios.post(`${API}/projectmanagement/projects/`, payload);

            if (res.data.message) {
                alert(`Project "${formData.project}" created successfully!`);
                setFormData({ project: "" });
                setCreateForm(false);
                fetchProjects();
            } else {
                alert("Failed to create project.");
            }
        } catch (err) {
            console.error(err);
            alert("Error creating project.");
        }
    };

    return (
        <div className="px-6 py-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Projects</h2>
                <button
                    className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:from-blue-500 hover:to-cyan-400 transition-all"
                    onClick={() => setCreateForm(true)}
                >
                    Add Project
                </button>
            </div>

            {/* Project Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {projects.length > 0 ? (
                    projects.map((proj) => (
                        <div
                            key={proj.project_id}
                            className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-cyan-400/30 transition-all cursor-pointer"
                            onClick={() => navigate(`/project/${proj.project_id}`, { state: proj })}
                        >
                            <h3 className="text-xl font-bold mb-1">{proj.project_name}</h3>
                            <p className="text-gray-500 text-sm">{proj.admin_email}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 col-span-full text-center">No projects available.</p>
                )}
            </div>

            {/* Create Project Modal */}
            {createForm && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
                        <h2 className="text-2xl font-bold text-center mb-4">Create Project</h2>
                        <form onSubmit={handleCreateProject} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Project Name"
                                value={formData.project}
                                onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                required
                            />
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setCreateForm(false)}
                                    className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold hover:from-green-600 hover:to-green-500 transition-all"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Project;
