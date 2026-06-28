// ─── EditProfileForm.jsx ──────────────────────────────────────────────────────
import React, { useState, useEffect } from "react";

/* ── Spinner ──────────────────────────────────────────────────────────────── */
const Spinner = () => (
  <>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <div style={{
      width: 16, height: 16,
      border: "2px solid rgba(255,255,255,0.4)",
      borderTop: "2px solid #fff",
      borderRadius: "50%",
      animation: "spin 0.7s linear infinite",
      flexShrink: 0,
    }} />
  </>
);

/* ── Tick badge ───────────────────────────────────────────────────────────── */
const ChangedBadge = () => (
  <span style={{
    marginLeft: "auto",
    display: "inline-flex", alignItems: "center", gap: 3,
    fontSize: 10, fontWeight: 700,
    color: "#059669",
    background: "#ecfdf5",
    border: "1px solid #a7f3d0",
    padding: "1px 7px",
    borderRadius: 20,
    letterSpacing: "0.02em",
    flexShrink: 0,
  }}>
    ✓ Changed
  </span>
);

/* ── Read-only tag ────────────────────────────────────────────────────────── */
const ReadOnlyTag = () => (
  <span style={{
    marginLeft: "auto",
    fontSize: 10, fontWeight: 600,
    color: "#d1d5db",
    background: "#f3f4f6",
    border: "1px solid #e5e7eb",
    padding: "1px 7px",
    borderRadius: 20,
    flexShrink: 0,
  }}>
    Read-only
  </span>
);

/* ── Label ────────────────────────────────────────────────────────────────── */
const FieldLabel = ({ icon, text, changed, readOnly }) => (
  <label style={{
    display: "flex", alignItems: "center", gap: 5,
    fontSize: 11, fontWeight: 700,
    letterSpacing: "0.1em", textTransform: "uppercase",
    color: readOnly ? "#9ca3af" : "#7c3aed",
    marginBottom: 6,
    fontFamily: "'DM Sans', sans-serif",
    width: "100%",
  }}>
    <span style={{ fontSize: 13 }}>{icon}</span>
    {text}
    {changed && <ChangedBadge />}
    {readOnly && <ReadOnlyTag />}
  </label>
);

