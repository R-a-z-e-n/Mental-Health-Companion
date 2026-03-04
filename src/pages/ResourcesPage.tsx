import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { BookOpen, Phone, Wind, ExternalLink, Search, Filter } from "lucide-react";

interface Resource {
  id: number;
  title: string;
  category: string;
  content: string;
  link: string;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/resources")
      .then((res) => res.json())
      .then((data) => setResources(data))
      .catch((err) => console.error(err));
  }, []);

  const categories = ["All", ...new Set(resources.map((r) => r.category))];

  const filteredResources = resources.filter((r) => {
    const matchesFilter = filter === "All" || r.category === filter;
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase()) || 
                         r.content.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getIcon = (category: string) => {
    switch (category) {
      case "Exercise": return Wind;
      case "Helpline": return Phone;
      default: return BookOpen;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pt-24 pb-32 md:pb-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Wellness Resources</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Explore our curated collection of articles, mindfulness exercises, and support helplines to help you maintain your mental well-being.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-10">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search resources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all shadow-sm"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-3 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all ${
                filter === cat
                  ? "bg-brand-500 text-white shadow-lg shadow-brand-500/20"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredResources.map((resource, i) => {
          const Icon = getIcon(resource.category);
          return (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col"
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl ${
                  resource.category === 'Exercise' ? 'bg-emerald-50 text-emerald-500' :
                  resource.category === 'Helpline' ? 'bg-red-50 text-red-500' :
                  'bg-blue-50 text-blue-500'
                }`}>
                  <Icon size={24} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                  {resource.category}
                </span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors">
                {resource.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-grow">
                {resource.content}
              </p>
              <a
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-brand-600 font-bold text-sm hover:underline"
              >
                {resource.category === 'Helpline' ? 'Call Now' : 'Learn More'}
                <ExternalLink size={14} />
              </a>
            </motion.div>
          );
        })}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
            <Search size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No resources found</h3>
          <p className="text-slate-500">Try adjusting your search or filter to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
}
