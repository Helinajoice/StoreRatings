const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const authorize = require("../middleware/authorize");
const adminController = require("../controllers/adminController");
const storeController = require("../controllers/storeController");
const ratingController = require("../controllers/ratingController");

router.use(auth, authorize("ADMIN"));

router.get("/stats", adminController.getStats);
router.get("/users", adminController.getUsers);
router.post("/users", adminController.createUser);
router.delete("/users/:id", adminController.deleteUser);
router.get("/store-owners/pending", adminController.getPendingStoreOwners);
router.put("/store-owners/:userId/approve", adminController.approveStoreOwner);
router.delete("/store-owners/:userId", adminController.deleteStoreOwner);
router.get("/stores", storeController.getStores);
router.post("/stores", storeController.createStore);
router.delete("/stores/:id", storeController.deleteStore);
router.get("/ratings", ratingController.getAllRatings);

module.exports = router;

