// ─── Navbar.jsx ───────────────────────────────────────────────────────────────
import React from "react";
import Avatar from "./Avatar";

/**
 * Top navigation bar.
 * Props:
 *   user {object|null} – current user (for avatar + name)
 */
const Navbar = ({ user }) => (
  <nav
    style={{
      background: "#fff",
      borderBottom: "1px solid #ede9fe",
      padding: "0 32px",
      display: "flex",
      alignItems: "center",
      height: 60,
      gap: 12,
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}
  >
    {/* Logo mark */}
    <div
      style={{
        width: 30,
        height: 30,
        borderRadius: 8,
        background: "linear-gradient(135deg, #7c3aed, #a855f7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span style={{ color: "#fff", fontSize: 15, fontWeight: 800 }}>P</span>
    </div>

    {/* Brand name */}
    <span
      style={{
        fontFamily: "'Syne', sans-serif",
        fontWeight: 800,
        fontSize: 17,
        color: "#1e1b4b",
        letterSpacing: "-0.02em",
      }}
    >
      ProfileHub
    </span>

    {/* Right section */}
    {user && (
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Avatar name={user.name} size={32} />
        <span style={{ fontSize: 14, color: "#6b7280", fontWeight: 500 }}>
          {user.name}
        </span>
      </div>
    )}
  </nav>
);

export default Navbar;