import {
    Box,
    Button,
    Grid,
    TextField,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const SupplierForm = ({ initialValues, onSubmit, onCancel, isLoading }) => {
    const formik = useFormik({
        initialValues: initialValues || {
            name: '',
            contactPerson: '',
            email: '',
            phone: '',
            company: '',
            taxId: '',
            address: {
                street: '',
                city: '',
                state: '',
                country: '',
            },
            paymentTerms: 'Net 30',
            notes: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Supplier Name is required'),
            email: Yup.string().email('Invalid email').required('Email is required'),
            phone: Yup.string().required('Phone is required'),
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
                        id="name"
                        name="name"
                        label="Supplier Name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        id="contactPerson"
                        name="contactPerson"
                        label="Contact Person"
                        value={formik.values.contactPerson}
                        onChange={formik.handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        id="email"
                        name="email"
                        label="Email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        id="phone"
                        name="phone"
                        label="Phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        error={formik.touched.phone && Boolean(formik.errors.phone)}
                        helperText={formik.touched.phone && formik.errors.phone}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        id="company"
                        name="company"
                        label="Company"
                        value={formik.values.company}
                        onChange={formik.handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        id="taxId"
                        name="taxId"
                        label="Tax ID / GST"
                        value={formik.values.taxId}
                        onChange={formik.handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        id="paymentTerms"
                        name="paymentTerms"
                        label="Payment Terms"
                        value={formik.values.paymentTerms}
                        onChange={formik.handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        id="address.street"
                        name="address.street"
                        label="Street"
                        value={formik.values.address.street}
                        onChange={formik.handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        fullWidth
                        id="address.city"
                        name="address.city"
                        label="City"
                        value={formik.values.address.city}
                        onChange={formik.handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        fullWidth
                        id="address.state"
                        name="address.state"
                        label="State"
                        value={formik.values.address.state}
                        onChange={formik.handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        fullWidth
                        id="address.country"
                        name="address.country"
                        label="Country"
                        value={formik.values.address.country}
                        onChange={formik.handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        multiline
                        rows={2}
                        id="notes"
                        name="notes"
                        label="Notes"
                        value={formik.values.notes}
                        onChange={formik.handleChange}
                    />
                </Grid>
            </Grid>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button onClick={onCancel}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isLoading}>
                    {initialValues ? 'Update Supplier' : 'Add Supplier'}
                </Button>
            </Box>
        </Box>
    );
};

export default SupplierForm;
