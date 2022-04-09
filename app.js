//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// const date = require(__dirname + "/date.js");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemsSchema = new mongoose.Schema ({
  name: String
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item ({
  name: "Welcome to your todolist!"
});

const item2 = new Item ({
  name: "Hit the + button to add a new item."
});

const item3 = new Item ({
  name: "<-- Hit this to delete an item."
});

const defaultItems = [item1, item2, item3]




app.get("/", (req, res)=>{

  // let day = date.getDate();

  Item.find({}, (err, foundItems) => {

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Succesfully saved all items")
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        listTitle: "Today",
        newListItems: foundItems
      });
    }

});



});

app.post("/", (req, res) => {

  const itemName = req.body.newItem;

  const item = new Item ({
    name: itemName
  });

  item.save();

  res.redirect("/");


  // if (req.body.list === "Work"){
  //     workItems.push(item);
  //     res.redirect("/work")
  // } else {
  //     items.push(item);
  //     res.redirect("/");
  // }
});

app.post("/delete", (req, res) => {
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId, (err) => {
    if (!err) {
      console.log("Succesfully deleted checked item.");
      res.redirect("/");
    }
  })



});

app.get("/work", (req, res) => {
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", (req, res) => {
  res.render("about");
});


app.listen(3000, function(){
  console.log("Server started on port 3000");
})
