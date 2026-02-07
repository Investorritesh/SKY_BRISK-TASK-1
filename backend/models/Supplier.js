import mongoose from 'mongoose';

const supplierSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide supplier name'],
            trim: true,
        },
        contactPerson: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please provide email'],
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Please provide phone number'],
        },
        company: {
            type: String,
            trim: true,
        },
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
            country: String,
        },
        taxId: {
            type: String,
            trim: true,
        },
        paymentTerms: {
            type: String,
            default: 'Net 30',
        },
        isActive: {
            type: Boolean,
            default: true,
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

const Supplier = mongoose.model('Supplier', supplierSchema);

export default Supplier;
