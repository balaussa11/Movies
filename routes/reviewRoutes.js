const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/roleMiddleware");

const {
  addReview,
  getReviewsByMovie,
  updateReview,
  deleteReview
} = require("../controllers/reviewController");

// PUBLIC — get reviews for a movie
router.get("/:movieId", getReviewsByMovie);

// USER / ADMIN — add review
router.post("/:movieId", auth, addReview);

// ADMIN ONLY — update & delete review
router.put("/edit/:reviewId", auth, admin, updateReview);
router.delete("/delete/:reviewId", auth, admin, deleteReview);

module.exports = router;
