const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const date = require(__dirname  + "/date.js")
const app = express();

console.log(date);
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

// indicating that we are using ejs as view engine
// as we have set up the view engine, it will automatically go and look for the files in views named folder
app.set('view engine','ejs');

let items = [], workItems = [];
app.get("/",(req,res)=>{
    
    let currentDate = date.getDate();
    res.render("list",{listTitle: currentDate, items: items, postPath: "/"});
});


app.post("/",(req,res)=>{
    let newItem = req.body.newTask;
    items.push(newItem);
    res.redirect("/");
});


app.get("/work",(req,res)=>{
    let listType = "Work List";

    res.render("list",{listTitle:listType,items:workItems,postPath: "/work"});
})

app.post("/work",(req,res)=>{
    let newItem  = req.body.newTask;
    workItems.push(newItem);
    res.redirect("/work");
})


app.get("/about",(req,res)=>{
    res.render("about");
})

app.listen(3000,()=>{
    console.log("Server is running at port 3000");
})