const {Router} = require('express');
const router = Router();
const Course = require('../models/course');
const auth = require('../middleware/auth');
const {courseValidators} = require('../utils/validators');
const {validationResult} = require('express-validator');


router.get('/', auth, (req, res) => {
    res.render('add', {
        title: 'Добавить курс',
        isAdd: true
    })
})

router.post('/', auth, courseValidators, async (req, res) => {
    try {

        const {title, price, img} = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).render('add', {
                title: 'Добавить курс',
                isAdd: true,
                error: errors.array()[0].msg,
                data: {
                    title,
                    price,
                    img
                }
            })
        }



        const course = new Course({
            title,
            price,
            img,
            userId: req.user
        });

        await course.save();
        res.redirect('/courses');
    } catch (e) {
        console.log(e);
    }
})

module.exports = router;