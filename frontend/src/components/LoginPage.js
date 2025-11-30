import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    // Replace with your backend API call later
    console.log("Logging in:", { userID:userId, password:password });
    const response = await fetch('http://localhost:5000/api/login',{method: 'POST',
    headers: { 'content-type': 'application/json'
    },body: JSON.stringify({userID:userId, password:password})});
    const data = await response.json();
   
    if(data.success){
      alert("Login successful!");
      navigate("/home");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>User ID</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
          placeholder="Enter your username"
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Enter your password"
        />

        <button type="submit">Login</button>
      </form>

      <p className="link-text">
        New here? <Link to="/register">Create a new account</Link>
      </p>
    </div>
  );
}
