import SalesOrder from '../models/SalesOrder.js';
import PurchaseOrder from '../models/PurchaseOrder.js';
import Product from '../models/Product.js';
import Invoice from '../models/Invoice.js';

// @desc    Get Sales Report
// @route   GET /api/reports/sales
// @access  Private/Admin
export const getSalesReport = async (req, res) => {
    try {
        const sales = await SalesOrder.aggregate([
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    totalSales: { $sum: "$totalPrice" },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        res.json(sales);
    } catch (error) {
        res.status(500);
        throw new Error('Server Error');
    }
};

// @desc    Get Inventory Report
// @route   GET /api/reports/inventory
// @access  Private/Admin
export const getInventoryReport = async (req, res) => {
    try {
        const inventory = await Product.find({}, 'title sku stock reorderLevel price category');
        res.json(inventory);
    } catch (error) {
        res.status(500);
        throw new Error('Server Error');
    }
};

// @desc    Get Profit Report
// @route   GET /api/reports/profit
// @access  Private/Admin
export const getProfitReport = async (req, res) => {
    try {
        // This is a simplified calculation: Sales - (Products.cost * quantity)
        // In a real ERP, this would be more complex (weighted average cost, etc.)
        const report = await SalesOrder.aggregate([
            { $unwind: "$items" },
            {
                $lookup: {
                    from: "products",
                    localField: "items.product",
                    foreignField: "_id",
                    as: "productInfo"
                }
            },
            { $unwind: "$productInfo" },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalPrice" },
                    totalCost: { $sum: { $multiply: ["$items.quantity", "$productInfo.cost"] } }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalRevenue: 1,
                    totalCost: 1,
                    profit: { $subtract: ["$totalRevenue", "$totalCost"] }
                }
            }
        ]);
        res.json(report[0] || { totalRevenue: 0, totalCost: 0, profit: 0 });
    } catch (error) {
        res.status(500);
        throw new Error('Server Error');
    }
};
