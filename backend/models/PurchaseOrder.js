import mongoose from 'mongoose';

const purchaseOrderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            required: true,
            unique: true,
        },
        supplier: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Supplier',
            required: [true, 'Please provide supplier'],
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                price: {
                    type: Number,
                    required: true,
                    min: 0,
                },
                receivedQuantity: {
                    type: Number,
                    default: 0,
                    min: 0,
                },
                total: {
                    type: Number,
                    required: true,
                },
            },
        ],
        subtotal: {
            type: Number,
            required: true,
        },
        tax: {
            type: Number,
            default: 0,
        },
        shipping: {
            type: Number,
            default: 0,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['draft', 'pending', 'approved', 'received', 'partial', 'cancelled'],
            default: 'pending',
        },
        expectedDate: {
            type: Date,
        },
        notes: {
            type: String,
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

// Auto-generate order number
purchaseOrderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        const count = await mongoose.model('PurchaseOrder').countDocuments();
        this.orderNumber = `PO-${String(count + 1).padStart(6, '0')}`;
    }
    next();
});

const PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema);

export default PurchaseOrder;
