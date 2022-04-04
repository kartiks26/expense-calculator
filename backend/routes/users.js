var express = require("express");
var router = express.Router();
const request = require("request");
const transaction = require("../model/transaction");
const baseUrl = process.env.REACT_APP_API_URL;
const { MessagingResponse } = require("twilio").twiml;
const goodBoyUrl =
  "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?" +
  "ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80";
const client = require("twilio")(
  "ACbf81397c46b61bb97ea51a919e7ad95b",
  "5f9ed4289b43cc49a8ab083e26e86835"
);
/* GET users listing. */
router.post("/", function (req, res, next) {
  console.log(req.body.Body);
  if (req.body.Body === "new transaction") {
    message = new MessagingResponse().message(
      "Welcome Lets Create New Transaction Enter data in this format <Transaction>,<Amount>,<Date>,<Description>,<Type>"
    );
  } else if (req.body.Body.split(",")[0] == "new") {
    const data = req.body.Body.split(",");
    let Transaction = data[1];
    let Amount = parseInt(data[2]);
    let Date = data[3];
    let Description = data[4];
    let Type = data[5];
    let newTransaction = {
      Transaction,
      Amount,
      Date,
      Description,
      Type,
      userId: "8007338550",
    };
    request.post(
      {
        url: `${baseUrl}/transaction/newTransaction`,
        json: true,
        body: newTransaction,
      },
      function (error, response, body) {
        if (error) {
          console.log(error);
        } else {
          message = new MessagingResponse().message(
            "Transaction Created Successfully"
          );
          res.send(body);
        }
      }
    );
  } else {
    message = new MessagingResponse().message(
      "Thanks for the image! Here's one for you!"
    );
    message.media(goodBoyUrl);
  }

  // client.messages
  //   .create({
  //     mediaUrl: [
  //       "https://images.unsplash.com/photo-1545093149-618ce3bcf49d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80",
  //     ],
  //     from: "whatsapp:+14155238886",
  //     to: "whatsapp:+919975865533",
  //   })
  //   .then((message) => res.send(message.sid));
});

module.exports = router;
