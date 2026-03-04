import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Smile, Frown, Meh, SmileIcon, Angry, Save, History, Calendar } from "lucide-react";

const EMOJIS = [
  { score: 1, icon: Angry, label: "Awful", color: "text-red-500", bg: "bg-red-50" },
  { score: 2, icon: Frown, label: "Bad", color: "text-orange-500", bg: "bg-orange-50" },
  { score: 3, icon: Meh, label: "Okay", color: "text-yellow-500", bg: "bg-yellow-50" },
  { score: 4, icon: Smile, label: "Good", color: "text-emerald-500", bg: "bg-emerald-50" },
  { score: 5, icon: SmileIcon, label: "Great", color: "text-brand-500", bg: "bg-brand-50" },
];

interface MoodEntry {
  id: number;
  date: string;
  mood_score: number;
  notes: string;
}

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [history, setHistory] = useState<MoodEntry[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/mood");
      const data = await res.json();
      setHistory(data);
    } catch (err) {
      console.error("Failed to fetch mood history", err);
    }
  };

  const handleSave = async () => {
    if (selectedMood === null) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/mood", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood_score: selectedMood, notes }),
      });
      if (res.ok) {
        setSelectedMood(null);
        setNotes("");
        fetchHistory();
      }
    } catch (err) {
      console.error("Failed to save mood", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-24 pb-32 md:pb-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">How are you feeling?</h1>
        <p className="text-slate-500">Track your emotional journey day by day.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Log Mood */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Calendar size={20} className="text-brand-500" />
              Daily Log
            </h2>
            
            <div className="flex justify-between gap-2 mb-8">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji.score}
                  onClick={() => setSelectedMood(emoji.score)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all flex-1 ${
                    selectedMood === emoji.score
                      ? `${emoji.bg} ring-2 ring-offset-2 ring-brand-500`
                      : "hover:bg-slate-50"
                  }`}
                >
                  <emoji.icon
                    size={32}
                    className={selectedMood === emoji.score ? emoji.color : "text-slate-400"}
                  />
                  <span className={`text-xs font-medium ${selectedMood === emoji.score ? "text-slate-900" : "text-slate-400"}`}>
                    {emoji.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium text-slate-700">Add some notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What's on your mind today?"
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all h-32 resize-none"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={selectedMood === null || isSaving}
              className="w-full mt-6 py-4 bg-brand-500 text-white rounded-2xl font-semibold hover:bg-brand-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              <Save size={20} />
              {isSaving ? "Saving..." : "Save Daily Log"}
            </button>
          </div>
        </div>

        {/* History Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm h-full">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <History size={20} className="text-brand-500" />
              Recent History
            </h2>
            
            <div className="space-y-4">
              {history.length === 0 ? (
                <p className="text-sm text-slate-400 text-center py-8">No logs yet. Start tracking today!</p>
              ) : (
                history.map((entry) => {
                  const emoji = EMOJIS.find((e) => e.score === entry.mood_score);
                  return (
                    <div key={entry.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          {emoji && <emoji.icon size={18} className={emoji.color} />}
                          <span className="text-xs font-semibold text-slate-500">
                            {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {new Date(entry.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {entry.notes && <p className="text-xs text-slate-600 line-clamp-2 italic">"{entry.notes}"</p>}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
