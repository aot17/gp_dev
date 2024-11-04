const express = require('express');
const bcrypt = require('bcryptjs'); // use to hash passwords and compare them securely
const jwt = require('jsonwebtoken'); // use to create and verify JSON Web Token (JWT)
const { body, validationResult } = require('express-validator'); // Middleware for validating and sanitizing input
const { Pros, Customers, Authentication } = require('../models');
const router = express.Router();

// Pro Login
router.post('/pro/login', [ // define a route for HTTP post request made to the URL '/pro/login'. When the server recieves a POST request to '/pro/login', this routes handler is invoked.
  body('email').isEmail(),
  body('password').exists(),
], async (req, res) => {
  const errors = validationResult(req); // validation of the body (email and password)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body; // extract email and password from the request body

  try {
    const pro = await Pros.findOne({
      where: { email },
      include: [{model:Authentication}] 
    }); // looks up the pro by their email

    if (!pro || !pro.Authentication) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, pro.Authentication.hashed_password); // compare the provided password with hashed password
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign( // Creates a JWT containing the userId (based on pro_id), email and role
      { userId: pro.pro_id, email: pro.email, role: pro.Authentication.role },
      process.env.JWT_SECRET, // sign the token
      { expiresIn: process.env.JWT_EXPIRATION } // set an expiration time
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Customer Login
router.post('/customer/login', [
  body('email').isEmail(),
  body('password').exists(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Invalid input', errors: errors.array() });  }

  const { email, password } = req.body;

  try {
    const customer = await Customers.findOne({
      where: { email },
      include: [{model: Authentication}]
    });

    if (!customer || !customer.Authentication) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, customer.Authentication.hashed_password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: customer.customer_id, email: customer.email, role: customer.Authentication.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
