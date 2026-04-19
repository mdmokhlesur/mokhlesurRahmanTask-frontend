import { motion } from "framer-motion";
import {
  CheckCircle2,
  ChevronRight,
  Code2,
  Layout,
  Rocket,
  Sparkles,
} from "lucide-react";

const FloatingCard = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay }}
    className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-xl hover:border-indigo-500/50 transition-colors group"
  >
    {children}
  </motion.div>
);

const Nav = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-slate-950/50 border-b border-slate-900">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
        <Rocket size={18} className="text-white" />
      </div>
      <span className="text-xl font-bold font-display tracking-tight">
        Antigravity
      </span>
    </div>
    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
      <a href="#" className="hover:text-white transition-colors">
        Features
      </a>
      <a href="#" className="hover:text-white transition-colors">
        Showcase
      </a>
      <a href="#" className="hover:text-white transition-colors">
        Docs
      </a>
    </div>
  </nav>
);

function App() {
  // const [mounted, setMounted] = useState(false);

  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  // if (!mounted) return null;

  return (
    <div className="min-h-screen selection:bg-indigo-500/30">
      <Nav />

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full -z-10 opacity-30 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/30 blur-[120px] rounded-full" />
          <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-indigo-400"
            >
              <Sparkles size={14} />
              <span>React + Tailwind CSS v4 is here</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-display font-black tracking-tight leading-[1.1]"
            >
              Build{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                Faster
              </span>{" "}
              <br />
              Than Ever Before
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl mx-auto text-lg md:text-xl text-slate-400 leading-relaxed font-sans"
            >
              Experience the power of React 19 and Tailwind CSS v4. A modern
              boilerplate designed for speed, performance, and aesthetic
              excellence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <button className="group relative bg-white text-slate-950 px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10 flex items-center gap-2">
                Deploy Now
                <ChevronRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <FloatingCard delay={0.5}>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4 text-indigo-400">
                <Code2 size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2 font-display">
                TypeScript First
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Fully typed development experience with React 19 and Vite for
                lightning-fast HMR.
              </p>
            </FloatingCard>

            <FloatingCard delay={0.6}>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 text-purple-400">
                <Layout size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2 font-display">
                Tailwind CSS v4
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Utilizing the latest CSS-first features of Tailwind v4 for
                cleaner and more powerful styling.
              </p>
            </FloatingCard>

            <FloatingCard delay={0.7}>
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center mb-4 text-pink-400">
                <Rocket size={24} />
              </div>
              <h3 className="text-xl font-bold mb-2 font-display">
                Optimized Build
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Ready for production with advanced tree-shaking and asset
                optimization out of the box.
              </p>
            </FloatingCard>
          </motion.div>

          {/* Features Checklist */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-24 pt-12 border-t border-slate-900"
          >
            <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
              {[
                "Next-gen Vite Bundle",
                "React 19 Core",
                "Framer Motion Animations",
                "Lucide Icon Library",
                "Modern Typography",
                "Zero Configuration",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-slate-500">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span className="text-sm font-medium italic">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-12 px-6 border-t border-slate-900 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center">
              <Rocket size={12} className="text-slate-400" />
            </div>
            <span className="font-bold font-display text-slate-400">
              Antigravity Boilerplate
            </span>
          </div>

          <div className="text-sm text-slate-500">
            © 2026 Antigravity. Built with precision and passion.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
