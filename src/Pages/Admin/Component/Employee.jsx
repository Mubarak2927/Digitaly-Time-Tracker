import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";

const Employee = ({ loading, data, groupEntriesByDate, handleViewDetails }) => {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [filteredEntries, setFilteredEntries] = useState([]);
    const [dateFilter, setDateFilter] = useState({ start: "", end: "" });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const rowColors = ["bg-gray-50", "bg-gray-100"];

    // Update filtered entries whenever user or dateFilter changes
    useEffect(() => {
        if (!user) return;

        let entries = [...user.entries];

        // Apply date filter
        if (dateFilter.start && dateFilter.end) {
            const start = new Date(dateFilter.start).setHours(0, 0, 0, 0);
            const end = new Date(dateFilter.end).setHours(23, 59, 59, 999);
            entries = entries.filter((e) => {
                const entryDate = new Date(e.start_time).getTime();
                return entryDate >= start && entryDate <= end;
            });
        } else {
            // Default: show only today's entries
            const today = new Date();
            const start = new Date(today).setHours(0, 0, 0, 0);
            const end = new Date(today).setHours(23, 59, 59, 999);
            entries = entries.filter((e) => {
                const entryDate = new Date(e.start_time).getTime();
                return entryDate >= start && entryDate <= end;
            });
        }

        setFilteredEntries(entries);
        setCurrentPage(1); // Reset page when filter changes
    }, [user, dateFilter]);

    const handleDownloadExcel = () => {
        if (!filteredEntries || filteredEntries.length === 0) {
            alert("No task entries to export.");
            return;
        }

        const excelData = filteredEntries.map((entry, index) => ({
            "#": index + 1,
            "Task Name": entry.task_name,
            "Start Time": new Date(entry.start_time).toLocaleString(),
            "End Time": entry.end_time ? new Date(entry.end_time).toLocaleString() : "-",
            "Total Hours": entry.total_hours || "-",
            Status: entry.status || "-",
            Comment: entry.comment || "-",
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Task Entries");

        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });

        saveAs(fileData, `${user.e_name}_Task_Entries.xlsx`);
    };

    // Pagination
    const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
    const paginatedEntries = filteredEntries.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="px-6 py-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Employees</h2>
                <button
                    className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg shadow transition-all flex items-center gap-2"
                    onClick={() => navigate("/signup")}
                >
                    Add Employee
                </button>
            </div>

            {/* Employee Cards */}
            <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {loading ? (
                    <div className="flex justify-center items-center col-span-full h-[60vh]">
                        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="ml-3 text-cyan-600 font-medium">Loading...</span>
                    </div>
                ) : data.length > 0 ? (
                    data.map((emp) => (
                        <div
                            key={emp.user_id}
                            className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl p-6 shadow-md hover:shadow-cyan-400/30 transition-all"
                        >
                            <h3 className="text-xl font-semibold capitalize text-gray-800 mb-2">{emp.e_name}</h3>
                            <p className="text-gray-600 text-sm mb-1">Email: {emp.email}</p>
                            <p className="text-gray-600 text-sm mb-4">Task Entries: {emp.entries.length}</p>
                            <button
                                onClick={() => setUser(emp)}
                                className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold py-2 rounded-lg transition-all"
                            >
                                View Details
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400 col-span-full text-center">No employees available.</p>
                )}
            </section>

            {/* Selected User Details */}
            {user && (
                <section className="mt-8">
                    <h2 className="text-3xl font-bold text-gray-800">{user.e_name}</h2>

                    <div className="flex justify-between items-center mb-4 mt-4">

                        <div className="flex gap-4 items-center">
                            <h2 className="text-2xl font-bold text-gray-800">User Details</h2><br />


                            {/* Date Filter */}
                            <div className="flex gap-2 items-center">
                                <input
                                    type="date"
                                    value={dateFilter.start}
                                    onChange={(e) => setDateFilter({ ...dateFilter, start: e.target.value })}
                                    className="border px-2 py-1 rounded"
                                />
                                <span>to</span>
                                <input
                                    type="date"
                                    value={dateFilter.end}
                                    onChange={(e) => setDateFilter({ ...dateFilter, end: e.target.value })}
                                    className="border px-2 py-1 rounded"
                                />
                                <button
                                    onClick={handleDownloadExcel}
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold"
                                >
                                    Download Excel
                                </button>
                                {/* Reset Button */}
                                <button
                                    onClick={() => setDateFilter({ start: "", end: "" })}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-semibold transition"
                                >
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>

                    {paginatedEntries.length === 0 ? (
                        <p className="text-gray-600">No task entries available for selected dates.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-300 divide-y divide-gray-200 text-sm rounded-lg">
                                <thead className="bg-gray-200 sticky top-0 z-10">
                                    <tr>
                                        <th className="px-4 py-2 border">#</th>
                                        <th className="px-4 py-2 border">Task Name</th>
                                        <th className="px-4 py-2 border">Start Time</th>
                                        <th className="px-4 py-2 border">End Time</th>
                                        <th className="px-4 py-2 border">Total Hours</th>
                                        <th className="px-4 py-2 border">Status</th>
                                        <th className="px-4 py-2 border">Comment</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedEntries.map((entry, idx) => (
                                        <tr key={entry.entry_id || idx} className={rowColors[idx % 2]}>
                                            <td className="px-4 py-2 border">{idx + 1}</td>
                                            <td className="px-4 py-2 border">{entry.task_name}</td>
                                            <td className="px-4 py-2 border">{new Date(entry.start_time).toLocaleString()}</td>
                                            <td className="px-4 py-2 border">{entry.end_time ? new Date(entry.end_time).toLocaleString() : "-"}</td>
                                            <td className="px-4 py-2 border">{entry.total_hours || "-"}</td>
                                            <td className="px-4 py-2 border">{entry.status || "-"}</td>
                                            <td className="px-4 py-2 border">{entry.comment || "-"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-4 flex justify-center gap-2">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-cyan-500 text-white" : "bg-gray-200 text-gray-800"
                                        }`}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </section>
            )}
        </div>
    );
};

export default Employee;

