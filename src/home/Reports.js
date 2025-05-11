// import React from "react";
// import "./Reports.css";
// import { Alert, Button, Grid, Paper, Typography, CircularProgress, Box } from "@mui/material";
// import TableComp from "../components/TableComp";
// import { ImportExportOutlined as ExportIcon, SearchOff as NoDataIcon } from "@mui/icons-material";
// import { _get } from "../api/client";
// import ReportsFilter from "../components/ReportsFilter";
// import ExportModal from "../components/ExportModal";

// const Reports = () => {
//     // Data states
//     const [students, setStudents] = React.useState([]);
//     const [filteredStudents, setFilteredStudents] = React.useState([]);
//     const [showExpModal, setShowExpModal] = React.useState(false);
    
//     // Error and loading states
//     const [loading, setLoading] = React.useState(false);
//     const [error, setError] = React.useState(null);
//     const [hasSearched, setHasSearched] = React.useState(false);
    
//     // Pagination states
//     const [page, setPage] = React.useState(0);
//     const [rowsPerPage, setRowsPerPage] = React.useState(10);
    
//     // Handler for page change
//     const handleChangePage = (event, newPage) => {
//         setPage(newPage);
//         paginateData(students, newPage, rowsPerPage);
//     };
    
//     // Handler for rows per page change
//     const handleChangeRowsPerPage = (event) => {
//         const newRowsPerPage = parseInt(event.target.value, 10);
//         setRowsPerPage(newRowsPerPage);
//         setPage(0);
//         paginateData(students, 0, newRowsPerPage);
//     };
    
//     // Apply pagination to data
//     const paginateData = (data, currentPage, pageSize) => {
//         const startIndex = currentPage * pageSize;
//         const endIndex = startIndex + pageSize;
//         const paginatedData = data.slice(startIndex, endIndex);
//         setFilteredStudents(paginatedData);
//     };
    
//     // Get filtered data from API and apply pagination
//     const getFilteredData = async (filters, paginatedData) => {
//         // Reset states
//         setLoading(true);
//         setError(null);
//         setHasSearched(true);
        
//         try {
//             // If we received paginated data directly from the filter component, use it
//             if (paginatedData) {
//                 setFilteredStudents(paginatedData);
//                 setStudents(paginatedData);
//                 return;
//             }
            
//             // Otherwise, fetch data based on filters
//             const filtersObject = filters.reduce((acc, filter) => {
//                 acc[filter.filterType] = filter.filterValue;
//                 return acc;
//             }, {});
            
//             const res = await _get("/students", {params: filtersObject});
            
//             if (res.status !== 200) {
//                 throw new Error("Failed to fetch data");
//             }
            
//             const resp = res.data;
//             if (resp.success === true) {
//                 if (resp.data && resp.data.length > 0) {
//                     // Store the complete dataset
//                     setStudents(resp.data);
                    
//                     // Reset to first page when new data is loaded
//                     setPage(0);
                    
//                     // Apply pagination to the new data
//                     paginateData(resp.data, 0, rowsPerPage);
//                 } else {
//                     // No data found
//                     setStudents([]);
//                     setFilteredStudents([]);
//                     setError("No matching records found for the selected filters.");
//                 }
//             } else {
//                 throw new Error(resp.message || "Error fetching data");
//             }
//         } catch (err) {
//             setStudents([]);
//             setFilteredStudents([]);
//             if (err.response) {
//                 switch (err.response.status) {
//                     case 404:
//                         setError("No data found. Try different filter criteria.");
//                         break;
//                     case 400:
//                         setError("Invalid request. Please check your filter selections.");
//                         break;
//                     case 401:
//                     case 403:
//                         setError("You don't have permission to access this data.");
//                         break;
//                     case 500:
//                         setError("Server error. Please try again later.");
//                         break;
//                     default:
//                         setError("Error fetching data. Please try again.");
//                 }
//             } else {
//                 setError("Network error. Please check your connection and try again.");
//             }
//         } finally {
//             setLoading(false);
//         }
//     };
    
