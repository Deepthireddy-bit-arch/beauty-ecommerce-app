// ─── ProfilePage.jsx ──────────────────────────────────────────────────────────
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector }   from "react-redux";

import ProfileCard    from "../../pages/profiledetails/components/ProfileCard";
import ProfileDetails from "../../pages/profiledetails/components/ProfileDetails";
import "./profile.css";
import { clearProfileErrors, fetchProfile, updateProfile } from "../../redux/slices/profileSlice";

const ProfilePage = () => {
  const dispatch = useDispatch();

  const { user, fetchLoading, saveLoading, saveError } = useSelector(
    (s) => s.profile
  );

  const [editing, setEditing] = useState(false);

  /* Fetch on mount */
  useEffect(() => {
    dispatch(fetchProfile());
    return () => dispatch(clearProfileErrors());
  }, [dispatch]);

  const handleEdit   = () => setEditing(true);
  const handleCancel = () => { setEditing(false); dispatch(clearProfileErrors()); };

  const handleSave = async (payload) => {
    const result = await dispatch(updateProfile(payload));
    if (updateProfile.fulfilled.match(result)) {
      setEditing(false);
    }
  };

  /* While first fetch is in flight show skeleton (user === null) */
  const displayUser = fetchLoading && !user ? null : user;

  return (
    <main className="profile-page">
        <div className="profile-layout-wrap">
      <h1 className="profile-page-title">My Profile</h1>

      {/* Global save error toast */}
      {saveError && (
        <div
          style={{
            marginBottom: 20,
            padding: "12px 18px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 12,
            color: "#dc2626",
            fontSize: 14,
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500,
          }}
        >
          ⚠️ {saveError}
        </div>
      )}

      <div className="profile-layout">
        {/* Left: avatar card */}
        <ProfileCard user={displayUser} onEdit={handleEdit} />

        {/* Right: account details / inline edit */}
        <ProfileDetails
          user={displayUser}
          editing={editing}
          saving={saveLoading}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
      </div>
    </main>
  );
};

export default ProfilePage;