const router = require("express").Router();

const Show = require("../models/showModel");

// add show

router.post("/add-show", async (req, res) => {
  try {
    const newShow = new Show(req.body);
    await newShow.save();
    res.send({ success: true, message: "Show added successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.delete("/delete-show/:showId", async (req, res) => {
  try {
    await Show.findByIdAndDelete(req.params.showId);
    res.send({ success: true, message: "Show deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// update show

router.put("/update-show", async (req, res) => {
  try {
    await Show.findByIdAndUpdate(req.body.showId, req.body);
    res.send({ success: true, message: "Show updated successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// get shows = 2 APIS
/**
 *1.  get all shows by theatres- will be used by Partners to see the current shows for their theatre
 *2. get all shows by movie and date
    [ 
    { movieId: 123, date and time: 2021-09-01 10 AM, theatre:A },
    { movieId: 123, date: 2021-09-01 9 PM, theatre:A },
    { movieId: 123, date: 2021-09-01 11 PM, theatre:A },
    { movieId: 123, date: 2021-09-01, theatre:B }, 
    { movieId: 456, date: 2021-09-01, theatre:C } ]
    Theatre A has 2 shows for movie 123 on 2021-09-01
    Theatre B has 1 show for movie 123 on 2021-09-01
    Theatre C has 1 show for movie 456 on 2021-09-01
 * 
 * 
 * uniqueTheatre : [{A: {9pm, 11 PM}}, {B: {9 PM}}, {C: {10 PM}}]
 */

router.get("/get-all-shows-by-theatre/:theatreId", async (req, res) => {
  try {
    console.log("shows for theatre", req.params.theatreId);
    const shows = await Show.find({ theatre: req.params.theatreId }).populate(
      "movie"
    );
    console.log("shows", shows);
    if (shows.length == 0) {
      console.log("No shows found");
      return res.send({ success: true, message: "No shows found", data: [] });
    }
    console.log("Shows found");
    res.send({
      success: true,
      message: "Shows found",
      data: shows,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/get-all-theatres-by-movie/:movie/:date", async (req, res) => {
  try {
    const { movie, date } = req.params; // {movie: 123, date: 2021-09-01}
    const shows = await Show.find({ movie, date }).populate("theatre");

    // filter out the unique theatres
    const uniqueTheatres = []; // [{A:{9pm , 11 PM}}, {B:{9pm}}]
    shows.forEach((show) => {
      let isTheatre = uniqueTheatres.find(
        (theatre) => theatre._id === show.theatre._id
      );
      if (!isTheatre) {
        // add the theatre along with the all shows
        const showsOfThisTheatre = shows.filter(
          (showObj) => showObj.theatre._id == show.theatre._id
        );
        uniqueTheatres.push({
          ...show.theatre._doc,
          shows: showsOfThisTheatre,
        });
      }
      
    });
    res.send({
      success: true,
      message: "Theatres found",
      data: uniqueTheatres,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.get("/get-show-by-id/:showId", async (req, res) => {
  try {
    const show = await Show.findById(req.params.showId)
      .populate("movie")
      .populate("theatre");
    if (!show) {
      return res.send({ success: true, message: "No show found", data: [] });
    }
    res.send({ success: true, message: "Show found", data: show });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;