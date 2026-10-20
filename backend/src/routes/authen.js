const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma/prisma');
const { verifyToken, isAdmin } = require('../middleware/auth');

router.post('/register', async (req, res) => {
  const { userName, email, password } = req.body;
  if (
    typeof userName !== 'string' || !userName ||
    typeof email !== 'string' || !email ||
    typeof password !== 'string' || !password
  ) {
    return res.status(400).json({ message: 'Username, email and password are required' });
  }

  try {
    //get duplicate username or email user
    const getUser = await prisma.user.findMany({
      where: {
        OR: [{ userName: userName }, { email: email }],
      },
    });

    if (getUser.length > 0) {
      res.status(409).json({ message: 'Duplicate Username or Email' });
    } else {
      const hashPassword = await bcrypt.hash(password, 10);
      await prisma.user.create({
        data: {
          userName: userName,
          email: email,
          password: hashPassword,
        },
      });
      res.status(201).json({ message: 'User created successfully' });
    }
  } catch (err) {
    console.error('Registration failed:', err);
    res.status(500).json({ message: 'server error' });
  }
});

router.post('/login', async (req, res) => {
  const { userName, password } = req.body;
  if (typeof userName !== 'string' || typeof password !== 'string' || !userName || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const getUser = await prisma.user.findUnique({
      where: { userName: userName },
    });

    if (!getUser) {
      res.status(404).json({ message: 'Unknown Username' });
    } else {
      const isMatch = await bcrypt.compare(password, getUser.password);
      if (!isMatch) {
        res.status(404).json({ message: 'Password Incorrect' });
      } else {
        const token = jwt.sign(
          { userId: getUser.userId },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );
        return res.status(200).json({ message: 'Login Success', token: token });
      }
    }
  } catch (err) {
    console.error('Login failed:', err);
    res.status(500).json({ message: 'server error' });
  }
});

// ข้อมูลผู้ใช้ที่ login อยู่ (ใช้ token)
router.get('/home', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    const getUser = await prisma.user.findMany({
      where: { userId: userId },
      select: { userId: true, userName: true, email: true, role: true },
    });

    if (getUser.length == 0) {
      return res.status(404).json({ message: 'User not exist' });
    }
    return res.status(200).json({ user: getUser });
  } catch {
    return res.status(500).json({ message: 'server error' });
  }
});

// admin: รายชื่อผู้ใช้ทั้งหมด
router.get('/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { userId: true, userName: true, email: true, role: true },
      orderBy: { userId: 'asc' },
    });
    res.status(200).json(users);
  } catch {
    res.status(500).json({ message: 'server error' });
  }
});

// admin: เปลี่ยน role ผู้ใช้
router.put('/users/:id/role', verifyToken, isAdmin, async (req, res) => {
  const { role } = req.body;
  if (role !== 'admin' && role !== 'user') {
    return res.status(400).json({ message: 'role must be admin or user' });
  }
  try {
    await prisma.user.update({
      where: { userId: Number(req.params.id) },
      data: { role: role },
    });
    res.status(200).json({ message: 'Role updated' });
  } catch {
    res.status(404).json({ message: 'User not found' });
  }
});

module.exports = router;
