import React, { useId } from "react";
import { useAuth } from "../providers/AuthProvider";
import { useState } from "react";

function RegisterForm() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const { register } = useAuth();
  async function handleRegister(e) {
    e.preventDefault();
    const res = await register(username, password);
    console.log(res);
  }

  return (
    <div className="box p-4 w-3/4">
      <div className="text-left mb-4 box p-2">
        <label htmlFor="username">Username:</label>
        <br />
        <input
          id={useId()}
          placeholder="Enter Username"
          className="w-full p-2 outline-0"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
      </div>
      <div className="text-left my-4 box p-2">
        <label htmlFor="password">Password:</label>
        <br />
        <input
          id={useId()}
          type="password"
          className="w-full p-2 outline-0"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </div>
      <button
        type="button"
        onClick={handleRegister}
        className="text-center box p-2 my-2 w-full border-blue-500 bg-blue-500 hover:cursor-pointer hover:underline "
      >
        Register
      </button>
      <p className="text-left text-sm mt-2 opacity-75">
        Already registered?{" "}
        <a className="text-blue-500 hover:underline" href="/login">
          Log In
        </a>
      </p>
    </div>
  );
}

export default RegisterForm;
