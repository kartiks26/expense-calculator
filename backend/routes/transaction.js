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
router.get("/getAll", function (req, res, next) {
  transaction.find({
    
  }, function (err, result) {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
});
router.get("/getCredit/:type", function (req, res, next) {
  transaction.aggregate(
    [{ $match: { Type: req.params.type } }],
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

router.post("/moneyStat/account/update", function (req, res, next) {
  MoneyStats.create(
    {
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
      { $inc: { AccountBalance: req.body.Amount } },
      function (err, result) {
        if (err) {
          res.send(err);
        } else {
          next();
        }
      }
    );
  } else if (req.body.Type == "Debit") {
    console.log("here too");
    console.log("here", req.body.userId);

    MoneyStats.findOneAndUpdate(
      { userId: req.body.userId },
      { $inc: { AccountBalance: -req.body.Amount } },
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
      { $inc: { AccountBalance: -req.body.Amount } },
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
      { $inc: { AccountBalance: -req.body.Amount } },
      function (err, result) {
        if (err) {
          res.send(err);
        } else {
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
    transaction.create(req.body, function (err, transaction) {
      if (err) {
        res.status(400).json({
          message: "Could Not Add Transaction",
          success: false,
        });
      } else {
        res.status(200).json({
          data: transaction,
          message: "Transaction Added Successfully",
          success: true,
        });
      }
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
          { $inc: { AccountBalance: result.Amount } },
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
