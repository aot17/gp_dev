// Import necessary modules and dependencies
const express = require('express'); // Import Express to create the server and handle routing.
const session = require('express-session'); // Import express-session for session management.
const passport = require('passport'); // Import Passport for authentication.
const LocalStrategy = require('passport-local').Strategy; // Import Passport's LocalStrategy for email/password auth.
const bcrypt = require('bcryptjs'); // Import bcrypt for hashing and comparing passwords.
const cors = require('cors'); // Allow Cross-Origin Resource Sharing for frontend requests.
const bodyParser = require('body-parser'); // Parse incoming request bodies.
const { sequelize, Pros, Customers, Authentication } = require('./models'); // Import Sequelize models.
require('dotenv').config(); // Import and load environment variables.

const app = express(); // Create an Express app.
const port = process.env.PORT || 3000; // Set the server port from env variables or default to 3000.

app.use(cors({
  origin: 'http://localhost:3001', // Frontend URL
  credentials: true // Allow cookies to be sent
}));
app.use(bodyParser.json()); // Use bodyParser to parse JSON-formatted request bodies.

// Configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET, // The session secret, which should be a secure string from environment variables.
  resave: false, // Avoid resaving session data if nothing changed.
  saveUninitialized: false, // Do not save sessions that are uninitialized.
  cookie: { 
    secure: false, // TO CHANGE IN PROD
    httpOnly: true,
    sameSite: 'lax' // TO CHANGE IN PROD
  }
}));

// Initialize Passport and configure it to use sessions
app.use(passport.initialize()); // Initialize Passport to use it for authentication.
app.use(passport.session()); // Enable session-based storage of authentication information.

// Sync the Sequelize database
sequelize.sync()
  .then(() => {
    console.log('Database connected.');
  })
  .catch(err => {
    console.log('Error connecting to the database: ', err);
  });

// Define Passport Local Strategies for 'pro-local' and 'customer-local'
passport.use('pro-local', new LocalStrategy({
  usernameField: 'email', // Define the field for the username (email in this case).
  passwordField: 'password' // Define the field for the password.
}, async (email, password, done) => {
  try {
    // Find Pro user and associated authentication data by email
    const pro = await Pros.findOne({ where: { email }, include: [Authentication] });
    if (!pro || !pro.Authentication) return done(null, false, { message: 'Invalid credentials' }); // Fail if not found.

    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, pro.Authentication.hashed_password);
    if (!isMatch) return done(null, false, { message: 'Invalid credentials' });

    // Pass the authenticated user object to Passport
    return done(null, { id: pro.pro_id, role: 'pro' });
  } catch (error) {
    return done(error); // Handle errors.
  }
}));

passport.use('customer-local', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    // Find Customer user and associated authentication data by email
    const customer = await Customers.findOne({ where: { email }, include: [Authentication] });
    if (!customer || !customer.Authentication) return done(null, false, { message: 'Invalid credentials' });

    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, customer.Authentication.hashed_password);
    if (!isMatch) return done(null, false, { message: 'Invalid credentials' });

    // Pass the authenticated user object to Passport
    return done(null, { id: customer.customer_id, role: 'customer' });
  } catch (error) {
    return done(error); // Handle errors.
  }
}));

// Serialize and Deserialize User to and from session
passport.serializeUser((user, done) => {
  // Passport stores user data in the session via serializeUser.
  done(null, user); // The `user` object will be stored in the session.
});

passport.deserializeUser((user, done) => {
  // Retrieve the user object from the session.
  console.log('Deserializing user:', user);
  done(null, user); // Re-attach `user` to the request after retrieval from session storage.
});

// Import all routes
const golfRoutes = require('./routes/golfRoutes');
const customerRoutes = require('./routes/customerRoutes');
const proRoutes = require('./routes/proRoutes');
const bookingCustomerRoutes = require('./routes/bookingCustomerRoutes');
const bookingProRoutes = require('./routes/bookingProRoutes');
const courseRoutes = require('./routes/courseRoutes');
const authRoutes = require('./routes/authRoutes');
const unavailabilitiesRoutes = require('./routes/unavailabilitiesRoutes');
const workinghoursRoutes = require('./routes/workinghoursRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');

// Register the routes with specific base paths
app.use('/golf', golfRoutes);
app.use('/customer', customerRoutes);
app.use('/pro', proRoutes);
app.use('/customer/bookings', bookingCustomerRoutes); // Routes for customers
app.use('/pro/bookings', bookingProRoutes);    
app.use('/course', courseRoutes);
app.use('/auth', authRoutes); // Authentication routes for login, logout, etc.
app.use('/unavailabilities', unavailabilitiesRoutes);
app.use('/workinghours', workinghoursRoutes);
app.use('/availability', availabilityRoutes);

// Start the server and listen for incoming connections
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
