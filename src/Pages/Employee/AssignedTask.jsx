import React from "react";

const AssignedTask = () => {
    const tasks = [
        {
            id: 1,
            projectName: "Time Tracker App",
            taskName: "Create Signup Page",
            duration: "6 hrs",
            pendingTime: "4 hrs",
            usedTime: "2 hrs",
            assignedBy: "John Doe",
        },
        {
            id: 2,
            projectName: "CRM Dashboard",
            taskName: "Build Analytics Chart",
            duration: "8 hrs",
            pendingTime: "6 hrs",
            usedTime: "2 hrs",
            assignedBy: "Sarah Smith",
        },
        {
            id: 3,
            projectName: "E-Commerce Site",
            taskName: "Setup Payment Gateway",
            duration: "10 hrs",
            pendingTime: "9 hrs",
            usedTime: "1 hr",
            assignedBy: "Mike Ross",
        },
        {
            id: 4,
            projectName: "Portfolio Website",
            taskName: "Add Blog Section",
            duration: "5 hrs",
            pendingTime: "3 hrs",
            usedTime: "2 hrs",
            assignedBy: "Rachel Green",
        },
    ];

    return (
        <div className=" px-6 py-10">
            <h2 className="text-xl font-bold mb-8 text-center">
                Assigned Tasks
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className="bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-700 hover:shadow-cyan-500/20 transition"
                    >
                        <h3 className="text-xl font-semibold text-cyan-400 mb-2">
                            {task.projectName}
                        </h3>
                        <p className="text-gray-300 mb-4">Task: {task.taskName}</p>

                        <div className="space-y-2 text-gray-400 text-sm">
                            <p>
                                <span className="font-semibold text-white">Duration:</span>{" "}
                                {task.duration}
                            </p>
                            <p>
                                <span className="font-semibold text-white">Pending Time:</span>{" "}
                                {task.pendingTime}
                            </p>
                            <p>
                                <span className="font-semibold text-white">Used Time:</span>{" "}
                                {task.usedTime}
                            </p>
                            <p>
                                <span className="font-semibold text-white">Assigned By:</span>{" "}
                                {task.assignedBy}
                            </p>
                        </div>

                        <button className="mt-5 w-full py-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl text-white font-semibold hover:scale-105 transition">
                            Start Task
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AssignedTask;
