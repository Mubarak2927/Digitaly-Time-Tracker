import React from 'react'
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from 'react-router-dom';


const Employee = ({ loading, data, user, groupEntriesByDate, handleViewDetails }) => {


    const navigate = useNavigate()

    const handleDownloadExcel = (user) => {
        if (!user || !user.entries || user.entries.length === 0) {
            alert("No task entries to export.");
            return;
        }

        const excelData = user.entries.map((entry, index) => ({
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

        saveAs(fileData, `${user.first_name}_${user.last_name}_Task_Entries.xlsx`);
    };


    const rowColors = ["bg-gray-50", "bg-gray-100"];


    return (
        <div>
            <>
                <div className='flex justify-between mx-4 mt-4 items-center'>

                    <h2 className="text-3xl font-bold ml-7  mt-5">Employees</h2>

                    <button className='bg-blue-500 p-2 rounded text-white'
                        onClick={() => {
                            navigate('/signup')
                        }}
                    > Add Employee</button>

                </div>
                <section className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {loading ? (
                        <div className="flex justify-center h-[80vh] items-center col-span-full">
                            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <span className="ml-2 text-blue-700">Loading...</span>
                        </div>
                    ) : (
                        data?.map((user) => (
                            <div
                                key={user.user_id}
                                className="bg-white border border-gray-200 rounded-lg p-4 shadow hover:shadow-lg transition"
                            >
                                <h3 className="text-lg font-semibold capitalize">{user.e_name}</h3>
                                <p className="text-gray-600 text-sm">Email : {user.email}</p>
                                <p className="text-gray-600 text-sm mb-2">Task Entries: {user.entries.length}</p>
                                <button
                                    onClick={() => handleViewDetails(user)}
                                    className="px-3 py-1 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700"
                                >
                                    View Details
                                </button>
                            </div>
                        ))
                    )}
                </section>
                {user && (
                    <section className="p-6 ">
                        <h2 className="text-xl font-bold mb-3">User Details</h2>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h3 className="text-lg font-semibold">Name : <span className="font-normal capitalize">{user.e_name}</span></h3>
                            <p className="text-gray-600 mb-4">Email: {user.email}</p>
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold">Task Entries</h4>
                                <button
                                    onClick={() => handleDownloadExcel(user)}
                                    className="bg-green-600 text-white px-4 py-2 top-2 rounded hover:bg-green-700 cursor-pointer"
                                >
                                    Download Excel
                                </button>
                            </div>
                            {user.entries.length === 0 ? (
                                <p className="text-gray-600">No task entries available.</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full border border-gray-300 divide-y divide-gray-200 text-sm">
                                        <thead className="bg-gray-200">
                                            <tr>
                                                <th className="px-4 py-2 border">#</th>
                                                <th className="px-4 py-2 border">Task Name</th>
                                                <th className="px-4 py-2 border">Date</th>
                                                <th className="px-4 py-2 border">Start Time</th>
                                                <th className="px-4 py-2 border">End Time</th>
                                                <th className="px-4 py-2 border">Total Hours</th>
                                                <th className="px-4 py-2 border">Status</th>
                                                <th className="px-4 py-2 border">Comment</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {Object.entries(groupEntriesByDate(user.entries)).map(
                                                ([date, entriesForDate], dateIdx) => {
                                                    const bgColor = rowColors[dateIdx % 2];
                                                    return (
                                                        <React.Fragment key={date}>
                                                            {entriesForDate.map((entry, idx) => (
                                                                <tr key={entry.entry_id || idx} className={bgColor}>
                                                                    <td className="px-4 py-2 border">{idx + 1}</td>
                                                                    <td className="px-4 py-2 border">{entry.task_name}</td>
                                                                    {idx === 0 && (
                                                                        <td className="px-4 py-2 border" rowSpan={entriesForDate.length}>{date}</td>
                                                                    )}
                                                                    <td className="px-4 py-2 border">{new Date(entry.start_time).toLocaleString()}</td>
                                                                    <td className="px-4 py-2 border">{entry.end_time ? new Date(entry.end_time).toLocaleString() : "-"}</td>
                                                                    <td className="px-4 py-2 border">{entry.total_hours || "-"}</td>
                                                                    <td className="px-4 py-2 border">{entry.status || "-"}</td>
                                                                    <td className="px-4 py-2 border">{entry.comment || "-"}</td>
                                                                </tr>
                                                            ))}
                                                        </React.Fragment>
                                                    );
                                                }
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </section>
                )}
            </>
        </div>
    )
}

export default Employee
