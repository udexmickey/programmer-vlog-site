
var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    _           = require("lodash")
    methodOverride =  require("method-override")

//App config connecting to mongoose     
mongoose.connect("mongodb://localhost:27017/restful_blog_app",  {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false});

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"))

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
            res.render("show", {vlog : vlog})      
        } else{
            console.log("error in the show page" + err)
        }
    })
})

//This route direct us to the form input of editing a post
//this route helps to find back the particlar data we want to edit in the form
app.get("/blogs/:id/edit", (req, res)=>{
    const parameterID = req.params.id;

    Blog.findOne({title: parameterID}, (err, foundBlog)=>{
        if(!err){
            res.render("edit", {blog: foundBlog})
        } else{
            res.send(err);
        }
    }) 
})

// The PUT verbs route helps to edit and submit the editted post
app.put("/blogs/:id", (req, res)=>{

    const parameterID = _.capitalize(req.params.id);
    const title = _.capitalize(req.body.title);
    const image = req.body.image;
    const body  = req.body.body;
 
    Blog.findOneAndUpdate({title : parameterID},
        {title: title, image : image, body: body},
        {overwrite : true}, (err, blog)=>{
            console.log("update Still in process")
        if(!err){
            console.log("updated!!!")
            res.redirect("/blogs/" + title)
        } else{
            console.log("not available")
            console.log(err)
            res.redirect("/blogs") 
        }
    })
})
 
// The Delete verbs route helps to delete the editted post and redirect back to the home routes

app.delete("/blogs/:id", (req, res)=>{
    const parameterID = _.capitalize(req.params.id);
    Blog.findOneAndDelete({title : parameterID}, (err)=>{
        if(!err){
            console.log("Delete post")
            res.redirect("/blogs")
        } else {
            console.log("Can't delete post")
        }
    })
})


app.get("*", (req, res)=>{
    res.send("Sorry page not now")
})
// Localhost is on PORT  8000;
var PORT = 3000;
app.listen(PORT, (err)=>{
        console.log("Server has STARTED at PORT 8000");
})