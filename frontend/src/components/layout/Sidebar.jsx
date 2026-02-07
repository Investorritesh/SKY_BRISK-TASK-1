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
            {isSidebarOpen && (
                <Drawer
                    open={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    variant="persistent"
                    anchor="left"
                    sx={{
                        width: drawerWidth,
                        '& .MuiDrawer-paper': {
                            color: theme.palette.text.primary,
                            backgroundColor: '#fff',
                            boxSizing: 'border-box',
                            borderWidth: isNonMobile ? 0 : '2px',
                            width: drawerWidth,
                            boxShadow: '4px 0px 10px rgba(0,0,0,0.02)',
                        },
                    }}
                >
                    <Box width="100%">
                        <Box m="1.5rem 2rem 2rem 3rem">
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box display="flex" alignItems="center" gap="0.5rem">
                                    <Typography variant="h4" fontWeight="bold" color={theme.palette.primary.main}>
                                        ERP SYS
                                    </Typography>
                                </Box>
                                {!isNonMobile && (
                                    <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                                        <ChevronLeft />
                                    </IconButton>
                                )}
                            </Box>
                        </Box>
                        <List>
                            {navItems.map(({ text, icon, path, adminOnly }) => {
                                if (adminOnly && user?.role !== 'admin') return null;

                                return (
                                    <ListItem key={text} disablePadding>
                                        <ListItemButton
                                            onClick={() => {
                                                navigate(path);
                                                setActive(path);
                                            }}
                                            sx={{
                                                backgroundColor: active === path ? theme.palette.primary.main : 'transparent',
                                                color: active === path ? '#fff' : theme.palette.text.secondary,
                                                m: '0.2rem 1rem',
                                                borderRadius: '10px',
                                                '&:hover': {
                                                    backgroundColor: active === path ? theme.palette.primary.main : 'rgba(25, 118, 210, 0.08)',
                                                },
                                            }}
                                        >
                                            <ListItemIcon
                                                sx={{
                                                    ml: '1rem',
                                                    color: active === path ? '#fff' : theme.palette.text.secondary,
                                                }}
                                            >
                                                {icon}
                                            </ListItemIcon>
                                            <ListItemText primary={text} />
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Box>
                </Drawer>
            )}
        </Box>
    );
};

export default Sidebar;
