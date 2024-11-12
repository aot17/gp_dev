// Import Passport for authentication handling.
const passport = require('passport');

/**
 * Controller function for handling Pro login.
 */
exports.proLogin = (req, res, next) => {
  passport.authenticate('pro-local', (err, user, info) => {
    if (err) return next(err); // Handle errors during authentication.
    if (!user) return res.status(401).json({ message: 'Invalid login credentials' });
    
    // Log the user in and send a success response.
    req.logIn(user, (err) => {
      if (err) return next(err);
      console.log('Logged-in pro user:', req.user);
      return res.json({ message: 'Pro logged in successfully' });
    });
  })(req, res, next);
};

/**
 * Controller function for handling Customer login.
 */
exports.customerLogin = (req, res, next) => {
  passport.authenticate('customer-local', (err, user, info) => {
    if (err) return next(err); // Handle errors during authentication.
    if (!user) return res.status(401).json({ message: 'Invalid login credentials' });

    // Log the user in and send a success response.
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({ message: 'Customer logged in successfully' });
    });
  })(req, res, next);
};

/**
 * Controller function for handling logout.
 */
exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: 'Failed to log out' });
    res.json({ message: 'Logged out successfully' });
  });
};
