import mongoose from 'mongoose';

const invoiceSchema = new mongoose.Schema(
    {
        invoiceNumber: {
            type: String,
            required: true,
            unique: true,
        },
        salesOrder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SalesOrder',
            required: [true, 'Please provide sales order'],
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer',
            required: true,
        },
        invoiceDate: {
            type: Date,
            default: Date.now,
        },
        dueDate: {
            type: Date,
            required: true,
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                description: String,
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
                discount: {
                    type: Number,
                    default: 0,
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
        totalAmount: {
            type: Number,
            required: true,
        },
        paidAmount: {
            type: Number,
            default: 0,
        },
        status: {
            type: String,
            enum: ['draft', 'sent', 'paid', 'partial', 'overdue', 'cancelled'],
            default: 'draft',
        },
        paymentMethod: {
            type: String,
            enum: ['cash', 'credit_card', 'bank_transfer', 'cheque', 'other'],
        },
        notes: {
            type: String,
        },
        terms: {
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

// Auto-generate invoice number
invoiceSchema.pre('save', async function (next) {
    if (!this.invoiceNumber) {
        const count = await mongoose.model('Invoice').countDocuments();
        this.invoiceNumber = `INV-${String(count + 1).padStart(6, '0')}`;
    }
    next();
});

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;
