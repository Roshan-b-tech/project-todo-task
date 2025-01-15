import React, { useState } from "react";
import {
  FaStar,
  FaRegStar,
  FaSearch,
  FaTh,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import "./App.css";

function ProgressCircle({ completed, total }) {
  const radius = 70; // Increased radius for a larger progress circle
  const circumference = 2 * Math.PI * radius;
  const progress = total === 0 ? 0 : (completed / total) * 100;
  const dashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="progress-container">
      <div className="progress-circle">
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle
            className="progress-background"
            cx="80"
            cy="80"
            r={radius}
            strokeWidth="12"
          />
          <circle
            className="progress-bar"
            cx="80"
            cy="80"
            r={radius}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
          />
        </svg>
        <div className="progress-info">
          <span className="progress-number">{total}</span>
          <span className="progress-label">Today Tasks</span>
        </div>
      </div>
      <div className="progress-legend">
        <span>
          <span className="legend-dot pending"></span> Pending
        </span>
        <span>
          <span className="legend-dot done"></span> Done
        </span>
      </div>
    </div>
  );
}

function App() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      text: "Buy groceries",
      completed: false,
      important: false,
      planned: false,
      assignedToMe: false,
      today: true,
      dueDate: null,
      repeat: false,
    },
    {
      id: 2,
      text: "Finish project report",
      completed: false,
      important: true,
      planned: true,
      assignedToMe: true,
      today: true,
      dueDate: null,
      repeat: false,
    },
    {
      id: 3,
      text: "Call the bank",
      completed: false,
      important: false,
      planned: false,
      assignedToMe: true,
      today: false,
      dueDate: null,
      repeat: false,
    },
  ]);

  const [newTask, setNewTask] = useState("");
  const [activeSection, setActiveSection] = useState("All Tasks");
  const [searchTerm, setSearchTerm] = useState("");
  const [isGridView, setIsGridView] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        text: newTask,
        completed: false,
        important: false,
        planned: false,
        assignedToMe: false,
        today: false,
        dueDate: null,
        repeat: false,
      },
    ]);
    setNewTask("");
  };

  const toggleComplete = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const toggleImportant = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, important: !task.important } : task
      )
    );
  };

  const updateDueDate = (taskId, date) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, dueDate: date } : task
      )
    );
  };

  const toggleRepeat = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, repeat: !task.repeat } : task
      )
    );
  };

  const filterTasks = () => {
    const filtered = tasks.filter((task) =>
      task.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    switch (activeSection) {
      case "Important":
        return filtered.filter((task) => task.important);
      case "Planned":
        return filtered.filter((task) => task.planned);
      case "Assigned to me":
        return filtered.filter((task) => task.assignedToMe);
      case "Today":
        return filtered.filter((task) => task.today);
      default:
        return filtered;
    }
  };

  const filteredTasks = filterTasks();

  return (
    <div className={`app ${darkMode ? "dark-mode" : "light-mode"}`}>
      {/* Sidebar Section */}
      <aside className="sidebar">
        <div className="profile">
          <img src="me.jpg" alt="Profile" className="avatar" />
          <h3>My Tasks</h3>
        </div>
        <nav>
          <ul>
            {[
              "All Tasks",
              "Today",
              "Important",
              "Planned",
              "Assigned to me",
            ].map((section) => (
              <li
                key={section}
                className={activeSection === section ? "active" : ""}
                onClick={() => setActiveSection(section)}
              >
                {section}
              </li>
            ))}
          </ul>
        </nav>
        <ProgressCircle
          completed={tasks.filter((task) => task.completed).length}
          total={tasks.length}
        />
        <div className="task-count">
          <span>Today Tasks</span>
          <span className="count">
            {tasks.filter((task) => task.today && !task.completed).length}
          </span>
        </div>
      </aside>

      {/* Main Content Section */}
      <main className="main-content">
        <div className="top-bar">
          <button className="icon-button" onClick={() => setSearchTerm("")}>
            <FaSearch />
          </button>
          <button
            className="icon-button"
            onClick={() => setIsGridView(!isGridView)}
          >
            <FaTh />
          </button>
          <button
            className="icon-button"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        <form onSubmit={addTask} className="add-task-form">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a task"
            className="task-input"
          />
          <button type="submit" className="add-task-btn">
            ADD TASK
          </button>
        </form>

        <div
          className={`tasks-section ${isGridView ? "grid-view" : "list-view"}`}
        >
          {filteredTasks.map((task) => (
            <div key={task.id} className="task-item">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task.id)}
                />
                <span className="checkmark"></span>
              </label>
              <span className="task-text">{task.text}</span>
              <button
                className="star-btn"
                onClick={() => toggleImportant(task.id)}
              >
                {task.important ? <FaStar /> : <FaRegStar />}
              </button>
              <input
                type="date"
                value={task.dueDate || ""}
                onChange={(e) => updateDueDate(task.id, e.target.value)}
                className="due-date-input"
              />
              <button
                className="repeat-btn"
                onClick={() => toggleRepeat(task.id)}
              >
                {task.repeat ? "Repeat On" : "Repeat Off"}
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;