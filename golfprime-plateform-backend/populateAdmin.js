const bcrypt = require('bcryptjs');
const { Authentication } = require('./models');

(async () => {
  try {
    const existingAdmin = await Authentication.findOne({ where: { role: 'admin' } });
    if (existingAdmin) {
      console.log('Admin user already exists.');
      return;
    }

    const hashedPassword = await bcrypt.hash('passport123', 10);
    await Authentication.create({
      hashed_password: hashedPassword,
      role: 'admin',
    });
    console.log('Admin user created');
  } catch (error) {
    console.error('Error creating admin user:', error);
  }
})();
