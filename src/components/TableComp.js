import React, { forwardRef, useImperativeHandle, useState, useMemo } from "react";
import {
  IconButton, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TablePagination, TableRow, TextField
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

const TableComp = forwardRef(({
  title,
  columns,
  rows,
  actions,
  pagination = false,
  totalCount = 35,
  page = 0,
  rowsPerPage = 10,
  onPageChange = () => { },
  onRowsPerPageChange = () => { }
}, ref) => {
  const [filters, setFilters] = useState({});
  const [activeFilter, setActiveFilter] = useState(null);

  const handleFilterChange = (columnId, value) => {
    setFilters((prev) => ({
      ...prev,
      [columnId]: value
    }));
  };

  const handleFilterBlur = () => {
    setActiveFilter(null);
  };

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      return columns.every((column) => {
        if (column.id === "action") return true;
        const filterValue = filters[column.id];
        if (!filterValue) return true;
        const cellValue = row[column.id];
        if (cellValue === undefined || cellValue === null) return false;
        return String(cellValue).toLowerCase().includes(filterValue.toLowerCase());
      });
    });
  }, [rows, filters, columns]);

  useImperativeHandle(ref, () => ({
    getFilteredData: () => filteredRows
  }));

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align="center"
                  sx={{ fontWeight: "bold", backgroundColor: "#1f1f29", color: "white", whiteSpace: "nowrap" }}
                >
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {activeFilter === column.id ? (
                      <TextField
                        autoFocus
                        variant="standard"
                        value={filters[column.id] || ''}
                        onChange={(e) => handleFilterChange(column.id, e.target.value)}
                        placeholder={`Filter ${column.label}`}
                        InputProps={{
                          style: { color: 'white', textAlign: 'center' }
                        }}
                        sx={{
                          width: '100%',
                          '& .MuiInput-underline:before': { borderBottomColor: 'white' },
                          '& .MuiInput-underline:hover:before': { borderBottomColor: 'white' },
                          '& .MuiInput-underline:after': { borderBottomColor: 'white' },
                        }}
                        onBlur={handleFilterBlur}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === 'Escape') {
                            handleFilterBlur();
                          }
                        }}
                      />
                    ) : (
                      <>
                        <span style={{ userSelect: 'none' }}>{column.label}</span>
                        {column.id !== 'action' && (
                          <IconButton
                            onClick={() => setActiveFilter(column.id)}
                            sx={{ color: 'white', marginLeft: 1, padding: '4px' }}
                            size="small"
                            aria-label={`Filter ${column.label}`}
                          >
                            <FilterListIcon fontSize="small" />
                          </IconButton>
                        )}
                      </>
                    )}
                  </div>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRows.map((row) => (
              <TableRow hover tabIndex={-1} key={row._id || row.id}>
                {columns.map((column) => {
                  const value = row[column.id];
                  return column.id === "action" ? (
                    <TableCell key={column.id + '-action'} align={column.align}>
                      {actions?.map((action, index) => (
                        <IconButton
                          key={'action' + index}
                          sx={{ color: action.color }}
                          disabled={row?.active === false}
                          onClick={() => action.onClick(row)}
                        >
                          {action.icon}
                        </IconButton>
                      ))}
                    </TableCell>
                  ) : (
                    <TableCell key={column.id + '-' + (row._id || row.id)} align={column.align}>
                      {column.format && (typeof value === 'boolean' || typeof value === 'object' || column?.type === 'date')
                        ? column.format(value)
                        : value || column?.default || "Not Available"}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {pagination && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={totalCount || filteredRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
          />
        )}
      </TableContainer>
    </Paper>
  );
});

export default TableComp;
