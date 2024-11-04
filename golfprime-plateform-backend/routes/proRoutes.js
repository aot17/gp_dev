const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // middleware to enforce authentication and role-based access control
const { Pros } = require('../models');

// GET all pros
router.get('/', async (req, res) => {
  try {
    const pros = await Pros.findAll({
      attributes: ['pro_id', 'first_name', 'last_name', 'email', 'phone', 'gender'], // Exclude sensitive data
    });
    res.json(pros);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve pros.' });
  }
});

// POST a new pro
router.post('/', async (req, res) => {
  const { first_name, last_name, email, phone, gender, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the Authentication record
    const auth = await Authentication.create({
      hashed_password: hashedPassword,
      role: 'pro',
    });

    // Create the pro record linked to Authentication
    const pro = await Pros.create({
      first_name,
      last_name,
      email,
      phone,
      gender,
      auth_id: auth.auth_id,
    });

    res.json(pro);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create pro.' });
  }
});

// GET a specific pro by ID
router.get('/:id', authMiddleware(['pro']), async (req, res) => {
  try {
    const pro = await Pros.findByPk(req.params.id, {
      attributes: ['pro_id', 'first_name', 'last_name', 'email', 'phone', 'gender'],
    });
    if (pro) {
      res.json(pro);
    } else {
      res.status(404).json({ error: 'Pro not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve pro.' });
  }
});

// PUT update a pro
router.put('/:id', authMiddleware(['pro']), async (req, res) => {
  const { password, ...proData } = req.body;

  try {
    const pro = await Pros.findByPk(req.params.id);
    if (pro) {
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await Authentication.update(
          { hashed_password: hashedPassword },
          { where: { auth_id: pro.auth_id } }
        );
      }
      await pro.update(proData);
      res.json(pro);
    } else {
      res.status(404).json({ error: 'Pro not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to update pro.' });
  }
});

// DELETE a pro
router.delete('/:id', async (req, res) => {
  try {
    const pro = await Pros.findByPk(req.params.id);
    if (pro) {
      await pro.destroy();
      res.json({ message: 'Pro deleted.' });
    } else {
      res.status(404).json({ error: 'Pro not found.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete pro.' });
  }
});

module.exports = router;
