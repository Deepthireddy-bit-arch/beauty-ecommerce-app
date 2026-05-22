// ─── ProfileDetails.jsx ───────────────────────────────────────────────────────

import React from "react";

const DetailTile = ({ icon, label, value }) => (
  <div
    style={{
      background: "#faf5ff",
      borderRadius: 12,
      padding: "14px 16px",
      border: "1px solid #ede9fe"
    }}
  >
    <div
      style={{
        fontSize: 11,
        fontWeight: 600,
        color: "#7c3aed",
        textTransform: "uppercase",
        letterSpacing: "0.07em",
        marginBottom: 4
      }}
    >
      {icon} {label}
    </div>

    <div
      style={{
        fontSize: 15,
        fontWeight: 600,
        color: "#1e1b4b",
        wordBreak: "break-all"
      }}
    >
      {value}
    </div>
  </div>
);

/**
 * Props:
 *   user {object}
 */

const ProfileDetails = ({ user }) => {

  // Prevent crash before API loads
  if (!user) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: 32,
          border: "1px solid #ede9fe",
          textAlign: "center"
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
        padding: 32,
        boxShadow: "0 4px 24px rgba(124,58,237,0.07)",
        border: "1px solid #ede9fe",
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
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24
        }}
      >
        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 18,
            color: "#1e1b4b",
            margin: 0
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
            border: "1px solid #bbf7d0"
          }}
        >
          ● Active
        </span>
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16
        }}
      >
        <DetailTile
          icon="👤"
          label="Full Name"
          value={user?.name || "No Name"}
        />

        <DetailTile
          icon="✉️"
          label="Email Address"
          value={user?.email || "No Email"}
        />

        <DetailTile
          icon="🏷️"
          label="Role"
          value={user?.role || "Member"}
        />

        <DetailTile
          icon="📅"
          label="Member Since"
          value={user?.joined || "—"}
        />
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
          gap: 10
        }}
      >
        <span style={{ fontSize: 20 }}>🔒</span>

        <div>
          <div
            style={{
              fontWeight: 600,
              fontSize: 13,
              color: "#1e1b4b"
            }}
          >
            Password Protected
          </div>

          <div
            style={{
              fontSize: 12,
              color: "#6b7280"
            }}
          >
            Your account is secured with a password
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;