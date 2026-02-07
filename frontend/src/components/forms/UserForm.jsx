import {
    Box,
    Button,
    Grid,
    TextField,
    MenuItem,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const roles = [
    { value: 'admin', label: 'Admin' },
    { value: 'sales', label: 'Sales' },
    { value: 'purchase', label: 'Purchase' },
    { value: 'inventory', label: 'Inventory' },
    { value: 'viewer', label: 'Viewer' },
];

const UserForm = ({ initialValues, onSubmit, onCancel, isLoading }) => {
    const formik = useFormik({
        initialValues: initialValues || {
            name: '',
            email: '',
            password: '',
            role: 'viewer',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            email: Yup.string().email('Invalid email').required('Email is required'),
            password: initialValues ? Yup.string() : Yup.string().min(6).required('Password is required'),
            role: Yup.string().required('Role is required'),
        }),
        onSubmit: (values) => {
            onSubmit(values);
        },
        enableReinitialize: true,
    });

    return (
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        id="name"
                        name="name"
                        label="Full Name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        error={formik.touched.name && Boolean(formik.errors.name)}
                        helperText={formik.touched.name && formik.errors.name}
                    />
                </Grid>
                <Grid item xs={12}>
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
                {!initialValues && (
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                        />
                    </Grid>
                )}
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        select
                        id="role"
                        name="role"
                        label="Role"
                        value={formik.values.role}
                        onChange={formik.handleChange}
                        error={formik.touched.role && Boolean(formik.errors.role)}
                        helperText={formik.touched.role && formik.errors.role}
                    >
                        {roles.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
            </Grid>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button onClick={onCancel}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isLoading}>
                    {initialValues ? 'Update User' : 'Add User'}
                </Button>
            </Box>
        </Box>
    );
};

export default UserForm;
