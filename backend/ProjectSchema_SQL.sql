-- Create the database
CREATE DATABASE IF NOT EXISTS finance_tracker;
USE finance_tracker;

-- Drop tables if they exist (for fresh setup)
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
	id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    userName VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL);

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(7) NOT NULL DEFAULT '#3B82F6',
    userid INT REFERENCES users(id) ON DELETE CASCADE, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category_id INT NOT NULL,
    userid INT REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_date (date),
    INDEX idx_category_id (category_id),
    INDEX idx_amount (amount)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Create a view for expense summary by category
CREATE OR REPLACE VIEW expense_summary_by_category AS
SELECT 
    c.id as category_id,
    c.name as category_name,
    c.color as category_color,
    COUNT(e.id) as expense_count,
    COALESCE(SUM(e.amount), 0) as total_amount,
    COALESCE(AVG(e.amount), 0) as average_amount
FROM categories c
LEFT JOIN expenses e ON c.id = e.category_id
GROUP BY c.id, c.name, c.color
ORDER BY total_amount DESC;

-- Create a view for monthly expense summary
-- CREATE OR REPLACE VIEW monthly_expense_summary AS
-- SELECT 
--     DATE_FORMAT(date, '%Y-%m') as month,
--     COUNT(*) as expense_count,
--     SUM(amount) as total_amount
-- FROM expenses
-- GROUP BY DATE_FORMAT(date, '%Y-%m')
-- ORDER BY month DESC;