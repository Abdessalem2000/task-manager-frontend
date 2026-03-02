'use client';

import { useState, useEffect } from 'react';

type Task = {
  _id: string;
  title: string;
  completed: boolean;
};

const DEMO_TASKS: Task[] = [
  { _id: '1', title: 'Demo: Review leads', completed: false },
  { _id: '2', title: 'Demo: Client onboarding', completed: true },
  { _id: '3', title: 'Demo: Support ticket', completed: false },
  { _id: '4', title: 'Demo: Weekly report', completed: false },
  { _id: '5', title: 'Demo: AI workflow test', completed: true },
];

export default function WorkingAppPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    setTasks(DEMO_TASKS);
  }, []);

  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);
  const weeklyGoal = 20;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-slate-900/80 border border-slate-700 rounded-3xl shadow-2xl p-8 md:p-10">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <p className="text-sm font-medium text-sky-400 uppercase tracking-[0.2em] mb-1">
              Task Manager Demo
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Your Daily Productivity Snapshot
            </h1>
          </div>
          <div className="flex items-center gap-2 text-slate-300 text-sm">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 mr-1" />
            Live demo mode
          </div>
        </header>

        <section className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
              Total Tasks
            </p>
            <p className="text-3xl font-semibold text-white">{total}</p>
            <p className="text-xs text-slate-400 mt-1">All active tasks for this week</p>
          </div>
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
              Completion Rate
            </p>
            <p className="text-3xl font-semibold text-emerald-400">{completionRate}%</p>
            <p className="text-xs text-slate-400 mt-1">{completed} completed today</p>
          </div>
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
              Weekly Goal
            </p>
            <p className="text-3xl font-semibold text-sky-400">{weeklyGoal}</p>
            <p className="text-xs text-slate-400 mt-1">Tasks to hit this week</p>
          </div>
        </section>

        <section className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-200 tracking-wide">
              Today&apos;s Tasks
            </h2>
            <span className="text-xs text-slate-400">{completed} / {total} completed</span>
          </div>
          <ul className="space-y-2">
            {tasks.map(task => (
              <li
                key={task._id}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={
                      'h-2 w-2 rounded-full ' +
                      (task.completed ? 'bg-emerald-400' : 'bg-slate-500')
                    }
                  />
                  <span
                    className={
                      'text-sm ' +
                      (task.completed ? 'text-slate-400 line-through' : 'text-slate-100')
                    }
                  >
                    {task.title}
                  </span>
                </div>
                <span
                  className={
                    'text-xs px-2 py-1 rounded-full border ' +
                    (task.completed
                      ? 'border-emerald-500 text-emerald-300 bg-emerald-500/10'
                      : 'border-slate-500 text-slate-300 bg-slate-700/40')
                  }
                >
                  {task.completed ? 'Done' : 'Pending'}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
