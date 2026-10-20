const pool = require('../db/pool');

// GET /api/menu  (ใช้ ?keyword=xxx เพื่อค้นหาตามชื่อ, ?typeId=1 เพื่อกรองตามชนิด)
// JOIN กับตาราง type เพื่อให้ได้ชื่อชนิดของเมนูมาด้วย
const getMenus = async (req, res) => {
  const { keyword, typeId } = req.query;
  let sql = `SELECT m.menuId, m.name, m.price, m.isBestSeller, m.typeId, t.name AS typeName,
             (SELECT AVG(score) FROM rating r WHERE r.menuId = m.menuId) AS avgRating
             FROM menu m JOIN type t ON m.typeId = t.typeId WHERE 1=1`;
  const params = [];
  if (keyword) {
    sql += ' AND m.name LIKE ?';
    params.push(`%${keyword}%`);
  }
  if (typeId) {
    sql += ' AND m.typeId = ?';
    params.push(typeId);
  }
  try {
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching menus:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// GET /api/menu/:id
const getMenuById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT m.menuId, m.name, m.price, m.isBestSeller, m.typeId, t.name AS typeName,
              (SELECT AVG(score) FROM rating r WHERE r.menuId = m.menuId) AS avgRating
       FROM menu m JOIN type t ON m.typeId = t.typeId WHERE m.menuId = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Menu not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching menu:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// POST /api/menu
const createMenu = async (req, res) => {
  const { name, price, isBestSeller = false, typeId } = req.body;
  if (!name || price === undefined || !typeId) {
    return res.status(400).json({ error: 'name, price and typeId are required' });
  }
  try {
    const [result] = await pool.query(
      'INSERT INTO menu (name, price, isBestSeller, typeId) VALUES (?, ?, ?, ?)',
      [name, price, isBestSeller ? 1 : 0, typeId]
    );
    res.status(201).json({
      menuId: result.insertId, name, price, isBestSeller: !!isBestSeller, typeId
    });
  } catch (err) {
    console.error('Error creating menu:', err);
    if (err.errno === 1452) {
      return res.status(400).json({ error: 'typeId does not exist' });
    }
    res.status(500).json({ error: 'Database error' });
  }
};

// PUT /api/menu/:id
const updateMenu = async (req, res) => {
  const { id } = req.params;
  const { name, price, isBestSeller = false, typeId } = req.body;
  if (!name || price === undefined || !typeId) {
    return res.status(400).json({ error: 'name, price and typeId are required' });
  }
  try {
    const [result] = await pool.query(
      'UPDATE menu SET name = ?, price = ?, isBestSeller = ?, typeId = ? WHERE menuId = ?',
      [name, price, isBestSeller ? 1 : 0, typeId, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Menu not found' });
    }
    res.json({ menuId: Number(id), name, price, isBestSeller: !!isBestSeller, typeId });
  } catch (err) {
    console.error('Error updating menu:', err);
    if (err.errno === 1452) {
      return res.status(400).json({ error: 'typeId does not exist' });
    }
    res.status(500).json({ error: 'Database error' });
  }
};

// DELETE /api/menu/:id
const deleteMenu = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM menu WHERE menuId = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Menu not found' });
    }
    res.json({ message: 'Menu deleted successfully', menuId: Number(id) });
  } catch (err) {
    console.error('Error deleting menu:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

module.exports = { getMenus, getMenuById, createMenu, updateMenu, deleteMenu };
