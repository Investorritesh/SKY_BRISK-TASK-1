import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide customer name'],
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
        creditLimit: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        outstandingBalance: {
            type: Number,
            default: 0,
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

const Customer = mongoose.model('Customer', customerSchema);

export default Customer;
