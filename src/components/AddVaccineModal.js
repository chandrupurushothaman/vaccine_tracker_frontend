import React from 'react';
import { 
    Box, Button, Grid, Modal, Paper, TextField, Typography, 
    MenuItem, FormControl, InputLabel, Select, ListItemText, 
    Checkbox, Alert, FormHelperText 
} from '@mui/material';
import { Close, CheckCircle } from '@mui/icons-material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import './Modal.css';
import dayjs from 'dayjs';
import { _post } from '../api/client';
import { handleVaccinationErrors } from '../utils/common';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    boxShadow: 24,
    borderRadius: 2,
};
const classes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const AddVaccineModal = ({ open, handleClose, refreshVaccines }) => {
    const [classesDropdownOpen, setClassesDropdownOpen] = React.useState(false);
    const [showModal, setShowModal] = React.useState(open);
    const [vaccineData, setVaccineData] = React.useState({
        name: "",
        scheduled_date: null,
        available_doses: null,
        classes: [],
    });
    const [newVaccine, setNewVaccine] = React.useState(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    
    const [apiError, setApiError] = React.useState(null);
    const [fieldErrors, setFieldErrors] = React.useState({
        name: '',
        scheduled_date: '',
        available_doses: '',
        classes: '',
    });
    
    const validateForm = () => {
        const errors = {
            name: !vaccineData.name ? 'Name is required' : '',
            scheduled_date: !vaccineData.scheduled_date ? 'Scheduled date is required' : '',
            available_doses: !vaccineData.available_doses ? 'Available doses is required' : '',
        };
        
        setFieldErrors(errors);
        
        return Object.values(errors).every(error => error === '');
    };

    const handleChange = (key, value) => {
        setFieldErrors({
            ...fieldErrors,
            [key]: ''
        });
        
        setApiError(null);
        
        if (key === "classes") {
            setVaccineData({
                ...vaccineData,
                classes: [...new Set(value)],
            });
            return;
        }
        
        setVaccineData({
            ...vaccineData,
            [key]: value,
        });
    };
    
    const handleSubmit = () => {
        if (!validateForm()) return;
        createVaccine();
    };
    
    const createVaccine = async () => {
        setIsSubmitting(true);
        setApiError(null);
        
        try {
            const response = await _post("/drive", {
                "name": vaccineData?.name || "",
                "vaccine": vaccineData?.vaccine || "",
                "scheduled_date": vaccineData?.scheduled_date ? dayjs(vaccineData.scheduled_date).format() : "",
                "available_doses": vaccineData?.available_doses || 0,
                "classes": vaccineData?.classes || [],
            });
            
            if (response.status !== 200) {
                throw new Error("Failed to create vaccination drive");
            }
            console.log(response.data.status_code)
            if (response.data.status_code === 400) {
                console.log("400")
                throw new Error(response.data.detail);
            }
            
            const resp = response.data;
            console.log(resp)
            if (resp) {
                setNewVaccine(true);
                console.log(newVaccine)
                refreshVaccines();
            }
        } catch (err) {   
            console.log("err", err)         
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
            className='add-vaccine-modal'
        >
            <Paper className='add-vaccine-modal-box' sx={style}>
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
                        Add Vaccination Drive
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
                    {apiError && (
                        <Alert 
                            severity="error" 
                            sx={{ mb: 2 , whiteSpace: 'pre-line'}}
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
                                required
                                value={vaccineData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                error={!!fieldErrors.name}
                                helperText={fieldErrors.name}
                                disabled={isSubmitting}
                            />
                            <TextField 
                                label="Vaccine name" 
                                fullWidth 
                                size='small'
                                required
                                value={vaccineData.vaccine}
                                onChange={(e) => handleChange("vaccine", e.target.value)}
                                error={!!fieldErrors.name}
                                helperText={fieldErrors.name}
                                disabled={isSubmitting}
                            />
                            
                            <Grid container spacing={2}>
                                <Grid item xs={12} sx={{ width: '100%' }}>
                                    <FormControl 
                                        fullWidth 
                                        size="small" 
                                        error={!!fieldErrors.classes}
                                        disabled={isSubmitting}
                                    >
                                        <InputLabel id="classes-select-label">Select Classes</InputLabel>
                                        <Select
                                            labelId="classes-select-label"
                                            id="classes-select"
                                            multiple
                                            open={classesDropdownOpen}
                                            onOpen={() => setClassesDropdownOpen(true)}
                                            onClose={() => setClassesDropdownOpen(false)}
                                            value={vaccineData.classes}
                                            onChange={(e) => handleChange('classes', e.target.value)}
                                            renderValue={(selected) => selected.sort((a, b) => a - b).join(', ')}
                                        >
                                            {classes.map((classItem) => (
                                                <MenuItem key={classItem} value={classItem}>
                                                    <Checkbox checked={vaccineData.classes.includes(classItem)} />
                                                    <ListItemText primary={`Class ${classItem}`} />
                                                </MenuItem>
                                            ))}
                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setClassesDropdownOpen(false);
                                                    }}
                                                >
                                                    OK
                                                </Button>
                                            </Box>
                                        </Select>
                                        {fieldErrors.classes && (
                                            <FormHelperText error>{fieldErrors.classes}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
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
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DatePicker 
                                            label="Scheduled Date" 
                                            slotProps={{ 
                                                textField: { 
                                                    size: 'small',
                                                    required: true,
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
                                    color: "black",
                                    gap: 1 
                                }}>
                                    <CheckCircle sx={{ color: 'success.main' }} />
                                    Vaccination Drive Created Successfully
                                </Typography>
                            </Grid>
                        </Grid>
                    )}
                </form>
                
                <Grid container spacing={2} sx={{ padding: "5px 20px 20px 20px" }}>
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
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </Button>
                        </Grid>
                    )}
                </Grid>
            </Paper>
        </Modal>
    );
};

export default AddVaccineModal;