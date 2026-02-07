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
import SupplierForm from '../components/forms/SupplierForm';
import { getSuppliers, createSupplier, reset } from '../redux/slices/supplierSlice';
import { toast } from 'react-toastify';

const Suppliers = () => {
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const dispatch = useDispatch();
    const { suppliers, isLoading, isSuccess, message, total } = useSelector((state) => state.suppliers);

    useEffect(() => {
        dispatch(getSuppliers({ page, limit: rowsPerPage }));
    }, [dispatch, page, rowsPerPage]);

    useEffect(() => {
        if (isSuccess && open) {
            setOpen(false);
            toast.success('Supplier added successfully');
            dispatch(reset());
        }
    }, [isSuccess, open, dispatch]);

    const columns = [
        { id: 'name', label: 'Supplier Name', minWidth: 170 },
        { id: 'contactPerson', label: 'Contact Person', minWidth: 150 },
        { id: 'phone', label: 'Phone', minWidth: 120 },
        { id: 'email', label: 'Email', minWidth: 170 },
        { id: 'company', label: 'Company', minWidth: 150 },
    ];

    const handleAddSubmit = (values) => {
        dispatch(createSupplier(values));
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
                <Typography variant="h4" fontWeight="bold">Suppliers</Typography>
                <Box gap={1} display="flex">
                    <Button startIcon={<Refresh />} onClick={() => dispatch(getSuppliers({ page, limit: rowsPerPage }))}>Refresh</Button>
                    <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>Add Supplier</Button>
                </Box>
            </Box>

            <DataTable
                title="Supplier Directory"
                rows={suppliers}
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
                    Add New Supplier
                    <IconButton onClick={() => setOpen(false)} sx={{ position: 'absolute', right: 8, top: 8 }}><Close /></IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <SupplierForm onSubmit={handleAddSubmit} onCancel={() => setOpen(false)} isLoading={isLoading} />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Suppliers;
