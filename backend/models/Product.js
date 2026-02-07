import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide a product title'],
            trim: true,
        },
        sku: {
            type: String,
            required: [true, 'Please provide a SKU'],
            unique: true,
            uppercase: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Please provide a category'],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'Please provide a price'],
            min: 0,
        },
        cost: {
            type: Number,
            min: 0,
        },
        stock: {
            type: Number,
            required: [true, 'Please provide stock quantity'],
            min: 0,
            default: 0,
        },
        reorderLevel: {
            type: Number,
            default: 10,
            min: 0,
        },
        unit: {
            type: String,
            default: 'pcs',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

// Index for search optimization
productSchema.index({ title: 'text', sku: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;
