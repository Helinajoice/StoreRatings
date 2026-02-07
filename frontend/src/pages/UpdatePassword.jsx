import React, { useState } from "react";
import "../styles/UpdatePassword.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { API_BASE } from "../config";

const UpdatePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (
      newPassword.length < 8 ||
      newPassword.length > 16 ||
      !/[A-Z]/.test(newPassword) ||
      !/[!@#$%^&*]/.test(newPassword)
    ) {
      setError(
        "Password must be 8–16 chars, include 1 uppercase & 1 special character"
      );
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to update password");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/user/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to update password");
        return;
      }

      setMessage(data.message || "Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="password-page">
        <h2>Update Password</h2>

        <form className="password-form" onSubmit={handleSubmit}>
          <label>Current Password</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />

          <label>New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <label>Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}

          <button type="submit">Update Password</button>
        </form>
      </div>

      <Footer />
    </>
  );
};

export default UpdatePassword;
