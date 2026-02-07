import {
    Box,
    Button,
    Grid,
    TextField,
    Typography,
    MenuItem,
    Divider,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const GRNForm = ({ purchaseOrders, onSubmit, onCancel, isLoading }) => {
    const formik = useFormik({
        initialValues: {
            purchaseOrder: '',
            items: [],
            notes: '',
        },
        validationSchema: Yup.object({
            purchaseOrder: Yup.string().required('PO is required'),
        }),
        onSubmit: (values) => {
            onSubmit(values);
        },
    });

    const handlePOChange = (e) => {
        const po = purchaseOrders.find(p => p._id === e.target.value);
        formik.setFieldValue('purchaseOrder', e.target.value);
        if (po) {
            const items = po.items.map(item => ({
                product: item.product._id,
                title: item.product.title,
                orderedQuantity: item.quantity,
                receivedQuantity: item.quantity,
            }));
            formik.setFieldValue('items', items);
        }
    };

    return (
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        select
                        label="Purchase Order Ref"
                        value={formik.values.purchaseOrder}
                        onChange={handlePOChange}
                        error={formik.touched.purchaseOrder && Boolean(formik.errors.purchaseOrder)}
                        helperText={formik.touched.purchaseOrder && formik.errors.purchaseOrder}
                    >
                        {purchaseOrders.filter(po => po.status !== 'received').map((po) => (
                            <MenuItem key={po._id} value={po._id}>
                                {po.orderNumber} - {po.supplier.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {formik.values.items.length > 0 && (
                    <Grid item xs={12}>
                        <Typography variant="h6" sx={{ mb: 1 }}>Review Received quantities</Typography>
                        <Divider sx={{ mb: 2 }} />
                        {formik.values.items.map((item, index) => (
                            <Grid container spacing={2} key={index} alignItems="center" sx={{ mb: 1 }}>
                                <Grid item xs={6}>
                                    <Typography variant="body1">{item.title}</Typography>
                                    <Typography variant="caption">Ordered: {item.orderedQuantity}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Recv Qty"
                                        value={item.receivedQuantity}
                                        onChange={(e) => formik.setFieldValue(`items[${index}].receivedQuantity`, e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                )}

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label="Remarks"
                        name="notes"
                        value={formik.values.notes}
                        onChange={formik.handleChange}
                    />
                </Grid>
            </Grid>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button onClick={onCancel}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isLoading}>
                    Create GRN
                </Button>
            </Box>
        </Box>
    );
};

export default GRNForm;
