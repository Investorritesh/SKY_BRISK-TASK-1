import {
    Box,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    useTheme,
} from '@mui/material';
import {
    ChevronLeft,
    DashboardOutlined,
    Inventory2Outlined,
    PeopleOutlined,
    LocalShippingOutlined,
    ShoppingCartOutlined,
    ReceiptLongOutlined,
    AssessmentOutlined,
    AdminPanelSettingsOutlined,
    DescriptionOutlined,
    StoreOutlined,
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const navItems = [
    { text: 'Dashboard', icon: <DashboardOutlined />, path: '/dashboard' },
    { text: 'Products', icon: <Inventory2Outlined />, path: '/products' },
    { text: 'Customers', icon: <PeopleOutlined />, path: '/customers' },
    { text: 'Suppliers', icon: <StoreOutlined />, path: '/suppliers' },
    { text: 'Sales Orders', icon: <ShoppingCartOutlined />, path: '/sales-orders' },
    { text: 'Purchase Orders', icon: <LocalShippingOutlined />, path: '/purchase-orders' },
    { text: 'GRN', icon: <DescriptionOutlined />, path: '/grn' },
    { text: 'Invoices', icon: <ReceiptLongOutlined />, path: '/invoices' },
    { text: 'Reports', icon: <AssessmentOutlined />, path: '/reports' },
    { text: 'Admin', icon: <AdminPanelSettingsOutlined />, path: '/admin', adminOnly: true },
];

const Sidebar = ({ drawerWidth, isSidebarOpen, setIsSidebarOpen, isNonMobile }) => {
    const { pathname } = useLocation();
    const [active, setActive] = useState('');
    const navigate = useNavigate();
    const theme = useTheme();
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        setActive(pathname);
    }, [pathname]);

    return (
        <Box component="nav">
            <Drawer
                open={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                variant={isNonMobile ? 'persistent' : 'temporary'}
                anchor="left"
                sx={{
                    width: drawerWidth,
                    '& .MuiDrawer-paper': {
                        color: theme.palette.text.primary,
                        backgroundColor: '#fff',
                        boxSizing: 'border-box',
                        borderWidth: isNonMobile ? 0 : '1px',
                        width: drawerWidth,
                        boxShadow: '4px 0px 10px rgba(0,0,0,0.02)',
                    },
                }}
            >
                <Box width="100%">
                    <Box m="1.5rem 2rem 2rem 3rem">
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box display="flex" alignItems="center" gap="0.5rem">
                                <Typography variant="h5" fontWeight="bold" color={theme.palette.primary.main}>
                                    ERP System
                                </Typography>
                            </Box>
                            {!isNonMobile && (
                                <IconButton onClick={() => setIsSidebarOpen(false)}>
                                    <ChevronLeft />
                                </IconButton>
                            )}
                        </Box>
                    </Box>
                    <List sx={{ px: '0.5rem' }}>
                        {navItems.map(({ text, icon, path, adminOnly }) => {
                            if (adminOnly && user?.role !== 'admin') return null;

                            return (
                                <ListItem key={text} disablePadding>
                                    <ListItemButton
                                        onClick={() => {
                                            navigate(path);
                                            setActive(path);
                                            if (!isNonMobile) setIsSidebarOpen(false);
                                        }}
                                        sx={{
                                            backgroundColor: active === path ? theme.palette.primary.light : 'transparent',
                                            color: active === path ? theme.palette.primary.main : theme.palette.text.secondary,
                                            mb: '0.2rem',
                                            borderRadius: '8px',
                                            '&:hover': {
                                                backgroundColor: active === path ? theme.palette.primary.light : 'rgba(25, 118, 210, 0.04)',
                                            },
                                            px: '1.5rem'
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: '40px',
                                                color: active === path ? theme.palette.primary.main : theme.palette.text.secondary,
                                            }}
                                        >
                                            {icon}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={text}
                                            primaryTypographyProps={{
                                                fontSize: '0.9rem',
                                                fontWeight: active === path ? 600 : 400
                                            }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                </Box>
            </Drawer>
        </Box>
    );
};

export default Sidebar;
