import mongoose from 'mongoose';
import Category from './models/Category.js';
import Product from './models/Product.js';
import User from './models/User.js';

const MONGODB_URI = process.env.MONGODB_URI ||
  'mongodb://localhost:27017/naturapp';

const categories = [
  { name: 'Miel',           icon: 'flower',    description: 'Mieles y derivados naturales' },
  { name: 'Aceites',        icon: 'water',     description: 'Aceites orgánicos prensados en frío' },
  { name: 'Cápsulas',       icon: 'medical',   description: 'Suplementos en cápsulas' },
  { name: 'Superalimentos', icon: 'nutrition', description: 'Superfoods andinos' },
  { name: 'Infusiones',     icon: 'cafe',      description: 'Tés e infusiones naturales' }
];

const productsByCategory = {
  'Miel': [
    {
      name: 'Miel de Abeja Multifloral',
      description: 'Miel pura de abeja de flores silvestres del valle de Oxapampa. Ideal para endulzar tus bebidas de forma natural y fortalecer el sistema inmunológico.',
      price: 35.0,
      image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=300&q=80',
      stock: 15,
      tags: ['natural', 'antibacteriano', 'energía'],
      nutritionalInfo: { calories: 304, protein: '0.3 g', fiber: '0.2 g' }
    }
  ],
  'Aceites': [
    {
      name: 'Aceite de Coco Orgánico',
      description: 'Aceite de coco extra virgen prensado en frío. Ideal para cocinar, repostería y cuidado del cabello y la piel.',
      price: 42.0,
      image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=300&q=80',
      stock: 10,
      tags: ['orgánico', 'metabolismo', 'hidratante'],
      nutritionalInfo: { calories: 862, protein: '0 g', fiber: '0 g' }
    }
  ],
  'Cápsulas': [
    {
      name: 'Cápsulas de Camu Camu',
      description: 'Cápsulas de extracto atomizado de Camu Camu, la mayor fuente natural de Vitamina C. Ayuda a fortalecer las defensas del cuerpo.',
      price: 50.0,
      image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=300&q=80',
      stock: 20,
      tags: ['vitamina c', 'antioxidante', 'colágeno'],
      nutritionalInfo: { calories: 24, protein: '0.5 g', fiber: '1.1 g' }
    }
  ],
  'Superalimentos': [
    {
      name: 'Harina de Tocosh de Papa',
      description: 'Conocido como la penicilina natural de los Andes. Harina de tocosh pura obtenida mediante fermentación natural de papa selecta.',
      price: 25.0,
      image: 'https://images.unsplash.com/photo-1588675646184-f550218240f9?auto=format&fit=crop&w=300&q=80',
      stock: 8,
      tags: ['digestivo', 'gastritis', 'andino'],
      nutritionalInfo: { calories: 130, protein: '2.5 g', fiber: '2.0 g' }
    },
    {
      name: 'Maca Roja Gelatinizada',
      description: 'Maca roja selecta gelatinizada para una óptima digestión y absorción de nutrientes. Ideal para combatir el cansancio físico y mental.',
      price: 38.0,
      image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=300&q=80',
      stock: 25,
      tags: ['energía', 'hormonal', 'estrés'],
      nutritionalInfo: { calories: 325, protein: '14 g', fiber: '8.5 g' }
    }
  ],
  'Infusiones': [
    {
      name: 'Té Verde con Matcha',
      description: 'Mezcla especial de té verde selecto y polvo de matcha orgánico. Una infusión llena de antioxidantes para revitalizar tu día.',
      price: 18.0,
      image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=300&q=80',
      stock: 30,
      tags: ['energizante', 'antioxidante', 'concentración'],
      nutritionalInfo: { calories: 3, protein: '0.2 g', fiber: '0 g' }
    }
  ]
};

const users = [
  { name: 'Admin NaturApp', email: 'admin@naturapp.com',
    password: 'admin123', role: 'admin', phone: '999000111' },
  { name: 'Cliente Demo', email: 'demo@naturapp.com',
    password: '123456', role: 'customer', phone: '988777666' }
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Conectado a MongoDB, limpiando colecciones...');

  await Promise.all([
    Category.deleteMany({}),
    Product.deleteMany({}),
    User.deleteMany({})
  ]);

  const createdCategories = await Category.insertMany(categories);
  const categoryMap = {};
  createdCategories.forEach(c => { categoryMap[c.name] = c._id; });

  const productsToInsert = [];
  for (const [catName, items] of Object.entries(productsByCategory)) {
    for (const item of items) {
      productsToInsert.push({ ...item, category: categoryMap[catName] });
    }
  }
  await Product.insertMany(productsToInsert);

  // Los usuarios se crean uno a uno para que el hook pre('save')
  // hashee correctamente la contraseña con bcrypt.
  for (const u of users) {
    await User.create(u);
  }

  console.log(`Seed completo: ${createdCategories.length} categorías, ` +
    `${productsToInsert.length} productos, ${users.length} usuarios.`);
  console.log('Usuarios demo:');
  console.log('  admin@naturapp.com / admin123 (admin)');
  console.log('  demo@naturapp.com / 123456 (customer)');

  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Error en seed:', err);
  process.exit(1);
});
