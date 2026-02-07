const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendVerificationEmail = require("../utils/sendEmail");

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.signup = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const code = generateCode();
    const isApproved = role === "USER";

    const user = await User.create({
      name,
      email,
      address,
      password: hashedPassword,
      role,
      is_verified: false,
      is_approved: isApproved,
      verification_code: code,
    });

    await sendVerificationEmail(email, code);

    res.status(200).json({
      message: "Verification code sent",
      userId: user.id,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.verifyEmail = async (req, res) => {
  try {
    const { userId, code } = req.body;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.is_verified) return res.status(400).json({ message: "User already verified" });

    if (user.verification_code === code) {
      user.is_verified = true;
      user.verification_code = null;
      await user.save();
      res.status(200).json({ message: "Email verified successfully" });
    } else {
      res.status(400).json({ message: "Invalid verification code" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    if (user.role !== role) {
      return res.status(401).json({ message: "Role mismatch" });
    }

    if (user.role === "STORE_OWNER" && !user.is_approved) {
      return res.status(403).json({
        message: "Account pending admin approval",
      });
    }

    if (!user.is_verified)
      return res.status(403).json({ message: "Email not verified" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      role: user.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};
