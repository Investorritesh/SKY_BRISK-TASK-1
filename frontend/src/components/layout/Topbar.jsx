import {
    AppBar,
    Box,
    IconButton,
    Toolbar,
    Typography,
    useTheme,
    Avatar,
    Menu,
    MenuItem,
    Divider,
    ListItemIcon,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Logout,
    Settings,
    Person,
} from '@mui/icons-material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout, reset } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Topbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/login');
    };

    return (
        <AppBar
            sx={{
                position: 'static',
                background: '#fff',
                boxShadow: 'none',
                borderBottom: '1px solid #e0e0e0',
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                {/* LEFT SIDE */}
                <Box display="flex" alignItems="center">
                    <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)} sx={{ color: theme.palette.text.secondary }}>
                        <MenuIcon />
                    </IconButton>
                </Box>

                {/* RIGHT SIDE */}
                <Box display="flex" alignItems="center" gap="1.5rem">
                    <Box display="flex" alignItems="center" sx={{ cursor: 'pointer' }} onClick={handleClick}>
                        <Box textAlign="right" mr="1rem" sx={{ display: { xs: 'none', sm: 'block' } }}>
                            <Typography fontWeight="bold" fontSize="0.85rem" color={theme.palette.text.primary}>
                                {user?.name}
                            </Typography>
                            <Typography fontSize="0.75rem" color={theme.palette.text.secondary} sx={{ textTransform: 'capitalize' }}>
                                {user?.role}
                            </Typography>
                        </Box>
                        <Avatar
                            sx={{
                                bgcolor: theme.palette.primary.main,
                                width: 32,
                                height: 32,
                                fontSize: '0.875rem'
                            }}
                        >
                            {user?.name?.charAt(0)}
                        </Avatar>
                    </Box>

                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        onClick={handleClose}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        PaperProps={{
                            elevation: 0,
                            sx: {
                                overflow: 'visible',
                                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                mt: 1.5,
                                '& .MuiAvatar-root': {
                                    width: 32,
                                    height: 32,
                                    ml: -0.5,
                                    mr: 1,
                                },
                                '&:before': {
                                    content: '""',
                                    display: 'block',
                                    position: 'absolute',
                                    top: 0,
                                    right: 14,
                                    width: 10,
                                    height: 10,
                                    bgcolor: 'background.paper',
                                    transform: 'translateY(-50%) rotate(45deg)',
                                    zIndex: 0,
                                },
                            },
                        }}
                    >
                        <MenuItem onClick={() => navigate('/profile')}>
                            <ListItemIcon><Person fontSize="small" /></ListItemIcon>
                            My Profile
                        </MenuItem>
                        <MenuItem onClick={handleClose}>
                            <ListItemIcon><Settings fontSize="small" /></ListItemIcon>
                            Settings
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                            Logout
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Topbar;