/* ── Main component ───────────────────────────────────────────────────────── */
const EditProfileForm = ({ user, loading, onSave, onCancel }) => {
  const [form, setForm]       = useState({ name: user?.name || "", email: user?.email || "" });
  const [focused, setFocused] = useState({ name: false, email: false });
  const [changed, setChanged] = useState({ name: false, email: false });

  /* Re-seed when user prop updates (after successful save) */
  useEffect(() => {
    if (user) {
      setForm({ name: user.name || "", email: user.email || "" });
      setChanged({ name: false, email: false });
    }
  }, [user]);

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setChanged((c) => ({ ...c, [field]: value !== (user?.[field] || "") }));
  };

  const hasChanges = changed.name || changed.email;

  /* ── Dynamic input style ── */
  const inputStyle = (field) => ({
    width: "100%",
    padding: "11px 14px",
    borderRadius: 10,
    fontSize: 15,
    fontFamily: "'DM Sans', sans-serif",
    outline: "none",
    color: "#1e1b4b",
    boxSizing: "border-box",
    transition: "border 0.2s, background 0.2s, box-shadow 0.2s",
    /* Priority: changed (green) > focused (purple) > default (gray) */
    border: changed[field]
      ? "1.5px solid #059669"
      : focused[field]
        ? "1.5px solid #7c3aed"
        : "1.5px solid #e5e7eb",
    background: focused[field] ? "#faf5ff" : "#fafafa",
    boxShadow: focused[field]
      ? changed[field]
        ? "0 0 0 3px rgba(5,150,105,0.1)"
        : "0 0 0 3px rgba(124,58,237,0.1)"
      : "none",
  });

  const readOnlyStyle = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 10,
    fontSize: 15,
    fontFamily: "'DM Sans', sans-serif",
    color: "#9ca3af",
    background: "#f9fafb",
    border: "1.5px solid #f3f4f6",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    cursor: "not-allowed",
    userSelect: "none",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !hasChanges) return;
    onSave(form);
  };

  return (
    <div style={{
      background: "#fff",
      borderRadius: 20,
      padding: 32,
      boxShadow: "0 4px 24px rgba(124,58,237,0.07)",
      border: "1px solid #ede9fe",
    }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: 18, color: "#1e1b4b", margin: "0 0 6px",
          }}>
            Edit Account Details
          </h2>
          {/* Unsaved changes pill */}
          <div style={{ height: 22 }}>
            {hasChanges && (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                fontSize: 11, fontWeight: 600,
                color: "#7c3aed", background: "#f5f3ff",
                border: "1px solid #ddd6fe",
                padding: "2px 10px", borderRadius: 20,
                animation: "fadeIn 0.2s ease",
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#7c3aed", display: "inline-block",
                }} />
                Unsaved changes
              </span>
            )}
          </div>
        </div>
        <button onClick={onCancel} style={{
          background: "none", border: "none",
          color: "#9ca3af", cursor: "pointer",
          fontSize: 22, lineHeight: 1, padding: "2px 4px",
          borderRadius: 6, transition: "color 0.15s",
        }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#1e1b4b")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
        >
          ×
        </button>
      </div>

      <style>{`@keyframes fadeIn { from { opacity:0; transform:translateY(-4px) } to { opacity:1; transform:translateY(0) } }`}</style>

      <form onSubmit={handleSubmit}>

        {/* ── Editable fields row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>

          {/* Full Name */}
          <div>
            <FieldLabel icon="👤" text="Full Name" changed={changed.name} />
            <input
              type="text"
              value={form.name}
              placeholder="Enter your full name"
              onChange={(e) => handleChange("name", e.target.value)}
              onFocus={() => setFocused((f) => ({ ...f, name: true }))}
              onBlur={() => setFocused((f) => ({ ...f, name: false }))}
              style={inputStyle("name")}
              required
            />
          </div>

          {/* Email */}
          <div>
            <FieldLabel icon="✉️" text="Email Address" changed={changed.email} />
            <input
              type="email"
              value={form.email}
              placeholder="Enter your email"
              onChange={(e) => handleChange("email", e.target.value)}
              onFocus={() => setFocused((f) => ({ ...f, email: true }))}
              onBlur={() => setFocused((f) => ({ ...f, email: false }))}
              style={inputStyle("email")}
              required
            />
          </div>
        </div>

        {/* ── Read-only fields row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>

          {/* Role */}
          <div>
            <FieldLabel icon="🔑" text="Role" readOnly />
            <div style={readOnlyStyle}>{user?.role || "Member"}</div>
          </div>

          {/* Member Since */}
          <div>
            <FieldLabel icon="📅" text="Member Since" readOnly />
            <div style={readOnlyStyle}>{user?.joined || "—"}</div>
          </div>
        </div>

        {/* ── Info banner ── */}
        <div style={{
          background: "#faf5ff", borderRadius: 10,
          padding: "10px 14px", marginBottom: 24,
          fontSize: 13, color: "#7c3aed",
          display: "flex", gap: 8, alignItems: "center",
          border: "1px solid #ede9fe",
        }}>
          <span style={{ flexShrink: 0 }}>ℹ️</span>
          <span>Only <strong>name</strong> and <strong>email</strong> can be updated via this form.</span>
        </div>

        {/* ── Actions ── */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="submit"
            disabled={loading || !hasChanges}
            style={{
              flex: 1,
              background: hasChanges ? "#7c3aed" : "#e5e7eb",
              color: hasChanges ? "#fff" : "#9ca3af",
              border: "none", borderRadius: 10,
              padding: "12px 0",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600, fontSize: 15,
              cursor: (loading || !hasChanges) ? "not-allowed" : "pointer",
              opacity: loading ? 0.75 : 1,
              transition: "background 0.2s, color 0.2s",
              display: "flex", alignItems: "center",
              justifyContent: "center", gap: 8,
            }}
            onMouseEnter={(e) => { if (hasChanges && !loading) e.currentTarget.style.background = "#6d28d9"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = hasChanges ? "#7c3aed" : "#e5e7eb"; }}
          >
            {loading
              ? <><Spinner /> Saving…</>
              : hasChanges
                ? "💾 Save Changes"
                : "No Changes Yet"
            }
          </button>

          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1, background: "#fff", color: "#6b7280",
              border: "1.5px solid #e5e7eb", borderRadius: 10,
              padding: "12px 0",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600, fontSize: 15,
              cursor: "pointer", transition: "background 0.2s, border-color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#f5f3ff";
              e.currentTarget.style.borderColor = "#c4b5fd";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.borderColor = "#e5e7eb";
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;