//Import the dependencies
const express = require("express");
const mongoose = require("mongoose");

//Creating a Router
var router = express.Router();
//Link
const Inventory = mongoose.model("Inventory");

//Router Controller for READ request
router.get("/", (req, res) => {
  res.render("inventory/addOrEdit", {
    viewTitle: "Insert Item in Inventory",
  });
});

//Router Controller for UPDATE request
router.post("/", (req, res) => {
  if (req.body._id == "") insertIntoMongoDB(req, res);
  else updateIntoMongoDB(req, res);
});

//Creating function to insert data into MongoDB
function insertIntoMongoDB(req, res) {
  const {
    itemName,
    quantity,
    unitPrice,
    dateReceived,
    users,
    total = quantity * unitPrice,
  } = req.body;
  const inputModel = {
    itemName,
    quantity,
    unitPrice,
    dateReceived,
    users,
    total,
  };
  const inventory = new Inventory(inputModel);

  inventory.save((err, doc) => {
    if (!err) {
      res.redirect("inventory/list");
    } else {
      if (err.name == "ValidationError") {
        handleValidationError(err, req.body);
        res.render("inventory/addOrEdit", {
          viewTitle: "Insert Item Name",
          inventory: req.body,
        });
      } else {
        console.log("Error during record insertion : " + err);
      }
    }
  });
}

//Router to retrieve the complete list of available items
router.get("/list", (req, res) => {
  Inventory.find((err, docs) => {
    if (!err) {
      res.render("inventory/list", {
        list: docs,
      });
    } else {
      console.log("Failed to retrieve the Item List: " + err);
    }
  }).lean(); // This is important for converting to JSON
});

//Creating a function to implement input validations
function handleValidationError(err, body) {
  for (field in err.errors) {
    switch (err.errors[field].path) {
      case "itemName":
        body["itemNameError"] = err.errors[field].message;
        break;

      default:
        break;
    }
  }
}

//Creating a function to update data in MongoDB
function updateIntoMongoDB(req, res) {
  Inventory.findOneAndUpdate(
    { _id: req.body._id },
    req.body,
    { new: true },
    (err, doc) => {
      if (!err) {
        res.redirect("inventory/list");
      } else {
        if (err.name == "ValidationError") {
          handleValidationError(err, req.body);
          res.render("inventory/addOrEdit", {
            //Retaining value to be displayed in the child view
            viewTitle: "Update Inventory Details",
            inventory: req.body,
          });
        } else console.log("Error during updating the record: " + err);
      } //update total errors
    }
  );
}

//Router to update a course using it's ID
router.get("/:id", (req, res) => {
  Inventory.findById(req.params.id, (err, doc) => {
    if (!err) {
      res.render("inventory/addOrEdit", {
        viewTitle: "Update Item Details",
        inventory: doc,
      });
    }
  }).lean(); // This is important for converting to JSON
});

//Router Controller for DELETE request
router.get("/delete/:id", (req, res) => {
  Inventory.findByIdAndRemove(req.params.id, (err, doc) => {
    if (!err) {
      res.redirect("/inventory/list");
    } else {
      console.log("Failed to Delete Course Details: " + err);
    }
  });
});

module.exports = router;
