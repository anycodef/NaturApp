const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 9090;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory Database
const categories = [
  'superfoods',
  'aceites',
  'capsulas',
  'infusiones',
  'miel'
];

let products = [
  {
    id: '1',
    name: 'Miel de Abeja Multifloral',
    description: 'Miel pura de abeja de flores silvestres del valle de Oxapampa. Ideal para endulzar tus bebidas de forma natural y fortalecer el sistema inmunológico.',
    price: 35.0,
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=300&q=80',
    category: 'miel',
    stock: 15,
    rating: 4.8,
    benefits: ['100% natural y pura', 'Propiedades antibacterianas', 'Aporte energético natural']
  },
  {
    id: '2',
    name: 'Aceite de Coco Orgánico',
    description: 'Aceite de coco extra virgen prensado en frío. Ideal para cocinar, repostería y cuidado del cabello y la piel.',
    price: 42.0,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=300&q=80',
    category: 'aceites',
    stock: 10,
    rating: 4.6,
    benefits: ['Acelera el metabolismo', 'Excelente hidratante para la piel', 'Libre de colesterol']
  },
  {
    id: '3',
    name: 'Cápsulas de Camu Camu',
    description: 'Cápsulas de extracto atomizado de Camu Camu, la mayor fuente natural de Vitamina C. Ayuda a fortalecer las defensas del cuerpo.',
    price: 50.0,
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=300&q=80',
    category: 'capsulas',
    stock: 20,
    rating: 4.9,
    benefits: ['Alto contenido de Vitamina C', 'Poderoso antioxidante', 'Promueve la formación de colágeno']
  },
  {
    id: '4',
    name: 'Harina de Tocosh de Papa',
    description: 'Conocido como la penicilina natural de los Andes. Harina de tocosh pura obtenida mediante fermentación natural de papa selecta.',
    price: 25.0,
    image: 'https://images.unsplash.com/photo-1588675646184-f550218240f9?auto=format&fit=crop&w=300&q=80',
    category: 'superfoods',
    stock: 8,
    rating: 4.5,
    benefits: ['Protector digestivo natural', 'Combate la gastritis', 'Fortalece el sistema digestivo']
  },
  {
    id: '5',
    name: 'Té Verde con Matcha',
    description: 'Mezcla especial de té verde selecto y polvo de matcha orgánico. Una infusión llena de antioxidantes para revitalizar tu día.',
    price: 18.0,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=300&q=80',
    category: 'infusiones',
    stock: 30,
    rating: 4.7,
    benefits: ['Efecto energizante duradero', 'Gran cantidad de antioxidantes', 'Ayuda a la concentración']
  },
  {
    id: '6',
    name: 'Maca Roja Gelatinizada',
    description: 'Maca roja selecta gelatinizada para una óptima digestión y absorción de nutrientes. Ideal para combatir el cansancio físico y mental.',
    price: 38.0,
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=300&q=80',
    category: 'superfoods',
    stock: 25,
    rating: 4.8,
    benefits: ['Aumenta la estamina y energía', 'Regulador hormonal natural', 'Combate el estrés diario']
  }
];

let orders = [];
let nextOrderId = 1;

// === RUTAS API ===

// 1. Obtener Categorías
app.get('/api/categories', (req, res) => {
  res.json(categories);
});

// 2. Obtener Productos (con opción de filtrar por categoría)
app.get('/api/products', (req, res) => {
  const { category } = req.query;
  if (category) {
    const filtered = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
    return res.json(filtered);
  }
  res.json(products);
});

// 3. Buscar Productos
app.get('/api/products/search', (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.json(products);
  }
  const query = q.toLowerCase();
  const searchResults = products.filter(p => 
    p.name.toLowerCase().includes(query) || 
    p.description.toLowerCase().includes(query)
  );
  res.json(searchResults);
});

// 4. Detalle de Producto por ID
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
  res.json(product);
});

// 5. Autenticación (Login)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Falta email o contraseña' });
  }
  
  // Acepta cualquier login para testing, retornando un usuario mock y token
  const name = email.split('@')[0];
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
  
  res.json({
    token: 'mock-jwt-token-xyz123abc456',
    user: {
      name: formattedName,
      email: email
    }
  });
});

// 6. Obtener Historial de Pedidos
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

// 7. Crear Nuevo Pedido (Checkout)
app.post('/api/orders', (req, res) => {
  const { items, total, address } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'El pedido no tiene items' });
  }
  if (!address) {
    return res.status(400).json({ error: 'Falta dirección de entrega' });
  }

  // Descontar stock de productos
  for (const item of items) {
    const product = products.find(p => p.id === item.productId || p.id === String(item.productId));
    if (product) {
      product.stock = Math.max(0, product.stock - item.quantity);
    }
  }

  const newOrder = {
    id: nextOrderId++,
    items,
    total,
    status: 'pendiente',
    date: new Date().toISOString(),
    address
  };

  orders.unshift(newOrder); // Agregar al inicio de la lista
  res.status(201).json(newOrder);
});

// 8. Obtener Detalle de un Pedido por ID
app.get('/api/orders/:id', (req, res) => {
  const order = orders.find(o => String(o.id) === String(req.params.id));
  if (!order) {
    return res.status(404).json({ error: 'Pedido no encontrado' });
  }
  res.json(order);
});

// Inicializar Servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend de NaturApp ejecutándose en http://localhost:${PORT}`);
  console.log(`Bindeado a 0.0.0.0 para acceso local desde otros dispositivos.`);
});
