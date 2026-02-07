import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    CircularProgress,
} from '@mui/material';
import {
    getSalesReport,
    getInventoryReport,
    getProfitReport,
} from '../redux/slices/reportSlice';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

const Reports = () => {
    const dispatch = useDispatch();
    const { salesReport, inventoryReport, profitReport, isLoading } = useSelector((state) => state.reports);

    useEffect(() => {
        dispatch(getSalesReport());
        dispatch(getInventoryReport());
        dispatch(getProfitReport());
    }, [dispatch]);

    if (isLoading && !salesReport.length) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 1 }}>
            <Typography variant="h4" fontWeight="bold" mb={4} sx={{ color: '#1a237e' }}>
                Business Reports
            </Typography>

            <Grid container spacing={4}>
                {/* Sales Over Time Chart */}
                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 3, borderRadius: 3, minHeight: 450, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <Typography variant="h6" fontWeight="bold" mb={3} sx={{ color: '#37474f' }}>
                            Sales Over Time (Last 30 Days)
                        </Typography>
                        <Box sx={{ width: '100%', height: 350 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={salesReport}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                                    <XAxis
                                        dataKey="_id"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9e9e9e', fontSize: 12 }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#9e9e9e', fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar
                                        dataKey="totalSales"
                                        fill="#bbdefb"
                                        radius={[4, 4, 0, 0]}
                                        barSize={30}
                                        name="Revenue"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>

                {/* Overall Profitability */}
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 4, borderRadius: 3, minHeight: 450, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <Typography variant="h6" fontWeight="bold" mb={4} sx={{ color: '#37474f' }}>
                            Overall Profitability
                        </Typography>

                        <Box mb={4}>
                            <Typography variant="body2" sx={{ color: '#9e9e9e', textTransform: 'uppercase', letterSpacing: 1, mb: 1 }}>
                                Total Revenue
                            </Typography>
                            <Typography variant="h3" fontWeight="bold" sx={{ color: '#1976d2' }}>
                                ${profitReport.totalRevenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Typography>
                        </Box>

                        <Box mb={4}>
                            <Typography variant="body2" sx={{ color: '#9e9e9e', textTransform: 'uppercase', letterSpacing: 1, mb: 1 }}>
                                Total Cost
                            </Typography>
                            <Typography variant="h3" fontWeight="bold" sx={{ color: '#d32f2f' }}>
                                ${profitReport.totalCost?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Typography>
                        </Box>

                        <Box sx={{
                            mt: 'auto',
                            bgcolor: '#4caf50',
                            color: 'white',
                            p: 3,
                            borderRadius: 4,
                            width: '100%',
                            boxShadow: '0 8px 16px rgba(76, 175, 80, 0.3)'
                        }}>
                            <Typography variant="body1" sx={{ opacity: 0.9, mb: 1 }}>
                                Net Profit
                            </Typography>
                            <Typography variant="h3" fontWeight="bold">
                                ${profitReport.profit?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* Inventory Table */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, borderRadius: 3, minHeight: 450, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                        <Typography variant="h6" fontWeight="bold" mb={3} sx={{ color: '#37474f' }}>
                            Inventory Stock Report & Alerts
                        </Typography>
                        <TableContainer sx={{ maxHeight: 350 }}>
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ color: '#9e9e9e', fontWeight: 'bold', borderBottom: '1px solid #f5f5f5' }}>Product Name</TableCell>
                                        <TableCell sx={{ color: '#9e9e9e', fontWeight: 'bold', borderBottom: '1px solid #f5f5f5' }}>SKU</TableCell>
                                        <TableCell sx={{ color: '#9e9e9e', fontWeight: 'bold', borderBottom: '1px solid #f5f5f5' }}>Category</TableCell>
                                        <TableCell align="right" sx={{ color: '#9e9e9e', fontWeight: 'bold', borderBottom: '1px solid #f5f5f5' }}>Stocks</TableCell>
                                        <TableCell align="right" sx={{ color: '#9e9e9e', fontWeight: 'bold', borderBottom: '1px solid #f5f5f5' }}>Reorder Level</TableCell>
                                        <TableCell sx={{ color: '#9e9e9e', fontWeight: 'bold', borderBottom: '1px solid #f5f5f5' }}>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {inventoryReport.map((row) => (
                                        <TableRow key={row._id} hover>
                                            <TableCell sx={{ borderBottom: '1px solid #f5f5f5' }}>{row.title}</TableCell>
                                            <TableCell sx={{ borderBottom: '1px solid #f5f5f5' }}>{row.sku}</TableCell>
                                            <TableCell sx={{ borderBottom: '1px solid #f5f5f5' }}>{row.category}</TableCell>
                                            <TableCell align="right" sx={{ borderBottom: '1px solid #f5f5f5' }}>{row.stock}</TableCell>
                                            <TableCell align="right" sx={{ borderBottom: '1px solid #f5f5f5' }}>{row.reorderLevel}</TableCell>
                                            <TableCell sx={{ borderBottom: '1px solid #f5f5f5' }}>
                                                {row.stock <= row.reorderLevel ? (
                                                    <Chip label="Low Stock" color="error" size="small" sx={{ borderRadius: 1.5, fontWeight: 'bold' }} />
                                                ) : (
                                                    <Chip label="Healthy" color="success" size="small" sx={{ borderRadius: 1.5, fontWeight: 'bold', opacity: 0.8 }} />
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Reports;
