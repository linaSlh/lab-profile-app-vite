// routes/auth.routes.js

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const router = express.Router();

const { isAuthenticated } = require('./../middleware/jwt.middleware.js'); // <== IMPORT
const saltRounds = 10;

// POST /auth/signup - Creates a new user in the database
router.post('/signup', (req, res, next) => {
    console.log('Request Body:', req.body); // Log the request body
  
    // Extract signup data from request body
 
  const { email,username, password, campus, course } = req.body;

  // Check if the username or password or campus or course is provided as an empty string
  if (username === '' || password === '' || campus === '' || course === ''|| email === '') {
    res
      .status(400)
      .json({ message: 'Provide username, password, campus and course' });
    return;
  }

  // Use regex to validate the password format
  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.status(400).json({
      message:
        'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.',
    });
    return;
  }

  // Check the users collection if a user with the same username already exists
  User.findOne({ username })
    .then((foundUser) => {
      // If the user with the same username already exists, send an error response
      if (foundUser) {
        res.status(400).json({ message: 'User already exists.' });
        return;
      }

      // If the username is unique, proceed to hash the password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashedPassword = bcrypt.hashSync(password, salt);

      // Create a new user in the database
      return User.create({
        email,
        username,
        password: hashedPassword,
        campus,
        course,
      });
    })
    .then((createdUser) => {
      // Deconstruct the newly created user object to omit the password
      const { username, campus, course, _id ,email} = createdUser;

      // Create a new object that doesn't expose the password
      const newUser = { email, username, campus, course, _id };

      // Send a json response containing the user object
      res.status(201).json({ user: newUser });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'Internal Server Error' });
    });
});

// POST  /auth/login
router.post('/login', (req, res, next) => {
  const { username, password } = req.body;

  // Check if username or password are provided as empty string
  if (username === '' || password === '') {
    res.status(400).json({ message: 'Provide username and password.' });
    return;
  }

  // Check the users collection if a user with the same email exists
  User.findOne({ username })
    .then((foundUser) => {
      if (!foundUser) {
        // If the user is not found, send an error response
        res.status(401).json({ message: 'User not found.' });
        return;
      }

      // Compare the provided password with the one saved in the database
      const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

      if (passwordCorrect) {
        // Deconstruct the user object to omit the password
        const { _id, username } = foundUser;

        // Create an object that will be set as the token payload
        const payload = { _id, username };

        // Create and sign the token
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
          algorithm: 'HS256',
          expiresIn: '6h',
        });

        // Send the token as the response
        res.status(200).json({ authToken: authToken });
      } else {
        res.status(401).json({ message: 'Unable to authenticate the user' });
      }
    })
    .catch((err) => res.status(500).json({ message: 'Internal Server Error' }));
});

// GET  /auth/verify  -  Used to verify JWT stored on the client
router.get('/verify', isAuthenticated, (req, res, next) => {
  // If JWT token is valid the payload gets decoded by the isAuthenticated middleware and made available on `req.payload`
  console.log(`req.payload`, req.payload);

  // Send back the object with user data previously set as the token payload
  res.status(200).json(req.payload);
});

module.exports = router;