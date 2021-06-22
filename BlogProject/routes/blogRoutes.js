const express = require('express');
const blogController = require('../controllers/blogController');
const router  = express.Router();   

// Blog Routes:

// To get all the blogs:
router.get("/",blogController.blog_index)
  
 // To add a new blog:
router.post('/',blogController.blog_create_post);
 
 // To create a form:
router.get("/create",blogController.blog_create_get); 
 
 // To view one of the blog :  
router.get("/:id",blogController.blog_details);

  
 // exporting it:
 
// Where it is used?
// it is imported in app.js 
// const blogRoutes = require('./routes/blogRoutes');

 module.exports = router;