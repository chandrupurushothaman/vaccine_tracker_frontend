import React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';


const PageLoader = ({...props}) => {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        const handleLoadingEvent = (event) => {
            if (event.detail.isLoading) {
                setOpen(true);
            } else {
                setOpen(false);
            }
        };

        window.addEventListener('loadingStatus', handleLoadingEvent);

        return () => {
            window.removeEventListener('loadingStatus', handleLoadingEvent);
        };
    }, []);

    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };
    return (
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 2000 })}
            open={open}
            onClick={handleClose}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    );
}

export default PageLoader;