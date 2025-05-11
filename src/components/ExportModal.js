import { Close } from "@mui/icons-material";
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Modal, Paper, Select, Typography } from "@mui/material";
import React from "react";
import { generateReport } from "../utils/generateReport";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: "25%",
    boxShadow: 24,
    borderRadius: 2,
};

const ExportModal = ({open, data, handleClose}) => {
    const [showModal, setShowModal] = React.useState(open);
    const [exportType, setExportType] = React.useState("");

    const onClickDownload = () => {
        generateReport(data, exportType);
        handleClose();
        setShowModal(false);
    }

    return (<Modal
        open={showModal}
        onClose={() => {
            handleClose();
            setShowModal(false);
        }}
        className='export-modal'
    >
        <Paper className='export-modal-box' sx={style}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: 2, borderRadius: "8px 8px 0px 0px",
                color: 'white', backgroundColor: '#254a73', alignItems: 'center' }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: 16 }}>
                    Export Vaccination Data
                </Typography>
                <Typography variant="body2" onClick={() => {
                    handleClose();
                    setShowModal(false);
                }} style={{ cursor: 'pointer' }}>
                    <Close />
                </Typography>

            </Box>
            <Box sx={{ padding: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
                    Select the format to export
                </Typography>
                <Grid container spacing={2} sx={{ alignItems: "center", justifyContent: "center" }}>
                    <FormControl fullWidth>
                        <InputLabel size='small' id="select-export-type" fullWidth>Export Type</InputLabel>
                        <Select 
                            size='small'
                            labelId="select-export-type"
                            id="export-type"
                            value={exportType}
                            label="Export Type"
                            onChange={(e) => setExportType(e.target.value)} fullWidth
                        >
                            <MenuItem value="" disabled>--Select Export Type--</MenuItem>
                            {[{name: 'csv', label: "CSV"},{name: 'pdf', label: "PDF"},{name: 'excel', label: "Excel"}].map((expType, index) => <MenuItem value={expType.name} id={index}>{expType.label}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <Grid item xs={6}>
                        <Button variant='contained' color='success' fullWidth onClick={() => {
                            onClickDownload();
                        }}>Download</Button>
                    </Grid>
                </Grid>
            </Box>
        </Paper>
    </Modal>)
}

export default ExportModal;