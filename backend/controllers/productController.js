import Product from '../models/Product.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Private
export const getProducts = async (req, res) => {
    try {
        const pageSize = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 0;

        const keyword = req.query.keyword
            ? {
                $or: [
                    { title: { $regex: req.query.keyword, $options: 'i' } },
                    { sku: { $regex: req.query.keyword, $options: 'i' } },
                ],
            }
            : {};

        const count = await Product.countDocuments({ ...keyword });
        const products = await Product.find({ ...keyword })
            .limit(pageSize)
            .skip(pageSize * page)
            .sort({ createdAt: -1 });

        res.json({ data: products, total: count, page, limit: pageSize });
    } catch (error) {
        res.status(500);
        throw new Error('Server Error: ' + error.message);
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Private
export const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Inventory
export const createProduct = async (req, res) => {
    const { title, sku, price, cost, stock, reorderLevel, category, unit, description } = req.body;

    const productExists = await Product.findOne({ sku });

    if (productExists) {
        res.status(400);
        throw new Error('Product with this SKU already exists');
    }

    const product = new Product({
        title,
        sku,
        price,
        cost,
        stock,
        reorderLevel,
        category,
        unit,
        description,
        createdBy: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Inventory
export const updateProduct = async (req, res) => {
    const { title, sku, price, cost, stock, reorderLevel, category, unit, description, isActive } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.title = title || product.title;
        product.sku = sku || product.sku;
        product.price = price !== undefined ? price : product.price;
        product.cost = cost !== undefined ? cost : product.cost;
        product.stock = stock !== undefined ? stock : product.stock;
        product.reorderLevel = reorderLevel !== undefined ? reorderLevel : product.reorderLevel;
        product.category = category || product.category;
        product.unit = unit || product.unit;
        product.description = description || product.description;
        product.isActive = isActive !== undefined ? isActive : product.isActive;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
};
