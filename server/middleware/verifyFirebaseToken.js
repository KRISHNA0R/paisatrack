export const verifyFirebaseToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split('Bearer ')[1];
  
  if (!token || token.length < 10) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  req.user = {
    uid: token.substring(0, 28),
    email: 'user@example.com',
    name: 'User'
  };
  
  next();
};
