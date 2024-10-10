const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./models'); // Adjust path if necessary

const app = express();
app.use(bodyParser.json()); // Parse JSON requests

const port = process.env.PORT || 3000;

// Sync database
sequelize.sync().then(() => {
  console.log('Database connected.');
}).catch(err => {
  console.log('Error connecting to the database: ', err);
});

// Routes
const golfRoutes = require('./routes/golfRoutes');
const customerRoutes = require('./routes/customerRoutes');
const proRoutes = require('./routes/proRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const courseRoutes = require('./routes/courseRoutes');

// Use routes
app.use('/golf', golfRoutes);
app.use('/customer', customerRoutes);
app.use('/pro', proRoutes);
app.use('/booking', bookingRoutes);
app.use('/course', courseRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
