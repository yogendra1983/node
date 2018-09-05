const express = require('express');
const  app = express();
const morgan = require('morgan');  // middleware
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const empRoutes = require('./api/routes/emp');
const orderRoutes = require('./api/routes/order');
const userRoutes = require('./api/routes/user');

// connect to database

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://' +process.env.MONGO_LAB_PW +'@ds163300.mlab.com:63300/web_db');

//on connection

mongoose.connection.on('connected', () => {
    console.log('Connection to database mongodb @mlab');
});

mongoose.connection.on('error', (err) => {
    if(err){
        console.log('Error in database connection'+ err);
    }    
});

app.use(morgan('dev'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// use to cros handling

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
  });

// Router which should handle requests

app.use('/products', productRoutes);
app.use('/emp', empRoutes);
app.use('/orders', orderRoutes);
app.use("/user", userRoutes);



app.use((req, res, next) =>{
    const error = new Error('Not found');
    error.status = 404;
    next(error);
})

// any error of project also database error
app.use((error, req, res, next) =>{
    res.status(error.status || 500);
    res.json({ 
        error:{
            message: error.message
        }
    });
   
});


// app.use((req, res, next) =>{
//     res.status(200).json({
//         message:'working to node js framework!'
//     });
// });


module.exports = app;