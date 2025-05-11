import React, { useEffect } from 'react';
import { 
    Box, Button, Grid, Modal, Paper, TextField, Typography, 
    Alert, CircularProgress 
} from '@mui/material';
import { Close, CheckCircle } from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import './Modal.css';
import dayjs from 'dayjs';
import { _put } from '../api/client';
import { handleVaccinationErrors } from '../utils/common';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: 24,
    borderRadius: 2,
};

const UpdateVaccineModal = ({ updateData, handleClose, refreshVaccines }) => {
    const [showModal, setShowModal] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [vaccineData, setVaccineData] = React.useState({
        name: "",
        scheduled_date: null,
        available_doses: 0,
        classes: [],
    });
    const [newVaccine, setNewVaccine] = React.useState(null);
    
    // Error states
    const [apiError, setApiError] = React.useState(null);
    const [fieldErrors, setFieldErrors] = React.useState({
        scheduled_date: '',
        available_doses: '',
    });
    
    useEffect(() => {
        const data = updateData.vaccine;
        setVaccineData({
            name: data?.name || "",
            scheduled_date: data?.scheduled_date ? dayjs(data.scheduled_date) : null,
            available_doses: data?.available_doses || 0,
            classes: data?.classes || [],
        });
        setShowModal(true);
        
        // Reset error states when modal opens
        setApiError(null);
        setFieldErrors({
            scheduled_date: '',
            available_doses: '',
        });
        setNewVaccine(null);
    }, [updateData]);
    
    const validateForm = () => {
        const errors = {
            scheduled_date: !vaccineData.scheduled_date ? 'Scheduled date is required' : '',
            available_doses: vaccineData.available_doses === null || vaccineData.available_doses === '' ? 
                'Available doses is required' : 
                isNaN(vaccineData.available_doses) || Number(vaccineData.available_doses) < 0 ? 
                'Available doses must be a positive number' : '',
        };
        
        setFieldErrors(errors);
        
        return Object.values(errors).every(error => error === '');
    };
    
    const handleChange = (key, value) => {
        // Clear field error when user edits the field
        setFieldErrors({
            ...fieldErrors,
            [key]: ''
        });
        
        // Clear API error when form changes
        setApiError(null);
        
        setVaccineData({
            ...vaccineData,
            [key]: value,
        });
    };
    
    const handleSubmit = () => {
        if (!validateForm()) return;
        updateVaccine();
    };
    
    const updateVaccine = async () => {
        setIsSubmitting(true);
        setApiError(null);
        
        try {
            console.log("Updating vaccination drive with data:", vaccineData);
            const response = await _put(`/drive`, {
                drive_name: updateData.vaccine.name,
                "drive_data":{
                "scheduled_date": vaccineData?.scheduled_date ? dayjs(vaccineData.scheduled_date).format() : "",
                "available_doses": Number(vaccineData?.available_doses) || 0,
                "classes" : vaccineData.classes}
            });
            
            if (response.status !== 200) {
                throw new Error("Failed to update vaccination drive");
            }
            
            const resp = response.data;
            if (resp) {
                setNewVaccine(resp);
                refreshVaccines();
            }
        } catch (err) {
            return handleVaccinationErrors(err, fieldErrors, setFieldErrors, setApiError);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            open={showModal}
            onClose={() => {
                if (!isSubmitting) {
                    setShowModal(false);
                    handleClose();
                }
            }}
            className='update-vaccine-modal'
        >
            <Paper className='update-vaccine-modal-box' sx={style}>
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
                        Update Vaccination Drive
                    </Typography>
                    <Typography 
                        variant="body2" 
                        onClick={() => {
                            if (!isSubmitting) {
                                handleClose();
                                setShowModal(false);
                            }
                        }} 
                        style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                    >
                        <Close />
                    </Typography>
                </Box>
                
                <form style={{ padding: 20 }}>
                    {/* API Error Alert */}
                    {apiError && (
                        <Alert 
                            severity="error" 
                            sx={{ mb: 2, whiteSpace: 'pre-line' }}
                            onClose={() => setApiError(null)}
                        >
                            {apiError}
                        </Alert>
                    )}
                    
                    {!newVaccine ? (
                        <Grid container spacing={2} direction={"column"}>
                            <TextField 
                                label="Name" 
                                fullWidth 
                                size='small' 
                                disabled
                                value={vaccineData.name}
                            />
                            
                            <TextField 
                                label="Classes" 
                                fullWidth 
                                size='small'
                                disabled
                                value={vaccineData.classes.sort((a, b) => a - b).join(", ")}    
                            />
                            
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField 
                                        label="Available Doses" 
                                        fullWidth 
                                        size='small' 
                                        type='number'
                                        required
                                        value={vaccineData.available_doses}
                                        onChange={(e) => handleChange("available_doses", e.target.value)}
                                        error={!!fieldErrors.available_doses}
                                        helperText={fieldErrors.available_doses}
                                        disabled={isSubmitting}
                                        InputProps={{ inputProps: { min: 0 } }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker 
                                            label="Scheduled Date"
                                            slotProps={{ 
                                                textField: { 
                                                    size: 'small',
                                                    required: true,
                                                    fullWidth: true,
                                                    error: !!fieldErrors.scheduled_date,
                                                    helperText: fieldErrors.scheduled_date
                                                } 
                                            }}
                                            format='DD-MM-YYYY'
                                            onChange={(newValue) => {
                                                handleChange("scheduled_date", newValue);
                                            }}
                                            value={vaccineData.scheduled_date}
                                            disabled={isSubmitting}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                            </Grid>
                        </Grid>
                    ) : (
                        <Grid container spacing={2} direction={"column"}>
                            <Grid item xs={12}>
                                <Typography variant="h6" sx={{ 
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: 1,
                                    color: "black"
                                }}>
                                    <CheckCircle sx={{ color: 'success.main' }} />
                                    Vaccination Drive Updated Successfully
                                </Typography>
                            </Grid>
                        </Grid>
                    )}
                </form>
                
                <Grid container spacing={2} sx={{padding: "5px 20px 20px 20px"}}>
                    <Grid item xs={newVaccine ? 12 : 6}>
                        <Button 
                            variant='outlined' 
                            color='warning' 
                            fullWidth
                            disabled={isSubmitting}
                            onClick={() => {
                                handleClose();
                                setShowModal(false);
                            }}
                        >
                            {newVaccine ? 'Close' : 'Cancel'}
                        </Button>
                    </Grid>
                    {!newVaccine && (
                        <Grid item xs={6}>
                            <Button 
                                variant='contained' 
                                color='success' 
                                fullWidth 
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                startIcon={isSubmitting && <CircularProgress size={20} color="inherit" />}
                            >
                                {isSubmitting ? 'Updating...' : 'Update'}
                            </Button>
                        </Grid>
                    )}
                </Grid>
            </Paper>
        </Modal>
    );
};

export default UpdateVaccineModal;