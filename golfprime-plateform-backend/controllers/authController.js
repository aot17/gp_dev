const passport = require('passport'); // Import Passport for authentication handling.

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
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Failed to log out' });
    }
    // Destroy the session and clear cookies
    req.session.destroy(() => {
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.json({ message: 'Logged out successfully' });
    });
  });
};
