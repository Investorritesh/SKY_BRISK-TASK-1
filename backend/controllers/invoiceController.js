import Invoice from '../models/Invoice.js';
import SalesOrder from '../models/SalesOrder.js';

// @desc    Create invoice
// @route   POST /api/invoices
// @access  Private
export const createInvoice = async (req, res) => {
    const { salesOrder, customer, items, subtotal, tax, shipping, totalAmount, dueDate, notes, terms } = req.body;

    const so = await SalesOrder.findById(salesOrder);
    if (!so) {
        res.status(404);
        throw new Error('Sales Order not found');
    }

    const invoice = new Invoice({
        salesOrder,
        customer,
        items,
        subtotal,
        tax,
        shipping,
        totalAmount,
        dueDate,
        notes,
        terms,
        createdBy: req.user._id,
    });

    const createdInvoice = await invoice.save();

    // Update Sales Order status
    so.paymentStatus = 'unpaid';
    await so.save();

    res.status(201).json(createdInvoice);
};

// @desc    Get all invoices
// @route   GET /api/invoices
// @access  Private
export const getInvoices = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 0;

    const total = await Invoice.countDocuments();
    const invoices = await Invoice.find({})
        .populate('salesOrder', 'orderNumber')
        .populate('customer', 'name company')
        .limit(limit)
        .skip(limit * page)
        .sort({ createdAt: -1 });

    res.json({ data: invoices, total, page, limit });
};

// @desc    Get invoice by ID
// @route   GET /api/invoices/:id
// @access  Private
export const getInvoiceById = async (req, res) => {
    const invoice = await Invoice.findById(req.params.id)
        .populate('salesOrder', 'orderNumber')
        .populate('customer', 'name company address email phone')
        .populate('items.product', 'title sku unit');

    if (invoice) {
        res.json(invoice);
    } else {
        res.status(404);
        throw new Error('Invoice not found');
    }
};
