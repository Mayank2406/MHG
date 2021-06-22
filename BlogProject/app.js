const express = require('express');
const mongoose = require('mongoose');

// importing it from routes folder.
const blogRoutes = require('./routes/blogRoutes');

// express app
const app = express();

// connect to mongoDB
const dbUrl = "mongodb+srv://m2406:whJaqTam7AwRUut@cluster0.9gkt2.mongodb.net/node-tuts";

mongoose.connect(dbUrl,{useNewUrlParser:true,useUnifiedTopology:true})
.then((result) => app.listen(3000, () =>{
    console.log('listening on port 3000');
}))
.catch((err) => {console.log(err)})


// EJS is used for Dynamic content:
app.set('view engine', 'ejs');

// to beautify the json:
app.set('json spaces', 2);

// Middleware:
app.use(express.static('public'));

// This middleware basically parse the incoming data ( that we are sending it from form).
// express.urlencoded() is a method inbuilt in express to recognize the incoming Request Object as strings or arrays.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Because of this we are able to make all those requset (i.e. GET,POST,PUT) ETC.
app.use('/blogs', blogRoutes);


// routes:
app.get("/",(req,res)=>{
    res.redirect('/blogs')
});

app.get("/about",(req,res)=>{
    res.render('about',{title:'About'});
});

// 404 page:
app.use((req, res)=>{
    res.status(404).render('404',{title:'404'});
});



//  .\mongoimport --uri mongodb+srv://m2406:whJaqTam7AwRUut@cluster0.9gkt2.mongodb.net/ --db MHJ --collection merchants --type json --file \Downloads\_merchant.json
//  .\mongoimport --db test --collection restaurants --drop --file primer-dataset.json
