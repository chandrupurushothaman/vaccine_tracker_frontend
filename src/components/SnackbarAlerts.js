import React from 'react';
import { Alert, Snackbar } from '@mui/material';

const SnackbarAlerts = () => {
    const [state, setState] = React.useState({
        open: false,
        vertical: 'top',
        horizontal: 'right',
        alertData: {}
    });
    const { vertical, horizontal, open, alertData } = state;
    const handleClose = () => {
        setState({ ...state, open: false });
    };
    React.useEffect(() => {
        const handleShowAlert = (event) => {
            if (event.detail.alertData?.open) {
                setState({ ...state, open: true, alertData: event.detail?.alertData || {} });
            } else {
                setState({ ...state, open: false, alertData: {} });
            }
        }
        window.addEventListener("showAlert", handleShowAlert)

        return () => {
            window.removeEventListener("showAlert", handleShowAlert)
        }
    }, [])
    return (
        <Snackbar 
            autoHideDuration={6000}
            anchorOrigin={{ vertical, horizontal }}
            open={open}
            onClose={handleClose}
            key={vertical + horizontal}
        >
             <Alert
                onClose={handleClose}
                severity={alertData?.severity || "info"}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {alertData?.message || "No message found!"}
            </Alert>
        </Snackbar>
    )
}

export default SnackbarAlerts;