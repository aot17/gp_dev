// router for handling customer-related routes in the Express app
const express = require('express');
const router = express.Router(); // create a new router object to handle routes for customer-related operations
const authMiddleware = require('../middleware/authMiddleware'); // middleware to enforce authentication and role-based access control
const { Customers, Bookings, Pros, Golfs } = require('../models');

// GET Customer Profile - Restricted to Customers
router.get('/profile', authMiddleware(['customer']), async (req, res) => { // Ensures that only authenticated users with role 'customer' can access this route
  try {
    const customer = await Customers.findByPk(req.user.userId, { // Fetches the customer record by primary key (userId comes from the JWT payload)
      attributes: ['first_name', 'last_name', 'email', 'phone', 'gender'],
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve customer profile' });
  }
});

// GET Customer Bookings - Restricted to Customers
router.get('/bookings', authMiddleware(['customer']), async (req, res) => {
  try {
    const bookings = await Bookings.findAll({
      where: { customer_id: req.user.userId },
      include: [{ model: Pros, attributes: ['first_name', 'last_name'] },
                { model: Golfs, attributes: ['name', 'address'] }
    ]
    });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve bookings' });
  }
});

// POST a new customer
router.post('/', async (req, res) => {
  try {
    const { first_name, last_name, email, phone, gender, password } = req.body;
    
    // Hash password and create Authentication record
    const hashedPassword = await bcrypt.hash(password, 10);
    const auth = await Authentication.create({ hashed_password: hashedPassword, role: 'customer' });
    
    // Create customer with linked auth_id
    const customer = await Customers.create({ first_name, last_name, email, phone, gender, auth_id: auth.auth_id });

    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create customer.' });
  }
});

// PUT update a customer
router.put('/:id', async (req, res) => {
  try {
    const customer = await Customers.findByPk(req.params.id);
    if (customer) {
      const { password, ...customerData } = req.body;
      
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await Authentication.update({ hashed_password: hashedPassword }, { where: { auth_id: customer.auth_id } });
      }
      
      await customer.update(customerData);
      res.json(customer);
    } else {
      res.status(404).json({ error: 'Customer not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update customer.' });
  }
});

// GET all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customers.findAll({
      attributes: ['customer_id', 'first_name', 'last_name', 'email', 'phone', 'gender'], 
    });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve customers.' });
  }
});

// GET a specific customer by ID
router.get('/:id', async (req, res) => { // extract the id of the customer and pass it as param in the req
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
