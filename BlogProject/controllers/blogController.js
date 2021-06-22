// importing blog model
const Blog = require('../models/blog');


// blog_index , blog_details, blog_create_get, blog_create_post

// const blog_index = (req,res) => {
//     Blog.find().sort({createdAt:-1})
//     .then(result=>res.render('index',{title:'All Blogs',blogs:result}))
//     .catch(err=> console.log(err));
// }

const blog_index = (req, res) => {
    Blog.find().sort({ createdAt: -1 })
        .then(result => res.json({ statusCode: res.statusCode, result }))
        .catch(err => console.log(err));

    const mid = req.headers.merchant_id;

    console.log('here is the merchant id:');
    console.log(`${mid} ${'\n'}`);

    const encodedData = Buffer.from(mid).toString('base64');
    console.log(`encoded data is ${encodedData}`);

    const decodedData = Buffer.from(encodedData, 'base64').toString('ascii')
    console.log(`decoded data is ${decodedData}`);
}

// For HTML
// const blog_details = (req, res) => {
//     const id = req.params.id;
//     Blog.findById(id)
//         .then(result => res.render('details', { title: 'Details', blog: result }))
//         .catch(err => console.log(err));
// }

// For JSON
const blog_details = (req, res) => {
    const id = req.params.id;

    Blog.findById(id)
        .then(result => res.json({ statusCode: res.statusCode, title:result.title }))
        .catch(err => res.status(404).json({message: 'No such user',err}));
}


const blog_create_get = (req, res) => {
    res.render('create', { title: 'Create' });
}

const blog_create_post = (req, res) => {
    const blog = new Blog(req.body);
    blog.save()
        .then(result => res.json({ statusCode: res.statusCode, result }))
        .catch(err => console.log(err));
    //    res.send("Data inserted");
}

module.exports =
{
    blog_index, blog_details, blog_create_get, blog_create_post
}
