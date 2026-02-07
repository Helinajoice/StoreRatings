import React, { useEffect, useState } from "react";
import "../styles/ManageStores.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { API_BASE } from "../config";
import { useNavigate } from "react-router-dom";

const ManageStores = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);

  const [newStore, setNewStore] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  });

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");

  useEffect(() => {
    if (role !== "ADMIN") {
      navigate("/home");
      return;
    }

    const fetchStores = async () => {
      if (!token) return;

      try {
        const res = await fetch(`${API_BASE}/api/admin/stores`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) {
          console.error(data.message || "Failed to load stores");
          return;
        }

        setStores(data);
        setFilteredStores(data);
      } catch (err) {
        console.error("Failed to fetch stores", err);
      }
    };

    fetchStores();
  }, [navigate, role, token]);

  useEffect(() => {
    let data = [...stores];

    if (search) {
      data = data.filter(
        store =>
          store.name.toLowerCase().includes(search.toLowerCase()) ||
          store.address.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (sortBy === "name") {
      data.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sortBy === "rating") {
      data.sort((a, b) => b.rating - a.rating);
    }

    setFilteredStores(data);
  }, [search, sortBy, stores]);

  const handleAddStore = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/api/admin/stores`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newStore.name,
          email: newStore.email,
          address: newStore.address,
          ownerId: Number(newStore.ownerId),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error(data.message || "Failed to create store");
        return;
      }

      setStores((prev) => [data, ...prev]);
      setNewStore({ name: "", email: "", address: "", ownerId: "" });
    } catch (err) {
      console.error("Failed to add store", err);
    }
  };

  const handleDeleteStore = async (id) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/admin/stores/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) {
        console.error(data.message || "Failed to delete store");
        return;
      }

      setStores((prev) => prev.filter((store) => store.id !== id));
    } catch (err) {
      console.error("Failed to delete store", err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="manage-stores">
        <h2>Manage Stores</h2>

        <form className="add-store-form" onSubmit={handleAddStore}>
          <h3>Add New Store</h3>

          <input
            type="text"
            placeholder="Store Name"
            required
            value={newStore.name}
            onChange={(e) =>
              setNewStore({ ...newStore, name: e.target.value })
            }
          />

          <input
            type="email"
            placeholder="Store Email"
            required
            value={newStore.email}
            onChange={(e) =>
              setNewStore({ ...newStore, email: e.target.value })
            }
          />

          <textarea
            placeholder="Store Address"
            required
            value={newStore.address}
            onChange={(e) =>
              setNewStore({ ...newStore, address: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Store Owner User ID"
            required
            value={newStore.ownerId}
            onChange={(e) =>
              setNewStore({ ...newStore, ownerId: e.target.value })
            }
          />

          <button type="submit">Add Store</button>
        </form>

        <div className="store-controls">
          <input
            type="text"
            placeholder="Search by name or address"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select onChange={(e) => setSortBy(e.target.value)}>
            <option value="">Sort By</option>
            <option value="name">Name</option>
            <option value="rating">Rating</option>
          </select>
        </div>

        <table className="store-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Rating</th>
              <th>Owner</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStores.map((store) => (
              <tr key={store.id}>
                <td>{store.name}</td>
                <td>{store.email}</td>
                <td>{store.address}</td>
                <td>{store.rating ?? 0}</td>
                <td>{store.owner ? store.owner.name : "N/A"}</td>
                <td>
                  <button
                    className="danger"
                    onClick={() => handleDeleteStore(store.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Footer />
    </>
  );
};

export default ManageStores;
