import React, { useEffect, useState } from "react";




import Navbar from "./components/Navbar";
import ProfileCard from "./components/ProfileCard";
import Avatar from "./components/Avatar";

import EditProfileForm from "./components/EditProfileForm";
import { fetchProfileApi, updateProfileApi } from "../../api/profileApi";
import ProfileDetails from "./components/ProfileDetails";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetch profile
  const getProfile = async () => {
    try {
      const data = await fetchProfileApi();
      setProfile(data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  // update profile
  const handleUpdate = async (updatedData) => {
    try {
      const updatedUser = await updateProfileApi(updatedData);

      setProfile(updatedUser);

      alert("Profile updated successfully");
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div>
      <Navbar />

      <div className="container mt-4">
        <div className="row">

          {/* LEFT SIDE */}
          <div className="col-md-4">
            <ProfileCard user={profile} />
            <Avatar user={profile} />
          </div>

          {/* RIGHT SIDE */}
          <div className="col-md-8">
            <ProfileDetails user={profile} />

            <div className="mt-4">
              <EditProfileForm
                user={profile}
                onUpdate={handleUpdate}
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;