//     const onClickExport = () => {
//         setShowExpModal(true);
//     };
    
//     const handleExpClose = () => {
//         setShowExpModal(false);
//     };
    
//     // Render empty state
//     const renderEmptyState = () => {
//         return (
//             <Box 
//                 sx={{ 
//                     display: 'flex', 
//                     flexDirection: 'column',
//                     alignItems: 'center', 
//                     justifyContent: 'center',
//                     padding: 4,
//                     textAlign: 'center',
//                     backgroundColor: '#f9f9f9',
//                     borderRadius: 1,
//                     marginTop: 2
//                 }}
//             >
//                 <NoDataIcon sx={{ fontSize: 60, color: '#9e9e9e', mb: 2 }} />
//                 <Typography variant="h6" color="textSecondary" gutterBottom>
//                     No Data Found
//                 </Typography>
//                 <Typography variant="body2" color="textSecondary">
//                     {error || "No matching records found. Try adjusting your filter criteria."}
//                 </Typography>
//             </Box>
//         );
//     };
    
//     return (
//         <>
//             <Paper sx={{ padding: 2 }}>
//                 <Typography sx={{ fontWeight: "bold", marginBottom: 2 }}>Reports</Typography>
//                 <ReportsFilter getFilteredData={getFilteredData}/>
                
//                 {loading ? (
//                     <Grid container justifyContent="center" sx={{ p: 4 }}>
//                         <CircularProgress />
//                     </Grid>
//                 ) : (
//                     <>
//                         {error && (
//                             <Alert 
//                                 severity="info" 
//                                 sx={{ mt: 2, mb: 1 }}
//                                 onClose={() => setError(null)}
//                             >
//                                 {error}
//                             </Alert>
//                         )}
                        
//                         {filteredStudents.length > 0 ? (
//                             <>
//                                 <Grid container direction="row" spacing={1} sx={{ margin: 2, alignItems: "baseline" }}>
//                                     <Button
//                                         variant="contained"
//                                         size="small"
//                                         color="warning"
//                                         startIcon={<ExportIcon />}
//                                         sx={{ marginLeft: "auto" }}
//                                         onClick={onClickExport}
//                                     >
//                                         Export
//                                     </Button>
//                                 </Grid>
//                                 <Grid container spacing={2} sx={{ marginBottom: 2 }}>
//                                     <TableComp
//                                         title="Students"
//                                         columns={[
//                                             { id: "_id", label: "ID", align: "center" },
//                                             { id: "name", label: "Name", align: "center" },
//                                             { id: "class", label: "Class", align: "center" },
//                                             { id: "gender", label: "Gender", align: "center" },
//                                             { id: "vaccinations", label: "Vaccinations", align: "center", default: "Not Vaccinated", format: (value) => {
//                                                 return value && value.length > 0 ? value.map((vaccine) => (
//                                                     <div key={vaccine.vaccineName}>
//                                                         {vaccine.vaccineName} - {vaccine.vaccinatedOn}
//                                                     </div>
//                                                 )) : "Not Vaccinated";
//                                             }}
//                                         ]}
//                                         rows={filteredStudents}
//                                         pagination={true}
//                                         page={page}
//                                         rowsPerPage={rowsPerPage}
//                                         totalCount={students.length}
//                                         onPageChange={handleChangePage}
//                                         onRowsPerPageChange={handleChangeRowsPerPage}
//                                     />
//                                 </Grid>
//                             </>
//                         ) : (
//                             // Show empty state only if a search has been performed
//                             hasSearched && renderEmptyState()
//                         )}
//                     </>
//                 )}
//             </Paper>
//             {showExpModal && <ExportModal open={showExpModal} data={students} handleClose={handleExpClose}/>}
//         </>
//     );
// };

// export default Reports;


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
            vaccines: student.vaccines?.map(v => v.vaccine).join(", ") || "Not Vaccinated", // Keep as string for filtering
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
