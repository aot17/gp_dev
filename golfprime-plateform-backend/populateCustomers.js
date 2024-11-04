const bcrypt = require('bcryptjs');
const { Customers, Authentication } = require('./models');  // Adjust path if needed
const sequelize = require('./models').sequelize;

async function populateCustomers() {
  try {
    await sequelize.sync({ force: false }); // Ensure tables are synced

    const customers = [
      { first_name: 'Jane', last_name: 'Doe', gender: 'female', email: 'jane.doe@example.com', phone: '123-456-7890', password: 'password123' },
      { first_name: 'John', last_name: 'Smith', gender: 'male', email: 'john.smith@example.com', phone: '987-654-3210', password: 'password123' }
    ];

    for (const customerData of customers) {
      const { password, ...customerInfo } = customerData;

      // Step 2: Hash the customer's password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Step 3: Store hashed password in Authentication table
      const authRecord = await Authentication.create({
        hashed_password: hashedPassword,
        role: 'customer'  // Specify role
      });

      // Step 4: Create a new customer record linked to the auth_id
      await Customers.create({
        ...customerInfo,
        auth_id: authRecord.auth_id  // Link auth_id
      });

      console.log(`Added customer ${customerInfo.first_name} ${customerInfo.last_name} with hashed password.`);
    }

    console.log('Customer population complete.');
  } catch (error) {
    console.error('Error populating customers:', error);
  } finally {
    await sequelize.close();
  }
}

populateCustomers();
