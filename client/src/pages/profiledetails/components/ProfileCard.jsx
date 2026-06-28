// ─── ProfileCard.jsx ──────────────────────────────────────────────────────────
import React from "react";
import Avatar from "./Avatar";

/* ── Skeleton shimmer ─────────────────────────────────────────────────────── */
const shimmer = {
  background: "linear-gradient(90deg, #f0ebff 25%, #e4daff 50%, #f0ebff 75%)",
  backgroundSize: "200% 100%",
  animation: "profileShimmer 1.4s infinite linear",
  borderRadius: 8,
};

const SkeletonBlock = ({ w = "100%", h = 14, r = 8, style = {} }) => (
  <div style={{ ...shimmer, width: w, height: h, borderRadius: r, ...style }} />
);

export const ProfileCardSkeleton = () => (
  <>
    <style>{`
      @keyframes profileShimmer {
        0%   { background-position: 200% 0 }
        100% { background-position: -200% 0 }
      }
    `}</style>
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: 28,
        border: "1px solid #ede9fe",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
      }}
    >
      {/* Avatar placeholder */}
      <div style={{ ...shimmer, width: 80, height: 80, borderRadius: "50%" }} />
      {/* Name */}
      <SkeletonBlock w="60%" h={20} />
      {/* Role */}
      <SkeletonBlock w="40%" h={14} />
      {/* Divider */}
      <div style={{ width: "100%", height: 1, background: "#f3f4f6" }} />
      {/* Chips */}
      <SkeletonBlock h={42} r={8} />
      <SkeletonBlock h={42} r={8} />
      {/* Button */}
      <SkeletonBlock h={42} r={10} style={{ marginTop: 4 }} />
    </div>
  </>
);

/* ── Info chip ────────────────────────────────────────────────────────────── */
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
      overflow: "hidden",
    }}
  >
    <span style={{ flexShrink: 0 }}>{icon}</span>
    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
      {value}
    </span>
  </div>
);

/* ── Component ────────────────────────────────────────────────────────────── */
/**
 * Props:
 *   user    {object|null}  – null triggers skeleton
 *   onEdit  {function}
 */
const ProfileCard = ({ user, onEdit }) => {
  if (!user) return <ProfileCardSkeleton />;

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
        transition: "box-shadow 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 12px 48px rgba(124,58,237,0.13)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 4px 24px rgba(124,58,237,0.07)")}
    >
      <Avatar name={user?.name || "U"} size={80} />

      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: "'Syne', sans-serif",
            fontWeight: 800,
            fontSize: 20,
            color: "#1e1b4b",
            letterSpacing: "-0.02em",
          }}
        >
          {user?.name || "No Name"}
        </div>
        <div style={{ fontSize: 13, color: "#7c3aed", fontWeight: 600, marginTop: 2 }}>
          {user?.role || "Member"}
        </div>
      </div>

      <div
        style={{
          width: "100%",
          borderTop: "1px solid #f3f4f6",
          paddingTop: 14,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <InfoChip icon="✉️" value={user?.email || "No Email"} />
        {user?.joined && <InfoChip icon="📅" value={`Joined ${user.joined}`} />}
        {/* _id chip removed intentionally */}
      </div>

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
          marginTop: 4,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#6d28d9")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#7c3aed")}
      >
        ✏️ Edit Profile
      </button>
    </div>
  );
};

export default ProfileCard;