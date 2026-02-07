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
    Stack,
    Tooltip,
} from '@mui/material';
import { Add, Close, Refresh, Person, Mail, Shield, ToggleOff, ToggleOn } from '@mui/icons-material';
import DataTable from '../components/common/DataTable';
import UserForm from '../components/forms/UserForm';
import { getUsers, updateUser, reset } from '../redux/slices/userSlice';
import { toast } from 'react-toastify';

const UserManagement = () => {
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const dispatch = useDispatch();

    const { users, isLoading, isSuccess, isError, message, total } = useSelector((state) => state.users);

    useEffect(() => {
        dispatch(getUsers({ page, limit: rowsPerPage }));
    }, [dispatch, page, rowsPerPage]);

    useEffect(() => {
        if (isError) {
            toast.error(message || 'Failed to fetch users');
            dispatch(reset());
        }
        if (isSuccess && open) {
            setOpen(false);
            setSelectedUser(null);
            toast.success('Successfully updated user');
            dispatch(reset());
        }
    }, [isSuccess, isError, message, open, dispatch]);

    const handleEdit = (user) => {
        setSelectedUser(user);
        setOpen(true);
    };

    const columns = [
        {
            id: 'name',
            label: 'Full Name',
            minWidth: 170,
            format: (val) => (
                <Stack direction="row" spacing={1} alignItems="center">
                    <Person fontSize="small" sx={{ color: '#1a237e' }} />
                    <Typography variant="body2" fontWeight="medium">{val}</Typography>
                </Stack>
            )
        },
        {
            id: 'email',
            label: 'Email',
            minWidth: 200,
            format: (val) => (
                <Stack direction="row" spacing={1} alignItems="center">
                    <Mail fontSize="small" sx={{ color: '#9e9e9e' }} />
                    <Typography variant="body2" color="textSecondary">{val}</Typography>
                </Stack>
            )
        },
        {
            id: 'role',
            label: 'Role',
            minWidth: 120,
            format: (val) => {
                const colors = {
                    admin: { bg: '#e8eaf6', text: '#3f51b5' },
                    sales: { bg: '#e3f2fd', text: '#1976d2' },
                    inventory: { bg: '#e8f5e9', text: '#2e7d32' },
                    purchase: { bg: '#fff3e0', text: '#ef6c00' },
                };
                const style = colors[val?.toLowerCase()] || colors.admin;
                return (
                    <Chip
                        label={val?.toUpperCase()}
                        size="small"
                        sx={{
                            bgcolor: style.bg,
                            color: style.text,
                            fontWeight: 'bold',
                            borderRadius: 1.5
                        }}
                    />
                );
            }
        },
        {
            id: 'isActive',
            label: 'Status',
            minWidth: 120,
            format: (val) => (
                <Chip
                    label={val ? 'ACTIVE' : 'INACTIVE'}
                    size="small"
                    variant={val ? 'filled' : 'outlined'}
                    color={val ? 'success' : 'default'}
                    sx={{ borderRadius: 1.5, fontWeight: 'medium' }}
                />
            )
        },
    ];

    return (
        <Box sx={{ p: 1 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Typography variant="h4" fontWeight="bold" sx={{ color: '#1a237e' }}>
                    User Management
                </Typography>
                <Stack direction="row" spacing={2}>
                    <Button
                        startIcon={<Refresh />}
                        onClick={() => dispatch(getUsers({ page, limit: rowsPerPage }))}
                        sx={{ borderRadius: 2 }}
                    >
                        Refresh
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setOpen(true)}
                        sx={{
                            borderRadius: 2,
                            px: 3,
                            bgcolor: '#1976d2',
                            '&:hover': { bgcolor: '#1565c0' },
                            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.2)'
                        }}
                    >
                        Add User
                    </Button>
                </Stack>
            </Box>

            <Paper sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <DataTable
                    title="System Users"
                    rows={users}
                    columns={columns}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    total={total}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                    isLoading={isLoading}
                    onEdit={handleEdit}
                />
            </Paper>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
                <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {selectedUser ? 'Edit User' : 'Add New User'}
                    <IconButton onClick={() => setOpen(false)} size="small"><Close /></IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <UserForm
                        initialValues={selectedUser}
                        onSubmit={(val) => {
                            if (selectedUser) {
                                dispatch(updateUser({ id: selectedUser._id, userData: val }));
                            } else {
                                toast.info('Register from public page for security');
                            }
                        }}
                        onCancel={() => setOpen(false)}
                        isLoading={isLoading}
                    />
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default UserManagement;
