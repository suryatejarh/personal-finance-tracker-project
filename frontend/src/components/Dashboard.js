import React, { useEffect, useState } from "react";
import PieChart from "./PieChart";
import LineChart from "./LineChart";
import SummaryCards from "./SummaryCards";

export default function Dashboard() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [summary, setSummary] = useState(null);

  // Fetch summary data whenever date range changes
  useEffect(() => {
    if (!startDate || !endDate) return;

    fetch(
      `http://localhost:5000/api/expenses/summary-range?start=${startDate}&end=${endDate}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSummary(data);
        }
      });
  }, [startDate, endDate]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Expense Dashboard</h2>

      {/* DATE RANGE INPUT */}
      <div style={{ marginBottom: "20px" }}>
        <label>From: </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <label style={{ marginLeft: "20px" }}>To: </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {/* SUMMARY CARDS */}
      <SummaryCards summary={summary} />

      {/* CHARTS ROW */}
      <div
        style={{
          display: "flex",
          gap: "40px",
          justifyContent: "space-between",
          flexWrap: "wrap",
          marginTop: "20px",
        }}
      >
        {/* PIE CHART */}
        <div style={{ width: "45%", minWidth: "350px" }}>
          <h3>Category-wise Expenses</h3>
          <PieChart startDate={startDate} endDate={endDate} />
        </div>

        {/* LINE CHART */}
        <div style={{ width: "50%", minWidth: "450px" }}>
          <h3>Monthly Category Trends</h3>
          <LineChart startDate={startDate} endDate={endDate} />
        </div>
      </div>
    </div>
  );
}
