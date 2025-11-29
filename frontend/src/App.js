import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import Dashboard from "./components/Dashboard";

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
          <Route path="/dashboard" element={ <Dashboard/> } />
        </Routes>
      </div>
    </Router>)
}
