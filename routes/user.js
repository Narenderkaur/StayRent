const express = require('express');
const router = express.Router();
const User = require('../models/user'); // Import the User model
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');
const userController = require('../controllers/user');

router.route('/signup')
    .get(userController.renderSigupForm)
    .post(userController.signup)

router.route('/login')
    .get(userController.renderLoginForm)//Login page
    .post(saveRedirectUrl,//passport.authenticate() and passport itself checks if credentials are correct
    passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
    userController.login);

router.get('/logout',userController.logout);

module.exports = router;