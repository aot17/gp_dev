// controllers/proController.js
const bcrypt = require('bcryptjs');
const { Pros, Authentication, ProsCustomers, Customers } = require('../models');

// Get all pros (public data)
exports.getAllPros = async (req, res) => {
  try {
    const pros = await Pros.findAll({
      attributes: ['pro_id', 'first_name', 'last_name', 'email', 'phone', 'gender'],
    });
    res.json(pros);
  } catch (error) {
    console.error('Error retrieving pros:', error);
    res.status(500).json({ error: 'Failed to retrieve pros.' });
  }
};

// Get pro by id (public data)
exports.getProById = async (req, res) => {
  const proId = req.params.id; // Extract pro_id from the request params

  try {

    // Fetch the pro by ID
    const pro = await Pros.findByPk(proId, {
      attributes: ['pro_id', 'first_name', 'last_name', 'email', 'phone', 'gender'], // Limit the attributes to return
    });

    if (!pro) {
      return res.status(404).json({ error: 'Pro not found.' });
    }

    // Return the pro details
    res.json(pro);
  } catch (error) {
    console.error('Error retrieving pros:', error);
    res.status(500).json({ error: 'Failed to retrieve pros.' });
  }
};

// Fetch customers linked to a specific pro
exports.getProCustomers = async (req, res) => {
  const proId = req.user.id; // Extract the pro's ID from the authenticated session

  console.log('Pro ID:', req.user.id); // Log pro ID
  
  try {
    // Fetch customers where a relationship exists in ProsCustomers
    const customers = await ProsCustomers.findAll({
      where: { pro_id: proId }, // Filter relationships by pro_id
      include: [
        {
          model: Customers,
          attributes: ['customer_id', 'first_name', 'last_name', 'email', 'phone'], // Return only necessary fields
        },
      ],
    });
    //console.log('Fetched Customers:', customers); // Log raw customer data

    // Transform the response to only include customer details
    const customerList = customers.map((relation) => ({
      id: relation.Customer.customer_id,
      name: `${relation.Customer.first_name} ${relation.Customer.last_name}`,
      email: relation.Customer.email,
      phone: relation.Customer.phone,
    }));

    //console.log('customerList send :', JSON.stringify(customerList, null, 2)); // Debug log

    res.status(200).json(customerList);
  } catch (error) {
    console.error('Error fetching customers for pro:', error);
    res.status(500).json({ message: 'Failed to fetch customers.', error: error.message });
  }
};

// Create a new pro (admin-only)
exports.createPro = async (req, res) => {
  const { first_name, last_name, email, phone, gender, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const auth = await Authentication.create({
      hashed_password: hashedPassword,
      role: 'pro',
    });

    const pro = await Pros.create({
      first_name,
      last_name,
      email,
      phone,
      gender,
      auth_id: auth.auth_id,
    });

    res.status(201).json(pro);
  } catch (error) {
    console.error('Error creating pro:', error);
    res.status(500).json({ message: 'Failed to create pro' });
  }
};

// Get a specific pro's profile (authenticated pro only)
exports.getProProfile = async (req, res) => {
  try {
    const pro = await Pros.findByPk(req.user.id, {
      attributes: ['pro_id', 'first_name', 'last_name', 'email', 'phone', 'gender'],
    });

    if (!pro) {
      return res.status(404).json({ error: 'Pro not found.' });
    }
    res.json(pro);
  } catch (error) {
    console.error('Error retrieving pro:', error);
    res.status(500).json({ error: 'Failed to retrieve pro.' });
  }
};

// Update a pro's profile (authenticated pro only)
exports.updateProProfile = async (req, res) => {
  const { password, ...proData } = req.body;

  try {
    const pro = await Pros.findByPk(req.user.id);
    if (!pro) {
      return res.status(404).json({ error: 'Pro not found.' });
    }

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      await Authentication.update(
        { hashed_password: hashedPassword },
        { where: { auth_id: pro.auth_id } }
      );
    }

    await pro.update(proData);
    res.json(pro);
  } catch (error) {
    console.error('Error updating pro:', error);
    res.status(500).json({ error: 'Failed to update pro.' });
  }
};

// Delete a pro's profile (authenticated pro only)
exports.deleteProProfile = async (req, res) => {
  try {
    const pro = await Pros.findByPk(req.user.id);
    if (!pro) {
      return res.status(404).json({ error: 'Pro not found.' });
    }

    await pro.destroy();
    res.json({ message: 'Pro deleted.' });
  } catch (error) {
    console.error('Error deleting pro:', error);
    res.status(500).json({ error: 'Failed to delete pro.' });
  }
};
