import express from 'express';
import User from '../models/User.js';
import { authenticate, generateToken } from '../middleware/auth.js';

const router = express.Router();

// POST /api/users/register — Registro de usuario
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false,
        message: 'El email ya está registrado' });
    }
    const user = new User({ name, email, password, phone });
    await user.save();
    const token = generateToken(user._id, user.role);
    res.status(201).json({
      success: true,
      data: { user: { id: user._id, name, email,
                      role: user.role }, token }
    });
  } catch (error) {
    res.status(400).json({ success: false,
      message: error.message });
  }
});

// POST /api/users/login — Inicio de sesión
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false,
        message: 'Credenciales inválidas' });
    }
    const token = generateToken(user._id, user.role);
    res.json({
      success: true,
      data: { user: { id: user._id, name: user.name,
              email: user.email, role: user.role }, token }
    });
  } catch (error) {
    res.status(500).json({ success: false,
      message: error.message });
  }
});

// GET /api/users/profile — Perfil del usuario
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password');
    if (!user) {
      return res.status(404).json({ success: false,
        message: 'Usuario no encontrado' });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false,
      message: error.message });
  }
});

// PUT /api/users/profile — Actualizar perfil
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { name, phone, address } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId, { name, phone, address },
      { new: true, runValidators: true }
    ).select('-password');
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false,
      message: error.message });
  }
});

export default router;
