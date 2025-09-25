import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./Pages/LoginForm";
import Tasklists from "./Pages/Tasklists";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard";
import Notfound from "./Pages/Notfound";
import AdminLogin from "./Pages/AdminLogin";


const App = () => {
  const PrivateRoute = ({ children }) => {
    const userId = localStorage.getItem("userId");

    return userId ? children : <Navigate to="/" />;
  };

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginForm />}></Route>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/TasksLists"
            element={
              <PrivateRoute>
                <Tasklists />
              </PrivateRoute>
            }
          />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/*" element={<Notfound/>} />
          <Route path='/Admin' element={<AdminLogin/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;