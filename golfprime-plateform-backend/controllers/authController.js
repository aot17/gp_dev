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
      console.log('Customer logged in:', user);
      console.log('Session after login:', req.session);
      return res.json({ message: 'Customer logged in successfully' });
    });
  })(req, res, next);
};

// Check if a customer is logged in
exports.checkSession = (req, res) => {
  //console.log('Checking session...');
  //console.log('Request session ID:', req.sessionID);
  //console.log('Session object:', req.session);
  //console.log('Authenticated user from req.user:', req.user);
  //console.log('Is authenticated:', req.isAuthenticated());

  if (req.isAuthenticated()) {
    const userRole = req.user.role; // Get the user's role (either 'customer' or 'pro')

    if (userRole === 'customer') {
      //console.log('User is authenticated and a customer:', req.user);
      res.json({ loggedIn: true, user: req.user }); // Include user details
    } else if (userRole === 'pro') {
      //console.log('User is authenticated and a pro:', req.user);
      res.json({ loggedIn: true, user: req.user });
    } else {
      //console.log('User is authenticated but role is unrecognized:', req.user);
      res.json({ loggedIn: false, message: 'Invalid user role.' });
    }
  } else {
    //console.log('User is not authenticated.');
    res.json({ loggedIn: false });
  }
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
