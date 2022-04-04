var mongoose = require("mongoose");

const transactionModel = new mongoose.Schema({
  userId: {
    type: String,
    default: "",
  },
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true,
  },
  Transaction: {
    type: String,
    required: true,
  },
  Amount: {
    type: Number,
    required: true,
  },
  Date: {
    type: String,
    required: true,
  },
  Type: {
    type: String,
    required: true,
  },
  Description: {
    type: String,
  },
});

const transaction = mongoose.model("transaction", transactionModel);
module.exports = transaction;
