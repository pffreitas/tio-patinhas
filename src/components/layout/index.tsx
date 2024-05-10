import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import { Outlet } from "react-router-dom";
import { GlobalStyle } from '../styles/GlobalStyle';
import { BottomNavigation, BottomNavigationAction, Paper, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import TransactionsIcon from '@mui/icons-material/FormatListBulleted';
import PlanIcon from '@mui/icons-material/BorderColor';
import { useNavigate } from 'react-router-dom';
import { pasteTransactions } from '../../features/transactions/transactions.slice';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const { parsedTransactions } = useSelector((state: RootState) => state.transactions);
  const [value, setValue] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);

  const routes = [
    { pathname: '/', label: 'Home', icon: <HomeIcon /> },
    { pathname: '/plan', label: 'Plan', icon: <PlanIcon /> },
    { pathname: '/transactions', label: 'Transactions', icon: <TransactionsIcon /> }
  ];

  React.useEffect(() => {
    (ref.current as HTMLDivElement).ownerDocument.body.scrollTop = 0;
  }, [value]);

  useEffect(() => {
    if (parsedTransactions !== undefined && parsedTransactions.length > 0) {
      navigate('/transactions');
    }
  }, [parsedTransactions]);

  const handlePaste = async (event: React.ClipboardEvent) => {
    const text = event.clipboardData.getData('Text');
    dispatch(pasteTransactions({ data: text }));
  };


  return (
    <Box sx={{ pb: 7 }} ref={ref} onPaste={handlePaste}>
      <GlobalStyle />
      <Paper sx={{ position: 'fixed', top: 0, left: 0, right: 0, height: 60, zIndex: 99999 }} elevation={2}>
        <Typography variant="h6" sx={{ p: 2 }}>Bucket Bucks</Typography>
      </Paper>
      <Box sx={{ mt: '60px' }} padding={2}>
        <Outlet />
      </Box>
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 99999 }} elevation={3}>
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            navigate(routes[newValue].pathname);
          }}
        >
          {routes.map((route, index) => (
            <BottomNavigationAction key={index} label={route.label} icon={route.icon} />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>


  );
}
