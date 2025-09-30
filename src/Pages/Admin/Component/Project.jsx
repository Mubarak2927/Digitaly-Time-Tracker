import React, { useState } from 'react'

const Project = () => {

    const [createForm, setCreateForm] = useState(false);
    const [formData, setFormData] = useState({ projectName: "" });

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
        <div>
            <div className='flex justify-between mx-4 mt-4 items-center'>

                <h2 className="text-3xl font-bold ml-7  mt-5">Project</h2>

                <button className='bg-blue-500 p-2 rounded text-white'
                    onClick={() => setCreateForm(true)
                    }
                > Add Project</button>

            </div>

            {
                createForm && (
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
                )
            }
        </div >
    )
}

export default Project
