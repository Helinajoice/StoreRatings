const Rating = require("../models/Rating");
const Store = require("../models/Store");
const User = require("../models/User");

exports.createOrUpdateRating = async (req, res) => {
  try {
    const { storeId, rating, comment } = req.body;

    if (!storeId || !rating) {
      return res
        .status(400)
        .json({ message: "storeId and rating are required" });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const userId = req.user.id;

    const [ratingRecord] = await Rating.findOrCreate({
      where: { userId, storeId },
      defaults: {
        userId,
        storeId,
        rating,
        comment: comment || null,
      },
    });

    if (!ratingRecord.isNewRecord) {
      ratingRecord.rating = rating;
      ratingRecord.comment = comment || ratingRecord.comment;
      await ratingRecord.save();
    }

    const allRatings = await Rating.findAll({ where: { storeId } });
    if (allRatings.length > 0) {
      const avg =
        allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
      const store = await Store.findByPk(storeId);
      if (store) {
        store.rating = avg;
        await store.save();
      }
    }

    res.status(200).json(ratingRecord);
  } catch (error) {
    console.error("Error saving rating:", error);
    res.status(500).json({ message: "Failed to save rating" });
  }
};

exports.getMyRatings = async (req, res) => {
  try {
    const userId = req.user.id;

    const ratings = await Rating.findAll({
      where: { userId },
      include: [
        {
          model: Store,
          as: "store",
          attributes: ["id", "name", "address", "email", "rating"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(ratings);
  } catch (error) {
    console.error("Error fetching user ratings:", error);
    res.status(500).json({ message: "Failed to fetch ratings" });
  }
};

exports.getAllRatings = async (req, res) => {
  try {
    const ratings = await Rating.findAll({
      include: [
        {
          model: Store,
          as: "store",
          attributes: ["id", "name", "address", "email", "rating"],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(ratings);
  } catch (error) {
    console.error("Error fetching all ratings:", error);
    res.status(500).json({ message: "Failed to fetch ratings" });
  }
};

