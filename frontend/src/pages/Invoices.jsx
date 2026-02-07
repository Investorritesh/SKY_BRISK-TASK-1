import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Button,
    Typography,
    Paper,
    Chip,
    IconButton,
} from '@mui/material';
import { GetApp, Refresh } from '@mui/icons-material';
import DataTable from '../components/common/DataTable';
import { getInvoices } from '../redux/slices/invoiceSlice';
import { generateInvoicePDF } from '../utils/pdfGenerator';

const Invoices = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const dispatch = useDispatch();
    const { invoices, isLoading, total } = useSelector((state) => state.invoices);

    useEffect(() => {
        dispatch(getInvoices({ page, limit: rowsPerPage }));
    }, [dispatch, page, rowsPerPage]);

    const columns = [
        { id: 'invoiceNumber', label: 'Invoice #', minWidth: 100 },
        {
            id: 'customer',
            label: 'Customer',
            minWidth: 150,
            format: (val) => val?.name || 'N/A'
        },
        {
            id: 'invoiceDate',
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
                    color={val === 'paid' ? 'success' : 'error'}
                    size="small"
                />
            )
        },
        {
            id: 'totalAmount',
            label: 'Amount',
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
                <Typography variant="h4" fontWeight="bold">Invoices</Typography>
                <Button startIcon={<Refresh />} onClick={() => dispatch(getInvoices({ page, limit: rowsPerPage }))}>Refresh</Button>
            </Box>

            <DataTable
                title="Billing History"
                rows={invoices}
                columns={columns}
                page={page}
                rowsPerPage={rowsPerPage}
                total={total}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                isLoading={isLoading}
                onView={(invoice) => generateInvoicePDF(invoice)}
            />
        </Box>
    );
};

export default Invoices;
