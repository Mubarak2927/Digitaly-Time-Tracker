import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    employee_id: "",
    e_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    designation: "",
    role: "",
  });

  const navigate = useNavigate();
  const API = "https://timetracker-1-wix6.onrender.com";

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false)

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value.trimStart() });
  };

  // Validation
  const validate = () => {
    let newErrors = {};

    if (!formData.employee_id.trim()) newErrors.employee_id = "Employee ID is required";
    if (!formData.e_name.trim()) newErrors.e_name = "Employee Name is required";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm Password is required";
    else if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = "Passwords do not match";

    if (!formData.designation.trim()) newErrors.designation = "Designation is required";
    if (!formData.role.trim()) newErrors.role = "Role is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        setLoading(true);
        const res = await axios.post(`${API}/signup/`, {
          employee_id: formData.employee_id,
          e_name: formData.e_name,
          email: formData.email,
          password: formData.password,
          designation: formData.designation,
          role: formData.role,
        });

        if (res.data.message) {
          setMessage(`Welcome ${formData.e_name}! Sign Up Successful.`);
          navigate("/dashboard");
          setFormData({
            employee_id: "",
            e_name: "",
            email: "",
            password: "",
            confirmPassword: "",
            designation: "",
            role: "",
          });
          setErrors({});
        }
      } catch (error) {
        console.error(error.response.data.error);
        setMessage(error.response.data.error);
      } finally {
        setLoading(false)
      }
    }
  };

  const errorHeight = "h-5";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 backdrop-blur-lg rounded-3xl shadow-lg p-8 sm:p-12 w-full max-w-md border">
        <h2 className="text-3xl font-bold text-white text-center mb-8 tracking-wide">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Employee ID */}
          <div className="flex flex-col">
            <input
              type="text"
              name="employee_id"
              value={formData.employee_id}
              onChange={handleChange}
              placeholder="Employee ID"
              className="w-full p-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className={errorHeight}>
              {errors.employee_id && <p className="text-red-400 text-xs">{errors.employee_id}</p>}
            </div>
          </div>

          {/* Employee Name */}
          <div className="flex flex-col">
            <input
              type="text"
              name="e_name"
              value={formData.e_name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full p-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className={errorHeight}>
              {errors.e_name && <p className="text-red-400 text-xs">{errors.e_name}</p>}
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full p-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className={errorHeight}>
              {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
            </div>
          </div>

          {/* Password */}
          <div className="relative flex flex-col">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 pr-20 rounded-xl bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-6 text-sm text-cyan-400"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            <div className={errorHeight}>
              {errors.password && <p className="text-red-400 text-xs">{errors.password}</p>}
            </div>
          </div>

          {/* Confirm Password */}
          <div className="relative flex flex-col">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full p-3 pr-20 rounded-xl bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-6 text-sm text-cyan-400"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
            <div className={errorHeight}>
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Designation */}
          <div className="flex flex-col">
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="Designation"
              className="w-full p-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className={errorHeight}>
              {errors.designation && <p className="text-red-400 text-xs">{errors.designation}</p>}
            </div>
          </div>

          {/* Role */}
          <div className="flex flex-col">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Role</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <div className={errorHeight}>
              {errors.role && <p className="text-red-400 text-xs">{errors.role}</p>}
            </div>
          </div>
          {
            message && <div className="text-white my-2">{message}</div>
          }
          {/* Submit */}
          <button
            type="submit"
            className={`w-full py-3 ${loading ? "bg-blue-100 cursor-not-allowed" : "bg-gradient-to-r from-cyan-400 to-blue-500"} rounded-xl text-white font-semibold hover:scale-105 transition`}
            disabled={loading}
          >
            {loading ? "Loading....." : "Create Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
