import React, { useEffect, useState } from "react";

export default function CategoryModal({ close, editingCategory, refresh }) {
  const [form, setForm] = useState({ name: "", color: "#007bff" });

  useEffect(() => {
    if (editingCategory) setForm(editingCategory);
    else setForm({ name: "", color: "#007bff" });
  }, [editingCategory]);

  async function saveCategory() {
    const url = editingCategory
      ? `http://localhost:5000/api/categories/${editingCategory.id}`
      : "http://localhost:5000/api/categories";
    const method = editingCategory ? "PUT" : "POST";
    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    refresh();
    close();
  }

  return (
    <div className="modal">
      <div className="modal-box">
        <h3>{editingCategory ? "Edit Category" : "Add Category"}</h3>
        <input
          type="text"
          placeholder="Category Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="color"
          value={form.color}
          onChange={(e) => setForm({ ...form, color: e.target.value })}
        />
        <div className="modal-actions">
          <button onClick={saveCategory}>Save</button>
          <button onClick={close} className="cancel">Cancel</button>
        </div>
      </div>
    </div>
  );
}
