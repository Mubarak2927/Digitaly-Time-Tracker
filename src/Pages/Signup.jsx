import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const API = "https://timetracker-1-wix6.onrender.com";

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value.replace(/\s/g, "") });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First Name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm Password is required";
    else if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const createEmploye = await axios.post(
          (`${API}/signup/`),
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            password: formData.password,
          }
        );
        console.log(createEmploye, "Created Successfully");
       if (createEmploye.data.message) {
  console.log("12412525325326126");

  navigate('/dashboard');
  setMessage(`Welcome ${formData.firstName}! Sign Up Successful.`);
  setFormData({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  setErrors({});
}

      } catch (error) {
        console.log(error);
      }


    }
  };

  const errorHeight = "h-5";

  return (
    <div className="min-h-screen flex items-center justify-center  bg-gray-900 px-4">
      <div className="bg-gray-800 backdrop-blur-lg rounded-3xl shadow-lg p-8 sm:p-12 w-full max-w-md border ">
        <h2 className="text-3xl font-bold text-white text-center mb-8 tracking-wide">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className="w-full p-3 rounded-xl  bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 placeholder-opacity-70 transition"
            />
            <div className={errorHeight}>
              {errors.firstName && (
                <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className="w-full p-3 rounded-xl  bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 placeholder-opacity-70 transition"
            />
            <div className={errorHeight}>
              {errors.lastName && (
                <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full p-3 rounded-xl  bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 placeholder-opacity-70 transition"
            />
            <div className={errorHeight}>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="relative flex flex-col">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 pr-20 rounded-xl  bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 placeholder-opacity-70 transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute cursor-pointer right-3 top-6 transform -translate-y-1/2 text-sm text-cyan-400 hover:text-white"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
            <div className={errorHeight}>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="relative flex flex-col">
            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full p-3 pr-20 rounded-xl  bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400 placeholder-opacity-70 transition"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 cursor-pointer top-6 transform -translate-y-1/2 text-sm text-cyan-400 hover:text-white"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
            <div className={errorHeight}>
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full cursor-pointer py-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl text-white font-semibold hover:scale-105 transform transition"
          >
            Create Profile
          </button>
        </form>

        {/* {message && (
          <p className="text-green-400 mt-4 text-center">{message}</p>
        )}

        <p className="text-center text-white mt-6 text-sm">
          Already have an account?{" "}
          <a
            href="/"
            className="text-cyan-400 cursor-pointer font-semibold hover:underline"
          >
            Login
          </a>
        </p> */}
      </div>
    </div>
  );
};

export default Signup;