import SalesOrder from '../models/SalesOrder.js';
import Product from '../models/Product.js';

// @desc    Get all sales orders
// @route   GET /api/sales-orders
// @access  Private
export const getSalesOrders = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 0;

        const total = await SalesOrder.countDocuments();
        const orders = await SalesOrder.find({})
            .populate('customer', 'name company')
            .populate('items.product', 'title sku')
            .limit(limit)
            .skip(limit * page)
            .sort({ createdAt: -1 });

        res.json({ data: orders, total, page, limit });
    } catch (error) {
        res.status(500);
        throw new Error('Server Error');
    }
};

// @desc    Create sales order
// @route   POST /api/sales-orders
// @access  Private
export const createSalesOrder = async (req, res) => {
    const { customer, items, subtotal, tax, shipping, totalPrice, notes } = req.body;

    if (items && items.length === 0) {
        res.status(400);
        throw new Error('No order items');
    }

    // Check stock availability and update stock
    for (const item of items) {
        const product = await Product.findById(item.product);
        if (!product) {
            res.status(404);
            throw new Error(`Product ${item.product} not found`);
        }
        if (product.stock < item.quantity) {
            res.status(400);
            throw new Error(`Insufficient stock for ${product.title}`);
        }

        // Deduct stock
        product.stock -= item.quantity;
        await product.save();
    }

    const order = new SalesOrder({
        customer,
        items,
        subtotal,
        tax,
        shipping,
        totalPrice,
        notes,
        createdBy: req.user._id,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
};

// @desc    Update sales order status
// @route   PUT /api/sales-orders/:id/status
// @access  Private
export const updateSalesOrderStatus = async (req, res) => {
    const order = await SalesOrder.findById(req.params.id);

    if (order) {
        order.status = req.body.status || order.status;
        order.paymentStatus = req.body.paymentStatus || order.paymentStatus;

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
};
