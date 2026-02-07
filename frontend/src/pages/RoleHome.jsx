import React from "react";
import "../styles/RoleHome.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const RoleHome = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <Navbar />

      <div className="role-home">
        <h2>Welcome to Store Rating Platform</h2>
        <p className="role-text">
          Logged in as: <strong>{role}</strong>
        </p>

        {role === "ADMIN" && (
          <div className="card-container">
            <div
              className="card"
              onClick={() => navigate("/admin/approvals")}
            >
              Approve Store Owners
            </div>

            <div
              className="card"
              onClick={() => navigate("/admin/users")}
            >
              Manage Users
            </div>

            <div
              className="card"
              onClick={() => navigate("/admin/stores")}
            >
              Manage Stores
            </div>

            <div
              className="card"
              onClick={() => navigate("/admin/dashboard")}
            >
              View Dashboard Stats
            </div>
          </div>
        )}

        {role === "USER" && (
          <div className="card" onClick={() => navigate("/dashboard")}>
  My Dashboard
</div>

        )}

        {role === "STORE_OWNER" && (
  <div className="card-container">
    <div
      className="card"
      onClick={() => navigate("/owner/dashboard")}
    >
      Store Dashboard
    </div>

    <div
  className="card"
  onClick={() => navigate("/update-password")}
>
  Update Password
</div>

  </div>
)}


        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <Footer />
    </>
  );
};

export default RoleHome;
