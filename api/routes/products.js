const express = require('express');
var path    = require('path');
const router = express.Router();
const mongoose = require('mongoose');
//const checkAuth = require('../middleware/check-auth');


// upload image
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      // cb(null, './uploads/');  
      cb(null, __dirname+'/uploads');
    },
    filename: function(req, file, cb) {
      cb(null, new Date().toISOString() + file.originalname);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };
  
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
  });

  
const ProductData = require('../models/product');

// Handle incoming GET request to /products
//router.get('/', checkAuth, (req, res, next) => {
router.get('/', (req, res, next) => {
    ProductData.find()
    .select('name price _id')
    .exec()
    .then( docs =>{
        const response = {
           count: docs.length,
            products: docs.map(doc => {
                return {
                        name: doc.name,
                        price:doc.price,
                        _id: doc._id,
                        request: {
                                type: 'GET',
                                url: 'http://localhost:3000/product/' + doc._id
                        }
                    }
            })
        }    
        // console.log(docs);
        // res.status(200).json(docs);
        res.status(200).json(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    // res.status(200).json({
    //     message: 'Handling GET request to / products'
    // });
});

router.post('/', (req, res, next) =>{ 

    // const product = {
    //     name: req.body.name,
    //     price: req.body.price
    // };
    const product = new ProductData({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    }); 

    // save is a method which is provided by mongoose
    product
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created product successfully"',
            createdProduct : {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                type: 'GET',
                url: 'http://localhost:3000/products/' + result._id
	       	 }

            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });

});


router.get('/:productId', (req, res, next) =>{
        const id = req.params.productId;
        ProductData.findById(id)
        .select('name price')
        .exec()
        .then(doc => {

            if(doc){
            console.log(" from database", doc);
                res.status(200).json({
                product: doc,
                request: {
                type: 'GET',
                url: 'http://localhost:3000/products /'
                }
               });
            }else{
                res.status(404).json({
                    message : 'No valid entry found for provided ID'
                });
            }
            
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

router.patch('/:productId', (req, res, next) =>{
   const id = req.params.productId;
   const updateOps = {};
   for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
   }
   // product.update({_id: id}, { $set {name: req.body.newName, price: req.body.newPrice}})
   ProductData.update({_id: id}, { $set: updateOps })
   .exec()
   .then(result =>{
       res.status(200).json({
           message: 'Product updateed',
           request: {
               type: 'GET',
               url: 'http://localhost:3000/products/' + id,
           }
       });
   })
   .catch(err => {
       console.log(err);
       res.status(500).json({
                error: err
       })
   })
});

router.delete('/:productId', (req, res, next) =>{
    const id = req.params.productId;
    ProductData.remove({ _id: id})
    .exec()
    .then( result => {
        res.status(200).json( {
            message: {
                type: 'GET',
                url: 'http://localhost:3000/products',
                body: { name: 'String', price: 'Number'}
            }

        });
    })
    .catch( err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    }); 
    // res.status(200).json({
    //     message: 'deleted product! '
    // })
});




router.post('/uploadimage', upload.single('productImage'), (req, res, next) =>{

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path 
      });
      product
        .save()
        .then(result => {
          console.log(result);
          res.status(201).json({
            message: "Created product successfully",
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: "http://localhost:3000/products/" + result._id
                }
            }
          });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            error: err
          });
        });
});


module.exports = router;