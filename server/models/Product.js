import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price:       { type: Number, required: true, min: 0 },
  category:    { type: mongoose.Schema.Types.ObjectId,
                 ref: 'Category', required: true },
  image:       { type: String, default: '' },
  stock:       { type: Number, default: 0, min: 0 },
  isActive:    { type: Boolean, default: true },
  tags:        [{ type: String }],
  nutritionalInfo: {
    calories:  { type: Number },
    protein:   { type: String },
    fiber:     { type: String }
  }
}, { timestamps: true });

// Índice para búsquedas eficientes
productSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);
