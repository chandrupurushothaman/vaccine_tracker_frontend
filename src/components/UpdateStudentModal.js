import React, { useEffect } from 'react';
import {Alert, Box, Button, Grid, Modal, Paper, TextField, Typography} from '@mui/material';
import { Close,CheckCircle } from '@mui/icons-material';
import './Modal.css';
import { _get, _post } from '../api/client';
import dayjs from 'dayjs';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // width: 400,
    boxShadow: 24,
    borderRadius: 2,
};

const UpdateStudentModal = ({ updateData, handleClose, refreshStudents }) => {
    console.log(updateData)
    const [showModal, setShowModal] = React.useState(false);
    const [vaccinations, setVaccinations] = React.useState([])
    const [updateReq, setUpdateReq] = React.useState({vaccination: ""});
    const [updatedStudent, setUpdatedStudent] = React.useState(null);
    const [apiError, setApiError] = React.useState(null);
    const [fieldErrors, setFieldErrors] = React.useState({
        vaccination: '',
    });
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    useEffect(() => {
        if (updateData) {
            getModalDatas(updateData);
        }
    }, [updateData])

    const getModalDatas = async () => {
        await getVaccinedata();
        setShowModal(true);
    }
    const getVaccinedata = async () => {
        await _get(`/drive/drive_names`, {})
        .then((res) => {
            if (res.status !== 200) {
                throw new Error("Failed to fetch data");
            }
            const resp = res.data;
            if (resp) {
                setVaccinations(resp);
            }
        })
        .catch((err) => {
            console.log(err);
            setApiError("Failed to load available vaccinations. Please try again.");
        })
        .finally(() => {
            setIsSubmitting(false);
        }
        );
    }
    const handleChange = (key, value) => {
        setFieldErrors({
            ...fieldErrors,
            [key]: ''
        });
        setApiError(null);
        setUpdateReq({
            [key]: value,
        });
    }
    const validateForm = () => {
        const errors = {
            vaccination: !updateReq.vaccination ? 'Please select a vaccination' : '',
        };
        
        setFieldErrors(errors);
        
        // Return true if no errors
        return Object.values(errors).every(error => error === '');
    }
    const handleSubmit = () => {
        if (!validateForm()) return;
        updateStudent();
    }
    const updateStudent = async () => {
        // console.log("updateStudent", updateReq);
        if (!updateReq.vaccination) {
            setFieldErrors({
                vaccination: 'Please select a vaccination'
            });
            return;
        }
        
        setIsSubmitting(true);
        setApiError(null);
        const data = JSON.parse(updateReq.vaccination);
        await _post(`/vaccination/mark_vaccinated`, {
            "drive": data.name,
            "student_id": updateData.studentId
          }, {})
        .then((res) => {
            console.log(res);
            if (res.status !== 200) {
                throw new Error("Failed to fetch data");
            }
            if (res.data.status_code === 400) {
                throw new Error(res.data.detail);
            }
            const resp = res.data;
            console.log(resp)
            if (res.status === 200 && resp) {
                setUpdatedStudent(resp.message);
                refreshStudents();
            }
        })
        .catch((err) => {
            console.log(err);
            if (err) {
  
                const errorData = err?.response?.data?.message || err?.message || String(err);
                setUpdateReq({ vaccination: "" });
                if (errorData && errorData.includes("Vaccination update failed")) {
                    setFieldErrors({
                        vaccination: 'This vaccination has already been recorded for this student'
                    });
                    setApiError("Duplicate vaccination: This student has already received this vaccination.");
                }
                else if (errorData.error && errorData.error.includes("No Student with id")) {
                    setApiError("Student not found. Please refresh and try again.");
                }
                else if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
                    const formattedErrors = errorData.errors.join('\n');
                    setApiError(formattedErrors);
                }
                else {
                    setApiError(errorData.error || "Failed to update vaccination status. Please try again.");
                }
            } else {
                setApiError("An error occurred while updating vaccination status. Please try again.");
            }
        });
    }
    return (
        <Modal
            open={showModal}
            onClose={() => {
                if (!isSubmitting) {
                    setShowModal(false);
                    handleClose();
                }
            }}
            className='update-student-modal'
        >
            <Paper className='update-student-modal-box' sx={style}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 2, borderRadius: "8px 8px 0px 0px",
                    color: 'white', backgroundColor: '#333341', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: 16 }}>
                        Update Student Vaccination Details
                    </Typography>
                    <Typography variant="body2" onClick={() => {
                        if (!isSubmitting) {
                                handleClose();
                                setShowModal(false);
                            }
                    }}  style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
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
                    {!updatedStudent ? <Grid container spacing={2} size={12}>
                                <Grid size={12}>
                                    <TextField fullWidth
                                        select
                                        size="small"
                                        slotProps={{
                                            select: {
                                                native: true,
                                            },
                                        }}
                                        required
                                            error={!!fieldErrors.vaccination}
                                            helperText={fieldErrors.vaccination}
                                        value={updateReq.vaccination}
                                        onChange={(e) => handleChange("vaccination", e.target.value)}
                                    >
                                        <option value="" >--Select Vaccination--</option>
                                        {vaccinations.map((vaccine) => (
                                        <option value={JSON.stringify(vaccine)}>{vaccine.name}</option>
                                        ))}                                        
                                        </TextField>
                                </Grid>
                            </Grid>
                    :
                    <Grid container spacing={2} direction={"column"}>
                        <Grid item xs={12}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold',textAlign: 'center',display: 'flex',alignItems: 'center',justifyContent: 'center',gap: 1, color:"black"}}>
                            <CheckCircle sx={{ color: 'success.main' }} />
                                Student Vaccine Details Updated Successfully
                            </Typography>
                        </Grid>
                        {/* <Grid item xs={12}>
                            <Typography variant="body1" sx={{ textAlign: 'center' }}>
                                Vaccination: {JSON.stringify(updatedStudent?.vaccinations)}
                            </Typography>
                        </Grid> */}
                    </Grid>
                    }
                </form>
                <Grid container spacing={2} sx={{padding: "5px 20px 20px 20px"}}>
                    <Grid size={updatedStudent ? 12 : 6}>
                        <Button variant='outlined' color='warning' fullWidth
                            onClick={() => {
                                handleClose();
                                setShowModal(false);
                            }}
                        >{updatedStudent ? 'Close' : 'Cancel'}</Button>
                    </Grid>
                    {!updatedStudent && <Grid item xs={6}>
                        <Button variant='contained' color='success' fullWidth onClick={handleSubmit}>Update</Button>
                    </Grid>}
                </Grid>
            </Paper>
        </Modal>
    );
}
export default UpdateStudentModal;