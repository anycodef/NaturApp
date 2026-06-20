import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// POST /api/orders — Crear pedido
router.post('/', authenticate, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;
    // Validar stock y calcular total
    let total = 0;
    const orderItems = [];
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ success: false,
          message: `Stock insuficiente: ${product?.name}` });
      }
      total += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price
      });
      // Descontar stock
      product.stock -= item.quantity;
      await product.save();
    }
    const order = new Order({
      user: req.userId, items: orderItems,
      total, shippingAddress, paymentMethod
    });
    await order.save();
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false,
      message: error.message });
  }
});

// GET /api/orders — Listar pedidos del usuario
router.get('/', authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate('items.product', 'name image')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false,
      message: error.message });
  }
});

// GET /api/orders/:id — Detalle de pedido
router.get('/:id', authenticate, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id, user: req.userId
    }).populate('items.product', 'name image price');
    if (!order) {
      return res.status(404).json({ success: false,
        message: 'Pedido no encontrado' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false,
      message: error.message });
  }
});

// PUT /api/orders/:id/cancel — Cancelar pedido
router.put('/:id/cancel', authenticate, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id, user: req.userId
    });
    if (!order) {
      return res.status(404).json({ success: false,
        message: 'Pedido no encontrado' });
    }
    if (order.status !== 'pending') {
      return res.status(400).json({ success: false,
        message: 'Solo se pueden cancelar pedidos pendientes'
      });
    }
    // Restaurar stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product,
        { $inc: { stock: item.quantity } });
    }
    order.status = 'cancelled';
    await order.save();
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false,
      message: error.message });
  }
});

export default router;
