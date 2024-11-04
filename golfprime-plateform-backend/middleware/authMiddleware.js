const jwt = require('jsonwebtoken');

const authMiddleware = (roles = []) => {
  return (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // retrieves the Autorization header from the incoming HTTP request, split the header string at spaces and extracts the second element of the array (the token).

    if (!token) {
      return res.status(401).json({ message: 'Authorization denied' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // checks the integrity of the token and ensure it was not tampered with. JWT_SECRET is like a secret key to sign and verify the token.
      req.user = decoded; // will contain the payload

      if (roles.length && !roles.includes(req.user.role)) { // check if the roles array contain any roles and check if the user's role is not in the list of allowed roles.
        return res.status(403).json({ message: 'Forbidden' });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };
};

module.exports = authMiddleware;
