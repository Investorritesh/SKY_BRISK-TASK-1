import mongoose from 'mongoose';

const grnSchema = new mongoose.Schema(
    {
        grnNumber: {
            type: String,
            required: true,
            unique: true,
        },
        purchaseOrder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'PurchaseOrder',
            required: [true, 'Please provide purchase order'],
        },
        supplier: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Supplier',
            required: true,
        },
        receivedDate: {
            type: Date,
            default: Date.now,
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                orderedQuantity: {
                    type: Number,
                    required: true,
                },
                receivedQuantity: {
                    type: Number,
                    required: true,
                    min: 0,
                },
                rejectedQuantity: {
                    type: Number,
                    default: 0,
                    min: 0,
                },
                remarks: {
                    type: String,
                },
            },
        ],
        status: {
            type: String,
            enum: ['pending', 'completed', 'partial'],
            default: 'pending',
        },
        notes: {
            type: String,
        },
        receivedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

// Auto-generate GRN number
grnSchema.pre('save', async function (next) {
    if (!this.grnNumber) {
        const count = await mongoose.model('GRN').countDocuments();
        this.grnNumber = `GRN-${String(count + 1).padStart(6, '0')}`;
    }
    next();
});

const GRN = mongoose.model('GRN', grnSchema);

export default GRN;
