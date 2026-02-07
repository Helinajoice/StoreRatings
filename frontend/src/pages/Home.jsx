import React from "react";
import "../styles/Home.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Navbar />

      <div className="home-container">
        <section className="hero">
          <h1>Store Rating Platform</h1>
          <p>
            A trusted platform where users can rate stores and share honest
            feedback.
          </p>

          <div className="cta-buttons">
            <a href="/login" className="btn primary">Login</a>
            <a href="/Signup" className="btn secondary">Sign Up</a>
          </div>
        </section>

        <section className="about hero">

          <h2>About the Platform</h2>
          <p>
            Our platform allows users to submit ratings for registered stores.
            Store owners can view feedback, and administrators manage the entire
            system securely.
          </p>
        </section>

        <section className="how-it-works hero">
          <h2>How It Works</h2>
          <ol>
            <li>Users sign up and log in</li>
            <li>Browse registered stores</li>
            <li>Submit ratings from 1 to 5</li>
            <li>Store owners view feedback</li>
            <li>Admins manage users and stores</li>
          </ol>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default Home;
