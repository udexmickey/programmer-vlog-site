import dotenv from "dotenv";
dotenv.config({ silent: process.env.NODE_ENV})
import express from "express"; 
import bodyParser from "body-parser";
import mongoose from "mongoose";
import _ from "lodash";
import methodOverride from "method-override"; 
const app         = express();
import blogRoute from "./routes/route.js"
 
//App config connecting to mongoose     
mongoose.connect(process.env.MYDATASTORAGE, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false})
    .then(res => console.log("App is connected to db "))
    .catch(err => console.log("can't seem to find Appropriate DB at this time"))
 
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method")) 
app.use("/blogs", blogRoute);

// app.get("*", (req, res)=>{ return res.status(404).json("Sorry page not now") })
   
// Localhost is on PORT  3000; 
var PORT = 3000;
app.listen(PORT, (err)=> { console.log("Server has STARTED at PORT 3000") })