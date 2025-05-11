import React from "react";
import "./Students.css";
import TableComp from "../components/TableComp";
import {EditDocument as EditIcon, AddBox as AddIcon, DriveFolderUpload as UploadIcon} from '@mui/icons-material';
import { Button, Grid, IconButton, Paper, Typography, CircularProgress } from "@mui/material";
import AddStudentModal from "../components/AddStudentModal";
import UploadStudentModal from "../components/UploadStudentModal";
import { _get } from "../api/client";
import UpdateStudentModal from "../components/UpdateStudentModal";

const Students = ({}) => {
    const [students, setStudents] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [showAddModal, setShowAddModal] = React.useState(false);
    const [showUploadModal, setShowUploadModal] = React.useState(false);
    const [updateModal, setUpdateModal] = React.useState({show: false, studentId: null, class: 0});
    
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(50);
    const [totalStudents, setTotalStudents] = React.useState(0);

    const getStudents = async (pageNum = page, rowsCount = rowsPerPage) => {
        setLoading(true);
        try {
            const offset = pageNum * rowsCount;
            
            const res = await _get("/students", {
                params: {
                    limit: rowsCount,
                    offset: offset
                }
            });
            
            if (res.status !== 200) {
                throw new Error("Failed to fetch data");
            }
            
            const resp = res.data;
            console.log("Students data:", resp);
            if (resp) {
                setStudents(resp || []);
                if (resp.totalCount !== undefined) {
                    setTotalStudents(resp.totalCount);
                }
            }
        } catch (err) {
            console.error("Error fetching students:", err);
        } finally {
            setLoading(false);
        }
    };
    
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        getStudents(newPage, rowsPerPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);  
        getStudents(0, newRowsPerPage);
    };
    
    React.useEffect(() => {
        getStudents();
    }, []);

    return (
        <>
        <Paper sx={{ padding: 2 }}>
            <Typography className="page-title" sx={{ fontWeight: "bold" }}>
                Students List
            </Typography>
            <Grid container direction="row" spacing={1} sx={{ marginBottom: 2, alignItems: "baseline" }}>
                <Typography className="student-count" sx={{ fontWeight: "bold", color: "gray" }}>
                    Total Students: {totalStudents || students.length}
                </Typography>
                <Button
                    variant="contained"
                    size="small"
                    color="warning"
                    startIcon={<UploadIcon />}
                    sx={{ marginLeft: "auto" }}
                    onClick={() => {
                        setShowUploadModal(true);
                    }}
                >Bulk Upload</Button>
                <Button 
                    variant="contained"
                    size="small"
                    color="success"
                    startIcon={<AddIcon />}
                    onClick={() => {
                        setShowAddModal(true);
                    }}
                >Add Student</Button>
            </Grid>
            <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                {loading ? (
                    <Grid container justifyContent="center" sx={{ padding: 4 }}>
                        <CircularProgress />
                    </Grid>
                ) : (
                    <TableComp
                        title="Students"
                        columns={[
                            { id: "roll_number", label: "Roll Number", align: "center" },
                            { id: "name", label: "Name", align: "center" },
                            { id: "age", label: "Age", align: "center" },
                            { id: "class", label: "Class", align: "center" },
                            { id: "gender", label: "Gender", align: "center" },
                            { id: "vaccinated", label: "Vaccinated", align: "center" },
                            { id: "action", label: "Action", align: "center" }
                        ]}
                        rows={students.map(student => ({
                            ...student,
                            vaccinated: student.vaccinated ? "Yes" : "No"
                        }))}
                        actions={[
                            {
                                name: "Edit",
                                color: "rgb(40, 40, 206)",
                                icon: <EditIcon fontSize="small"/>,
                                onClick: (row) => {
                                    console.log("Edit", row);
                                    setUpdateModal({show: true, studentId: row.roll_number});
                                },
                            }
                        ]}
                        
                        pagination={true}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        totalCount={totalStudents}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                )}
            </Grid>
        </Paper>

        {showAddModal && <AddStudentModal
            open={showAddModal}
            handleClose={() => {
                setShowAddModal(false);
            }}
            refreshStudents={getStudents}
        />}
        
        {updateModal.show && <UpdateStudentModal
            updateData={updateModal}
            handleClose={() => {
                setUpdateModal({show: false, studentId: null, class: 0});
            }}
            refreshStudents={getStudents}
        />}
        {showUploadModal && <UploadStudentModal
            open={showUploadModal}
            handleClose={() => {
                setShowUploadModal(false);
            }}
            refreshStudents={getStudents}
        />}
        </>     
    )
}
export default Students;