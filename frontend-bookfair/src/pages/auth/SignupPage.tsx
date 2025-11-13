import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../store/store";
import { signup } from "../../features/auth/authSlice";
import type { RootState } from "../../store/store";
import type { Profession } from "../../lib/api";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Button = ({
  children,
  type = "button",
  disabled = false,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  type?: "submit" | "button";
  disabled?: boolean;
  className?: string;
  onClick?: (e: React.FormEvent) => void;
}) => {
  const baseClasses =
    "px-4 py-2 font-semibold rounded-lg transition-all duration-200 shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed";
  const gradientBackground =
    "bg-[linear-gradient(90deg,#0f056d_0%,#13e2e2_100%)] hover:opacity-90";
  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseClasses} ${gradientBackground} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const Input = ({
  type = "text",
  name,
  placeholder = "",
  value,
  onChange,
  required,
}: {
  type: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) => {
  const [show, setShow] = useState(false);
  const baseClasses =
    "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors";

  if (type !== "password") {
    return (
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={baseClasses}
      />
    );
  }

  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`${baseClasses} pr-10`}
        autoComplete="new-password"
      />
      <button
        type="button"
        aria-label={show ? "Hide password" : "Show password"}
        onClick={() => setShow((s) => !s)}
        className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
      >
        {show ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
      </button>
    </div>
  );
};

export default function SignupPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, lastMessage } = useSelector((s: RootState) => s.auth);

  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    phonenumber: "",
    address: "",
    profession: "VENDOR" as Profession,
  });

  const [localError, setLocalError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!form.username || !form.password || !form.phonenumber || !form.address) {
      return "All fields are required.";
    }
    // crude email check if looks like email
    if (form.username.includes("@")) {
      const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
      if (!emailRegex.test(form.username)) return "Please enter a valid email.";
    }
    if (form.password.length < 8) return "Password must be at least 8 characters.";
    if (form.password !== form.confirmPassword) return "Passwords do not match.";
    if (!/^\d{9,15}$/.test(form.phonenumber.replace(/[^\d]/g, "")))
      return "Enter a valid phone number (digits only).";
    return "";
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setLocalError(v);
      return;
    }
    setLocalError("");

    const action = await dispatch(
      signup({
        username: form.username,
        password: form.password,
        phonenumber: form.phonenumber,
        address: form.address,
        profession: form.profession,
      })
    );

    if (signup.fulfilled.match(action)) {
      const message = action.payload?.message || "User registered successfully";
      toast.success(message);
      // On success, navigate to login
      navigate("/login");
    } else if (signup.rejected.match(action)) {
      const msg = (action.payload as string) || action.error.message || "Signup failed";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-[Calibri]">
      <div className="max-w-lg w-full space-y-8 p-8 bg-white shadow-2xl rounded-xl border border-gray-100">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-extrabold text-gray-800">Create Account</h1>
          <p className="text-md text-gray-500 font-medium">Sign up to BookFair</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {(localError || error) && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium shadow-md">
              <p className="font-bold mb-1">Signup Error</p>
              {localError || error}
            </div>
          )}

          {lastMessage && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium shadow-sm">
              {lastMessage}
            </div>
          )}

          <div className="space-y-3">
            <label htmlFor="username" className="text-sm font-medium text-gray-700 block">
              Username (email)
            </label>
            <Input
              type="email"
              name="username"
              placeholder="Enter valid email address"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
                Password
              </label>
              <Input
                type="password"
                name="password"
                placeholder="********"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-3">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 block">
                Confirm Password
              </label>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="********"
                value={form.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <label htmlFor="phonenumber" className="text-sm font-medium text-gray-700 block">
              Phone Number
            </label>
            <Input
              type="text"
              name="phonenumber"
              placeholder="077xxxxxxx"
              value={form.phonenumber}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-3">
            <label htmlFor="address" className="text-sm font-medium text-gray-700 block">
              Address
            </label>
            <Input
              type="text"
              name="address"
              placeholder="Enter your address"
              value={form.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-3">
            <label htmlFor="profession" className="text-sm font-medium text-gray-700 block">
              Profession
            </label>
            <select
              name="profession"
              value={form.profession}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            >
              <option value="VENDOR">VENDOR</option>
              <option value="PUBLISHER">PUBLISHER</option>
            </select>
          </div>

          <Button type="submit" className="w-full text-lg py-3" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <div className="text-center space-y-3 pt-2">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 hover:text-indigo-800 hover:underline font-semibold"
            >
              Sign in
            </Link>
          </p>
          <Link
            to="/"
            className="text-sm text-gray-500 hover:text-indigo-600 hover:underline block"
          >
            ↩ Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
