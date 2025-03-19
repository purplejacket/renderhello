const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Connect to SQLite database
const db = new sqlite3.Database('tasks.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Route to fetch and display the first task
app.get('/', (req, res) => {
    db.get("SELECT task_name FROM tasks LIMIT 1", (err, row) => {
        if (err) {
            res.status(500).send("Database error");
        } else {
            res.render('index', { task: row ? row.task_name : "No tasks found" });
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

db.run(`CREATE TABLE IF NOT EXISTS tasks (task_name TEXT)`, (err) => {
    if (err) {
        console.error('Error creating table:', err.message);
        return;
    }

    // Now that the table is guaranteed to exist, check if it's empty
    db.get("SELECT COUNT(*) as count FROM tasks", (err, row) => {
        if (err) {
            console.error('Error checking task count:', err.message);
            return;
        }

        if (row.count === 0) {
            db.run("INSERT INTO tasks (task_name) VALUES (?)", ["Example Task"], (err) => {
                if (err) {
                    console.error('Error inserting task:', err.message);
                }
            });
        }
    });
});
