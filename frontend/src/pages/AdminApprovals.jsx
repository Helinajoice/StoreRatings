import React, { useEffect, useState } from "react";
import "../styles/ManageUsers.css"; // reuse styling
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const AdminApprovals = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  const [pendingOwners, setPendingOwners] = useState([]);

  useEffect(() => {
    if (role !== "ADMIN") {
      navigate("/home");
    }
  }, [navigate, role]);

  useEffect(() => {
    const fetchPending = async () => {
      if (!token) return;

      try {
        const res = await fetch(
          "http://localhost:5000/api/admin/store-owners/pending",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        if (!res.ok) {
          console.error(data.message || "Failed to load pending store owners");
          return;
        }

        setPendingOwners(data);
      } catch (err) {
        console.error("Error fetching pending store owners", err);
      }
    };

    fetchPending();
  }, [token]);

  const handleApprove = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/store-owners/${id}/approve`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) {
        console.error(data.message || "Failed to approve store owner");
        return;
      }

      setPendingOwners((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Error approving store owner", err);
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/store-owners/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) {
        console.error(data.message || "Failed to reject store owner");
        return;
      }

      setPendingOwners((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Error rejecting store owner", err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="manage-users-container">
        <h1>Store Owner Approvals</h1>

        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Address</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingOwners.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty">
                    No pending store owners
                  </td>
                </tr>
              ) : (
                pendingOwners.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.address}</td>
                    <td>
                      <button
                        onClick={() => handleApprove(user.id)}
                        style={{ marginRight: "8px" }}
                      >
                        Approve
                      </button>
                      <button
                        className="danger"
                        onClick={() => handleReject(user.id)}
                      >
                        Reject
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

export default AdminApprovals;

