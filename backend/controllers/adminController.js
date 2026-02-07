const User = require("../models/User");
const Store = require("../models/Store");

exports.getStats = async (req, res) => {
  try {
    const [users, stores] = await Promise.all([
      User.count(),
      Store.count(),
    ]);

    res.json({
      users,
      stores,
      ratings: 0,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const where = {};

    if (role) {
      where.role = role;
    }

    const users = await User.findAll({
      where,
      attributes: ["id", "name", "email", "address", "role", "is_verified", "is_approved"],
      order: [["createdAt", "DESC"]],
    });

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!["USER", "ADMIN", "STORE_OWNER"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const bcrypt = require("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      address,
      password: hashedPassword,
      role,
      is_verified: true,
      is_approved: true,
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Failed to create user" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "STORE_OWNER") {
      await Store.destroy({ where: { ownerId: user.id } });
    }

    await user.destroy();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

exports.getPendingStoreOwners = async (req, res) => {
  try {
    const pending = await User.findAll({
      where: { role: "STORE_OWNER", is_approved: false },
      attributes: ["id", "name", "email", "address", "role", "is_verified", "is_approved"],
      order: [["createdAt", "DESC"]],
    });

    res.json(pending);
  } catch (error) {
    console.error("Error fetching pending store owners:", error);
    res.status(500).json({ message: "Failed to fetch pending store owners" });
  }
};

exports.approveStoreOwner = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);

    if (!user || user.role !== "STORE_OWNER") {
      return res.status(404).json({ message: "Store owner not found" });
    }

    user.is_approved = true;
    await user.save();

    return res.json({ message: "Store owner approved successfully" });
  } catch (error) {
    console.error("Approve store owner error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteStoreOwner = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);

    if (!user || user.role !== "STORE_OWNER") {
      return res.status(404).json({ message: "Store owner not found" });
    }

    await Store.destroy({ where: { ownerId: user.id } });
    await user.destroy();

    return res.json({ message: "Store owner and their stores deleted successfully" });
  } catch (error) {
    console.error("Delete store owner error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

