import React from "react";
import { useParams } from "react-router-dom";
import "../styles/UserDetails.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const UserDetails = () => {
  const { userId } = useParams();

  const user = {
    id: userId,
    name: "Store Owner One",
    email: "owner@example.com",
    address: "Mumbai, India",
    role: "STORE_OWNER",
    storeRating: 4.3,
  };

  return (
    <>
      <Navbar />

      <div className="user-details-container">
        <h1>User Details</h1>

        <div className="details-card">
          <div className="detail-row">
            <span>Name</span>
            <p>{user.name}</p>
          </div>

          <div className="detail-row">
            <span>Email</span>
            <p>{user.email}</p>
          </div>

          <div className="detail-row">
            <span>Address</span>
            <p>{user.address}</p>
          </div>

          <div className="detail-row">
            <span>Role</span>
            <p>{user.role}</p>
          </div>

          {user.role === "STORE_OWNER" && (
            <div className="detail-row">
              <span>Store Rating</span>
              <p>{user.storeRating} ⭐</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default UserDetails;
