import React from 'react';
import {Alert, Box, Button, Grid, Modal, Paper, TextField, Typography} from '@mui/material';
import { Close,CheckCircle } from '@mui/icons-material';
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import './Modal.css';
import dayjs from 'dayjs';
import { _post } from '../api/client';
import { handleStudentErrors } from '../utils/common';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // width: 400,
    boxShadow: 24,
    borderRadius: 2,
};

const AddStudentModal = ({ open, handleClose, refreshStudents }) => {
    const [showModal, setShowModal] = React.useState(open);
    const [studentData, setStudentData] = React.useState({
        name: "",
        class: null,
        age: null,
        gender: "",
        roll_number: null,
    });
    const [newStudent, setNewStudent] = React.useState(null);
    const [apiError, setApiError] = React.useState(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [fieldErrors, setFieldErrors] = React.useState({
        name: '',
        class: '',
        age: '',
        gender: '',
        roll_number: '',
    });
    const validateForm = () => {
        const errors = {
            name: !studentData.name ? 'Name is required' : '',
            class: !studentData.class ? 'Class is required' : 
                   (studentData.class < 1 || studentData.class > 12) ? 
                   'Class must be between 1 and 12' : '',
            age: !studentData.age ? 'Age is required' : 
                 (studentData.age < 3 || studentData.age > 18) ? 
                 'Age must be between 3 and 18' : '',
            gender: !studentData.gender ? 'Gender is required' : '',
            roll_number: !studentData.roll_number ? 'roll_number is required' : '',
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
        setStudentData({
            ...studentData,
            [key]: value,
        });
    }
    const handleSubmit = () => {
        console.log("handleSubmit", studentData);
        createStudent();
    }
    const createStudent = async () => {
        console.log("createStudent", studentData);
        await _post("/students", {
            "name": studentData?.name || "",
            "age": studentData?.age || "",
            "class": studentData?.class || "",
            "gender": studentData?.gender || "",
            "roll_number": studentData?.roll_number || "",
            "vaccines": [],
            "vaccinated": false
        }, {})
        .then((res) => {
            console.log(res);
            const resp = res.data;
            if (resp.student_id) {
                setNewStudent(resp);
                refreshStudents();
            }
        })
        .catch((err) => {
            console.log(err);
            handleStudentErrors(err, fieldErrors, setFieldErrors, setApiError);
        });
    }
    return (
        <Modal
            open={showModal}
            onClose={() => {
                setShowModal(false);
                handleClose();
            }}
            className='add-student-modal'
        >
            <Paper className='add-student-modal-box' sx={style}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 2, borderRadius: "8px 8px 0px 0px",
                    color: 'white', backgroundColor: '#333341', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: 16 }}>
                        Add Student
                    </Typography>
                    <Typography variant="body2" onClick={() => {
                        if (!isSubmitting) {
                                handleClose();
                                setShowModal(false);
                            }
                    }} style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                        <Close />
                    </Typography>

                </Box>
                <form style={{ padding: 20 }}>
                {apiError && (
                        <Alert 
                            severity="error" 
                            sx={{ mb: 2, whiteSpace: 'pre-line' }}
                            onClose={() => setApiError(null)}
                        >
                            {apiError}
                        </Alert>
                    )}
                    {!newStudent ? <Grid container spacing={2} direction={"column"}>
                        <TextField label="Name" fullWidth size='small' 
                            value={studentData.name} 
                            required
                            onChange={(e) => handleChange("name", e.target.value)}
                            error={!!fieldErrors.name}
                                helperText={fieldErrors.name}
                                disabled={isSubmitting} />
                        <Grid container spacing={2}>
                            <Grid size="grow">
                                <TextField fullWidth label="Class" size='small' type='number'
                                    value={studentData.class} 
                                    onChange={(e) => handleChange("class", e.target.value)}
                                    required
                                    error={!!fieldErrors.class}
                                        helperText={fieldErrors.class}
                                        disabled={isSubmitting}
                                        InputProps={{ inputProps: { min: 1, max: 12 } }}
                                    />
                            </Grid>
                            <Grid>
                                <TextField
                                    select
                                    size="small"
                                    slotProps={{
                                        select: {
                                            native: true,
                                        },
                                    }}
                                    value={studentData.gender}
                                    onChange={(e) => handleChange("gender", e.target.value)}
                                    error={!!fieldErrors.gender}
                                    helperText={fieldErrors.gender}
                                    disabled={isSubmitting}
                                    required
                                >
                                    <option value="" disabled>--Select Gender--</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </TextField>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid>
                                <TextField label="Age" fullWidth size='small' type='number'
                                    value={studentData.age}
                                    onChange={(e) => handleChange("age", e.target.value)}
                                    error={!!fieldErrors.age}
                                    helperText={fieldErrors.age}
                                    disabled={isSubmitting}
                                    InputProps={{ inputProps: { min: 3, max: 18 } }}
                                    required
                                    />
                            </Grid>
                            <Grid>
                                <TextField label="Roll Number" fullWidth size='small' type='number'
                                    value={studentData.roll_number}
                                    onChange={(e) => handleChange("roll_number", e.target.value)}
                                    error={!!fieldErrors.roll_number}
                                    helperText={fieldErrors.roll_number}
                                    disabled={isSubmitting}
                                    InputProps={{ inputProps: { min: 3, max: 18 } }}
                                    required
                                    />
                            </Grid>
                        </Grid>
                    </Grid>
                    :
                    <Grid container spacing={2} direction={"column"}>
                        <Grid item xs={12}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold',textAlign: 'center',display: 'flex',alignItems: 'center', color: '#3c8f46',justifyContent: 'center',gap: 1}}>
                            <CheckCircle sx={{ color: 'success.main' }} />
                                Student Created Successfully
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="body1" sx={{ textAlign: 'center' }}>
                                Student ID: {newStudent?.student_id}
                            </Typography>
                        </Grid>
                    </Grid>
                    }
                </form>
                <Grid container spacing={2} sx={{padding: "5px 20px 20px 20px"}}>
                    <Grid size={newStudent ? 12 : 6}>
                        <Button variant='outlined' color='warning' fullWidth
                            onClick={() => {
                                handleClose();
                                setShowModal(false);
                            }}
                        >{newStudent ? 'Close' : 'Cancel'}</Button>
                    </Grid>
                    {!newStudent && <Grid size={6}>
                        <Button variant='contained' color='success' fullWidth onClick={handleSubmit}>Submit</Button>
                    </Grid>}
                </Grid>
            </Paper>
        </Modal>
    );
}
export default AddStudentModal;