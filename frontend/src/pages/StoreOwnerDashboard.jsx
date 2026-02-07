import React, { useEffect, useState } from "react";
import "../styles/StoreOwnerDashboard.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const StoreOwnerDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in as a store owner.");
      setLoading(false);
      return;
    }

    const fetchStores = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/owner/stores", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || "Failed to load store");
          return;
        }
        setStores(data);
      } catch (err) {
        setError("Failed to load store");
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const averageRating =
    stores.length === 0
      ? 0
      : (
          stores.reduce((sum, s) => sum + (s.rating || 0), 0) / stores.length
        ).toFixed(1);

  return (
    <>
      <Navbar />

      <div className="owner-dashboard">
        <h2>Store Owner Dashboard</h2>

        {loading ? (
          <p>Loading your store...</p>
        ) : error ? (
          <p>{error}</p>
        ) : stores.length === 0 ? (
          <p>No store is linked to this owner yet.</p>
        ) : (
          <>
            <div className="avg-rating-card">
              <h3>Average Store Rating</h3>
              <p className="rating-value">{averageRating} / 5</p>
            </div>

            {stores.map((store) => (
              <div key={store.id} className="owner-store-card">
                <h3>{store.name}</h3>
                <p>
                  <strong>Address:</strong> {store.address}
                </p>
                <p>
                  <strong>Email:</strong> {store.email}
                </p>
                <p>
                  <strong>Rating:</strong> {store.rating ?? 0}
                </p>
                {store.description && (
                  <p>
                    <strong>Description:</strong> {store.description}
                  </p>
                )}
              </div>
            ))}
          </>
        )}
      </div>

      <Footer />
    </>
  );
};

export default StoreOwnerDashboard;
