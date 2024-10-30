const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { Pros, Customers, Authentication } = require('../models');
const router = express.Router();

// Pro Login
router.post('/pro/login', [
  body('email').isEmail(),
  body('password').exists(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const pro = await Pros.findOne({ where: { email } });
    if (!pro) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const authRecord = await Authentication.findOne({ where: { pro_id: pro.pro_id } });
    if (!authRecord || !authRecord.hashed_password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, authRecord.hashed_password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: pro.pro_id, email: pro.email, role: 'pro' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
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
    const customer = await Customers.findOne({ where: { email } });
    if (!customer) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const authRecord = await Authentication.findOne({ where: { customer_id: customer.customer_id } });
    if (!authRecord || !authRecord.hashed_password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, authRecord.hashed_password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: customer.customer_id, email: customer.email, role: 'customer' },
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
