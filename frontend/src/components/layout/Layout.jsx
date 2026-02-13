import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Box, useMediaQuery, useTheme, Button } from '@mui/material';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const location = useLocation();
    const isNonMobile = useMediaQuery('(min-width: 960px)');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <Box display="flex" width="100%" minHeight="100vh" bgcolor="#f4f6f8">
            <Sidebar
                isNonMobile={isNonMobile}
                drawerWidth="250px"
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />
            <Box
                flexGrow={1}
                display="flex"
                flexDirection="column"
                sx={{
                    width: isNonMobile ? `calc(100% - 250px)` : '100%',
                    transition: theme.transitions.create(['margin', 'width'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen,
                    }),
                }}
            >
                <Topbar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />

                {/* Horizontal scrollable nav for mobile */}
                {!isNonMobile && (
                    <Box sx={{
                        display: 'flex',
                        overflowX: 'auto',
                        bgcolor: '#fff',
                        borderBottom: '1px solid #e0e0e0',
                        whiteSpace: 'nowrap',
                        '&::-webkit-scrollbar': { display: 'none' },
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none',
                        px: 1,
                        py: 0.5
                    }}>
                        {[
                            { text: 'Dashboard', path: '/dashboard' },
                            { text: 'Products', path: '/products' },
                            { text: 'Customers', path: '/customers' },
                            { text: 'Suppliers', path: '/suppliers' },
                            { text: 'Sales', path: '/sales-orders' },
                            { text: 'Purchase', path: '/purchase-orders' },
                            { text: 'GRN', path: '/grn' },
                            { text: 'Invoices', path: '/invoices' },
                            { text: 'Reports', path: '/reports' }
                        ].map((item) => (
                            <Button
                                key={item.text}
                                size="small"
                                onClick={() => navigate(item.path)}
                                sx={{
                                    minWidth: 'auto',
                                    mx: 0.5,
                                    color: location.pathname === item.path ? 'primary.main' : 'text.secondary',
                                    fontWeight: location.pathname === item.path ? 600 : 400,
                                    textTransform: 'none',
                                    fontSize: '0.8rem'
                                }}
                            >
                                {item.text}
                            </Button>
                        ))}
                    </Box>
                )}

                <Box
                    p={isNonMobile ? "1.5rem" : "1rem"}
                    flexGrow={1}
                    sx={{
                        width: '100%',
                        overflowX: 'auto',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default Layout;
