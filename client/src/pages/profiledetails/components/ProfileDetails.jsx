// ─── ProfileDetails.jsx ───────────────────────────────────────────────────────
// Account Details panel.
// When `editing` is true it renders inline edit fields instead of read tiles.

import React, { useState, useEffect } from "react";

/* ── Shared shimmer keyframes (injected once) ─────────────────────────────── */
const SHIMMER_CSS = `
  @keyframes profileShimmer {
    0%   { background-position: 200% 0 }
    100% { background-position: -200% 0 }
  }
`;

const shimmerStyle = {
  background: "linear-gradient(90deg, #f0ebff 25%, #e4daff 50%, #f0ebff 75%)",
  backgroundSize: "200% 100%",
  animation: "profileShimmer 1.4s infinite linear",
};

const SkeletonBlock = ({ w = "100%", h = 14, r = 8, style = {} }) => (
  <div style={{ ...shimmerStyle, width: w, height: h, borderRadius: r, ...style }} />
);

/* ── Skeleton ─────────────────────────────────────────────────────────────── */
export const ProfileDetailsSkeleton = () => (
  <>
    <style>{SHIMMER_CSS}</style>
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: 32,
        border: "1px solid #ede9fe",
      }}
    >
      {/* Header row */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <SkeletonBlock w={140} h={22} />
        <SkeletonBlock w={60} h={22} r={20} />
      </div>

      {/* Tile grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            style={{
              background: "#faf5ff",
              borderRadius: 12,
              padding: "14px 16px",
              border: "1px solid #ede9fe",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <SkeletonBlock w="50%" h={11} />
            <SkeletonBlock w="80%" h={16} />
          </div>
        ))}
      </div>

      {/* Security bar */}
      <div
        style={{
          marginTop: 24,
          borderRadius: 12,
          padding: "14px 18px",
          border: "1px solid #ede9fe",
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}
      >
        <SkeletonBlock w={40} h={40} r={20} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          <SkeletonBlock w="40%" h={13} />
          <SkeletonBlock w="65%" h={12} />
        </div>
      </div>
    </div>
  </>
);

/* ── Read-only tile ───────────────────────────────────────────────────────── */
const DetailTile = ({ icon, label, value }) => (
  <div
    style={{
      background: "#faf5ff",
      borderRadius: 12,
      padding: "14px 16px",
      border: "1px solid #ede9fe",
    }}
  >
    <div
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: "#7c3aed",
        textTransform: "uppercase",
        letterSpacing: "0.07em",
        marginBottom: 4,
      }}
    >
      {icon} {label}
    </div>
    <div style={{ fontSize: 15, fontWeight: 600, color: "#1e1b4b", wordBreak: "break-all" }}>
      {value}
    </div>
  </div>
);

/* ── Inline edit field ────────────────────────────────────────────────────── */
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

const EditField = ({ label, icon, children }) => (
  <div>
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

/* ── Component ────────────────────────────────────────────────────────────── */
/**
 * Props:
 *   user     {object|null}   – null triggers skeleton
 *   editing  {boolean}       – controlled by parent
 *   saving   {boolean}       – shows spinner on Save button
 *   onSave   {function}      – called with { name, email }
 *   onCancel {function}
 */
const ProfileDetails = ({ user, editing, saving, onSave, onCancel }) => {
  const [form, setForm] = useState({ name: "", email: "" });

  // Seed / re-seed whenever user changes
  useEffect(() => {
    if (user) setForm({ name: user.name || "", email: user.email || "" });
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

  /* skeleton */
  if (!user) return <ProfileDetailsSkeleton />;

  /* ── Edit mode ─────────────────────────────────────────────────────────── */
  if (editing) {
    return (
      <>
        <style>{`
          @keyframes spin { to { transform: rotate(360deg) } }
          ${SHIMMER_CSS}
        `}</style>
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
              Edit Account Details
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <EditField label="Full Name" icon="👤">
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
              </EditField>

              <EditField label="Email Address" icon="✉️">
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
              </EditField>
            </div>

            {/* Read-only tiles for role + joined */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
              <DetailTile icon="🏷️" label="Role" value={user?.role || "Member"} />
              <DetailTile icon="📅" label="Member Since" value={user?.joined || "—"} />
            </div>

            {/* Info banner */}
            <div
              style={{
                background: "#faf5ff",
                borderRadius: 10,
                padding: "12px 14px",
                marginBottom: 20,
                fontSize: 13,
                color: "#7c3aed",
                display: "flex",
                gap: 8,
              }}
            >
              <span>ℹ️</span>
              <span>
                Only <strong>name</strong> and <strong>email</strong> can be updated via this form.
              </span>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: 12 }}>
              <button
                type="submit"
                disabled={saving}
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
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.7 : 1,
                  transition: "background 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
                onMouseEnter={(e) => { if (!saving) e.currentTarget.style.background = "#6d28d9"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#7c3aed"; }}
              >
                {saving ? <><Spinner /> Saving…</> : "💾 Save Changes"}
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
      </>
    );
  }

  /* ── Read mode ─────────────────────────────────────────────────────────── */
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: 32,
        boxShadow: "0 4px 24px rgba(124,58,237,0.07)",
        border: "1px solid #ede9fe",
        transition: "box-shadow 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 12px 48px rgba(124,58,237,0.13)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 4px 24px rgba(124,58,237,0.07)")}
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
          Account Details
        </h2>
        <span
          style={{
            background: "#f0fdf4",
            color: "#16a34a",
            fontSize: 12,
            fontWeight: 600,
            padding: "4px 10px",
            borderRadius: 20,
            border: "1px solid #bbf7d0",
          }}
        >
          ● Active
        </span>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <DetailTile icon="👤" label="Full Name"     value={user?.name   || "No Name"} />
        <DetailTile icon="✉️" label="Email Address" value={user?.email  || "No Email"} />
        <DetailTile icon="🏷️" label="Role"          value={user?.role   || "Member"} />
        <DetailTile icon="📅" label="Member Since"  value={user?.joined || "—"} />
      </div>

      {/* Security note */}
      <div
        style={{
          marginTop: 24,
          padding: "14px 18px",
          background: "linear-gradient(90deg,#f5f3ff,#faf5ff)",
          borderRadius: 12,
          border: "1px solid #ede9fe",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span style={{ fontSize: 20 }}>🔒</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: 13, color: "#1e1b4b" }}>Password Protected</div>
          <div style={{ fontSize: 12, color: "#6b7280" }}>Your account is secured with a password</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;