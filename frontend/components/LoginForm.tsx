import { useId } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import { useState } from "react";

function RegisterForm() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  const { login } = useAuth();
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const res = await login(username, password);
    navigate('/');
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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleLogin(e);
            }
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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleLogin(e);
            }
          }}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </div>
      <button
        type="button"
        onClick={handleLogin}
        className="text-center box p-2 my-2 w-full border-blue-500 bg-blue-500 hover:cursor-pointer hover:underline "
      >
        Login
      </button>
      <p className="text-left text-sm mt-2 opacity-75">
        Never used MoJo?{" "}
        <a className="text-blue-500 hover:underline" href="/register">
          Register
        </a>
      </p>
    </div>
  );
}

export default RegisterForm;
