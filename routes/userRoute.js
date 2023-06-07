const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const { storeReturnTo } = require('../middleware');

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', async(req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ username: username, email: email });
        const newUser = await User.register(user, password);
        req.login(newUser, err => {
            if (err) {
                return next(err);
            }
            req.flash('success', 'Welcome New User!');
            res.redirect('/places');
        })
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('register');
    }
})

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', storeReturnTo, passport.authenticate(('local'), { failureRedirect: '/login', failureFlash: true }), (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = res.locals.returnTo || '/places';
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'You have logged out. Goodbye!');
        res.redirect('/places');
    })
})

module.exports = router;