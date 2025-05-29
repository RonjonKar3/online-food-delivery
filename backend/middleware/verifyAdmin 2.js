import jwt from 'jsonwebtoken';

const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log("Authorization header missing or malformed.");
    return res.status(401).json({ success: false, message: 'Authorization header missing or malformed.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    if (decoded.isAdmin) {
      req.userId = decoded.id;
      next();
    } else {
      console.log("Not admin user");
      return res.status(403).json({ success: false, message: 'Admin access required.' });
    }
  } catch (error) {
    console.log("Token error:", error.message);
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

export default verifyAdmin;
