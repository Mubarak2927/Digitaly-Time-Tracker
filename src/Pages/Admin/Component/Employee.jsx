import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";

const Employee = ({ loading, data }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("entries"); // "entries" or "summary"

    // Filters and pagination for Entries
    const [entryFilter, setEntryFilter] = useState({ start: "", end: "" });
    const [entryPage, setEntryPage] = useState(1);
    const entryPerPage = 10;
    const [filteredEntries, setFilteredEntries] = useState([]);

    // Filters and pagination for Summary
    const [summaryFilter, setSummaryFilter] = useState({ start: "", end: "" });
    const [summaryPage, setSummaryPage] = useState(1);
    const summaryPerPage = 10;
    const [filteredSummary, setFilteredSummary] = useState([]);

    const rowColors = ["bg-gray-50", "bg-gray-100"];

    // Filter Entries
    useEffect(() => {
        if (!user) return;
        let entries = [...user.entries];

        if (entryFilter.start && entryFilter.end) {
            const start = new Date(entryFilter.start).setHours(0, 0, 0, 0);
            const end = new Date(entryFilter.end).setHours(23, 59, 59, 999);
            entries = entries.filter((e) => {
                const entryDate = new Date(e.start_time).getTime();
                return entryDate >= start && entryDate <= end;
            });
        } else {
            // Default today
            const today = new Date();
            const start = new Date(today).setHours(0, 0, 0, 0);
            const end = new Date(today).setHours(23, 59, 59, 999);
            entries = entries.filter((e) => {
                const entryDate = new Date(e.start_time).getTime();
                return entryDate >= start && entryDate <= end;
            });
        }

        setFilteredEntries(entries);
        setEntryPage(1);
    }, [user, entryFilter]);

    // Filter Summary
    useEffect(() => {
        if (!user?.daily_summary) return;
        let summary = [...user.daily_summary];

        if (summaryFilter.start && summaryFilter.end) {
            const start = new Date(summaryFilter.start).setHours(0, 0, 0, 0);
            const end = new Date(summaryFilter.end).setHours(23, 59, 59, 999);
            summary = summary.filter((s) => {
                const sDate = new Date(s.date).getTime();
                return sDate >= start && sDate <= end;
            });
        }

        setFilteredSummary(summary);
        setSummaryPage(1);
    }, [user, summaryFilter]);

    const handleDownloadExcel = (type) => {
        if (!user) return;
        let dataToExport = [];

        if (type === "entries") {
            if (!filteredEntries.length) return alert("No entries to export");
            dataToExport = filteredEntries.map((e, i) => ({
                "#": i + 1,
                "Task Name": e.task_name,
                "Start Time": new Date(e.start_time).toLocaleString(),
                "End Time": e.end_time ? new Date(e.end_time).toLocaleString() : "-",
                "Total Hours": e.total_hours || "-",
                Status: e.status || "-",
                Comment: e.comment || "-",
            }));
        } else if (type === "summary") {
            if (!filteredSummary.length) return alert("No summary to export");
            dataToExport = filteredSummary.map((s, i) => ({
                "#": i + 1,
                Date: s.date,
                "Total Hours": s.total_hours,
            }));
        }

        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, type === "entries" ? "Task Entries" : "Daily Summary");
        const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(fileData, `${user.e_name}_${type}.xlsx`);
    };

    // Paginate
    const paginatedEntries = filteredEntries.slice((entryPage - 1) * entryPerPage, entryPage * entryPerPage);
    const paginatedSummary = filteredSummary.slice((summaryPage - 1) * summaryPerPage, summaryPage * summaryPerPage);
    const totalEntryPages = Math.ceil(filteredEntries.length / entryPerPage);
    const totalSummaryPages = Math.ceil(filteredSummary.length / summaryPerPage);

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
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

            {user && (
                <section className="mt-8">


                    <h2 className="text-3xl font-semibold my-4">{user.e_name}</h2>

                    <div className="flex gap-4 border-b border-gray-300 mb-4">
                        <button
                            className={`px-4 py-2 font-semibold ${activeTab === "entries" ? "border-b-2 border-cyan-500 text-cyan-500" : "text-gray-500"}`}
                            onClick={() => setActiveTab("entries")}
                        >
                            Task Entries
                        </button>
                        <button
                            className={`px-4 py-2 font-semibold ${activeTab === "summary" ? "border-b-2 border-cyan-500 text-cyan-500" : "text-gray-500"}`}
                            onClick={() => setActiveTab("summary")}
                        >
                            Daily Summary
                        </button>
                    </div>

                    {activeTab === "entries" && (
                        <div>
                            {/* Filters */}
                            <div className="flex gap-2 mb-4 items-center">
                                <input type="date" value={entryFilter.start} onChange={(e) => setEntryFilter({ ...entryFilter, start: e.target.value })} className="border px-2 py-1 rounded" />
                                <span>to</span>
                                <input type="date" value={entryFilter.end} onChange={(e) => setEntryFilter({ ...entryFilter, end: e.target.value })} className="border px-2 py-1 rounded" />
                                <button onClick={() => handleDownloadExcel("entries")} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold">Download Excel</button>
                                <button onClick={() => setEntryFilter({ start: "", end: "" })} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-semibold">Reset</button>
                            </div>

                            {/* Table */}
                            {paginatedEntries.length === 0 ? (
                                <p className="text-gray-600">No entries for selected dates.</p>
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
                                            {paginatedEntries.map((e, i) => (
                                                <tr key={e.entry_id || i} className={rowColors[i % 2]}>
                                                    <td className="px-4 py-2 border">{i + 1}</td>
                                                    <td className="px-4 py-2 border">{e.task_name}</td>
                                                    <td className="px-4 py-2 border">{new Date(e.start_time).toLocaleString()}</td>
                                                    <td className="px-4 py-2 border">{e.end_time ? new Date(e.end_time).toLocaleString() : "-"}</td>
                                                    <td className="px-4 py-2 border">{e.total_hours || "-"}</td>
                                                    <td className="px-4 py-2 border">{e.status || "-"}</td>
                                                    <td className="px-4 py-2 border">{e.comment || "-"}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Pagination */}
                            {totalEntryPages > 1 && (
                                <div className="mt-4 flex justify-center gap-2">
                                    {Array.from({ length: totalEntryPages }).map((_, i) => (
                                        <button
                                            key={i}
                                            className={`px-3 py-1 rounded ${entryPage === i + 1 ? "bg-cyan-500 text-white" : "bg-gray-200 text-gray-800"}`}
                                            onClick={() => setEntryPage(i + 1)}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "summary" && (
                        <div>
                            {/* Filters */}
                            <div className="flex gap-2 mb-4 items-center">
                                <input type="date" value={summaryFilter.start} onChange={(e) => setSummaryFilter({ ...summaryFilter, start: e.target.value })} className="border px-2 py-1 rounded" />
                                <span>to</span>
                                <input type="date" value={summaryFilter.end} onChange={(e) => setSummaryFilter({ ...summaryFilter, end: e.target.value })} className="border px-2 py-1 rounded" />
                                <button onClick={() => handleDownloadExcel("summary")} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold">Download Excel</button>
                                <button onClick={() => setSummaryFilter({ start: "", end: "" })} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-semibold">Reset</button>
                            </div>

                            {/* Table */}
                            {paginatedSummary.length === 0 ? (
                                <p className="text-gray-600">No summary for selected dates.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full border border-gray-300 divide-y divide-gray-200 text-sm rounded-lg">
                                        <thead className="bg-gray-200 sticky top-0 z-10">
                                            <tr>
                                                <th className="px-4 py-2 border">#</th>
                                                <th className="px-4 py-2 border">Date</th>
                                                <th className="px-4 py-2 border">Total Hours</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paginatedSummary.map((s, i) => (
                                                <tr key={i} className={rowColors[i % 2]}>
                                                    <td className="px-4 py-2 border">{i + 1}</td>
                                                    <td className="px-4 py-2 border">{s.date}</td>
                                                    <td className="px-4 py-2 border">{s.total_hours}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Pagination */}
                            {totalSummaryPages > 1 && (
                                <div className="mt-4 flex justify-center gap-2">
                                    {Array.from({ length: totalSummaryPages }).map((_, i) => (
                                        <button
                                            key={i}
                                            className={`px-3 py-1 rounded ${summaryPage === i + 1 ? "bg-cyan-500 text-white" : "bg-gray-200 text-gray-800"}`}
                                            onClick={() => setSummaryPage(i + 1)}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </section>
            )}
        </div>
    );
};

export default Employee;
