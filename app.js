var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    _           = require("lodash")
    // methodOverride =  require("method-override")

//App config connecting to mongoose     
mongoose.connect("mongodb://localhost:27017/restful_blog_app",  {useNewUrlParser: true, useUnifiedTopology: true});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
// app.use(methodOverride("_method"))

// Mongoose  schema/model config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
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
 
//this route helps to show back the particlar data we click on the show page
app.get("/blogs/:id", (req, res)=>{
    const parameterID = _.capitalize(req.params.id);
    Blog.findOne({title : parameterID}, (err, vlog)=>{
        if(!err){
            console.log(vlog)           
            console.log("The show page parameterID === title")
            res.render("show", {blog : vlog})      
        } else{
            console.log("error in the show page")
        }
    })
})

//This route also helps to direct us to the form input of editing post
//this route helps to find back the particlar data we want to edit in the form
app.get("/blogs/:id/edit", (req, res)=>{
    const parameterID = req.params.id;

    Blog.findOne({title: parameterID}, (err, foundBlog)=>{
        console.log("the edit site")
        if(!err){
            console.log(foundBlog.title)
            res.render("edit", {blog: foundBlog})
        } else{
            res.send(err);
        }
    }) 
})

//The PUT verbs route helps to edit and submit the editted post
app.put("/blogs/:id", (req, res)=>{
    const parameterID = _.capitalize(req.params.id);
    const title = req.body.title;
    const image = req.body.image;
    const body  = req.body.body;
    console.log("On the site")

    Blog.update({title : parameterID},
        {title: title, image : image, body: body},
        {overwrite : true}, (err, blog)=>{
        if(!err){
            console.log(blog)
            res.redirect("/blogs/" + parameterID)
        } else{
            console.log("not available")
        }
    })
})
 
// Localhost is on PORT  8000;
var PORT = 3000;
app.listen(PORT, (err)=>{
        console.log("Server has STARTED at PORT 8000");
})