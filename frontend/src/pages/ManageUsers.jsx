import React, { useEffect, useState } from "react";
import "../styles/ManageUsers.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { API_BASE } from "../config";
import { useNavigate } from "react-router-dom";

const ManageUsers = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const [activeTab, setActiveTab] = useState("USER");
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });

  const [filters, setFilters] = useState({
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    if (role !== "ADMIN") {
      navigate("/home");
    }
  }, [navigate, role]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!token) return;

      try {
        const res = await fetch(
          `${API_BASE}/api/admin/users?role=${activeTab}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (!res.ok) {
          console.error(data.message || "Failed to load users");
          return;
        }

        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };

    fetchUsers();
  }, [activeTab, token]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/api/admin/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          role: activeTab,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error(data.message || "Failed to create user");
        return;
      }

      setUsers((prev) => [data, ...prev]);
      setFormData({ name: "", email: "", address: "", password: "" });
    } catch (err) {
      console.error("Failed to add user", err);
    }
  };

  const handleRemoveUser = async (id) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/admin/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) {
        console.error(data.message || "Failed to delete user");
        return;
      }

      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (err) {
      console.error("Failed to remove user", err);
    }
  };

  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      user.email.toLowerCase().includes(filters.email.toLowerCase()) &&
      (filters.role === "" || user.role === filters.role)
    );
  });

  return (
    <>
      <Navbar />

      <div className="manage-users-container">
        <h1>Manage Users</h1>

        <div className="tabs">
          <button
            className={activeTab === "USER" ? "active" : ""}
            onClick={() => setActiveTab("USER")}
          >
            Normal Users
          </button>
          <button
            className={activeTab === "ADMIN" ? "active" : ""}
            onClick={() => setActiveTab("ADMIN")}
          >
            Admin Users
          </button>
          <button
            className={activeTab === "STORE_OWNER" ? "active" : ""}
            onClick={() => setActiveTab("STORE_OWNER")}
          >
            Store Owners
          </button>
        </div>

        <div className="card">
          <h3>
            Add{" "}
            {activeTab === "USER"
              ? "Normal"
              : activeTab === "ADMIN"
              ? "Admin"
              : "Store Owner"}{" "}
            User
          </h3>

          <form onSubmit={handleAddUser} className="user-form">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleFormChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleFormChange}
              required
            />

            <textarea
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleFormChange}
              maxLength="400"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleFormChange}
              required
            />

            <button type="submit">Add User</button>
          </form>
        </div>

        <div className="card filters">
          <input
            type="text"
            placeholder="Filter by Name"
            onChange={(e) =>
              setFilters({ ...filters, name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Filter by Email"
            onChange={(e) =>
              setFilters({ ...filters, email: e.target.value })
            }
          />
          <div>
            <select
              style={{
                padding: "10px",
                width: "100%",
                borderRadius: "8px",
                border: "1px solid #334155",
                backgroundColor: "#020617",
                color: "#ffffff",
                fontSize: "15px",
                border: "1px solid #facc15",
              }}
              onChange={(e) =>
                setFilters({ ...filters, role: e.target.value })
              }
            >
              <option value="">All Roles</option>
              <option value="USER">Normal</option>
              <option value="ADMIN">Admin</option>
              <option value="STORE_OWNER">Store Owner</option>
            </select>
          </div>

        </div>

        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.address}</td>
                    <td>{user.role}</td>
                    <td>
                      {user.role === "STORE_OWNER"
                        ? user.is_approved
                          ? "Approved"
                          : "Pending"
                        : "-"}
                    </td>
                    <td>
                      {user.role === "STORE_OWNER" && !user.is_approved && (
                        <button
                          onClick={async () => {
                            try {
                              const res = await fetch(
                                `${API_BASE}/api/admin/store-owners/${user.id}/approve`,
                                {
                                  method: "PUT",
                                  headers: {
                                    Authorization: `Bearer ${token}`,
                                  },
                                }
                              );
                              const data = await res.json();
                              if (!res.ok) {
                                console.error(
                                  data.message || "Failed to approve store owner"
                                );
                                return;
                              }
                              setUsers((prev) =>
                                prev.map((u) =>
                                  u.id === user.id
                                    ? { ...u, is_approved: true }
                                    : u
                                )
                              );
                            } catch (err) {
                              console.error(
                                "Failed to approve store owner",
                                err
                              );
                            }
                          }}
                          style={{ marginRight: "8px" }}
                        >
                          Approve
                        </button>
                      )}
                      <button
                        className="danger"
                        onClick={() => handleRemoveUser(user.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ManageUsers;
