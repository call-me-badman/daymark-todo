import { useEffect, useState, type FormEvent } from "react";

type Todo = {
  id: string;
  title: string;
  completed: boolean;
};

type Filter = "all" | "active" | "done";

const STORAGE_KEY = "todo-app.todos";
const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "done", label: "Done" },
];

function isTodo(value: unknown): value is Todo {
  if (typeof value !== "object" || value === null) return false;
  const todo = value as Record<string, unknown>;
  return (
    typeof todo.id === "string" &&
    typeof todo.title === "string" &&
    typeof todo.completed === "boolean"
  );
}

function loadTodos(): Todo[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter(isTodo) : [];
  } catch {
    return [];
  }
}

function AuthIllustration() {
  return (
    <svg className="auth-illustration" viewBox="0 0 640 540" role="img" aria-label="Illustration of a neatly arranged task planner">
      <path d="M45 447h550" stroke="#8BA69A" strokeWidth="2" strokeLinecap="round" />
      <path d="M82 446c16-82 23-142 17-180M558 446c-12-71-17-122-12-153" fill="none" stroke="#769487" strokeWidth="2" />
      <path d="M99 310c-34-4-52-20-55-49 31 2 49 17 55 49ZM97 350c-34-3-53-19-58-48 32 1 51 17 58 48ZM550 338c31-3 48-19 51-46-29 1-46 17-51 46ZM548 375c30-3 47-18 51-45-29 1-46 16-51 45Z" fill="#8BA69A" />
      <rect x="113" y="82" width="374" height="371" rx="22" fill="#143F37" opacity=".16" transform="rotate(-4 113 82)" />
      <g transform="rotate(-3 310 270)">
        <rect x="117" y="64" width="374" height="372" rx="22" fill="#FBFCF7" />
        <path d="M117 86a22 22 0 0 1 22-22h330a22 22 0 0 1 22 22v57H117V86Z" fill="#E8EEE6" />
        <circle cx="148" cy="102" r="5" fill="#E28E71" />
        <circle cx="168" cy="102" r="5" fill="#D9E385" />
        <circle cx="188" cy="102" r="5" fill="#83A99A" />
        <text x="151" y="184" fill="#173F37" fontFamily="Georgia, serif" fontSize="31">A clear day</text>
        <text x="151" y="211" fill="#80928A" fontFamily="Arial, sans-serif" fontSize="12" letterSpacing="2">YOUR TASKS, IN FOCUS</text>
        <path d="M151 237h302" stroke="#E2E9E0" />
        <g fontFamily="Arial, sans-serif" fontSize="16" fill="#405A50">
          <rect x="152" y="260" width="19" height="19" rx="5" fill="#3E7967" />
          <path d="m157 269 4 4 7-8" fill="none" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <text x="187" y="275" fill="#95A29B" textDecoration="line-through">Review the week</text>
          <rect x="152" y="303" width="19" height="19" rx="5" fill="none" stroke="#A8B8AB" strokeWidth="2" />
          <text x="187" y="318">Make room for focus</text>
          <rect x="152" y="346" width="19" height="19" rx="5" fill="none" stroke="#A8B8AB" strokeWidth="2" />
          <text x="187" y="361">Take a proper break</text>
        </g>
        <path d="M151 391h302" stroke="#E2E9E0" />
        <circle cx="162" cy="414" r="5" fill="#E28E71" />
        <path d="M178 414h115" stroke="#CBD7CC" strokeWidth="5" strokeLinecap="round" />
      </g>
      <g transform="rotate(5 497 258)">
        <rect x="449" y="225" width="123" height="85" rx="14" fill="#DDE6D8" />
        <circle cx="474" cy="252" r="9" fill="#E28E71" />
        <path d="M493 249h54M466 277h78M466 291h46" stroke="#759084" strokeWidth="5" strokeLinecap="round" />
      </g>
      <path d="m497 116 6 13 14 2-10 10 2 14-12-7-13 7 3-14-10-10 14-2 6-13Z" fill="#D9E385" />
      <circle cx="96" cy="145" r="6" fill="#E28E71" />
      <circle cx="544" cy="180" r="4" fill="#D9E385" />
      <path d="M83 220c10-11 20-11 30 0M524 394c9-10 18-10 27 0" fill="none" stroke="#D9E385" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export default function App() {
  const [showTasks, setShowTasks] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const [todos, setTodos] = useState<Todo[]>(loadTodos);
  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      // Storage can be unavailable or full; keep the in-memory app usable.
    }
  }, [todos]);

  const activeCount = todos.filter((todo) => !todo.completed).length;
  const completedCount = todos.length - activeCount;
  const visibleTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "done") return todo.completed;
    return true;
  });

  function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAuthMessage("Email sign-in is not connected yet. You can preview the app without an account.");
  }

  function switchAuthMode(mode: "login" | "signup") {
    setAuthMode(mode);
    setAuthMessage("");
  }

  if (!showTasks) {
    const isSignup = authMode === "signup";

    return (
      <main className="auth-page">
        <section className="auth-visual" aria-label="Daymark introduction">
          <a className="auth-brand" href="#top" onClick={(event) => event.preventDefault()}>
            <span className="auth-brand-mark" aria-hidden="true">d</span>
            <span>daymark</span>
          </a>
          <div className="auth-visual-copy">
            <p className="auth-kicker">A CLEARER KIND OF TO-DO</p>
            <h1>Make space for<br /><em>what matters.</em></h1>
            <p>Less noise, more intention. Keep your next steps close and your head clear.</p>
          </div>
          <AuthIllustration />
          <p className="auth-visual-footnote"><span aria-hidden="true">✳</span> ONE THING AT A TIME</p>
        </section>

        <section className="auth-panel" aria-labelledby="auth-title">
          <div className="auth-panel-inner">
            <div className="auth-mobile-brand">
              <span className="auth-brand-mark" aria-hidden="true">d</span>
              <span>daymark</span>
            </div>
            <div className="auth-heading">
              <p className="auth-kicker">{isSignup ? "YOUR SPACE STARTS HERE" : "WELCOME BACK"}</p>
              <h2 id="auth-title">{isSignup ? "Create your account" : "Sign in to Daymark"}</h2>
              <p>{isSignup ? "A little more focus, one day at a time." : "Pick up where you left off."}</p>
            </div>

            <button
              className="google-button"
              type="button"
              onClick={() => setAuthMessage("Google sign-in needs an OAuth client ID before it can be enabled.")}
            >
              <svg aria-hidden="true" viewBox="0 0 48 48" className="google-mark">
                <path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5.1h6.6c3.9-3.6 6.1-8.8 6.1-15Z" />
                <path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5.1c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.3A20 20 0 0 0 24 44Z" />
                <path fill="#FBBC05" d="M12.6 27.6a12 12 0 0 1 0-7.2v-5.3H5.8a20 20 0 0 0 0 17.8l6.8-5.3Z" />
                <path fill="#EA4335" d="M24 11.9c3 0 5.7 1 7.8 3.1l5.9-5.9C34.1 5.8 29.5 4 24 4A20 20 0 0 0 5.8 15.1l6.8 5.3c1.6-4.9 6.1-8.5 11.4-8.5Z" />
              </svg>
              Continue with Google
            </button>

            <div className="auth-divider"><span>OR WITH EMAIL</span></div>

            <form className="auth-form" onSubmit={handleAuthSubmit}>
              {isSignup && (
                <label className="auth-field">
                  <span>Your name</span>
                  <input
                    autoComplete="name"
                    name="name"
                    onChange={(event) => setAuthName(event.target.value)}
                    placeholder="Alex Morgan"
                    required
                    value={authName}
                  />
                </label>
              )}
              <label className="auth-field">
                <span>Email address</span>
                <input
                  autoComplete="email"
                  name="email"
                  onChange={(event) => setAuthEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                  type="email"
                  value={authEmail}
                />
              </label>
              <label className="auth-field">
                <span>Password</span>
                <span className="password-input-wrap">
                  <input
                    autoComplete={isSignup ? "new-password" : "current-password"}
                    minLength={8}
                    name="password"
                    onChange={(event) => setAuthPassword(event.target.value)}
                    placeholder="At least 8 characters"
                    required
                    type={showPassword ? "text" : "password"}
                    value={authPassword}
                  />
                  <button className="password-toggle" type="button" onClick={() => setShowPassword((visible) => !visible)}>
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </span>
              </label>
              {!isSignup && (
                <button className="forgot-link" type="button" onClick={() => setAuthMessage("Password reset will be available when email authentication is connected.")}>
                  Forgot password?
                </button>
              )}
              <button className="auth-submit" type="submit">{isSignup ? "Create account" : "Sign in"}<span aria-hidden="true">→</span></button>
              {authMessage && <p className="auth-message" role="status">{authMessage}</p>}
            </form>

            <p className="auth-switch">
              {isSignup ? "Already have an account?" : "New to Daymark?"}{" "}
              <button type="button" onClick={() => switchAuthMode(isSignup ? "login" : "signup")}>
                {isSignup ? "Sign in" : "Create an account"}
              </button>
            </p>
            <button className="preview-link" type="button" onClick={() => setShowTasks(true)}>
              Continue without signing in
            </button>
            <p className="auth-legal">By continuing, you agree to our <a href="#terms" onClick={(event) => event.preventDefault()}>Terms</a> and <a href="#privacy" onClick={(event) => event.preventDefault()}>Privacy Policy</a>.</p>
          </div>
        </section>
      </main>
    );
  }

  function addTodo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = newTodo.trim();
    if (!title) return;

    setTodos((currentTodos) => [
      ...currentTodos,
      { id: crypto.randomUUID(), title, completed: false },
    ]);
    setNewTodo("");
  }

  function toggleTodo(id: string) {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }

  function removeTodo(id: string) {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
    if (editingId === id) setEditingId(null);
  }

  function startEditing(todo: Todo) {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  }

  function saveEdit(id: string) {
    const title = editingTitle.trim();
    if (!title) return;
    setTodos((currentTodos) =>
      currentTodos.map((todo) => (todo.id === id ? { ...todo, title } : todo)),
    );
    setEditingId(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingTitle("");
  }

  function clearCompleted() {
    setTodos((currentTodos) => currentTodos.filter((todo) => !todo.completed));
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-16 text-slate-900">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
            Your day, in focus
          </p>
          <h1 className="text-4xl font-bold tracking-tight">Things to do</h1>
          <p className="mt-3 text-slate-600" aria-live="polite">
            {activeCount === 0
              ? "Nothing waiting on you."
              : `${activeCount} ${activeCount === 1 ? "task" : "tasks"} left`}
          </p>
        </div>
        <button className="text-sm font-medium text-slate-500 hover:text-indigo-700" onClick={() => setShowTasks(false)} type="button">
          Sign out
        </button>
      </header>

      <form className="mb-8 flex gap-3" onSubmit={addTodo}>
        <label className="sr-only" htmlFor="new-todo">
          Add a task
        </label>
        <input
          className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          id="new-todo"
          onChange={(event) => setNewTodo(event.target.value)}
          placeholder="What needs to get done?"
          required
          value={newTodo}
        />
        <button
          className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2"
          type="submit"
        >
          Add task
        </button>
      </form>

      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex gap-2" role="group" aria-label="Filter tasks">
          {filters.map((item) => (
            <button
              aria-pressed={filter === item.value}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${filter === item.value ? "bg-indigo-100 text-indigo-800" : "text-slate-500 hover:bg-white"}`}
              key={item.value}
              onClick={() => setFilter(item.value)}
              type="button"
            >
              {item.label}
              {item.value === "all" ? ` (${todos.length})` : ""}
            </button>
          ))}
        </div>
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {todos.length} total
        </span>
      </div>

      {visibleTodos.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-slate-500" role="status">
          {todos.length === 0 ? "No tasks yet. Add one above to get started." : `No ${filter} tasks.`}
        </p>
      ) : (
        <ul className="space-y-3" aria-label="Tasks">
          {visibleTodos.map((todo) => (
            <li
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              key={todo.id}
            >
              <input
                aria-label={`Mark ${todo.title} as ${todo.completed ? "not done" : "done"}`}
                checked={todo.completed}
                className="size-5 accent-indigo-600"
                onChange={() => toggleTodo(todo.id)}
                type="checkbox"
              />
              {editingId === todo.id ? (
                <input
                  aria-label="Edit task"
                  autoFocus
                  className="min-w-0 flex-1 rounded border border-indigo-300 px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-200"
                  onChange={(event) => setEditingTitle(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") saveEdit(todo.id);
                    if (event.key === "Escape") cancelEdit();
                  }}
                  value={editingTitle}
                />
              ) : (
                <span
                  className={`min-w-0 flex-1 break-words ${todo.completed ? "text-slate-400 line-through" : ""}`}
                  onDoubleClick={() => startEditing(todo)}
                >
                  {todo.title}
                </span>
              )}
              {editingId === todo.id ? (
                <>
                  <button className="px-2 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800" onClick={() => saveEdit(todo.id)} type="button">Save</button>
                  <button className="px-2 py-2 text-sm font-medium text-slate-500 hover:text-slate-700" onClick={cancelEdit} type="button">Cancel</button>
                </>
              ) : (
                <button className="px-2 py-2 text-sm font-medium text-slate-500 hover:text-indigo-700" onClick={() => startEditing(todo)} type="button">Edit</button>
              )}
              <button
                aria-label={`Delete ${todo.title}`}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                onClick={() => removeTodo(todo.id)}
                type="button"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
      {completedCount > 0 && (
        <div className="mt-4 flex justify-end">
          <button className="text-sm font-medium text-slate-500 hover:text-red-700" onClick={clearCompleted} type="button">
            Clear completed ({completedCount})
          </button>
        </div>
      )}
    </main>
  );
}
