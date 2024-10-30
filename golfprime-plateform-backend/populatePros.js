const bcrypt = require('bcryptjs');
const { Pros, Authentication } = require('./models');  // Adjust path if necessary
const sequelize = require('./models').sequelize;

async function populatePros() {
  try {
    await sequelize.sync({ force: false }); // Ensure tables are synced

    // Sample pro data
    const pros = [
      { first_name: 'Alice', last_name: 'Smith', gender: 'female', email: 'alice.smith@example.com', phone: '111-222-3333', password: 'password123' },
      { first_name: 'Bob', last_name: 'Brown', gender: 'male', email: 'bob.brown@example.com', phone: '444-555-6666', password: 'password123' }
    ];

    for (const proData of pros) {
      const { password, ...proInfo } = proData;

      // Step 1: Create a new pro record
      const pro = await Pros.create(proInfo);

      // Step 2: Hash the pro's password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Step 3: Store hashed password in Authentication table
      await Authentication.create({
        pro_id: pro.pro_id,  // Link to the pro
        hashed_password: hashedPassword,
      });

      console.log(`Added pro ${pro.first_name} ${pro.last_name} with hashed password.`);
    }

    console.log('Pro population complete.');
  } catch (error) {
    console.error('Error populating pros:', error);
  } finally {
    await sequelize.close();
  }
}

populatePros();
