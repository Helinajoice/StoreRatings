import React, { useEffect, useState } from "react";
import "../styles/AdminDashboard.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { API_BASE } from "../config";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({
    users: 0,
    stores: 0,
    ratings: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (role !== "ADMIN") {
      navigate("/home");
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/admin/stats`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) {
          console.error(data.message || "Failed to load stats");
          return;
        }

        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate, role, token]);

  return (
    <>
      <Navbar />

      <div className="admin-dashboard">
        <h2>System Administrator Dashboard</h2>

        {loading ? (
          <p>Loading statistics...</p>
        ) : (
          <div className="stats-container">
            <div
              className="stat-card"
              onClick={() => navigate("/admin/users")}
              style={{ cursor: "pointer" }}
            >
              <h3>Total Users</h3>
              <p>{stats.users}</p>
            </div>

            <div
              className="stat-card"
              onClick={() => navigate("/admin/stores")}
              style={{ cursor: "pointer" }}
            >
              <h3>Total Stores</h3>
              <p>{stats.stores}</p>
            </div>

            <div
              className="stat-card"
              onClick={() => navigate("/admin/ratings")}
              style={{ cursor: "pointer" }}
            >
              <h3>Total Ratings</h3>
              <p>Click to View Ratings</p>
            </div>

            <div
              className="stat-card"
              onClick={() => navigate("/admin/approvals")}
              style={{ cursor: "pointer" }}
            >
              <h3>Approval List</h3>
              <p>View pending owners</p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default AdminDashboard;
