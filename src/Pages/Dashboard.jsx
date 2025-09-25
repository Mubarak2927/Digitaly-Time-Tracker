import axios from "axios";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Dashboard = () => {
 
    const [data, setData] = useState([]);
    const [user, setUser] = useState(null);

    const API = "https://timetracker-1-wix6.onrender.com";

    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const res = await axios.get(`${API}/admin/`);
          setData(res.data);
          console.log(res);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };

      fetchUsers();
    }, []);

    const handleViewDetails = async (user) => {
      try {
        const res = await axios.get(`${API}/admin/${user.user_id}/`);
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    const handleDownloadExcel = () => {
      if (!user || !user.entries || user.entries.length === 0) {
        alert("No task entries to export.");
        return;
      }

      const excelData = user.entries.map((entry, index) => ({
        "#": index + 1,
        "Task Name": entry.task_name,
        "Start Time": new Date(entry.start_time).toLocaleString(),
        "End Time": entry.end_time
          ? new Date(entry.end_time).toLocaleString()
          : "-",
        "Total Hours": entry.total_hours || "-",
        Status: entry.status || "-",
        Comment: entry.comment || "-",
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Task Entries");

      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      const fileData = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });

      saveAs(
        fileData,
        `${user.first_name}_${user.last_name}_Task_Entries.xlsx`
      );
    };

    return (
      <div className="p-6 font-sans">
        <div className="flex justify-between my-3">
          <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
          <button className="bg-blue-600 px-2 rounded-lg text-white hover:bg-blue-800">
            <a href="/Signup">Add Employee</a>
          </button>
        </div>

        {/* User Cards */}
        <div className="flex flex-wrap gap-6">
          {data?.map((user) => (
            <div
              key={user.user_id}
              className="border border-gray-300 rounded-md p-4 w-64 shadow-sm"
            >
              <h3 className="text-xl font-semibold mb-2">
                {user.first_name} {user.last_name}
              </h3>
              <p className="mb-1 text-gray-700">Email: {user.email}</p>
              <p className="mb-3 text-gray-700">
                Task Entries: {user.entries.length}
              </p>
              <button
                onClick={() => handleViewDetails(user)}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                View Details
              </button>
            </div>
          ))}
        </div>

        {/* Selected User Details */}
        {user && (
          <div className="mt-10">
            <h2 className="text-2xl font-bold mb-4">User Details</h2>
            <h3 className="text-xl font-semibold mb-1">
              {user.first_name} {user.last_name}
            </h3>
            <p className="mb-6 text-gray-700">Email: {user.email}</p>
            <div className="flex justify-between">
              <h4 className="text-lg font-semibold mb-2">Task Entries</h4>

              <button
                onClick={handleDownloadExcel}
                className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Download Excel
              </button>
            </div>

            {user.entries.length === 0 ? (
              <p className="text-gray-600">No task entries available.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">
                        #
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">
                        Task Name
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">
                        Start Time
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">
                        End Time
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">
                        Total Hours
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">
                        Status
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">
                        Comment
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {user.entries.map((entry, index) => (
                      <tr key={entry.entry_id}>
                        <td className="px-4 py-2 border border-gray-300 text-sm text-gray-700">
                          {index + 1}
                        </td>
                        <td className="px-4 py-2 border border-gray-300 text-sm text-gray-700">
                          {entry.task_name}
                        </td>
                        <td className="px-4 py-2 border border-gray-300 text-sm text-gray-700">
                          {new Date(entry.start_time).toLocaleString()}
                        </td>
                        <td className="px-4 py-2 border border-gray-300 text-sm text-gray-700">
                          {new Date(entry.end_time).toLocaleString()}
                        </td>
                        <td className="px-4 py-2 border border-gray-300 text-sm text-gray-700">
                          {entry.total_hours}
                        </td>
                        <td className="px-4 py-2 border border-gray-300 text-sm text-gray-700">
                          {entry.status}
                        </td>
                        <td className="px-4 py-2 border border-gray-300 text-sm text-gray-700">
                          {entry.comment}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };


export default Dashboard;
