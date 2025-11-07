"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calendar,
  Check,
  Clock,
  Flame,
  Pin,
  Plus,
  Sparkles,
  Trash2,
  Zap,
} from "lucide-react";
import clsx from "clsx";

type Mood = "focus" | "energy" | "reset";

type Task = {
  id: string;
  title: string;
  note?: string;
  completed: boolean;
  createdAt: number;
  mood: Mood;
  accentIndex: number;
  pinned?: boolean;
};

type Filter = "all" | "active" | "done";

const STORAGE_KEY = "neon-pulse-tasks";

const gradientPalette = [
  "from-electric-pink via-electric-violet to-electric-blue",
  "from-emerald-400 via-electric-cyan to-electric-blue",
  "from-orange-500 via-pink-500 to-purple-500",
  "from-sky-400 via-blue-500 to-purple-500",
  "from-fuchsia-500 via-rose-400 to-amber-300",
  "from-lime-300 via-emerald-400 to-teal-500",
  "from-electric-pink via-sky-400 to-emerald-400",
];

const vibeOptions: { id: Mood; label: string; description: string }[] = [
  { id: "focus", label: "Laser", description: "Deep work, zero distractions" },
  { id: "energy", label: "Pulse", description: "Move fast and ship" },
  { id: "reset", label: "Reset", description: "Recovery, errands, flow" },
];

const quickPrompts = [
  "Review roadmap for launch",
  "Block distractions for 45 minutes",
  "Run hydration break + stretch",
  "Journal 3 wins from today",
  "Send update to core team",
  "Plan high-impact experiment",
];

const showcaseTasks: Task[] = [
  {
    id: "demo-1",
    title: "Atomic focus sprint",
    note: "Ship onboarding improvements before noon.",
    completed: false,
    createdAt: Date.now(),
    mood: "focus",
    accentIndex: 0,
    pinned: true,
  },
  {
    id: "demo-2",
    title: "Pulse check with Maya",
    note: "Sync on growth loops and marketing creative.",
    completed: true,
    createdAt: Date.now() - 3600 * 1000,
    mood: "energy",
    accentIndex: 3,
  },
  {
    id: "demo-3",
    title: "Reset sequence",
    note: "Hydrate, stretch, reset workspace lighting.",
    completed: false,
    createdAt: Date.now() - 7200 * 1000,
    mood: "reset",
    accentIndex: 5,
  },
];

const getAccentClass = (index: number) =>
  `bg-gradient-to-br ${gradientPalette[index % gradientPalette.length]}`;

const createId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 11);

