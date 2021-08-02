require('dotenv').config();

const config = {
    app:{
         port: process.env.PORT
    },
    db:{
       host: "mongodb+srv://m2406:whJaqTam7AwRUut@cluster0.9gkt2.mongodb.net/MHJ"
    } 
}

module.exports = config