import React from "react";
import {Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography} from '@mui/material';
import {NotificationsActive as NotificationsActiveIcon, NotificationsOff as NotificationsOffIcon} from '@mui/icons-material';
import { formatDate } from "../utils/common";

const UpcomingVaccinations = ({upcomingDrives=[],onVaccineClick=()=>{}}) => {
    const itemStyle = {
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
        }
    }; 
    const EmptyState = () => (
        <Box 
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 3,
                margin: 2,
                borderRadius: 1,
            }}
        >
            <Avatar 
                sx={{ 
                    backgroundColor: '#e0e0e0',
                    width: 56,
                    height: 56,
                    marginBottom: 2
                }}
            >
                <NotificationsOffIcon sx={{ color: '#9e9e9e', fontSize: 32 }} />
            </Avatar>
            <Typography 
                variant="subtitle1" 
                color="text.secondary"
                fontWeight="medium"
                align="center"
            >
                No upcoming vaccinations
            </Typography>
            <Typography
                variant="body2" 
                color="text.secondary" 
                align="center"
                sx={{ mt: 1 }}
            >
                All scheduled vaccinations will appear here
            </Typography>
        </Box>
    );
    return (
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {console.log(upcomingDrives)}
            {upcomingDrives.length ? upcomingDrives.map((vaccination, index) => (
                <ListItem key={index} onClick={() => onVaccineClick(vaccination)} style = {{ cursor: 'pointer' }} sx = {itemStyle}>
                    <ListItemAvatar>
                        <Avatar sx={{ backgroundColor: '#f0bd3a' }}>
                            <NotificationsActiveIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={vaccination.name} secondary={formatDate(vaccination?.scheduled_date || "")} />
                </ListItem>
            ))        
            : 
            <EmptyState/>
            }
        </List>
    );
}
export default UpcomingVaccinations;
