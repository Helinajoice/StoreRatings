import React, { useEffect, useState } from "react";
import "../styles/UserDashboard.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config";

const UserDashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/user/me`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) {
          console.error(data.message || "Failed to load profile");
          setError(data.message || "Failed to load profile");
          return;
        }

        setUser(data);
      } catch (err) {
        console.error("Failed to fetch profile", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, token]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="user-dashboard">
          <h2>User Dashboard</h2>
          <p>Loading profile...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="user-dashboard">
          <h2>User Dashboard</h2>
          <p>{error || "Unable to load profile."}</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="user-dashboard">
        <h2>User Dashboard</h2>

        <div className="card">
          <h3>Profile Information</h3>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>

        <div className="card">
          <h3>Quick Links</h3>
          <div className="quick-links">
            <button onClick={() => navigate("/stores")}>
      Browse Stores
    </button>
            <button onClick={() => navigate("/my-ratings")}>My Ratings</button>

          </div>
        </div>

        <div className="card">
          <h3>Security</h3>
          <p>You can update your password from the dedicated page.</p>
          <button onClick={() => navigate("/update-password")}>
            Go to Update Password
          </button>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default UserDashboard;
