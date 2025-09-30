import axios from "axios";
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false)

  const API = "https://timetracker-1-wix6.onrender.com";

  const userId = JSON.parse(localStorage.getItem("userId"))

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        console.log(userId);
        const res = await axios.post(`${API}/admin/`,
          {
            user_id: userId
          }
        );
        setData(res.data);
        console.log(res);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false)
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

  const groupEntriesByDate = (entries) => {
    if (!entries) return {};
    return entries.reduce((acc, entry) => {
      const date = new Date(entry.start_time).toISOString().split("T")[0]; // YYYY-MM-DD
      if (!acc[date]) acc[date] = [];
      acc[date].push(entry);
      return acc;
    }, {});
  };


  const rowColors = ["bg-gray-100", "bg-gray-200"];

  const adminLogOut = () => {
    navigate('/')
  }
  const addEmployee = () => {
    navigate("/Signup")
  }

  return (
    <div className=" p-6 font-sans h-screen bg-gray-300">
      <div className="flex justify-between ">
        <div className="bg-white  h-screen w-[30%]">
          <div className="flex flex-col ml-[35%] mt-10">
            <img src="https://www.pngmart.com/files/22/User-Avatar-Profile-PNG-Isolated-Clipart.png" 
          alt="user profile"
          className="w-20 h-20 bg-black rounded-full" />
             <h1 className="ml-5">Admin</h1>
          </div>
          <div className="bg-gray-300 h-[80%] w-[70%] ml-15">

          </div>
        </div>
        {/* <div className=" flex  gap-3">
          <button
            onClick={adminLogOut}
            className="bg-red-500 p-2 hover:bg-red-700 cursor-pointer text-white h-fit rounded-lg ">
            Logout
          </button>
          <button
            onClick={addEmployee}
            className="bg-blue-600  cursor-pointer p-2 h-fit rounded-lg text-white hover:bg-blue-800">
            Add Employee
          </button>
        </div> */}
      </div>


      {loading ? (
        <div className="flex justify-center items-center">
          <div className="w-6 h-6 border-4 border-black border-t-transparent border-solid rounded-full animate-spin"></div>
          <span className="ml-2 text-black">Loading...</span>
        </div>
      ) : (
        // {/* User Cards */ }
        <div div className="flex flex-wrap gap-6 ml-[40%]">
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
      )
      }

      {/* Selected User Details */}
      {
        user && (
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
                  <thead className="bg-gray-300">
                    <tr>
                      <th className="px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">
                        #
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">
                        Task Name
                      </th>
                      <th className="px-4 py-2 border border-gray-300 text-left text-sm font-medium text-gray-700">
                        Date
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

                  <tbody>
                    {user.entries.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-4 py-2 text-center text-gray-600">
                          No task entries available.
                        </td>
                      </tr>
                    ) : (
                      Object.entries(groupEntriesByDate(user.entries)).map(
                        ([date, entriesForDate], dateIdx) => {
                          const bgColor = rowColors[dateIdx % 2]; // alternate colors by date
                          return (
                            <React.Fragment key={date}>
                              {entriesForDate.map((entry, idx) => (
                                <tr key={entry.entry_id || idx} className={`${bgColor}`}>
                                  <td className="px-4 py-2 border border-gray-300 text-sm text-gray-700">
                                    {idx + 1}
                                  </td>
                                  <td className="px-4 py-2 border border-gray-300 text-sm text-gray-700">
                                    {entry.task_name}
                                  </td>
                                  {idx === 0 ? (
                                    <td
                                      className="px-4 py-2 border border-gray-300 text-sm text-gray-700"
                                      rowSpan={entriesForDate.length}
                                    >
                                      {date}
                                    </td>
                                  ) : null}
                                  <td className="px-4 py-2 border border-gray-300 text-sm text-gray-700">
                                    {new Date(entry.start_time).toLocaleString()}
                                  </td>
                                  <td className="px-4 py-2 border border-gray-300 text-sm text-gray-700">
                                    {entry.end_time ? new Date(entry.end_time).toLocaleString() : "-"}
                                  </td>
                                  <td className="px-4 py-2 border border-gray-300 text-sm text-gray-700">
                                    {entry.total_hours || "-"}
                                  </td>
                                  <td className="px-4 py-2 border border-gray-300 text-sm text-gray-700">
                                    {entry.status || "-"}
                                  </td>
                                  <td className="px-4 py-2 border border-gray-300 text-sm text-gray-700">
                                    {entry.comment || "-"}
                                  </td>
                                </tr>
                              ))}
                            </React.Fragment>
                          );
                        }
                      )
                    )}
                  </tbody>

                </table>
              </div>
            )}
          </div>
        )
      }
    </div >
  );
};


export default Dashboard;
