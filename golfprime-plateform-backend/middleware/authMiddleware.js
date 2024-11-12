// Define a function `authMiddleware` that takes an optional array of roles.
// This middleware checks if a user is authenticated and, if provided, whether
// the user has an allowed role to access the requested resource.
const authMiddleware = (roles = []) => {
  // Return an Express middleware function that will have access to the `req`, `res`, and `next` objects.
  return (req, res, next) => {
    // Check if the user is authenticated using `req.isAuthenticated()`, which is a Passport method.
    // This method returns `true` if the user is logged in, and `false` otherwise.
    // If the user is not authenticated, return a 401 Unauthorized status code and a message.
    if (!req.isAuthenticated()) {
      console.log('Not authenticated'); // Debugging
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    console.log('User authenticated:', req.user); // Debugging

    // Automatically allow access if the user has the 'admin' role
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if the `roles` array contains any roles (i.e., is non-empty).
    // If it does, then we verify that the authenticated user’s role (found on `req.user.role`)
    // is included in the `roles` array.
    // If the user's role is not in the array, respond with a 403 Forbidden status code and a message.
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // If the user is authenticated and has an allowed role (if roles are specified),
    // call `next()` to pass control to the next middleware or route handler.
    next();
  };
};

// Export the `authMiddleware` function so it can be used in other parts of the application,
// allowing for role-based access control and authentication checks on routes.
module.exports = authMiddleware;
