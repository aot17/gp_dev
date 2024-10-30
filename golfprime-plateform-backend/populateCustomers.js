const bcrypt = require('bcryptjs');
const { Customers, Authentication } = require('./models');  // Adjust path if needed
const sequelize = require('./models').sequelize;

async function populateCustomers() {
  try {
    await sequelize.sync({ force: false }); // Ensure tables are synced

    // Sample customer data
    const customers = [
      { first_name: 'Jane', last_name: 'Doe', gender: 'female', email: 'jane.doe@example.com', phone: '123-456-7890', password: 'password123' },
      { first_name: 'John', last_name: 'Smith', gender: 'male', email: 'john.smith@example.com', phone: '987-654-3210', password: 'password123' }
    ];

    for (const customerData of customers) {
      // Step 1: Create a new customer
      const { password, ...customerInfo } = customerData;
      const customer = await Customers.create(customerInfo);

      // Step 2: Hash the customer's password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Step 3: Store hashed password in Authentication table
      await Authentication.create({
        customer_id: customer.customer_id,  // Link to the customer
        hashed_password: hashedPassword,
      });

      console.log(`Added customer ${customer.first_name} ${customer.last_name} with hashed password.`);
    }

    console.log('Customer population complete.');
  } catch (error) {
    console.error('Error populating customers:', error);
  } finally {
    await sequelize.close();
  }
}

populateCustomers();
