import React from "react";
import {Box, Button, Grid, Modal,Paper, Typography} from "@mui/material"
import { Close } from "@mui/icons-material";
import Dropzone from "react-dropzone";
import "./Modal.css"
import { _post } from "../api/client";


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // width: 400,
    boxShadow: 24,
    borderRadius: 2,
};

const UploadStudentModal = ({ open, handleClose, refreshStudents }) => {
    const [showModal, setShowModal] = React.useState(open);
    const [uploadedFile, setUploadedFile] = React.useState(null);
    const [isFileUploaded, setIsFileUploaded] = React.useState(false);

    const handleUploadedExcel = (file) => {
        setUploadedFile({file: file[0], name: file[0].name, size: (file[0].size/1000)+'kb', numberOfRecords: getNumberOfRecords(file[0])});
    }
    const getNumberOfRecords = (file) => {
        const reader = new FileReader();
        return new Promise((resolve) => {
            reader.onload = (event) => {
                const text = event.target.result;
                const lines = text.split('\n');
                const numberOfRecords = lines.length - 1;
                resolve(numberOfRecords);
            };
            reader.readAsText(file);
        });
    }
    const handleSubmit = () => {
        bulkUpload()
    }
    const bulkUpload = async () => {
        console.log("bulkUpload", uploadedFile);
        const formData = new FormData();
        formData.append('file', uploadedFile.file);
        await _post("/bulk_import", formData, {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        })
        .then((res) => {
            if (res.status !== 200) {
                throw new Error("Failed to fetch data");
            }
            const resp = res.data;
            if (resp) {
                refreshStudents();
                setIsFileUploaded(true);
                setUploadedFile(null);
            }
        })
        .catch((err) => {
            console.log(err);
        });
    }
    return (
        <Modal
            open={showModal}
            onClose={() => {
                setShowModal(false);
                handleClose();
            }}
        >
            <Paper sx={style}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 2, borderRadius: "8px 8px 0px 0px",
                    color: 'white', backgroundColor: '#000000', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: 16 }}>
                        Bulk Upload Students
                    </Typography>
                    <Typography variant="body2" onClick={() => {
                        setShowModal(false);
                        handleClose();
                    }} style={{ cursor: 'pointer' }}>
                        <Close />
                    </Typography>

                </Box>
                <Grid style={{ padding: 20 }}>
                    {!uploadedFile && !isFileUploaded && <Dropzone onDrop={acceptedFiles => handleUploadedExcel(acceptedFiles)}
                        accept={{
                            'text/csv': ['.csv'],
                        }}
                        maxFiles="1"
                    >
                        {({getRootProps, getInputProps}) => (
                            <Grid container sx={{width: "40vw", height: "30vh", backgroundColor: "#f1f1f1", cursor: "pointer", border: "2px dashed #7a7a7a"}}>
                                <div {...getRootProps()} style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                                    <input {...getInputProps()}/>
                                    <p>Drag 'n' drop a CSV file here, or click to select a file</p>
                                </div>
                            </Grid>
                        )}
                    </Dropzone>}
                    {uploadedFile && <Grid container sx={{width: "40vw", height: "30vh"}} spacing={2} alignItems="center" justifyContent="center">
                        <Grid container direction={"column"} spacing={2} alignItems="end" justifyContent="center">
                            <Typography variant="body2" sx={{fontWeight: "bold", color: "#254a73"}}>File Name:</Typography>
                            <Typography variant="body2" sx={{fontWeight: "bold", color: "#254a73"}}>File Size:</Typography>
                            <Typography variant="body2" sx={{fontWeight: "bold", color: "#254a73"}}>Number of Records:</Typography>
                        </Grid>
                        <Grid container direction={"column"} spacing={2} alignItems="start" justifyContent="center">
                            <Typography variant="subtitle" sx={{fontWeight: "bold", color: "#254a73"}}>{uploadedFile.name}</Typography>
                            <Typography variant="subtitle" sx={{fontWeight: "bold", color: "#254a73"}}>{uploadedFile.size}</Typography>
                            <Typography variant="subtitle" sx={{fontWeight: "bold", color: "#254a73"}}>{uploadedFile.numberOfRecords}</Typography>
                        </Grid>
                    </Grid>}

                    {isFileUploaded && <Grid size={12} padding={2}>
                        <Typography variant="body2" sx={{fontWeight: "bold", color: "#254a73", textAlign: "center"}} fullWidth>
                            File Uploaded Successfully!
                        </Typography>
                    </Grid>}
                </Grid>
                <Grid container spacing={2} sx={{padding: "5px 20px 20px 20px"}}>
                    <Grid size={isFileUploaded ? 12 : 6}>
                        <Button variant='outlined' color='warning' fullWidth
                            onClick={() => {
                                setShowModal(false);
                                handleClose();
                            }}
                        >Close</Button>
                    </Grid>
                    {!isFileUploaded && <Grid size={6}>
                        <Button variant='contained' color='success' fullWidth onClick={handleSubmit}>Upload</Button>
                    </Grid>}
                </Grid>
            </Paper>
        </Modal>
    )
}

export default UploadStudentModal;