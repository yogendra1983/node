const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) =>{

    res.status(200).json({
        message: 'Handling GET request to / users'
    });
});

router.post('/', (req, res, next) =>{

    res.status(200).json({
        message: 'Handling POST request to / user'
    });
});


router.get('/:userId', (req, res, next) =>{
        const id = req.params.productId;
        if(id ==='special'){

            res.status(200).json({
                message: 'You discovered the special user ID',
                id: id
            })


        }else{
            res.status(200).json({
                message: 'you passed an user ID'
            })
        }
});

router.patch('/:userId', (req, res, next) =>{
    res.status(200).json({
        message: 'updated user profiles! '
    })
});

router.delete('/:userId', (req, res, next) =>{
    res.status(200).json({
        message: 'deleted user! '
    })
});

module.exports = router;