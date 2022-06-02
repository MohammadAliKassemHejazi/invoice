const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
  From: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  To: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  Us: {
    type: Number,
    required: true,
  },
  Fr: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Invoice", invoiceSchema);
