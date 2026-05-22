// ─── ProfileCard.jsx ──────────────────────────────────────────────────────────

import React from "react";
import Avatar from "./Avatar";

const InfoChip = ({ icon, value }) => (
  <div
    style={{
      background: "#f5f3ff",
      border: "1px solid #ede9fe",
      borderRadius: 8,
      padding: "10px 14px",
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontFamily: "'DM Sans', sans-serif",
      color: "#4c1d95",
      fontSize: 14,
      overflow: "hidden"
    }}
  >
    <span>{icon}</span>

    <span
      style={{
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }}
    >
      {value}
    </span>
  </div>
);

/**
 * Props:
 *   user       {object}
 *   onEdit     {function}
 */

const ProfileCard = ({ user, onEdit }) => {
  // Prevent crash before API loads
  if (!user) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: 28,
          textAlign: "center",
          border: "1px solid #ede9fe"
        }}
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: 28,
        boxShadow: "0 4px 24px rgba(124,58,237,0.07)",
        border: "1px solid #ede9fe",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        height: "fit-content",
        transition: "box-shadow 0.2s"
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow =
          "0 12px 48px rgba(124,58,237,0.13)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow =
          "0 4px 24px rgba(124,58,237,0.07)")
      }
    >
      {/* Avatar */}
      <Avatar name={user?.name || "U"} size={80} />

      {/* Name + role */}
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 20,
            color: "#1e1b4b",
            letterSpacing: "-0.02em"
          }}
        >
          {user?.name || "No Name"}
        </div>

        <div
          style={{
            fontSize: 13,
            color: "#7c3aed",
            fontWeight: 600,
            marginTop: 2
          }}
        >
          {user?.role || "Member"}
        </div>
      </div>

      {/* Quick chips */}
      <div
        style={{
          width: "100%",
          borderTop: "1px solid #f3f4f6",
          paddingTop: 14,
          display: "flex",
          flexDirection: "column",
          gap: 8
        }}
      >
        <InfoChip
          icon="✉️"
          value={user?.email || "No Email"}
        />

        {user?.joined && (
          <InfoChip
            icon="📅"
            value={`Joined ${user.joined}`}
          />
        )}

        {user?._id && (
          <InfoChip
            icon="🔑"
            value={user._id}
          />
        )}
      </div>

      {/* Edit button */}
      <button
        onClick={onEdit}
        style={{
          width: "100%",
          background: "#7c3aed",
          color: "#fff",
          border: "none",
          borderRadius: 10,
          padding: "11px 0",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 600,
          fontSize: 14,
          cursor: "pointer",
          transition: "background 0.2s",
          marginTop: 4
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "#6d28d9")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "#7c3aed")
        }
      >
        ✏️ Edit Profile
      </button>
    </div>
  );
};

export default ProfileCard;