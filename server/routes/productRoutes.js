import express from 'express';
import Product from '../models/Product.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// GET /api/products — Listar productos (público)
router.get('/', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    const filter = { isActive: true };
    if (category) filter.category = category;
    // Coincidencia parcial (no solo palabras completas): busca el término
    // como subcadena en el nombre o la descripción, sin distinguir mayús.
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(filter)
      .populate('category', 'name icon')
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);
    res.json({
      success: true,
      data: products,
      pagination: { page: Number(page), limit: Number(limit),
                    total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false,
      message: error.message });
  }
});

// GET /api/products/:id — Detalle de producto
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name icon');
    if (!product) {
      return res.status(404).json({ success: false,
        message: 'Producto no encontrado' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false,
      message: error.message });
  }
});

// POST /api/products — Crear producto (admin)
router.post('/', authenticate, authorize('admin'),
  async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false,
      message: error.message });
  }
});

// PUT /api/products/:id — Actualizar producto (admin)
router.put('/:id', authenticate, authorize('admin'),
  async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ success: false,
        message: 'Producto no encontrado' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false,
      message: error.message });
  }
});

// DELETE /api/products/:id — Eliminar producto (admin)
router.delete('/:id', authenticate, authorize('admin'),
  async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id, { isActive: false }, { new: true }
    );
    if (!product) {
      return res.status(404).json({ success: false,
        message: 'Producto no encontrado' });
    }
    res.json({ success: true,
      message: 'Producto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false,
      message: error.message });
  }
});

export default router;
