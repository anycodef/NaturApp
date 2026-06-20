import express from 'express';
import Category from '../models/Category.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// GET /api/categories — Listar categorías
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ name: 1 });
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false,
      message: error.message });
  }
});

// POST /api/categories — Crear categoría (admin)
router.post('/', authenticate, authorize('admin'),
  async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false,
      message: error.message });
  }
});

// PUT /api/categories/:id — Actualizar categoría
router.put('/:id', authenticate, authorize('admin'),
  async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id, req.body,
      { new: true, runValidators: true }
    );
    if (!category) {
      return res.status(404).json({ success: false,
        message: 'Categoría no encontrada' });
    }
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false,
      message: error.message });
  }
});

// DELETE /api/categories/:id — Eliminar categoría
router.delete('/:id', authenticate, authorize('admin'),
  async (req, res) => {
  try {
    await Category.findByIdAndUpdate(req.params.id,
      { isActive: false });
    res.json({ success: true,
      message: 'Categoría eliminada' });
  } catch (error) {
    res.status(500).json({ success: false,
      message: error.message });
  }
});

export default router;
