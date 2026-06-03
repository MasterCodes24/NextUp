import React, { useEffect, useState, useRef } from "react";
import { signOut } from "firebase/auth";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import {
  Plus,
  Trash2,
  LogOut,
  ListChecks,
  ChevronRight,
  CheckCircle2,
  Circle,
  X,
  Menu,
} from "lucide-react";

/* ─── Sidebar ─────────────────────────────────────────────────────────────── */

function Sidebar({ user, lists, selectedListId, onSelectList, onCreateList, onSignOut, mobileOpen, onCloseMobile }) {
  const [creating, setCreating]   = useState(false);
  const [newName, setNewName]     = useState("");
  const inputRef                  = useRef(null);

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;
    onCreateList(trimmed);
    setNewName("");
    setCreating(false);
  };

  useEffect(() => {
    if (creating) inputRef.current?.focus();
  }, [creating]);

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`
          fixed md:relative inset-y-0 left-0 z-30
          w-72 flex flex-col bg-white border-r border-black/5
          transform transition-transform duration-300 ease-apple
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-8 pb-4">
          <span className="font-display text-2xl font-bold text-charcoal tracking-tight">
            Next<span className="text-burnt">Up</span>
          </span>
          <button
            className="md:hidden text-charcoal/40 hover:text-charcoal transition-colors"
            onClick={onCloseMobile}
          >
            <X size={20} />
          </button>
        </div>

        {/* Create new list button */}
        <div className="px-4 pb-4">
          {creating ? (
            <form onSubmit={handleCreateSubmit}>
              <input
                ref={inputRef}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={() => { if (!newName.trim()) setCreating(false); }}
                onKeyDown={(e) => e.key === "Escape" && setCreating(false)}
                placeholder="List name…"
                className="w-full px-4 py-2.5 rounded-xl border border-burnt/40 bg-burnt/5 text-sm font-body text-charcoal placeholder-charcoal/30 outline-none focus:border-burnt focus:ring-2 focus:ring-burnt/15 transition-all"
              />
            </form>
          ) : (
            <button
              onClick={() => setCreating(true)}
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-burnt text-white text-sm font-body font-medium hover:bg-terracotta active:scale-95 transition-all duration-150 shadow-md shadow-burnt/25"
            >
              <Plus size={16} />
              New Bucket List
            </button>
          )}
        </div>

        {/* List items */}
        <div className="flex-1 overflow-y-auto px-4">
          <p className="text-[10px] font-body font-semibold text-charcoal/30 uppercase tracking-widest px-2 mb-2">
            My Lists
          </p>
          {lists.length === 0 && (
            <p className="text-xs font-body text-charcoal/30 px-2 py-2 italic font-light">
              No lists yet. Create one above!
            </p>
          )}
          <ul className="space-y-0.5">
            {lists.map((list) => (
              <li key={list.id}>
                <button
                  onClick={() => { onSelectList(list.id); onCloseMobile(); }}
                  className={`
                    w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-body font-medium text-left transition-all duration-150
                    ${selectedListId === list.id
                      ? "bg-burnt/10 text-burnt"
                      : "text-charcoal/60 hover:bg-surface hover:text-charcoal"
                    }
                  `}
                >
                  <span className="flex items-center gap-2.5">
                    <ListChecks size={15} className={selectedListId === list.id ? "text-burnt" : "text-charcoal/30"} />
                    <span className="truncate max-w-[140px]">{list.name}</span>
                  </span>
                  {selectedListId === list.id && <ChevronRight size={14} className="text-burnt/60 shrink-0" />}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* User profile + sign out */}
        <div className="px-4 pb-6 pt-4 border-t border-black/5">
          <div className="flex items-center gap-3 mb-3">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-burnt/20"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-burnt/20 flex items-center justify-center text-burnt text-sm font-bold font-display">
                {user.displayName?.[0] ?? "?"}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-body font-semibold text-charcoal truncate">{user.displayName}</p>
              <p className="text-xs font-body text-charcoal/35 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onSignOut}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-body font-medium text-charcoal/40 border border-black/8 hover:border-terracotta/40 hover:text-terracotta hover:bg-terracotta/5 transition-all duration-150"
          >
            <LogOut size={13} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

/* ─── Item Row ─────────────────────────────────────────────────────────────── */

function ItemRow({ item, userId, listId }) {
  const [hovered, setHovered] = useState(false);

  const toggle = () =>
    updateDoc(doc(db, "users", userId, "lists", listId, "items", item.id), {
      completed: !item.completed,
    });

  const remove = () =>
    deleteDoc(doc(db, "users", userId, "lists", listId, "items", item.id));

  return (
    <li
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group flex items-center gap-3 py-3 px-1 border-b border-black/4 last:border-0 transition-all duration-150"
    >
      <button
        onClick={toggle}
        className="shrink-0 text-charcoal/25 hover:text-burnt transition-colors duration-150"
      >
        {item.completed ? (
          <CheckCircle2 size={21} className="text-teal" />
        ) : (
          <Circle size={21} />
        )}
      </button>

      <span
        className={`flex-1 text-sm font-body leading-relaxed transition-all duration-200 ${
          item.completed ? "line-through text-charcoal/30" : "text-charcoal"
        }`}
      >
        {item.text}
      </span>

      <button
        onClick={remove}
        className={`shrink-0 text-charcoal/20 hover:text-terracotta transition-all duration-150 ${
          hovered ? "opacity-100" : "opacity-0"
        }`}
        aria-label="Delete item"
      >
        <Trash2 size={15} />
      </button>
    </li>
  );
}

/* ─── Main Content ─────────────────────────────────────────────────────────── */

function MainContent({ user, selectedList }) {
  const [items, setItems]       = useState([]);
  const [newText, setNewText]   = useState("");
  const [loading, setLoading]   = useState(false);
  const inputRef                = useRef(null);

  useEffect(() => {
    if (!selectedList) return;
    setLoading(true);
    const q = query(
      collection(db, "users", user.uid, "lists", selectedList.id, "items"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, [selectedList, user.uid]);

  const addItem = async (e) => {
    e.preventDefault();
    const trimmed = newText.trim();
    if (!trimmed || !selectedList) return;
    setNewText("");
    await addDoc(
      collection(db, "users", user.uid, "lists", selectedList.id, "items"),
      { text: trimmed, completed: false, createdAt: serverTimestamp() }
    );
    inputRef.current?.focus();
  };

  const deleteList = async () => {
    if (!selectedList) return;
    if (!window.confirm(`Delete "${selectedList.name}"? This cannot be undone.`)) return;
    await deleteDoc(doc(db, "users", user.uid, "lists", selectedList.id));
  };

  const completedCount = items.filter((i) => i.completed).length;

  if (!selectedList) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-12 bg-surface">
        <div className="w-20 h-20 rounded-3xl bg-white border border-black/5 shadow-sm flex items-center justify-center mb-6">
          <ListChecks size={32} className="text-burnt/40" />
        </div>
        <h2 className="font-display text-2xl font-bold text-charcoal/30 mb-2">No list selected</h2>
        <p className="text-sm font-body text-charcoal/25 font-light">
          Pick a list from the sidebar or create a new one.
        </p>
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col min-h-0 bg-surface">
      {/* Header */}
      <header className="bg-white border-b border-black/5 px-8 py-6 flex items-start justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-charcoal tracking-tight">
            {selectedList.name}
          </h1>
          <p className="text-xs font-body text-charcoal/35 mt-1">
            {items.length === 0
              ? "No items yet"
              : `${completedCount} of ${items.length} completed`}
          </p>
        </div>

        {/* Progress ring + delete */}
        <div className="flex items-center gap-4">
          {items.length > 0 && (
            <div className="relative w-10 h-10">
              <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="#F5F5F7" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15" fill="none"
                  stroke="#069494" strokeWidth="3"
                  strokeDasharray={`${(completedCount / items.length) * 94.2} 94.2`}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dasharray 0.5s ease" }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-body font-bold text-teal">
                {Math.round((completedCount / items.length) * 100)}%
              </span>
            </div>
          )}
          <button
            onClick={deleteList}
            className="text-charcoal/20 hover:text-terracotta transition-colors"
            title="Delete list"
          >
            <Trash2 size={17} />
          </button>
        </div>
      </header>

      {/* Add item form */}
      <div className="px-8 py-5 bg-white border-b border-black/5">
        <form onSubmit={addItem} className="flex items-center gap-3">
          <Plus size={16} className="shrink-0 text-charcoal/30" />
          <input
            ref={inputRef}
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Add a new item…"
            className="flex-1 text-sm font-body text-charcoal placeholder-charcoal/25 bg-transparent outline-none"
          />
          <button
            type="submit"
            disabled={!newText.trim()}
            className="px-4 py-1.5 rounded-xl bg-burnt text-white text-xs font-body font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-terracotta active:scale-95 transition-all duration-150"
          >
            Add
          </button>
        </form>
      </div>

      {/* Items list */}
      <div className="flex-1 overflow-y-auto px-8 py-4">
        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-5 h-5 rounded-full border-2 border-burnt border-t-transparent animate-spin" />
          </div>
        )}
        {!loading && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-4xl mb-3">🪣</span>
            <p className="text-sm font-body text-charcoal/30 font-light">
              This list is empty. Add your first item above!
            </p>
          </div>
        )}
        {!loading && items.length > 0 && (
          <div className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden">
            <ul className="divide-y divide-black/4 px-4">
              {items.map((item) => (
                <ItemRow key={item.id} item={item} userId={user.uid} listId={selectedList.id} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}

/* ─── Dashboard ────────────────────────────────────────────────────────────── */

export default function Dashboard({ user }) {
  const [lists, setLists]               = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const selectedList = lists.find((l) => l.id === selectedListId) ?? null;

  // Subscribe to lists
  useEffect(() => {
    const q = query(
      collection(db, "users", user.uid, "lists"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, (snap) => {
      const fetched = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setLists(fetched);
      // Auto-select first list if none selected
      setSelectedListId((prev) => {
        if (prev && fetched.find((l) => l.id === prev)) return prev;
        return fetched[0]?.id ?? null;
      });
    });
    return unsub;
  }, [user.uid]);

  const handleCreateList = async (name) => {
    const ref = await addDoc(
      collection(db, "users", user.uid, "lists"),
      { name, createdAt: serverTimestamp() }
    );
    setSelectedListId(ref.id);
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      {/* Mobile top bar */}
      <div className="fixed top-0 inset-x-0 z-20 flex items-center justify-between px-5 py-4 bg-white border-b border-black/5 md:hidden">
        <span className="font-display text-xl font-bold text-charcoal">
          Next<span className="text-burnt">Up</span>
        </span>
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="text-charcoal/50 hover:text-charcoal transition-colors"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Sidebar */}
      <Sidebar
        user={user}
        lists={lists}
        selectedListId={selectedListId}
        onSelectList={setSelectedListId}
        onCreateList={handleCreateList}
        onSignOut={handleSignOut}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 pt-0 md:pt-0 mt-14 md:mt-0 overflow-hidden">
        <MainContent user={user} selectedList={selectedList} />
      </div>
    </div>
  );
}