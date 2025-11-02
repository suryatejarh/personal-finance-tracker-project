import React, { useState, useEffect } from "react";
import Expenses from "./components/Expenses";
import Categories from "./components/Categories";
import ExpenseModal from "./components/ExpenseModal";
import CategoryModal from "./components/CategoryModal";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";

const API_BASE = "http://localhost:5000/api";

export default function App() {
  return(
      <Router>
      <div className="app-container">
       
        <Routes>
          <Route path="/" element={ <LoginPage/> } />
          <Route path="/home" element={ <HomePage/> } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </Router>)
}
