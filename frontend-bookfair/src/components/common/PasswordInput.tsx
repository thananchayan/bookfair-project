import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

type Props = {
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  required?: boolean;
  className?: string;
  inputClassName?: string;
  autoComplete?: string;
};

export default function PasswordInput({
  name,
  value,
  onChange,
  placeholder = "********",
  required,
  className = "",
  inputClassName = "",
  autoComplete,
}: Props) {
  const [show, setShow] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <input
        type={show ? "text" : "password"}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        className={`w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${inputClassName}`}
      />
      <button
        type="button"
        aria-label={show ? "Hide password" : "Show password"}
        onClick={() => setShow((s) => !s)}
        className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        {show ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
      </button>
    </div>
  );
}

