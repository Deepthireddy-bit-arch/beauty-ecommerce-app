// ─── EditProfileForm.jsx ──────────────────────────────────────────────────────
// Right panel — form to update name and email.

import React, { useState, useEffect } from "react";

const inputBase = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: 10,
  border: "1.5px solid #e5e7eb",
  fontSize: 15,
  fontFamily: "'DM Sans', sans-serif",
  outline: "none",
  background: "#fafafa",
  color: "#1e1b4b",
  boxSizing: "border-box",
  transition: "border 0.2s, background 0.2s",
};

const Field = ({ label, icon, children }) => (
  <div style={{ marginBottom: 20 }}>
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "#7c3aed",
        marginBottom: 6,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <span>{icon}</span>
      {label}
    </label>
    {children}
  </div>
);

const Spinner = () => (
  <div
    style={{
      width: 16,
      height: 16,
      border: "2px solid rgba(255,255,255,0.4)",
      borderTop: "2px solid #fff",
      borderRadius: "50%",
      animation: "spin 0.7s linear infinite",
    }}
  />
);

/**
 * Props:
 *   user      {object}   – current user (seeds initial form values)
 *   loading   {boolean}  – shows spinner on submit button
 *   onSave    {function} – called with { name, email }
 *   onCancel  {function}
 */
const EditProfileForm = ({ user, loading, onSave, onCancel }) => {
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "" });

  // Re-seed if user prop changes (e.g. after a successful save)
  useEffect(() => {
    if (user) setForm({ name: user.name, email: user.email });
  }, [user]);

  const handleFocus = (e) => {
    e.target.style.border = "1.5px solid #7c3aed";
    e.target.style.background = "#fff";
  };
  const handleBlur = (e) => {
    e.target.style.border = "1.5px solid #e5e7eb";
    e.target.style.background = "#fafafa";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    onSave(form);
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: 32,
        boxShadow: "0 4px 24px rgba(124,58,237,0.07)",
        border: "1px solid #ede9fe",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 18,
            color: "#1e1b4b",
            margin: 0,
          }}
        >
          Edit Profile
        </h2>
        <button
          onClick={onCancel}
          style={{
            background: "none",
            border: "none",
            color: "#6b7280",
            cursor: "pointer",
            fontSize: 22,
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <Field label="Full Name" icon="👤">
          <input
            type="text"
            value={form.name}
            placeholder="Enter your full name"
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={inputBase}
            required
          />
        </Field>

        <Field label="Email Address" icon="✉️">
          <input
            type="email"
            value={form.email}
            placeholder="Enter your email"
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={inputBase}
            required
          />
        </Field>

        {/* Info banner */}
        <div
          style={{
            background: "#faf5ff",
            borderRadius: 10,
            padding: "12px 14px",
            marginBottom: 24,
            fontSize: 13,
            color: "#7c3aed",
            display: "flex",
            gap: 8,
          }}
        >
          <span>ℹ️</span>
          <span>
            Only <strong>name</strong> and <strong>email</strong> can be
            updated via this form.
          </span>
        </div>

        {/* Action row */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              background: "#7c3aed",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "12px 0",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: 15,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "background 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#6d28d9"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#7c3aed"; }}
          >
            {loading ? (
              <>
                <Spinner /> Saving…
              </>
            ) : (
              "💾 Save Changes"
            )}
          </button>

          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              background: "#fff",
              color: "#6b7280",
              border: "1.5px solid #e5e7eb",
              borderRadius: 10,
              padding: "12px 0",
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
              fontSize: 15,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f3ff")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;