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
    // useEffect(() => {
        
    // }, []);
    const handleLogout = () => {
        // Clear the token from local storage
        localStorage.removeItem("token");
        // Redirect to login page
        window.location.reload();
    };
    return (
        <AppBar position="sticky">
            <Toolbar>
                {/* <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    VAX-TRACK
                </Typography> */}
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
                <div className="page-title-container">
                    <Button
                        className="header-title"
                        sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                        {pages.find((page) => page.path === window.location.pathname)?.name || "Dashboard"}
                    </Button>
                    </div>
                    {/* {pages.map((page) => (
                    <Button
                        key={page}
                        sx={{ my: 2, color: 'white', display: 'block' }}
                    >
                        {page}
                    </Button>
                    ))} */}
                </Box>
                <Button color="inherit" sx={{ justifySelf: 'flex-end'}} onClick={handleLogout}>Logout</Button>
            </Toolbar>
        </AppBar>
    );
}
export default header;