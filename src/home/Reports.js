import React from "react";
import "./Students.css";
import TableComp from "../components/TableComp";
import {
  Button, Grid, IconButton, Paper, Typography, CircularProgress
} from "@mui/material";
import { _get } from "../api/client";
import * as XLSX from "xlsx";
import DownloadIcon from "@mui/icons-material/Download";

const Reports = () => {
  const [students, setStudents] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);
  const [totalStudents, setTotalStudents] = React.useState(0);

  const tableRef = React.useRef();

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

  const handleDownloadReport = () => {
    const filteredData = tableRef.current?.getFilteredData() || [];

    if (!filteredData.length) {
      alert("No data to download.");
      return;
    }

    const cleanData = filteredData.map(({ vaccines, vaccinated, ...rest }) => ({
      ...rest,
      vaccines: Array.isArray(vaccines)
        ? vaccines.map(v => v.vaccine).join(", ")
        : vaccines,
      vaccinated
    }));

    const worksheet = XLSX.utils.json_to_sheet(cleanData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");

    XLSX.writeFile(workbook, "Filtered_Students_Report.xlsx");
  };

  React.useEffect(() => {
    getStudents();
  }, []);

  return (
    <Paper sx={{ padding: 2 }}>
      <Typography className="page-title" sx={{ fontWeight: "bold" }}>
        Students List
      </Typography>

      <Grid container direction="row" justifyContent="space-between" alignItems="center" sx={{ marginBottom: 2 }}>
        <Typography className="student-count" sx={{ fontWeight: "bold", color: "gray" }}>
          Total Students: {totalStudents || students.length}
        </Typography>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleDownloadReport}
          sx={{ backgroundColor: "#1976d2", color: "white" }}
        >
          Generate Report
        </Button>
      </Grid>

      <Grid container spacing={2}>
        {loading ? (
          <Grid container justifyContent="center" sx={{ padding: 4 }}>
            <CircularProgress />
          </Grid>
        ) : (
          <TableComp
            ref={tableRef}
            title="Students"
            columns={[
              { id: "roll_number", label: "Roll Number", align: "center" },
              { id: "name", label: "Name", align: "center" },
              { id: "age", label: "Age", align: "center" },
              { id: "class", label: "Class", align: "center" },
              { id: "gender", label: "Gender", align: "center" },
                {
                    id: "vaccines",
                    label: "Vaccines",
                    align: "center",
                    format: (value) => {
                    if (!value || value === "Not Vaccinated") return "Not Vaccinated";
                    return value.split(", ").map(v => <div key={v}>{v}</div>);
                    }
                },           
                { id: "vaccinated", label: "Vaccinated", align: "center" },
            ]}
            rows={students.map(student => ({
            ...student,
            vaccines: student.vaccines?.map(v => v.vaccine).join(", ") || "Not Vaccinated",
            vaccinated: student.vaccinated ? "Yes" : "No"
            }))}
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
  );
};

export default Reports;
