const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

// How the table will look like.

const blogSchema = new Schema({
    title:
        {
            type: 'string',
            required: true   
        },
    snippet: 
        {
            type: 'string',
            required: true
        },
    body: 
        {
            type: 'string',
            required: true
        }
},{timestamps: true});

// Defining Model            ^ This should be singular of our collection(Table) name.
const Blog =  mongoose.model('Blog',blogSchema);   

// exporting this model to use elsewhere in project.
// Where it is used?
// It is used in blogroutes.js file. 
// const Blog = require('../models/blog');

module.exports = Blog;   
