const Store = require("../models/Store");
const User = require("../models/User");

exports.getStores = async (req, res) => {
  try {
    const stores = await Store.findAll({
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(stores);
  } catch (error) {
    console.error("Error fetching stores:", error);
    res.status(500).json({ message: "Failed to fetch stores" });
  }
};

exports.createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    if (!name || !email || !address || !ownerId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const owner = await User.findByPk(ownerId);
    if (!owner || owner.role !== "STORE_OWNER") {
      return res
        .status(400)
        .json({ message: "Owner must be a valid store owner user" });
    }

    const store = await Store.create({
      name,
      email,
      address,
      ownerId,
      rating: 0,
      description: null,
      imageUrl: null,
    });

    res.status(201).json(store);
  } catch (error) {
    console.error("Error creating store:", error);
    res.status(500).json({ message: "Failed to create store" });
  }
};

exports.deleteStore = async (req, res) => {
  try {
    const { id } = req.params;

    const store = await Store.findByPk(id);
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    await store.destroy();
    res.json({ message: "Store deleted successfully" });
  } catch (error) {
    console.error("Error deleting store:", error);
    res.status(500).json({ message: "Failed to delete store" });
  }
};

exports.getStoresForOwner = async (req, res) => {
  try {
    const stores = await Store.findAll({
      where: { ownerId: req.user.id },
      order: [["createdAt", "DESC"]],
    });

    res.json(stores);
  } catch (error) {
    console.error("Error fetching owner stores:", error);
    res.status(500).json({ message: "Failed to fetch owner stores" });
  }
};

