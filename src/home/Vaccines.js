import React from 'react';
import "./Vaccines.css";
import {Grid, Paper, Typography, Button} from '@mui/material';
import {EditDocument as EditIcon, AddBox as AddIcon} from '@mui/icons-material';
import TableComp from '../components/TableComp';
import { _get } from '../api/client';
import { formatClass, formatDate } from '../utils/common';
import AddVaccineModal from '../components/AddVaccineModal';
import UpdateVaccineModal from '../components/UpdateVaccineModal';

const Vaccines = ({}) => {
    const [vaccines, setVaccines] = React.useState([]);
    const [showAddModal, setShowAddModal] = React.useState(false);
    const [updateModal, setUpdateModal] = React.useState({show: false, vaccine: null});
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(50);
    const [totalVaccines, setTotalVaccines] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    
    
    const getVaccines = async (pageNum = page, rowsCount = rowsPerPage) => {
        const offset = pageNum * rowsCount;

        await _get("/drive", {
            params: {
                    limit: rowsCount,
                    offset: offset
                }
        })
            .then((res) => {
                if (res.status !== 200) {
                    throw new Error("Failed to fetch data");
                }
                const resp = res.data;
                console.log(resp)
                if (resp) {
                    if (resp.totalCount !== undefined) {
                        setTotalVaccines(resp.totalCount);
                    }
                    setVaccines(resp);
                }
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }
    React.useEffect(() => {
        getVaccines();
    }, []);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        getVaccines(newPage, rowsPerPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0);
        getVaccines(0, newRowsPerPage);
    };
    return (
        <>
        <Paper sx={{ padding: 2 }}>
            <Typography className="page-title" sx={{ fontWeight: "bold" }}>
                Vaccination Drive List
            </Typography>
            <Grid container direction="row" spacing={1} sx={{ marginBottom: 2, alignItems: "baseline" }}>
                <Typography className="vaccine-count"  sx={{ fontWeight: "bold", color: "gray" }}>
                    Total Drives: {totalVaccines || vaccines.length}
                </Typography>
                <Button 
                    variant="contained"
                    size="small"
                    color="success"
                    startIcon={<AddIcon />}
                    sx={{ marginLeft: "auto" }}
                    onClick={() => {
                        setShowAddModal(true);
                    }}
                >Add Vaccination Drive</Button>
            </Grid>
            <Grid container spacing={2} sx={{ marginBottom: 2 }}>
                <TableComp
                    title="Vaccination Drives"
                    columns={[
                        { id: "name", label: "Name", align: "center" },
                        { id: "vaccine", label: "Vaccine", align: "center" },
                        { id: "classes", label: "Classes", align: "center", format: (value) => formatClass(value) },
                        { id: "scheduled_date", type: "date", label: "Scheduled Date", align: "center", format: (value) => formatDate(value) },
                        { id: "available_doses", label: "Available Doses", align: "center" },
                        { id: "action", label: "Action", align: "center" }]}
                    rows={vaccines}
                    actions={[
                        {
                            name: "Edit",
                            color: "rgb(40, 40, 206)",
                            icon: <EditIcon fontSize="small"/>,
                            onClick: (row) => {
                                console.log("Edit", row);
                                setUpdateModal({show: true, vaccine: row});
                            },
                        }
                    ]}
                    pagination={true}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    totalCount={totalVaccines}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Grid>
        </Paper>
        {showAddModal && <AddVaccineModal
            open={showAddModal}
            handleClose={() => {
                setShowAddModal(false);
            }}
            refreshVaccines={getVaccines}
        />}
        {updateModal.show && <UpdateVaccineModal
            updateData={updateModal}
            handleClose={() => {
                setUpdateModal({show: false, vaccine: null});
            }}
            refreshVaccines={getVaccines}
        />}
        </>
    );
}
export default Vaccines;