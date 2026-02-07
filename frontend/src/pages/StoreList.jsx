import React, { useEffect, useState } from "react";
import "../styles/StoreList.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const StoreList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");

  const [stores, setStores] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/stores");
        const data = await res.json();
        if (!res.ok) {
          console.error(data.message || "Failed to load stores");
          return;
        }
        const withUserRating = data.map((s) => ({
          ...s,
          userRating: null,
        }));
        setStores(withUserRating);
      } catch (err) {
        console.error("Failed to fetch stores", err);
      }
    };

    fetchStores();
  }, []);

  const handleRatingChange = async (id, rating) => {
    setStores((prev) =>
      prev.map((store) =>
        store.id === id ? { ...store, userRating: rating } : store
      )
    );

    if (!token) {
      console.warn("User not logged in; rating not saved to backend");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          storeId: id,
          rating,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error(data.message || "Failed to save rating");
      }
    } catch (err) {
      console.error("Error saving rating", err);
    }
  };

  const filteredStores = stores
    .filter(
      (store) =>
        store.name.toLowerCase().includes(search.toLowerCase()) ||
        store.address.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  return (
    <>
      <Navbar />

      <div className="store-list">
        <h2>Store Listings</h2>

        <div className="controls">
          <input
            type="text"
            placeholder="Search by name or address"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select onChange={(e) => setSortBy(e.target.value)}>
            <option value="">Sort By</option>
            <option value="name">Name</option>
            <option value="rating">Avg Rating</option>
          </select>
        </div>

        {filteredStores.map((store) => (
          <div className="store-card" key={store.id}>
            <h3>{store.name}</h3>
            <div className="store-image">
              {store.imageUrl ? (
                <img src={store.imageUrl} alt={store.name} />
              ) : (
                <div className="store-image-placeholder">Image coming soon</div>
              )}
            </div>
            <p><strong>Address:</strong> {store.address}</p>
            <p><strong>Avg Rating:</strong> {store.rating ?? 0}</p>
            {store.description && (
              <p><strong>Description:</strong> {store.description}</p>
            )}

            <div className="rating-section">
              <span>Your Rating:</span>
              {[1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  className={store.userRating === r ? "active" : ""}
                  onClick={() => handleRatingChange(store.id, r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        ))}

        <button
          className="back-to-dashboard-btn"
          onClick={() => navigate("/dashboard")}
        >
          Back to Dashboard
        </button>
      </div>

      <Footer />
    </>
  );
};

export default StoreList;
