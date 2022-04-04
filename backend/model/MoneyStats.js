var mongoose = require("mongoose");

const MoneyStatsModel = new mongoose.Schema({
  userId: {
    type: String,
    default: "",
  },
  AccountBalance: {
    type: Number,
    default: 0,
  },
});

const MoneyStats = mongoose.model("MoneyStats", MoneyStatsModel);
module.exports = MoneyStats;
