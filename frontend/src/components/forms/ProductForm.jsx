import {
    Box,
    Button,
    Grid,
    TextField,
    Typography,
    MenuItem,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const categories = [
    'Electronics',
    'Hardware',
    'Software',
    'Office Supplies',
    'Raw Materials',
    'Finished Goods',
];

const ProductForm = ({ initialValues, onSubmit, onCancel, isLoading }) => {
    const formik = useFormik({
        initialValues: initialValues || {
            title: '',
            sku: '',
            category: '',
            price: 0,
            cost: 0,
            stock: 0,
            reorderLevel: 10,
            unit: 'pcs',
            description: '',
        },
        validationSchema: Yup.object({
            title: Yup.string().required('Title is required'),
            sku: Yup.string().required('SKU is required'),
            category: Yup.string().required('Category is required'),
            price: Yup.number().min(0).required('Price is required'),
            cost: Yup.number().min(0).required('Cost is required'),
            stock: Yup.number().min(0).required('Stock is required'),
            reorderLevel: Yup.number().min(0),
            unit: Yup.string().required('Unit is required'),
        }),
        onSubmit: (values) => {
            onSubmit(values);
        },
        enableReinitialize: true,
    });

    return (
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        id="title"
                        name="title"
                        label="Product Title"
                        value={formik.values.title}
                        onChange={formik.handleChange}
                        error={formik.touched.title && Boolean(formik.errors.title)}
                        helperText={formik.touched.title && formik.errors.title}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        id="sku"
                        name="sku"
                        label="SKU"
                        value={formik.values.sku}
                        onChange={formik.handleChange}
                        error={formik.touched.sku && Boolean(formik.errors.sku)}
                        helperText={formik.touched.sku && formik.errors.sku}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        select
                        id="category"
                        name="category"
                        label="Category"
                        value={formik.values.category}
                        onChange={formik.handleChange}
                        error={formik.touched.category && Boolean(formik.errors.category)}
                        helperText={formik.touched.category && formik.errors.category}
                    >
                        {categories.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        id="unit"
                        name="unit"
                        label="Unit (e.g., pcs, kg)"
                        value={formik.values.unit}
                        onChange={formik.handleChange}
                        error={formik.touched.unit && Boolean(formik.errors.unit)}
                        helperText={formik.touched.unit && formik.errors.unit}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        type="number"
                        id="price"
                        name="price"
                        label="Selling Price"
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        error={formik.touched.price && Boolean(formik.errors.price)}
                        helperText={formik.touched.price && formik.errors.price}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        type="number"
                        id="cost"
                        name="cost"
                        label="Cost Price"
                        value={formik.values.cost}
                        onChange={formik.handleChange}
                        error={formik.touched.cost && Boolean(formik.errors.cost)}
                        helperText={formik.touched.cost && formik.errors.cost}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        type="number"
                        id="stock"
                        name="stock"
                        label="Initial Stock"
                        value={formik.values.stock}
                        onChange={formik.handleChange}
                        error={formik.touched.stock && Boolean(formik.errors.stock)}
                        helperText={formik.touched.stock && formik.errors.stock}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        type="number"
                        id="reorderLevel"
                        name="reorderLevel"
                        label="Reorder Level"
                        value={formik.values.reorderLevel}
                        onChange={formik.handleChange}
                        error={formik.touched.reorderLevel && Boolean(formik.errors.reorderLevel)}
                        helperText={formik.touched.reorderLevel && formik.errors.reorderLevel}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        id="description"
                        name="description"
                        label="Description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                    />
                </Grid>
            </Grid>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button onClick={onCancel}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isLoading}>
                    {initialValues ? 'Update Product' : 'Add Product'}
                </Button>
            </Box>
        </Box>
    );
};

export default ProductForm;
