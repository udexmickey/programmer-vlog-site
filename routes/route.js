import express from "express";
const route = express.Router();
import Blog from "../models/blogs.js"
import _ from "lodash";

//RESTful Routes Config Sections

//Read Route
//This the route 
route.get("/", (req, res)=>{
    Blog.find({}, (err, blogs)=>{
        if(!err){
            res.render("index", {blogs : blogs}) 
        } else{
            console.log(err + " on site")
        }
    })  
});
   
route.get("/new", (req, res)=>{
    res.render("new")
})

//Create Route
//this route helps to Post new particlar data 
route.post("/", (req, res )=>{
    const title = _.capitalize(req.body.title);
    const image = req.body.image;
    const body  = req.body.body;

    Blog.create({
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
route.get("/:id", (req, res)=>{
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
route.get("/:id/edit", (req, res)=>{
    const parameterID = req.params.id;

    Blog.findOne({_id: parameterID}, (err, foundBlog)=>{
        if(!err){
            res.render("edit", {blog : foundBlog})
        } else{
            res.send(err);
        }
    }) 
})

//Update Route
// The PUT verbs route helps to edit and submit the editted post
route.put("/:id", (req, res) => {
    const parameterID = req.params.id;
    const title = _.capitalize(req.body.title);
    const image = req.body.image;
    const body  = req.body.body;
 
    Blog.findOneAndUpdate({_id: parameterID},
        {title: title, image : image, body: body},
        {overwrite : true}, (err, blog)=>{
        if(!err){
            res.redirect("/" + parameterID)
        } else{
            console.log(err)
            res.redirect("/") 
        }
    })
})

//Delete Route
// The Delete verbs route helps to delete the editted post and redirect back to the home routes
route.delete("/blogs/:id", (req, res)=>{
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

export default route;