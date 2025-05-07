const express = require("express");
const movieRouter = express.Router();
const {
  addMovie,
  getAllMovies,
  updateMovie,
  deleteMovie,
  getMovieById,
} = require("../controllers/movieController");
// add a movie
movieRouter.post("/add-movie", addMovie);
// get all movies
movieRouter.get("/get-all-movies", getAllMovies);
// update movies
movieRouter.put("/update-movie", updateMovie);
// delete
movieRouter.put("/delete-movie", deleteMovie);

movieRouter.get("/movie/:id", getMovieById);

module.exports = movieRouter;