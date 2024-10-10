const express = require('express');
const router = express.Router();
const { Customers } = require('../models');

// GET all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customers.findAll();
    res.json(customers);
  } catch (err) {
    console.error('Error details:', err);
    res.status(500).json({ error: 'Failed to retrieve customers.' });
  }
});

// POST a new customer
router.post('/', async (req, res) => {
  try {
    const customer = await Customers.create(req.body);
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create customer.' });
  }
});

// GET a specific customer by ID
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customers.findByPk(req.params.id);
    if (customer) {
      res.json(customer);
    } else {
      res.status(404).json({ error: 'Customer not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve customer.' });
  }
});

// PUT update a customer
router.put('/:id', async (req, res) => {
  try {
    const customer = await Customers.findByPk(req.params.id);
    if (customer) {
      await customer.update(req.body);
      res.json(customer);
    } else {
      res.status(404).json({ error: 'Customer not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update customer.' });
  }
});

// DELETE a customer
router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customers.findByPk(req.params.id);
    if (customer) {
      await customer.destroy();
      res.json({ message: 'Customer deleted.' });
    } else {
      res.status(404).json({ error: 'Customer not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete customer.' });
  }
});

module.exports = router;
