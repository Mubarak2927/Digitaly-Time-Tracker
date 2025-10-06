import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import LoginForm from "./Pages/LoginForm";
import Tasklists from "./Pages/Tasklists";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Admin/Dashboard";
import Notfound from "./Pages/Notfound";
import AdminLogin from "./Pages/AdminLogin";
import EmployeePanel from "./Pages/Employee/Index";
import TaskCreate from "./Pages/Admin/Component/TaskCreate";
import TasksLists from "./Pages/Tasklists";


const App = () => {

  const PrivateRoute = ({ children, allowedRole }) => {
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");
    const location = useLocation();

    // 🔹 If not logged in → go to login
    if (!userId || !role) {
      return <Navigate to="/" state={{ from: location }} replace />;
    }

    // 🔹 If logged in but trying to access wrong role route
    if (allowedRole && role !== allowedRole) {
      // Redirect them to their correct dashboard
      if (role === "admin") return <Navigate to="/dashboard" replace />;
      else return <Navigate to="/taskslists" replace />;
    }

    // 🔹 Access granted
    return children;
  };



  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginForm />}></Route>

          <Route
            path="/dashboard"
            element={
              <PrivateRoute allowedRole="admin">
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/taskslists"
            element={
              <PrivateRoute allowedRole="user">
                <EmployeePanel />
              </PrivateRoute>
            }
          />

          <Route path="/Signup" element={
            <PrivateRoute>
              <Signup />
            </PrivateRoute>
          } />

          <Route path="/*" element={<Notfound />} />
          <Route path='/Admin' element={<AdminLogin />} />
          <Route path="/project/:id" element={<TaskCreate />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;