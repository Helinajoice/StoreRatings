import React, { useEffect, useState } from "react";
import "../styles/AdminDashboard.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config";

const AdminRatings = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (role !== "ADMIN") {
      navigate("/home");
      return;
    }

    const fetchRatings = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/admin/ratings`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Failed to load ratings");
          return;
        }

        setRatings(data);
      } catch (err) {
        setError("Failed to load ratings");
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [navigate, role, token]);

  return (
    <>
      <Navbar />

      <div className="admin-dashboard">
        <h2>All Store Ratings</h2>

        {loading ? (
          <p>Loading ratings...</p>
        ) : error ? (
          <p>{error}</p>
        ) : ratings.length === 0 ? (
          <p>No ratings have been submitted yet.</p>
        ) : (
          <div className="ratings-table-wrapper">
            <table className="admin-ratings-table">
              <thead>
                <tr>
                  <th>Store</th>
                  <th>Store Email</th>
                  <th>User</th>
                  <th>User Email</th>
                  <th>Rating</th>
                  <th>Comment</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {ratings.map((r) => (
                  <tr key={r.id}>
                    <td>{r.store?.name || "-"}</td>
                    <td>{r.store?.email || "-"}</td>
                    <td>{r.user?.name || "-"}</td>
                    <td>{r.user?.email || "-"}</td>
                    <td>{r.rating}</td>
                    <td>{r.comment || "-"}</td>
                    <td>
                      {r.createdAt
                        ? new Date(r.createdAt).toLocaleString()
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default AdminRatings;

