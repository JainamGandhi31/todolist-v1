const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require("mongoose")
const _ = require("lodash");
const dotenv = require("dotenv");



// indicating that we are using ejs as view engine
// as we have set up the view engine, it will automatically go and look for the files in views named folder
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

dotenv.config();

mongoose.connect(`mongodb+srv://jainam_gandhi:${process.env.DB_PASSWORD}@cluster0.be8niub.mongodb.net/todolistDB`);

const itemsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Task can not be empty"]
    }
});

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
})

//Remember whenever we are creating mongoose model, it is usually capitalized
const Item = mongoose.model("Item", itemsSchema);
const List = mongoose.model("List",listSchema);

const item1 = new Item({
    name: "Welcome to your todo list!"
})
const item2 = new Item({
    name: "Hit the + button to add a new task"
})
const item3 = new Item({
    name: "<-- Hit this to delete a task"
})

const defaultItems = [item1, item2, item3];


app.get("/", (req, res) => {

    //Note that find() returns an array back and hence we can check its length, but in case of findOne() a document is returned, so we have to check if(!doc) then it doesn't exist
    Item.find({}).exec((err, foundItems) => {

        if (foundItems.length === 0) {
            // Add default items in the list
            Item.insertMany(defaultItems,(err, docs)=>{
                if(err){
                    console.log(err);
                }
                else{
                    console.log("Successfully added default tasks to the database");
                }
            });
            res.redirect("/")      
        }
        else{
            // Show already existing list
            res.render("list", { listTitle: "Today", items: foundItems, postPath: "/" });
        }
    })
});


app.post("/", (req, res) => {
    let itemName = req.body.newItem;

    const item = new Item({
        name: itemName
    })

    item.save();
    res.redirect("/");
});

app.post("/delete",(req,res)=>{
    // finding listName and the item's id for which checkbox is checked
    const listName = req.body.listName;
    const checkedItemId = req.body.checkbox;


    if(listName === "Today"){

        Item.findByIdAndRemove(checkedItemId).exec((err)=>{
            if(err){
                console.log(err);
            }
            else{
                console.log("Item deleted successfully")
                res.redirect("/");
            }
        });
    }
    else{
        //MIMP: see how we have given arguments
        List.findOneAndUpdate({name: listName},{$pull:{items: {_id: checkedItemId}}}).exec((err)=>{
            if(!err){
                res.redirect(`/${listName}`);
            }
        });
    }

})

//Creating dynamic routes using express
// Showing different lists based on the path
app.get("/:customListName", (req, res) => {
    const customListName =  _.capitalize(req.params.customListName);

    List.findOne({name: customListName}).exec((err,foundList)=>{
        if(!err){
            //findOne() method returns a document hence we have to check if it is null or not
            if(!foundList){ 

                //create a new list
                const list = new List({
                    name: customListName,
                    items: defaultItems
                })
            
                list.save();
                res.redirect(`/${customListName}`);
            }
            else{
                //show an existing list
                res.render("list", { listTitle: foundList.name, items: foundList.items, postPath: `/${foundList.name}` });
            }
        }
    })
    
 
})

app.post("/:customListName", (req, res) => {
    let item = new Item({
        name: req.body.newItem
    });
    let customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName}).exec((err,foundList)=>{
        if(!err){ 
            foundList.items.push(item);
            foundList.save(); //note that this will update the existing list and will not create new list
            res.redirect(`/${customListName}`)
        }
    })
})


app.get("/about", (req, res) => {
    res.render("about");
})

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running at port 3000");
})