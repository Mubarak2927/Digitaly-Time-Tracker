import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = "https://timetracker-1-wix6.onrender.com"; // replace with your API base URL

const Project = () => {
    const [createForm, setCreateForm] = useState(false);
    const [project, setProject] = useState([])
    const [formData, setFormData] = useState({ project: "" });


    const navigate = useNavigate();


    useEffect(() => {


        task()
    }, [])

    const task = async () => {
        try {
            const data = await axios.get(`${API}/projectmanagement/projects/`)
            setProject(data.data.data)
            console.log(data, "Project received");

        } catch (error) {
            console.log(error);

        }
    }

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            const adminId = JSON.parse(localStorage.getItem("userId"));

            const payload = {
                admin_id: adminId,
                project: formData.project, // ✅ match your API field
            };

            const res = await axios.post(`${API}/projectmanagement/projects/`, payload);
            console.log(res, "1241254215215");


            if (res.data.message) {
                alert(`Project "${formData.project}" created successfully!`);
                setFormData({ project: "" });
                setCreateForm(false);
                task()
            } else {
                alert("Failed to create project.");
            }
        } catch (err) {
            console.error(err);
            alert("Error creating project.");
        }
    };

    return (
        <div>
            <div className="flex justify-between mx-4 mt-4 items-center">
                <h2 className="text-3xl font-bold ml-7 mt-5">Project</h2>
                <button
                    className="bg-blue-500 p-2 rounded text-white"
                    onClick={() => setCreateForm(true)}
                >
                    Add Project
                </button>
            </div>

            <div className='grid  grid-cols-1 md:grid-cols-3 gap-3 p-6'>
                {project?.map((project) => (
                    <div
                        key={project.project_id}
                        className="bg-white rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg "
                        onClick={() => {
                            // setSelectedProject(project);
                            navigate(`/project/${project.project_id}`, { state: project });
                            setTasks([]); // later replace with API fetch
                        }}
                    >
                        <h2 className="text-xl font-bold">{project.project_name}</h2>
                        <p className="text-sm text-gray-500">{project.admin_email}</p>
                    </div>
                ))}
            </div>

            {createForm && (
                <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
                        <h2 className="text-xl font-bold mb-4 text-center">Create Project</h2>
                        <form onSubmit={handleCreateProject} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Project Name"
                                value={formData.project}
                                onChange={(e) =>
                                    setFormData({ ...formData, project: e.target.value })
                                }
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
        </div>
    );
};

export default Project;
