const pool = require('../db/pool');

// GET /api/type
const getTypes = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM type');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching types:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// GET /api/type/:id
const getTypeById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM type WHERE typeId = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Type not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching type:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// POST /api/type
const createType = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  try {
    const [result] = await pool.query('INSERT INTO type (name) VALUES (?)', [name]);
    res.status(201).json({ typeId: result.insertId, name });
  } catch (err) {
    console.error('Error creating type:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// PUT /api/type/:id
const updateType = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  try {
    const [result] = await pool.query('UPDATE type SET name = ? WHERE typeId = ?', [name, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Type not found' });
    }
    res.json({ typeId: Number(id), name });
  } catch (err) {
    console.error('Error updating type:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// DELETE /api/type/:id
const deleteType = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM type WHERE typeId = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Type not found' });
    }
    res.json({ message: 'Type deleted successfully', typeId: Number(id) });
  } catch (err) {
    console.error('Error deleting type:', err);
    // 1451 = ยังมี menu อ้างอิง type นี้อยู่ (foreign key)
    if (err.errno === 1451) {
      return res.status(409).json({ error: 'Cannot delete: type is used by some menu' });
    }
    res.status(500).json({ error: 'Database error' });
  }
};

module.exports = { getTypes, getTypeById, createType, updateType, deleteType };
