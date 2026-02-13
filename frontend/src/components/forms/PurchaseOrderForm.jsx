import {
    Box,
    Button,
    Grid,
    TextField,
    Typography,
    IconButton,
    MenuItem,
    Divider,
} from '@mui/material';
import { Delete, Add } from '@mui/icons-material';
import { useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';

const PurchaseOrderForm = ({ initialValues, suppliers, products, onSubmit, onCancel, isLoading }) => {
    const formik = useFormik({
        initialValues: initialValues || {
            supplier: '',
            items: [{ product: '', quantity: 1, price: 0, total: 0 }],
            subtotal: 0,
            tax: 0,
            shipping: 0,
            totalPrice: 0,
            notes: '',
        },
        validationSchema: Yup.object({
            supplier: Yup.string().required('Supplier is required'),
            items: Yup.array().of(
                Yup.object({
                    product: Yup.string().required('Product is required'),
                    quantity: Yup.number().min(1).required('Required'),
                    price: Yup.number().min(0).required('Required'),
                })
            ),
        }),
        onSubmit: (values) => {
            onSubmit(values);
        },
    });

    const calculateTotals = (items, tax, shipping) => {
        const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
        const total = subtotal + Number(tax || 0) + Number(shipping || 0);
        formik.setFieldValue('subtotal', subtotal);
        formik.setFieldValue('totalPrice', total);
    };

    return (
        <FormikProvider value={formik}>
            <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            select
                            id="supplier"
                            name="supplier"
                            label="Supplier"
                            value={formik.values.supplier}
                            onChange={formik.handleChange}
                            error={formik.touched.supplier && Boolean(formik.errors.supplier)}
                            helperText={formik.touched.supplier && formik.errors.supplier}
                        >
                            {suppliers.map((s) => (
                                <MenuItem key={s._id} value={s._id}>
                                    {s.name} ({s.company})
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="h6" sx={{ mb: 1 }}>Purchase Items</Typography>
                        <Divider sx={{ mb: 2 }} />
                    </Grid>

                    <Grid item xs={12}>
                        <Box sx={{ overflowX: 'auto', width: '100%', pb: 1 }}>
                            <Box sx={{ minWidth: 800 }}>
                                {formik.values.items.map((item, index) => (
                                    <Grid container spacing={2} key={index} alignItems="center" sx={{ mb: 2 }}>
                                        <Grid item xs={4}>
                                            <TextField
                                                fullWidth
                                                select
                                                name={`items[${index}].product`}
                                                label="Product"
                                                size="small"
                                                value={item.product}
                                                onChange={(e) => {
                                                    const p = products.find(prod => prod._id === e.target.value);
                                                    formik.setFieldValue(`items[${index}].product`, e.target.value);
                                                    formik.setFieldValue(`items[${index}].price`, p ? p.cost : 0);
                                                    const newItems = [...formik.values.items];
                                                    newItems[index] = { ...newItems[index], product: e.target.value, price: p ? p.cost : 0 };
                                                    calculateTotals(newItems, formik.values.tax, formik.values.shipping);
                                                }}
                                            >
                                                {products.map((p) => (
                                                    <MenuItem key={p._id} value={p._id}>
                                                        {p.title} (SKU: {p.sku})
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                name={`items[${index}].quantity`}
                                                label="Qty"
                                                size="small"
                                                value={item.quantity}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                    const newItems = [...formik.values.items];
                                                    newItems[index].quantity = e.target.value;
                                                    calculateTotals(newItems, formik.values.tax, formik.values.shipping);
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={2}>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                label="Cost Price"
                                                size="small"
                                                name={`items[${index}].price`}
                                                value={item.price}
                                                onChange={(e) => {
                                                    formik.handleChange(e);
                                                    const newItems = [...formik.values.items];
                                                    newItems[index].price = e.target.value;
                                                    calculateTotals(newItems, formik.values.tax, formik.values.shipping);
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Typography variant="body2" align="right" fontWeight="500">
                                                Total: ${(item.quantity * item.price).toFixed(2)}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <IconButton
                                                color="error"
                                                size="small"
                                                onClick={() => {
                                                    const newItems = formik.values.items.filter((_, i) => i !== index);
                                                    formik.setFieldValue('items', newItems);
                                                    calculateTotals(newItems, formik.values.tax, formik.values.shipping);
                                                }}
                                                disabled={formik.values.items.length === 1}
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                ))}
                                <Button
                                    startIcon={<Add />}
                                    variant="outlined"
                                    size="small"
                                    sx={{ mt: 1 }}
                                    onClick={() => formik.setFieldValue('items', [...formik.values.items, { product: '', quantity: 1, price: 0, total: 0 }])}
                                >
                                    Add Item
                                </Button>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Tax"
                            name="tax"
                            value={formik.values.tax}
                            onChange={(e) => {
                                formik.handleChange(e);
                                calculateTotals(formik.values.items, e.target.value, formik.values.shipping);
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            type="number"
                            label="Shipping"
                            name="shipping"
                            value={formik.values.shipping}
                            onChange={(e) => {
                                formik.handleChange(e);
                                calculateTotals(formik.values.items, formik.values.tax, e.target.value);
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} display="flex" flexDirection="column" justifyContent="center" alignItems="flex-end">
                        <Typography variant="h6">Subtotal: ${formik.values.subtotal.toFixed(2)}</Typography>
                        <Typography variant="h5" color="primary" fontWeight="bold">Total Cost: ${formik.values.totalPrice.toFixed(2)}</Typography>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button onClick={onCancel}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={isLoading}>
                        Create PO
                    </Button>
                </Box>
            </Box>
        </FormikProvider>
    );
};

export default PurchaseOrderForm;
