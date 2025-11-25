import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../store/store";
import type { RootState } from "../../store/store";
import PasswordInput from "../../components/common/PasswordInput";
import toast from "react-hot-toast";
import { login } from "../../features/auth/authSlice";

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
    "px-4 py-2 font-semibold rounded-lg transition-all duration-300 shadow-md text-white disabled:opacity-50 disabled:cursor-not-allowed";
  const gradient =
    "bg-[linear-gradient(90deg,#0f056d_0%,#13e2e2_100%)] hover:opacity-90 hover:scale-[1.02]";

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseClasses} ${gradient} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const Input = ({
  type = "text",
  placeholder = "",
  value,
  onChange,
  required,
}: {
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) => {
  const classes =
    "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors";
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className={classes}
    />
  );
};

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading } = useSelector((s: RootState) => s.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    const action = await dispatch(
      login({ username: email, password })
    );

    if (login.fulfilled.match(action)) {
      const message = action.payload?.message || "Login successful";
      toast.success(message);
      const role = (action.payload?.data as any)?.role || "";
      if (String(role).includes("ADMIN")) {
        navigate("/admin/dashboard");
      } else {
        navigate("/publisher/dashboard");
      }
    } else if (login.rejected.match(action)) {
      const msg = (action.payload as string) || action.error.message || "Login failed";
      toast.error(msg);
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-[Calibri]">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-xl rounded-2xl border border-gray-100 transform transition-transform duration-300 hover:shadow-2xl">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">Welcome Back</h1>
          <p className="text-md text-gray-500 font-medium">Login to the portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-medium shadow-sm">
              <p className="font-bold mb-1">Login Failed</p>
              {error}
            </div>
          )}

          <div className="space-y-3">
            <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
              Email Address
            </label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-3">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
              Password
            </label>
            <PasswordInput
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              required
              autoComplete="current-password"
            />
          </div>

          <Button type="submit" className="w-full text-lg py-3 mt-2" disabled={loading}>
            {loading ? "Authenticating..." : "Sign In"}
          </Button>
        </form>

        <div className="text-center space-y-3 pt-2">
          <p className="text-sm text-gray-500">
            Don't have an account? {" "}
            <Link
              to="/signup"
              className="text-indigo-600 hover:text-indigo-800 hover:underline font-semibold"
            >
              Sign up
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

