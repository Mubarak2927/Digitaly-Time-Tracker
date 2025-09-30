import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      if (!/\s/.test(value)) setFormData({ ...formData, [name]: value });
    } else if (name === "password") {
      const noSpaceValue = value.replace(/\s/g, "");
      setFormData({ ...formData, [name]: noSpaceValue });
    }
  };

  const handleKeyDown = (e) => {
    if (
      (e.target.name === "email" || e.target.name === "password") &&
      e.key === " "
    ) {
      e.preventDefault();
    }
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 5)
      newErrors.password = "Password must be at least 5 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        setLoading(true)
        const data = await axios.post(
          "https://timetracker-1-wix6.onrender.com/signin/",
          {
            email: formData.email,
            password: formData.password,
          }
        );

        localStorage.setItem("userId", JSON.stringify(data.data.user_id));
        if (data.data.role == "admin") {
          navigate("/dashboard");
        } else {
          navigate("/taskslists");
        }
        setMessage(`Login successful with email: ${formData.email}`);
      } catch (error) {
        setMessage(`${error}`);
      } finally {
        setLoading(false)
      }
    }
  };

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 rounded-3xl shadow-2xl p-8 sm:p-12 w-full max-w-md">
        <h2 className="text-3xl font-bold text-white text-center mb-8">
          Employee Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Email Address"
              className="w-full p-4 rounded-xl bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 placeholder-opacity-70"
            />
            <div className="h-5 mt-1">
              {error.email && (
                <p className="text-red-500 text-xs">{error.email}</p>
              )}
            </div>
          </div>

          <div className="relative flex flex-col">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              maxLength={20}
              placeholder="Password"
              className="w-full p-4 pr-16 rounded-xl bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 placeholder-opacity-70"
            />
            <button
              type="button"
              className="absolute inset-y-0 -top-5  cursor-pointer right-4 flex items-center justify-center text-gray-300 hover:text-white font-semibold"
              onClick={togglePassword}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            <div className="h-5 mt-1">
              {error.password && (
                <p className="text-red-500 text-xs">{error.password}</p>
              )}
            </div>
          </div>

          {message && <div><p className="text-green-400 text-center">{message}</p></div>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full cursor-pointer py-3  rounded-xl  font-semibold hover:scale-105 transform transition ${loading ? "bg-blue-300 cursor-not-allowed text-black " : "bg-gradient-to-r from-blue-500 to-purple-600 text-white"}`}
          >
            {loading ? "Loading....." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
