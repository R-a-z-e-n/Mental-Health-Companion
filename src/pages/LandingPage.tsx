import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Heart, Shield, Sparkles, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-pastel-blue overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-brand-200/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 -right-20 w-80 h-80 bg-pastel-purple/30 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 pt-20 pb-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 text-brand-600 text-sm font-medium mb-8"
        >
          <Sparkles size={16} />
          <span>Your safe space for mental well-being</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight mb-6"
        >
          Your AI <span className="text-brand-500">Mental Health</span> Ally
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed"
        >
          A compassionate companion available 24/7 to listen, support, and guide you through your mental health journey with privacy and care.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            to="/chat"
            className="px-8 py-4 bg-brand-500 text-white rounded-2xl font-semibold text-lg shadow-lg shadow-brand-500/20 hover:bg-brand-600 transition-all flex items-center justify-center gap-2 group"
          >
            Start Chat
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/resources"
            className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-semibold text-lg hover:bg-slate-50 transition-all"
          >
            Explore Resources
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
        >
          {[
            {
              icon: Heart,
              title: "Compassionate AI",
              desc: "Trained to provide empathetic and non-judgmental support.",
              color: "bg-pastel-pink text-red-500",
            },
            {
              icon: Shield,
              title: "Private & Secure",
              desc: "Your conversations are confidential and your data is safe.",
              color: "bg-pastel-blue text-blue-500",
            },
            {
              icon: BarChart2,
              title: "Mood Tracking",
              desc: "Visualize your emotional journey and identify patterns.",
              color: "bg-pastel-green text-emerald-500",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-8 bg-white/50 backdrop-blur-sm rounded-3xl border border-white/20 card-shadow text-left"
            >
              <div className={`w-12 h-12 ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

import { BarChart2 } from "lucide-react";
