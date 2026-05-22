// profileApi.js

const BASE_URL = "http://localhost:5000/api";

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`
});

// ── GET PROFILE ─────────────────────────────────────
export const fetchProfileApi = async () => {
  const res = await fetch(`${BASE_URL}/user/profile`, {
    method: "GET",
    headers: authHeaders()
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch profile");
  }

  return data.user;
};

// ── UPDATE PROFILE ──────────────────────────────────
export const updateProfileApi = async ({ name, email }) => {
  const res = await fetch(`${BASE_URL}/user/profile`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ name, email })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to update profile");
  }

  return data.user;
};