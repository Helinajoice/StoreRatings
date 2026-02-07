const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const userController = require("../controllers/userController");
const ratingController = require("../controllers/ratingController");

router.use(auth);
router.get("/me", userController.getMe);
router.put("/password", userController.updatePassword);
router.get("/ratings", ratingController.getMyRatings);

module.exports = router;

