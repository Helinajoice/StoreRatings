import React from "react";

const Navbar = () => {
  const navStyle = {
    backgroundColor: "#0f172a", // dark blue
    color: "#ffffff",
    padding: "16px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
  };

  const logoStyle = {
    color: "#facc15", // mustard yellow
    margin: 0,
    fontSize: "22px",
    fontWeight: "700",
    letterSpacing: "1px",
  };

  const linkContainerStyle = {
    display: "flex",
    gap: "24px",
  };

  const linkStyle = {
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: "500",
    transition: "color 0.3s ease",
  };

  return (
    <nav style={navStyle}>
      <h2 style={logoStyle}>StoreRatings</h2>

      <div style={linkContainerStyle}>
        <a href="/" style={linkStyle}
          onMouseOver={(e) => (e.target.style.color = "#facc15")}
          onMouseOut={(e) => (e.target.style.color = "#ffffff")}
        >
          Home
        </a>

        <a href="/login" style={linkStyle}
          onMouseOver={(e) => (e.target.style.color = "#facc15")}
          onMouseOut={(e) => (e.target.style.color = "#ffffff")}
        >
          Login
        </a>

        <a href="/Signup" style={linkStyle}
          onMouseOver={(e) => (e.target.style.color = "#facc15")}
          onMouseOut={(e) => (e.target.style.color = "#ffffff")}
        >
          Sign Up
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
