import React from 'react';
import Box from '@mui/material/Box';
import { Outlet } from "react-router-dom";
import { GlobalStyle } from '../styles/GlobalStyle';

export const Layout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <GlobalStyle />
      <Box component="main" sx={{ width: 'calc(100vw - 64px)', p: 3, position: 'relative', left: '64px' }}>
        <Outlet />
      </Box>
    </Box>
  );
}
