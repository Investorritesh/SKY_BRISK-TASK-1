import Supplier from '../models/Supplier.js';

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Private
export const getSuppliers = async (req, res) => {
    try {
        const pageSize = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 0;
        const keyword = req.query.keyword
            ? {
                $or: [
                    { name: { $regex: req.query.keyword, $options: 'i' } },
                    { email: { $regex: req.query.keyword, $options: 'i' } },
                    { company: { $regex: req.query.keyword, $options: 'i' } },
                ],
            }
            : {};

        const count = await Supplier.countDocuments({ ...keyword });
        const suppliers = await Supplier.find({ ...keyword })
            .limit(pageSize)
            .skip(pageSize * page)
            .sort({ createdAt: -1 });

        res.json({ data: suppliers, total: count, page, limit: pageSize });
    } catch (error) {
        res.status(500);
        throw new Error('Server Error');
    }
};

// @desc    Create a supplier
// @route   POST /api/suppliers
// @access  Private
export const createSupplier = async (req, res) => {
    const { name, email, phone, company, address, taxId, paymentTerms, notes } = req.body;

    const supplier = new Supplier({
        name,
        email,
        phone,
        company,
        address,
        taxId,
        paymentTerms,
        notes,
        createdBy: req.user._id,
    });

    const createdSupplier = await supplier.save();
    res.status(201).json(createdSupplier);
};

// @desc    Update a supplier
// @route   PUT /api/suppliers/:id
// @access  Private
export const updateSupplier = async (req, res) => {
    const supplier = await Supplier.findById(req.params.id);

    if (supplier) {
        supplier.name = req.body.name || supplier.name;
        supplier.email = req.body.email || supplier.email;
        supplier.phone = req.body.phone || supplier.phone;
        supplier.company = req.body.company || supplier.company;
        supplier.address = req.body.address || supplier.address;
        supplier.taxId = req.body.taxId || supplier.taxId;
        supplier.paymentTerms = req.body.paymentTerms || supplier.paymentTerms;
        supplier.notes = req.body.notes || supplier.notes;
        supplier.isActive = req.body.isActive !== undefined ? req.body.isActive : supplier.isActive;

        const updatedSupplier = await supplier.save();
        res.json(updatedSupplier);
    } else {
        res.status(404);
        throw new Error('Supplier not found');
    }
};

// @desc    Delete a supplier
// @route   DELETE /api/suppliers/:id
// @access  Private/Admin
export const deleteSupplier = async (req, res) => {
    const supplier = await Supplier.findById(req.params.id);

    if (supplier) {
        await supplier.deleteOne();
        res.json({ message: 'Supplier removed' });
    } else {
        res.status(404);
        throw new Error('Supplier not found');
    }
};
