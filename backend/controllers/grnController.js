import GRN from '../models/GRN.js';
import PurchaseOrder from '../models/PurchaseOrder.js';
import Product from '../models/Product.js';

// @desc    Create GRN
// @route   POST /api/grn
// @access  Private
export const createGRN = async (req, res) => {
    const { purchaseOrder, supplier, items, notes } = req.body;

    const po = await PurchaseOrder.findById(purchaseOrder);
    if (!po) {
        res.status(404);
        throw new Error('Purchase Order not found');
    }

    // Create GRN
    const grn = new GRN({
        purchaseOrder,
        supplier,
        items,
        notes,
        receivedBy: req.user._id,
    });

    const createdGRN = await grn.save();

    // Update Stock and PO received quantity
    for (const item of items) {
        // Update Product Stock
        const product = await Product.findById(item.product);
        if (product) {
            product.stock += item.receivedQuantity;
            await product.save();
        }

        // Update PO Received Quantity
        const poItem = po.items.find(i => i.product.toString() === item.product.toString());
        if (poItem) {
            poItem.receivedQuantity += item.receivedQuantity;
        }
    }

    // Update PO Status if all items received
    const allReceived = po.items.every(i => i.receivedQuantity >= i.quantity);
    po.status = allReceived ? 'received' : 'partial';
    await po.save();

    res.status(201).json(createdGRN);
};

// @desc    Get all GRNs
// @route   GET /api/grn
// @access  Private
export const getGRNs = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 0;

    const total = await GRN.countDocuments();
    const grns = await GRN.find({})
        .populate('purchaseOrder', 'orderNumber')
        .populate('supplier', 'name company')
        .limit(limit)
        .skip(limit * page)
        .sort({ createdAt: -1 });

    res.json({ data: grns, total, page, limit });
};
