const {body} = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs');


exports.loginValidators = [
    body('email')
        .isEmail()
        .withMessage('Введите корректный email')
        .custom(async (email, {req}) => {
            try {
                const candidate = await User.findOne({email});
                if (!candidate) {
                    return Promise.reject('Такого пользователя не существует')
                }
            } catch (e) {
                console.log(e);
            }
        }),
    body('password', 'Неверный пароль')
        .isLength({min: 6, max: 56})
        .isAlphanumeric()
        .custom(async (password, {req}) => {
            try{
                const user = await User.findOne({email: req.body.email});

                if (!user){
                    return Promise.reject('Такого пользователя не существует')
                }
                const isSamePass = await bcrypt.compare(password, user.password);

                if (!isSamePass){
                    return Promise.reject('Неверный пароль')
                }
            }catch (e) {
                console.log(e);

            }
        })

]

exports.registerValidators = [
    body('email')
        .isEmail()
        .withMessage('Введите корректный email')
        .custom(async (email, {req}) => {
            try {
                const candidate = await User.findOne({email: email})
                if (candidate) {
                    return Promise.reject('Такой email уже занят')
                }
            } catch (e) {
                console.log(e);
            }
        })
        .normalizeEmail(),
    body('password', 'Пароль должен быть минимум шесть символов')
        .isLength({min: 6, max: 56})
        .isAlphanumeric()
        .trim(),
    body('repeat')
        .custom((repeat, {req}) => {
            if (repeat !== req.body.password) {
                throw new Error('Пароли должны совпадать')
            }
            return true;
        })
        .trim(),
    body('name')
        .isLength({min: 3})
        .withMessage('Имя должно быть минимум три символа')
        .trim()
]

exports.courseValidators = [
    body('title')
        .isLength({min: 3})
        .withMessage('Минимальная длина названия три символа')
        .trim(),
    body('price')
        .isNumeric()
        .withMessage('Введите корректную цену'),
    body('img', 'Введите корректный Url картинки')
        .isURL()
]