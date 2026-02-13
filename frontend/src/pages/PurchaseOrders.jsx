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
    useTheme,
    useMediaQuery,
} from '@mui/material';
import { Add, Refresh, Close } from '@mui/icons-material';
import DataTable from '../components/common/DataTable';
import PurchaseOrderForm from '../components/forms/PurchaseOrderForm';
import { getPurchaseOrders, createPurchaseOrder, reset } from '../redux/slices/purchaseSlice';
import { getSuppliers } from '../redux/slices/supplierSlice';
import { getProducts } from '../redux/slices/productSlice';
import { toast } from 'react-toastify';

const PurchaseOrders = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const dispatch = useDispatch();
    const { orders, isLoading, isSuccess, total } = useSelector((state) => state.purchase);
    const { suppliers } = useSelector((state) => state.suppliers);
    const { products } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(getPurchaseOrders({ page, limit: rowsPerPage }));
        dispatch(getSuppliers({ limit: 1000 }));
        dispatch(getProducts({ limit: 1000 }));
    }, [dispatch, page, rowsPerPage]);

    useEffect(() => {
        if (isSuccess && open) {
            setOpen(false);
            toast.success('PO created successfully');
            dispatch(reset());
        }
    }, [isSuccess, open, dispatch]);

    const columns = [
        { id: 'orderNumber', label: 'PO #', minWidth: 100 },
        {
            id: 'supplier',
            label: 'Supplier',
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
                    color={val === 'pending' ? 'warning' : 'success'}
                    size="small"
                />
            )
        },
        {
            id: 'totalPrice',
            label: 'Total Cost',
            minWidth: 120,
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
            <Box
                display="flex"
                flexDirection={isMobile ? 'column' : 'row'}
                justifyContent="space-between"
                alignItems={isMobile ? 'flex-start' : 'center'}
                gap={isMobile ? 2 : 0}
                mb={3}
            >
                <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">Purchase Orders</Typography>
                <Button
                    variant="contained"
                    fullWidth={isMobile}
                    startIcon={<Add />}
                    onClick={() => setOpen(true)}
                >
                    Create PO
                </Button>
            </Box>

            <DataTable
                title="Procurement Tracking"
                rows={orders}
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
                    Create Purchase Order
                    <IconButton onClick={() => setOpen(false)} sx={{ position: 'absolute', right: 8, top: 8 }}><Close /></IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <PurchaseOrderForm
                        suppliers={suppliers}
                        products={products}
                        onSubmit={(val) => dispatch(createPurchaseOrder(val))}
                        onCancel={() => setOpen(false)}
                        isLoading={isLoading}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default PurchaseOrders;
