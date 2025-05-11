import React from 'react';
import { AppBar, Box, Button, Toolbar} from '@mui/material';
import './header.css';

const header = () => {
    const pages = [{
        name: "Dashboard",
        path: "/dashboard"
    },{
        name: "Manage Students",
        path: "/students"
    },{
        name: "Manage Vaccines",
        path: "/vaccines"
    },{
        name: "Reports",
        path: "/reports"
    }];

    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };
    return (
        <AppBar position="sticky">
            <Toolbar>
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
                <div className="page-title-container">
                    <Button
                        className="header-title"
                        sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                        {pages.find((page) => page.path === window.location.pathname)?.name || "Dashboard"}
                    </Button>
                    </div>
                </Box>
                <Button color="inherit" sx={{ justifySelf: 'flex-end'}} onClick={handleLogout}>Logout</Button>
            </Toolbar>
        </AppBar>
    );
}
export default header;