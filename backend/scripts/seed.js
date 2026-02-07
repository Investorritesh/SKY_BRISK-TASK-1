import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import Supplier from '../models/Supplier.js';
import SalesOrder from '../models/SalesOrder.js';
import PurchaseOrder from '../models/PurchaseOrder.js';
import GRN from '../models/GRN.js';
import Invoice from '../models/Invoice.js';

dotenv.config();

const users = [
    {
        name: "Ritesh",
        email: "admin@erp.com",
        password: "Admin@123",
        role: "admin"
    },
    {
        name: "Amit Sharma",
        email: "sales@erp.com",
        password: "Sales@123",
        role: "sales"
    },
    {
        name: "Neha Patil",
        email: "purchase@erp.com",
        password: "Purchase@123",
        role: "purchase"
    },
    {
        name: "Rahul Verma",
        email: "inventory@erp.com",
        password: "Inventory@123",
        role: "inventory"
    }
];

const products = [
    {
        title: "HP Pavilion Laptop",
        sku: "HP-LAP-001",
        price: 62000,
        cost: 58000,
        stock: 25,
        reorderLevel: 5,
        category: "Electronics",
        unit: "pcs"
    },
    {
        title: "Wireless Mouse",
        sku: "MOU-002",
        price: 1200,
        cost: 800,
        stock: 150,
        reorderLevel: 20,
        category: "Electronics",
        unit: "pcs"
    },
    {
        title: "Mechanical Keyboard",
        sku: "KEY-003",
        price: 4500,
        cost: 3200,
        stock: 60,
        reorderLevel: 10,
        category: "Electronics",
        unit: "pcs"
    }
];

const customers = [
    {
        name: "TechNova Pvt Ltd",
        email: "contact@technova.com",
        phone: "9876543210",
        company: "TechNova Pvt Ltd",
        address: {
            street: "Baner Road",
            city: "Pune",
            state: "Maharashtra",
            country: "India"
        }
    },
    {
        name: "Digital World",
        email: "sales@digitalworld.com",
        phone: "9123456780",
        company: "Digital World",
        address: {
            street: "Andheri West",
            city: "Mumbai",
            state: "Maharashtra",
            country: "India"
        }
    }
];

const suppliers = [
    {
        name: "Global IT Suppliers",
        email: "orders@globalit.com",
        phone: "9988776655",
        company: "Global IT Suppliers",
        address: {
            street: "MG Road",
            city: "Bangalore",
            state: "Karnataka",
            country: "India"
        }
    },
    {
        name: "Smart Electronics",
        email: "info@smartelectronics.in",
        phone: "8899776655",
        company: "Smart Electronics",
        address: {
            street: "Nehru Place",
            city: "Delhi",
            state: "Delhi",
            country: "India"
        }
    }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB for seeding...');

        // Clear existing data
        await User.deleteMany();
        await Product.deleteMany();
        await Customer.deleteMany();
        await Supplier.deleteMany();
        await SalesOrder.deleteMany();
        await PurchaseOrder.deleteMany();
        await GRN.deleteMany();
        await Invoice.deleteMany();

        // 1. Create Users
        const createdUsers = await User.insertMany(users);
        const adminUser = createdUsers[0]._id;
        console.log('✅ Users Seeded');

        // 2. Create Products
        const productsWithUser = products.map(p => ({ ...p, createdBy: adminUser }));
        const createdProducts = await Product.insertMany(productsWithUser);
        console.log('✅ Products Seeded');

        // 3. Create Customers & Suppliers
        const customersWithUser = customers.map(c => ({ ...c, createdBy: adminUser }));
        const createdCustomers = await Customer.insertMany(customersWithUser);

        const suppliersWithUser = suppliers.map(s => ({ ...s, createdBy: adminUser }));
        const createdSuppliers = await Supplier.insertMany(suppliersWithUser);
        console.log('✅ Customers & Suppliers Seeded');

        // 4. Create a Sample Purchase Order
        const samplePO = new PurchaseOrder({
            orderNumber: "PO-000001",
            supplier: createdSuppliers[0]._id,
            items: [
                {
                    product: createdProducts[0]._id,
                    quantity: 20,
                    price: 58000,
                    total: 20 * 58000
                }
            ],
            subtotal: 20 * 58000,
            tax: 0,
            shipping: 0,
            totalPrice: 20 * 58000,
            status: 'pending',
            createdBy: adminUser
        });
        const createdPO = await samplePO.save();
        console.log('✅ Sample Purchase Order Seeded');

        // 5. Create a Sample GRN
        const sampleGRN = new GRN({
            grnNumber: "GRN-000001",
            purchaseOrder: createdPO._id,
            supplier: createdSuppliers[0]._id,
            items: [
                {
                    product: createdProducts[0]._id,
                    orderedQuantity: 20,
                    receivedQuantity: 20,
                    remarks: 'Received in good condition'
                }
            ],
            receivedDate: new Date(),
            status: 'completed',
            receivedBy: adminUser
        });
        await sampleGRN.save();
        console.log('✅ Sample GRN Seeded');

        // 6. Create a Sample Sales Order
        const sampleSO = new SalesOrder({
            orderNumber: "SO-000001",
            customer: createdCustomers[0]._id,
            items: [
                {
                    product: createdProducts[0]._id,
                    quantity: 2,
                    price: 62000,
                    total: 124000
                }
            ],
            subtotal: 124000,
            tax: 0,
            shipping: 0,
            totalPrice: 124000,
            status: 'confirmed',
            paymentStatus: 'paid',
            createdBy: adminUser
        });
        const createdSO = await sampleSO.save();
        console.log('✅ Sample Sales Order Seeded');

        // 7. Create a Sample Invoice
        const sampleInvoice = new Invoice({
            invoiceNumber: "INV-000001",
            salesOrder: createdSO._id,
            customer: createdCustomers[0]._id,
            invoiceDate: new Date(),
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            items: [
                {
                    product: createdProducts[0]._id,
                    quantity: 2,
                    price: 62000,
                    total: 124000
                }
            ],
            subtotal: 124000,
            tax: 0,
            shipping: 0,
            totalAmount: 124000,
            status: 'paid',
            paymentMethod: 'bank_transfer',
            createdBy: adminUser
        });
        await sampleInvoice.save();
        console.log('✅ Sample Invoice Seeded');

        console.log('🚀 Database Seeding Completed Successfully!');
        process.exit();
    } catch (error) {
        console.error(`❌ Error seeding data: ${error.message}`);
        process.exit(1);
    }
};

seedData();
