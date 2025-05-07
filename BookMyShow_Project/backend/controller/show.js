const ShowModel = require("../models/show");

const addShow = async (req, res) => {
  try {
    const newShow = new ShowModel(req.body);
    await newShow.save();
    res.status(200).json({
      success: true,
      message: "new show added",
    });
  } catch (err) {
    res.send({
      status: false,
      message: err.message,
    });
  }
};

const updateShow = async (req, res) => {
  try {
    const { body } = req;
    const updatedShow = await ShowModel.findByIdAndUpdate(body.showId, body);
    if (!updatedShow) {
      return res.status(400).json({
        message: "show not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "show updated",
      data: updatedShow,
    });
  } catch (err) {
    console.log(err);
    res.send({
      success: false,
      message: err.message,
    });
  }
};

const deleteShow = async (req, res) => {
  try {
    const { showId } = req.params;
    const deletedShow = await ShowModel.findOneAndDelete({ _id: showId });
    res.status(200).json({
      success: true,
      message: "show deleted",
      data: deletedShow,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
};

const getAllShowsByTheatre = async (req, res) => {
  try {
    const { theatreId } = req.body;
    const allShowsByTheatre = await ShowModel.find({
      theatre: theatreId,
    }).populate("movie");
    res.status(200).json({
      success: true,
      message: "sent show by theatres",
      data: allShowsByTheatre,
    });
  } catch (err) {
    res.send({
      status: false,
      message: err.message,
    });
  }
};

const getAllShowsByMovie = async (req, res) => {
  try {
    const { movie, date } = req.body;
    const shows = await ShowModel.find({ movie, date }).populate("theatre");

    // Group shows by theatre using reduce
    const uniqueTheatres = shows.reduce((theatres, show) => {
      const theatreId = show.theatre._id.toString();

      // Find if theatre already exists in our array
      const existingTheatre = theatres.find(t => t._id.toString() === theatreId);

      if (!existingTheatre) {
        // If theatre doesn't exist, add it with its first show
        theatres.push({
          _id: show.theatre._id,
          name: show.theatre.name,
          address: show.theatre.address,
          shows: [show]
        });
      } else {
        // If theatre exists, just add the show to its shows array
        existingTheatre.shows.push(show);
      }

      return theatres;
    }, []);

    res.status(200).json({
      success: true,
      message: "sent show of theatre",
      data: uniqueTheatres,
    });
  } catch (err) {
    res.send({
      status: false,
      message: err.message,
    });
  }
};


const getShowById = async (req, res) => {
  try {
    const { showId } = req.params;
    const show = await ShowModel.findById(showId).populate("theatre").populate("movie");;
    res.status(200).json({
      success: true,
      message: "show found",
      data: show,
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  addShow,
  updateShow,
  deleteShow,
  getAllShowsByTheatre,
  getAllShowsByMovie,
  getShowById
};