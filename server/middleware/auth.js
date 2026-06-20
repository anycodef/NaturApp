import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'naturapp_secret_key';

// Middleware de autenticación JWT
export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token de acceso requerido'
    });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
};

// Middleware de autorización por rol
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: 'No tiene permisos para esta acción'
      });
    }
    next();
  };
};

// Generar token JWT
export const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, JWT_SECRET,
    { expiresIn: '7d' });
};
