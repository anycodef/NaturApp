import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId,
              ref: 'Product', required: true },
  name:     { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price:    { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  user:   { type: mongoose.Schema.Types.ObjectId,
            ref: 'User', required: true },
  items:  [orderItemSchema],
  total:  { type: Number, required: true },
  status: { type: String,
            enum: ['pending', 'confirmed', 'shipped', 'delivered',
                   'cancelled'],
            default: 'pending' },
  shippingAddress: {
    street:  { type: String, required: true },
    city:    { type: String, required: true },
    zipCode: { type: String, required: true }
  },
  paymentMethod: { type: String, default: 'cash' }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
