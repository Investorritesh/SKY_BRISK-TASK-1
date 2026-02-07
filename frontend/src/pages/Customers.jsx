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
} from '@mui/material';
import { Add, Refresh, Close } from '@mui/icons-material';
import DataTable from '../components/common/DataTable';
import CustomerForm from '../components/forms/CustomerForm';
import { getCustomers, createCustomer, reset } from '../redux/slices/customerSlice';
import { toast } from 'react-toastify';

const Customers = () => {
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const dispatch = useDispatch();
    const { customers, isLoading, isSuccess, message, total } = useSelector((state) => state.customers);

    useEffect(() => {
        dispatch(getCustomers({ page, limit: rowsPerPage }));
    }, [dispatch, page, rowsPerPage]);

    useEffect(() => {
        if (isSuccess && open) {
            setOpen(false);
            toast.success('Customer added successfully');
            dispatch(reset());
        }
    }, [isSuccess, open, dispatch]);

    const columns = [
        { id: 'name', label: 'Customer Name', minWidth: 170 },
        { id: 'company', label: 'Company', minWidth: 150 },
        { id: 'email', label: 'Email', minWidth: 170 },
        { id: 'phone', label: 'Phone', minWidth: 120 },
        {
            id: 'outstandingBalance',
            label: 'Outstanding',
            minWidth: 120,
            align: 'right',
            format: (value) => `$${value?.toFixed(2) || '0.00'}`
        },
    ];

    const handleAddSubmit = (values) => {
        dispatch(createCustomer(values));
    };

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
                <Typography variant="h4" fontWeight="bold">Customers</Typography>
                <Box gap={1} display="flex">
                    <Button startIcon={<Refresh />} onClick={() => dispatch(getCustomers({ page, limit: rowsPerPage }))}>Refresh</Button>
                    <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>Add Customer</Button>
                </Box>
            </Box>

            <DataTable
                title="Customer Directory"
                rows={customers}
                columns={columns}
                page={page}
                rowsPerPage={rowsPerPage}
                total={total}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                isLoading={isLoading}
            />

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    Add New Customer
                    <IconButton onClick={() => setOpen(false)} sx={{ position: 'absolute', right: 8, top: 8 }}><Close /></IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <CustomerForm onSubmit={handleAddSubmit} onCancel={() => setOpen(false)} isLoading={isLoading} />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Customers;
