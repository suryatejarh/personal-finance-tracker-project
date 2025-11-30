import React, { useEffect, useState } from "react";

export default function ExpenseModal({ close, editingExpense, categories, refresh }) {
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category_id: "",
    date: "",
  });

  useEffect(() => {
    if (editingExpense) setForm(editingExpense);
    else setForm({ description: "", amount: "", category_id: "", date: "" });
  }, [editingExpense]);

  async function saveExpense() {
    const url = editingExpense
      ? `http://localhost:5000/api/expenses/${editingExpense.id}`
      : "http://localhost:5000/api/expenses";
    const method = editingExpense ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json","userid":1 },
      body: JSON.stringify(form),
    });
    refresh();
    close();
  }

  return (
    <div className="modal">
      <div className="modal-box">
        <h3>{editingExpense ? "Edit Expense" : "Add Expense"}</h3>
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
        />
        <select
          value={form.category_id}
          onChange={(e) => setForm({ ...form, category_id: e.target.value })}
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <div className="modal-actions">
          <button onClick={saveExpense}>Save</button>
          <button onClick={close} className="cancel">Cancel</button>
        </div>
      </div>
    </div>
  );
}
