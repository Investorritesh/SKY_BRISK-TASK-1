import Customer from '../models/Customer.js';

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
export const getCustomers = async (req, res) => {
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

        const count = await Customer.countDocuments({ ...keyword });
        const customers = await Customer.find({ ...keyword })
            .limit(pageSize)
            .skip(pageSize * page)
            .sort({ createdAt: -1 });

        res.json({ data: customers, total: count, page, limit: pageSize });
    } catch (error) {
        res.status(500);
        throw new Error('Server Error');
    }
};

// @desc    Create a customer
// @route   POST /api/customers
// @access  Private
export const createCustomer = async (req, res) => {
    const { name, email, phone, company, address, taxId, notes } = req.body;

    const customer = new Customer({
        name,
        email,
        phone,
        company,
        address,
        taxId,
        notes,
        createdBy: req.user._id,
    });

    const createdCustomer = await customer.save();
    res.status(201).json(createdCustomer);
};

// @desc    Update a customer
// @route   PUT /api/customers/:id
// @access  Private
export const updateCustomer = async (req, res) => {
    const customer = await Customer.findById(req.params.id);

    if (customer) {
        customer.name = req.body.name || customer.name;
        customer.email = req.body.email || customer.email;
        customer.phone = req.body.phone || customer.phone;
        customer.company = req.body.company || customer.company;
        customer.address = req.body.address || customer.address;
        customer.taxId = req.body.taxId || customer.taxId;
        customer.notes = req.body.notes || customer.notes;
        customer.isActive = req.body.isActive !== undefined ? req.body.isActive : customer.isActive;

        const updatedCustomer = await customer.save();
        res.json(updatedCustomer);
    } else {
        res.status(404);
        throw new Error('Customer not found');
    }
};

// @desc    Delete a customer
// @route   DELETE /api/customers/:id
// @access  Private/Admin
export const deleteCustomer = async (req, res) => {
    const customer = await Customer.findById(req.params.id);

    if (customer) {
        await customer.deleteOne();
        res.json({ message: 'Customer removed' });
    } else {
        res.status(404);
        throw new Error('Customer not found');
    }
};
