const mongoose = require("mongoose");
var dotenv = require("dotenv");
dotenv.config();
const mongoUri = process.env.MONGODB_URI;
const connectToMongo = () => {
  mongoose
    .connect(mongoUri, {
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.log("Error connecting to MongoDB: ", err);
    });
};
module.exports = { connectToMongo };
