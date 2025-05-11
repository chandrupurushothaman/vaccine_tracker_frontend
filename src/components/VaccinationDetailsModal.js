import React from 'react';
import { Modal, Paper, Typography, Box, Grid, Button } from '@mui/material';
import { Close, EventAvailable, Groups, MedicalServices } from '@mui/icons-material';
import { formatClass } from '../utils/common';

const VaccinationDetailsModal = ({ open, handleClose, vaccination }) => {
  if (!vaccination) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="vaccination-details-modal"
    >
      <Paper sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        maxWidth: '90%',
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 24,
        p: 0,
        outline: 'none',
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          padding: 2, 
          borderRadius: "8px 8px 0px 0px",
          color: 'white', 
          backgroundColor: '#333341', 
          alignItems: 'center' 
        }}>
          <Typography sx={{ fontWeight: 'bold', fontSize: 16 }}>
            Vaccination Drive Details
          </Typography>
          <Typography variant="body2" onClick={handleClose} style={{ cursor: 'pointer' }}>
            <Close />
          </Typography>
        </Box>
        
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color:"black" }}>
            {vaccination.name}
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={1}>
              <EventAvailable color="primary" />
            </Grid>
            <Grid item xs={11}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Scheduled Date</Typography>
              <Typography variant="body2">{formatDate(vaccination.scheduled_date)}</Typography>
            </Grid>
          </Grid>
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={1}>
              <MedicalServices color="primary" />
            </Grid>
            <Grid item xs={11}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Available Doses</Typography>
              <Typography variant="body2">{vaccination.available_doses || 'Not specified'}</Typography>
            </Grid>
          </Grid>
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={1}>
              <Groups color="primary" />
            </Grid>
            <Grid item xs={11}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Target Classes</Typography>
              <Typography variant="body2">{vaccination.classes ? formatClass(vaccination.classes) : 'All Classes'}</Typography>
            </Grid>
          </Grid>
          
          {vaccination.vaccine && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              {vaccination.vaccine}
            </Typography>
          )}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
          <Button onClick={handleClose} variant="outlined" color="primary">Close</Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default VaccinationDetailsModal;