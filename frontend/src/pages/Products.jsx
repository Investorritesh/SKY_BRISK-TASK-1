import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
    InputAdornment,
    Chip,
} from '@mui/material';
import { Add, Search } from '@mui/icons-material';
import {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    reset,
} from '../redux/slices/productSlice';
import DataTable from '../components/common/DataTable';
import ProductForm from '../components/forms/ProductForm';
import { toast } from 'react-toastify';

const Products = () => {
    const dispatch = useDispatch();
    const { products, isLoading, isError, isSuccess, message, total, page } = useSelector(
        (state) => state.products
    );

    const [open, setOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [keyword, setKeyword] = useState('');
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        dispatch(getProducts({ page: currentPage, keyword, limit }));
    }, [dispatch, currentPage, keyword, limit]);

    useEffect(() => {
        if (isError) {
            toast.error(message);
            dispatch(reset());
        }
        if (isSuccess && open) {
            toast.success(selectedProduct ? 'Product updated' : 'Product created');
            setOpen(false);
            setSelectedProduct(null);
            dispatch(reset());
        }
    }, [isError, isSuccess, message, dispatch, open, selectedProduct]);

    const columns = [
        { id: 'sku', label: 'SKU', minWidth: 100 },
        { id: 'title', label: 'Title', minWidth: 170 },
        { id: 'category', label: 'Category', minWidth: 120 },
        {
            id: 'price',
            label: 'Price',
            minWidth: 100,
            align: 'right',
            format: (value) => `$${value.toFixed(2)}`,
        },
        {
            id: 'stock',
            label: 'Stock',
            minWidth: 100,
            align: 'center',
            format: (value, row) => (
                <Chip
                    label={value}
                    color={value <= row.reorderLevel ? 'error' : 'success'}
                    size="small"
                />
            ),
        },
        { id: 'unit', label: 'Unit', minWidth: 80 },
    ];

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setSelectedProduct(null);
    };

    const handleEdit = (product) => {
        setSelectedProduct(product);
        setOpen(true);
    };

    const handleDelete = (product) => {
        if (window.confirm(`Are you sure you want to delete ${product.title}?`)) {
            dispatch(deleteProduct(product._id));
        }
    };

    const handleSubmit = (values) => {
        if (selectedProduct) {
            dispatch(updateProduct({ id: selectedProduct._id, productData: values }));
        } else {
            dispatch(createProduct(values));
        }
    };

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <TextField
                    placeholder="Search products..."
                    variant="outlined"
                    size="small"
                    value={keyword}
                    onChange={(e) => {
                        setKeyword(e.target.value);
                        setCurrentPage(0);
                    }}
                    sx={{ width: '300px', bgcolor: '#fff' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                />
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleOpen}
                >
                    Add Product
                </Button>
            </Box>

            <DataTable
                title="Products Catalog"
                columns={columns}
                rows={products}
                page={currentPage}
                rowsPerPage={limit}
                total={total}
                onPageChange={handlePageChange}
                onRowsPerPageChange={(e) => {
                    setLimit(parseInt(e.target.value, 10));
                    setCurrentPage(0);
                }}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isLoading={isLoading}
            />

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold' }}>
                    {selectedProduct ? 'Edit Product' : 'Add New Product'}
                </DialogTitle>
                <DialogContent>
                    <ProductForm
                        initialValues={selectedProduct}
                        onSubmit={handleSubmit}
                        onCancel={handleClose}
                        isLoading={isLoading}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default Products;
