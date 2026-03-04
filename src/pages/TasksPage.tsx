import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Circle, Trash2, Plus, Calendar, Flag, Edit2, X, Save } from "lucide-react";

interface Task {
  id: number;
  title: string;
  due_date: string;
  priority: string;
  completed: number;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form state
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, due_date: dueDate, priority }),
      });
      if (res.ok) {
        setTitle("");
        setDueDate("");
        setPriority("Medium");
        setIsAdding(false);
        fetchTasks();
      }
    } catch (err) {
      console.error("Failed to add task", err);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...task, completed: !task.completed }),
      });
      if (res.ok) {
        fetchTasks();
      }
    } catch (err) {
      console.error("Failed to toggle task", err);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchTasks();
      }
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const startEditing = (task: Task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setDueDate(task.due_date || "");
    setPriority(task.priority);
  };

  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId || !title.trim()) return;

    try {
      const task = tasks.find(t => t.id === editingId);
      if (!task) return;

      const res = await fetch(`/api/tasks/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...task, title, due_date: dueDate, priority }),
      });
      if (res.ok) {
        setEditingId(null);
        setTitle("");
        setDueDate("");
        setPriority("Medium");
        fetchTasks();
      }
    } catch (err) {
      console.error("Failed to update task", err);
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case "High": return "text-red-500 bg-red-50";
      case "Medium": return "text-orange-500 bg-orange-50";
      case "Low": return "text-blue-500 bg-blue-50";
      default: return "text-slate-500 bg-slate-50";
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-24 pb-32 md:pb-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Task Management</h1>
          <p className="text-slate-500">Organize your day for a clearer mind.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-brand-500 text-white p-3 rounded-2xl hover:bg-brand-600 transition-all shadow-lg shadow-brand-500/20 flex items-center gap-2"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Add Task</span>
        </button>
      </div>

      <AnimatePresence>
        {(isAdding || editingId) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl mb-8"
          >
            <form onSubmit={editingId ? handleUpdateTask : handleAddTask} className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId ? "Edit Task" : "New Task"}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setEditingId(null);
                    setTitle("");
                    setDueDate("");
                    setPriority("Medium");
                  }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={20} />
                </button>
              </div>
              
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                autoFocus
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Calendar size={14} /> Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Flag size={14} /> Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all text-sm"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-brand-500 text-white rounded-2xl font-bold hover:bg-brand-600 transition-all flex items-center justify-center gap-2"
              >
                {editingId ? <Save size={20} /> : <Plus size={20} />}
                {editingId ? "Update Task" : "Create Task"}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center py-20 bg-white/50 rounded-3xl border border-dashed border-slate-300">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">All caught up!</h3>
            <p className="text-slate-500">You don't have any tasks right now.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <motion.div
              layout
              key={task.id}
              className={`group bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center gap-4 ${
                task.completed ? "opacity-60" : ""
              }`}
            >
              <button
                onClick={() => handleToggleComplete(task)}
                className={`flex-shrink-0 transition-colors ${
                  task.completed ? "text-brand-500" : "text-slate-300 hover:text-brand-400"
                }`}
              >
                {task.completed ? <CheckCircle2 size={28} /> : <Circle size={28} />}
              </button>

              <div className="flex-grow min-w-0">
                <h3 className={`font-bold text-slate-900 truncate ${task.completed ? "line-through" : ""}`}>
                  {task.title}
                </h3>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  {task.due_date && (
                    <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(task.due_date).toLocaleDateString()}
                    </span>
                  )}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => startEditing(task)}
                  className="p-2 text-slate-400 hover:text-brand-500 hover:bg-brand-50 rounded-xl transition-all"
                  title="Edit task"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  title="Delete task"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