const sortTasks = (list: Task[]) =>
  [...list].sort((a, b) => {
    if (a.pinned === b.pinned) {
      if (a.completed === b.completed) {
        return b.createdAt - a.createdAt;
      }
      return Number(a.completed) - Number(b.completed);
    }
    return Number(b.pinned) - Number(a.pinned);
  });

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(() => sortTasks(showcaseTasks));
  const [newTask, setNewTask] = useState("");
  const [note, setNote] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedMood, setSelectedMood] = useState<Mood>("focus");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Task[];
        if (Array.isArray(parsed) && parsed.length) {
          setTasks(sortTasks(parsed));
        }
      } catch (error) {
        console.warn("Failed to parse tasks", error);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks, isLoaded]);

  const filteredTasks = useMemo(() => {
    if (filter === "active") {
      return tasks.filter((task) => !task.completed);
    }
    if (filter === "done") {
      return tasks.filter((task) => task.completed);
    }
    return tasks;
  }, [tasks, filter]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.completed).length;
    const active = total - completed;
    const focus = tasks.filter((task) => task.mood === "focus").length;
    const energy = tasks.filter((task) => task.mood === "energy").length;
    const reset = tasks.filter((task) => task.mood === "reset").length;

    return { total, completed, active, focus, energy, reset };
  }, [tasks]);

  const addTask = (title: string, vibe: Mood = selectedMood) => {
    if (!title.trim()) return;
    const accentIndex = Math.floor(Math.random() * gradientPalette.length);
    const task: Task = {
      id: createId(),
      title: title.trim(),
      note: note.trim(),
      completed: false,
      createdAt: Date.now(),
      mood: vibe,
      accentIndex,
      pinned: false,
    };

    setTasks((prev) => sortTasks([task, ...prev]));
    setNewTask("");
    setNote("");
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      sortTasks(
        prev.map((task) =>
          task.id === id ? { ...task, completed: !task.completed } : task,
        ),
      ),
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const togglePin = (id: string) => {
    setTasks((prev) =>
      sortTasks(
        prev.map((task) =>
          task.id === id ? { ...task, pinned: !task.pinned } : task,
        ),
      ),
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    addTask(newTask);
  };

  const progress =
    stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100);

  return (
    <main className="relative flex min-h-screen w-full justify-center px-4 pb-28 pt-16 sm:px-6">
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute left-[-30%] top-[-20%] size-[420px] rounded-full bg-gradient-to-br from-electric-blue/30 via-electric-pink/20 to-transparent blur-3xl"
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 12, ease: "easeInOut", repeat: Infinity }}
        />
        <motion.div
          className="absolute right-[-40%] top-[25%] size-[520px] rounded-full bg-gradient-to-br from-electric-pink/30 via-purple-500/20 to-transparent blur-[140px]"
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute left-1/2 top-[60%] h-56 w-[90%] -translate-x-1/2 rounded-full border border-white/10 bg-gradient-to-r from-white/5 via-transparent to-white/5 blur-xl"
          animate={{ opacity: [0.3, 0.65, 0.3] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <section className="relative z-10 flex w-full max-w-md flex-col gap-6">
        <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glow-md backdrop-blur-xl">
          <div className="absolute -right-12 -top-12 size-32 rounded-full bg-gradient-to-br from-electric-blue/40 via-electric-pink/30 to-transparent blur-2xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.26),transparent_55%)] opacity-60" />
          <div className="relative flex items-center justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-white/60">
                <Sparkles className="size-4" /> Neon Pulse
              </p>
              <h1 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
                Craft your elite day
              </h1>
              <p className="mt-3 text-sm text-white/70">
                A hyper-curated command center for your most electrifying
                tasks. Built for motion, engineered for momentum.
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.96 }}
              className="flex size-11 items-center justify-center rounded-2xl bg-white/10 text-white shadow-inner shadow-white/20 backdrop-blur-xl"
              onClick={() => {
                addTask("Instant capture");
              }}
            >
              <Zap className="size-5" />
            </motion.button>
          </div>
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white shadow-inner shadow-white/20 backdrop-blur">
                <Check className="size-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-white/60">
                  Progress
                </p>
                <p className="mt-1 text-xl font-semibold">{progress}% charged</p>
              </div>
            </div>
            <div className="relative h-2 w-24 overflow-hidden rounded-full bg-white/10">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-electric-blue via-electric-pink to-electric-violet"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </header>

        <div className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-glow-sm backdrop-blur-xl">
          <p className="text-xs font-mono uppercase tracking-[0.4em] text-white/60">
            Choose the vibe
          </p>
          <div className="grid grid-cols-3 gap-3">
            {vibeOptions.map((vibe) => {
              const isActive = selectedMood === vibe.id;
              return (
                <button
                  key={vibe.id}
                  onClick={() => setSelectedMood(vibe.id)}
                  className={clsx(
                    "relative overflow-hidden rounded-2xl border border-white/10 p-3 text-left transition-all",
                    isActive ? "bg-white/15 shadow-glow-sm" : "bg-white/5",
                  )}
                >
                  <div
                    className={clsx(
                      "absolute inset-0 opacity-30",
                      getAccentClass(vibeOptions.indexOf(vibe)),
                    )}
                  />
                  <div className="relative grid gap-1">
                    <span className="text-sm font-semibold">{vibe.label}</span>
                    <span className="text-[10px] text-white/70">
                      {vibe.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          <form onSubmit={handleSubmit} className="grid gap-3">
            <label className="text-xs font-mono uppercase tracking-[0.4em] text-white/60">
              Task Title
            </label>
            <div className="group relative flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 shadow-inner shadow-white/20 backdrop-blur-xl">
              <Plus className="size-5 text-white/60 group-focus-within:text-white" />
              <input
                className="w-full bg-transparent text-base font-medium text-white placeholder:text-white/40 focus:outline-none"
                placeholder="What are we conquering right now?"
                value={newTask}
                onChange={(event) => setNewTask(event.target.value)}
                aria-label="Task title"
              />
            </div>
            <textarea
              className="min-h-[80px] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/80 placeholder:text-white/35 focus:border-electric-pink/80 focus:outline-none focus:ring-2 focus:ring-electric-blue/40"
              placeholder="Add context, cues, or the energy you want to bring."
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center rounded-2xl bg-gradient-to-tr from-electric-blue via-electric-pink to-electric-violet px-5 py-3 text-base font-semibold text-white shadow-glow-md"
              type="submit"
            >
              Inject into timeline
            </motion.button>
          </form>
        </div>

        <div className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-glow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <p className="text-xs font-mono uppercase tracking-[0.4em] text-white/60">
              Filters
            </p>
            <span className="text-xs text-white/50">
              {stats.active} active · {stats.completed} done
            </span>
          </div>
          <div className="flex gap-2">
            {(
              [
                ["all", "Timeline"],
                ["active", "In Motion"],
                ["done", "Charged"],
              ] as [Filter, string][]
            ).map(([value, label]) => {
              const isActive = filter === value;
              return (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={clsx(
                    "flex-1 rounded-2xl border border-white/10 px-4 py-2 text-sm font-medium transition-all",
                    isActive
                      ? "bg-gradient-to-tr from-electric-blue/90 via-electric-pink/90 to-electric-violet/90 text-white shadow-glow-sm"
                      : "bg-white/5 text-white/70",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur-xl">
            <div className="flex flex-wrap items-center gap-4 text-xs text-white/60">
              <span className="flex items-center gap-2">
                <Flame className="size-4 text-orange-300" />
                Focus {stats.focus}
              </span>
              <span className="flex items-center gap-2">
                <Zap className="size-4 text-sky-300" />
                Pulse {stats.energy}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="size-4 text-emerald-300" />
                Reset {stats.reset}
              </span>
            </div>
          </div>
        </div>

        <section className="grid gap-4">
          <div className="flex items-center justify-between px-1 text-xs font-mono uppercase tracking-[0.4em] text-white/60">
            <span>Today&apos;s Arena</span>
            <span>
              {new Intl.DateTimeFormat("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              }).format(new Date())}
            </span>
          </div>

          <AnimatePresence mode="popLayout">
            {filteredTasks.length === 0 ? (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-8 text-center text-sm text-white/60 backdrop-blur-xl"
              >
                Nothing queued. Drop a task or tap a quick prompt to electrify
                your momentum.
              </motion.div>
            ) : (
              filteredTasks.map((task) => {
                const accent = getAccentClass(task.accentIndex);
                return (
                  <motion.article
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    className={clsx(
                      "relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-5 shadow-glow-sm backdrop-blur-xl transition-all",
                      task.completed
                        ? "opacity-80 grayscale"
                        : "hover:shadow-glow-md",
                    )}
                  >
                    <div
                      className={clsx(
                        "absolute inset-0 opacity-40 blur-xl transition-opacity",
                        accent,
                      )}
                    />
                    <div className="relative flex items-start gap-3">
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleTask(task.id)}
                        className={clsx(
                          "mt-1 flex size-9 items-center justify-center rounded-2xl border border-white/10 bg-black/30 text-white shadow-inner shadow-white/20 transition-colors",
                          task.completed && "bg-white/70 text-black",
                        )}
                      >
                        {task.completed ? (
                          <Check className="size-5" />
                        ) : (
                          <div className="size-3 rounded-full bg-white/60" />
                        )}
                      </motion.button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {task.pinned && (
                            <span className="flex items-center gap-1 rounded-full bg-black/40 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
                              <Pin className="size-3" />
                              Pinned
                            </span>
                          )}
                          <span className="rounded-full bg-white/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/80">
                            {task.mood}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] text-white/60">
                            <Calendar className="size-3" />
                            {new Intl.DateTimeFormat("en", {
                              hour: "numeric",
                              minute: "numeric",
                            }).format(new Date(task.createdAt))}
                          </span>
                        </div>
                        <h2 className="mt-3 text-lg font-semibold leading-tight">
                          {task.title}
                        </h2>
                        {task.note && (
                          <p className="mt-2 text-sm text-white/70">
                            {task.note}
                          </p>
                        )}
                        <div className="mt-4 flex items-center gap-2 text-xs text-white/60">
                          <button
                            onClick={() => togglePin(task.id)}
                            className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 transition hover:bg-white/20"
                          >
                            {task.pinned ? "Release" : "Pin"}
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-red-200 transition hover:bg-red-500/20 hover:text-white"
                          >
                            <Trash2 className="mr-1 inline size-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })
            )}
          </AnimatePresence>
        </section>

        <section className="grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-glow-sm backdrop-blur-xl">
          <p className="text-xs font-mono uppercase tracking-[0.4em] text-white/60">
            Quick prompts
          </p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, index) => (
              <motion.button
                key={prompt}
                whileTap={{ scale: 0.96 }}
                onClick={() => addTask(prompt, vibeOptions[index % vibeOptions.length].id)}
                className="rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/80 transition hover:border-white/30 hover:text-white"
              >
                {prompt}
              </motion.button>
            ))}
          </div>
        </section>
      </section>

      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => addTask(newTask || "Untitled mission")}
        className="fixed bottom-6 left-1/2 flex h-16 w-[70vw] max-w-xs -translate-x-1/2 items-center justify-center rounded-full bg-gradient-to-r from-electric-blue via-electric-pink to-electric-violet text-lg font-semibold text-white shadow-glow-lg"
      >
        <Plus className="mr-2 size-6" />
        Launch Task
      </motion.button>
    </main>
  );
}
