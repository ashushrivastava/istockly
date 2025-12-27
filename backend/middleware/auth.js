// backend/middleware/auth.js
// Authentication middleware using Clerk with JWT verification

const { clerkClient } = require('@clerk/clerk-sdk-node');
const { verifyToken } = require('@clerk/clerk-sdk-node');

// Verify user is authenticated using JWT
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }

    const token = authHeader.substring(7);
    
    // Verify the JWT token
    const verified = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    if (!verified) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.userId = verified.sub;
    req.auth = verified;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Verify user has admin role
const requireAdmin = async (req, res, next) => {
  try {
    const user = await clerkClient.users.getUser(req.userId);
    
    // Check if user is admin (by email or role in metadata)
    const isAdmin = 
      user.primaryEmailAddress?.emailAddress === 'ashubitmesra121@gmail.com' ||
      user.publicMetadata?.role === 'admin';
    
    if (!isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(403).json({ error: 'Forbidden - Admin access required' });
  }
};

module.exports = { requireAuth, requireAdmin };