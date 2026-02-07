const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const ratingController = require("../controllers/ratingController");

router.use(auth);

router.post("/", ratingController.createOrUpdateRating);

module.exports = router;

