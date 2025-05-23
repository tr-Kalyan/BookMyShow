const mongoose = require("mongoose");
const path = require("path");
let collectionName = path.basename(__filename).split(".")[0];

const bookingSchema = new mongoose.Schema({
    show:{
        type: mongoose.Types.ObjectId,
        ref: "show"
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    seats:{
        type: Array,
        required: true
    },
    transactionId:{
        type: String,
        required: true,
    },
}, { timestamps: true });

const BookingModel = mongoose.model(collectionName, bookingSchema);

module.exports = BookingModel;