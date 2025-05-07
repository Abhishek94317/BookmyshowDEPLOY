const Movie = require("../models/movieModel");
const addMovie = async (req, res) => {
  // /api/movies/add-movie
  try {
    const newMovie = new Movie(req.body);
    await newMovie.save();
    res.send({
      success: true,
      message: "New Movie has been added",
    });
  } catch (err) {
    res.status(400).send({ succes: false, message: err.message });
  }
};
const getAllMovies = async (req, res) => {
  // /api/movies/get-all-movies?genre=action
  try {
    const allMovies = await Movie.find();
    res.send({ success: true, data: allMovies, message: "All movies fetched" });
  } catch (err) {
    res.status(400).send({ success: false, message: err.message });
  }
};
const updateMovie = async (req, res) => {
  try {
    const isExists = await Movie.findById(req.body.movieId);
    // if (!isExists) {
    //   return res.send({ success: false, message: "Movie not found" });
    // }
    const movie = await Movie.findByIdAndUpdate(req.body.movieId, req.body, {
      new: true,
    });
    if (!movie) {
      return res.send({ success: false, message: "Movie not found" });
    } else {
      res.send({ success: true, message: "Movie updated" });
    }
  } catch (err) {
    res.status(400).send({ success: false, message: err.message });
  }
};
const deleteMovie = async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.body.movieId);
    console.log(req.body.movieId);
    res.send({ success: true, message: "Movie deleted" });
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};

const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    res.send({
      success: true,
      data: movie,
      message: "Movie fetched successfully",
    });
  } catch (err) {
    res.send({ success: false, message: err.message });
  }
};
module.exports = { addMovie, getAllMovies, updateMovie, deleteMovie, getMovieById};