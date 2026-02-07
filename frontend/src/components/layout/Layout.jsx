import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = () => {
    const theme = useTheme();
    const isNonMobile = useMediaQuery('(min-width: 600px)');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <Box display={isNonMobile ? 'flex' : 'block'} width="100%" height="100%">
            <Sidebar
                isNonMobile={isNonMobile}
                drawerWidth="250px"
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />
            <Box flexGrow={1}>
                <Topbar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                />
                <Box p="1.5rem" sx={{ minHeight: 'calc(100vh - 64px)', bgcolor: '#f4f6f8' }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default Layout;
