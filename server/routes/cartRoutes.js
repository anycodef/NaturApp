import express from 'express';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Carrito en memoria por sesión (simplificado)
const carts = new Map();

// GET /api/cart — Obtener carrito
router.get('/', authenticate, (req, res) => {
  const cart = carts.get(req.userId) || { items: [] };
  const total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );
  res.json({ success: true,
    data: { items: cart.items, total, count: cart.items.length }
  });
});

// POST /api/cart/add — Agregar al carrito
router.post('/add', authenticate, (req, res) => {
  const { productId, name, price, image, quantity = 1 } = req.body;
  if (!carts.has(req.userId)) {
    carts.set(req.userId, { items: [] });
  }
  const cart = carts.get(req.userId);
  const existing = cart.items.find(
    i => i.productId === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({ productId, name, price, image, quantity });
  }
  res.json({ success: true, data: cart });
});

// PUT /api/cart/:productId — Actualizar cantidad
router.put('/:productId', authenticate, (req, res) => {
  const cart = carts.get(req.userId);
  if (!cart) {
    return res.status(404).json({ success: false,
      message: 'Carrito vacío' });
  }
  const item = cart.items.find(
    i => i.productId === req.params.productId);
  if (!item) {
    return res.status(404).json({ success: false,
      message: 'Producto no encontrado en carrito' });
  }
  item.quantity = req.body.quantity;
  if (item.quantity <= 0) {
    cart.items = cart.items.filter(
      i => i.productId !== req.params.productId);
  }
  res.json({ success: true, data: cart });
});

// DELETE /api/cart/:productId — Eliminar del carrito
router.delete('/:productId', authenticate, (req, res) => {
  const cart = carts.get(req.userId);
  if (cart) {
    cart.items = cart.items.filter(
      i => i.productId !== req.params.productId);
  }
  res.json({ success: true,
    message: 'Producto eliminado del carrito' });
});

// DELETE /api/cart — Vaciar carrito
router.delete('/', authenticate, (req, res) => {
  carts.set(req.userId, { items: [] });
  res.json({ success: true, message: 'Carrito vaciado' });
});

export default router;
