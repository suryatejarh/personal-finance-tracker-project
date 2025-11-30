import React, { useState, useEffect } from "react";
import Expenses from "./Expenses";
import Categories from "./Categories";
import ExpenseModal from "./ExpenseModal";
import CategoryModal from "./CategoryModal";


const API_BASE = "http://localhost:5000/api";

export default function HomePage() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
    fetchTotal();
  }, []);

  async function fetchExpenses() {
    const res = await fetch(`${API_BASE}/expenses`);
    const data = await res.json();
    setExpenses(data);
  }

  async function fetchCategories() {
    const res = await fetch(`${API_BASE}/categories`);
    const data = await res.json();
    setCategories(data);
  }

  async function fetchTotal() {
    const res = await fetch(`${API_BASE}/statistics/total`);
    const data = await res.json();
    setTotal(data.total);
  }

  const refreshAll = () => {
    fetchExpenses();
    fetchCategories();
    fetchTotal();
  };

  return (
    <div className="app-container">
      <header>
        <h1>Personal Finance Tracker</h1>
        <p className="subtitle">Track your expenses and manage your categories</p>
      </header>

      <div className="summary-box">
        <h2>Total Spent</h2>
        <p className="total-amount">₹{total.toFixed(2)}</p>
      </div>

      <div className="content">
        <Expenses
          expenses={expenses}
          categories={categories}
          onEdit={(exp) => {
            setEditingExpense(exp)
            setShowExpenseModal(true)
          }}
          onOpenModal={() => setShowExpenseModal(true)}
          refresh={refreshAll}
        />
        <Categories
          categories={categories}
          onEdit={(cat) => {
            setEditingCategory(cat)
            setShowCategoryModal(true)
          }}
          onOpenModal={() => setShowCategoryModal(true)}
          refresh={refreshAll}
        />
      </div>

      {showExpenseModal && (
        <ExpenseModal
          close={() => {
            setShowExpenseModal(false);
            setEditingExpense(null);
          }}
          editingExpense={editingExpense}
          categories={categories}
          refresh={refreshAll}
        />
      )}

      {showCategoryModal && (
        <CategoryModal
          close={() => {
            setShowCategoryModal(false);
            setEditingCategory(null);
          }}
          editingCategory={editingCategory}
          refresh={refreshAll}
        />
      )}
    </div>
  );
}