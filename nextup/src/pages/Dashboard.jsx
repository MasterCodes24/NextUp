import React, { useEffect, useState, useRef } from "react";
import { signOut } from "firebase/auth";
import {
  collection, addDoc, deleteDoc, updateDoc, doc,
  onSnapshot, serverTimestamp, query, orderBy,
} from "firebase/firestore";
import { auth, db } from "../firebase";

/* ── Icons (inline SVGs — no lucide import needed, avoids any icon issues) ── */

const IconPlus       = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const IconTrash      = ({ size=15 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>;
const IconLogOut     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const IconList       = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>;
const IconCircle     = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>;
const IconCheckCircle= () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const IconX          = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconMenu       = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
const IconChevronRight=()=><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;

/* ── Token System ─────────────────────────────────────────────────────────── */
const T = {
  bg:        "#F2F2F7",
  bgPanel:   "#FFFFFF",
  border:    "rgba(0,0,0,0.08)",
  borderMid: "rgba(0,0,0,0.12)",
  text1:     "#1C1C1E",
  text2:     "#3A3A3C",
  text3:     "#636366",
  text4:     "#AEAEB2",
  accent:    "#FF6B00",
  accentBg:  "rgba(255,107,0,0.10)",
  accentHov: "#E05E00",
  green:     "#34C759",
  greenBg:   "rgba(52,199,89,0.10)",
  red:       "#FF3B30",
  redBg:     "rgba(255,59,48,0.10)",
  sidebarW:  "264px",
  radius:    "16px",
  radiusSm:  "10px",
  shadow:    "0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.05)",
};

/* ── Sidebar ─────────────────────────────────────────────────────────────── */
function Sidebar({ user, lists, selectedListId, onSelectList, onCreateList, onSignOut, mobileOpen, onCloseMobile }) {
  const [creating, setCreating] = useState(false);
  const [newName,  setNewName]  = useState("");
  const inputRef                = useRef(null);

  const handleSubmit = (e) => {
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

  const sidebarStyle = {
    position: "fixed",
    top: 0, bottom: 0, left: 0,
    width: T.sidebarW,
    display: "flex", flexDirection: "column",
    background: T.bgPanel,
    borderRight: `1px solid ${T.border}`,
    zIndex: 30,
    transition: "transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94)",
    fontFamily: "-apple-system,'SF Pro Display','Helvetica Neue',Arial,sans-serif",
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: "fixed", inset: 0, zIndex: 20,
            background: "rgba(0,0,0,0.35)",
            backdropFilter: "blur(4px)",
          }}
        />
      )}

      <aside style={{
        ...sidebarStyle,
        transform: mobileOpen ? "translateX(0)" : undefined,
      }}
        className={`${mobileOpen ? "" : "max-md:!translate-x-[-100%]"} md:!translate-x-0`}
      >
        {/* Logo + close */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "28px 20px 16px",
        }}>
          <span style={{ fontWeight: 800, fontSize: "20px", letterSpacing: "-0.03em", color: T.text1 }}>
            Next<span style={{ color: T.accent }}>Up</span>
          </span>
          <button
            className="md:hidden"
            onClick={onCloseMobile}
            style={{
              color: T.text3, background: "none", border: "none",
              cursor: "pointer", padding: "4px", borderRadius: "8px",
              display: "flex", alignItems: "center",
            }}
          >
            <IconX />
          </button>
        </div>

        {/* New list */}
        <div style={{ padding: "0 12px 12px" }}>
          {creating ? (
            <form onSubmit={handleSubmit}>
              <input
                ref={inputRef}
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onBlur={() => { if (!newName.trim()) setCreating(false); }}
                onKeyDown={e => e.key === "Escape" && setCreating(false)}
                placeholder="List name…"
                style={{
                  width: "100%", padding: "10px 14px",
                  borderRadius: T.radiusSm,
                  border: `1.5px solid ${T.accent}`,
                  background: T.accentBg,
                  color: T.text1, fontSize: "14px",
                  outline: "none",
                  boxShadow: `0 0 0 3px rgba(255,107,0,0.15)`,
                  fontFamily: "inherit",
                }}
              />
            </form>
          ) : (
            <button
              onClick={() => setCreating(true)}
              style={{
                width: "100%", display: "flex", alignItems: "center",
                gap: "8px", padding: "10px 14px",
                borderRadius: T.radiusSm,
                background: T.accent, color: "#fff",
                fontSize: "14px", fontWeight: 600,
                border: "none", cursor: "pointer",
                boxShadow: "0 4px 12px rgba(255,107,0,0.30)",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = T.accentHov; }}
              onMouseLeave={e => { e.currentTarget.style.background = T.accent; }}
            >
              <IconPlus />
              New Bucket List
            </button>
          )}
        </div>

        {/* List items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "0 12px" }}>
          <p style={{
            fontSize: "11px", fontWeight: 700, color: T.text4,
            textTransform: "uppercase", letterSpacing: "0.08em",
            padding: "4px 8px 8px",
          }}>
            My Lists
          </p>

          {lists.length === 0 && (
            <p style={{ fontSize: "13px", color: T.text4, padding: "4px 8px", fontStyle: "italic" }}>
              No lists yet. Create one above!
            </p>
          )}

          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "2px" }}>
            {lists.map(list => {
              const active = selectedListId === list.id;
              return (
                <li key={list.id}>
                  <button
                    onClick={() => { onSelectList(list.id); onCloseMobile(); }}
                    style={{
                      width: "100%", display: "flex", alignItems: "center",
                      justifyContent: "space-between",
                      padding: "9px 12px", borderRadius: T.radiusSm,
                      background: active ? T.accentBg : "transparent",
                      color: active ? T.accent : T.text2,
                      fontSize: "14px", fontWeight: active ? 600 : 500,
                      border: "none", cursor: "pointer", textAlign: "left",
                      transition: "all 0.12s ease",
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.background = T.bg; }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "8px", overflow: "hidden" }}>
                      <span style={{ color: active ? T.accent : T.text4, flexShrink: 0 }}><IconList /></span>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "148px" }}>
                        {list.name}
                      </span>
                    </span>
                    {active && <span style={{ color: T.accent, flexShrink: 0 }}><IconChevronRight /></span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* User + sign out */}
        <div style={{
          padding: "16px 12px 24px",
          borderTop: `1px solid ${T.border}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", padding: "0 4px" }}>
            {user.photoURL ? (
              <img
                src={user.photoURL} alt={user.displayName}
                referrerPolicy="no-referrer"
                style={{ width: "34px", height: "34px", borderRadius: "50%", objectFit: "cover", border: `2px solid ${T.border}` }}
              />
            ) : (
              <div style={{
                width: "34px", height: "34px", borderRadius: "50%",
                background: T.accentBg, display: "flex", alignItems: "center",
                justifyContent: "center", color: T.accent, fontWeight: 700, fontSize: "14px",
              }}>
                {user.displayName?.[0] ?? "?"}
              </div>
            )}
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: "14px", fontWeight: 600, color: T.text1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.displayName}
              </p>
              <p style={{ fontSize: "12px", color: T.text4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.email}
              </p>
            </div>
          </div>

          <button
            onClick={onSignOut}
            style={{
              width: "100%", display: "flex", alignItems: "center",
              justifyContent: "center", gap: "7px",
              padding: "9px 16px", borderRadius: T.radiusSm,
              background: "transparent", color: T.text3,
              fontSize: "13px", fontWeight: 500,
              border: `1.5px solid ${T.border}`, cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "rgba(255,59,48,0.4)";
              e.currentTarget.style.color = T.red;
              e.currentTarget.style.background = T.redBg;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = T.border;
              e.currentTarget.style.color = T.text3;
              e.currentTarget.style.background = "transparent";
            }}
          >
            <IconLogOut />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

/* ── Item Row ─────────────────────────────────────────────────────────────── */
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
      style={{
        display: "flex", alignItems: "center", gap: "12px",
        padding: "12px 16px",
        borderBottom: `1px solid ${T.border}`,
        transition: "background 0.12s ease",
        background: hovered ? T.bg : "transparent",
      }}
    >
      <button
        onClick={toggle}
        style={{
          flexShrink: 0, background: "none", border: "none",
          cursor: "pointer", padding: 0,
          color: item.completed ? T.green : T.text4,
          display: "flex", alignItems: "center",
          transition: "color 0.15s ease",
        }}
        title={item.completed ? "Mark incomplete" : "Mark complete"}
      >
        {item.completed ? <IconCheckCircle /> : <IconCircle />}
      </button>

      <span style={{
        flex: 1, fontSize: "15px", lineHeight: "1.4", color: item.completed ? T.text4 : T.text1,
        textDecoration: item.completed ? "line-through" : "none",
        transition: "all 0.2s ease",
      }}>
        {item.text}
      </span>

      <button
        onClick={remove}
        title="Delete item"
        style={{
          flexShrink: 0, background: "none", border: "none",
          cursor: "pointer", padding: "4px",
          color: T.red, borderRadius: "6px",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.15s ease",
          display: "flex", alignItems: "center",
        }}
      >
        <IconTrash />
      </button>
    </li>
  );
}

/* ── Main Content ─────────────────────────────────────────────────────────── */
function MainContent({ user, selectedList }) {
  const [items,   setItems]   = useState([]);
  const [newText, setNewText] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef              = useRef(null);

  useEffect(() => {
    if (!selectedList) return;
    setLoading(true);
    const q = query(
      collection(db, "users", user.uid, "lists", selectedList.id, "items"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, snap => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
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

  const completedCount = items.filter(i => i.completed).length;
  const progress = items.length > 0 ? completedCount / items.length : 0;
  const circumference = 2 * Math.PI * 15; // r=15

  if (!selectedList) {
    return (
      <main style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: T.bg, textAlign: "center", padding: "48px",
      }}>
        <div style={{
          width: "72px", height: "72px", borderRadius: "20px",
          background: T.bgPanel, border: `1px solid ${T.border}`,
          boxShadow: T.shadow, display: "flex",
          alignItems: "center", justifyContent: "center",
          fontSize: "32px", marginBottom: "20px",
        }}>
          📋
        </div>
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: T.text3, marginBottom: "8px", letterSpacing: "-0.01em" }}>
          No list selected
        </h2>
        <p style={{ fontSize: "15px", color: T.text4, fontWeight: 400 }}>
          Pick a list from the sidebar or create a new one.
        </p>
      </main>
    );
  }

  return (
    <main style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: T.bg }}>
      {/* Header */}
      <header style={{
        background: T.bgPanel, borderBottom: `1px solid ${T.border}`,
        padding: "24px 32px",
        display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        flexShrink: 0,
      }}>
        <div>
          <h1 style={{
            fontSize: "28px", fontWeight: 700, color: T.text1,
            letterSpacing: "-0.025em", marginBottom: "4px",
          }}>
            {selectedList.name}
          </h1>
          <p style={{ fontSize: "13px", color: T.text4, fontWeight: 400 }}>
            {items.length === 0
              ? "No items yet"
              : `${completedCount} of ${items.length} completed`}
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {items.length > 0 && (
            <div style={{ position: "relative", width: "44px", height: "44px" }}>
              <svg width="44" height="44" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="22" cy="22" r="15" fill="none" stroke={T.bg} strokeWidth="3.5" />
                <circle
                  cx="22" cy="22" r="15" fill="none"
                  stroke={T.green} strokeWidth="3.5"
                  strokeDasharray={`${progress * circumference} ${circumference}`}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dasharray 0.5s ease" }}
                />
              </svg>
              <span style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "10px", fontWeight: 700, color: T.green,
              }}>
                {Math.round(progress * 100)}%
              </span>
            </div>
          )}

          <button
            onClick={deleteList}
            title="Delete list"
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: T.text4, padding: "8px", borderRadius: "8px",
              display: "flex", alignItems: "center",
              transition: "color 0.15s ease",
            }}
            onMouseEnter={e => e.currentTarget.style.color = T.red}
            onMouseLeave={e => e.currentTarget.style.color = T.text4}
          >
            <IconTrash size={17} />
          </button>
        </div>
      </header>

      {/* Add item */}
      <div style={{
        background: T.bgPanel, borderBottom: `1px solid ${T.border}`,
        padding: "16px 32px", flexShrink: 0,
      }}>
        <form onSubmit={addItem} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ color: T.text4, flexShrink: 0, display: "flex" }}><IconPlus /></span>
          <input
            ref={inputRef}
            value={newText}
            onChange={e => setNewText(e.target.value)}
            placeholder="Add a new item…"
            style={{
              flex: 1, fontSize: "15px", color: T.text1,
              background: "transparent", border: "none", outline: "none",
              fontFamily: "inherit",
            }}
          />
          <button
            type="submit"
            disabled={!newText.trim()}
            style={{
              padding: "7px 18px", borderRadius: "10px",
              background: newText.trim() ? T.accent : T.bg,
              color: newText.trim() ? "#fff" : T.text4,
              fontSize: "13px", fontWeight: 600,
              border: "none", cursor: newText.trim() ? "pointer" : "not-allowed",
              transition: "all 0.15s ease", flexShrink: 0,
            }}
          >
            Add
          </button>
        </form>
      </div>

      {/* Items */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
        {loading && (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: "48px" }}>
            <div style={{
              width: "22px", height: "22px", borderRadius: "50%",
              border: `2.5px solid ${T.accentBg}`,
              borderTopColor: T.accent,
              animation: "spin 0.7s linear infinite",
            }} />
          </div>
        )}

        {!loading && items.length === 0 && (
          <div style={{
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            paddingTop: "80px", textAlign: "center",
          }}>
            <span style={{ fontSize: "40px", marginBottom: "12px" }}>🪣</span>
            <p style={{ fontSize: "15px", color: T.text4, fontWeight: 400 }}>
              This list is empty. Add your first item above!
            </p>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div style={{
            background: T.bgPanel, borderRadius: T.radius,
            border: `1px solid ${T.border}`, boxShadow: T.shadow,
            overflow: "hidden",
          }}>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {items.map(item => (
                <ItemRow key={item.id} item={item} userId={user.uid} listId={selectedList.id} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}

/* ── Dashboard ─────────────────────────────────────────────────────────────── */
export default function Dashboard({ user }) {
  const [lists,          setLists]          = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const selectedList = lists.find(l => l.id === selectedListId) ?? null;

  useEffect(() => {
    const q = query(
      collection(db, "users", user.uid, "lists"),
      orderBy("createdAt", "asc")
    );
    const unsub = onSnapshot(q, snap => {
      const fetched = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setLists(fetched);
      setSelectedListId(prev => {
        if (prev && fetched.find(l => l.id === prev)) return prev;
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

  const handleSignOut = () => signOut(auth);

  return (
    <div style={{
      display: "flex", height: "100vh", overflow: "hidden",
      background: T.bg,
      fontFamily: "-apple-system,'SF Pro Display','Helvetica Neue',Arial,sans-serif",
    }}>
      {/* Spinner keyframes */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Mobile top bar */}
      <div
        className="md:hidden"
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 20,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px",
          background: T.bgPanel, borderBottom: `1px solid ${T.border}`,
        }}
      >
        <span style={{ fontWeight: 800, fontSize: "20px", letterSpacing: "-0.03em", color: T.text1 }}>
          Next<span style={{ color: T.accent }}>Up</span>
        </span>
        <button
          onClick={() => setMobileMenuOpen(true)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: T.text2, padding: "4px", display: "flex", alignItems: "center",
          }}
        >
          <IconMenu />
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

      {/* Main area: push right of sidebar on desktop */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column", minWidth: 0,
        overflow: "hidden",
      }}
        className="md:ml-[264px] mt-[54px] md:mt-0"
      >
        <MainContent user={user} selectedList={selectedList} />
      </div>
    </div>
  );
}
