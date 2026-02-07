import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Button,
    Typography,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Chip,
} from '@mui/material';
import { Add, Refresh, Close, Receipt } from '@mui/icons-material';
import DataTable from '../components/common/DataTable';
import OrderForm from '../components/forms/OrderForm';
import { getSalesOrders, createSalesOrder, reset } from '../redux/slices/salesSlice';
import { getCustomers } from '../redux/slices/customerSlice';
import { getProducts } from '../redux/slices/productSlice';
import { createInvoice } from '../redux/slices/invoiceSlice';
import { toast } from 'react-toastify';

const SalesOrders = () => {
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const dispatch = useDispatch();
    const { orders, isLoading, isSuccess, total } = useSelector((state) => state.sales);
    const { customers } = useSelector((state) => state.customers);
    const { products } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(getSalesOrders({ page, limit: rowsPerPage }));
        dispatch(getCustomers({ limit: 1000 }));
        dispatch(getProducts({ limit: 1000 }));
    }, [dispatch, page, rowsPerPage]);

    useEffect(() => {
        if (isSuccess && open) {
            setOpen(false);
            toast.success('Order created successfully');
            dispatch(reset());
        }
    }, [isSuccess, open, dispatch]);

    const handleGenerateInvoice = (order) => {
        const invoiceData = {
            salesOrder: order._id,
            customer: order.customer._id,
            items: order.items,
            subtotal: order.subtotal,
            tax: order.tax,
            shipping: order.shipping,
            totalAmount: order.totalPrice,
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        };
        dispatch(createInvoice(invoiceData)).then((res) => {
            if (!res.error) toast.success('Invoice generated!');
        });
    };

    const columns = [
        { id: 'orderNumber', label: 'Order ID', minWidth: 100 },
        {
            id: 'customer',
            label: 'Customer',
            minWidth: 150,
            format: (val) => val?.name || 'N/A'
        },
        {
            id: 'createdAt',
            label: 'Date',
            minWidth: 120,
            format: (val) => new Date(val).toLocaleDateString()
        },
        {
            id: 'status',
            label: 'Status',
            minWidth: 100,
            format: (val) => (
                <Chip
                    label={val?.toUpperCase()}
                    color={val === 'confirmed' ? 'success' : 'warning'}
                    size="small"
                />
            )
        },
        {
            id: 'totalPrice',
            label: 'Total',
            minWidth: 100,
            align: 'right',
            format: (val) => `$${val.toFixed(2)}`
        },
    ];

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" fontWeight="bold">Sales Orders</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>Create Order</Button>
            </Box>

            <DataTable
                title="Recent Sales Orders"
                rows={orders}
                columns={columns}
                page={page}
                rowsPerPage={rowsPerPage}
                total={total}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                isLoading={isLoading}
                onView={(order) => handleGenerateInvoice(order)}
            />

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    Create Sales Order
                    <IconButton onClick={() => setOpen(false)} sx={{ position: 'absolute', right: 8, top: 8 }}><Close /></IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <OrderForm
                        customers={customers}
                        products={products}
                        onSubmit={(val) => dispatch(createSalesOrder(val))}
                        onCancel={() => setOpen(false)}
                        isLoading={isLoading}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default SalesOrders;
