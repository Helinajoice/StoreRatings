const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const storeController = require("../controllers/storeController");

router.use(auth, authorize("STORE_OWNER"));
router.get("/stores", storeController.getStoresForOwner);

module.exports = router;

