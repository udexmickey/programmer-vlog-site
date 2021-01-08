import mongoose from "mongoose"
import validate from "validate.js";

function Blog(){
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

blogSchema.path('image').validate((val) => {
    const urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
    return urlRegex.test(val);
}, 'Invalid URL.');

    return Blog = mongoose.model("Blog", blogSchema);
}


export default Blog();