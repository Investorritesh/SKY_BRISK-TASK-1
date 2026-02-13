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
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { Add, Refresh, Close } from '@mui/icons-material';
import DataTable from '../components/common/DataTable';
import CustomerForm from '../components/forms/CustomerForm';
import { getCustomers, createCustomer, reset } from '../redux/slices/customerSlice';
import { toast } from 'react-toastify';

const Customers = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
            <Box
                display="flex"
                flexDirection={isMobile ? 'column' : 'row'}
                justifyContent="space-between"
                alignItems={isMobile ? 'flex-start' : 'center'}
                gap={isMobile ? 2 : 0}
                mb={3}
            >
                <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">Customers</Typography>
                <Box gap={1} display="flex" width={isMobile ? '100%' : 'auto'}>
                    <Button
                        startIcon={<Refresh />}
                        onClick={() => dispatch(getCustomers({ page, limit: rowsPerPage }))}
                        sx={{ flex: isMobile ? 1 : 'unset' }}
                    >
                        Refresh
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setOpen(true)}
                        sx={{ flex: isMobile ? 1 : 'unset' }}
                    >
                        Add Customer
                    </Button>
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
