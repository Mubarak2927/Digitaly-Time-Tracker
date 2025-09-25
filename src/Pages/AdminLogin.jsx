import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate =useNavigate()
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value.replace(/\s/g, "") });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setMessage(`Welcome Admin: ${formData.email}`);
      setFormData({ email: "", password: "" });
      setErrors({});
    }
  };
  const handleClick=()=>{
    navigate('/dashboard')

  }

  const errorHeight = "h-5"; 
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 backdrop-blur-lg rounded-3xl shadow-xl p-8 sm:p-12 w-full max-w-sm border ">
        <h2 className="text-3xl font-bold text-white text-center mb-8">Admin Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="flex flex-col">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Admin Email"
              className="w-full p-3 rounded-xl bg-white/20 text-white border  border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 placeholder-opacity-70 transition"
            />
            <div className={errorHeight}>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>
          <div className="relative flex flex-col">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 pr-20 rounded-xl bg-white/20 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 placeholder-opacity-70 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 cursor-pointer top-6 transform -translate-y-1/2 text-sm text-yellow-400 hover:text-white"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            <div className={errorHeight}>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>
          </div>

          <button
            type="submit"
            onClick={handleClick}
            className="w-full cursor-pointer py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-semibold hover:scale-105 transform transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
