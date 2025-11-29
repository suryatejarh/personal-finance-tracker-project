import React from "react";

export default function SummaryCards({ summary }) {
  if (!summary) return null;

  return (
    <div style={{
      display: "flex",
      gap: "20px",
      marginBottom: "20px",
      flexWrap: "wrap"
    }}>
      <div style={cardStyle}>
        <h3>Total Spend</h3>
        <p>₹{summary.total_spend.toFixed(2)}</p>
      </div>

      <div style={cardStyle}>
        <h3>Average Spend</h3>
        <p>₹{summary.avg_spend.toFixed(2)}</p>
      </div>

      <div style={cardStyle}>
        <h3>Highest Category</h3>
        <p>{summary.highest_category || "N/A"}</p>
        {summary.highest_category && (
          <p>₹{summary.highest_category_total.toFixed(2)}</p>
        )}
      </div>
    </div>
  );
}

const cardStyle = {
  padding: "20px",
  border: "1px solid #ccc",
  borderRadius: "10px",
  width: "200px",
  textAlign: "center",
  background: "#fafafa",
  boxShadow: "0 3px 10px rgba(0,0,0,0.1)"
};
