// ─── Avatar.jsx ───────────────────────────────────────────────────────────────
import React from "react";

/**
 * Renders a circular avatar with the user's initials.
 * Props:
 *   name  {string}  – full name (used to derive initials)
 *   size  {number}  – diameter in px (default 80)
 */
const Avatar = ({ name, size = 80 }) => {
  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #7c3aed, #a855f7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontSize: size * 0.35,
        fontWeight: 700,
        fontFamily: "'DM Sans', sans-serif",
        flexShrink: 0,
        boxShadow: "0 4px 24px rgba(124,58,237,0.35)",
        border: "3px solid #fff",
      }}
    >
      {initials}
    </div>
  );
};

export default Avatar;