import React from "react";
import { Button, Grid, Paper, TextField } from "@mui/material";
import { setLocalStorage } from "../utils/local.js";

const LoginPage = () => {
    const handleLogin = (event) => {
        event.preventDefault(); 
        const token = "sampleToken"; 
        setLocalStorage("token", token);
        window.location.pathname = "/dashboard"; 
    };

    return (
        <div className="login-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f0f0' }}>
            <Grid container spacing={2} justifyContent="center">
                <Grid item>
                    <Paper elevation={3} style={{ padding: 20 }}>
                        <h2 style={{ textAlign: "center", color: "black" }}>VACCINE TRACKER</h2>
                        <form onSubmit={handleLogin}>
                            <TextField label="Username" fullWidth margin="normal" required />
                            <TextField label="Password" type="password" fullWidth margin="normal" required />
                            <Button variant="contained" color="primary" fullWidth type="submit">
                                Login
                            </Button>
                        </form>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
};

export default LoginPage;
