var express = require("express");
const transaction = require("../model/transaction");
const MoneyStats = require("../model/MoneyStats");
const { default: mongoose } = require("mongoose");
const e = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("transaction Route");
});
router.get("/getAll/:id", function (req, res, next) {
  transaction.find(
    {
      userId: req.params.id,
    },
    function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    }
  );
});
router.get("/getCredit/:id/:type", function (req, res, next) {
  transaction.aggregate(
    [
      {
        $match: {
          userId: req.params.id,
          Type: req.params.type,
        },
      },
    ],
    function (err, result) {
      if (err) {
        res.send(err);
      } else {
        let creditAmount = 0;
        result.map((item) => {
          creditAmount += item.Amount;
        });
        res.json({
          success: true,
          Amount: creditAmount,
        });
      }
    }
  );
});
router.get("/getAccountBalance/:id", function (req, res, next) {
  MoneyStats.findOne(
    {
      userId: req.params.id,
    },
    function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    }
  );
});
router.get("/allBalance", function (req, res, next) {
  MoneyStats.find({}, function (err, result) {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});
router.get("/CalenderFilterTransactions/:userId", function (req, res, next) {
  transaction.find(
    {
      userId: req.params.userId,
    },
    function (err, result) {
      if (err) {
        res.send(err);
      } else {
        let credit = 0;
        let debit = 0;
        let lend = 0;
        let investment = 0;
        let lendRecovered = 0;
        let response = [];
        result.forEach((item) => {
          if (req.headers.type === "daily") {
            console.log("daily");
            if (
              item.Date.split("/")[0] == req.headers.date &&
              item.Date.split("/")[1] == req.headers.month &&
              item.Date.split("/")[2] == req.headers.year
            ) {
              if (item.Type == "Credit") {
                credit += item.Amount;
              } else if (item.Type == "Debit") {
                debit += item.Amount;
              } else if (item.Type == "Lend") {
                lend += item.Amount;
              } else if (item.Type == "Investment") {
                investment += item.Amount;
              } else if (item.Type == "Lend Recovered") {
                lendRecovered += item.Amount;
              }
              response.push(item);
            }
          } else if (req.headers.type === "monthly") {
            console.log("monthly");
            if (
              item.Date.split("/")[1] == req.headers.month &&
              item.Date.split("/")[2] == req.headers.year
            ) {
              if (item.Type == "Credit") {
                credit += item.Amount;
              } else if (item.Type == "Debit") {
                debit += item.Amount;
              } else if (item.Type == "Lend") {
                lend += item.Amount;
              } else if (item.Type == "Investment") {
                investment += item.Amount;
              } else if (item.Type == "Lend Recovered") {
                lendRecovered += item.Amount;
              }
              response.push(item);
            }
          } else if (req.headers.type === "yearly") {
            if (item.Date.split("/")[2] == req.headers.year) {
              if (item.Type == "Credit") {
                credit += item.Amount;
              } else if (item.Type == "Debit") {
                debit += item.Amount;
              } else if (item.Type == "Lend") {
                lend += item.Amount;
              } else if (item.Type == "Investment") {
                investment += item.Amount;
              } else if (item.Type == "Lend Recovered") {
                lendRecovered += item.Amount;
              }
              response.push(item);
            }
          }
        });

        res.json({
          success: true,
          credit: credit,
          debit: debit,
          lend: lend,
          investment: investment,
          lendRecovered: lendRecovered,
          response: response,
        });
      }
    }
  );
});
router.post("/moneyStat/account/update", function (req, res, next) {
  MoneyStats.create(
    {
      userId: req.body.userId,
      AccountBalance: req.body.AccountBalance,
    },
    function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.send(result);
      }
    }
  );
});

