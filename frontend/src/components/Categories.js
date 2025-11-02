import React from "react";

export default function Categories({ categories, onEdit, onOpenModal, refresh }) {
  async function deleteCategory(id) {
    if (!window.confirm("Delete this category?")) return;
    const res = await fetch(`http://localhost:5000/api/categories/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (res.status !== 200) alert(data.error || "Failed to delete category");
    refresh();
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>Categories</h2>
        <button onClick={onOpenModal}>+ Add Category</button>
      </div>

      <div className="list">
        {categories.length === 0 ? (
          <p className="empty">No categories yet.</p>
        ) : (
          categories.map((cat) => (
            <div key={cat.id} className="list-item">
              <div className="color-dot" style={{ background: cat.color }}></div>
              <span>{cat.name}</span>
              <div>
                <button className="edit" onClick={() => onEdit(cat)}>✏️</button>
                <button className="delete" onClick={() => deleteCategory(cat.id)}>🗑️</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
