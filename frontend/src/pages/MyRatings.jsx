import React, { useState, useEffect } from "react";
import "../styles/MyRatings.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const MyRatings = () => {
  const navigate = useNavigate();

  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to view your ratings.");
      setLoading(false);
      return;
    }

    const fetchRatings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user/ratings", {
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
  }, []);

  return (
    <>
      <Navbar />

      <div className="ratings-page">
        <h2>My Ratings</h2>

        {loading ? (
          <p>Loading your ratings...</p>
        ) : error ? (
          <p className="no-ratings">{error}</p>
        ) : ratings.length === 0 ? (
          <p className="no-ratings">You have not rated any stores yet.</p>
        ) : (
          ratings.map((item, index) => (
            <div className="rating-card" key={index}>
              <h3>{item.store?.name || "Store"}</h3>
              <div className="rating-stars">
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={i < item.rating ? "star filled" : "star"}
                  >
                    ★
                  </span>
                ))}
              </div>
              {item.comment && (
                <p className="comment">{item.comment}</p>
              )}
            </div>
          ))
        )}

        <button className="back-btn" onClick={() => navigate(-1)}>
          Back to Dashboard
        </button>
      </div>

      <Footer />
    </>
  );
};

export default MyRatings;
