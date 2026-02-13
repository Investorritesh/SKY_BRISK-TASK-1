import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ShoppingCart,
  Inventory,
  People,
  TrendingUp,
  LocalShipping,
  Receipt,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const data = [
  { name: 'Jan', sales: 4000, purchase: 2400 },
  { name: 'Feb', sales: 3000, purchase: 1398 },
  { name: 'Mar', sales: 2000, purchase: 9800 },
  { name: 'Apr', sales: 2780, purchase: 3908 },
  { name: 'May', sales: 1890, purchase: 4800 },
  { name: 'Jun', sales: 2390, purchase: 3800 },
];

const pieData = [
  { name: 'Electronics', value: 400 },
  { name: 'Hardware', value: 300 },
  { name: 'Office', value: 300 },
  { name: 'Other', value: 200 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const StatCard = ({ title, value, icon, color, trend }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="overline">
            {title}
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {value}
          </Typography>
          {trend && (
            <Typography variant="body2" color={trend > 0 ? 'success.main' : 'error.main'}>
              {trend > 0 ? '+' : ''}{trend}% from last month
            </Typography>
          )}
        </Box>
        <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
          {icon}
        </Avatar>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const theme = useTheme();

  return (
    <Box>
      <Typography
        variant={useMediaQuery(theme.breakpoints.down('sm')) ? "h5" : "h4"}
        fontWeight="bold"
        mb={3}
      >
        ERP Overview
      </Typography>

      <Grid container spacing={useMediaQuery(theme.breakpoints.down('sm')) ? 2 : 3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Sales"
            value="$45,280"
            icon={<ShoppingCart />}
            color={theme.palette.primary.main}
            trend={12}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value="1,240"
            icon={<Inventory />}
            color="#00C49F"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Customers"
            value="842"
            icon={<People />}
            color="#FFBB28"
            trend={5}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Orders"
            value="15"
            icon={<LocalShipping />}
            color="#FF8042"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Sales Chart */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: { xs: 2, sm: 3 }, height: { xs: '300px', sm: '400px' } }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Sales vs Purchase
            </Typography>
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="sales" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
                <Bar dataKey="purchase" fill="#FF8042" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Inventory Chart */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: { xs: 2, sm: 3 }, height: { xs: '350px', sm: '400px' } }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Category Distribution
            </Typography>
            <ResponsiveContainer width="100%" height="70%">
              <PieChart>
                <Pie
                  data={pieData}
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <Box display="flex" justifyContent="center" gap={1.5} flexWrap="wrap" mt={1}>
              {pieData.map((entry, index) => (
                <Box key={entry.name} display="flex" alignItems="center" gap={0.5}>
                  <Box sx={{ width: 10, height: 10, bgcolor: COLORS[index % COLORS.length], borderRadius: '50%' }} />
                  <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>{entry.name}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
