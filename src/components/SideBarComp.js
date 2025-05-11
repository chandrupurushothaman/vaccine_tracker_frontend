import React, { useEffect } from 'react';
import './SideBarComp.css';
import { Toolbar, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Box, Drawer } from '@mui/material';

import {Dashboard as DashboardIcon, People as PeopleIcon, Vaccines as VaccinesIcon, Assessment as AssessmentIcon } from '@mui/icons-material';

const DrawerBody = ({activeLink='', onLinkClick=()=>{}, ...props}) => {
    return (<div>
        <Toolbar sx={{ display: 'flex', justifyContent: 'center', padding: '16px 0' }} onClick={() => onLinkClick('/dashboard')}>
        <h2 className='logo' style={{ cursor: 'pointer' }}>VACCINE TRACKER</h2>
        </Toolbar>
        <List sx={{ padding: "20px 0px" }}>
          {[{
              name: 'Dashboard',
              path: '/dashboard',
              icon: <DashboardIcon/>
          }, {
              name: 'Manage Students',
              path: '/students',
              icon: <PeopleIcon/>
          }, {
              name: 'Manage Vaccines',
              path: '/vaccines',
              icon: <VaccinesIcon/>
          }, {
              name: 'Reports',
              path: '/reports',
              icon: <AssessmentIcon/>
          }].map((page, index) => (
            <ListItem key={page.name+index} sx={{ padding: "2px 0px" }} onClick={() => onLinkClick(page.path)}>
              <ListItemButton className={`list-item ${activeLink === page.path ? 'active' : ''}`}>
                <ListItemIcon className={`list-icon ${activeLink === page.path ? 'active' : ''}`}>
                  {page.icon ? page.icon : <></>}
                </ListItemIcon>
                <ListItemText  className={`list-label ${window.location.pathname === page.path ? 'active' : ''}`} primary={page.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>)
};

const SideBarComp = () => {
    const [activeLink, setActiveLink] = React.useState(window.location.pathname);

    const drawerWidth = 240;
    useEffect(() => {
        setActiveLink(window.location.pathname);
    }, []);
    const onLinkClick = (path) => {
        setActiveLink(path);
        window.location.pathname = path;
    };
    return (
        <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            aria-label="mailbox folders"
        >
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: '#000000' },
                }}
                open
            >
                <DrawerBody activeLink={activeLink} onLinkClick={onLinkClick}/>
            </Drawer>
        </Box>
    );
}

export default SideBarComp;