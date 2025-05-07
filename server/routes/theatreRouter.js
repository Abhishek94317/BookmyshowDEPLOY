const router = require("express").Router();
const Theatre = require("../models/theatreModel");
router.post("/add-theatre", async (req, res) => {
  try {
    const newTheatre = new Theatre(req.body);
    await newTheatre.save();
    res.send({ success: true, message: "New Theatre has been added" });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
});
// update theatre

router.put("/update-theatre", async (req, res) => {
  console.log("theatre body", req.body);
  try {
    // const theatreId = req.body._id;
    const theatre = await Theatre.findByIdAndUpdate(
      req.body.theatreId,
      req.body,
      { new: true }
    );
    if (!theatre) {
      return res
        .status(404)
        .send({ success: false, message: "Theatre not found" });
    } else {
      res.send({ success: true, message: "Theatre updated" });
    }
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
});
router.delete("/delete-theatre/:theatreId", async (req, res) => {
  try {
    console.log("deelting theatre", req.params.theatreId);
    await Theatre.findByIdAndDelete(req.params.theatreId);
    res.send({ success: true, message: "Theatre deleted" });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
});
// get all theatres for Admin route
router.get("/get-all-theatres", async (req, res) => {
  try {
    
    const allTheatres = await Theatre.find().populate("owner");
    res.send({
      success: true,
      data: allTheatres,
      message: "All theatres fetched",
    });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
});
// get all theatres for a specific owner
router.get("/get-all-theatres-by-owner/:ownerId", async (req, res) => {
  try {
    
    const allTheatres = await Theatre.find({ owner: req.params.ownerId });
    console.log("all theatres", allTheatres);
    res.send({
      success: true,
      data: allTheatres,
      message: "All theatres fetched",
    });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
});
module.exports = router;