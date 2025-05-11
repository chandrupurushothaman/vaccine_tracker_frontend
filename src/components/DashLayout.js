import React from 'react';
import { Outlet } from 'react-router';
import Header from './header';
import { Box } from '@mui/material';
import SideBar from './SideBarComp';

const DashLayout = ({ children }) => {
  const drawerWidth = 240;
  return (
    <Box sx={{ display: 'flex' }}>
       <SideBar />
       <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, padding: 0, backgroundColor: '#f5f5f5', minHeight: '100vh' }}
        >
          <Header/>
          <div style={{ padding: '20px'}}>
            <Outlet />
          </div>
        </Box>
    </Box>
  );
}
export default DashLayout;

