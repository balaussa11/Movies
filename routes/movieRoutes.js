const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");

router.post("/", movieController.createMovie);
router.get("/", movieController.getMovies);
router.get("/:id", movieController.getMovieById);
router.put("/:id", movieController.updateMovie);
router.delete("/:id", movieController.deleteMovie);

module.exports = router;


const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/roleMiddleware");

// public
router.get("/", movieController.getMovies);
router.get("/:id", movieController.getMovieById);

// admin only
router.post("/", auth, admin, movieController.createMovie);
router.put("/:id", auth, admin, movieController.updateMovie);
router.delete("/:id", auth, admin, movieController.deleteMovie);
