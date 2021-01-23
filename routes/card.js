const {Router} = require('express');
const router = Router();
const Course = require('../models/course');
const auth = require('../middleware/auth');



function mapCartItems(cart) {
    return cart.items.map(item => ({
        ...item.courseId._doc, count: item.count, id: item.courseId.id
    }))
}

function computePrice(courses) {
    return courses.reduce((total, course) => {
        return total += course.price * course.count;
    }, 0)
}

router.post('/add', auth, async (req, res) => {
    const course = await Course.findById(req.body.id);

    await req.user.addToCart(course);

    res.redirect('/card');
});

router.delete('/remove:id', auth, async (req, res) => {

    await req.user.removeFromCart(req.params.id);

    const user = await req.user.populate('cart.items.courseId').execPopulate()

    const courses = mapCartItems(user.cart);

    const price = computePrice(courses);

    const cart = {
        courses, price
    }

    res.json(cart);
})


router.get('/', auth, async (req, res) => {

    const user = await req.user
        .populate('cart.items.courseId')
        .execPopulate()


    const courses = mapCartItems(user.cart);

    res.render('card', {
        isCard: true,
        title: 'Корзина',
        courses,
        price: computePrice(courses)
    })
})

module.exports = router;