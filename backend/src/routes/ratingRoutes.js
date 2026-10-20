const express = require('express');
const router = express.Router();
const prisma = require('../prisma/prisma');
const { verifyToken } = require('../middleware/auth');

// POST /api/rating/:menuId   body: { score: 1-5 }
router.post('/:menuId', verifyToken, async (req, res) => {
  const menuId = Number(req.params.menuId);
  const score = Number(req.body.score);
  if (!Number.isInteger(score) || score < 1 || score > 5) {
    return res.status(400).json({ message: 'score must be 1-5' });
  }
  try {
    await prisma.rating.upsert({
      where: { userId_menuId: { userId: req.userId, menuId: menuId } },
      update: { score: score },
      create: { userId: req.userId, menuId: menuId, score: score },
    });
    res.status(200).json({ message: 'Rating saved' });
  } catch (err) {
    res.status(404).json({ message: 'Menu not found' });
  }
});

module.exports = router;
