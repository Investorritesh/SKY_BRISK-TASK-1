import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TablePagination,
    Box,
    Typography,
    IconButton,
    Tooltip,
} from '@mui/material';
import { Edit, Delete, Visibility } from '@mui/icons-material';

const DataTable = ({
    title,
    columns,
    rows,
    page,
    rowsPerPage,
    total,
    onPageChange,
    onRowsPerPageChange,
    onEdit,
    onDelete,
    onView,
    isLoading,
}) => {
    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', mb: 2 }}>
            <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight="bold">
                    {title}
                </Typography>
            </Box>
            <TableContainer sx={{ maxHeight: 440, overflowX: 'auto' }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth, fontWeight: 'bold' }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                            <TableCell align="right" style={{ fontWeight: 'bold' }}>
                                Actions
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row._id}>
                                    {columns.map((column) => {
                                        const value = row[column.id];
                                        return (
                                            <TableCell key={column.id} align={column.align}>
                                                {column.format ? column.format(value, row) : value}
                                            </TableCell>
                                        );
                                    })}
                                    <TableCell align="right">
                                        <Box display="flex" justifyContent="flex-end">
                                            {onView && (
                                                <Tooltip title="View">
                                                    <IconButton size="small" onClick={() => onView(row)} color="info">
                                                        <Visibility fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            {onEdit && (
                                                <Tooltip title="Edit">
                                                    <IconButton size="small" onClick={() => onEdit(row)} color="primary">
                                                        <Edit fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            {onDelete && (
                                                <Tooltip title="Delete">
                                                    <IconButton size="small" onClick={() => onDelete(row)} color="error">
                                                        <Delete fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={total || 0}
                rowsPerPage={rowsPerPage || 10}
                page={page || 0}
                onPageChange={onPageChange}
                onRowsPerPageChange={onRowsPerPageChange}
            />
        </Paper>
    );
};

export default DataTable;
