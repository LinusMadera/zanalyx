import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Chip, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import axios from 'axios';

const WhaleAlertContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: `${theme.palette.background.paper}80`,
}));

const GlassButton = styled(ToggleButton)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.3)',
  backdropFilter: 'blur(5px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: theme.shape.borderRadius,
  color: theme.palette.text.primary,
  padding: '8px 16px',
  fontSize: '1rem',
  fontWeight: 'bold',
  '&.Mui-selected': {
    background: 'rgba(0, 0, 0, 0.7)',
    color: theme.palette.common.white,
  },
}));

interface SubTransaction {
  symbol: string;
  unit_price_usd: number;
  transaction_type: string;
  inputs: any[];
  outputs: any[];
}

interface WhaleAlert {
  channel_id: string;
  timestamp: number;
  blockchain: string;
  transaction_type: string;
  from_address: string;
  to_address: string;
  amounts: {
    symbol: string;
    amount: number;
    value_usd: number;
  }[];
  text: string;
  transaction: {
    height: number;
    index_in_block: number;
    timestamp: number;
    hash: string;
    fee?: string;
    fee_symbol?: string;
    fee_symbol_price?: number;
    sub_transactions?: SubTransaction[];
  };
}

const WhaleTracking = () => {
  const [selectedCoin, setSelectedCoin] = useState('ALL');
  const [selectedLimit, setSelectedLimit] = useState(5);
  const [whaleAlerts, setWhaleAlerts] = useState<WhaleAlert[]>([]);
  const [symbols, setSymbols] = useState<string[]>([]);

  useEffect(() => {
    const fetchWhaleAlerts = async () => {
      try {
        const response = await axios.get<WhaleAlert[]>(`/api/whale/alerts?limit=${selectedLimit}`);
        setWhaleAlerts(response.data);
      } catch (error) {
        console.error('Error fetching whale alerts:', error);
      }
    };

    fetchWhaleAlerts();

    const intervalId = setInterval(fetchWhaleAlerts, 2000);

    return () => clearInterval(intervalId);
  }, [selectedLimit]);

  useEffect(() => {
    const uniqueSymbols = new Set<string>();

    whaleAlerts.forEach((alert) => {
      // Get symbols from alert.amounts
      alert.amounts.forEach((amount) => {
        uniqueSymbols.add(amount.symbol);
      });

      // Get symbols from transaction.sub_transactions
      if (alert.transaction && alert.transaction.sub_transactions) {
        alert.transaction.sub_transactions.forEach((subTx) => {
          if (subTx.symbol) {
            uniqueSymbols.add(subTx.symbol);
          }
        });
      }
    });

    setSymbols(Array.from(uniqueSymbols));
  }, [whaleAlerts]);

  const getExplorerUrl = (address: string, blockchain: string) => {
    if (address.startsWith('0x') || address.startsWith('T')) {
      switch (blockchain) {
        case 'tron':
          return `https://tronscan.org/#/address/${address}`;
        case 'ethereum':
          return `https://etherscan.io/address/${address}`;
        default:
          return '#';
      }
    }
    return null;
  };

  const chipColors: { [key: string]: string } = {
    USDT: '#26A17B',
    TRX: '#FF0013',
    ETH: '#627EEA',
  };

  const getChipColor = (symbol: string) => {
    return chipColors[symbol] || 'primary';
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontFamily: 'Lexend Mega, sans-serif' }}>
          Recent Whale Alerts
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ToggleButtonGroup
            value={selectedCoin}
            exclusive
            onChange={(_, newCoin) => setSelectedCoin(newCoin || 'ALL')}
            aria-label="coin selection"
          >
            <GlassButton value="ALL" aria-label="ALL">
              ALL
            </GlassButton>
            {symbols.map((symbol) => (
              <GlassButton key={symbol} value={symbol} aria-label={symbol}>
                {symbol}
              </GlassButton>
            ))}
          </ToggleButtonGroup>
          <ToggleButtonGroup
            value={selectedLimit}
            exclusive
            onChange={(_, newLimit) => setSelectedLimit(Number(newLimit) || 5)}
            aria-label="limit selection"
            sx={{ ml: 2 }}
          >
            {[5, 10, 20].map((limit) => (
              <GlassButton key={limit} value={limit} aria-label={`${limit}`}>
                {limit}
              </GlassButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {whaleAlerts
          .filter((alert) => {
            if (selectedCoin === 'ALL') return true;

            // Check if selectedCoin is in alert.amounts
            const inAmounts = alert.amounts.some((amount) => amount.symbol === selectedCoin);

            // Check if selectedCoin is in transaction.sub_transactions
            const inSubTransactions =
              alert.transaction &&
              alert.transaction.sub_transactions &&
              alert.transaction.sub_transactions.some((subTx) => subTx.symbol === selectedCoin);

            return inAmounts || inSubTransactions;
          })
          .map((alert, index) => {
            const fromAddressUrl = getExplorerUrl(alert.from_address, alert.blockchain);
            const toAddressUrl = getExplorerUrl(alert.to_address, alert.blockchain);

            // Collect amounts from alert.amounts and sub_transactions
            const combinedAmounts: { [key: string]: number } = {};

            alert.amounts.forEach((amount) => {
              if (combinedAmounts[amount.symbol]) {
                combinedAmounts[amount.symbol] += amount.amount;
              } else {
                combinedAmounts[amount.symbol] = amount.amount;
              }
            });

            if (alert.transaction && alert.transaction.sub_transactions) {
              alert.transaction.sub_transactions.forEach((subTx) => {
                if (subTx.symbol && subTx.inputs && subTx.inputs.length > 0) {
                  const amount = parseFloat(subTx.inputs[0].amount);
                  if (!isNaN(amount)) {
                    if (combinedAmounts[subTx.symbol]) {
                      combinedAmounts[subTx.symbol] += amount;
                    } else {
                      combinedAmounts[subTx.symbol] = amount;
                    }
                  }
                }
              });
            }

            return (
              <motion.div
                key={alert.transaction.hash || index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <WhaleAlertContainer>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {Object.entries(combinedAmounts).map(([symbol, amount]) => (
                          <Chip
                            key={symbol}
                            label={`${amount.toLocaleString()} ${symbol}`}
                            sx={{
                              fontWeight: 'bold',
                              color: 'white',
                              backgroundColor: getChipColor(symbol),
                              padding: '8px 12px',
                              fontSize: '1rem',
                            }}
                          />
                        ))}
                        <Typography variant="h6" color="primary">
                          {alert.blockchain.toUpperCase()}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {formatTimestamp(alert.timestamp)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="body1"
                        sx={{ wordBreak: 'break-all', fontSize: '1rem' }}
                      >
                        From:{' '}
                        {fromAddressUrl ? (
                          <a
                            href={fromAddressUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {alert.from_address}
                          </a>
                        ) : (
                          alert.from_address
                        )}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{ wordBreak: 'break-all', fontSize: '1rem' }}
                      >
                        To:{' '}
                        {toAddressUrl ? (
                          <a
                            href={toAddressUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {alert.to_address}
                          </a>
                        ) : (
                          alert.to_address
                        )}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {alert.text}
                      </Typography>
                    </Box>
                  </Box>
                </WhaleAlertContainer>
              </motion.div>
            );
          })}
      </Box>
    </>
  );
};

export default WhaleTracking;
