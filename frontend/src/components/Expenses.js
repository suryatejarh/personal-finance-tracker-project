import React from "react";

export default function Expenses({ expenses, categories, onEdit, onOpenModal, refresh }) {
  async function deleteExpense(id) {
    if (!window.confirm("Delete this expense?")) return;
    await fetch(`http://localhost:5000/api/expenses/${id}`, { method: "DELETE" });
    refresh();
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>Expenses</h2>
        <button onClick={onOpenModal}>+ Add Expense</button>
      </div>

      <div className="list">
        {expenses.length === 0 ? (
          <p className="empty">No expenses yet.</p>
        ) : (
          expenses.map((exp) => {
            const cat = categories.find((c) => c.id === exp.category_id);
            return (
              <div key={exp.id} className="list-item">
                <div>
                  <strong>{exp.description}</strong> <br />
                  <small>{exp.date}</small> |{" "}
                  <span style={{ color: cat?.color }}>{cat?.name}</span>
                </div>
                <div>
                  <span className="amount">₹{exp.amount}</span>
                  <button className="edit" onClick={() => onEdit(exp)}>✏️</button>
                  <button className="delete" onClick={() => deleteExpense(exp.id)}>🗑️</button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