const getAccount = (req, res, next) => {
  MoneyStats.findOne(
    {
      userId: req.body.userId,
    },
    function (err, result) {
      if (err) {
        res.send(err);
      } else {
        if (result) {
          next();
        } else {
          MoneyStats.create(
            {
              userId: req.body.userId,
              AccountBalance: 0,
            },
            function (err, result) {
              if (err) {
                res.send(err);
              } else {
                next();
              }
            }
          );
        }
      }
    }
  );
};
const updateBalance = (req, res, next) => {
  if (req.body.Type == "Credit") {
    console.log("here", req.body.userId);

    MoneyStats.findOneAndUpdate(
      { userId: req.body.userId },
      {
        $inc: { AccountBalance: req.body.Amount },
        $push: { transactions: req.body },
      },
      function (err, result) {
        if (err) {
          res.send(err);
        } else {
          // set the result in variable to use in next function
          req.result = result.transactions;

          next();
        }
      }
    );
  } else if (req.body.Type == "Debit") {
    console.log("here too");
    console.log("here", req.body.userId);

    MoneyStats.findOneAndUpdate(
      { userId: req.body.userId },
      {
        $inc: { AccountBalance: -req.body.Amount },
        $push: { transactions: req.body },
      },
      function (err, result) {
        if (err) {
          res.send(err);
        } else {
          next();
        }
      }
    );
  } else if (req.body.Type == "Lend") {
    MoneyStats.findOneAndUpdate(
      { userId: req.body.userId },
      {
        $inc: { AccountBalance: -req.body.Amount },
        $push: { transactions: req.body },
      },
      function (err, result) {
        if (err) {
          res.send(err);
        } else {
          next();
        }
      }
    );
  } else if (req.body.Type == "Investment") {
    MoneyStats.findOneAndUpdate(
      { userId: req.body.userId },
      {
        $inc: { AccountBalance: -req.body.Amount },
        $push: { transactions: req.body },
      },
      function (err, result) {
        if (err) {
          res.send(err);
        } else {
          req.set("data", result.transactions);
          next();
        }
      }
    );
  }
};
router.post(
  "/newTransaction",
  getAccount,
  updateBalance,
  function (req, res, next) {
    res.status(200).json({
      data: req.result,
      message: "Transaction Added Successfully",
      success: true,
    });
  }
);
function deleteTransactionAndRemoveFromAccount(req, res, next) {
  transaction
    .findOne({
      id: req.params.id,
    })
    .then((result) => {
      if (result.Type == "Debit") {
        MoneyStats.findOneAndUpdate(
          { userId: result.userId },
          {
            $inc: { AccountBalance: result.Amount },
            $pop: {
              transactions: {
                id: result.id,
              },
            },
          },
          function (err, result) {
            if (err) {
              res.send(err);
            } else {
              next();
            }
          }
        );
      } else if (result.Type == "Credit") {
        MoneyStats.findOneAndUpdate(
          { userId: result.userId },
          { $inc: { AccountBalance: -result.Amount } },
          function (err, result) {
            if (err) {
              res.send(err);
            } else {
              next();
            }
          }
        );
      } else if (result.Type == "Lend") {
        MoneyStats.findOneAndUpdate(
          { userId: result.userId },
          { $inc: { AccountBalance: result.Amount } },
          function (err, result) {
            if (err) {
              res.send(err);
            } else {
              next();
            }
          }
        );
      } else if (result.Type == "Investment") {
        MoneyStats.findOneAndUpdate(
          { userId: result.userId },
          { $inc: { AccountBalance: result.Amount } },
          function (err, result) {
            if (err) {
              res.send(err);
            } else {
              next();
            }
          }
        );
      } else if (result.Type == "Lend Recovered") {
        next();
      }
    });
}
router.delete(
  "/deleteTransaction/:id",
  deleteTransactionAndRemoveFromAccount,
  function (req, res, next) {
    transaction.findOneAndDelete(
      { id: req.params.id },
      function (err, transaction) {
        if (err) return next(err);
        else {
          res.status(200).json({
            message: "Transaction Deleted Successfully",
            success: true,
          });
        }
      }
    );
  }
);
router.delete("/recoverLendTransaction/:id", function (req, res, next) {
  transaction
    .findOne({
      id: req.params.id,
    })
    .then((result) => {
      MoneyStats.findOneAndUpdate(
        { userId: result.userId },
        { $inc: { AccountBalance: result.Amount } },
        function (err, result) {
          if (err) {
            res.send(err);
          } else {
            transaction.findOneAndUpdate(
              { id: req.params.id },
              { $set: { Type: "Lend Recovered" } },
              function (err, transaction) {
                if (err) return next(err);
                else {
                  res.status(200).json({
                    message: "Transaction Deleted Successfully",
                    success: true,
                  });
                }
              }
            );
          }
        }
      );
    });
});
router.delete("/deleteAll", function (req, res, next) {
  transaction.deleteMany({}, function (err, transaction) {
    if (err) return next(err);
    res.status(200).json({
      message: "All Transactions Deleted Successfully",
      success: true,
    });
  });
});

router.delete("/deleteAll/Accounts", function (req, res, next) {
  MoneyStats.deleteMany({}, function (err, transaction) {
    if (err) return next(err);
    res.status(200).json({
      message: "All Transactions Deleted Successfully",
      success: true,
    });
  });
});

module.exports = router;
