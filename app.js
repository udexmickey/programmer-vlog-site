// require('mongoose-type-url')
var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    _           = require("lodash"),
    validate    = require("validate.js"),
    validates = require('validates'),
    methodOverride =  require("method-override")

//App config connecting to mongoose     
mongoose.connect("mongodb://localhost:27017/restful_blog_app",  {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"))

// Mongoose  schema/model config
var blogSchema = new mongoose.Schema({
    title:  {
        type: String,
        required: [true, 'Title can\'t be empty']
    },
    image: {
        type: String,
        required: 'URL can\'t be empty',
        unique: true
    },

    body:  {
        type: String,
        required: [true, 'body can\'t be empty']
    },
    created: {type: Date, default: Date.now}
});

blogSchema.path('image').validate((image) => {
    urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
    return urlRegex.test(image);
}, 'Invalid URL.');

var Blog = new mongoose.model("Blog", blogSchema);

// THE CRUD METHODS
// 1. CREATE
// 2. READ
// 3. UPDATE
// 4. DELETE / DESTROY

//RESTful Routes Config Sections
app.get("/", (req, res)=>{
    res.redirect("/blogs")  
})

//Read Route
//This the index route
app.get("/blogs", (req, res)=>{
    Blog.find({}, (err, blogs)=>{
        if(!err){
            res.render("index", {blogs : blogs}) 
        } else{
            console.log(err + " on site")
        }
    })
});
   
app.get("/blogs/new", (req, res)=>{
    res.render("new")
})

//Create Route
//this route helps to Post new particlar data 
app.post("/blogs", (req, res )=>{
    const title = _.capitalize(req.body.title);
    const image = req.body.image;
    const body  = req.body.body;

    Blog.create(
    {
        title: title,
        image: image,
        body: body,
        created: new Date()
         
    }, (err)=>{
        if(!err){
            res.redirect("blogs")
        } else{
            console.log(err)
        }
    })
}) 
 
//Read Route for single blog post
//this route helps to show back the particlar data we click on the show page
app.get("/blogs/:id", (req, res)=>{
    const parameterID = req.params.id;
    Blog.findOne({_id: parameterID}, (err, blog)=>{
        if(!err){
            res.render("show", {blog : blog})      
        } else{
            console.log("error in the show page" + err)
        }
    })
})

//This route direct us to the form input of editing a post
//this route helps to find back the particlar data we want to edit in the form
app.get("/blogs/:id/edit", (req, res)=>{
    const parameterID = req.params.id;

    Blog.findOne({_id: parameterID}, (err, foundBlog)=>{
        if(!err){
            res.render("edit", {blog: foundBlog})
        } else{
            res.send(err);
        }
    }) 
})

//Update Route
// The PUT verbs route helps to edit and submit the editted post
app.put("/blogs/:id", (req, res)=>{
   
    const parameterID = req.params.id;
    const title = _.capitalize(req.body.title);
    const image = req.body.image;
    const body  = req.body.body;
 
    Blog.findOneAndUpdate({_id: parameterID},
        {title: title, image : image, body: body},
        {overwrite : true}, (err, blog)=>{
        if(!err){
            res.redirect("/blogs/" + parameterID)
        } else{
            console.log(err)
            res.redirect("/blogs") 
        }
    })
})

//Delete Route
// The Delete verbs route helps to delete the editted post and redirect back to the home routes
app.delete("/blogs/:id", (req, res)=>{
    const parameterID = req.params.id;
    Blog.findOneAndDelete({_id: parameterID}, (err)=>{
        if(!err){
            console.log("Delete post")
            res.redirect("/blogs")
        } else {
            console.log( `Can't delete post ${err}`)
        }
    })
})

app.get("*", (req, res)=>{
    res.send("Sorry page not now")
})
// Localhost is on PORT  3000;
var PORT = 3000;
app.listen(PORT, (err)=>{
        console.log("Server has STARTED at PORT 3000");
})