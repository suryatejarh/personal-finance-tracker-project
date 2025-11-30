import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Replace with actual API endpoint later
    console.log("Registering:", form);
    alert("User registered successfully (mock)!");
  };

  return (
    <div className="form-container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit}>
        <label>Personal Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          placeholder="Enter your name"
        />

        <label>Username</label>
        <input
          type="text"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
          placeholder="Choose a username"
        />

        <label>Password</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          placeholder="Create a password"
        />

        <button type="submit">Create Account</button>
      </form>

      <p className="link-text">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
}
