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
import { Add, Close, Refresh } from '@mui/icons-material';
import DataTable from '../components/common/DataTable';
import GRNForm from '../components/forms/GRNForm';
import { getGRNs, createGRN, reset } from '../redux/slices/grnSlice';
import { getPurchaseOrders } from '../redux/slices/purchaseSlice';
import { toast } from 'react-toastify';

const GRN = () => {
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const dispatch = useDispatch();
    const { grns, isLoading, isSuccess, total } = useSelector((state) => state.grn);
    const { orders } = useSelector((state) => state.purchase);

    useEffect(() => {
        dispatch(getGRNs({ page, limit: rowsPerPage }));
        dispatch(getPurchaseOrders({ limit: 1000 }));
    }, [dispatch, page, rowsPerPage]);

    useEffect(() => {
        if (isSuccess && open) {
            setOpen(false);
            toast.success('GRN received and stock updated!');
            dispatch(reset());
        }
    }, [isSuccess, open, dispatch]);

    const columns = [
        { id: 'grnNumber', label: 'GRN #', minWidth: 100 },
        {
            id: 'purchaseOrder',
            label: 'PO Ref',
            minWidth: 120,
            format: (val) => val?.orderNumber || 'N/A'
        },
        {
            id: 'supplier',
            label: 'Supplier',
            minWidth: 150,
            format: (val) => val?.name || 'N/A'
        },
        {
            id: 'receivedDate',
            label: 'Date Received',
            minWidth: 150,
            format: (val) => new Date(val).toLocaleDateString()
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
                <Typography variant="h4" fontWeight="bold">Goods Receipt Note (GRN)</Typography>
                <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>Receive Goods</Button>
            </Box>

            <DataTable
                title="Inventory Receipts"
                rows={grns}
                columns={columns}
                page={page}
                rowsPerPage={rowsPerPage}
                total={total}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                isLoading={isLoading}
            />

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Create GRN
                    <IconButton onClick={() => setOpen(false)} sx={{ position: 'absolute', right: 8, top: 8 }}><Close /></IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <GRNForm
                        purchaseOrders={orders}
                        onSubmit={(val) => dispatch(createGRN(val))}
                        onCancel={() => setOpen(false)}
                        isLoading={isLoading}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default GRN;
