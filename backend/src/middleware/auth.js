const jwt = require('jsonwebtoken');
const prisma = require('../prisma/prisma');

const verifyToken = (req, res, next) => {
  try {
    const token = (req.headers['authorization'] || '').split(' ')[1];
    if (!token || token == 'null') {
      return res.status(403).json({ message: 'no token provide' });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decode.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// ต้องใช้หลัง verifyToken
const isAdmin = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { userId: req.userId } });
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin only' });
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: 'server error' });
  }
};

module.exports = { verifyToken, isAdmin };
