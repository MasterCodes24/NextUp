import React, { useEffect, useState, useRef } from "react";
import { signOut } from "firebase/auth";
import {
  collection, addDoc, deleteDoc, updateDoc, doc,
  onSnapshot, serverTimestamp, query, orderBy,
} from "firebase/firestore";
import { auth, db } from "../firebase";

const T = {
  bg:        "#F2F2F7",
  panel:     "#FFFFFF",
  border:    "rgba(0,0,0,0.08)",
  text1:     "#1C1C1E",
  text2:     "#3A3A3C",
  text3:     "#636366",
  text4:     "#AEAEB2",
  accent:    "#FF6B00",
  accentLt:  "rgba(255,107,0,0.10)",
  accentHov: "#E05E00",
  green:     "#34C759",
  red:       "#FF3B30",
  redLt:     "rgba(255,59,48,0.10)",
  sidebar:   260,
  shadow:    "0 1px 3px rgba(0,0,0,0.08),0 4px 12px rgba(0,0,0,0.05)",
  shadowLg:  "0 8px 32px rgba(0,0,0,0.14),0 2px 8px rgba(0,0,0,0.08)",
};

const IPlus   = ({ s = 16 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
const ITrash  = ({ s = 15 }) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6M9 6V4h6v2" /></svg>;
const ISignOut= () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>;
const IList   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>;
const ICircle = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /></svg>;
const ICheck  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>;
const IClose  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
const IMenu   = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="18" x2="21" y2="18" /></svg>;
const IChev   = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>;

function NewListModal({ onConfirm, onCancel }) {
  const [name, setName] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 50);
  }, []);

  const submit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onConfirm(trimmed);
  };

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px",
        fontFamily: "-apple-system,'Helvetica Neue',Arial,sans-serif",
      }}
    >
      <div style={{
        width: "100%", maxWidth: "400px",
        background: T.panel, borderRadius: "20px",
        boxShadow: T.shadowLg, padding: "32px 28px 28px",
        animation: "modalIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both",
      }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, color: T.text1, marginBottom: "6px", letterSpacing: "-0.02em" }}>
          New Bucket List
        </h2>
        <p style={{ fontSize: "14px", color: T.text3, marginBottom: "20px" }}>
          Give your list a name to get started.
        </p>
        <form onSubmit={submit}>
          <input
            ref={inputRef}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && onCancel()}
            placeholder="e.g. Travel Goals, Career, Fitness…"
            maxLength={60}
            style={{
              width: "100%", padding: "12px 14px", borderRadius: "12px",
              border: `1.5px solid ${name.trim() ? T.accent : "rgba(0,0,0,0.15)"}`,
              background: name.trim() ? T.accentLt : T.bg,
              color: T.text1, fontSize: "15px", outline: "none",
              fontFamily: "inherit", boxSizing: "border-box",
              transition: "border-color 0.15s, background 0.15s",
            }}
            onFocus={(e) => { e.target.style.boxShadow = "0 0 0 3px rgba(255,107,0,0.18)"; }}
            onBlur={(e) => { e.target.style.boxShadow = "none"; }}
          />
          <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                flex: 1, padding: "11px", borderRadius: "12px",
                border: "1.5px solid rgba(0,0,0,0.12)",
                background: "transparent", color: T.text2,
                fontSize: "15px", fontWeight: 600, cursor: "pointer",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = T.bg; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              style={{
                flex: 1, padding: "11px", borderRadius: "12px", border: "none",
                background: name.trim() ? T.accent : "rgba(0,0,0,0.08)",
                color: name.trim() ? "#fff" : T.text4,
                fontSize: "15px", fontWeight: 700,
                cursor: name.trim() ? "pointer" : "not-allowed",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => { if (name.trim()) e.currentTarget.style.background = T.accentHov; }}
              onMouseLeave={(e) => { if (name.trim()) e.currentTarget.style.background = T.accent; }}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Sidebar({ user, lists, selectedListId, onSelectList, onOpenModal, onSignOut, isOpen, onClose, isMobile }) {
  const content = (
    <div style={{
      display: "flex", flexDirection: "column", height: "100%",
      background: T.panel, borderRight: `1px solid ${T.border}`, overflow: "hidden",
      fontFamily: "-apple-system,'Helvetica Neue',Arial,sans-serif",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 20px 14px", flexShrink: 0 }}>
        <span style={{ fontWeight: 800, fontSize: "20px", letterSpacing: "-0.03em", color: T.text1 }}>
          Next<span style={{ color: T.accent }}>Up</span>
        </span>
        {isMobile && (
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: T.text3, padding: "4px", display: "flex", alignItems: "center", borderRadius: "8px" }}
          >
            <IClose />
          </button>
        )}
      </div>

      <div style={{ padding: "0 12px 14px", flexShrink: 0 }}>
        <button
          onClick={onOpenModal}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: "8px",
            padding: "10px 14px", borderRadius: "10px",
            background: T.accent, color: "#fff",
            fontSize: "14px", fontWeight: 600, border: "none", cursor: "pointer",
            boxShadow: "0 4px 12px rgba(255,107,0,0.28)", transition: "background 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = T.accentHov; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = T.accent; }}
        >
          <IPlus /> New Bucket List
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 12px" }}>
        <p style={{
          fontSize: "11px", fontWeight: 700, color: T.text4,
          textTransform: "uppercase", letterSpacing: "0.08em", padding: "2px 8px 8px",
        }}>
          My Lists
        </p>
        {lists.length === 0 && (
          <p style={{ fontSize: "13px", color: T.text4, padding: "4px 8px", fontStyle: "italic" }}>
            No lists yet — create one above!
          </p>
        )}
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "2px" }}>
          {lists.map((list) => {
            const active = selectedListId === list.id;
            return (
              <li key={list.id}>
                <button
                  onClick={() => { onSelectList(list.id); if (isMobile) onClose(); }}
                  style={{
                    width: "100%", display: "flex", alignItems: "center",
                    justifyContent: "space-between", padding: "9px 12px", borderRadius: "10px",
                    background: active ? T.accentLt : "transparent",
                    color: active ? T.accent : T.text2,
                    fontSize: "14px", fontWeight: active ? 600 : 500,
                    border: "none", cursor: "pointer", textAlign: "left",
                    transition: "background 0.12s, color 0.12s",
                  }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = T.bg; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "8px", overflow: "hidden" }}>
                    <span style={{ color: active ? T.accent : T.text4, flexShrink: 0 }}><IList /></span>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{list.name}</span>
                  </span>
                  {active && <span style={{ color: T.accent, flexShrink: 0, marginLeft: "4px" }}><IChev /></span>}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div style={{ padding: "12px 12px 20px", borderTop: `1px solid ${T.border}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", padding: "0 4px" }}>
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName} referrerPolicy="no-referrer"
              style={{ width: "34px", height: "34px", borderRadius: "50%", objectFit: "cover", border: `2px solid ${T.border}` }} />
          ) : (
            <div style={{
              width: "34px", height: "34px", borderRadius: "50%",
              background: T.accentLt, display: "flex", alignItems: "center",
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
            width: "100%", display: "flex", alignItems: "center", justifyContent: "center",
            gap: "7px", padding: "9px 16px", borderRadius: "10px",
            background: "transparent", color: T.text3, fontSize: "13px", fontWeight: 500,
            border: `1.5px solid ${T.border}`, cursor: "pointer", transition: "all 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(255,59,48,0.4)"; e.currentTarget.style.color = T.red; e.currentTarget.style.background = T.redLt; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.text3; e.currentTarget.style.background = "transparent"; }}
        >
          <ISignOut /> Sign Out
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        <div
          onClick={onClose}
          style={{
            position: "fixed", inset: 0, zIndex: 40,
            background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)",
            opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? "auto" : "none",
            transition: "opacity 0.25s ease",
          }}
        />
        <div style={{
          position: "fixed", top: 0, left: 0, bottom: 0,
          width: `${T.sidebar}px`, zIndex: 50,
          transform: isOpen ? "translateX(0)" : `translateX(-${T.sidebar}px)`,
          transition: "transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94)",
          willChange: "transform",
        }}>
          {content}
        </div>
      </>
    );
  }

  return (
    <div style={{ width: `${T.sidebar}px`, flexShrink: 0, height: "100vh", position: "sticky", top: 0 }}>
      {content}
    </div>
  );
}

function ItemRow({ item, onToggle, onDelete }) {
  const [hovered, setHovered] = useState(false);

  return (
    <li
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: "12px",
        padding: "12px 16px", borderBottom: `1px solid ${T.border}`,
        background: hovered ? "#FAFAFA" : "transparent",
        transition: "background 0.12s", listStyle: "none",
      }}
    >
      <button
        onClick={onToggle}
        title={item.completed ? "Mark incomplete" : "Mark complete"}
        style={{
          flexShrink: 0, background: "none", border: "none", cursor: "pointer",
          padding: 0, color: item.completed ? T.green : T.text4,
          display: "flex", alignItems: "center", transition: "color 0.15s",
        }}
      >
        {item.completed ? <ICheck /> : <ICircle />}
      </button>
      <span style={{
        flex: 1, fontSize: "15px", lineHeight: "1.45",
        color: item.completed ? T.text4 : T.text1,
        textDecoration: item.completed ? "line-through" : "none",
        transition: "color 0.2s", wordBreak: "break-word",
      }}>
        {item.text}
      </span>
      <button
        onClick={onDelete}
        title="Delete item"
        style={{
          flexShrink: 0, background: "none", border: "none", cursor: "pointer",
          padding: "4px", color: T.red, borderRadius: "6px",
          display: "flex", alignItems: "center",
          opacity: hovered ? 1 : 0, transition: "opacity 0.15s",
        }}
      >
        <ITrash />
      </button>
    </li>
  );
}

function MainContent({ user, selectedList, onOpenModal, onDeleteList }) {
  const [items,   setItems]   = useState([]);
  const [newText, setNewText] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!selectedList) { setItems([]); return; }
    setLoading(true);
    const itemsRef = collection(db, "users", user.uid, "lists", selectedList.id, "items");
    const q = query(itemsRef, orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));
    return () => unsub();
  }, [selectedList?.id, user.uid]);

  const handleAddItem = async (e) => {
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

  const handleToggleItem = async (item) => {
    await updateDoc(
      doc(db, "users", user.uid, "lists", selectedList.id, "items", item.id),
      { completed: !item.completed }
    );
  };

  const handleDeleteItem = async (itemId) => {
    await deleteDoc(doc(db, "users", user.uid, "lists", selectedList.id, "items", itemId));
  };

  const completed = items.filter((i) => i.completed).length;
  const total     = items.length;
  const pct       = total > 0 ? Math.round((completed / total) * 100) : 0;
  const circ      = 2 * Math.PI * 15;

  if (!selectedList) {
    return (
      <main style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        background: T.bg, textAlign: "center", padding: "40px 24px", overflowY: "auto",
      }}>
        <div style={{
          width: "72px", height: "72px", borderRadius: "20px",
          background: T.panel, border: `1px solid ${T.border}`,
          boxShadow: T.shadow, fontSize: "32px",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "20px",
        }}>📋</div>
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: T.text3, marginBottom: "8px", letterSpacing: "-0.01em" }}>
          No list selected
        </h2>
        <p style={{ fontSize: "15px", color: T.text4, marginBottom: "24px" }}>
          Pick a list from the sidebar or create a new one.
        </p>
        <button
          onClick={onOpenModal}
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "11px 22px", borderRadius: "12px",
            background: T.accent, color: "#fff",
            fontSize: "14px", fontWeight: 600, border: "none", cursor: "pointer",
            boxShadow: "0 4px 16px rgba(255,107,0,0.28)",
          }}
        >
          <IPlus /> Create your first list
        </button>
      </main>
    );
  }

  return (
    <main style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: T.bg, overflow: "hidden" }}>
      <header style={{
        background: T.panel, borderBottom: `1px solid ${T.border}`,
        padding: "20px 24px", display: "flex", alignItems: "flex-start",
        justifyContent: "space-between", flexShrink: 0, gap: "12px",
      }}>
        <div style={{ minWidth: 0 }}>
          <h1 style={{
            fontSize: "clamp(20px,3vw,28px)", fontWeight: 700, color: T.text1,
            letterSpacing: "-0.02em", marginBottom: "4px",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {selectedList.name}
          </h1>
          <p style={{ fontSize: "13px", color: T.text4 }}>
            {total === 0 ? "No items yet" : `${completed} of ${total} completed`}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
          {total > 0 && (
            <div style={{ position: "relative", width: "44px", height: "44px" }}>
              <svg width="44" height="44" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="22" cy="22" r="15" fill="none" stroke={T.bg} strokeWidth="3.5" />
                <circle cx="22" cy="22" r="15" fill="none" stroke={T.green} strokeWidth="3.5"
                  strokeDasharray={`${(completed / total) * circ} ${circ}`}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dasharray 0.5s ease" }}
                />
              </svg>
              <span style={{
                position: "absolute", inset: 0, display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: "10px", fontWeight: 700, color: T.green,
              }}>{pct}%</span>
            </div>
          )}
          <button
            onClick={onDeleteList}
            title="Delete this list"
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: T.text4, padding: "8px", borderRadius: "8px",
              display: "flex", alignItems: "center", transition: "color 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = T.red; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = T.text4; }}
          >
            <ITrash s={17} />
          </button>
        </div>
      </header>

      <div style={{ background: T.panel, borderBottom: `1px solid ${T.border}`, padding: "12px 24px", flexShrink: 0 }}>
        <form onSubmit={handleAddItem} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ color: T.text4, display: "flex", flexShrink: 0 }}><IPlus /></span>
          <input
            ref={inputRef}
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Add a new item…"
            style={{
              flex: 1, fontSize: "15px", color: T.text1,
              background: "transparent", border: "none", outline: "none",
              fontFamily: "inherit", minWidth: 0,
            }}
          />
          <button
            type="submit"
            disabled={!newText.trim()}
            style={{
              padding: "7px 18px", borderRadius: "10px",
              background: newText.trim() ? T.accent : "rgba(0,0,0,0.06)",
              color: newText.trim() ? "#fff" : T.text4,
              fontSize: "13px", fontWeight: 600, border: "none",
              cursor: newText.trim() ? "pointer" : "not-allowed",
              transition: "all 0.15s", flexShrink: 0,
            }}
          >
            Add
          </button>
        </form>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "16px" }}>
        {loading && (
          <div style={{ display: "flex", justifyContent: "center", paddingTop: "48px" }}>
            <div style={{
              width: "22px", height: "22px", borderRadius: "50%",
              border: "2.5px solid rgba(255,107,0,0.2)", borderTopColor: T.accent,
              animation: "spin 0.7s linear infinite",
            }} />
          </div>
        )}
        {!loading && items.length === 0 && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", paddingTop: "64px", textAlign: "center",
          }}>
            <span style={{ fontSize: "40px", marginBottom: "12px" }}>🪣</span>
            <p style={{ fontSize: "15px", color: T.text4 }}>This list is empty. Add your first item above!</p>
          </div>
        )}
        {!loading && items.length > 0 && (
          <div style={{
            background: T.panel, borderRadius: "14px",
            border: `1px solid ${T.border}`, boxShadow: T.shadow, overflow: "hidden",
          }}>
            <ul style={{ padding: 0, margin: 0 }}>
              {items.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  onToggle={() => handleToggleItem(item)}
                  onDelete={() => handleDeleteItem(item.id)}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}

export default function Dashboard({ user }) {
  const [lists,          setLists]          = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);
  const [drawerOpen,     setDrawerOpen]     = useState(false);
  const [showModal,      setShowModal]      = useState(false);
  const [isMobile,       setIsMobile]       = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!isMobile) setDrawerOpen(false);
  }, [isMobile]);

  useEffect(() => {
    const q = query(collection(db, "users", user.uid, "lists"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      const fetched = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setLists(fetched);
      setSelectedListId((prev) => {
        if (prev && fetched.some((l) => l.id === prev)) return prev;
        return fetched[0]?.id ?? null;
      });
    });
    return () => unsub();
  }, [user.uid]);

  const handleCreateList = async (name) => {
    setShowModal(false);
    const ref = await addDoc(
      collection(db, "users", user.uid, "lists"),
      { name, createdAt: serverTimestamp() }
    );
    setSelectedListId(ref.id);
    if (isMobile) setDrawerOpen(false);
  };

  const handleDeleteList = async () => {
    if (!selectedListId) return;
    const list = lists.find((l) => l.id === selectedListId);
    if (!list) return;
    if (!window.confirm(`Delete "${list.name}"? This can't be undone.`)) return;
    await deleteDoc(doc(db, "users", user.uid, "lists", selectedListId));
  };

  const selectedList = lists.find((l) => l.id === selectedListId) ?? null;

  return (
    <div style={{
      display: "flex", height: "100dvh", overflow: "hidden", overflowX: "hidden",
      background: T.bg, fontFamily: "-apple-system,'Helvetica Neue',Arial,sans-serif",
    }}>
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes modalIn { from { opacity:0; transform:scale(0.92) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }
      `}</style>

      <Sidebar
        user={user}
        lists={lists}
        selectedListId={selectedListId}
        onSelectList={setSelectedListId}
        onOpenModal={() => setShowModal(true)}
        onSignOut={() => signOut(auth)}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        isMobile={isMobile}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
        {isMobile && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "13px 18px", background: T.panel,
            borderBottom: `1px solid ${T.border}`, flexShrink: 0,
          }}>
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              style={{ background: "none", border: "none", cursor: "pointer", color: T.text2, padding: "4px", display: "flex", alignItems: "center" }}
            >
              <IMenu />
            </button>
            <span style={{ fontWeight: 800, fontSize: "18px", letterSpacing: "-0.03em", color: T.text1 }}>
              Next<span style={{ color: T.accent }}>Up</span>
            </span>
            <button
              onClick={() => setShowModal(true)}
              aria-label="New list"
              style={{
                background: T.accentLt, border: "none", cursor: "pointer",
                color: T.accent, padding: "7px", display: "flex", alignItems: "center", borderRadius: "9px",
              }}
            >
              <IPlus s={18} />
            </button>
          </div>
        )}

        <MainContent
          user={user}
          selectedList={selectedList}
          onOpenModal={() => setShowModal(true)}
          onDeleteList={handleDeleteList}
        />
      </div>

      {showModal && (
        <NewListModal
          onConfirm={handleCreateList}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
