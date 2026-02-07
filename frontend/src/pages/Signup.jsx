import React, { useState } from "react";
import "../styles/Signup.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { API_BASE } from "../config";

const Signup = () => {
  const [formData, setFormData] = useState({
  name: "",
  email: "",
  address: "",
  password: "",
  role: "USER"
});


  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState("FORM"); // FORM | VERIFY

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors = {};

    if (formData.name.length < 20 || formData.name.length > 60) {
      newErrors.name = "Name must be between 20 and 60 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (formData.address.length > 400) {
      newErrors.address = "Address must not exceed 400 characters";
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be 8–16 chars, include 1 uppercase & 1 special character";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message);
        return;
      }

      setUserId(data.userId);
      setStep("VERIFY");
      setMessage("Verification code sent to your email");
    } catch (err) {
      setMessage("Server error. Please try again.");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, code: verificationCode })
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message);
        return;
      }

      setMessage("Email verified successfully! You can now log in.");
      setStep("DONE");
    } catch (err) {
      setMessage("Verification failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="signup-container">
        <h2>Create an Account</h2>

        {step === "FORM" && (
          <form className="signup-form" onSubmit={handleSignup}>
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            {errors.name && <p className="error">{errors.name}</p>}

            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            {errors.email && <p className="error">{errors.email}</p>}

            <label>Address</label>
            <textarea name="address" value={formData.address} onChange={handleChange} rows="4" required />
            {errors.address && <p className="error">{errors.address}</p>}

            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            {errors.password && <p className="error">{errors.password}</p>}
            <label>Role</label>
<select
  name="role"
  value={formData.role}
  onChange={handleChange}
  required
>
  <option value="USER">User</option>
  <option value="STORE_OWNER">Store Owner</option>
</select>


            <button type="submit">Sign Up</button>
          </form>
        )}

        {step === "VERIFY" && (
          <form className="signup-form" onSubmit={handleVerify}>
            <label>Enter Verification Code</label>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
            <button type="submit">Verify Email</button>
          </form>
        )}

        {message && <p className="success">{message}</p>}
      </div>

      <Footer />
    </>
  );
};

export default Signup;
