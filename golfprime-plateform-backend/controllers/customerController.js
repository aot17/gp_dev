const bcrypt = require('bcryptjs');
const { Customers, Bookings, Pros, Golfs, Authentication } = require('../models');

// Get the customer profile
exports.getProfile = async (req, res) => {
  try {
    const customer = await Customers.findByPk(req.user.id, {
      attributes: ['first_name', 'last_name', 'email', 'phone', 'gender'],
    });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    console.error('Error retrieving customer profile:', error);
    res.status(500).json({ message: 'Failed to retrieve customer profile' });
  }
};

// Get customer bookings (Potential double with bookingCustomerController getAllBookings)
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Bookings.findAll({
      where: { customer_id: req.user.id },
      include: [
        { model: Pros, attributes: ['first_name', 'last_name'] },
        { model: Golfs, attributes: ['name', 'address'] }
      ]
    });
    res.json(bookings);
  } catch (error) {
    console.error('Error retrieving bookings:', error);
    res.status(500).json({ message: 'Failed to retrieve bookings' });
  }
};

// Create a new customer (Signup)
exports.signup = async (req, res) => {
  const { first_name, last_name, gender, email, phone, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const auth = await Authentication.create({ hashed_password: hashedPassword, role: 'customer' });
    const customer = await Customers.create({ first_name, last_name, gender, email, phone, auth_id: auth.auth_id });
    res.status(201).json({ message: 'Customer created successfully', customer });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ message: 'Failed to create customer' });
  }
};

// Update customer profile
exports.updateProfile = async (req, res) => {
  try {
    const customer = await Customers.findByPk(req.user.id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found.' });
    }

    const { password, ...customerData } = req.body;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await Authentication.update({ hashed_password: hashedPassword }, { where: { auth_id: customer.auth_id } });
    }

    await customer.update(customerData);
    res.json({ message: 'Customer profile updated successfully', customer });
  } catch (error) {
    console.error('Error updating customer profile:', error);
    res.status(500).json({ error: 'Failed to update customer profile.' });
  }
};

// Delete customer account
exports.deleteAccount = async (req, res) => {
  try {
    const customer = await Customers.findByPk(req.user.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    await Bookings.destroy({ where: { customer_id: req.user.id } });
    await customer.destroy();
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Failed to delete account' });
  }
};
