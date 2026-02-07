import PurchaseOrder from '../models/PurchaseOrder.js';
import Product from '../models/Product.js';

// @desc    Get all purchase orders
// @route   GET /api/purchase-orders
// @access  Private
export const getPurchaseOrders = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 0;

        const total = await PurchaseOrder.countDocuments();
        const orders = await PurchaseOrder.find({})
            .populate('supplier', 'name company')
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

// @desc    Create purchase order
// @route   POST /api/purchase-orders
// @access  Private
export const createPurchaseOrder = async (req, res) => {
    const { supplier, items, subtotal, tax, shipping, totalPrice, notes } = req.body;

    if (items && items.length === 0) {
        res.status(400);
        throw new Error('No items in purchase order');
    }

    const order = new PurchaseOrder({
        supplier,
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

// @desc    Update purchase order status
// @route   PUT /api/purchase-orders/:id
// @access  Private
export const updatePurchaseOrder = async (req, res) => {
    const order = await PurchaseOrder.findById(req.params.id);

    if (order) {
        order.status = req.body.status || order.status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
};
