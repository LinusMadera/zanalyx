import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Paper, Typography, CircularProgress, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
} from 'recharts';
import AIChatPanel from '../components/AIChatPanel';

const ChartCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: `${theme.palette.background.paper}80`,
  backdropFilter: 'blur(5px)',
  minHeight: 400,
  display: 'flex',
  flexDirection: 'column'
}));

const LoadingContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  flex: 1
});

const TimeRangeSelector = styled(ToggleButtonGroup)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  backgroundColor: `${theme.palette.background.paper}80`,
  backdropFilter: 'blur(5px)',
  border: `1px solid ${theme.palette.divider}`,
  '& .MuiToggleButton-root': {
    color: theme.palette.text.primary,
    '&.Mui-selected': {
      backgroundColor: `${theme.palette.primary.main}20`,
      color: theme.palette.primary.main,
    },
  },
}));

interface PriceData {
  date: string;
  value: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const PageAnalytics = () => {
  const [btcData, setBtcData] = useState<any>(null);
  const [ethData, setEthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('5y');
  const [btcAdvancedMetrics, setBtcAdvancedMetrics] = useState<any>(null);
  const [ethAdvancedMetrics, setEthAdvancedMetrics] = useState<any>(null);

  const getTimeRange = () => {
    const now = Date.now();
    switch (timeRange) {
      case '1w':
        return { start: now - 7 * 24 * 60 * 60 * 1000, end: now };
      case '1m':
        return { start: now - 30 * 24 * 60 * 60 * 1000, end: now };
      case '1y':
        return { start: now - 365 * 24 * 60 * 60 * 1000, end: now };
      case '5y':
      default:
        return { start: now - 5 * 365 * 24 * 60 * 60 * 1000, end: now };
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { start, end } = getTimeRange();
        const [
          btcHistorical,
          ethHistorical,
          currentPrices,
          btcAdvanced,
          ethAdvanced
        ] = await Promise.all([
          axios.get(`/api/crypto/historical/bitcoin?start_time=${start}&end_time=${end}`),
          axios.get(`/api/crypto/historical/ethereum?start_time=${start}&end_time=${end}`),
          axios.get('/api/crypto/prices'),
          axios.get(`/api/crypto/advanced-metrics/bitcoin?start_time=${start}&end_time=${end}`),
          axios.get(`/api/crypto/advanced-metrics/ethereum?start_time=${start}&end_time=${end}`)
        ]);

        setBtcData({
          historical: btcHistorical.data,
          current: currentPrices.data.bitcoin,
        });
        setEthData({
          historical: ethHistorical.data,
          current: currentPrices.data.ethereum,
        });
        setBtcAdvancedMetrics(btcAdvanced.data);
        setEthAdvancedMetrics(ethAdvanced.data);
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.detail || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const formatData = (data: [number, number][]) => {
    if (!data) return [];
    return data.map((item) => ({
      date: new Date(item[0]).toLocaleDateString(),
      value: item[1],
    }));
  };

  const handleTimeRangeChange = (event: React.MouseEvent<HTMLElement>, newTimeRange: string | null) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange);
    }
  };

  if (error) {
    return (
      <Box p={4}>
        <Typography color="error" gutterBottom>
          Error: {error}
        </Typography>
        <Typography variant="body2">
          Please try again later or contact support if the problem persists.
        </Typography>
      </Box>
    );
  }

  const btcPriceData = btcData?.historical?.prices ? formatData(btcData.historical.prices) : [];
  const ethPriceData = ethData?.historical?.prices ? formatData(ethData.historical.prices) : [];
  const btcVolumeData = btcData?.historical?.total_volumes ? formatData(btcData.historical.total_volumes) : [];

  const correlationData = btcPriceData.map((item: any, index: number) => ({
    date: item.date,
    btc: item.value,
    eth: ethPriceData[index]?.value || 0,
  }));

  const renderChart = (content: React.ReactNode) => {
    return loading ? (
      <LoadingContainer>
        <CircularProgress />
      </LoadingContainer>
    ) : (
      content
    );
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">
          Crypto Analytics Dashboard
        </Typography>
        <TimeRangeSelector
          value={timeRange}
          exclusive
          onChange={handleTimeRangeChange}
          aria-label="time range"
        >
          <ToggleButton value="1w">1W</ToggleButton>
          <ToggleButton value="1m">1M</ToggleButton>
          <ToggleButton value="1y">1Y</ToggleButton>
          <ToggleButton value="5y">5Y</ToggleButton>
        </TimeRangeSelector>
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 2
        }}
      >
        <ChartCard>
          <Typography variant="h6" gutterBottom>
            Bitcoin Price History
          </Typography>
          {renderChart(
            <Box sx={{ height: 300, flex: 1 }}>
              <ResponsiveContainer>
                <LineChart data={btcPriceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#ff9900" name="BTC Price" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          )}
        </ChartCard>

        <ChartCard>
          <Typography variant="h6" gutterBottom>
            Ethereum Price History
          </Typography>
          {renderChart(
            <Box sx={{ height: 300, flex: 1 }}>
              <ResponsiveContainer>
                <AreaChart data={ethPriceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Area type="monotone" dataKey="value" stroke="#627eea" fill="#627eea" fillOpacity={0.3} name="ETH Price" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          )}
        </ChartCard>

        <ChartCard>
          <Typography variant="h6" gutterBottom>
            Bitcoin Trading Volume
          </Typography>
          {renderChart(
            <Box sx={{ height: 300, flex: 1 }}>
              <ResponsiveContainer>
                <BarChart data={btcVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => formatNumber(value)} />
                  <Tooltip formatter={(value) => formatNumber(Number(value))} />
                  <Legend />
                  <Bar dataKey="value" fill="#ff9900" name="BTC Volume" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          )}
        </ChartCard>

        <ChartCard>
          <Typography variant="h6" gutterBottom>
            BTC vs ETH Price Correlation
          </Typography>
          {renderChart(
            <Box sx={{ height: 300, flex: 1 }}>
              <ResponsiveContainer>
                <LineChart data={correlationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="btc" orientation="left" tickFormatter={(value) => formatCurrency(value)} />
                  <YAxis yAxisId="eth" orientation="right" tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Line yAxisId="btc" type="monotone" dataKey="btc" stroke="#ff9900" name="BTC" dot={false} />
                  <Line yAxisId="eth" type="monotone" dataKey="eth" stroke="#627eea" name="ETH" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          )}
        </ChartCard>

        <ChartCard>
          <Typography variant="h6" gutterBottom>
            BTC Moving Averages
          </Typography>
          {renderChart(
            <Box sx={{ height: 300, flex: 1 }}>
              <ResponsiveContainer>
                <LineChart data={formatData(btcData?.historical?.prices || [])}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#ff9900" name="BTC Price" dot={false} />
                  <Line type="monotone" data={formatData(btcAdvancedMetrics?.ma50 || [])} dataKey="value" stroke="#2196f3" name="50-day MA" dot={false} />
                  <Line type="monotone" data={formatData(btcAdvancedMetrics?.ma200 || [])} dataKey="value" stroke="#f44336" name="200-day MA" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          )}
        </ChartCard>

        <ChartCard>
          <Typography variant="h6" gutterBottom>
            BTC Volatility Index
          </Typography>
          {renderChart(
            <Box sx={{ height: 300, flex: 1 }}>
              <ResponsiveContainer>
                <AreaChart data={formatData(btcAdvancedMetrics?.volatility || [])}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={(value) => `${(value * 100).toFixed(2)}%`} />
                  <Tooltip formatter={(value) => `${(Number(value) * 100).toFixed(2)}%`} />
                  <Legend />
                  <Area type="monotone" dataKey="value" stroke="#ff9900" fill="#ff9900" fillOpacity={0.3} name="Volatility" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          )}
        </ChartCard>

        <ChartCard>
          <Typography variant="h6" gutterBottom>
            BTC/ETH Volume Ratio
          </Typography>
          {renderChart(
            <Box sx={{ height: 300, flex: 1 }}>
              <ResponsiveContainer>
                <LineChart data={btcVolumeData.map((item: any, index: number) => ({
                  date: item.date,
                  ratio: item.value / (ethAdvancedMetrics?.volumes?.[index]?.[1] || 1)
                }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => Number(value).toFixed(2)} />
                  <Legend />
                  <Line type="monotone" dataKey="ratio" stroke="#8884d8" name="BTC/ETH Volume Ratio" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          )}
        </ChartCard>
      </Box>

      <Box sx={{ mt: 3 }}>
        <AIChatPanel />
      </Box>
    </Box>
  );
};

export default PageAnalytics;
